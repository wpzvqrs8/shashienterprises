'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { getProducts } from '@/lib/catalog-store';
import { Hero } from '@/components/storefront/hero';
import { CategoryStrip } from '@/components/storefront/category-strip';
import { TrustBadgeRow } from '@/components/storefront/trust-badge-row';
import { ProductCard } from '@/components/storefront/product-card';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { TestimonialsSection } from '@/components/storefront/testimonials-section';
import { FaqAccordion } from '@/components/storefront/faq-accordion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [newDrops, setNewDrops] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function loadData() {
      const allItems = await getProducts();
      const newItems = allItems.filter(p => p.badges && p.badges.includes('new'));
      const bestsellerItems = allItems.filter(p => p.badges && p.badges.includes('bestseller'));
      
      setNewDrops(newItems.length > 0 ? newItems.slice(0, 8) : allItems.slice(0, 8));
      setBestSellers(bestsellerItems.length > 0 ? bestsellerItems.slice(0, 8) : allItems.slice(8, 16));
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div className="space-y-0">
      
      {/* 1. Hero */}
      <Hero />

      {/* 2. Category Icon Strip */}
      <CategoryStrip />

      {/* 3. New Wholesale Drops */}
      <section className="py-16 bg-parchment-50 border-b border-parchment-300">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-sm sm:text-base text-white font-extrabold uppercase tracking-wider bg-ember-500 border border-ember-600 px-3.5 py-1.5 rounded-md shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
                <span>Fresh Wholesale Stock</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl text-ink-950 mt-2">
                New Wholesale Drops
              </h2>
            </div>
            <Link href="/shop?sort=newest">
              <Button variant="outline" size="sm" className="gap-1.5 border-parchment-300 text-ink-950">
                <span>View All New Additions</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
            ) : newDrops.length > 0 ? (
              newDrops.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted text-sm bg-parchment-100 rounded-lg border border-parchment-300">
                No wholesale drops available yet. Add products in the admin panel.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Featured / Promo Banner (Ink-dark section) */}
      <section className="bg-ink-950 text-parchment-text py-16 border-b border-ink-800 relative overflow-hidden">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="bg-ink-900 border border-ink-800 rounded-[14px] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-warm-lg">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs bg-gold-500/10 text-gold-500 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-gold-500/30">
                Limited Resin Statues Batch
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-parchment-50 leading-tight">
                High-Margin Collector Statues — <span className="text-ember-500">Order Before Sold Out</span>
              </h2>
              <p className="text-sm sm:text-base text-parchment-text/80 leading-relaxed max-w-xl">
                Reserve 72cm Shanks, 55cm Spirit Bomb Goku, and Akaza vs Rengoku diorama statues. Guaranteed authentic craftsmanship, heavy custom wooden box packaging, and priority pan-India dispatch.
              </p>
              <div className="pt-2">
                <Link href="/shop?category=limited-statues">
                  <Button variant="ember" size="lg" className="gap-2">
                    <span>Explore Limited Statues</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative w-full h-[280px] sm:h-[360px] lg:h-[420px] rounded-[12px] bg-ink-950 overflow-hidden border-2 border-ink-800 p-0 shadow-warm-lg group">
              <Image
                src="/hero-resin.jpg"
                alt="Limited Resin Statues Batch"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center rounded-[10px] group-hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 5. Best Sellers Grid */}
      <section className="py-16 bg-parchment-50 border-b border-parchment-300">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-gold-500 font-bold uppercase tracking-widest bg-gold-500/10 px-2.5 py-1 rounded border border-gold-500/20">
                <span>Fastest Moving SKUs</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-ink-950 mt-2">
                B2B Best Sellers
              </h2>
            </div>
            <Link href="/shop?sortBy=recommended">
              <Button variant="outline" size="sm" className="gap-1.5 border-parchment-300 text-ink-950">
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
            ) : bestSellers.length > 0 ? (
              bestSellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted text-sm bg-parchment-100 rounded-lg border border-parchment-300">
                No bestseller items listed yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Trust Badge Row (GST Invoice, Pan-India Dispatch, Tiered Pricing, Dealer Support) placed right before Testimonials */}
      <TrustBadgeRow />

      {/* 7. Trusted by Retailers (Testimonials) */}
      <TestimonialsSection />

      {/* 8. FAQ Accordion */}
      <FaqAccordion />



    </div>
  );
}
