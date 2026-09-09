import { NextResponse } from 'next/server';

import { getSiteContent, isAdmin, saveSiteContent } from '@/db/content';
import { createClient } from '@/lib/supabase/server';
import { siteContentSchema } from '@/src/content/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });
  }
  const { data } = await supabase.auth.getUser();
  if (!data.user || !(await isAdmin(supabase, data.user.id))) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });
  }
  const { data } = await supabase.auth.getUser();
  if (!data.user || !(await isAdmin(supabase, data.user.id))) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const result = siteContentSchema.safeParse(await request.json());
  if (!result.success) {
    return NextResponse.json(
      { error: 'Please check the highlighted content and try again.' },
      { status: 400 },
    );
  }
  await saveSiteContent(supabase, result.data, data.user.id);
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
