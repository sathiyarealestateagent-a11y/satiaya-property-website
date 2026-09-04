'use client';

import { Building2, LoaderCircle, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type SubmitEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signIn: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
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

  return (
    <main className="grid min-h-screen place-items-center bg-[#f3f1e9] px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-[0_24px_70px_rgba(25,56,45,.12)] ring-1 ring-black/5 sm:p-9">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#19382d] text-[#f3c98d]">
          <Building2 className="size-7" />
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b97738]">Private access</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-[#19382d]">Website dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign in to update your website content, images and property listings.
          </p>
        </div>

        <form onSubmit={signIn} className="mt-7 grid gap-4">
          <label htmlFor="admin-email" className="grid gap-2 text-sm font-semibold text-[#34483f]">
            Email address
            <Input
              type="email"
              id="admin-email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-xl bg-[#f8f9f7]"
            />
          </label>
          <label htmlFor="admin-password" className="grid gap-2 text-sm font-semibold text-[#34483f]">
            Password
            <Input
              type="password"
              id="admin-password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-xl bg-[#f8f9f7]"
            />
          </label>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="mt-1 h-12 rounded-full text-sm font-bold">
            {loading ? <LoaderCircle className="animate-spin" /> : <LockKeyhole />}
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <Link href="/" className="mt-6 block text-center text-sm font-semibold text-[#49685b] hover:text-[#19382d]">
          Return to website
        </Link>
      </div>
    </main>
  );
}
