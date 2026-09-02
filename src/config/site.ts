/**
 * EDITABLE SITE CONTENT
 * Update this one file to change the agent identity, contact details,
 * imagery and key marketing copy used throughout the website.
 */
export const siteConfig = {
  domain: 'https://www.satiayaselvan.my',
  logo: {
    mark: 'SS',
    image: '', // Add a local path such as /logo.svg when the final logo is ready.
  },
  agent: {
    name: 'Satiaya Selvan',
    firstName: 'Satiaya',
    title: 'Real Estate Negotiator',
    agency: 'MAXXAN Realty',
    registrationNumber: 'REN 00000',
    profilePhoto:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=88',
    languages: ['English', 'Bahasa Malaysia', 'Tamil'],
  },
  contact: {
    // Replace these Phase 1 placeholders with the agent's final details.
    phone: '+60 12-345 6789',
    email: 'hello@satiayaselvan.my',
    serviceArea: 'Kuala Lumpur & Selangor, Malaysia',
  },
  whatsapp: {
    number: '60123456789', // Digits only, including Malaysia country code.
    defaultMessage:
      'Hi Satiaya, I found your website and would like to enquire about a property.',
  },
  hero: {
    eyebrow: 'Kuala Lumpur & Selangor',
    title: 'Move forward with the right property.',
    description:
      'Personal guidance for buying, selling and renting homes across Klang Valley — with clarity at every step.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=88',
  },
  ownerSection: {
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=88',
  },
  about: {
    bio: 'Property decisions can feel complex. My role is to make them simpler—with honest guidance, responsive communication and a clear understanding of what matters to you.',
    approach:
      'Whether you are searching for a home, building your portfolio or preparing to sell, I bring local market insight and attentive service to every conversation.',
    stats: [
      { value: '1-to-1', label: 'Personal service' },
      { value: '7 days', label: 'Responsive support' },
      { value: 'KL + Selangor', label: 'Local focus' },
    ],
  },
  footer: {
    tagline:
      'Helping people make confident property moves across Kuala Lumpur and Selangor.',
  },
  social: {
    instagram: '#',
    facebook: '#',
    linkedin: '#',
  },
} as const;
