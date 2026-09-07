import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';

import { siteConfig } from '@/src/config/site';

import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: `${siteConfig.agent.name} | Real Estate Negotiator`,
  description:
    'Personal property guidance for buying, selling and renting across Kuala Lumpur and Selangor.',
  openGraph: {
    title: `${siteConfig.agent.name} | Move forward with the right property`,
    description:
      'Personal property guidance for buying, selling and renting across Kuala Lumpur and Selangor.',
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
    <html lang="en" className="scroll-smooth" data-theme="corporate">
      <body className={`${inter.variable} ${lexend.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
