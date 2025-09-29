import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const signalId = searchParams.get('signal_id');

    const supabase = getSupabaseClient();

    let query = supabase
      .from('drills')
      .select(`
        *,
        signals:signal_id (
          id,
          pair,
          title,
          action,
          status
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (signalId) {
      query = query.eq('signal_id', parseInt(signalId));
    }

    if (limit > 0) {
      query = query.limit(limit);
    }

    const { data: drills, error } = await query;

    if (error) {
      console.error('Error fetching drills:', error);

      // If drills table doesn't exist, generate drills from signals with drill data
      const { data: signals, error: signalsError } = await supabase
        .from('signals')
        .select('*')
        .not('key_levels', 'is', null)
        .not('analyst_stats', 'is', null)
        .not('current_price', 'is', null)
        .limit(limit > 0 ? Math.ceil(limit / 2) : 25);

      if (signalsError) {
        return NextResponse.json({ error: 'Failed to fetch drill data' }, { status: 500 });
      }

      // Generate drills from signals
      const generatedDrills = signals?.flatMap(signal => [
        {
          id: signal.id * 10 + 1,
          signal_id: signal.id,
          title: `${signal.pair} Technical Analysis Deep Dive`,
          description: `Complete breakdown of the technical factors driving this ${signal.action} signal`,
          type: 'CASE_STUDY',
          content: `Technical analysis for ${signal.pair}: ${signal.content}`,
          order_index: 1,
          is_active: true,
          image_url: `/images/drills/${signal.pair.toLowerCase().replace('/', '')}-case-study.jpg`,
          created_at: signal.created_at,
          signals: {
            id: signal.id,
            pair: signal.pair,
            title: signal.title,
            action: signal.action,
            status: signal.status
          }
        },
        {
          id: signal.id * 10 + 2,
          signal_id: signal.id,
          title: 'Real-Time Analytics Dashboard',
          description: `Live performance metrics and analytics for ${signal.pair}`,
          type: 'ANALYTICS',
          content: `Interactive dashboard showing real-time performance data for ${signal.pair}`,
          order_index: 2,
          is_active: true,
          image_url: '/images/drills/analytics-dashboard.jpg',
          created_at: signal.created_at,
          signals: {
            id: signal.id,
            pair: signal.pair,
            title: signal.title,
            action: signal.action,
            status: signal.status
          }
        }
      ]) || [];

      return NextResponse.json({
        drills: generatedDrills,
        total: generatedDrills.length,
        source: 'generated_from_signals'
      });
    }

    return NextResponse.json({
      drills,
      total: drills?.length || 0,
      source: 'database'
    });

  } catch (error) {
    console.error('Drills API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabaseClient();

    const { data: drill, error } = await supabase
      .from('drills')
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ drill });
  } catch (error) {
    console.error('Create drill error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}