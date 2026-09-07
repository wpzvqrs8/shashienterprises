import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { LoginModal } from '@/components/auth/login-modal';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Shashi Enterprises — India\'s Trade Source for Premium Anime Collectibles',
  description: 'B2B Wholesale anime statues, action figures, diecast, and rare collectibles. Pan-India dispatch, GST invoices, and tiered bulk pricing.',
  keywords: ['wholesale anime figures', 'anime collectibles B2B', 'Shashi Enterprises', 'Dragon Ball statues bulk', 'One Piece wholesale'],
  icons: {
    icon: '/logo_black_bg.png',
    shortcut: '/logo_black_bg.png',
    apple: '/logo_black_bg.png',
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
