/**
 * EDITABLE SITE CONTENT
 * Update this one file to change the agent identity, contact details,
 * imagery and key marketing copy used throughout the website.
 */
export const siteConfig = {
  domain: 'https://www.satiayaproperty.com.my',
  navigation: [
    { label: 'Properties', href: '#properties' },
    { label: 'Sell / Rent', href: '#owners' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
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
    phone: '+60 12-256 0706',
    email: 'hello@satiayaselvan.my',
    serviceArea: 'Kuala Lumpur & Selangor, Malaysia',
  },
  whatsapp: {
    number: '60122560706', // Digits only, including Malaysia country code.
    defaultMessage:
      'Hi Satiaya, I found your website and would like to enquire about a property.',
  },
  hero: {
    eyebrow: 'Kuala Lumpur & Selangor',
    title: 'Move forward with the right property.',
    description:
      'Personal guidance for buying, selling and renting homes across Klang Valley — with clarity at every step.',
    video: '/hero-property.mp4',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=88',
    imageAlt: 'Modern Malaysian residence with tropical landscaping',
    primaryCta: 'Explore properties',
    secondaryCta: 'Chat on WhatsApp',
    secondaryMessage: 'Hi Satiaya, I would like to discuss my property needs.',
  },
  header: {
    cta: "Let's talk",
  },
  search: {
    title: 'Find your next property',
    description: 'Search selected homes across Klang Valley',
    verifiedLabel: 'Verified listings',
  },
  featured: {
    kicker: 'Curated for you',
    title: 'Featured properties',
    description:
      "A handpicked selection of homes in some of Klang Valley's most sought-after neighbourhoods.",
    emptyTitle: 'No exact matches yet',
    emptyDescription:
      'Try another location or property type, or message Satiaya for an off-market search.',
    moreLabel: 'View more available properties',
    moreMessage: 'Hi Satiaya, please share more available properties with me.',
  },
  ownerSection: {
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=88',
    imageAlt: 'Property owner reviewing a home',
    kicker: 'For property owners',
    title: 'Thinking of selling or renting your property?',
    description:
      "Get a clear view of your property's market position and a tailored plan to reach serious buyers or tenants.",
    checklist: [
      'Current market assessment',
      'Pricing & positioning strategy',
      'Professional listing presentation',
      'Qualified enquiry management',
    ],
    primaryCta: 'Get a free assessment',
    primaryMessage: 'Hi Satiaya, I would like a property market assessment.',
  },
  servicesSection: {
    kicker: 'How I can help',
    title: 'Property guidance, made personal',
    description:
      'Straightforward advice and attentive service at every step of your property journey.',
    items: [
      {
        title: 'Buy a property',
        description:
          'Shortlisted homes that match your needs, budget and preferred neighbourhood.',
      },
      {
        title: 'Rent with confidence',
        description:
          'Clear guidance from viewing and negotiation through to tenancy handover.',
      },
      {
        title: 'Sell or let',
        description:
          'Smart pricing, compelling presentation and qualified buyer or tenant matching.',
      },
      {
        title: 'Property consultation',
        description:
          'Practical, local advice to help you make your next property move with clarity.',
      },
    ],
  },
  about: {
    kicker: 'Meet your negotiator',
    title: 'A trusted partner for your property decisions.',
    bio: 'Property decisions can feel complex. My role is to make them simpler—with honest guidance, responsive communication and a clear understanding of what matters to you.',
    approach:
      'Whether you are searching for a home, building your portfolio or preparing to sell, I bring local market insight and attentive service to every conversation.',
    stats: [
      { value: '1-to-1', label: 'Personal service' },
      { value: '7 days', label: 'Responsive support' },
      { value: 'KL + Selangor', label: 'Local focus' },
    ],
    cta: 'Book a consultation',
    ctaMessage: 'Hi Satiaya, I would like to arrange a consultation.',
  },
  contactSection: {
    kicker: "Let's connect",
    title: 'Ready to make your next move?',
    description:
      "Tell me what you're looking for. I'll get back to you with practical next steps and zero pressure.",
    whatsappLabel: 'WhatsApp me directly',
    successTitle: 'Thank you for reaching out.',
    successDescription:
      'Your enquiry is ready. In Phase 1 this form is a front-end demo; for an immediate reply, please use WhatsApp.',
    successCta: 'Continue on WhatsApp',
    submitLabel: 'Send enquiry',
    nameLabel: 'Full name',
    namePlaceholder: 'Your name',
    phoneLabel: 'Phone number',
    phonePlaceholder: '+60',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    interestLabel: "I'm interested in",
    messageLabel: 'How can I help?',
    messagePlaceholder: 'Share a little about what you need...',
    interestOptions: [
      'Buying a property',
      'Selling my property',
      'General consultation',
    ],
  },
  footer: {
    tagline:
      'Helping people make confident property moves across Kuala Lumpur and Selangor.',
    exploreTitle: 'Explore',
    contactTitle: 'Contact',
    copyright: 'All rights reserved.',
    whatsappLabel: 'WhatsApp',
  },
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
} as const;
