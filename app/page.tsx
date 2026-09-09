import { getSiteContent } from '@/db/content';
import { JsonLd } from '@/components/json-ld';

import HomePage from './home-page';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const content = await getSiteContent();
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: content.agent.name,
          url: 'https://www.satiayaproperty.com.my',
          image: content.agent.profilePhoto,
          telephone: content.contact.phone,
          email: content.contact.email,
          areaServed: content.contact.serviceArea,
          address: { '@type': 'PostalAddress', addressCountry: 'MY' },
          sameAs: [
            content.social.instagram,
            content.social.facebook,
            content.social.tiktok,
          ].filter((url) => url && url !== '#'),
        }}
      />
      <HomePage content={content} />
    </>
  );
}
