import { NextResponse } from 'next/server';

import { getSiteContent, isAdmin, saveSiteContent } from '@/db/content';
import { createClient } from '@/lib/supabase/server';
import { isSameOriginRequest } from '@/lib/security';
import { siteContentSchema } from '@/src/content/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured.' },
      { status: 503 },
    );
  }
  const { data } = await supabase.auth.getUser();
  if (!data.user || !(await isAdmin(supabase, data.user.id))) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { error: 'Invalid request origin.' },
      { status: 403 },
    );
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return NextResponse.json(
      { error: 'Content-Type must be application/json.' },
      { status: 415 },
    );
  }
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 2_000_000) {
    return NextResponse.json(
      { error: 'The website draft is too large to publish.' },
      { status: 413 },
    );
  }
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured.' },
      { status: 503 },
    );
  }
  const { data } = await supabase.auth.getUser();
  if (!data.user || !(await isAdmin(supabase, data.user.id))) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  let payload: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 2_000_000) {
      return NextResponse.json(
        { error: 'The website draft is too large to publish.' },
        { status: 413 },
      );
    }
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { error: 'The request body must contain valid JSON.' },
      { status: 400 },
    );
  }

  const result = siteContentSchema.safeParse(payload);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Please check the highlighted content and try again.' },
      { status: 400 },
    );
  }
  try {
    await saveSiteContent(supabase, result.data, data.user.id);
  } catch (error) {
    console.error('Failed to save website content.', error);
    return NextResponse.json(
      { error: 'The changes could not be saved. Please try again.' },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
