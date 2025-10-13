import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase';

/**
 * Affiliate Click Tracking Endpoint
 *
 * Purpose: Track every click on Exness affiliate links
 * Usage: POST /api/track-affiliate-click
 *
 * Body:
 * {
 *   clickId: string,
 *   signalId?: number | string,
 *   source: string,
 *   buttonVariant?: string,
 *   utmParams?: {...},
 *   metadata?: {...}
 * }
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin();

    // Validate required fields
    if (!body.clickId || !body.source) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: clickId, source',
        },
        { status: 400 }
      );
    }

    // Extract request metadata
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const referrer = req.headers.get('referer') || '';

    // Prepare click data
    const clickData = {
      click_id: body.clickId,
      signal_id: body.signalId ? parseInt(body.signalId.toString(), 10) : null,
      source: body.source,
      button_variant: body.buttonVariant || null,

      // UTM parameters
      utm_source: body.utmParams?.source || null,
      utm_medium: body.utmParams?.medium || null,
      utm_campaign: body.utmParams?.campaign || null,
      utm_content: body.utmParams?.content || null,
      utm_term: body.utmParams?.term || null,

      // User context
      user_agent: userAgent,
      ip_address: ip,
      referrer: referrer,
      page_path: body.metadata?.pagePath || req.nextUrl.pathname,
      locale: body.metadata?.locale || 'en',

      // Session
      session_id: body.metadata?.sessionId || null,

      // Timestamp
      clicked_at: new Date().toISOString(),

      // Additional metadata
      metadata: {
        ...body.metadata,
        tracked_at: new Date().toISOString(),
      },
    };

    // If Supabase is not configured, log locally
    if (!supabase) {
      console.log('[Affiliate Tracking - Demo Mode] Click tracked:', clickData);
      return NextResponse.json({
        success: true,
        message: 'Tracked locally (demo mode)',
        clickId: body.clickId,
      });
    }

    // Store in database
    const { data, error } = await supabase
      .from('affiliate_clicks')
      .insert(clickData)
      .select();

    if (error) {
      console.error('[Affiliate Tracking] Database error:', error);

      // Don't fail the request - fail silently for user experience
      return NextResponse.json({
        success: true,
        message: 'Request processed (tracking skipped)',
        clickId: body.clickId,
      });
    }

    console.log('[Affiliate Tracking] Click tracked successfully:', {
      clickId: body.clickId,
      source: body.source,
      signalId: body.signalId,
    });

    return NextResponse.json({
      success: true,
      message: 'Click tracked successfully',
      clickId: body.clickId,
      data: data?.[0] || null,
    });
  } catch (error) {
    console.error('[Affiliate Tracking] Error:', error);

    // Don't expose internal errors
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track click',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint - Health check and statistics
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    // Basic stats if Supabase is configured
    if (supabase) {
      const { count, error } = await supabase
        .from('affiliate_clicks')
        .select('*', { count: 'exact', head: true });

      if (!error) {
        return NextResponse.json({
          status: 'ok',
          endpoint: '/api/track-affiliate-click',
          supabaseConfigured: true,
          totalClicks: count || 0,
          methods: ['POST', 'GET'],
        });
      }
    }

    return NextResponse.json({
      status: 'ok',
      endpoint: '/api/track-affiliate-click',
      supabaseConfigured: !!supabase,
      methods: ['POST', 'GET'],
    });
  } catch (error) {
    console.error('[Affiliate Tracking] Health check error:', error);
    return NextResponse.json({
      status: 'error',
      endpoint: '/api/track-affiliate-click',
    });
  }
}
