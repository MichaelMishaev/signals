import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase';

/**
 * Phase 0: Urdu Demand Analytics Summary
 *
 * Purpose: Provide aggregated statistics about Urdu interest to help
 * make go/no-go decision for full Urdu translation implementation.
 *
 * Usage: GET /api/analytics/urdu-demand
 * Returns: { totalClicks, last7Days, last30Days, conversionRate }
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    // Demo mode fallback
    if (!supabase) {
      console.log('[Phase 0 - Demo Mode] Returning mock analytics data');
      return NextResponse.json({
        totalClicks: 42,
        last7Days: 12,
        last30Days: 42,
        conversionRate: 8.5,
        estimatedTotalVisitors: 500,
        demandLevel: 'LOW',
        recommendation: 'Monitor for more data',
        demoMode: true
      });
    }

    // Get current date boundaries
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Query total clicks
    const { count: totalClicks, error: totalError } = await supabase
      .from('urdu_interest_tracking')
      .select('*', { count: 'exact', head: true })
      .eq('event', 'urdu_interest_clicked');

    if (totalError) {
      console.error('[Phase 0] Error fetching total clicks:', totalError);
      throw totalError;
    }

    // Query last 7 days
    const { count: last7Days, error: week7Error } = await supabase
      .from('urdu_interest_tracking')
      .select('*', { count: 'exact', head: true })
      .eq('event', 'urdu_interest_clicked')
      .gte('timestamp', sevenDaysAgo.toISOString());

    if (week7Error) {
      console.error('[Phase 0] Error fetching 7-day clicks:', week7Error);
      throw week7Error;
    }

    // Query last 30 days
    const { count: last30Days, error: week30Error } = await supabase
      .from('urdu_interest_tracking')
      .select('*', { count: 'exact', head: true })
      .eq('event', 'urdu_interest_clicked')
      .gte('timestamp', thirtyDaysAgo.toISOString());

    if (week30Error) {
      console.error('[Phase 0] Error fetching 30-day clicks:', week30Error);
      throw week30Error;
    }

    // Calculate conversion rate (estimate)
    // Assumption: 1 click per unique visitor (conservative)
    // Assumption: Track total page views separately for accurate conversion
    // For now, use a rough estimate based on industry average (500 visitors/month for small site)
    const estimatedMonthlyVisitors = 1000; // TODO: Get from actual page view tracking
    const conversionRate = estimatedMonthlyVisitors > 0
      ? ((last30Days || 0) / estimatedMonthlyVisitors) * 100
      : 0;

    // Determine demand level
    let demandLevel: 'HIGH' | 'MODERATE' | 'LOW';
    let recommendation: string;

    if (conversionRate > 30) {
      demandLevel = 'HIGH';
      recommendation = '🟢 Proceed to Phase 1 immediately - strong demand detected';
    } else if (conversionRate > 10) {
      demandLevel = 'MODERATE';
      recommendation = '🟡 Continue monitoring for 3 more months before deciding';
    } else {
      demandLevel = 'LOW';
      recommendation = '🔴 Focus on English-only - insufficient demand for Urdu';
    }

    const response = {
      totalClicks: totalClicks || 0,
      last7Days: last7Days || 0,
      last30Days: last30Days || 0,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      estimatedTotalVisitors: estimatedMonthlyVisitors,
      demandLevel,
      recommendation,
      demoMode: false,
      dataCollectedSince: thirtyDaysAgo.toISOString(),
      lastUpdated: now.toISOString()
    };

    console.log('[Phase 0] Urdu demand analytics:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[Phase 0] Error fetching Urdu demand analytics:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics',
        message: 'Please check Supabase configuration and table setup'
      },
      { status: 500 }
    );
  }
}

// Health check
export async function POST() {
  return NextResponse.json({
    error: 'Method not allowed. Use GET to fetch analytics.'
  }, { status: 405 });
}
