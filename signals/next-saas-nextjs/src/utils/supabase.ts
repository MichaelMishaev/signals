import { createClient } from '@supabase/supabase-js';

// Lazy initialization of Supabase clients
let supabaseClient: ReturnType<typeof createClient> | null = null;
let supabaseAdminClient: ReturnType<typeof createClient> | null = null;

function initSupabaseClients() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }

  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  return {
    client: createClient(supabaseUrl, supabaseAnonKey),
    adminClient: createClient(supabaseUrl, supabaseServiceKey)
  };
}

export function getSupabase(): ReturnType<typeof createClient> {
  if (!supabaseClient) {
    const { client } = initSupabaseClients();
    supabaseClient = client;
  }
  return supabaseClient;
}

export function getSupabaseAdmin(): ReturnType<typeof createClient> {
  if (!supabaseAdminClient) {
    const { adminClient } = initSupabaseClients();
    supabaseAdminClient = adminClient;
  }
  return supabaseAdminClient;
}

// For backward compatibility
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    return getSupabase()[prop as keyof ReturnType<typeof createClient>];
  }
});

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    return getSupabaseAdmin()[prop as keyof ReturnType<typeof createClient>];
  }
});

// Type definitions for our database
export interface SignalData {
  id: number;
  title: string;
  content: string;
  pair: string;
  action: 'BUY' | 'SELL';
  entry: number;
  stop_loss: number;
  take_profit: number;
  current_price: number | null;
  confidence: number;
  market: string;
  status: string;
  pips: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  author: string;
  author_image: string | null;
  chart_image: string | null;
  key_levels: {
    resistance: number[];
    support: number[];
  } | null;
  analyst_stats: {
    successRate: number;
    totalSignals: number;
    totalPips: number;
  } | null;
  created_at: string;
  updated_at: string;
  published_date: string;
}

export interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'analyst' | 'user';
  subscription: 'free' | 'premium' | 'vip';
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  id: number;
  signal_id: number;
  timestamp: string;
  price_data: Record<string, unknown>;
  performance_metrics: Record<string, unknown>;
  user_interactions: Record<string, unknown>;
}
