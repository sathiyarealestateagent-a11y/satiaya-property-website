'use client';

import {
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronDown,
  Compass,
  Home,
  HousePlus,
  KeyRound,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { SyntheticEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { EditableProperty, SiteContent } from '@/src/content/schema';

const serviceIcons = [Home, KeyRound, HousePlus, Compass];

function InstagramIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M13.6 21v-8h2.85l.43-3.18H13.6V7.8c0-.92.26-1.55 1.64-1.55H17V3.41a23.5 23.5 0 0 0-2.56-.13c-2.54 0-4.28 1.55-4.28 4.4v2.14H7.3V13h2.86v8h3.44Z" />
    </svg>
  );
}

function TikTokIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M16.6 3c.28 1.74 1.25 3.17 2.9 4.03v3.01a8.03 8.03 0 0 1-2.9-.68v5.51A6.13 6.13 0 1 1 11.3 8.8v3.05a3.12 3.12 0 1 0 2.3 3.02V3h3Z" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12.04 2a9.8 9.8 0 0 0-8.47 14.72L2 22l5.43-1.52A9.97 9.97 0 1 0 12.04 2Zm0 17.97a8 8 0 0 1-4.08-1.12l-.29-.17-3.22.9.86-3.14-.19-.31a7.99 7.99 0 1 1 6.92 3.84Zm4.39-5.98c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18a7.2 7.2 0 0 1-1.33-1.65c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function formatPrice(property: EditableProperty) {
  return property.type === 'rent'
    ? `RM ${property.price.toLocaleString('en-MY')} / month`
    : `RM ${property.price.toLocaleString('en-MY')}`;
}

type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute(input: unknown): Promise<Record<string, unknown>>;
};

type WebMcpContext = {
  registerTool(
    tool: WebMcpTool,
    options?: { signal?: AbortSignal },
  ): void | Promise<void>;
};

