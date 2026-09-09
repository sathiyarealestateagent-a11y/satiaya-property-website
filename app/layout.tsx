import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';

import { siteConfig } from '@/src/config/site';

import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  applicationName: 'Satiaya Property',
  title: {
    default: `${siteConfig.agent.name} | Real Estate Negotiator`,
    template: `%s | ${siteConfig.agent.name}`,
  },
  description:
    'Personal property guidance for buying, selling and renting across Kuala Lumpur and Selangor.',
  keywords: [
    'property for sale Malaysia',
    'property for rent Malaysia',
    'Kuala Lumpur property agent',
    'Selangor property agent',
    'Satiaya Selvan',
    'MAXXAN Realty',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: `${siteConfig.agent.name} | Move forward with the right property`,
    description:
      'Personal property guidance for buying, selling and renting across Kuala Lumpur and Selangor.',
    type: 'website',
    siteName: 'Satiaya Property',
    url: '/',
    locale: 'en_MY',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Satiaya Selvan — Move forward with the right property.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.agent.name} | Move forward with the right property`,
    description:
      'Personal property guidance for buying, selling and renting across Kuala Lumpur and Selangor.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-MY" className="scroll-smooth" data-theme="corporate">
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  );
}
