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
    default:
      'Satiaya Selvan | Property Agent Malaysia | Buy, Sell & Rent Property',
    template: `%s | ${siteConfig.agent.name}`,
  },
  description:
    'Professional property services for buying, selling, renting and refinancing homes across Kuala Lumpur, Selangor, Klang Valley, Negeri Sembilan and Port Dickson.',
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
    title:
      'Satiaya Selvan | Property Agent Malaysia | Buy, Sell & Rent Property',
    description:
      'Professional property services for buying, selling, renting and refinancing homes across Kuala Lumpur, Selangor, Klang Valley, Negeri Sembilan and Port Dickson.',
    url: '/',
    siteName: 'Satiaya Property',
    type: 'website',
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
    title:
      'Satiaya Selvan | Property Agent Malaysia | Buy, Sell & Rent Property',
    description:
      'Professional property services for buying, selling, renting and refinancing homes across Kuala Lumpur, Selangor, Klang Valley, Negeri Sembilan and Port Dickson.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="corporate">
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
