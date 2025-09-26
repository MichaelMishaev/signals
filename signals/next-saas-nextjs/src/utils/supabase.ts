import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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
