import { ArrowLeft, SearchX } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

export default function PropertyNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-16 text-center">
      <div className="max-w-lg rounded-[24px] border border-border bg-white px-7 py-12 shadow-[0_18px_60px_rgba(23,63,74,.08)] sm:px-12">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted text-secondary">
          <SearchX className="size-6" />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-secondary">
          Listing unavailable
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-[-0.028em] text-primary">
          Property not found
        </h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          This listing may have been removed or its address may have changed.
          Browse the current properties to continue.
        </p>
        <Link
          href="/#properties"
          className={`${buttonVariants({ size: 'lg' })} mt-7 h-11 px-5`}
        >
          <ArrowLeft /> Back to properties
        </Link>
      </div>
    </main>
  );
}
