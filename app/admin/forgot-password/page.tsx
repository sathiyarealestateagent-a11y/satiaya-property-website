'use client';

import { Building2, LoaderCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { type SubmitEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createRecoveryClient } from '@/lib/supabase/recovery-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const requestReset: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createRecoveryClient();
    if (!supabase) {
      setError('The dashboard connection is not configured yet.');
      setLoading(false);
      return;
    }

    const redirectTo = `${window.location.origin}/admin/update-password`;
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (result.error) {
      const rateLimited =
        result.error.status === 429 ||
        result.error.code === 'over_email_send_rate_limit';
      setError(
        rateLimited
          ? 'Too many recovery emails were requested. Please wait one hour, then try once.'
          : 'The recovery email could not be sent. Please wait a moment and try again.',
      );
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#F7F8FA] px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-[0_24px_70px_rgba(11,45,92,.12)] ring-1 ring-black/5 sm:p-9">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#0B2D5C] text-[#E8C96A]">
          <Building2 className="size-7" />
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#174A8B]">
            Account recovery
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-[#0B2D5C]">
            Reset your password
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Enter the administrator email address and we will send a secure
            reset link.
          </p>
        </div>

        {sent ? (
          <div className="mt-7 rounded-2xl bg-[#EDF2F7] p-5 text-center text-sm leading-6 text-[#174A8B]">
            If an administrator account exists for that email, a recovery link
            has been sent. Check your inbox and spam folder.
          </div>
        ) : (
          <form onSubmit={requestReset} className="mt-7 grid gap-4">
            <label
              htmlFor="recovery-email"
              className="grid gap-2 text-sm font-semibold text-[#1F2937]"
            >
              Email address
              <Input
                type="email"
                id="recovery-email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
              {loading ? <LoaderCircle className="animate-spin" /> : <Mail />}
              {loading ? 'Sending…' : 'Send recovery email'}
            </Button>
          </form>
        )}

        <Link
          href="/admin/login"
          className="mt-6 block text-center text-sm font-semibold text-[#5B6574] hover:text-[#0B2D5C]"
        >
          Return to sign in
        </Link>
      </div>
    </main>
  );
}
