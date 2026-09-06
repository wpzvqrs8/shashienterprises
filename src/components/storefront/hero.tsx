import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-ink-950 text-parchment-text border-b border-ink-800 overflow-hidden py-4 sm:py-6 lg:py-8 min-h-0 lg:min-h-[calc(100vh-120px)] lg:max-h-[calc(100vh-120px)] flex items-center">
      
      {/* Background Subtle Accent Gradients (Flat look, no glass) */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-ember-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-4 lg:space-y-6">
            
            {/* Main Display Heading */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-parchment-50 leading-[1.05] tracking-tight">
              India's Trade Source for <span className="text-ember-500">Premium Anime Collectibles</span>
            </h1>

            {/* Subcopy */}
            <p className="hidden sm:block text-sm sm:text-base lg:text-lg text-parchment-text/80 max-w-2xl leading-relaxed">
              Bulk supply of high-demand Dragon Ball statues, One Piece figures, Demon Slayer katanas, and limited resin imports. Built for shop owners, comic stores, and online resellers.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link href="/shop">
                <Button variant="ember" size="lg" className="w-full sm:w-auto gap-2">
                  <span>Browse Wholesale Catalog</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/become-a-dealer">
                <Button variant="dark" size="lg" className="w-full sm:w-auto !text-white !border !border-white hover:!border-ember-500 hover:bg-ember-500/10 hover:!text-ember-500 font-bold transition-all shadow-sm">
                  Become a Dealer
                </Button>
              </Link>
            </div>

          </div>

          {/* Right Product Showcase Tile */}
          <div className="lg:col-span-6 relative w-full flex justify-center">
            <div className="relative w-full h-[300px] sm:h-[380px] lg:h-[460px] max-h-[calc(100vh-200px)] rounded-[14px] bg-ink-900 border border-ink-800 p-3 sm:p-4 shadow-warm-lg overflow-hidden group">
              <Image
                src="/hero-featured/hero-goku.jpeg"
                alt="Ultra Instinct Goku Hero Showcase"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-center rounded-[10px] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
