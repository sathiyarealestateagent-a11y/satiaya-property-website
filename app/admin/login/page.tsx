'use client';

import {
  Building2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type SubmitEventHandler, useState, useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

const subscribeToLocation = () => () => {};
const isPasswordUpdated = () =>
  new URLSearchParams(window.location.search).get('password') === 'updated';
const isPasswordUpdatedOnServer = () => false;

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const passwordUpdated = useSyncExternalStore(
    subscribeToLocation,
    isPasswordUpdated,
    isPasswordUpdatedOnServer,
  );

  const signIn: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
      setError('Enter your email address and password.');
      event.currentTarget
        .querySelector<HTMLInputElement>('input:invalid, input[value=""]')
        ?.focus();
      return;
    }
    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setError('The dashboard connection is not configured yet.');
      setLoading(false);
      return;
    }

    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      setError('The email or password is incorrect.');
      setLoading(false);
      return;
    }
    router.replace('/admin');
    router.refresh();
  };

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    const supabase = createClient();
    if (!supabase) {
      setError('The dashboard connection is not configured yet.');
      setGoogleLoading(false);
      return;
    }

    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (result.error) {
      setError('Google sign-in could not be started. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#F5F8F9] px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-[0_24px_70px_rgba(23,63,74,.12)] ring-1 ring-black/5 sm:p-9">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#173F4A] text-[#77D9D4]">
          <Building2 className="size-7" />
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#16807F]">
            Private access
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-[#173F4A]">
            Website dashboard
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign in to update your website content, images and property
            listings.
          </p>
        </div>

        {passwordUpdated && (
          <output className="mt-7 rounded-xl bg-[#EAF2F3] px-4 py-3 text-center text-sm font-semibold text-[#16807F]">
            Your password was updated. Sign in with the new password.
          </output>
        )}

        <div className={`${passwordUpdated ? 'mt-4' : 'mt-7'} grid gap-4`}>
          <Button
            type="button"
            variant="outline"
            disabled={loading || googleLoading}
            onClick={signInWithGoogle}
            className="h-12 rounded-full border-black/10 bg-white text-sm font-bold text-[#24343A] shadow-sm hover:bg-[#F5F8F9]"
          >
            {googleLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
                <path
                  fill="#4285F4"
                  d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.39a4.61 4.61 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.97-4.33 2.97-7.41Z"
                />
                <path
                  fill="#34A853"
                  d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.53c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.39 13.87A6.02 6.02 0 0 1 6.08 12c0-.65.11-1.28.31-1.87V7.52H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.48l3.35-2.61Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.61C7.18 7.76 9.39 6 12 6Z"
                />
              </svg>
            )}
            {googleLoading ? 'Opening Google…' : 'Continue with Google'}
          </Button>

          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5F7077]">
            <span className="h-px flex-1 bg-black/10" />
            Or use password
            <span className="h-px flex-1 bg-black/10" />
          </div>
        </div>

        <form onSubmit={signIn} noValidate className="mt-4 grid gap-4">
          <label
            htmlFor="admin-email"
            className="grid gap-2 text-sm font-semibold text-[#24343A]"
          >
            Email address
            <Input
              type="email"
              id="admin-email"
              autoComplete="email"
              required
              value={email}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'admin-login-error' : undefined}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-xl bg-[#F5F8F9]"
            />
          </label>
          <label
            htmlFor="admin-password"
            className="grid gap-2 text-sm font-semibold text-[#24343A]"
          >
            <span className="flex items-center justify-between gap-3">
              <span>Password</span>
              <Link
                href="/admin/forgot-password"
                className="text-xs font-bold text-[#16807F] hover:text-[#173F4A]"
              >
                Forgot password?
              </Link>
            </span>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="admin-password"
                autoComplete="current-password"
                required
                value={password}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'admin-login-error' : undefined}
                onChange={(event) => setPassword(event.target.value)}
                className="premium-field h-12 rounded-lg pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 grid w-12 cursor-pointer place-items-center rounded-r-lg text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </label>
          {error && (
            <p
              id="admin-login-error"
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-destructive"
            >
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="mt-1 h-12 rounded-full text-sm font-bold"
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <LockKeyhole />
            )}
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-semibold text-[#5F7077] hover:text-[#173F4A]"
        >
          Return to website
        </Link>
      </div>
    </main>
  );
}
