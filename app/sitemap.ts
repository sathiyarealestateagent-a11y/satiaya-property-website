import type { MetadataRoute } from 'next';

import { getSiteContent } from '@/db/content';
import { siteConfig } from '@/src/config/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const baseUrl = siteConfig.domain;

  return [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...content.properties.map((property) => ({
      url: `${baseUrl}/properties/${property.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: property.images.length
        ? property.images
        : property.image
          ? [property.image]
          : undefined,
    })),
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
