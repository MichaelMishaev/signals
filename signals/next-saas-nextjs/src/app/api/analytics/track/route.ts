import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase';

/**
 * Phase 0: Urdu Interest Tracking Endpoint
 *
 * Purpose: Track user clicks on "View in Urdu?" button to validate demand
 * before investing 243 hours in full Urdu translation implementation.
 *
 * Usage: POST /api/analytics/track
 * Body: { event: string, timestamp: string, page_path?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin();

    // If Supabase is not configured, log locally and return success
    if (!supabase) {
      console.log('[Phase 0 - Demo Mode] Urdu interest tracked:', body);
      return NextResponse.json({
        success: true,
        message: 'Tracked locally (demo mode)'
      });
    }

    // Validate required fields
    if (!body.event || !body.timestamp) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: event, timestamp' },
        { status: 400 }
      );
    }

    // Extract request metadata
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown';

    // Store in Supabase
    const { data, error } = await supabase
      .from('urdu_interest_tracking')
      .insert({
        event: body.event,
        timestamp: body.timestamp,
        user_agent: userAgent,
        ip: ip,
        page_path: body.page_path || req.nextUrl.pathname
      })
      .select();

    if (error) {
      console.error('[Phase 0] Error tracking Urdu interest:', error);

      // Don't fail the request if tracking fails - fail silently
      return NextResponse.json({
        success: true,
        message: 'Request processed (tracking skipped)'
      });
    }

    console.log('[Phase 0] Urdu interest tracked successfully:', data);

    return NextResponse.json({
      success: true,
      message: 'Interest tracked successfully',
      data
    });

  } catch (error) {
    console.error('[Phase 0] Error in analytics tracking:', error);

    // Don't expose internal errors to client
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const supabase = getSupabaseAdmin();

  return NextResponse.json({
    status: 'ok',
    phase: 'Phase 0 - Urdu Demand Validation',
    supabaseConfigured: !!supabase,
    endpoint: '/api/analytics/track',
    methods: ['POST'],
    requiredFields: ['event', 'timestamp'],
    optionalFields: ['page_path']
  });
}
