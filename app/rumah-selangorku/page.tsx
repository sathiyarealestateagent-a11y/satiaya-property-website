import type { Metadata } from 'next';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  House,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  WalletCards,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { getSiteContent } from '@/db/content';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/src/config/site';
import { isRumahSelangorkuProperty } from '@/src/content/rumah-selangorku';
import type { EditableProperty } from '@/src/content/schema';

export const dynamic = 'force-dynamic';

const pageConfig = siteConfig.rumahSelangorku.page;

export const metadata: Metadata = {
  title: 'Rumah Selangorku',
  description:
    'Explore published Rumah Selangorku projects, available property information and enquiry options with Satiaya Selvan.',
  alternates: { canonical: siteConfig.rumahSelangorku.route },
  openGraph: {
    title: 'Rumah Selangorku | Satiaya Property',
    description:
      'Explore published Rumah Selangorku projects and contact Satiaya Selvan for current information.',
    url: siteConfig.rumahSelangorku.route,
    type: 'website',
    locale: 'en_MY',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rumah Selangorku | Satiaya Property',
    description:
      'Explore published Rumah Selangorku projects and contact Satiaya Selvan for current information.',
    images: ['/og.png'],
  },
};

function formatPrice(property: EditableProperty) {
  return property.type === 'rent'
    ? `RM ${property.price.toLocaleString('en-MY')} / month`
    : `RM ${property.price.toLocaleString('en-MY')}`;
}

function pageHref(href: string) {
  return href.startsWith('#') ? `/${href}` : href;
}

