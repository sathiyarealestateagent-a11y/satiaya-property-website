'use client';

import { Check, Copy, Images, Map, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type PropertyMediaProps = {
  images: string[];
  title: string;
  mapQuery: string;
  mapLabel: string;
};

export function PropertyMedia({
  images,
  title,
  mapQuery,
  mapLabel,
}: PropertyMediaProps) {
  const [view, setView] = useState<'photos' | 'map'>('photos');
  const [showAll, setShowAll] = useState(false);

  const visibleImages = showAll ? images : images.slice(0, 5);
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  return (
    <section aria-label="Property photos and map">
      <div
        className="mb-4 flex gap-2"
        role="tablist"
        aria-label="Property media"
      >
        <button
          type="button"
          role="tab"
          aria-selected={view === 'photos'}
          onClick={() => setView('photos')}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
            view === 'photos'
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-primary hover:border-secondary/50 hover:bg-muted'
          }`}
        >
          <Images className="size-4" /> Photos
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'map'}
          onClick={() => setView('map')}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
            view === 'map'
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-primary hover:border-secondary/50 hover:bg-muted'
          }`}
        >
          <Map className="size-4" /> Map view
        </button>
      </div>

      {view === 'photos' ? (
        <div
          role="tabpanel"
          className={`relative grid gap-1 overflow-hidden rounded-[24px] border border-border bg-muted shadow-[0_18px_60px_rgba(23,63,74,.10)] ${
            showAll
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-2 lg:h-[560px] lg:grid-cols-4 lg:grid-rows-2'
          }`}
        >
          {visibleImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={`relative min-h-52 overflow-hidden bg-muted ${
                !showAll && index === 0
                  ? 'col-span-2 h-[360px] lg:h-auto lg:row-span-2'
                  : showAll
                    ? 'aspect-[4/3]'
                    : 'h-44 lg:h-auto'
              }`}
            >
              <Image
                src={image}
                alt={`${title} — photo ${index + 1}`}
                fill
                priority={index === 0}
                sizes={
                  index === 0
                    ? '(max-width: 1024px) 100vw, 50vw'
                    : '(max-width: 640px) 50vw, 25vw'
                }
                className="object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          ))}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-primary shadow-lg transition hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              <Images className="size-4" />
              {showAll
                ? 'Show gallery layout'
                : `Show all ${images.length} photos`}
            </button>
          )}
        </div>
      ) : (
        <div
          role="tabpanel"
          className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_18px_60px_rgba(23,63,74,.10)]"
        >
          <iframe
            src={mapUrl}
            title={`Map showing ${mapLabel}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[480px] w-full border-0 lg:h-[560px]"
          />
        </div>
      )}
    </section>
  );
}

export function PropertyShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
      return;
    }
    await copyLink();
  }

  function openSocial(destination: 'facebook' | 'instagram' | 'tiktok') {
    const url = window.location.href;
    if (destination === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank',
        'noopener,noreferrer',
      );
      return;
    }
    void copyLink();
    window.open(
      destination === 'instagram'
        ? 'https://www.instagram.com/'
        : 'https://www.tiktok.com/upload',
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label="Share this listing"
    >
      <button
        type="button"
        onClick={() => void share()}
        className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        <Share2 className="size-4" /> Share listing
      </button>
      <button
        type="button"
        onClick={() => openSocial('facebook')}
        className="h-11 rounded-xl border border-border bg-white px-4 text-sm font-bold text-primary transition hover:bg-muted"
      >
        Facebook
      </button>
      <button
        type="button"
        onClick={() => openSocial('instagram')}
        className="h-11 rounded-xl border border-border bg-white px-4 text-sm font-bold text-primary transition hover:bg-muted"
      >
        Instagram
      </button>
      <button
        type="button"
        onClick={() => openSocial('tiktok')}
        className="h-11 rounded-xl border border-border bg-white px-4 text-sm font-bold text-primary transition hover:bg-muted"
      >
        TikTok
      </button>
      <button
        type="button"
        onClick={() => void copyLink()}
        className="grid size-11 place-items-center rounded-xl border border-border bg-white text-primary transition hover:bg-muted"
        aria-label="Copy listing link"
      >
        {copied ? (
          <Check className="size-4 text-secondary" />
        ) : (
          <Copy className="size-4" />
        )}
      </button>
      {copied && (
        <output className="text-xs font-semibold text-secondary">
          Link copied — paste it into your post.
        </output>
      )}
    </div>
  );
}
