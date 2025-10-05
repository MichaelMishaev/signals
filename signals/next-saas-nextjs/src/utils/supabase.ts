import { createClient } from '@supabase/supabase-js';

// Lazy initialization of Supabase clients
let supabaseClient: ReturnType<typeof createClient> | null = null;
let supabaseAdminClient: ReturnType<typeof createClient> | null = null;

function initSupabaseClients() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Check for empty strings as well as undefined
  if (!supabaseUrl || supabaseUrl.trim() === '') {
    console.warn('Missing NEXT_PUBLIC_SUPABASE_URL environment variable - using demo mode');
    return null;
  }

  if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
    console.warn('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable - using demo mode');
    return null;
  }

  if (!supabaseServiceKey || supabaseServiceKey.trim() === '') {
    console.warn('Missing SUPABASE_SERVICE_ROLE_KEY environment variable - using demo mode');
    return null;
  }

  return {
    client: createClient(supabaseUrl, supabaseAnonKey),
    adminClient: createClient(supabaseUrl, supabaseServiceKey)
  };
}

export function getSupabase(): ReturnType<typeof createClient> | null {
  if (!supabaseClient) {
    const result = initSupabaseClients();
    if (!result) return null;
    supabaseClient = result.client;
  }
  return supabaseClient;
}

export function getSupabaseAdmin(): ReturnType<typeof createClient> | null {
  if (!supabaseAdminClient) {
    const result = initSupabaseClients();
    if (!result) return null;
    supabaseAdminClient = result.adminClient;
  }
  return supabaseAdminClient;
}

// For backward compatibility
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabase();
    if (!client) {
      throw new Error('Supabase client not initialized - check environment variables');
    }
    return client[prop as keyof ReturnType<typeof createClient>];
  }
});

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabaseAdmin();
    if (!client) {
      throw new Error('Supabase admin client not initialized - check environment variables');
    }
    return client[prop as keyof ReturnType<typeof createClient>];
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
