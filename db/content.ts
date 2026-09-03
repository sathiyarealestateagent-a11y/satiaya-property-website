import { env } from 'cloudflare:workers';

import { defaultContent } from '@/src/content/default-content';
import { siteContentSchema, type SiteContent } from '@/src/content/schema';

const CONTENT_ID = 'main';

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const row = await env.DB.prepare(
      'SELECT content FROM site_content WHERE id = ? LIMIT 1',
    )
      .bind(CONTENT_ID)
      .first<{ content: string }>();
    if (!row) return defaultContent;
    const parsed = siteContentSchema.safeParse(JSON.parse(row.content));
    return parsed.success ? parsed.data : defaultContent;
  } catch {
    return defaultContent;
  }
}

export async function saveSiteContent(
  content: SiteContent,
  userId: string,
): Promise<void> {
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO site_content (id, content, updated_at, updated_by)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       content = excluded.content,
       updated_at = excluded.updated_at,
       updated_by = excluded.updated_by`,
  )
    .bind(CONTENT_ID, JSON.stringify(content), now, userId)
    .run();
}

export async function ensureAdmin(userId: string, email: string): Promise<boolean> {
  const admin = await env.DB.prepare(
    'SELECT user_id FROM site_admins ORDER BY created_at ASC LIMIT 1',
  ).first<{ user_id: string }>();
  if (admin) return admin.user_id === userId;

  await env.DB.prepare(
    'INSERT OR IGNORE INTO site_admins (user_id, email, created_at) VALUES (?, ?, ?)',
  )
    .bind(userId, email, Date.now())
    .run();
  const claimed = await env.DB.prepare(
    'SELECT user_id FROM site_admins ORDER BY created_at ASC LIMIT 1',
  ).first<{ user_id: string }>();
  return claimed?.user_id === userId;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const row = await env.DB.prepare(
    'SELECT user_id FROM site_admins WHERE user_id = ? LIMIT 1',
  )
    .bind(userId)
    .first<{ user_id: string }>();
  return Boolean(row);
}
