import { ArrowLeft, SearchX } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-16 text-center">
      <div className="max-w-lg">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted text-secondary">
          <SearchX className="size-6" />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-secondary">
          Page not found
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-primary sm:text-5xl">
          This address does not lead to a page.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          The page may have moved, or the link may be incomplete. Return to the
          website to continue browsing properties.
        </p>
        <Link
          href="/"
          className={buttonVariants({ className: 'mt-7 h-12 px-6' })}
        >
          <ArrowLeft /> Return to website
        </Link>
      </div>
    </main>
  );
}
