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
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import Image from 'next/image';
import type { SyntheticEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteConfig } from '@/src/config/site';
import { properties, type ListingType } from '@/src/data/properties';

const navItems = [
  ['Properties', '#properties'],
  ['Sell / Rent', '#owners'],
  ['Services', '#services'],
  ['About', '#about'],
  ['Contact', '#contact'],
] as const;

const services = [
  {
    icon: Home,
    title: 'Buy a property',
    description:
      'Shortlisted homes that match your needs, budget and preferred neighbourhood.',
  },
  {
    icon: KeyRound,
    title: 'Rent with confidence',
    description:
      'Clear guidance from viewing and negotiation through to tenancy handover.',
  },
  {
    icon: HousePlus,
    title: 'Sell or let',
    description:
      'Smart pricing, compelling presentation and qualified buyer or tenant matching.',
  },
  {
    icon: Compass,
    title: 'Property consultation',
    description:
      'Practical, local advice to help you make your next property move with clarity.',
  },
] as const;

function formatPrice(property: (typeof properties)[number]) {
  return property.type === 'rent'
    ? `RM ${property.price.toLocaleString('en-MY')} / month`
    : `RM ${property.price.toLocaleString('en-MY')}`;
}

function whatsappLink(message: string = siteConfig.whatsapp.defaultMessage) {
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
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

export default function HomePage() {
  const [listingType, setListingType] = useState<ListingType>('sale');
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
  }, [listingType, location, propertyType, searchApplied]);

  useEffect(() => {
    const context = (
      document as Document & { modelContext?: WebMcpContext }
    ).modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const allowedLocations = [
      'All locations',
      'Mont Kiara',
      'Bangsar',
      'Petaling Jaya',
      'Subang Jaya',
      'Cyberjaya',
      'Desa ParkCity',
    ];
    const allowedPropertyTypes = [
      'All types',
      'Condominium',
      'Terrace House',
      'Serviced Residence',
      'Semi-D',
    ];

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
          if (candidate.listingType !== 'sale' && candidate.listingType !== 'rent') {
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
          document.querySelector('#properties')?.scrollIntoView({ behavior: 'smooth' });

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
  }, []);

  function submitContact(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormSent(true);
  }

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#fbfaf6]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a href="#top" className="group flex items-center gap-3" aria-label="Back to top">
            <span className="grid size-10 place-items-center rounded-full bg-primary font-heading text-sm font-bold tracking-wide text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3">
              {siteConfig.logo.mark}
            </span>
            <span>
              <span className="block font-heading text-[15px] font-bold tracking-tight">
                {siteConfig.agent.name}
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {siteConfig.agent.agency}
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-[#37443e] transition-colors hover:text-primary"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}>
              <Button
                variant="ghost"
                className="h-11 rounded-full px-4 text-[#37443e] hover:bg-[#eef2ec]"
              >
                <Phone className="size-4" />
                {siteConfig.contact.phone}
              </Button>
            </a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer">
              <Button className="h-11 rounded-full bg-primary px-5 shadow-[0_8px_20px_rgba(37,88,67,.18)] hover:bg-[#194c37]">
                Let&apos;s talk
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
            className="border-t border-border bg-[#fbfaf6] px-5 py-5 lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navItems.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 font-medium hover:bg-[#eef2ec]"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <section id="top" className="relative min-h-[780px] pt-20 lg:min-h-[760px]">
        <div className="absolute inset-0">
          <Image
            src={siteConfig.hero.image}
            alt="Modern Malaysian residence with tropical landscaping"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,42,33,.9)_0%,rgba(22,42,33,.72)_42%,rgba(22,42,33,.12)_76%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(15,31,24,.45)_0%,transparent_38%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-center px-5 pb-44 pt-20 sm:px-8 lg:px-10 lg:pb-36">
          <div className="max-w-3xl text-white">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] backdrop-blur-sm">
              <Sparkles className="size-3.5 text-[#e9bd70]" />
              {siteConfig.hero.eyebrow}
            </div>
            <h1 className="max-w-2xl font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-balance sm:text-6xl lg:text-[76px]">
              {siteConfig.hero.title}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/78 sm:text-xl">
              {siteConfig.hero.description}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#properties">
                <Button className="h-13 rounded-full bg-[#d9974c] px-6 text-[#18372b] shadow-xl hover:bg-[#efb267]">
                  Explore properties
                  <ArrowRight />
                </Button>
              </a>
              <a
                href={whatsappLink('Hi Satiaya, I would like to discuss my property needs.')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/18"
              >
                <MessageCircle className="size-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-[42%] px-5 sm:px-8">
          <div className="mx-auto max-w-6xl rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_24px_80px_rgba(24,45,36,.2)] sm:p-6">
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <p className="font-heading text-lg font-bold text-[#18372b]">
                  Find your next property
                </p>
                <p className="text-xs text-muted-foreground">
                  Search selected homes across Klang Valley
                </p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full bg-[#eef4ef] px-3 py-1.5 text-xs font-semibold text-primary sm:flex">
                <ShieldCheck className="size-3.5" /> Verified listings
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
              <label className="relative">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  I&apos;m looking to
                </span>
                <select
                  value={listingType}
                  onChange={(event) => {
                    setListingType(event.target.value as ListingType);
                    setSearchApplied(false);
                  }}
                  className="h-12 w-full appearance-none rounded-xl border border-border bg-[#f9faf8] px-4 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                >
                  <option value="sale">Buy a property</option>
                  <option value="rent">Rent a property</option>
                </select>
                <ChevronDown className="pointer-events-none absolute bottom-4 right-4 size-4 text-muted-foreground" />
              </label>
              <label className="relative">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Location
                </span>
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-border bg-[#f9faf8] px-4 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                >
                  <option>All locations</option>
                  <option>Mont Kiara</option>
                  <option>Bangsar</option>
                  <option>Petaling Jaya</option>
                  <option>Subang Jaya</option>
                  <option>Cyberjaya</option>
                  <option>Desa ParkCity</option>
                </select>
                <ChevronDown className="pointer-events-none absolute bottom-4 right-4 size-4 text-muted-foreground" />
              </label>
              <label className="relative">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Property type
                </span>
                <select
                  value={propertyType}
                  onChange={(event) => setPropertyType(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-border bg-[#f9faf8] px-4 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                >
                  <option>All types</option>
                  <option>Condominium</option>
                  <option>Terrace House</option>
                  <option>Serviced Residence</option>
                  <option>Semi-D</option>
                </select>
                <ChevronDown className="pointer-events-none absolute bottom-4 right-4 size-4 text-muted-foreground" />
              </label>
              <Button
                className="mt-auto h-12 rounded-xl bg-primary px-6 md:w-14 lg:w-auto"
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
        className="scroll-mt-20 bg-[#fbfaf6] px-5 pb-24 pt-48 sm:px-8 lg:px-10 lg:pt-44"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">Curated for you</p>
              <h2 className="section-title mt-3">Featured properties</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                A handpicked selection of homes in some of Klang Valley&apos;s most
                sought-after neighbourhoods.
              </p>
            </div>
            <div
              className="inline-flex rounded-full border border-border bg-white p-1.5 shadow-sm"
              role="tablist"
              aria-label="Listing type"
            >
              {(['sale', 'rent'] as ListingType[]).map((tab) => (
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
                  className="group overflow-hidden rounded-[24px] border border-[#e5e3dc] bg-white shadow-[0_10px_35px_rgba(37,52,45,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(37,52,45,.12)]"
                >
                  <div className="relative h-64 overflow-hidden bg-[#e8ece7]">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className="rounded-full bg-white/92 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary backdrop-blur-sm">
                        For {property.type === 'sale' ? 'Sale' : 'Rent'}
                      </span>
                      {property.featured && (
                        <span className="rounded-full bg-[#d9974c] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#17382b]">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <MapPin className="size-3.5 text-[#bf7b39]" />
                      {property.location}
                    </div>
                    <h3 className="mt-3 font-heading text-xl font-bold tracking-tight text-[#19382d]">
                      {property.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {property.propertyType}
                    </p>
                    <div className="mt-5 flex items-center gap-5 border-y border-border/70 py-4 text-xs font-semibold text-[#53615a]">
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="size-4" /> {property.bedrooms} beds
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bath className="size-4" /> {property.bathrooms} baths
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building2 className="size-4" /> {property.size.toLocaleString()} sq ft
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
                        className="grid size-10 shrink-0 place-items-center rounded-full bg-[#edf3ef] text-primary transition-colors hover:bg-primary hover:text-white"
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
              <h3 className="mt-4 font-heading text-xl font-bold">No exact matches yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another location or property type, or message Satiaya for an
                off-market search.
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <a
              href={whatsappLink('Hi Satiaya, please share more available properties with me.')}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="outline"
                className="h-12 rounded-full border-primary/25 bg-transparent px-6 text-primary hover:bg-primary hover:text-white"
              >
                View more available properties
                <ArrowRight />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section
        id="owners"
        className="scroll-mt-20 bg-[#173c2d] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-xl">
            <div className="overflow-hidden rounded-[30px] border border-white/10">
              <Image
                src={siteConfig.ownerSection.image}
                alt="Property owner reviewing a home"
                width={1000}
                height={920}
                className="h-[460px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-7 -right-2 max-w-[230px] rounded-2xl bg-[#f3e5cf] p-5 text-[#18372b] shadow-2xl sm:right-6">
              <div className="flex items-center gap-1 text-[#bf7b39]">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 font-heading text-lg font-bold">
                Personal strategy, not a generic listing.
              </p>
            </div>
          </div>

          <div>
            <p className="section-kicker !text-[#e5af69]">For property owners</p>
            <h2 className="mt-4 max-w-xl font-heading text-4xl font-semibold leading-tight tracking-[-0.035em] text-balance sm:text-5xl">
              Thinking of selling or renting your property?
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
              Get a clear view of your property&apos;s market position and a tailored
              plan to reach serious buyers or tenants.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                'Current market assessment',
                'Pricing & positioning strategy',
                'Professional listing presentation',
                'Qualified enquiry management',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-semibold text-white/90"
                >
                  <CheckCircle2 className="size-5 shrink-0 text-[#e5af69]" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={whatsappLink(
                  'Hi Satiaya, I would like a property market assessment.',
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="h-12 rounded-full bg-[#d9974c] px-6 text-[#17382b] hover:bg-[#edb26d]">
                  Get a free assessment
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
        className="scroll-mt-20 bg-[#f1eee6] px-5 py-20 sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-kicker">How I can help</p>
            <h2 className="section-title mt-3">Property guidance, made personal</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Straightforward advice and attentive service at every step of your property
              journey.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="group rounded-[24px] border border-white bg-[#fbfaf6] p-7 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#e4ebe5] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <service.icon className="size-5" />
                  </span>
                  <span className="font-heading text-xs font-bold text-[#b7b3a8]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-7 font-heading text-xl font-bold text-[#19382d]">
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
        className="scroll-mt-20 bg-[#fbfaf6] px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div className="relative mx-auto max-w-md lg:mx-0">
            <div className="absolute -inset-5 translate-x-3 translate-y-3 rounded-[34px] border border-[#cfaa78]/40" />
            <div className="relative overflow-hidden rounded-[30px] bg-[#dfe7df]">
              <Image
                src={siteConfig.agent.profilePhoto}
                alt={siteConfig.agent.name}
                width={800}
                height={1000}
                className="aspect-[4/5] w-full object-cover object-top"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/92 p-4 backdrop-blur-md">
                <p className="font-heading text-lg font-bold text-[#19382d]">
                  {siteConfig.agent.name}
                </p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {siteConfig.agent.title} · {siteConfig.agent.agency}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="section-kicker">Meet your negotiator</p>
            <h2 className="section-title mt-3 max-w-2xl">
              A trusted partner for your property decisions.
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
                href={whatsappLink('Hi Satiaya, I would like to arrange a consultation.')}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="h-12 rounded-full px-6">
                  Book a consultation <ArrowRight />
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
        className="scroll-mt-20 bg-[#e8efe9] px-5 py-20 sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_70px_rgba(40,65,53,.1)] lg:grid-cols-[.8fr_1.2fr]">
          <div className="bg-primary p-8 text-white sm:p-12 lg:p-14">
            <p className="section-kicker !text-[#e5af69]">Let&apos;s connect</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-[-0.035em]">
              Ready to make your next move?
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/70">
              Tell me what you&apos;re looking for. I&apos;ll get back to you with practical
              next steps and zero pressure.
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
                <span className="grid size-10 place-items-center rounded-full bg-[#30b86a]">
                  <MessageCircle className="size-4" />
                </span>
                WhatsApp me directly
              </a>
            </div>
          </div>

          <div className="p-8 sm:p-12 lg:p-14">
            {formSent ? (
              <output
                className="flex h-full min-h-80 flex-col items-center justify-center text-center"
              >
                <span className="grid size-16 place-items-center rounded-full bg-[#e4f2e8] text-primary">
                  <CheckCircle2 className="size-8" />
                </span>
                <h3 className="mt-5 font-heading text-2xl font-bold">
                  Thank you for reaching out.
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Your enquiry is ready. In Phase 1 this form is a front-end demo; for an
                  immediate reply, please use WhatsApp.
                </p>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6"
                >
                  <Button className="h-11 rounded-full px-5">
                    <MessageCircle /> Continue on WhatsApp
                  </Button>
                </a>
              </output>
            ) : (
              <form onSubmit={submitContact}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label htmlFor="contact-name" className="form-label">
                    Full name
                    <Input
                      id="contact-name"
                      required
                      name="name"
                      placeholder="Your name"
                      className="mt-2 h-12 rounded-xl bg-[#f8f9f7] px-4"
                    />
                  </label>
                  <label htmlFor="contact-phone" className="form-label">
                    Phone number
                    <Input
                      id="contact-phone"
                      required
                      name="phone"
                      type="tel"
                      placeholder="+60"
                      className="mt-2 h-12 rounded-xl bg-[#f8f9f7] px-4"
                    />
                  </label>
                  <label htmlFor="contact-email" className="form-label sm:col-span-2">
                    Email address
                    <Input
                      id="contact-email"
                      required
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="mt-2 h-12 rounded-xl bg-[#f8f9f7] px-4"
                    />
                  </label>
                  <label htmlFor="contact-interest" className="form-label sm:col-span-2">
                    I&apos;m interested in
                    <select
                      id="contact-interest"
                      name="interest"
                      className="mt-2 h-12 w-full rounded-xl border border-border bg-[#f8f9f7] px-4 text-sm outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                    >
                      <option>Buying a property</option>
                      <option>Renting a property</option>
                      <option>Selling my property</option>
                      <option>Renting out my property</option>
                      <option>General consultation</option>
                    </select>
                  </label>
                  <label htmlFor="contact-message" className="form-label sm:col-span-2">
                    How can I help?
                    <textarea
                      id="contact-message"
                      required
                      name="message"
                      rows={4}
                      placeholder="Share a little about what you need..."
                      className="mt-2 w-full resize-none rounded-xl border border-border bg-[#f8f9f7] px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                    />
                  </label>
                </div>
                <Button type="submit" className="mt-6 h-12 w-full rounded-xl sm:w-auto sm:px-8">
                  Send enquiry <ArrowRight />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#102c21] px-5 pb-8 pt-14 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <a href="#top" className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-[#d9974c] font-heading text-sm font-bold text-[#17382b]">
                  {siteConfig.logo.mark}
                </span>
                <span>
                  <span className="block font-heading text-base font-bold">
                    {siteConfig.agent.name}
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-white/50">
                    {siteConfig.agent.agency}
                  </span>
                </span>
              </a>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
                {siteConfig.footer.tagline}
              </p>
              <div className="mt-6 flex gap-2">
                {[
                  ['IG', siteConfig.social.instagram, 'Instagram'],
                  ['f', siteConfig.social.facebook, 'Facebook'],
                  ['in', siteConfig.social.linkedin, 'LinkedIn'],
                ].map(([mark, href, label]) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="grid size-9 place-items-center rounded-full border border-white/15 text-[11px] font-bold text-white/70 hover:border-[#d9974c] hover:text-[#d9974c]"
                  >
                    {mark}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#d9974c]">
                Explore
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
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#d9974c]">
                Contact
              </p>
              <div className="mt-5 grid gap-3 text-sm text-white/60">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                  className="hover:text-white"
                >
                  {siteConfig.contact.phone}
                </a>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">
                  {siteConfig.contact.email}
                </a>
                <p>{siteConfig.contact.serviceArea}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.agent.name}. All rights reserved.
            </p>
            <p>
              {siteConfig.agent.title} · {siteConfig.agent.agency}
            </p>
          </div>
        </div>
      </footer>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 flex h-14 items-center gap-2 rounded-full bg-[#27b766] px-4 text-sm font-bold text-white shadow-[0_12px_35px_rgba(25,112,62,.35)] transition-transform hover:-translate-y-1 sm:bottom-7 sm:right-7"
        aria-label="Chat with Satiaya on WhatsApp"
      >
        <MessageCircle className="size-5 fill-white/15" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </main>
  );
}
