import type { SupabaseClient } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';
import { siteConfig } from '@/src/config/site';
import { defaultContent } from '@/src/content/default-content';
import {
  propertySchema,
  siteContentSchema,
  siteSettingsSchema,
  type EditableProperty,
  type SiteContent,
} from '@/src/content/schema';

const CONTENT_ID = 'main';
const REMOVED_INTEREST_OPTIONS = new Set(['Renting a property']);

function withRumahSelangorkuNavigation(
  navigation: SiteContent['navigation'],
): SiteContent['navigation'] {
  const item = {
    label: siteConfig.rumahSelangorku.navigationLabel,
    href: siteConfig.rumahSelangorku.route,
  };
  if (navigation.some((entry) => entry.href === item.href)) return navigation;

  const nextNavigation = [...navigation];
  const propertiesIndex = nextNavigation.findIndex(
    (entry) => entry.href === '#properties',
  );
  const insertionIndex =
    propertiesIndex >= 0 ? propertiesIndex + 1 : nextNavigation.length;
  nextNavigation.splice(insertionIndex, 0, item);
  return nextNavigation.slice(0, 10);
}

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
  image_urls: string[] | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  package_details: string | null;
  project_info: string | null;
  amenities: string | null;
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
    images:
      row.image_urls && row.image_urls.length > 0
        ? row.image_urls
        : row.image_url
          ? [row.image_url]
          : [],
    address: row.address ?? '',
    latitude: row.latitude === null ? null : Number(row.latitude),
    longitude: row.longitude === null ? null : Number(row.longitude),
    description: row.description ?? '',
    packageDetails: row.package_details ?? '',
    projectInfo: row.project_info ?? '',
    amenities: row.amenities ?? '',
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
    image_url: property.images[0] ?? property.image,
    image_urls: property.images,
    address: property.address,
    latitude: property.latitude,
    longitude: property.longitude,
    description: property.description,
    package_details: property.packageDetails,
    project_info: property.projectInfo,
    amenities: property.amenities,
    featured: Boolean(property.featured),
    updated_at: new Date().toISOString(),
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const supabase = await createClient();
    if (!supabase) return defaultContent;

    const [contentResult, propertiesResult] = await Promise.all([
      supabase
        .from('site_content')
        .select('content')
        .eq('id', CONTENT_ID)
        .maybeSingle(),
      supabase.from('properties').select('*').order('id'),
    ]);

    if (contentResult.error || !contentResult.data) return defaultContent;
    const settings = siteSettingsSchema.safeParse(contentResult.data.content);
    if (!settings.success) return defaultContent;

    const properties = propertiesResult.error
      ? defaultContent.properties
      : (propertiesResult.data as PropertyRow[]).map(fromPropertyRow);

    return siteContentSchema.parse({
      ...settings.data,
      navigation: withRumahSelangorkuNavigation(settings.data.navigation),
      contactSection: {
        ...settings.data.contactSection,
        interestOptions: settings.data.contactSection.interestOptions.filter(
          (option) => !REMOVED_INTEREST_OPTIONS.has(option),
        ),
      },
      properties,
    });
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
