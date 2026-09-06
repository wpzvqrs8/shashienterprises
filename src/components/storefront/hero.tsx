import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Truck, Percent, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-ink-950 text-parchment-text border-b border-ink-800 overflow-hidden pt-4 pb-10 sm:pt-6 sm:pb-14">
      
      {/* Background Subtle Accent Gradients (Flat look, no glass) */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-ember-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-6">
            

            {/* Main ZCOOL Display Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-parchment-50 leading-[1.05] tracking-tight">
              India's Trade Source for <span className="text-ember-500">Premium Anime Collectibles</span>
            </h1>

            {/* Jaro Subcopy */}
            <p className="text-base sm:text-lg text-parchment-text/80 max-w-2xl leading-relaxed">
              Bulk supply of high-demand Dragon Ball statues, One Piece figures, Demon Slayer katanas, and limited resin imports. Built for shop owners, comic stores, and online resellers.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-semibold">
              <div className="flex items-center gap-2 bg-ink-900/80 border border-ink-800 p-2.5 rounded-[6px]">
                <ShieldCheck className="w-4 h-4 text-jade-600 shrink-0" />
                <span>GST Invoice</span>
              </div>
              <div className="flex items-center gap-2 bg-ink-900/80 border border-ink-800 p-2.5 rounded-[6px]">
                <Truck className="w-4 h-4 text-ember-500 shrink-0" />
                <span>Pan-India 2-4 Days</span>
              </div>
              <div className="flex items-center gap-2 bg-ink-900/80 border border-ink-800 p-2.5 rounded-[6px]">
                <Percent className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Tiered Discounts</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link href="/shop">
                <Button variant="ember" size="lg" className="w-full sm:w-auto gap-2">
                  <span>Browse Wholesale Catalog</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/become-a-dealer">
                <Button variant="dark" size="lg" className="w-full sm:w-auto !text-white border-parchment-300/50 hover:border-ember-500 hover:bg-ember-500/10 hover:!text-ember-500 font-bold transition-all shadow-sm">
                  Become a Dealer
                </Button>
              </Link>

            </div>

          </div>

          {/* Right Product Showcase Tile */}
          <div className="lg:col-span-6 relative w-full flex justify-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-square max-w-xl lg:max-w-2xl mx-auto rounded-[14px] bg-ink-900 border border-ink-800 p-3 sm:p-4 shadow-warm-lg overflow-hidden group">
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
