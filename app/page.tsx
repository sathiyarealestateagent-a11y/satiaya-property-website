import { getSiteContent } from '@/db/content';

import HomePage from './home-page';

export const dynamic = 'force-dynamic';

export default async function Page() {
  return <HomePage content={await getSiteContent()} />;
}
