import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzcarcbjzbaosviuepvb.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Y2FyY2JqemJhb3N2aXVlcHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MTEyMjQsImV4cCI6MjEwNDE4NzIyNH0.DZ4BnAkfjqSP7akPyY64Re4wF_WziLsbeu4Z5hxfGo8';

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'shashi_enterprise' }
  });
}
