'use client';

import {
  ArrowLeft,
  BadgeDollarSign,
  Building2,
  Check,
  CircleUserRound,
  ExternalLink,
  FileText,
  Globe2,
  ImageUp,
  KeyRound,
  LoaderCircle,
  LogOut,
  Plus,
  Save,
  Settings2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useId, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { EditableProperty, SiteContent } from '@/src/content/schema';

type PathPart = string | number;

function setAtPath(
  content: SiteContent,
  path: PathPart[],
  value: unknown,
): SiteContent {
  const next = structuredClone(content);
  let cursor: object = next;
  for (const part of path.slice(0, -1)) {
    const nested = Reflect.get(cursor, part);
    if (!nested || typeof nested !== 'object') return content;
    cursor = nested;
  }
  Reflect.set(cursor, path[path.length - 1], value);
  return next;
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#526159]"
    >
      {label}
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-xl border-[#dfe4df] bg-[#fbfcfa] px-3.5 text-sm font-medium normal-case tracking-normal shadow-none transition focus-visible:border-[#2e6b50] focus-visible:ring-[#2e6b50]/12"
      />
    </label>
  );
}

function LongField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#526159]"
    >
      {label}
      <Textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border-[#dfe4df] bg-[#fbfcfa] px-3.5 py-3 text-sm font-medium normal-case leading-6 tracking-normal shadow-none transition focus-visible:border-[#2e6b50] focus-visible:ring-[#2e6b50]/12"
      />
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
  kind = 'image',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  kind?: 'image' | 'video';
}) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File) {
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !result.url)
        throw new Error(result.error ?? 'Upload failed.');
      onChange(result.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : 'Upload failed.',
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#526159]">
        {label}
      </span>
      <div className="grid gap-4 rounded-2xl border border-dashed border-[#c9d4cc] bg-[#f7faf7] p-4 sm:grid-cols-[132px_1fr] sm:items-center">
        <div className="relative h-28 overflow-hidden rounded-xl bg-[#e8ece7] ring-1 ring-black/5">
          {value && kind === 'video' ? (
            <video
              src={value}
              muted
              loop
              autoPlay
              playsInline
              className="size-full object-cover"
            />
          ) : value ? (
            <Image
              src={value}
              alt="Current upload"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <ImageUp className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
          )}
        </div>
        <div className="grid gap-3">
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={`Paste a ${kind} URL`}
            className="h-11 rounded-xl border-[#dfe4df] bg-white"
          />
          <div>
            <input
              id={id}
              type="file"
              accept={
                kind === 'video'
                  ? 'video/mp4,video/webm'
                  : 'image/jpeg,image/png,image/webp,image/gif'
              }
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
                event.target.value = '';
              }}
            />
            <label
              htmlFor={id}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#173c2d] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#21523d]"
            >
              {uploading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <ImageUp className="size-4" />
              )}
              {uploading ? 'Uploading…' : `Upload ${kind}`}
            </label>
            <span className="ml-3 text-xs text-muted-foreground">
              {kind === 'video'
                ? 'MP4 or WebM · 20 MB max'
                : 'JPG, PNG, WebP or GIF · 20 MB max'}
            </span>
          </div>
          {error && (
            <p className="text-xs font-semibold text-destructive">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-[24px] border border-[#e5e8e4] bg-white shadow-[0_14px_40px_rgba(27,55,43,.055)]">
      <CardHeader className="border-b border-[#edf0ed] bg-[linear-gradient(135deg,#ffffff_0%,#fbfcfa_100%)] px-6 pb-5 pt-6 sm:px-7">
        <CardTitle className="font-heading text-xl font-bold tracking-[-0.02em] text-[#17382b]">
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-6 px-6 py-6 sm:px-7">
        {children}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard({
  initialContent,
  userEmail,
}: {
  initialContent: SiteContent;
  userEmail: string;
}) {
  const [draft, setDraft] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);

  function update(path: PathPart[], value: unknown) {
    setDraft((current) => setAtPath(current, path, value));
    setStatus('idle');
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    setStatus('idle');
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error ?? 'Unable to save changes.');
      setStatus('saved');
      setMessage('Changes are live on your website.');
      setDirty(false);
    } catch (saveError) {
      setStatus('error');
      setMessage(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save changes.',
      );
    } finally {
      setSaving(false);
    }
  }

  function addProperty() {
    const property: EditableProperty = {
      id: Math.max(0, ...draft.properties.map((item) => item.id)) + 1,
      title: 'New property',
      location: 'Kuala Lumpur',
      propertyType: 'Condominium',
      type: 'sale',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      size: 0,
      image: '',
      featured: false,
    };
    update(['properties'], [...draft.properties, property]);
  }

  const dashboardStats = [
    { label: 'All listings', value: draft.properties.length, icon: Building2 },
    {
      label: 'For sale',
      value: draft.properties.filter((item) => item.type === 'sale').length,
      icon: BadgeDollarSign,
    },
    {
      label: 'For rent',
      value: draft.properties.filter((item) => item.type === 'rent').length,
      icon: KeyRound,
    },
    {
      label: 'Featured',
      value: draft.properties.filter((item) => item.featured).length,
      icon: Sparkles,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f5f1] text-foreground">
      <header className="sticky top-0 z-40 border-b border-[#dde3de] bg-[#fbfcfa]/92 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-[1520px] flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="grid size-11 place-items-center rounded-xl border border-[#dce3dd] bg-white text-primary shadow-sm transition hover:-translate-x-0.5 hover:border-primary/30"
              aria-label="Back to website"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-lg font-bold tracking-[-0.02em] text-[#17382b]">
                  Content studio
                </h1>
                <Badge className="rounded-full bg-[#e9f1ea] text-[#285a44] shadow-none">
                  Owner
                </Badge>
                {dirty && (
                  <Badge className="rounded-full bg-[#fff1d9] text-[#8b571f] shadow-none">
                    Unsaved
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Edit and publish satiayaproperty.com.my · {userEmail}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" rel="noreferrer">
              <Button
                variant="outline"
                className="h-10 rounded-xl border-[#dce3dd] bg-white px-4 shadow-sm"
              >
                Preview site <ExternalLink />
              </Button>
            </Link>
            <Button
              onClick={() => void save()}
              disabled={saving || !dirty}
              className="h-10 rounded-xl bg-[#173c2d] px-5 shadow-[0_8px_20px_rgba(23,60,45,.18)] hover:bg-[#21523d] disabled:opacity-50"
            >
              {saving ? <LoaderCircle className="animate-spin" /> : <Save />}
              {saving ? 'Saving…' : 'Save & publish'}
            </Button>
            <form action="/admin/logout" method="post">
              <Button
                type="submit"
                variant="ghost"
                className="h-10 rounded-xl px-3 text-muted-foreground hover:text-destructive"
                aria-label="Sign out"
              >
                <LogOut />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 sm:py-9">
        {status !== 'idle' && (
          <output
            className={`mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${status === 'saved' ? 'bg-[#e3f2e7] text-[#1d6744]' : 'bg-red-50 text-destructive'}`}
          >
            {status === 'saved' && <Check className="size-4" />}
            {message}
          </output>
        )}

        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {dashboardStats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-[#e2e7e2] bg-white p-4 shadow-[0_8px_24px_rgba(27,55,43,.04)] sm:p-5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eaf1eb] text-[#285a44]">
                <Icon className="size-[18px]" />
              </span>
              <div>
                <p className="font-heading text-xl font-bold leading-none text-[#17382b]">
                  {value}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Tabs
          defaultValue="identity"
          className="gap-7 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start"
        >
          <TabsList className="sticky top-28 hidden h-auto w-full flex-col items-stretch gap-2 rounded-[24px] bg-[#14382b] p-3 text-white shadow-[0_18px_45px_rgba(20,56,43,.16)] lg:flex">
            <div className="mb-2 rounded-2xl border border-white/10 bg-white/[.06] p-4 text-left">
              <span className="grid size-9 place-items-center rounded-xl bg-[#00ff88] text-[#103427]">
                <Globe2 className="size-[18px]" />
              </span>
              <p className="mt-3 font-heading text-sm font-bold">
                Website controls
              </p>
              <p className="mt-1 text-xs leading-5 text-white/55">
                Choose a section, make changes, then publish.
              </p>
            </div>
            <TabsTrigger
              value="identity"
              className="h-12 justify-start rounded-xl px-3 text-white/65 hover:bg-white/[.07] hover:text-white data-[state=active]:bg-[#00ff88] data-[state=active]:text-[#103427] data-[state=active]:shadow-none"
            >
              <CircleUserRound /> Brand & contact
            </TabsTrigger>
            <TabsTrigger
              value="homepage"
              className="h-12 justify-start rounded-xl px-3 text-white/65 hover:bg-white/[.07] hover:text-white data-[state=active]:bg-[#00ff88] data-[state=active]:text-[#103427] data-[state=active]:shadow-none"
            >
              <FileText /> Homepage content
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="h-12 justify-start rounded-xl px-3 text-white/65 hover:bg-white/[.07] hover:text-white data-[state=active]:bg-[#00ff88] data-[state=active]:text-[#103427] data-[state=active]:shadow-none"
            >
              <Settings2 /> Services
            </TabsTrigger>
            <TabsTrigger
              value="properties"
              className="h-12 justify-start rounded-xl px-3 text-white/65 hover:bg-white/[.07] hover:text-white data-[state=active]:bg-[#00ff88] data-[state=active]:text-[#103427] data-[state=active]:shadow-none"
            >
              <Building2 /> Properties
            </TabsTrigger>
          </TabsList>
          <TabsList className="mb-5 flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-[#dfe4df] bg-white p-1.5 lg:hidden">
            <TabsTrigger
              value="identity"
              className="h-10 shrink-0 rounded-xl data-[state=active]:bg-[#173c2d] data-[state=active]:text-[#00ff88]"
            >
              <CircleUserRound /> Brand
            </TabsTrigger>
            <TabsTrigger
              value="homepage"
              className="h-10 shrink-0 rounded-xl data-[state=active]:bg-[#173c2d] data-[state=active]:text-[#00ff88]"
            >
              <FileText /> Homepage
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="h-10 shrink-0 rounded-xl data-[state=active]:bg-[#173c2d] data-[state=active]:text-[#00ff88]"
            >
              <Settings2 /> Services
            </TabsTrigger>
            <TabsTrigger
              value="properties"
              className="h-10 shrink-0 rounded-xl data-[state=active]:bg-[#173c2d] data-[state=active]:text-[#00ff88]"
            >
              <Building2 /> Properties
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="grid gap-6">
            <SectionCard
              title="Agent profile"
              description="Your name and professional identity across the website."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full name"
                  value={draft.agent.name}
                  onChange={(value) => update(['agent', 'name'], value)}
                />
                <Field
                  label="First name"
                  value={draft.agent.firstName}
                  onChange={(value) => update(['agent', 'firstName'], value)}
                />
                <Field
                  label="Professional title"
                  value={draft.agent.title}
                  onChange={(value) => update(['agent', 'title'], value)}
                />
                <Field
                  label="Agency"
                  value={draft.agent.agency}
                  onChange={(value) => update(['agent', 'agency'], value)}
                />
                <Field
                  label="REN number"
                  value={draft.agent.registrationNumber}
                  onChange={(value) =>
                    update(['agent', 'registrationNumber'], value)
                  }
                />
                <Field
                  label="Languages (comma separated)"
                  value={draft.agent.languages.join(', ')}
                  onChange={(value) =>
                    update(
                      ['agent', 'languages'],
                      value
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </div>
              <ImageField
                label="Profile photo"
                value={draft.agent.profilePhoto}
                onChange={(value) => update(['agent', 'profilePhoto'], value)}
              />
            </SectionCard>

            <SectionCard title="Logo & navigation">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Logo initials"
                  value={draft.logo.mark}
                  onChange={(value) => update(['logo', 'mark'], value)}
                />
                <ImageField
                  label="Logo image (optional)"
                  value={draft.logo.image}
                  onChange={(value) => update(['logo', 'image'], value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {draft.navigation.map((item, index) => (
                  <Field
                    key={item.href}
                    label={`Menu label ${index + 1}`}
                    value={item.label}
                    onChange={(value) =>
                      update(['navigation', index, 'label'], value)
                    }
                  />
                ))}
              </div>
              <Field
                label="Header button"
                value={draft.header.cta}
                onChange={(value) => update(['header', 'cta'], value)}
              />
            </SectionCard>

            <SectionCard title="Contact & social links">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Phone"
                  value={draft.contact.phone}
                  onChange={(value) => update(['contact', 'phone'], value)}
                />
                <Field
                  label="Email"
                  value={draft.contact.email}
                  onChange={(value) => update(['contact', 'email'], value)}
                />
                <Field
                  label="Service area"
                  value={draft.contact.serviceArea}
                  onChange={(value) =>
                    update(['contact', 'serviceArea'], value)
                  }
                />
                <Field
                  label="WhatsApp number (digits only)"
                  value={draft.whatsapp.number}
                  onChange={(value) => update(['whatsapp', 'number'], value)}
                />
                <Field
                  label="Instagram URL"
                  value={draft.social.instagram}
                  onChange={(value) => update(['social', 'instagram'], value)}
                />
                <Field
                  label="Facebook URL"
                  value={draft.social.facebook}
                  onChange={(value) => update(['social', 'facebook'], value)}
                />
                <Field
                  label="TikTok URL"
                  value={draft.social.tiktok}
                  onChange={(value) => update(['social', 'tiktok'], value)}
                />
              </div>
              <LongField
                label="Default WhatsApp message"
                value={draft.whatsapp.defaultMessage}
                onChange={(value) =>
                  update(['whatsapp', 'defaultMessage'], value)
                }
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="homepage" className="grid gap-6">
            <SectionCard title="Hero section">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Eyebrow"
                  value={draft.hero.eyebrow}
                  onChange={(value) => update(['hero', 'eyebrow'], value)}
                />
                <Field
                  label="Headline"
                  value={draft.hero.title}
                  onChange={(value) => update(['hero', 'title'], value)}
                />
              </div>
              <LongField
                label="Description"
                value={draft.hero.description}
                onChange={(value) => update(['hero', 'description'], value)}
              />
              <ImageField
                label="Hero image"
                value={draft.hero.image}
                onChange={(value) => update(['hero', 'image'], value)}
              />
              <ImageField
                label="Hero background video"
                value={draft.hero.video}
                onChange={(value) => update(['hero', 'video'], value)}
                kind="video"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Image description"
                  value={draft.hero.imageAlt}
                  onChange={(value) => update(['hero', 'imageAlt'], value)}
                />
                <Field
                  label="Primary button"
                  value={draft.hero.primaryCta}
                  onChange={(value) => update(['hero', 'primaryCta'], value)}
                />
                <Field
                  label="WhatsApp button"
                  value={draft.hero.secondaryCta}
                  onChange={(value) => update(['hero', 'secondaryCta'], value)}
                />
                <Field
                  label="WhatsApp message"
                  value={draft.hero.secondaryMessage}
                  onChange={(value) =>
                    update(['hero', 'secondaryMessage'], value)
                  }
                />
              </div>
            </SectionCard>

            <SectionCard title="Property search & featured heading">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Search title"
                  value={draft.search.title}
                  onChange={(value) => update(['search', 'title'], value)}
                />
                <Field
                  label="Verified label"
                  value={draft.search.verifiedLabel}
                  onChange={(value) =>
                    update(['search', 'verifiedLabel'], value)
                  }
                />
                <Field
                  label="Featured kicker"
                  value={draft.featured.kicker}
                  onChange={(value) => update(['featured', 'kicker'], value)}
                />
                <Field
                  label="Featured title"
                  value={draft.featured.title}
                  onChange={(value) => update(['featured', 'title'], value)}
                />
              </div>
              <LongField
                label="Search description"
                value={draft.search.description}
                onChange={(value) => update(['search', 'description'], value)}
              />
              <LongField
                label="Featured description"
                value={draft.featured.description}
                onChange={(value) => update(['featured', 'description'], value)}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="No results title"
                  value={draft.featured.emptyTitle}
                  onChange={(value) =>
                    update(['featured', 'emptyTitle'], value)
                  }
                />
                <Field
                  label="More properties button"
                  value={draft.featured.moreLabel}
                  onChange={(value) => update(['featured', 'moreLabel'], value)}
                />
              </div>
            </SectionCard>

            <SectionCard title="Owner sell / rent section">
              <ImageField
                label="Owner section image"
                value={draft.ownerSection.image}
                onChange={(value) => update(['ownerSection', 'image'], value)}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Kicker"
                  value={draft.ownerSection.kicker}
                  onChange={(value) =>
                    update(['ownerSection', 'kicker'], value)
                  }
                />
                <Field
                  label="Title"
                  value={draft.ownerSection.title}
                  onChange={(value) => update(['ownerSection', 'title'], value)}
                />
                <Field
                  label="Quote card"
                  value={draft.ownerSection.quote}
                  onChange={(value) => update(['ownerSection', 'quote'], value)}
                />
                <Field
                  label="Button"
                  value={draft.ownerSection.primaryCta}
                  onChange={(value) =>
                    update(['ownerSection', 'primaryCta'], value)
                  }
                />
              </div>
              <LongField
                label="Description"
                value={draft.ownerSection.description}
                onChange={(value) =>
                  update(['ownerSection', 'description'], value)
                }
              />
              <LongField
                label="Checklist (one item per line)"
                value={draft.ownerSection.checklist.join('\n')}
                onChange={(value) =>
                  update(
                    ['ownerSection', 'checklist'],
                    value.split('\n').filter(Boolean),
                  )
                }
                rows={5}
              />
            </SectionCard>

            <SectionCard title="About section">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Kicker"
                  value={draft.about.kicker}
                  onChange={(value) => update(['about', 'kicker'], value)}
                />
                <Field
                  label="Title"
                  value={draft.about.title}
                  onChange={(value) => update(['about', 'title'], value)}
                />
                <Field
                  label="Button"
                  value={draft.about.cta}
                  onChange={(value) => update(['about', 'cta'], value)}
                />
                <Field
                  label="Button message"
                  value={draft.about.ctaMessage}
                  onChange={(value) => update(['about', 'ctaMessage'], value)}
                />
              </div>
              <LongField
                label="Biography"
                value={draft.about.bio}
                onChange={(value) => update(['about', 'bio'], value)}
              />
              <LongField
                label="Approach"
                value={draft.about.approach}
                onChange={(value) => update(['about', 'approach'], value)}
              />
              <div className="grid gap-5 sm:grid-cols-3">
                {draft.about.stats.map((stat, index) => (
                  <div
                    key={`${stat.label}-${index}`}
                    className="grid gap-3 rounded-xl border border-border p-4"
                  >
                    <Field
                      label="Stat value"
                      value={stat.value}
                      onChange={(value) =>
                        update(['about', 'stats', index, 'value'], value)
                      }
                    />
                    <Field
                      label="Stat label"
                      value={stat.label}
                      onChange={(value) =>
                        update(['about', 'stats', index, 'label'], value)
                      }
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Contact form & footer">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Contact kicker"
                  value={draft.contactSection.kicker}
                  onChange={(value) =>
                    update(['contactSection', 'kicker'], value)
                  }
                />
                <Field
                  label="Contact title"
                  value={draft.contactSection.title}
                  onChange={(value) =>
                    update(['contactSection', 'title'], value)
                  }
                />
                <Field
                  label="Submit button"
                  value={draft.contactSection.submitLabel}
                  onChange={(value) =>
                    update(['contactSection', 'submitLabel'], value)
                  }
                />
                <Field
                  label="Success title"
                  value={draft.contactSection.successTitle}
                  onChange={(value) =>
                    update(['contactSection', 'successTitle'], value)
                  }
                />
              </div>
              <LongField
                label="Contact description"
                value={draft.contactSection.description}
                onChange={(value) =>
                  update(['contactSection', 'description'], value)
                }
              />
              <LongField
                label="Success message"
                value={draft.contactSection.successDescription}
                onChange={(value) =>
                  update(['contactSection', 'successDescription'], value)
                }
              />
              <LongField
                label="Interest choices (one per line)"
                value={draft.contactSection.interestOptions.join('\n')}
                onChange={(value) =>
                  update(
                    ['contactSection', 'interestOptions'],
                    value.split('\n').filter(Boolean),
                  )
                }
                rows={6}
              />
              <LongField
                label="Footer tagline"
                value={draft.footer.tagline}
                onChange={(value) => update(['footer', 'tagline'], value)}
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="services" className="grid gap-6">
            <SectionCard title="Services heading">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Kicker"
                  value={draft.servicesSection.kicker}
                  onChange={(value) =>
                    update(['servicesSection', 'kicker'], value)
                  }
                />
                <Field
                  label="Title"
                  value={draft.servicesSection.title}
                  onChange={(value) =>
                    update(['servicesSection', 'title'], value)
                  }
                />
              </div>
              <LongField
                label="Description"
                value={draft.servicesSection.description}
                onChange={(value) =>
                  update(['servicesSection', 'description'], value)
                }
              />
            </SectionCard>
            {draft.servicesSection.items.map((service, index) => (
              <SectionCard
                key={`${service.title}-${index}`}
                title={`Service ${index + 1}`}
              >
                <Field
                  label="Service title"
                  value={service.title}
                  onChange={(value) =>
                    update(['servicesSection', 'items', index, 'title'], value)
                  }
                />
                <LongField
                  label="Description"
                  value={service.description}
                  onChange={(value) =>
                    update(
                      ['servicesSection', 'items', index, 'description'],
                      value,
                    )
                  }
                />
              </SectionCard>
            ))}
          </TabsContent>

          <TabsContent value="properties" className="grid gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#19382d]">
                  Property listings
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add, edit or remove homes shown on the website.
                </p>
              </div>
              <Button onClick={addProperty} className="rounded-full">
                <Plus /> Add property
              </Button>
            </div>
            {draft.properties.map((property, index) => (
              <SectionCard
                key={property.id}
                title={property.title || `Property ${index + 1}`}
                description={`Listing #${property.id}`}
              >
                <ImageField
                  label="Property image"
                  value={property.image}
                  onChange={(value) =>
                    update(['properties', index, 'image'], value)
                  }
                />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Field
                    label="Title"
                    value={property.title}
                    onChange={(value) =>
                      update(['properties', index, 'title'], value)
                    }
                  />
                  <Field
                    label="Location"
                    value={property.location}
                    onChange={(value) =>
                      update(['properties', index, 'location'], value)
                    }
                  />
                  <Field
                    label="Property type"
                    value={property.propertyType}
                    onChange={(value) =>
                      update(['properties', index, 'propertyType'], value)
                    }
                  />
                  <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#58645e]">
                    Listing type
                    <select
                      value={property.type}
                      onChange={(event) =>
                        update(
                          ['properties', index, 'type'],
                          event.target.value,
                        )
                      }
                      className="h-11 rounded-xl border border-border bg-[#f8f9f7] px-3 text-sm font-normal normal-case tracking-normal"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </label>
                  <Field
                    label="Price (RM)"
                    type="number"
                    value={property.price}
                    onChange={(value) =>
                      update(['properties', index, 'price'], Number(value))
                    }
                  />
                  <Field
                    label="Size (sq ft)"
                    type="number"
                    value={property.size}
                    onChange={(value) =>
                      update(['properties', index, 'size'], Number(value))
                    }
                  />
                  <Field
                    label="Bedrooms"
                    type="number"
                    value={property.bedrooms}
                    onChange={(value) =>
                      update(['properties', index, 'bedrooms'], Number(value))
                    }
                  />
                  <Field
                    label="Bathrooms"
                    type="number"
                    value={property.bathrooms}
                    onChange={(value) =>
                      update(['properties', index, 'bathrooms'], Number(value))
                    }
                  />
                  <label className="flex items-center gap-3 self-end rounded-xl border border-border bg-[#f8f9f7] px-4 py-3 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={Boolean(property.featured)}
                      onChange={(event) =>
                        update(
                          ['properties', index, 'featured'],
                          event.target.checked,
                        )
                      }
                      className="size-4 accent-[#255843]"
                    />{' '}
                    Featured property
                  </label>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={() =>
                      update(
                        ['properties'],
                        draft.properties.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      )
                    }
                  >
                    <Trash2 /> Remove listing
                  </Button>
                </div>
              </SectionCard>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
