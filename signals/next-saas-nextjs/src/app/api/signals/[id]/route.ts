import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase';

// GET /api/signals/[id] - Fetch a specific signal
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const signalId = parseInt(resolvedParams.id);

    if (isNaN(signalId)) {
      return NextResponse.json({ error: 'Invalid signal ID' }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin().from('signals').select('*').eq('id', signalId).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
      }
      console.error('Error fetching signal:', error);
      return NextResponse.json({ error: 'Failed to fetch signal' }, { status: 500 });
    }

    // Log analytics for signal view (disabled for now due to missing table)
    // await getSupabaseAdmin().from('signal_analytics').insert([
    //   {
    //     signal_id: signalId,
    //     user_interactions: { view: 1, timestamp: new Date().toISOString() },
    //   },
    // ]);

    return NextResponse.json({ signal: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/signals/[id] - Update a specific signal
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const signalId = parseInt(resolvedParams.id);
    const body = await request.json();

    if (isNaN(signalId)) {
      return NextResponse.json({ error: 'Invalid signal ID' }, { status: 400 });
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.current_price !== undefined) {
      updateData.current_price = body.current_price ? parseFloat(body.current_price) : null;
    }
    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.chart_image !== undefined) updateData.chart_image = body.chart_image;
    if (body.key_levels !== undefined) updateData.key_levels = body.key_levels;
    if (body.analyst_stats !== undefined) updateData.analyst_stats = body.analyst_stats;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await getSupabaseAdmin().from('signals').update(updateData as any).eq('id', signalId).select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
      }
      console.error('Error updating signal:', error);
      return NextResponse.json({ error: 'Failed to update signal' }, { status: 500 });
    }

    return NextResponse.json({ signal: data, message: 'Signal updated successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/signals/[id] - Delete a specific signal
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const signalId = parseInt(resolvedParams.id);

    if (isNaN(signalId)) {
      return NextResponse.json({ error: 'Invalid signal ID' }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin().from('signals').delete().eq('id', signalId);

    if (error) {
      console.error('Error deleting signal:', error);
      return NextResponse.json({ error: 'Failed to delete signal' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Signal deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
