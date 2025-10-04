import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase';

// Store mock signals in global scope so they persist across requests in development
// This is a workaround for demo mode only
declare global {
  var mockSignalsStore: any[] | undefined;
}

// Initialize mock signals if not already done
if (!global.mockSignalsStore) {
  global.mockSignalsStore = [
    {
      id: 1,
      title: "EURUSD Strong Buy Signal",
      content: "Strong bullish momentum expected after ECB announcement. Technical indicators show oversold conditions.",
      pair: "EURUSD",
      action: "BUY" as const,
      entry: 1.0845,
      stop_loss: 1.0810,
      take_profit: 1.0920,
      current_price: 1.0845,
      confidence: 85,
      market: "FOREX",
      status: "ACTIVE",
      pips: 0,
      priority: "HIGH" as const,
      author: "Expert Trader",
      author_image: null,
      chart_image: null,
      key_levels: { resistance: [1.0920, 1.0950], support: [1.0810, 1.0780] },
      analyst_stats: { successRate: 89, totalSignals: 156, totalPips: 2340 },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_date: new Date().toISOString(),
    },
    {
      id: 2,
      title: "BTCUSD Sell Setup",
      content: "Bitcoin showing signs of weakness at resistance. Expecting pullback to support levels.",
      pair: "BTCUSD",
      action: "SELL" as const,
      entry: 43500,
      stop_loss: 44200,
      take_profit: 42000,
      current_price: 43500,
      confidence: 78,
      market: "CRYPTO",
      status: "ACTIVE",
      pips: 0,
      priority: "MEDIUM" as const,
      author: "Crypto Analyst",
      author_image: null,
      chart_image: null,
      key_levels: { resistance: [44200, 45000], support: [42000, 41000] },
      analyst_stats: { successRate: 82, totalSignals: 234, totalPips: 1890 },
      created_at: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
      updated_at: new Date(Date.now() - 1800000).toISOString(),
      published_date: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 3,
      title: "GBPJPY Long Position",
      content: "Strong momentum breakout above key resistance. Targeting next major level.",
      pair: "GBPJPY",
      action: "BUY" as const,
      entry: 184.50,
      stop_loss: 183.80,
      take_profit: 186.20,
      current_price: 184.50,
      confidence: 92,
      market: "FOREX",
      status: "ACTIVE",
      pips: 0,
      priority: "HIGH" as const,
      author: "Forex Master",
      author_image: null,
      chart_image: null,
      key_levels: { resistance: [186.20, 187.00], support: [183.80, 182.50] },
      analyst_stats: { successRate: 94, totalSignals: 89, totalPips: 3200 },
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      published_date: new Date(Date.now() - 3600000).toISOString(),
    },
    // Add more demo signals to show variety
    {
      id: 4,
      title: "AUDUSD Short Opportunity",
      content: "Australian dollar weakening on poor economic data. Technical breakdown confirmed.",
      pair: "AUDUSD",
      action: "SELL" as const,
      entry: 0.6520,
      stop_loss: 0.6580,
      take_profit: 0.6420,
      current_price: 0.6520,
      confidence: 75,
      market: "FOREX",
      status: "ACTIVE",
      pips: 0,
      priority: "MEDIUM" as const,
      author: "FX Specialist",
      author_image: null,
      chart_image: null,
      key_levels: { resistance: [0.6580, 0.6620], support: [0.6420, 0.6380] },
      analyst_stats: { successRate: 86, totalSignals: 198, totalPips: 2100 },
      created_at: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
      updated_at: new Date(Date.now() - 5400000).toISOString(),
      published_date: new Date(Date.now() - 5400000).toISOString(),
    },
    {
      id: 5,
      title: "GOLD Bullish Breakout",
      content: "Gold breaking above key resistance with strong volume. Safe haven demand increasing.",
      pair: "XAUUSD",
      action: "BUY" as const,
      entry: 2042.50,
      stop_loss: 2028.00,
      take_profit: 2065.00,
      current_price: 2042.50,
      confidence: 88,
      market: "COMMODITIES",
      status: "ACTIVE",
      pips: 0,
      priority: "HIGH" as const,
      author: "Commodities Expert",
      author_image: null,
      chart_image: null,
      key_levels: { resistance: [2065.00, 2080.00], support: [2028.00, 2015.00] },
      analyst_stats: { successRate: 91, totalSignals: 145, totalPips: 3500 },
      created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      updated_at: new Date(Date.now() - 7200000).toISOString(),
      published_date: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 6,
      title: "ETHUSD Support Test",
      content: "Ethereum testing crucial support level. Bounce expected from this area.",
      pair: "ETHUSD",
      action: "BUY" as const,
      entry: 2250.00,
      stop_loss: 2180.00,
      take_profit: 2420.00,
      current_price: 2250.00,
      confidence: 72,
      market: "CRYPTO",
      status: "ACTIVE",
      pips: 0,
      priority: "MEDIUM" as const,
      author: "Crypto Trader",
      author_image: null,
      chart_image: null,
      key_levels: { resistance: [2420.00, 2500.00], support: [2180.00, 2100.00] },
      analyst_stats: { successRate: 79, totalSignals: 312, totalPips: 1650 },
      created_at: new Date(Date.now() - 9000000).toISOString(), // 2.5 hours ago
      updated_at: new Date(Date.now() - 9000000).toISOString(),
      published_date: new Date(Date.now() - 9000000).toISOString(),
    },
    {
      id: 7,
      title: "USDJPY Range Trade",
      content: "USD/JPY trading in tight range. Selling at resistance with tight stop.",
      pair: "USDJPY",
      action: "SELL" as const,
      entry: 149.80,
      stop_loss: 150.20,
      take_profit: 148.50,
      current_price: 149.80,
      confidence: 69,
      market: "FOREX",
      status: "ACTIVE",
      pips: 0,
      priority: "LOW" as const,
      author: "Range Trader",
      author_image: null,
      chart_image: null,
      key_levels: { resistance: [150.20, 150.80], support: [148.50, 147.80] },
      analyst_stats: { successRate: 83, totalSignals: 267, totalPips: 1890 },
      created_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      updated_at: new Date(Date.now() - 10800000).toISOString(),
      published_date: new Date(Date.now() - 10800000).toISOString(),
    }
  ];
}

