'use client';

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Images,
  Map,
  Maximize2,
  Share2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const visibleImages = showAll ? images : images.slice(0, 5);
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const selectedImage =
    selectedImageIndex === null ? null : images[selectedImageIndex];

  function showPreviousImage() {
    setSelectedImageIndex((current) =>
      current === null ? 0 : (current - 1 + images.length) % images.length,
    );
  }

  function showNextImage() {
    setSelectedImageIndex((current) =>
      current === null ? 0 : (current + 1) % images.length,
    );
  }

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
          className={`relative grid gap-1 overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_18px_50px_rgba(23,63,74,.09)] ${
            showAll
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : images.length === 1
                ? 'grid-cols-1 lg:h-[560px]'
                : 'grid-cols-2 lg:h-[560px] lg:grid-cols-4 lg:grid-rows-2'
          }`}
        >
          {visibleImages.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => setSelectedImageIndex(index)}
              aria-label={`View ${title} photo ${index + 1} larger`}
              className={`group relative min-h-52 cursor-zoom-in overflow-hidden bg-muted text-left focus-visible:z-10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset ${
                !showAll && images.length === 1
                  ? 'col-span-1 h-[360px] lg:h-full'
                  : !showAll && index === 0
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
                className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <span className="pointer-events-none absolute right-3 top-3 grid size-10 place-items-center rounded-xl bg-primary/80 text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Maximize2 className="size-4" />
              </span>
            </button>
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
          className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_18px_50px_rgba(23,63,74,.09)]"
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

      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedImageIndex(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-[#07181d]/90 supports-backdrop-filter:backdrop-blur-md"
          className="flex h-[calc(100dvh-1rem)] max-h-[960px] w-[calc(100%-1rem)] max-w-[min(1280px,calc(100%-1rem))] flex-col gap-0 overflow-hidden rounded-2xl border border-white/15 bg-[#07181d] p-0 text-white ring-0 sm:h-[calc(100dvh-2rem)] sm:w-[calc(100%-2rem)] sm:max-w-[min(1280px,calc(100%-2rem))]"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' && images.length > 1) {
              event.preventDefault();
              showPreviousImage();
            }
            if (event.key === 'ArrowRight' && images.length > 1) {
              event.preventDefault();
              showNextImage();
            }
          }}
        >
          <DialogTitle className="sr-only">{title} photo viewer</DialogTitle>
          <DialogDescription className="sr-only">
            View the property photos at full size. Use the arrow buttons or
            keyboard arrow keys to move between photos.
          </DialogDescription>

          <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black/20">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt={`${title} — photo ${(selectedImageIndex ?? 0) + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            )}

            <button
              type="button"
              onClick={() => setSelectedImageIndex(null)}
              className="absolute right-3 top-3 z-10 grid size-11 cursor-pointer place-items-center rounded-xl border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white sm:right-5 sm:top-5"
              aria-label="Close photo viewer"
            >
              <X className="size-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-3 top-1/2 z-10 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-xl border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white sm:left-5"
                  aria-label="Previous property photo"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-3 top-1/2 z-10 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-xl border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white sm:right-5"
                  aria-label="Next property photo"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}

            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm sm:bottom-5">
              {(selectedImageIndex ?? 0) + 1} / {images.length}
            </span>
          </div>

          {images.length > 1 && (
            <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-white/10 bg-black/30 p-3 sm:p-4">
              {images.map((image, index) => (
                <button
                  key={`${image}-thumbnail-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`View property photo ${index + 1}`}
                  aria-current={
                    selectedImageIndex === index ? 'true' : undefined
                  }
                  className={`relative aspect-[4/3] w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white sm:w-24 ${
                    selectedImageIndex === index
                      ? 'border-accent'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
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
