import { z } from 'zod';

const text = z.string().max(5000);
const shortText = z.string().max(300);
const urlText = z.string().max(3000);

export const pageSectionIds = [
  'hero',
  'properties',
  'owners',
  'services',
  'about',
  'contact',
] as const;

export const pageSectionSchema = z.enum(pageSectionIds);
export type PageSectionId = z.infer<typeof pageSectionSchema>;

const defaultPageOrder: PageSectionId[] = [...pageSectionIds];

export const propertySchema = z.object({
  id: z.number().int().positive(),
  title: shortText,
  location: shortText,
  propertyType: shortText,
  type: z.enum(['sale', 'rent']),
  price: z.number().nonnegative(),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  size: z.number().int().nonnegative(),
  image: urlText,
  featured: z.boolean().optional(),
});

export const siteContentSchema = z.object({
  pageLayout: z
    .object({
      order: z.array(pageSectionSchema).length(pageSectionIds.length),
      hidden: z.array(pageSectionSchema).max(pageSectionIds.length),
      hiddenElements: z
        .array(z.string().regex(/^[a-zA-Z0-9.]+$/))
        .max(300)
        .default([]),
    })
    .default({ order: defaultPageOrder, hidden: [], hiddenElements: [] }),
  navigation: z.array(z.object({ label: shortText, href: shortText })).max(10),
  logo: z.object({ mark: shortText, image: urlText }),
  agent: z.object({
    name: shortText,
    firstName: shortText,
    title: shortText,
    agency: shortText,
    registrationNumber: shortText,
    profilePhoto: urlText,
    languages: z.array(shortText).max(10),
  }),
  contact: z.object({
    phone: shortText,
    email: shortText,
    serviceArea: shortText,
  }),
  whatsapp: z.object({ number: shortText, defaultMessage: text }),
  header: z.object({ cta: shortText }),
  hero: z.object({
    eyebrow: shortText,
    title: shortText,
    description: text,
    video: urlText.default('/hero-property.mp4'),
    image: urlText,
    imageAlt: shortText,
    primaryCta: shortText,
    secondaryCta: shortText,
    secondaryMessage: text,
  }),
  search: z.object({
    title: shortText,
    description: text,
    verifiedLabel: shortText,
  }),
  featured: z.object({
    kicker: shortText,
    title: shortText,
    description: text,
    emptyTitle: shortText,
    emptyDescription: text,
    moreLabel: shortText,
    moreMessage: text,
  }),
  ownerSection: z.object({
    image: urlText,
    imageAlt: shortText,
    kicker: shortText,
    title: shortText,
    description: text,
    quote: shortText,
    checklist: z.array(shortText).max(10),
    primaryCta: shortText,
    primaryMessage: text,
  }),
  servicesSection: z.object({
    kicker: shortText,
    title: shortText,
    description: text,
    items: z.array(z.object({ title: shortText, description: text })).max(12),
  }),
  about: z.object({
    kicker: shortText,
    title: shortText,
    bio: text,
    approach: text,
    stats: z.array(z.object({ value: shortText, label: shortText })).max(6),
    cta: shortText,
    ctaMessage: text,
  }),
  contactSection: z.object({
    kicker: shortText,
    title: shortText,
    description: text,
    whatsappLabel: shortText,
    successTitle: shortText,
    successDescription: text,
    successCta: shortText,
    submitLabel: shortText,
    nameLabel: shortText.default('Full name'),
    namePlaceholder: shortText.default('Your name'),
    phoneLabel: shortText.default('Phone number'),
    phonePlaceholder: shortText.default('+60'),
    emailLabel: shortText.default('Email address'),
    emailPlaceholder: shortText.default('you@example.com'),
    interestLabel: shortText.default("I'm interested in"),
    messageLabel: shortText.default('How can I help?'),
    messagePlaceholder: shortText.default(
      'Share a little about what you need...',
    ),
    interestOptions: z.array(shortText).max(12),
  }),
  footer: z.object({
    tagline: text,
    exploreTitle: shortText,
    contactTitle: shortText,
    copyright: shortText,
    whatsappLabel: shortText,
  }),
  social: z.preprocess(
    (value) => {
      if (!value || typeof value !== 'object') return value;
      const social = value as Record<string, unknown>;
      return {
        instagram: social.instagram,
        facebook: social.facebook,
        tiktok: social.tiktok ?? '',
      };
    },
    z.object({ instagram: urlText, facebook: urlText, tiktok: urlText }),
  ),
  properties: z.array(propertySchema).max(100),
});

export const siteSettingsSchema = siteContentSchema.omit({ properties: true });

export type SiteContent = z.infer<typeof siteContentSchema>;
export type EditableProperty = z.infer<typeof propertySchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
