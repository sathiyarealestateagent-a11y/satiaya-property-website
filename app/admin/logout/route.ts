import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { isSameOriginRequest } from '@/lib/security';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { error: 'Invalid request origin.' },
      { status: 403 },
    );
  }
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/admin/login', request.url), {
    status: 303,
  });
}
