import { createClient as createSupabaseClient } from '@supabase/supabase-js';

import { getSupabaseEnvironment } from './env';

export function createRecoveryClient() {
  const environment = getSupabaseEnvironment();
  if (!environment) return null;

  return createSupabaseClient(environment.url, environment.publishableKey, {
    auth: {
      detectSessionInUrl: true,
      flowType: 'implicit',
      persistSession: true,
      storageKey: 'satiaya-password-recovery',
    },
  });
}
