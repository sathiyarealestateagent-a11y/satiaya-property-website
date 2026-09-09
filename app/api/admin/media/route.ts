import { NextResponse } from 'next/server';

import { isAdmin } from '@/db/content';
import { createClient } from '@/lib/supabase/server';
import { isSameOriginRequest } from '@/lib/security';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
]);
const MAX_SIZE = 20 * 1024 * 1024;
const EXTENSIONS_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { error: 'Invalid request origin.' },
      { status: 403 },
    );
  }
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) {
    return NextResponse.json(
      { error: 'Content-Type must be multipart/form-data.' },
      { status: 415 },
    );
  }
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_SIZE + 1_000_000) {
    return NextResponse.json(
      { error: 'The media upload is too large.' },
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

  const extension = EXTENSIONS_BY_TYPE[file.type];
  const key = `${data.user.id}/site-media-${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const upload = await supabase.storage
    .from('property-images')
    .upload(key, file, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });
  if (upload.error) {
    console.error('Media upload failed.', upload.error);
    return NextResponse.json(
      { error: 'The media could not be uploaded. Please try again.' },
      { status: 400 },
    );
  }
  const { data: publicUrl } = supabase.storage
    .from('property-images')
    .getPublicUrl(upload.data.path);

  return NextResponse.json({ url: publicUrl.publicUrl });
}
