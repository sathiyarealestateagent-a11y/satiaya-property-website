import type { Metadata } from 'next';

import { getSiteContent } from '@/db/content';
import { siteConfig } from '@/src/config/site';

import HomePage from './home-page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    absolute:
      'Satiaya Selvan | Property Agent Malaysia | Buy, Sell & Rent Property',
  },
  description:
    'Professional property services for buying, selling, renting and refinancing homes across Kuala Lumpur, Selangor, Klang Valley, Negeri Sembilan and Port Dickson.',
  alternates: {
    canonical: `${siteConfig.domain}/`,
  },
  openGraph: {
    title:
      'Satiaya Selvan | Property Agent Malaysia | Buy, Sell & Rent Property',
    description:
      'Professional property services for buying, selling, renting and refinancing homes across Kuala Lumpur, Selangor, Klang Valley, Negeri Sembilan and Port Dickson.',
    url: `${siteConfig.domain}/`,
    type: 'website',
    locale: 'en_MY',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Satiaya Selvan property services in Malaysia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Satiaya Selvan | Property Agent Malaysia | Buy, Sell & Rent Property',
    description:
      'Professional property services for buying, selling, renting and refinancing homes across Kuala Lumpur, Selangor, Klang Valley, Negeri Sembilan and Port Dickson.',
    images: ['/og.png'],
  },
};

export default async function Page() {
  const content = await getSiteContent();
  const sameAs = [
    content.social.instagram,
    content.social.facebook,
    content.social.tiktok,
  ].filter((url) => url && url !== '#');
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.domain}/#website`,
        url: `${siteConfig.domain}/`,
        name: 'Satiaya Property',
        inLanguage: 'en-MY',
      },
      {
        '@type': 'RealEstateAgent',
        '@id': `${siteConfig.domain}/#real-estate-agent`,
        name: content.agent.name,
        url: `${siteConfig.domain}/`,
        telephone: content.contact.phone,
        email: content.contact.email,
        image: content.agent.profilePhoto,
        areaServed: content.contact.serviceArea,
        sameAs,
        employee: {
          '@type': 'Person',
          name: content.agent.name,
          jobTitle: content.agent.title,
          worksFor: {
            '@type': 'Organization',
            name: content.agent.agency,
          },
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <HomePage content={content} />
    </>
  );
}
