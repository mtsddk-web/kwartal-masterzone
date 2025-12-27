import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');

  if (code && isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  // Handle password recovery
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/profile?reset=true', requestUrl.origin));
  }

  // Redirect to home after auth
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
