import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase';

/**
 * Exness Postback Endpoint (Server-to-Server)
 *
 * Purpose: Receive conversion notifications from Exness when users sign up or deposit
 * Usage: Configure this URL in your Exness Partner account under "Postback URLs"
 *
 * Endpoint: https://yourdomain.com/api/exness-postback
 *
 * Expected Parameters (from Exness):
 * - cid: Click ID (your tracking parameter)
 * - event: Event type (registration, first_deposit, etc.)
 * - user_id: Exness user ID
 * - transaction_id: Unique transaction identifier
 * - amount: Deposit amount (for deposit events)
 * - currency: Currency code (USD, EUR, etc.)
 * - commission: Your commission amount
 * - timestamp: Event timestamp
 *
 * Security: Add IP whitelist or secret token validation in production
 */

// Exness IP ranges for production (add actual Exness IPs)
const EXNESS_IP_WHITELIST = [
  '127.0.0.1', // localhost for testing
  // Add Exness server IPs here for production
];

// Secret token for additional security (set in env)
const POSTBACK_SECRET = process.env.EXNESS_POSTBACK_SECRET || 'dev_secret_token';

export async function POST(req: NextRequest) {
  try {
    // Security: Verify IP (optional but recommended)
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const isWhitelisted = EXNESS_IP_WHITELIST.some((ip) => clientIp.includes(ip));

    if (!isWhitelisted && process.env.NODE_ENV === 'production') {
      console.warn('[Exness Postback] Unauthorized IP:', clientIp);
      // In production, you might want to reject unauthorized IPs
      // return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Parse body (Exness might send as JSON or form data)
    const contentType = req.headers.get('content-type') || '';
    let postbackData: any;

    if (contentType.includes('application/json')) {
      postbackData = await req.json();
    } else {
      // Handle form-encoded data
      const formData = await req.text();
      postbackData = Object.fromEntries(new URLSearchParams(formData));
    }

    console.log('[Exness Postback] Received:', postbackData);

    // Security: Verify secret token if present
    if (postbackData.secret && postbackData.secret !== POSTBACK_SECRET) {
      console.warn('[Exness Postback] Invalid secret token');
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // Validate required fields
    if (!postbackData.cid || !postbackData.event) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: cid, event',
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Prepare conversion data
    const conversionData = {
      click_id: postbackData.cid,
      exness_user_id: postbackData.user_id || null,
      exness_transaction_id: postbackData.transaction_id || `${postbackData.cid}_${Date.now()}`,

      conversion_type: postbackData.event,
      conversion_value: postbackData.amount ? parseFloat(postbackData.amount) : null,
      currency: postbackData.currency || 'USD',

      commission_amount: postbackData.commission ? parseFloat(postbackData.commission) : null,
      commission_status: 'pending',

      converted_at: postbackData.timestamp
        ? new Date(postbackData.timestamp).toISOString()
        : new Date().toISOString(),
      received_at: new Date().toISOString(),

      raw_postback: postbackData,

      is_verified: true,
      verified_at: new Date().toISOString(),
    };

    // If Supabase is not configured, log locally
    if (!supabase) {
      console.log('[Exness Postback - Demo Mode] Conversion received:', conversionData);
      return NextResponse.json({
        success: true,
        message: 'Conversion logged (demo mode)',
        data: conversionData,
      });
    }

    // Check if conversion already exists (prevent duplicates)
    const { data: existing } = await supabase
      .from('affiliate_conversions')
      .select('id')
      .eq('exness_transaction_id', conversionData.exness_transaction_id)
      .single();

    if (existing) {
      console.log('[Exness Postback] Duplicate conversion ignored:', conversionData.exness_transaction_id);
      return NextResponse.json({
        success: true,
        message: 'Conversion already recorded',
        duplicate: true,
      });
    }

    // Store conversion in database
    const { data, error } = await supabase
      .from('affiliate_conversions')
      .insert(conversionData)
      .select();

    if (error) {
      console.error('[Exness Postback] Database error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to store conversion',
        },
        { status: 500 }
      );
    }

    console.log('[Exness Postback] Conversion stored successfully:', {
      clickId: postbackData.cid,
      event: postbackData.event,
      amount: postbackData.amount,
    });

    // Optional: Send notification (email, Slack, etc.)
    if (conversionData.conversion_type === 'registration') {
      await sendConversionNotification(conversionData);
    }

    return NextResponse.json({
      success: true,
      message: 'Conversion tracked successfully',
      data: data?.[0] || null,
    });
  } catch (error) {
    console.error('[Exness Postback] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint - Test postback configuration
 */
export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();

  // Get conversion stats
  let stats = {};
  if (supabase) {
    const { count } = await supabase
      .from('affiliate_conversions')
      .select('*', { count: 'exact', head: true });

    const { data: recentConversions } = await supabase
      .from('affiliate_conversions')
      .select('conversion_type, conversion_value, converted_at')
      .order('converted_at', { ascending: false })
      .limit(5);

    stats = {
      totalConversions: count || 0,
      recentConversions: recentConversions || [],
    };
  }

  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/exness-postback',
    description: 'Exness S2S postback receiver',
    supabaseConfigured: !!supabase,
    methods: ['POST', 'GET'],
    ...stats,
    instructions: {
      configureInExness: 'Add this URL to your Exness Partner account postback settings',
      format: 'https://yourdomain.com/api/exness-postback',
      requiredParams: ['cid', 'event'],
      optionalParams: ['user_id', 'transaction_id', 'amount', 'commission', 'currency', 'timestamp'],
      security: 'Add secret token parameter for additional security',
    },
  });
}

/**
 * Helper: Send conversion notification
 */
async function sendConversionNotification(conversion: any): Promise<void> {
  try {
    // TODO: Implement notification logic
    // Examples:
    // - Send email to admin
    // - Post to Slack channel
    // - Trigger webhook

    console.log('[Exness Postback] Conversion notification:', {
      type: conversion.conversion_type,
      clickId: conversion.click_id,
      amount: conversion.conversion_value,
    });

    // Example: Send to Slack (uncomment and configure)
    /*
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🎉 New conversion! Type: ${conversion.conversion_type}, Amount: ${conversion.conversion_value} ${conversion.currency}`,
      }),
    });
    */
  } catch (error) {
    console.error('[Exness Postback] Notification error:', error);
  }
}