export default function HomePage({ content }: { content: SiteContent }) {
  const siteConfig = content;
  const properties = content.properties;
  const navItems = content.navigation.map(
    (item) => [item.label, item.href] as const,
  );
  const services = content.servicesSection.items.map((service, index) => ({
    ...service,
    icon: serviceIcons[index % serviceIcons.length],
  }));
  const socialLinks = [
    {
      label: 'Instagram',
      href: siteConfig.social.instagram,
      icon: InstagramIcon,
    },
    { label: 'Facebook', href: siteConfig.social.facebook, icon: FacebookIcon },
    { label: 'TikTok', href: siteConfig.social.tiktok, icon: TikTokIcon },
  ].filter(
    (item) => item.label === 'TikTok' || (item.href && item.href !== '#'),
  );
  const locationOptions = useMemo(
    () => [
      'All locations',
      ...Array.from(
        new Set(properties.map((property) => property.location.split(',')[0])),
      ),
    ],
    [properties],
  );
  const propertyTypeOptions = useMemo(
    () => [
      'All types',
      ...Array.from(
        new Set(properties.map((property) => property.propertyType)),
      ),
    ],
    [properties],
  );
  const whatsappLink = (message: string = siteConfig.whatsapp.defaultMessage) =>
    `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [location, setLocation] = useState('All locations');
  const [propertyType, setPropertyType] = useState('All types');
  const [searchApplied, setSearchApplied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);

  const visibleProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesTab = property.type === listingType;
      if (!searchApplied) return matchesTab;
      const matchesLocation =
        location === 'All locations' || property.location.includes(location);
      const matchesType =
        propertyType === 'All types' || property.propertyType === propertyType;
      return matchesTab && matchesLocation && matchesType;
    });
  }, [listingType, location, properties, propertyType, searchApplied]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: WebMcpContext })
      .modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const allowedLocations = locationOptions;
    const allowedPropertyTypes = propertyTypeOptions;

    const registration = context.registerTool(
      {
        name: 'filter_properties',
        title: 'Filter properties',
        description:
          'Set the visible sale or rental tab and filter the property cards by location and property type.',
        inputSchema: {
          type: 'object',
          properties: {
            listingType: { type: 'string', enum: ['sale', 'rent'] },
            location: { type: 'string', enum: allowedLocations },
            propertyType: { type: 'string', enum: allowedPropertyTypes },
          },
          required: ['listingType'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) {
          if (!input || typeof input !== 'object') {
            throw new Error('A filter object is required.');
          }
          const candidate = input as Record<string, unknown>;
          if (
            candidate.listingType !== 'sale' &&
            candidate.listingType !== 'rent'
          ) {
            throw new Error('listingType must be sale or rent.');
          }
          const nextLocation =
            typeof candidate.location === 'string'
              ? candidate.location
              : 'All locations';
          const nextPropertyType =
            typeof candidate.propertyType === 'string'
              ? candidate.propertyType
              : 'All types';
          if (!allowedLocations.includes(nextLocation)) {
            throw new Error('Choose a supported location.');
          }
          if (!allowedPropertyTypes.includes(nextPropertyType)) {
            throw new Error('Choose a supported property type.');
          }

          setListingType(candidate.listingType);
          setLocation(nextLocation);
          setPropertyType(nextPropertyType);
          setSearchApplied(true);
          document
            .querySelector('#properties')
            ?.scrollIntoView({ behavior: 'smooth' });

          const resultCount = properties.filter(
            (property) =>
              property.type === candidate.listingType &&
              (nextLocation === 'All locations' ||
                property.location.includes(nextLocation)) &&
              (nextPropertyType === 'All types' ||
                property.propertyType === nextPropertyType),
          ).length;
          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          });
          return {
            listingType: candidate.listingType,
            location: nextLocation,
            propertyType: nextPropertyType,
            resultCount,
          };
        },
      },
      { signal: lifecycle.signal },
    );
    void Promise.resolve(registration).catch(() => undefined);

    return () => lifecycle.abort();
  }, [locationOptions, properties, propertyTypeOptions]);

  function submitContact(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormSent(true);
  }

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a
            href="#top"
            className="group flex items-center gap-3"
            aria-label="Back to top"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-primary font-heading text-sm font-bold tracking-wide text-primary-foreground shadow-[0_8px_20px_rgba(20,61,141,.16)] transition-transform group-hover:-rotate-3">
              {siteConfig.logo.image ? (
                <Image
                  src={siteConfig.logo.image}
                  alt={`${siteConfig.agent.name} logo`}
                  width={44}
                  height={44}
                  className="size-full rounded-2xl object-contain"
                />
              ) : (
                siteConfig.logo.mark
              )}
            </span>
            <span>
              <span className="block font-heading text-[15px] font-bold tracking-tight">
                {siteConfig.agent.name}
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {siteConfig.agent.agency}
              </span>
            </span>
          </a>

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Main navigation"
          >
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-semibold text-primary transition-colors hover:text-[#B08D20]"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}>
              <Button
                variant="ghost"
                className="h-11 rounded-full px-4 text-primary hover:bg-[#EDF2F7]"
              >
                <Phone className="size-4" />
                {siteConfig.contact.phone}
              </Button>
            </a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer">
              <Button className="h-11 rounded-full bg-[#D4AF37] px-5 text-[#143D8D] shadow-[0_8px_20px_rgba(20,61,141,.18)] hover:bg-[#E8C96A]">
                {siteConfig.header.cta}
                <ArrowRight />
              </Button>
            </a>
          </div>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-border bg-white lg:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav
            className="border-t border-border bg-white px-5 py-5 lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navItems.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 font-semibold text-primary hover:bg-[#EDF2F7] hover:text-[#B08D20]"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <section
        id="top"
        className="relative min-h-[780px] pt-20 lg:min-h-[760px]"
      >
        <div className="absolute inset-0 overflow-hidden bg-[#143D8D]">
          <Image
            src={siteConfig.hero.image}
            alt={siteConfig.hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {siteConfig.hero.video && (
            <video
              key={siteConfig.hero.video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={siteConfig.hero.image}
              aria-hidden="true"
              className="hero-video absolute inset-0 size-full object-cover object-center motion-reduce:hidden"
            >
              <source src={siteConfig.hero.video} />
            </video>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,61,141,.94)_0%,rgba(20,61,141,.79)_43%,rgba(43,95,184,.22)_73%,rgba(20,61,141,.18)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,transparent_0%,rgba(20,61,141,.08)_42%,rgba(20,61,141,.54)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#143D8D]/80 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-center px-5 pb-44 pt-16 sm:px-8 lg:px-10 lg:pb-36">
          <div className="relative max-w-[50rem] text-white">
            <div className="mb-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.19em] text-white/85">
              <span className="grid size-8 place-items-center rounded-full border border-[#E8C96A]/55 bg-[#D4AF37]/12 backdrop-blur-md">
                <Sparkles className="size-3.5 text-[#E8C96A]" />
              </span>
              {siteConfig.hero.eyebrow}
              <span className="h-px w-10 bg-[#E8C96A]/70" />
            </div>
            <h1 className="max-w-[48rem] font-heading text-[clamp(3.25rem,6.2vw,5.35rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-balance drop-shadow-[0_6px_28px_rgba(0,0,0,.28)]">
              {siteConfig.hero.title}
            </h1>
            <div className="mt-8 flex max-w-2xl items-stretch gap-4 sm:gap-5">
              <span className="w-px shrink-0 bg-gradient-to-b from-[#E8C96A] to-[#E8C96A]/20" />
              <p className="max-w-xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">
                {siteConfig.hero.description}
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <a href="#properties">
                <Button className="h-14 rounded-2xl bg-[#D4AF37] px-7 text-[#143D8D] shadow-[0_16px_38px_rgba(0,0,0,.24)] transition-all hover:-translate-y-0.5 hover:bg-[#E8C96A]">
                  {siteConfig.hero.primaryCta}
                  <ArrowRight />
                </Button>
              </a>
              <a
                href={whatsappLink(siteConfig.hero.secondaryMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center gap-2.5 rounded-2xl border border-white/25 bg-white/[.08] px-7 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/[.15]"
              >
                <WhatsAppIcon className="size-4" />
                {siteConfig.hero.secondaryCta}
              </a>
            </div>
            <div className="mt-10 flex w-fit flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/18 pt-5 text-[13px] font-semibold text-white/72">
              <span className="grid size-8 place-items-center rounded-full bg-white/[.09] ring-1 ring-white/15 backdrop-blur-sm">
                <ShieldCheck className="size-4 text-[#E8C96A]" />
              </span>
              <span>
                {siteConfig.agent.registrationNumber || 'Registered negotiator'}
              </span>
              <span className="size-1 rounded-full bg-[#E8C96A]/75" />
              <span>{siteConfig.agent.agency}</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-[42%] px-5 sm:px-8">
          <div className="mx-auto max-w-6xl rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_24px_80px_rgba(20,61,141,.20)] sm:p-6">
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <p className="font-heading text-lg font-bold text-[#143D8D]">
                  {siteConfig.search.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {siteConfig.search.description}
                </p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full bg-[#EDF2F7] px-3 py-1.5 text-xs font-semibold text-primary sm:flex">
                <ShieldCheck className="size-3.5" />{' '}
                {siteConfig.search.verifiedLabel}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
              <label className="relative">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  I&apos;m looking to
                </span>
                <select
                  value={listingType}
                  onChange={(event) => {
                    setListingType(event.target.value as 'sale' | 'rent');
                    setSearchApplied(false);
                  }}
                  className="h-12 w-full appearance-none rounded-xl border border-border bg-[#F7F8FA] px-4 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                >
                  <option value="sale">Buy a property</option>
                  <option value="rent">Rent a property</option>
                </select>
                <ChevronDown className="pointer-events-none absolute bottom-4 right-4 size-4 text-muted-foreground" />
              </label>
              <label className="relative">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  Location
                </span>
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-border bg-[#F7F8FA] px-4 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                >
                  {locationOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute bottom-4 right-4 size-4 text-muted-foreground" />
              </label>
              <label className="relative">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  Property type
                </span>
                <select
                  value={propertyType}
                  onChange={(event) => setPropertyType(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-border bg-[#F7F8FA] px-4 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                >
                  {propertyTypeOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute bottom-4 right-4 size-4 text-muted-foreground" />
              </label>
              <Button
                className="mt-auto h-12 rounded-xl bg-primary px-6 text-white hover:bg-secondary hover:text-white md:w-14 lg:w-auto"
                onClick={() => {
                  setSearchApplied(true);
                  document
                    .querySelector('#properties')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="Search properties"
              >
                <Search />
                <span className="md:hidden lg:inline">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="properties"
        className="scroll-mt-20 bg-[#F7F8FA] px-5 pb-24 pt-48 sm:px-8 lg:px-10 lg:pt-44"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">{siteConfig.featured.kicker}</p>
              <h2 className="section-title mt-3">
                {siteConfig.featured.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                {siteConfig.featured.description}
              </p>
            </div>
            <div
              className="inline-flex rounded-full border border-border bg-white p-1.5 shadow-sm"
              role="tablist"
              aria-label="Listing type"
            >
              {(['sale', 'rent'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={listingType === tab}
                  onClick={() => {
                    setListingType(tab);
                    setSearchApplied(false);
                  }}
                  className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                    listingType === tab
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  For {tab === 'sale' ? 'Sale' : 'Rent'}
                </button>
              ))}
            </div>
          </div>

          {visibleProperties.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleProperties.map((property) => (
                <article
                  key={property.id}
                  className="group overflow-hidden rounded-[24px] border border-[#E1E6ED] bg-white shadow-[0_10px_35px_rgba(20,61,141,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(20,61,141,.12)]"
                >
                  <div className="relative h-64 overflow-hidden bg-[#EDF2F7]">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className="rounded-full bg-white/92 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-primary backdrop-blur-sm">
                        For {property.type === 'sale' ? 'Sale' : 'Rent'}
                      </span>
                      {property.featured && (
                        <span className="rounded-full bg-[#D4AF37] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#143D8D]">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <MapPin className="size-3.5 text-[#D4AF37]" />
                      {property.location}
                    </div>
                    <h3 className="mt-3 font-heading text-xl font-bold tracking-tight text-[#143D8D]">
                      {property.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {property.propertyType}
                    </p>
                    <div className="mt-5 flex items-center gap-5 border-y border-border/70 py-4 text-xs font-semibold text-[#5B6574]">
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="size-4" /> {property.bedrooms}{' '}
                        beds
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bath className="size-4" /> {property.bathrooms} baths
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building2 className="size-4" />{' '}
                        {property.size.toLocaleString()} sq ft
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="font-heading text-lg font-bold text-primary">
                        {formatPrice(property)}
                      </p>
                      <a
                        href={whatsappLink(
                          `Hi Satiaya, I'm interested in ${property.title} at ${property.location}.`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="grid size-10 shrink-0 place-items-center rounded-full bg-[#EDF2F7] text-primary transition-colors hover:bg-primary hover:text-white"
                        aria-label={`Enquire about ${property.title}`}
                      >
                        <ArrowRight className="size-4" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[24px] border border-dashed border-primary/25 bg-white px-6 py-14 text-center">
              <Search className="mx-auto size-9 text-primary/45" />
              <h3 className="mt-4 font-heading text-xl font-bold">
                {siteConfig.featured.emptyTitle}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {siteConfig.featured.emptyDescription}
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <a
              href={whatsappLink(siteConfig.featured.moreMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="outline"
                className="h-12 rounded-full border-primary/25 bg-transparent px-6 text-primary hover:bg-primary hover:text-white"
              >
                {siteConfig.featured.moreLabel}
                <ArrowRight />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section
        id="owners"
        className="scroll-mt-20 bg-[#143D8D] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-xl">
            <div className="overflow-hidden rounded-[30px] border border-white/10">
              <Image
                src={siteConfig.ownerSection.image}
                alt={siteConfig.ownerSection.imageAlt}
                width={1000}
                height={920}
                className="h-[460px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-7 -right-2 max-w-[230px] rounded-2xl bg-[#F7F0D1] p-5 text-[#143D8D] shadow-2xl sm:right-6">
              <div className="flex items-center gap-1 text-[#D4AF37]">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 font-heading text-lg font-bold">
                {siteConfig.ownerSection.quote}
              </p>
            </div>
          </div>

          <div>
            <p className="section-kicker !text-[#E8C96A]">
              {siteConfig.ownerSection.kicker}
            </p>
            <h2 className="mt-4 max-w-xl font-heading text-4xl font-semibold leading-tight tracking-[-0.035em] text-balance sm:text-5xl">
              {siteConfig.ownerSection.title}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
              {siteConfig.ownerSection.description}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {siteConfig.ownerSection.checklist.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-semibold text-white/90"
                >
                  <CheckCircle2 className="size-5 shrink-0 text-[#E8C96A]" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={whatsappLink(siteConfig.ownerSection.primaryMessage)}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="h-12 rounded-full bg-[#D4AF37] px-6 text-[#143D8D] hover:bg-[#E8C96A]">
                  {siteConfig.ownerSection.primaryCta}
                  <ArrowRight />
                </Button>
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold hover:bg-white/10"
              >
                <Phone className="size-4" /> Call {siteConfig.agent.firstName}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="scroll-mt-20 bg-[#F7F8FA] px-5 py-20 sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-kicker">
              {siteConfig.servicesSection.kicker}
            </p>
            <h2 className="section-title mt-3">
              {siteConfig.servicesSection.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {siteConfig.servicesSection.description}
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="group rounded-[24px] border border-white bg-[#F7F8FA] p-7 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#EDF2F7] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <service.icon className="size-5" />
                  </span>
                  <span className="font-heading text-xs font-bold text-[#5B6574]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-7 font-heading text-xl font-bold text-[#143D8D]">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-20 bg-[#F7F8FA] px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div className="relative mx-auto max-w-md lg:mx-0">
            <div className="absolute -inset-5 translate-x-3 translate-y-3 rounded-[34px] border border-[#D4AF37]/40" />
            <div className="relative overflow-hidden rounded-[30px] bg-[#EDF2F7]">
              <Image
                src={siteConfig.agent.profilePhoto}
                alt={siteConfig.agent.name}
                width={800}
                height={1000}
                className="aspect-[4/5] w-full object-cover object-top"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/92 p-4 backdrop-blur-md">
                <p className="font-heading text-lg font-bold text-[#143D8D]">
                  {siteConfig.agent.name}
                </p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {siteConfig.agent.title} · {siteConfig.agent.agency}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="section-kicker">{siteConfig.about.kicker}</p>
            <h2 className="section-title mt-3 max-w-2xl">
              {siteConfig.about.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
              {siteConfig.about.bio}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              {siteConfig.about.approach}
            </p>
            <div className="mt-9 grid grid-cols-3 gap-4 border-y border-border py-7">
              {siteConfig.about.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={whatsappLink(siteConfig.about.ctaMessage)}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="h-12 rounded-full px-6">
                  {siteConfig.about.cta} <ArrowRight />
                </Button>
              </a>
              <p className="text-sm text-muted-foreground">
                Languages: {siteConfig.agent.languages.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-20 bg-[#EDF2F7] px-5 py-20 sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_70px_rgba(20,61,141,.10)] lg:grid-cols-[.8fr_1.2fr]">
          <div className="bg-primary p-8 text-white sm:p-12 lg:p-14">
            <p className="section-kicker !text-[#E8C96A]">
              {siteConfig.contactSection.kicker}
            </p>
            <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-[-0.035em]">
              {siteConfig.contactSection.title}
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/70">
              {siteConfig.contactSection.description}
            </p>
            <div className="mt-10 space-y-5">
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-4 text-sm font-semibold"
              >
                <span className="grid size-10 place-items-center rounded-full bg-white/10">
                  <Phone className="size-4" />
                </span>
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-4 text-sm font-semibold"
              >
                <span className="grid size-10 place-items-center rounded-full bg-white/10">
                  <Mail className="size-4" />
                </span>
                {siteConfig.contact.email}
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 text-sm font-semibold"
              >
                <span className="grid size-10 place-items-center rounded-full bg-[#2B5FB8]">
                  <WhatsAppIcon className="size-4" />
                </span>
                {siteConfig.contactSection.whatsappLabel}
              </a>
            </div>
          </div>

          <div className="p-8 sm:p-12 lg:p-14">
            {formSent ? (
              <output className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                <span className="grid size-16 place-items-center rounded-full bg-[#EDF2F7] text-primary">
                  <CheckCircle2 className="size-8" />
                </span>
                <h3 className="mt-5 font-heading text-2xl font-bold">
                  {siteConfig.contactSection.successTitle}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  {siteConfig.contactSection.successDescription}
                </p>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6"
                >
                  <Button className="h-11 rounded-full px-5">
                    <WhatsAppIcon /> {siteConfig.contactSection.successCta}
                  </Button>
                </a>
              </output>
            ) : (
              <form onSubmit={submitContact}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label htmlFor="contact-name" className="form-label">
                    {siteConfig.contactSection.nameLabel}
                    <Input
                      id="contact-name"
                      required
                      name="name"
                      placeholder={siteConfig.contactSection.namePlaceholder}
                      className="mt-2 h-12 rounded-xl bg-[#F7F8FA] px-4"
                    />
                  </label>
                  <label htmlFor="contact-phone" className="form-label">
                    {siteConfig.contactSection.phoneLabel}
                    <Input
                      id="contact-phone"
                      required
                      name="phone"
                      type="tel"
                      placeholder={siteConfig.contactSection.phonePlaceholder}
                      className="mt-2 h-12 rounded-xl bg-[#F7F8FA] px-4"
                    />
                  </label>
                  <label
                    htmlFor="contact-email"
                    className="form-label sm:col-span-2"
                  >
                    {siteConfig.contactSection.emailLabel}
                    <Input
                      id="contact-email"
                      required
                      name="email"
                      type="email"
                      placeholder={siteConfig.contactSection.emailPlaceholder}
                      className="mt-2 h-12 rounded-xl bg-[#F7F8FA] px-4"
                    />
                  </label>
                  <label
                    htmlFor="contact-interest"
                    className="form-label sm:col-span-2"
                  >
                    {siteConfig.contactSection.interestLabel}
                    <select
                      id="contact-interest"
                      name="interest"
                      className="mt-2 h-12 w-full rounded-xl border border-border bg-[#F7F8FA] px-4 text-sm outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                    >
                      {siteConfig.contactSection.interestOptions.map(
                        (option) => (
                          <option key={option}>{option}</option>
                        ),
                      )}
                    </select>
                  </label>
                  <label
                    htmlFor="contact-message"
                    className="form-label sm:col-span-2"
                  >
                    {siteConfig.contactSection.messageLabel}
                    <textarea
                      id="contact-message"
                      required
                      name="message"
                      rows={4}
                      placeholder={siteConfig.contactSection.messagePlaceholder}
                      className="mt-2 w-full resize-none rounded-xl border border-border bg-[#F7F8FA] px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                    />
                  </label>
                </div>
                <Button
                  type="submit"
                  className="mt-6 h-12 w-full rounded-xl sm:w-auto sm:px-8"
                >
                  {siteConfig.contactSection.submitLabel} <ArrowRight />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#143D8D] px-5 pb-8 pt-14 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <a href="#top" className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-[#D4AF37] font-heading text-sm font-bold text-[#143D8D]">
                  {siteConfig.logo.image ? (
                    <Image
                      src={siteConfig.logo.image}
                      alt={`${siteConfig.agent.name} logo`}
                      width={44}
                      height={44}
                      className="size-full rounded-full object-contain"
                    />
                  ) : (
                    siteConfig.logo.mark
                  )}
                </span>
                <span>
                  <span className="block font-heading text-base font-bold">
                    {siteConfig.agent.name}
                  </span>
                  <span className="block text-xs uppercase tracking-[0.12em] text-white/50">
                    {siteConfig.agent.agency}
                  </span>
                </span>
              </a>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
                {siteConfig.footer.tagline}
              </p>
              <div className="mt-6 flex gap-2">
                {socialLinks.map(({ icon: Icon, href, label }) => {
                  const isConfigured = Boolean(href && href !== '#');
                  const iconClass =
                    'grid size-10 place-items-center rounded-full border border-white/15 bg-white/[.04] text-white/75 transition-all';

                  return isConfigured ? (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Follow ${siteConfig.agent.firstName} on ${label}`}
                      title={label}
                      className={`${iconClass} hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#143D8D]`}
                    >
                      <Icon className="size-[17px]" />
                    </a>
                  ) : (
                    <span
                      key={label}
                      aria-label={`${label} profile link not set`}
                      title={`${label} — add your profile link in the dashboard`}
                      className={`${iconClass} cursor-default opacity-70`}
                    >
                      <Icon className="size-[17px]" />
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                {siteConfig.footer.exploreTitle}
              </p>
              <div className="mt-5 grid gap-3 text-sm text-white/60">
                {navItems.map(([label, href]) => (
                  <a key={href} href={href} className="hover:text-white">
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                {siteConfig.footer.contactTitle}
              </p>
              <div className="mt-5 grid gap-3 text-sm text-white/60">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                  className="hover:text-white"
                >
                  {siteConfig.contact.phone}
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-white"
                >
                  {siteConfig.contact.email}
                </a>
                <p>{siteConfig.contact.serviceArea}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.agent.name}.{' '}
              {siteConfig.footer.copyright}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Use
              </Link>
              <span>
                {siteConfig.agent.title} · {siteConfig.agent.agency}
              </span>
            </div>
          </div>
        </div>
      </footer>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 flex h-14 items-center gap-2 rounded-full bg-[#2B5FB8] px-4 text-sm font-bold text-white shadow-[0_12px_35px_rgba(20,61,141,.32)] transition-transform hover:-translate-y-1 sm:bottom-7 sm:right-7"
        aria-label="Chat with Satiaya on WhatsApp"
      >
        <WhatsAppIcon className="size-5" />
        <span className="hidden sm:inline">
          {siteConfig.footer.whatsappLabel}
        </span>
      </a>
    </main>
  );
}
