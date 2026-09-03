import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const siteContent = sqliteTable('site_content', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  updatedAt: integer('updated_at').notNull(),
  updatedBy: text('updated_by').notNull(),
});

export const siteAdmins = sqliteTable('site_admins', {
  userId: text('user_id').primaryKey(),
  email: text('email').notNull(),
  createdAt: integer('created_at').notNull(),
});
