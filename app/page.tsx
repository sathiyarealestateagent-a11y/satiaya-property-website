import type { Metadata } from 'next';

import { getSiteContent } from '@/db/content';

import HomePage from './home-page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
  },
};

export default async function Page() {
  return <HomePage content={await getSiteContent()} />;
}
