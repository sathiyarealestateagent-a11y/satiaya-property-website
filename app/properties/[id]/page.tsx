import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  Mail,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { cache } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { getSiteContent } from '@/db/content';
import { cn } from '@/lib/utils';

import { PropertyMedia, PropertyShare } from './property-media';

export const dynamic = 'force-dynamic';

type PropertyPageProps = {
  params: Promise<{ id: string }>;
};

const getPropertyPageData = cache(async (id: string) => {
  const propertyId = Number(id);
  if (!Number.isInteger(propertyId) || propertyId <= 0) return null;

  const content = await getSiteContent();
  const property = content.properties.find((item) => item.id === propertyId);
  return property ? { content, property } : null;
});

function formatPrice(type: 'sale' | 'rent', price: number) {
  const formatted = `RM ${price.toLocaleString('en-MY')}`;
  return type === 'rent' ? `${formatted} / month` : formatted;
}

function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getPropertyPageData(id);
  if (!data) return { title: 'Property not found' };

  const { property } = data;
  const description = `${property.propertyType} for ${property.type} in ${property.location}. ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms and ${property.size.toLocaleString('en-MY')} sq ft.`;

  return {
    title: `${property.title} | Satiaya Property`,
    description,
    openGraph: {
      title: property.title,
      description,
      images: [
        {
          url: property.images[0] ?? property.image,
          alt: property.title,
        },
      ],
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const data = await getPropertyPageData(id);
  if (!data) notFound();

  const { content, property } = data;
  const price = formatPrice(property.type, property.price);
  const listingReference = `SAT-${String(property.id).padStart(4, '0')}`;
  const images =
    property.images.length > 0
      ? property.images
      : property.image
        ? [property.image]
        : [];
  const mapLabel = property.address || property.location;
  const mapQuery =
    property.latitude !== null && property.longitude !== null
      ? `${property.latitude},${property.longitude}`
      : mapLabel;
  const enquiryMessage = `Hi ${content.agent.firstName}, I'm interested in ${property.title} at ${property.location}. Please share more details and viewing availability.`;
  const similarProperties = content.properties
    .filter((item) => item.id !== property.id && item.type === property.type)
    .slice(0, 3);

  const facts = [
    { label: 'Bedrooms', value: property.bedrooms, icon: BedDouble },
    { label: 'Bathrooms', value: property.bathrooms, icon: Bath },
    {
      label: 'Built-up area',
      value: `${property.size.toLocaleString('en-MY')} sq ft`,
      icon: Maximize2,
    },
    { label: 'Property type', value: property.propertyType, icon: Building2 },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Satiaya Property home"
          >
            <span className="grid size-10 place-items-center rounded-full bg-primary font-heading text-sm font-bold text-white">
              {content.logo.mark}
            </span>
            <span>
              <span className="block font-heading text-sm font-bold tracking-[-0.01em] text-primary">
                {content.agent.name}
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {content.agent.agency}
              </span>
            </span>
          </Link>
          <Link
            href="/#properties"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'px-4',
            )}
          >
            <ArrowLeft />
            <span className="hidden sm:inline">Back to properties</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-secondary">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/#properties"
            className="transition-colors hover:text-secondary"
          >
            Properties
          </Link>
          <span aria-hidden="true">/</span>
          <span
            className="max-w-60 truncate text-foreground"
            aria-current="page"
          >
            {property.title}
          </span>
        </nav>

        <div className="mt-6">
          <PropertyMedia
            images={images}
            title={property.title}
            mapQuery={mapQuery}
            mapLabel={mapLabel}
          />
        </div>

        <section className="py-8 sm:py-10">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="size-4 text-secondary" /> {property.location}
              </p>
              <h1 className="mt-3 font-heading text-3xl font-bold leading-[1.1] tracking-[-0.028em] text-primary sm:text-4xl lg:text-5xl">
                {property.title}
              </h1>
            </div>
            <div className="lg:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Asking price
              </p>
              <p className="mt-2 font-heading text-2xl font-bold text-primary sm:text-3xl">
                {price}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {facts.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-white p-4 sm:p-5"
              >
                <Icon className="size-5 text-secondary" />
                <p className="mt-4 font-heading text-base font-bold text-primary sm:text-lg">
                  {value}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-border pt-6">
            <PropertyShare title={property.title} />
          </div>
        </section>

        <div className="grid gap-8 border-t border-border py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-8">
            <section className="rounded-[22px] border border-border bg-white p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
                At a glance
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold tracking-[-0.02em] text-primary">
                Property details
              </h2>
              <dl className="mt-7 divide-y divide-border">
                {[
                  [
                    'Listing type',
                    `For ${property.type === 'sale' ? 'sale' : 'rent'}`,
                  ],
                  ['Category', property.propertyType],
                  ...(property.address
                    ? ([['Address', property.address]] as string[][])
                    : []),
                  [
                    'Floor area',
                    `${property.size.toLocaleString('en-MY')} sq ft`,
                  ],
                  ['Listing reference', listingReference],
                ].map(([term, description]) => (
                  <div
                    key={term}
                    className="grid grid-cols-2 gap-4 py-4 text-sm"
                  >
                    <dt className="text-muted-foreground">{term}</dt>
                    <dd className="text-right font-semibold text-foreground">
                      {description}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-[22px] border border-border bg-white p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
                Overview
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold tracking-[-0.02em] text-primary">
                About this property
              </h2>
              <p className="mt-5 max-w-3xl whitespace-pre-line text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8">
                {property.description ||
                  `This ${property.propertyType.toLowerCase()} in ${property.location} offers ${property.size.toLocaleString('en-MY')} sq ft of space with ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms. It is currently available for ${property.type === 'sale' ? 'sale' : 'rent'} at ${price}. Contact ${content.agent.firstName} to confirm availability, arrange a viewing and request complete property information.`}
              </p>
            </section>

            {[
              ['Package and promotions', property.packageDetails],
              ['Project information', property.projectInfo],
              ['Amenities and access', property.amenities],
            ].map(([heading, body]) =>
              body ? (
                <section
                  key={heading}
                  className="rounded-[22px] border border-border bg-white p-6 sm:p-8"
                >
                  <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-primary">
                    {heading}
                  </h2>
                  <p className="mt-5 whitespace-pre-line text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8">
                    {body}
                  </p>
                </section>
              ) : null,
            )}
          </div>

          <aside className="rounded-[22px] border border-border bg-white p-6 shadow-[0_12px_36px_rgba(23,63,74,.08)] lg:sticky lg:top-24">
            <div className="flex items-start gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={content.agent.profilePhoto}
                  alt={content.agent.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-heading text-lg font-bold text-primary">
                  {content.agent.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {content.agent.title}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-secondary">
                  {content.agent.agency}
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-xs font-semibold text-primary">
              <ShieldCheck className="size-4 text-secondary" /> Registered
              negotiator · {content.agent.registrationNumber}
            </div>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Ask about viewing times, availability or the full property
              information.
            </p>
            <a
              href={whatsappUrl(content.whatsapp.number, enquiryMessage)}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'mt-6 h-12 w-full px-5',
              )}
            >
              <MessageCircle /> WhatsApp {content.agent.firstName}
            </a>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <a
                href={`tel:${content.contact.phone.replace(/\s/g, '')}`}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-11 px-3',
                )}
              >
                <Phone /> Call
              </a>
              <a
                href={`mailto:${content.contact.email}`}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-11 px-3',
                )}
              >
                <Mail /> Email
              </a>
            </div>
          </aside>
        </div>

        {similarProperties.length > 0 && (
          <section className="border-t border-border py-12 sm:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
              Keep exploring
            </p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-primary sm:text-3xl">
                Similar listings
              </h2>
              <Link
                href="/#properties"
                className="hidden items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-secondary sm:flex"
              >
                View all <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {similarProperties.map((item) => (
                <Link
                  key={item.id}
                  href={`/properties/${item.id}`}
                  className="group overflow-hidden rounded-[18px] border border-border bg-white transition-all hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-[0_10px_28px_rgba(23,63,74,.09)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {item.location}
                    </p>
                    <h3 className="mt-2 font-heading font-bold text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm font-bold text-secondary">
                      {formatPrice(item.type, item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="bg-primary text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-heading font-bold">
            {content.agent.name} · {content.agent.agency}
          </p>
          <p className="text-sm text-white/70">{content.contact.serviceArea}</p>
        </div>
      </footer>
    </main>
  );
}
