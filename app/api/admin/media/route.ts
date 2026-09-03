import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';

import { getChatGPTUser } from '@/app/chatgpt-auth';
import { isAdmin } from '@/db/content';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user || !(await isAdmin(user.userId))) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'Use a JPG, PNG, WebP or GIF image up to 10 MB.' },
      { status: 400 },
    );
  }

  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const key = `site-image-${Date.now()}-${crypto.randomUUID()}.${extension}`;
  await env.FILES.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { uploadedBy: user.userId },
  });

  return NextResponse.json({ url: `/api/media/${encodeURIComponent(key)}` });
}
