'use client';

import { Building2, LoaderCircle, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type SubmitEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createRecoveryClient } from '@/lib/supabase/recovery-client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const checkRecoverySession = async () => {
      const supabase = createRecoveryClient();
      if (!supabase) {
        if (active) {
          setError('The dashboard connection is not configured yet.');
          setChecking(false);
        }
        return;
      }

      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) {
        router.replace('/admin/forgot-password');
        return;
      }
      setChecking(false);
    };

    void checkRecoverySession();
    return () => {
      active = false;
    };
  }, [router]);

  const updatePassword: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Use at least 8 characters for your new password.');
      return;
    }
    if (password !== confirmation) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);
    const supabase = createRecoveryClient();
    if (!supabase) {
      setError('The dashboard connection is not configured yet.');
      setLoading(false);
      return;
    }

    const result = await supabase.auth.updateUser({ password });
    if (result.error) {
      setError(
        'The password could not be updated. Request a new recovery link and try again.',
      );
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.replace('/admin/login?password=updated');
    router.refresh();
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#F7F8FA] px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-[0_24px_70px_rgba(20,61,141,.12)] ring-1 ring-black/5 sm:p-9">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#143D8D] text-[#E8C96A]">
          <Building2 className="size-7" />
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2B5FB8]">
            Secure account
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-[#143D8D]">
            Choose a new password
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Use at least 8 characters and keep your dashboard password private.
          </p>
        </div>

        {checking ? (
          <div className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-[#5B6574]">
            <LoaderCircle className="size-4 animate-spin" /> Checking your
            recovery link…
          </div>
        ) : (
          <form onSubmit={updatePassword} className="mt-7 grid gap-4">
            <label
              htmlFor="new-password"
              className="grid gap-2 text-sm font-semibold text-[#1F2937]"
            >
              New password
              <Input
                type="password"
                id="new-password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 rounded-xl bg-[#F7F8FA]"
              />
            </label>
            <label
              htmlFor="confirm-password"
              className="grid gap-2 text-sm font-semibold text-[#1F2937]"
            >
              Confirm new password
              <Input
                type="password"
                id="confirm-password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="h-12 rounded-xl bg-[#F7F8FA]"
              />
            </label>
            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-destructive">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="mt-1 h-12 rounded-full text-sm font-bold"
            >
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <LockKeyhole />
              )}
              {loading ? 'Updating…' : 'Save new password'}
            </Button>
          </form>
        )}

        <Link
          href="/admin/login"
          className="mt-6 block text-center text-sm font-semibold text-[#5B6574] hover:text-[#143D8D]"
        >
          Return to sign in
        </Link>
      </div>
    </main>
  );
}
