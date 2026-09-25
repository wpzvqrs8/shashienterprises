import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qvseadgwyvtlmfnduhke.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2c2VhZGd3eXZ0bG1mbmR1aGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMTEzNDgsImV4cCI6MjEwNTg4NzM0OH0.Ik9Vd3V59A789rSNdMDEctEzcDnbu6fvlszBcf8rhNk';

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'shashi_enterprise' },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from Server Component context
        }
      },
    },
  });
}
