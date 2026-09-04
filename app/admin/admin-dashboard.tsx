'use client';

import {
  ArrowLeft,
  Building2,
  Check,
  CircleUserRound,
  ExternalLink,
  FileText,
  ImageUp,
  LoaderCircle,
  LogOut,
  Plus,
  Save,
  Settings2,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useId, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { EditableProperty, SiteContent } from '@/src/content/schema';

type PathPart = string | number;

function setAtPath(content: SiteContent, path: PathPart[], value: unknown): SiteContent {
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
    <label htmlFor={id} className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#58645e]">
      {label}
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl bg-[#f8f9f7] px-3 text-sm font-normal normal-case tracking-normal"
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
    <label htmlFor={id} className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#58645e]">
      {label}
      <Textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl bg-[#f8f9f7] px-3 text-sm font-normal normal-case tracking-normal"
      />
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
      const response = await fetch('/api/admin/media', { method: 'POST', body: formData });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? 'Upload failed.');
      onChange(result.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#58645e]">{label}</span>
      <div className="grid gap-4 rounded-2xl border border-dashed border-[#cdd5cf] bg-[#f8f9f7] p-4 sm:grid-cols-[120px_1fr] sm:items-center">
        <div className="relative h-24 overflow-hidden rounded-xl bg-[#e8ece7]">
          {value ? (
            <Image src={value} alt="Current upload" fill unoptimized className="object-cover" />
          ) : (
            <ImageUp className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
          )}
        </div>
        <div className="grid gap-3">
          <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Image URL" className="h-10 bg-white" />
          <div>
            <input
              id={id}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
                event.target.value = '';
              }}
            />
            <label htmlFor={id} className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 text-xs font-bold text-white">
              {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <ImageUp className="size-4" />}
              {uploading ? 'Uploading…' : 'Upload image'}
            </label>
            <span className="ml-3 text-xs text-muted-foreground">JPG, PNG, WebP or GIF · 10 MB max</span>
          </div>
          {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
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
    <Card className="rounded-2xl border-0 bg-white shadow-[0_8px_30px_rgba(27,55,43,.06)] ring-1 ring-black/5">
      <CardHeader className="border-b border-border/70 pb-4">
        <CardTitle className="font-heading text-lg font-bold text-[#19382d]">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-5 pt-1">{children}</CardContent>
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

  function update(path: PathPart[], value: unknown) {
    setDraft((current) => setAtPath(current, path, value));
    setStatus('idle');
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
      if (!response.ok) throw new Error(result.error ?? 'Unable to save changes.');
      setStatus('saved');
      setMessage('Changes are live on your website.');
    } catch (saveError) {
      setStatus('error');
      setMessage(saveError instanceof Error ? saveError.message : 'Unable to save changes.');
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

  return (
    <main className="min-h-screen bg-[#f3f1e9] text-foreground">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#fbfaf6]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="grid size-10 place-items-center rounded-full border border-border bg-white text-primary" aria-label="Back to website">
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-lg font-bold text-[#19382d]">Website dashboard</h1>
                <Badge className="bg-[#e5af69] text-[#19382d]">Owner</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Signed in as {userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" rel="noreferrer">
              <Button variant="outline" className="h-10 rounded-full bg-white px-4">
                Preview site <ExternalLink />
              </Button>
            </Link>
            <Button onClick={() => void save()} disabled={saving} className="h-10 rounded-full px-5">
              {saving ? <LoaderCircle className="animate-spin" /> : <Save />}
              {saving ? 'Saving…' : 'Save & publish'}
            </Button>
            <form action="/admin/logout" method="post">
              <Button type="submit" variant="ghost" className="h-10 rounded-full px-3" aria-label="Sign out">
                <LogOut />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
        {status !== 'idle' && (
          <output className={`mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${status === 'saved' ? 'bg-[#e3f2e7] text-[#1d6744]' : 'bg-red-50 text-destructive'}`}>
            {status === 'saved' && <Check className="size-4" />}
            {message}
          </output>
        )}

        <Tabs defaultValue="identity" className="gap-7 lg:grid lg:grid-cols-[220px_1fr] lg:items-start">
          <TabsList className="sticky top-28 hidden h-auto w-full flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm lg:flex">
            <TabsTrigger value="identity" className="h-11 rounded-xl px-3"><CircleUserRound /> Brand & contact</TabsTrigger>
            <TabsTrigger value="homepage" className="h-11 rounded-xl px-3"><FileText /> Homepage content</TabsTrigger>
            <TabsTrigger value="services" className="h-11 rounded-xl px-3"><Settings2 /> Services</TabsTrigger>
            <TabsTrigger value="properties" className="h-11 rounded-xl px-3"><Building2 /> Properties</TabsTrigger>
          </TabsList>
          <TabsList className="mb-5 grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-white p-1 lg:hidden">
            <TabsTrigger value="identity" className="h-10">Brand</TabsTrigger>
            <TabsTrigger value="homepage" className="h-10">Homepage</TabsTrigger>
            <TabsTrigger value="services" className="h-10">Services</TabsTrigger>
            <TabsTrigger value="properties" className="h-10">Properties</TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="grid gap-6">
            <SectionCard title="Agent profile" description="Your name and professional identity across the website.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" value={draft.agent.name} onChange={(value) => update(['agent', 'name'], value)} />
                <Field label="First name" value={draft.agent.firstName} onChange={(value) => update(['agent', 'firstName'], value)} />
                <Field label="Professional title" value={draft.agent.title} onChange={(value) => update(['agent', 'title'], value)} />
                <Field label="Agency" value={draft.agent.agency} onChange={(value) => update(['agent', 'agency'], value)} />
                <Field label="REN number" value={draft.agent.registrationNumber} onChange={(value) => update(['agent', 'registrationNumber'], value)} />
                <Field label="Languages (comma separated)" value={draft.agent.languages.join(', ')} onChange={(value) => update(['agent', 'languages'], value.split(',').map((item) => item.trim()).filter(Boolean))} />
              </div>
              <ImageField label="Profile photo" value={draft.agent.profilePhoto} onChange={(value) => update(['agent', 'profilePhoto'], value)} />
            </SectionCard>

            <SectionCard title="Logo & navigation">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Logo initials" value={draft.logo.mark} onChange={(value) => update(['logo', 'mark'], value)} />
                <ImageField label="Logo image (optional)" value={draft.logo.image} onChange={(value) => update(['logo', 'image'], value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {draft.navigation.map((item, index) => (
                  <Field key={item.href} label={`Menu label ${index + 1}`} value={item.label} onChange={(value) => update(['navigation', index, 'label'], value)} />
                ))}
              </div>
              <Field label="Header button" value={draft.header.cta} onChange={(value) => update(['header', 'cta'], value)} />
            </SectionCard>

            <SectionCard title="Contact & social links">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Phone" value={draft.contact.phone} onChange={(value) => update(['contact', 'phone'], value)} />
                <Field label="Email" value={draft.contact.email} onChange={(value) => update(['contact', 'email'], value)} />
                <Field label="Service area" value={draft.contact.serviceArea} onChange={(value) => update(['contact', 'serviceArea'], value)} />
                <Field label="WhatsApp number (digits only)" value={draft.whatsapp.number} onChange={(value) => update(['whatsapp', 'number'], value)} />
                <Field label="Instagram URL" value={draft.social.instagram} onChange={(value) => update(['social', 'instagram'], value)} />
                <Field label="Facebook URL" value={draft.social.facebook} onChange={(value) => update(['social', 'facebook'], value)} />
                <Field label="LinkedIn URL" value={draft.social.linkedin} onChange={(value) => update(['social', 'linkedin'], value)} />
              </div>
              <LongField label="Default WhatsApp message" value={draft.whatsapp.defaultMessage} onChange={(value) => update(['whatsapp', 'defaultMessage'], value)} />
            </SectionCard>
          </TabsContent>

          <TabsContent value="homepage" className="grid gap-6">
            <SectionCard title="Hero section">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Eyebrow" value={draft.hero.eyebrow} onChange={(value) => update(['hero', 'eyebrow'], value)} />
                <Field label="Headline" value={draft.hero.title} onChange={(value) => update(['hero', 'title'], value)} />
              </div>
              <LongField label="Description" value={draft.hero.description} onChange={(value) => update(['hero', 'description'], value)} />
              <ImageField label="Hero image" value={draft.hero.image} onChange={(value) => update(['hero', 'image'], value)} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Image description" value={draft.hero.imageAlt} onChange={(value) => update(['hero', 'imageAlt'], value)} />
                <Field label="Primary button" value={draft.hero.primaryCta} onChange={(value) => update(['hero', 'primaryCta'], value)} />
                <Field label="WhatsApp button" value={draft.hero.secondaryCta} onChange={(value) => update(['hero', 'secondaryCta'], value)} />
                <Field label="WhatsApp message" value={draft.hero.secondaryMessage} onChange={(value) => update(['hero', 'secondaryMessage'], value)} />
              </div>
            </SectionCard>

            <SectionCard title="Property search & featured heading">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Search title" value={draft.search.title} onChange={(value) => update(['search', 'title'], value)} />
                <Field label="Verified label" value={draft.search.verifiedLabel} onChange={(value) => update(['search', 'verifiedLabel'], value)} />
                <Field label="Featured kicker" value={draft.featured.kicker} onChange={(value) => update(['featured', 'kicker'], value)} />
                <Field label="Featured title" value={draft.featured.title} onChange={(value) => update(['featured', 'title'], value)} />
              </div>
              <LongField label="Search description" value={draft.search.description} onChange={(value) => update(['search', 'description'], value)} />
              <LongField label="Featured description" value={draft.featured.description} onChange={(value) => update(['featured', 'description'], value)} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="No results title" value={draft.featured.emptyTitle} onChange={(value) => update(['featured', 'emptyTitle'], value)} />
                <Field label="More properties button" value={draft.featured.moreLabel} onChange={(value) => update(['featured', 'moreLabel'], value)} />
              </div>
            </SectionCard>

            <SectionCard title="Owner sell / rent section">
              <ImageField label="Owner section image" value={draft.ownerSection.image} onChange={(value) => update(['ownerSection', 'image'], value)} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Kicker" value={draft.ownerSection.kicker} onChange={(value) => update(['ownerSection', 'kicker'], value)} />
                <Field label="Title" value={draft.ownerSection.title} onChange={(value) => update(['ownerSection', 'title'], value)} />
                <Field label="Quote card" value={draft.ownerSection.quote} onChange={(value) => update(['ownerSection', 'quote'], value)} />
                <Field label="Button" value={draft.ownerSection.primaryCta} onChange={(value) => update(['ownerSection', 'primaryCta'], value)} />
              </div>
              <LongField label="Description" value={draft.ownerSection.description} onChange={(value) => update(['ownerSection', 'description'], value)} />
              <LongField label="Checklist (one item per line)" value={draft.ownerSection.checklist.join('\n')} onChange={(value) => update(['ownerSection', 'checklist'], value.split('\n').filter(Boolean))} rows={5} />
            </SectionCard>

            <SectionCard title="About section">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Kicker" value={draft.about.kicker} onChange={(value) => update(['about', 'kicker'], value)} />
                <Field label="Title" value={draft.about.title} onChange={(value) => update(['about', 'title'], value)} />
                <Field label="Button" value={draft.about.cta} onChange={(value) => update(['about', 'cta'], value)} />
                <Field label="Button message" value={draft.about.ctaMessage} onChange={(value) => update(['about', 'ctaMessage'], value)} />
              </div>
              <LongField label="Biography" value={draft.about.bio} onChange={(value) => update(['about', 'bio'], value)} />
              <LongField label="Approach" value={draft.about.approach} onChange={(value) => update(['about', 'approach'], value)} />
              <div className="grid gap-5 sm:grid-cols-3">
                {draft.about.stats.map((stat, index) => (
                  <div key={`${stat.label}-${index}`} className="grid gap-3 rounded-xl border border-border p-4">
                    <Field label="Stat value" value={stat.value} onChange={(value) => update(['about', 'stats', index, 'value'], value)} />
                    <Field label="Stat label" value={stat.label} onChange={(value) => update(['about', 'stats', index, 'label'], value)} />
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Contact form & footer">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Contact kicker" value={draft.contactSection.kicker} onChange={(value) => update(['contactSection', 'kicker'], value)} />
                <Field label="Contact title" value={draft.contactSection.title} onChange={(value) => update(['contactSection', 'title'], value)} />
                <Field label="Submit button" value={draft.contactSection.submitLabel} onChange={(value) => update(['contactSection', 'submitLabel'], value)} />
                <Field label="Success title" value={draft.contactSection.successTitle} onChange={(value) => update(['contactSection', 'successTitle'], value)} />
              </div>
              <LongField label="Contact description" value={draft.contactSection.description} onChange={(value) => update(['contactSection', 'description'], value)} />
              <LongField label="Success message" value={draft.contactSection.successDescription} onChange={(value) => update(['contactSection', 'successDescription'], value)} />
              <LongField label="Interest choices (one per line)" value={draft.contactSection.interestOptions.join('\n')} onChange={(value) => update(['contactSection', 'interestOptions'], value.split('\n').filter(Boolean))} rows={6} />
              <LongField label="Footer tagline" value={draft.footer.tagline} onChange={(value) => update(['footer', 'tagline'], value)} />
            </SectionCard>
          </TabsContent>

          <TabsContent value="services" className="grid gap-6">
            <SectionCard title="Services heading">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Kicker" value={draft.servicesSection.kicker} onChange={(value) => update(['servicesSection', 'kicker'], value)} />
                <Field label="Title" value={draft.servicesSection.title} onChange={(value) => update(['servicesSection', 'title'], value)} />
              </div>
              <LongField label="Description" value={draft.servicesSection.description} onChange={(value) => update(['servicesSection', 'description'], value)} />
            </SectionCard>
            {draft.servicesSection.items.map((service, index) => (
              <SectionCard key={`${service.title}-${index}`} title={`Service ${index + 1}`}>
                <Field label="Service title" value={service.title} onChange={(value) => update(['servicesSection', 'items', index, 'title'], value)} />
                <LongField label="Description" value={service.description} onChange={(value) => update(['servicesSection', 'items', index, 'description'], value)} />
              </SectionCard>
            ))}
          </TabsContent>

          <TabsContent value="properties" className="grid gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#19382d]">Property listings</h2>
                <p className="mt-1 text-sm text-muted-foreground">Add, edit or remove homes shown on the website.</p>
              </div>
              <Button onClick={addProperty} className="rounded-full"><Plus /> Add property</Button>
            </div>
            {draft.properties.map((property, index) => (
              <SectionCard key={property.id} title={property.title || `Property ${index + 1}`} description={`Listing #${property.id}`}>
                <ImageField label="Property image" value={property.image} onChange={(value) => update(['properties', index, 'image'], value)} />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Title" value={property.title} onChange={(value) => update(['properties', index, 'title'], value)} />
                  <Field label="Location" value={property.location} onChange={(value) => update(['properties', index, 'location'], value)} />
                  <Field label="Property type" value={property.propertyType} onChange={(value) => update(['properties', index, 'propertyType'], value)} />
                  <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#58645e]">Listing type
                    <select value={property.type} onChange={(event) => update(['properties', index, 'type'], event.target.value)} className="h-11 rounded-xl border border-border bg-[#f8f9f7] px-3 text-sm font-normal normal-case tracking-normal">
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </label>
                  <Field label="Price (RM)" type="number" value={property.price} onChange={(value) => update(['properties', index, 'price'], Number(value))} />
                  <Field label="Size (sq ft)" type="number" value={property.size} onChange={(value) => update(['properties', index, 'size'], Number(value))} />
                  <Field label="Bedrooms" type="number" value={property.bedrooms} onChange={(value) => update(['properties', index, 'bedrooms'], Number(value))} />
                  <Field label="Bathrooms" type="number" value={property.bathrooms} onChange={(value) => update(['properties', index, 'bathrooms'], Number(value))} />
                  <label className="flex items-center gap-3 self-end rounded-xl border border-border bg-[#f8f9f7] px-4 py-3 text-sm font-semibold">
                    <input type="checkbox" checked={Boolean(property.featured)} onChange={(event) => update(['properties', index, 'featured'], event.target.checked)} className="size-4 accent-[#255843]" /> Featured property
                  </label>
                </div>
                <div className="flex justify-end">
                  <Button variant="destructive" onClick={() => update(['properties'], draft.properties.filter((_, itemIndex) => itemIndex !== index))}>
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
