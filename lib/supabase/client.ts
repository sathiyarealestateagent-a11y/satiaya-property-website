import { createBrowserClient } from '@supabase/ssr';

import { getSupabaseEnvironment } from './env';

export function createClient() {
  const environment = getSupabaseEnvironment();
  if (!environment) return null;
  return createBrowserClient(environment.url, environment.publishableKey);
}