export default async function RumahSelangorkuPage() {
  const content = await getSiteContent();
  const projects = content.properties.filter(isRumahSelangorkuProperty);
  const whatsappHref = `https://wa.me/${content.whatsapp.number}?text=${encodeURIComponent(pageConfig.enquiryMessage)}`;
  const navigation = content.navigation.map((item) => ({
    ...item,
    href: pageHref(item.href),
  }));

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-[#E7E0D5] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Satiaya Property home"
          >
            <span className="grid size-10 place-items-center overflow-hidden rounded-xl bg-primary font-heading text-sm font-bold text-white shadow-[0_4px_12px_rgba(23,63,74,.14)]">
              {content.logo.image ? (
                <Image
                  src={content.logo.image}
                  alt={`${content.agent.name} logo`}
                  width={40}
                  height={40}
                  className="size-full object-contain"
                />
              ) : (
                content.logo.mark
              )}
            </span>
            <span>
              <span className="block font-heading text-[15px] font-bold tracking-tight text-primary">
                {content.agent.name}
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {content.agent.agency}
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-6 xl:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                aria-label={
                  item.href === siteConfig.rumahSelangorku.route
                    ? 'Rumah Selangorku'
                    : undefined
                }
                aria-current={
                  item.href === siteConfig.rumahSelangorku.route
                    ? 'page'
                    : undefined
                }
                className={
                  item.href === siteConfig.rumahSelangorku.route
                    ? 'inline-flex h-10 items-center rounded-lg bg-[#FFF4E5] px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B40000]'
                    : 'text-sm font-semibold text-[#363636] transition-colors hover:text-[#B40000]'
                }
              >
                {item.href === siteConfig.rumahSelangorku.route ? (
                  <Image
                    src="/selangorku-logo.png"
                    alt=""
                    width={112}
                    height={22}
                    className="h-[22px] w-auto"
                  />
                ) : (
                  item.label
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'hidden h-11 border-[#B40000] bg-[#B40000] text-white hover:border-[#8E0000] hover:bg-[#8E0000] sm:inline-flex',
              )}
            >
              Enquire
              <ArrowRight aria-hidden="true" />
            </a>
            <details className="group relative xl:hidden">
              <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-xl border border-[#E7E0D5] bg-white text-[#B40000] transition-colors hover:bg-[#FFF4E5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B40000] [&::-webkit-details-marker]:hidden">
                <Menu className="size-5" aria-hidden="true" />
                <span className="sr-only">Open navigation menu</span>
              </summary>
              <nav
                aria-label="Mobile navigation"
                className="absolute right-0 top-14 z-[var(--z-dropdown)] grid min-w-64 gap-1 rounded-2xl border border-[#E7E0D5] bg-white p-3 shadow-[0_18px_50px_rgba(74,26,18,.16)]"
              >
                {navigation.map((item) => (
                  <Link
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    aria-label={
                      item.href === siteConfig.rumahSelangorku.route
                        ? 'Rumah Selangorku'
                        : undefined
                    }
                    aria-current={
                      item.href === siteConfig.rumahSelangorku.route
                        ? 'page'
                        : undefined
                    }
                    className="flex min-h-12 items-center rounded-xl px-4 py-3 text-sm font-semibold text-[#363636] transition-colors hover:bg-[#FFF4E5] hover:text-[#B40000] aria-[current=page]:bg-[#FFF4E5]"
                  >
                    {item.href === siteConfig.rumahSelangorku.route ? (
                      <Image
                        src="/selangorku-logo.png"
                        alt=""
                        width={126}
                        height={25}
                        className="h-6 w-auto"
                      />
                    ) : (
                      item.label
                    )}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#F4F1EC] px-5 py-8 text-[#2A2825] sm:px-8 sm:py-12 lg:px-10 lg:py-16">
        <div
          className="absolute inset-x-0 bottom-0 h-2 bg-[#B40000]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[1.75rem] border border-[#E2D8C8] bg-white shadow-[0_24px_70px_rgba(92,40,24,.12)] lg:grid-cols-[1.16fr_0.84fr]">
          <div className="min-w-0 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm text-[#746D65]"
            >
              <Link href="/" className="transition-colors hover:text-[#B40000]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span
                aria-current="page"
                className="font-semibold text-[#403B35]"
              >
                Rumah Selangorku
              </span>
            </nav>

            <Image
              src="/selangorku-logo.png"
              alt="Selangorku"
              width={228}
              height={45}
              priority
              className="mt-10 h-auto w-[190px] sm:w-[228px]"
            />
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#B40000]">
              {pageConfig.eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold leading-[1.02] tracking-[-0.05em] text-[#27231F] sm:text-6xl lg:text-7xl">
              {pageConfig.title}
            </h1>
            <p className="mt-6 max-w-2xl border-l-2 border-[#E4B900] pl-5 text-base leading-8 text-[#625B54] sm:text-lg">
              {pageConfig.introduction}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#available-projects"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-12 border-[#E4B900] bg-[#F4CA18] px-6 text-[#2A2415] shadow-[0_8px_22px_rgba(180,116,0,.18)] hover:border-[#B40000] hover:bg-[#B40000] hover:text-white',
                )}
              >
                View available projects
                <ArrowRight aria-hidden="true" />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-12 border-[#CFC4B5] bg-white px-6 text-[#5D1A13] hover:border-[#B40000] hover:bg-[#FFF4E5] hover:text-[#B40000]',
                )}
              >
                <MessageCircle aria-hidden="true" />
                {pageConfig.whatsappButton}
              </a>
            </div>
          </div>

          <aside className="relative flex min-h-[26rem] min-w-0 flex-col justify-between overflow-hidden bg-[#B40000] px-7 py-10 text-white sm:px-10 sm:py-12 lg:min-h-full lg:px-12 lg:py-16">
            <div
              className="absolute -right-24 -top-24 size-72 rounded-full border border-white/15"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-20 -left-20 size-64 rounded-full border border-[#F4CA18]/35"
              aria-hidden="true"
            />
            <div className="relative">
              <span
                className="block h-1 w-16 bg-[#F4CA18]"
                aria-hidden="true"
              />
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#F8D94E]">
                {pageConfig.panelEyebrow}
              </p>
              <h2 className="mt-4 max-w-md font-heading text-4xl font-bold leading-[1.08] tracking-[-0.035em] sm:text-5xl">
                {pageConfig.panelTitle}
              </h2>
            </div>
            <ul className="relative mt-10 grid gap-4 border-t border-white/20 pt-7 text-sm font-semibold text-white/90">
              {pageConfig.panelItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    className="size-5 text-[#F4CA18]"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section
        id="available-projects"
        className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B40000]">
              Current information
            </p>
            <h2 className="mt-3 font-heading text-4xl font-bold tracking-[-0.04em] text-[#27231F] sm:text-5xl">
              {pageConfig.projectsTitle}
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              {pageConfig.projectsDescription}
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => {
                const image = project.images[0] || project.image;
                return (
                  <article
                    key={project.id}
                    className="group overflow-hidden rounded-[1.5rem] border border-[#E7DED1] bg-white shadow-[0_12px_36px_rgba(92,40,24,.07)]"
                  >
                    <Link
                      href={`/properties/${project.id}`}
                      className="relative block aspect-[4/3] overflow-hidden bg-muted"
                    >
                      {image ? (
                        <Image
                          src={image}
                          alt={`${project.title} in ${project.location}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="grid size-full place-items-center text-muted-foreground">
                          <House className="size-10" aria-hidden="true" />
                          <span className="sr-only">
                            No project image provided
                          </span>
                        </span>
                      )}
                    </Link>
                    <div className="p-6">
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin
                          className="size-4 text-[#B40000]"
                          aria-hidden="true"
                        />
                        {project.location}
                      </p>
                      <h3 className="mt-3 font-heading text-2xl font-bold leading-tight tracking-[-0.025em] text-[#27231F]">
                        <Link
                          href={`/properties/${project.id}`}
                          className="transition-colors hover:text-[#B40000]"
                        >
                          {project.title}
                        </Link>
                      </h3>
                      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-border pt-5 text-sm">
                        <div>
                          <dt className="flex items-center gap-2 text-muted-foreground">
                            <Building2
                              className="size-4 text-[#B40000]"
                              aria-hidden="true"
                            />
                            Property type
                          </dt>
                          <dd className="mt-1 font-semibold text-[#27231F]">
                            {project.propertyType}
                          </dd>
                        </div>
                        <div>
                          <dt className="flex items-center gap-2 text-muted-foreground">
                            <Maximize2
                              className="size-4 text-[#B40000]"
                              aria-hidden="true"
                            />
                            Built-up size
                          </dt>
                          <dd className="mt-1 font-semibold text-[#27231F]">
                            {project.size.toLocaleString('en-MY')} sq ft
                          </dd>
                        </div>
                        <div>
                          <dt className="flex items-center gap-2 text-muted-foreground">
                            <WalletCards
                              className="size-4 text-[#B40000]"
                              aria-hidden="true"
                            />
                            Price
                          </dt>
                          <dd className="mt-1 font-semibold text-[#27231F]">
                            {formatPrice(project)}
                          </dd>
                        </div>
                        <div>
                          <dt className="flex items-center gap-2 text-muted-foreground">
                            <Clock3
                              className="size-4 text-[#B40000]"
                              aria-hidden="true"
                            />
                            Project status
                          </dt>
                          <dd className="mt-1 font-semibold text-[#27231F]">
                            Not provided
                          </dd>
                        </div>
                      </dl>
                      <Link
                        href={`/properties/${project.id}`}
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'lg' }),
                          'mt-6 w-full border-[#B40000]/25 text-[#B40000] hover:border-[#B40000] hover:bg-[#FFF4E5]',
                        )}
                      >
                        View project details
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-[1.75rem] border border-dashed border-[#D3A59B] bg-[#FFF9F3] px-6 py-12 text-center sm:px-10 sm:py-16">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#FCE7C1] text-[#B40000]">
                <House className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-2xl font-bold text-[#27231F]">
                {pageConfig.emptyTitle}
              </h3>
              <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
                {pageConfig.emptyDescription}
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'mt-7 border-[#B40000] bg-[#B40000] text-white hover:border-[#8E0000] hover:bg-[#8E0000]',
                )}
              >
                <MessageCircle aria-hidden="true" />
                Ask about current projects
              </a>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-[#292321] px-5 pb-8 pt-12 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-[#2DB8B5] font-heading text-sm font-bold text-[#173F4A]">
                  {content.logo.mark}
                </span>
                <span>
                  <span className="block font-heading font-bold">
                    {content.agent.name}
                  </span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    {content.agent.agency}
                  </span>
                </span>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
                {content.footer.tagline}
              </p>
            </div>
            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60"
            >
              {navigation.map((item) => (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-col gap-3 pt-7 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {content.agent.name}.{' '}
              {content.footer.copyright}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to main website
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
