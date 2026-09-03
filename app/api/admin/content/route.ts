import { NextResponse } from 'next/server';

import { getChatGPTUser } from '@/app/chatgpt-auth';
import { getSiteContent, isAdmin, saveSiteContent } from '@/db/content';
import { siteContentSchema } from '@/src/content/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getChatGPTUser();
  if (!user || !(await isAdmin(user.userId))) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user || !(await isAdmin(user.userId))) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const result = siteContentSchema.safeParse(await request.json());
  if (!result.success) {
    return NextResponse.json(
      { error: 'Please check the highlighted content and try again.' },
      { status: 400 },
    );
  }
  await saveSiteContent(result.data, user.userId);
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
