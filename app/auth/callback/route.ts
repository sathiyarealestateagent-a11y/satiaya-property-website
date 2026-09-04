import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const destination = url.searchParams.get('next')?.startsWith('/')
    ? url.searchParams.get('next')!
    : '/admin';
  const supabase = await createClient();

  if (code && supabase) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    if (!result.error) return NextResponse.redirect(new URL(destination, url.origin));
  }
  return NextResponse.redirect(new URL('/admin/login?error=callback', url.origin));
}