// Use the global store
const mockSignals = global.mockSignalsStore;

// GET /api/signals - Fetch all signals with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const market = searchParams.get('market');
    const author = searchParams.get('author');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';
    const locale = searchParams.get('locale') || 'en'; // Get locale from query params

    const supabaseAdmin = getSupabaseAdmin();

    // Demo mode: Use mock data if Supabase is not available
    if (!supabaseAdmin) {
      console.log('Using demo mode - Supabase not configured');

      let filteredSignals = [...mockSignals];

      // Apply filters to mock data
      if (status) {
        filteredSignals = filteredSignals.filter(signal => signal.status === status);
      }
      if (market) {
        filteredSignals = filteredSignals.filter(signal => signal.market === market);
      }
      if (author) {
        filteredSignals = filteredSignals.filter(signal => signal.author === author);
      }

      // Apply pagination
      const startIndex = parseInt(offset);
      const endIndex = startIndex + parseInt(limit);
      const paginatedSignals = filteredSignals.slice(startIndex, endIndex);

      return NextResponse.json({
        signals: paginatedSignals,
        total: filteredSignals.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
    }

    // Production mode: Use Supabase
    let query = supabaseAdmin
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

    // Transform data based on locale
    const localizedSignals = data?.map(signal => {
      if (locale === 'ur') {
        return {
          ...signal,
          title: signal.title_ur || signal.title,
          content: signal.content_ur || signal.content,
          author: signal.author_ur || signal.author,
        };
      }
      return signal;
    });

    return NextResponse.json({
      signals: localizedSignals,
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

    const supabaseAdmin = getSupabaseAdmin();

    // Demo mode: Simulate successful creation if Supabase is not available
    if (!supabaseAdmin) {
      console.log('Using demo mode - Simulating signal creation');

      // Create a mock signal response
      const newSignal = {
        id: Math.floor(Math.random() * 10000) + 1000, // Random ID for demo
        title: body.title,
        content: body.content,
        pair: body.pair,
        action: body.action,
        entry: parseFloat(body.entry),
        stop_loss: parseFloat(body.stop_loss),
        take_profit: parseFloat(body.take_profit),
        current_price: body.current_price ? parseFloat(body.current_price) : parseFloat(body.entry),
        confidence: parseInt(body.confidence),
        market: body.market,
        status: body.status || 'ACTIVE',
        pips: 0,
        priority: body.priority || 'MEDIUM',
        author: body.author,
        author_image: body.author_image || null,
        chart_image: body.chart_image || null,
        key_levels: body.key_levels || null,
        analyst_stats: body.analyst_stats || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_date: body.published_date,
      };

      // Add to mock signals array for this session (in memory only)
      mockSignals.unshift(newSignal);

      return NextResponse.json({
        signal: newSignal,
        message: 'Signal created successfully (demo mode)'
      }, { status: 201 });
    }

    // Production mode: Use Supabase
    const { data, error } = await supabaseAdmin
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
