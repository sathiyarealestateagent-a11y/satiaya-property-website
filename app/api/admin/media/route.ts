import { NextResponse } from 'next/server';

import { isAdmin } from '@/db/content';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
]);
const MAX_SIZE = 20 * 1024 * 1024;

export async function POST(request: Request) {
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

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Choose a media file to upload.' },
      { status: 400 },
    );
  }
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'Use a JPG, PNG, WebP, GIF, MP4 or WebM file up to 20 MB.' },
      { status: 400 },
    );
  }

  const extension =
    file.name
      .split('.')
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '') || 'jpg';
  const key = `${data.user.id}/site-media-${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const upload = await supabase.storage
    .from('property-images')
    .upload(key, file, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });
  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 400 });
  }
  const { data: publicUrl } = supabase.storage
    .from('property-images')
    .getPublicUrl(upload.data.path);

  return NextResponse.json({ url: publicUrl.publicUrl });
}
