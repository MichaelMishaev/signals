import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return null if Supabase is not configured
  if (!url || !key) {
    console.warn('Supabase not configured. Using localStorage-only mode.');
    return null;
  }

  return createBrowserClient(url, key);
}
