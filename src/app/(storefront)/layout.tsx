import React from 'react';
import { CartProvider } from '@/lib/cart-store';
import { MarqueeStrip } from '@/components/storefront/marquee-strip';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';
import { CartDrawer } from '@/components/storefront/cart-drawer';
import { FloatingWhatsapp } from '@/components/storefront/floating-whatsapp';
import { FloatingAdmin } from '@/components/storefront/floating-admin';
import { FloatingExplore } from '@/components/storefront/floating-explore';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-parchment-50">
        <MarqueeStrip />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <CartDrawer />
        <FloatingWhatsapp />
        <FloatingAdmin />
        <FloatingExplore />
      </div>
    </CartProvider>
  );
}

