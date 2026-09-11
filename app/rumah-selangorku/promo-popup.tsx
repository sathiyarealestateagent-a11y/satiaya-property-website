'use client';

import { ArrowRight, MessageCircle, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PopupSettings = {
  active: boolean;
  delayMs: number;
  dismissalHours: number;
  image: string;
  imageAlt: string;
  title: string;
  headline: string;
  description: string;
  primaryButton: string;
  primaryLink: string;
  secondaryButton: string;
};

const DISMISSED_AT_KEY = 'satiaya-rumah-selangorku-popup-dismissed-at';

export default function RumahSelangorkuPopup({
  settings,
  whatsappHref,
}: {
  settings: PopupSettings;
  whatsappHref: string;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const rememberDismissal = useCallback(() => {
    try {
      window.localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
    } catch {
      // Storage can be unavailable in private browsing; closing still works.
    }
  }, []);

  const close = useCallback(() => {
    rememberDismissal();
    setOpen(false);
  }, [rememberDismissal]);

  useEffect(() => {
    if (!settings.active) return;
    if (new URLSearchParams(window.location.search).get('visualEditor') === '1')
      return;

    try {
      const dismissedAt = Number(
        window.localStorage.getItem(DISMISSED_AT_KEY) ?? 0,
      );
      const dismissalWindow = settings.dismissalHours * 60 * 60 * 1000;
      if (dismissedAt && Date.now() - dismissedAt < dismissalWindow) return;
    } catch {
      // If storage is blocked, show the promotion once for this page load.
    }

    const timer = window.setTimeout(() => setOpen(true), settings.delayMs);
    return () => window.clearTimeout(timer);
  }, [settings.active, settings.delayMs, settings.dismissalHours]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const siteContent = document.getElementById('site-content');
    siteContent?.setAttribute('inert', '');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      siteContent?.removeAttribute('inert');
      previousFocusRef.current?.focus();
    };
  }, [close, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-dialog)] grid place-items-center overflow-y-auto bg-[#102F37]/70 px-4 py-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm sm:px-6">
      <dialog
        open
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby="rumah-selangorku-popup-title"
        aria-describedby="rumah-selangorku-popup-description"
        className="rumah-popup-enter relative my-auto grid w-full max-w-[44rem] overflow-hidden rounded-[1.75rem] border border-white/50 bg-white p-0 text-foreground shadow-[0_28px_90px_rgba(16,47,55,.28)] sm:grid-cols-[0.82fr_1.18fr]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Close Rumah Selangorku promotion"
          className="absolute right-3 top-3 z-10 grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-white text-primary shadow-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:right-4 sm:top-4"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        {settings.image ? (
          <div className="relative min-h-48 bg-primary sm:min-h-full">
            <Image
              src={settings.image}
              alt={settings.imageAlt}
              fill
              sizes="(max-width: 640px) 90vw, 290px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/55 to-transparent" />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="relative hidden min-h-full overflow-hidden bg-primary sm:block"
          >
            <div className="absolute -left-16 top-16 size-52 rounded-full border border-[#77D9D4]/30" />
            <div className="absolute left-14 top-40 size-44 rounded-full border border-[#2DB8B5]/45" />
            <div className="absolute bottom-10 left-8 right-8 border-t border-white/20 pt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              Selangor · Malaysia
            </div>
          </div>
        )}

        <div className="px-6 pb-7 pt-16 sm:px-9 sm:pb-9 sm:pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
            {settings.title}
          </p>
          <h2
            id="rumah-selangorku-popup-title"
            className="mt-3 font-heading text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-primary sm:text-[2.35rem]"
          >
            {settings.headline}
          </h2>
          <p
            id="rumah-selangorku-popup-description"
            className="mt-4 text-[15px] leading-7 text-muted-foreground"
          >
            {settings.description}
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Link
              href={settings.primaryLink}
              onClick={rememberDismissal}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 min-w-0 w-full bg-secondary px-4 text-white hover:bg-primary',
              )}
            >
              {settings.primaryButton}
              <ArrowRight aria-hidden="true" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={rememberDismissal}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'h-12 w-full border-primary/20 text-primary hover:bg-muted',
              )}
            >
              <MessageCircle aria-hidden="true" />
              {settings.secondaryButton}
            </a>
          </div>
        </div>
      </dialog>
    </div>
  );
}
