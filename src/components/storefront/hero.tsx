import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-ink-950 text-parchment-text border-b border-ink-800 py-6 sm:py-8 lg:py-4 min-h-fit lg:h-[calc(100vh-80px)] lg:max-h-[calc(100vh-80px)] flex items-center overflow-hidden">
      
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-ember-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4 lg:space-y-5">
            
            {/* Main Display Heading */}
            <h1 className="font-display text-2xl sm:text-4xl lg:text-4xl xl:text-5xl text-parchment-50 leading-[1.1] tracking-tight">
              India's Wholesale Source for <span className="text-ember-500">Premium Anime Figurines & Collectibles</span>
            </h1>

            {/* Subcopy */}
            <p className="text-xs sm:text-sm lg:text-base text-parchment-text/80 max-w-xl leading-relaxed">
              Bulk supply of high-demand Dragon Ball statues, One Piece figures, Demon Slayer katanas, and limited resin imports. Built for shop owners, comic stores, and online resellers.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 sm:pt-2">
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
            <div className="relative w-full aspect-[3/2] max-h-[260px] sm:max-h-[320px] lg:max-h-[360px] xl:max-h-[420px] rounded-[14px] bg-ink-900 border-2 border-ink-800 p-0 shadow-warm-lg overflow-hidden group">
              <Image
                src="/hero-goku.jpg"
                alt="Ultra Instinct Goku Hero Showcase"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
