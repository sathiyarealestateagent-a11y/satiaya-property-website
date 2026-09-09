import { z } from 'zod';

const text = z.string().max(5000);
const shortText = z.string().max(300);
const urlText = z.string().max(3000);
const safeUrl = urlText.refine((value) => {
  if (value === '') return true;
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}, 'Use an HTTPS URL or a site path beginning with /.');
const navigationHref = shortText.refine(
  (value) =>
    /^#[a-zA-Z][\w-]*$/.test(value) ||
    (value.startsWith('/') && !value.startsWith('//')) ||
    safeUrl.safeParse(value).success,
  'Use a page section, site path or HTTPS URL.',
);
const socialUrl = urlText.refine(
  (value) => value === '#' || safeUrl.safeParse(value).success,
  'Use an HTTPS URL.',
);

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

export const editorIconNames = [
  'home',
  'key',
  'house-plus',
  'compass',
  'building',
  'shield',
  'sparkles',
  'star',
  'search',
  'map-pin',
] as const;

export type EditorIconName = (typeof editorIconNames)[number];

export const editorElementStyleSchema = z.object({
  fontSize: z.number().min(8).max(120).optional(),
  fontWeight: z.number().int().min(300).max(800).optional(),
  letterSpacing: z.number().min(-3).max(12).optional(),
  lineHeight: z.number().min(0.8).max(3).optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  backgroundColor: z
    .union([z.literal('transparent'), z.string().regex(/^#[0-9a-fA-F]{6}$/)])
    .optional(),
  opacity: z.number().min(10).max(100).optional(),
  widthPercent: z.number().min(10).max(100).optional(),
  paddingX: z.number().min(0).max(160).optional(),
  paddingY: z.number().min(0).max(160).optional(),
  marginTop: z.number().min(-100).max(240).optional(),
  marginBottom: z.number().min(-100).max(240).optional(),
  borderRadius: z.number().min(0).max(120).optional(),
  iconSize: z.number().min(8).max(160).optional(),
  iconName: z.enum(editorIconNames).optional(),
  lineThickness: z.number().min(1).max(12).optional(),
});

export type EditorElementStyle = z.infer<typeof editorElementStyleSchema>;

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
  image: safeUrl,
  images: z.array(safeUrl).max(12).default([]),
  address: shortText.default(''),
  latitude: z.number().min(-90).max(90).nullable().default(null),
  longitude: z.number().min(-180).max(180).nullable().default(null),
  description: text.default(''),
  packageDetails: text.default(''),
  projectInfo: text.default(''),
  amenities: text.default(''),
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
      elementStyles: z
        .record(z.string().regex(/^[a-zA-Z0-9.]+$/), editorElementStyleSchema)
        .default({}),
    })
    .default({
      order: defaultPageOrder,
      hidden: [],
      hiddenElements: [],
      elementStyles: {},
    }),
  navigation: z
    .array(z.object({ label: shortText, href: navigationHref }))
    .max(10),
  logo: z.object({ mark: shortText, image: safeUrl }),
  agent: z.object({
    name: shortText,
    firstName: shortText,
    title: shortText,
    agency: shortText,
    registrationNumber: shortText,
    profilePhoto: safeUrl,
    languages: z.array(shortText).max(10),
  }),
  contact: z.object({
    phone: shortText,
    email: z.email().max(300),
    serviceArea: shortText,
  }),
  whatsapp: z.object({
    number: z
      .string()
      .regex(/^\d{8,15}$/)
      .max(15),
    defaultMessage: text,
  }),
  header: z.object({ cta: shortText }),
  hero: z.object({
    eyebrow: shortText,
    title: shortText,
    description: text,
    video: safeUrl.default('/hero-property.mp4'),
    image: safeUrl,
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
    image: safeUrl,
    imageAlt: shortText,
    kicker: shortText,
    title: shortText,
    description: text,
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
    z.object({ instagram: socialUrl, facebook: socialUrl, tiktok: socialUrl }),
  ),
  properties: z.array(propertySchema).max(100),
});

export const siteSettingsSchema = siteContentSchema.omit({ properties: true });

export type SiteContent = z.infer<typeof siteContentSchema>;
export type EditableProperty = z.infer<typeof propertySchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
