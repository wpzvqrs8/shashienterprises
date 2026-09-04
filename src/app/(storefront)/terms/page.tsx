import React from 'react';
import { INITIAL_STORE_SETTINGS } from '@/lib/mock-data';
import { FileText, ShieldCheck, DollarSign, PackageCheck, AlertCircle, MessageSquare } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-parchment-50 min-h-screen pb-16">
      
      {/* Dark Hero Header Banner */}
      <section className="bg-ink-950 text-parchment-text py-12 md:py-16 border-b border-ink-800">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-500 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Commercial Governance</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl text-parchment-50 leading-tight">
            Terms of Wholesale Trade
          </h1>
          <p className="text-xs sm:text-sm text-parchment-text/80 max-w-2xl leading-relaxed">
            Legal terms, trade eligibility, minimum order quantities (MOQ), and commercial reseller guidelines for Shashi Enterprises B2B accounts.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Key Trade Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <DollarSign className="w-6 h-6 text-ember-500" />
            <h3 className="font-display text-lg text-ink-950 font-bold">₹15,000 Minimum Order</h3>
            <p className="text-xs text-muted leading-relaxed">
              Minimum aggregate order checkout threshold strictly enforced for wholesale trade pricing.
            </p>
          </div>
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <PackageCheck className="w-6 h-6 text-gold-500" />
            <h3 className="font-display text-lg text-ink-950 font-bold">5 Pcs Per SKU MOQ</h3>
            <p className="text-xs text-muted leading-relaxed">
              Individual product lines require a minimum unit order quantity of 5 pieces.
            </p>
          </div>
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-jade-600" />
            <h3 className="font-display text-lg text-ink-950 font-bold">Reseller Eligibility</h3>
            <p className="text-xs text-muted leading-relaxed">
              Commercial access reserved for registered comic shops, retail anime stores, and online sellers.
            </p>
          </div>
        </div>

        {/* Detailed Sections with Bullet Points */}
        <div className="space-y-6">
          
          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-ember-500" />
              <span>1. Commercial Trade Account Eligibility</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">B2B Trade Platform:</strong> Shashi Enterprises strictly operates as a B2B wholesale supplier. Products purchased are intended for commercial retail sale, shop stocking, or distribution.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">GST Compliance:</strong> GSTIN numbers must be submitted for official tax invoice credit claiming. Dealers without GSTIN must provide valid business proof (MSME certificate, shop registration).</span>
              </li>
            </ul>
          </div>

          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gold-500" />
              <span>2. Pricing, Quoting & Payment Terms</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Tiered Wholesale Rates:</strong> Product rates drop automatically as unit order quantities scale (Tier 1: 5-14 pcs, Tier 2: 15-49 pcs, Tier 3: 50+ pcs).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Quote Confirmation:</strong> Orders submitted on the platform generate formal invoice quotes. Stock is reserved for 24 hours pending payment completion.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Accepted Payment Modes:</strong> Bank NEFT/RTGS, UPI Business Transfer, and Verified Dealer Credit Terms (for eligible account holders).</span>
              </li>
            </ul>
          </div>

          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-jade-600" />
              <span>3. Product Authenticity & IP Disclaimer</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-jade-600 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Authentic Imports:</strong> All statues, figures, and collectibles are imported directly from certified manufacturers with official box licensing holograms where specified.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-jade-600 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Resale Freedom:</strong> Dealers are free to set retail store prices according to regional market demands, respecting suggested minimum retail prices (MSRP).</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Support Banner */}
        <div className="bg-ink-950 text-parchment-text p-6 rounded-[12px] border border-ink-800 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-warm">
          <div>
            <h4 className="font-display text-lg text-parchment-50 font-bold">Need Help With Trade Account Terms?</h4>
            <p className="text-xs text-muted">Contact our trade desk for dealer onboarding assistance.</p>
          </div>
          <a
            href={`https://wa.me/${INITIAL_STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Shashi%20Enterprises%2C%20I%20have%20a%20query%20about%20trade%20terms.`}
            target="_blank"
            rel="noreferrer"
            className="bg-jade-600 hover:bg-jade-600/90 text-white text-xs font-bold py-2.5 px-5 rounded-[6px] transition-colors uppercase tracking-wider shrink-0 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Trade Desk</span>
          </a>
        </div>

      </div>
    </div>
  );
}
