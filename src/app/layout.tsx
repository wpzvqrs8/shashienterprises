import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { LoginModal } from '@/components/auth/login-modal';
import { Analytics } from '@vercel/analytics/next';
import { OrganizationJsonLd } from '@/components/seo/json-ld';

const siteUrl = 'https://shashienterprises.store';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Shashi Enterprises — India\'s Trade Source for Premium Anime Collectibles',
    template: '%s | Shashi Enterprises B2B Wholesale',
  },
  description: 'B2B Wholesale anime statues, action figures, resin statues, and rare collectibles. Pan-India dispatch, GST invoices, and tiered bulk pricing from Delhi HQ.',
  keywords: [
    'wholesale anime figures India',
    'anime collectibles B2B supplier',
    'Shashi Enterprises Delhi',
    'Dragon Ball statues bulk',
    'One Piece wholesale figures',
    'Jujutsu Kaisen resin statues',
    'Marvel action figures wholesale',
    'wholesale anime shop Delhi NCR',
  ],
  authors: [{ name: 'Shashi Enterprises' }],
  creator: 'Shashi Enterprises',
  publisher: 'Shashi Enterprises',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Shashi Enterprises — India\'s Trade Source for Premium Anime Collectibles',
    description: 'B2B Wholesale anime statues, action figures, resin statues, and rare collectibles. Pan-India dispatch, GST invoices, and tiered bulk pricing.',
    siteName: 'Shashi Enterprises',
    images: [
      {
        url: '/hero-banner-fast.png',
        width: 1200,
        height: 630,
        alt: 'Shashi Enterprises Anime Wholesale Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shashi Enterprises — India\'s Anime Wholesale Source',
    description: 'B2B Wholesale anime statues, action figures, resin statues, and rare collectibles.',
    images: ['/hero-banner-fast.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans overflow-x-clip">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="512x512" />
        <link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <OrganizationJsonLd />
      </head>
      <body className="antialiased bg-parchment-50 text-ink-text selection:bg-ember-500 selection:text-white min-h-screen flex flex-col overflow-x-clip w-full max-w-full">
        <AuthProvider>
          {children}
          <LoginModal />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
