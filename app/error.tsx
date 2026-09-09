'use client';

import { RefreshCw, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page rendering failed.', error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-16 text-center">
      <div className="max-w-lg">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-destructive">
          <TriangleAlert className="size-6" />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-destructive">
          Something went wrong
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-primary sm:text-5xl">
          This page could not be loaded.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          Try loading it again. If the issue continues, return to the website
          and contact Satiaya directly.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} className="h-12 px-6">
            <RefreshCw /> Try again
          </Button>
          <Link
            href="/"
            className={buttonVariants({
              variant: 'outline',
              className: 'h-12 px-6',
            })}
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
