import React from 'react';
import Link from 'next/link';
import { INITIAL_STORE_SETTINGS } from '@/lib/constants';
import { TestimonialsSection } from '@/components/storefront/testimonials-section';
import { Button } from '@/components/ui/button';
import { ShieldCheck, MapPin, Award, Building, ArrowRight, CheckCircle2, Package, Users, Truck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-parchment-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-ink-950 text-parchment-text py-16 border-b border-ink-800">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-500 bg-gold-500/10 px-3.5 py-1 rounded-full border border-gold-500/20">
            About Shashi Enterprises
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-parchment-50 leading-tight">
            India's Premier B2B Anime Collectibles Trade Counter
          </h1>
          <p className="text-sm sm:text-base text-parchment-text/80 max-w-2xl mx-auto leading-relaxed">
            The official wholesale distribution platform for Shashi Enterprises. We supply verified comic shops, retail anime stores, and figure resellers with direct container stock across India.
          </p>
        </div>
      </section>

      {/* Trade Credentials */}
      <section className="py-12 border-b border-parchment-300 bg-parchment-100">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-parchment-50 p-6 rounded-[10px] border border-parchment-300 space-y-3 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-jade-600" />
              <div className="font-display text-xl text-ink-950 font-bold">GST Registered</div>
              
            </div>

            <div className="bg-parchment-50 p-6 rounded-[10px] border border-parchment-300 space-y-3 shadow-sm">
              <Building className="w-8 h-8 text-ember-500" />
              <div className="font-display text-xl text-ink-950 font-bold">Direct Imports</div>
              <div className="text-xs text-muted leading-relaxed">
                Zero middleman markup; direct container shipments imported directly from premier international manufacturers.
              </div>
            </div>

            <div className="bg-parchment-50 p-6 rounded-[10px] border border-parchment-300 space-y-3 shadow-sm">
              <MapPin className="w-8 h-8 text-gold-500" />
              <div className="font-display text-xl text-ink-950 font-bold">Pan-India Dispatch</div>
              <div className="text-xs text-muted leading-relaxed">
                Central warehouse in Delhi providing 2–4 day express transit to 100+ Tier-1 & Tier-2 cities.
              </div>
            </div>

            <div className="bg-parchment-50 p-6 rounded-[10px] border border-parchment-300 space-y-3 shadow-sm">
              <Award className="w-8 h-8 text-jade-600" />
              <div className="font-display text-xl text-ink-950 font-bold">450+ Active Dealers</div>
              <div className="text-xs text-muted leading-relaxed">
                Supplying trusted inventory to brick-and-mortar retail stores, comic hubs, and top online anime sellers.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Advantages List with Bullet Points */}
      <section className="py-16 bg-parchment-50 border-b border-parchment-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-ember-600 bg-ember-100 px-3 py-1 rounded-full">
              Why Retailers Choose Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink-950">
              Built Specifically for Commercial B2B Resellers
            </h2>
          </div>

          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-6 shadow-sm">
            <ul className="space-y-4 text-xs sm:text-sm text-ink-text/90">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-jade-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink-950 block text-sm sm:text-base font-bold">Guaranteed Authentic Box Licensing:</strong>
                  Every figure and resin statue in our catalog undergoes strict authenticity verification with official licensing stickers and heavy custom packaging.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-ember-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink-950 block text-sm sm:text-base font-bold">Tiered Volume Pricing:</strong>
                  Per-unit wholesale prices scale down automatically as your store order volume increases (Tier 1: 5-14 pcs, Tier 2: 15-49 pcs, Tier 3: 50+ pcs).
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink-950 block text-sm sm:text-base font-bold">WhatsApp Trade Manager Support:</strong>
                  Every dealer account gets a dedicated trade manager for instant stock reservations, custom container quotes, and tracking support.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-jade-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink-950 block text-sm sm:text-base font-bold">Insured Transit & Replacement Protection:</strong>
                  Full 100% replacement coverage for any transit-damaged units verified via unboxing video.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Story & Retailer Section */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="py-16 bg-ink-950 text-parchment-text text-center">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <h3 className="font-display text-3xl text-parchment-50 font-bold">Ready to Elevate Your Shop Inventory?</h3>
          <p className="text-xs sm:text-sm text-muted">Register your store for verified dealer accounts and tiered bulk volume rates.</p>
          <Link href="/become-a-dealer" className="inline-block pt-2">
            <Button variant="ember" size="lg" className="gap-2">
              <span>Apply for Dealer Account</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
