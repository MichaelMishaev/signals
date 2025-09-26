import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase';

// GET /api/signals - Fetch all signals with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const market = searchParams.get('market');
    const author = searchParams.get('author');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    let query = getSupabaseAdmin()
      .from('signals')
      .select('*')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (market) {
      query = query.eq('market', market);
    }
    if (author) {
      query = query.eq('author', author);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching signals:', error);
      return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 });
    }

    return NextResponse.json({
      signals: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/signals - Create a new signal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'title',
      'content',
      'pair',
      'action',
      'entry',
      'stop_loss',
      'take_profit',
      'confidence',
      'market',
      'author',
      'published_date',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Insert new signal
    const { data, error } = await getSupabaseAdmin()
      .from('signals')
      .insert([
        {
          title: body.title,
          content: body.content,
          pair: body.pair,
          action: body.action,
          entry: parseFloat(body.entry),
          stop_loss: parseFloat(body.stop_loss),
          take_profit: parseFloat(body.take_profit),
          current_price: body.current_price ? parseFloat(body.current_price) : null,
          confidence: parseInt(body.confidence),
          market: body.market,
          status: body.status || 'ACTIVE',
          priority: body.priority || 'MEDIUM',
          author: body.author,
          author_image: body.author_image || null,
          chart_image: body.chart_image || null,
          key_levels: body.key_levels || null,
          analyst_stats: body.analyst_stats || null,
          published_date: body.published_date,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating signal:', error);
      return NextResponse.json({ error: 'Failed to create signal' }, { status: 500 });
    }

    return NextResponse.json({ signal: data, message: 'Signal created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
