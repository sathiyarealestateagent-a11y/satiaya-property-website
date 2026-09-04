import type { SupabaseClient } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';
import { defaultContent } from '@/src/content/default-content';
import {
  propertySchema,
  siteContentSchema,
  siteSettingsSchema,
  type EditableProperty,
  type SiteContent,
} from '@/src/content/schema';

const CONTENT_ID = 'main';

type PropertyRow = {
  id: number;
  title: string;
  location: string;
  property_type: string;
  listing_type: 'sale' | 'rent';
  price: number;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  image_url: string;
  featured: boolean;
};

function fromPropertyRow(row: PropertyRow): EditableProperty {
  return propertySchema.parse({
    id: row.id,
    title: row.title,
    location: row.location,
    propertyType: row.property_type,
    type: row.listing_type,
    price: row.price,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    size: row.size_sqft,
    image: row.image_url,
    featured: row.featured,
  });
}

function toPropertyRow(property: EditableProperty) {
  return {
    id: property.id,
    title: property.title,
    location: property.location,
    property_type: property.propertyType,
    listing_type: property.type,
    price: property.price,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    size_sqft: property.size,
    image_url: property.image,
    featured: Boolean(property.featured),
    updated_at: new Date().toISOString(),
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const supabase = await createClient();
    if (!supabase) return defaultContent;

    const [contentResult, propertiesResult] = await Promise.all([
      supabase.from('site_content').select('content').eq('id', CONTENT_ID).maybeSingle(),
      supabase.from('properties').select('*').order('id'),
    ]);

    if (contentResult.error || !contentResult.data) return defaultContent;
    const settings = siteSettingsSchema.safeParse(contentResult.data.content);
    if (!settings.success) return defaultContent;

    const properties = propertiesResult.error
      ? defaultContent.properties
      : (propertiesResult.data as PropertyRow[]).map(fromPropertyRow);

    return siteContentSchema.parse({ ...settings.data, properties });
  } catch {
    return defaultContent;
  }
}

export async function saveSiteContent(
  supabase: SupabaseClient,
  content: SiteContent,
  userId: string,
): Promise<void> {
  const { properties, ...settings } = content;
  const now = new Date().toISOString();
  const contentResult = await supabase.from('site_content').upsert({
    id: CONTENT_ID,
    content: settings,
    updated_at: now,
    updated_by: userId,
  });
  if (contentResult.error) throw contentResult.error;

  if (properties.length > 0) {
    const propertiesResult = await supabase
      .from('properties')
      .upsert(properties.map(toPropertyRow));
    if (propertiesResult.error) throw propertiesResult.error;
  }

  const ids = properties.map((property) => property.id);
  const deleteQuery = supabase.from('properties').delete();
  const deleteResult = ids.length
    ? await deleteQuery.not('id', 'in', `(${ids.join(',')})`)
    : await deleteQuery.neq('id', 0);
  if (deleteResult.error) throw deleteResult.error;
}

export async function isAdmin(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const result = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  return !result.error && Boolean(result.data);
}
