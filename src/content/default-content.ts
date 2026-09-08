import { siteConfig } from '@/src/config/site';
import { properties } from '@/src/data/properties';

import { siteContentSchema } from './schema';

export const defaultContent = siteContentSchema.parse({
  pageLayout: {
    order: ['hero', 'properties', 'owners', 'services', 'about', 'contact'],
    hidden: [],
    hiddenElements: [],
    elementStyles: {},
  },
  navigation: siteConfig.navigation,
  logo: siteConfig.logo,
  agent: siteConfig.agent,
  contact: siteConfig.contact,
  whatsapp: siteConfig.whatsapp,
  header: siteConfig.header,
  hero: siteConfig.hero,
  search: siteConfig.search,
  featured: siteConfig.featured,
  ownerSection: siteConfig.ownerSection,
  servicesSection: siteConfig.servicesSection,
  about: siteConfig.about,
  contactSection: siteConfig.contactSection,
  footer: siteConfig.footer,
  social: siteConfig.social,
  properties,
});
