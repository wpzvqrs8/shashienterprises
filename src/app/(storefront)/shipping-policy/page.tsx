import React from 'react';
import Link from 'next/link';
import { INITIAL_STORE_SETTINGS } from '@/lib/constants';
import { Truck, Clock, ShieldCheck, FileText, PackageCheck, MessageSquare } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-parchment-50 min-h-screen pb-16">
      
      {/* Dark Hero Header Banner */}
      <section className="bg-ink-950 text-parchment-text py-12 md:py-16 border-b border-ink-800">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-500 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
            <Truck className="w-3.5 h-3.5" />
            <span>Legal & Freight Policies</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl text-parchment-50 leading-tight">
            Pan-India Wholesale Shipping Policy
          </h1>
          <p className="text-xs sm:text-sm text-parchment-text/80 max-w-2xl leading-relaxed">
            Centralized dispatch protocols, transit timelines, and volumetric freight guidelines for all verified B2B wholesale consignments.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Core Dispatch Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <Clock className="w-6 h-6 text-ember-500" />
            <h3 className="font-display text-lg text-ink-950 font-bold">24-48 Hr Dispatch</h3>
            <p className="text-xs text-muted leading-relaxed">
              Consignments are packed and dispatched within 24 to 48 hours of payment confirmation.
            </p>
          </div>
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <Truck className="w-6 h-6 text-gold-500" />
            <h3 className="font-display text-lg text-ink-950 font-bold">2-4 Days Metro Transit</h3>
            <p className="text-xs text-muted leading-relaxed">
              Direct express freight transit across Tier-1 and Tier-2 Indian cities.
            </p>
          </div>
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-jade-600" />
            <h3 className="font-display text-lg text-ink-950 font-bold">Insured 5-Ply Packaging</h3>
            <p className="text-xs text-muted leading-relaxed">
              Heavy corrugated outer master cartons with corner guards and bubble cushioning.
            </p>
          </div>
        </div>

        {/* Detailed Sections with Bullet Points */}
        <div className="space-y-6">
          
          {/* Section 1 */}
          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-ember-500" />
              <span>1. Order Processing & Dispatch Timelines</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Central Facility:</strong> All orders are dispatched from our master logistics warehouse located in {INITIAL_STORE_SETTINGS.address}.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Cut-Off Time:</strong> Confirmed quote orders approved before 2:00 PM IST enter same-day packing queues.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Tracking Details:</strong> Waybill numbers, courier tracking links, and vehicle LR numbers are generated and shared via SMS & WhatsApp immediately upon dispatch.</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-gold-500" />
              <span>2. Freight Calculation & Volumetric Rates</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Ex-Warehouse Pricing:</strong> Catalog item prices reflect base wholesale product rates. Freight costs are calculated separately based on total box weight and destination PIN code.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Surface vs Air Express:</strong> Standard shipping utilizes surface express road transport (2-5 days). Air freight option is available upon special request for urgent inventory restocks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Volume Freight Discounts:</strong> Master carton consignments exceeding 50 kg qualify for heavily discounted freight contracts with partner logistics networks.</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-jade-600" />
              <span>3. Statutory Compliance & Tax Invoicing</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-jade-600 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Physical GST Invoice:</strong> Every outgoing shipment contains an official physical GST invoice pouch attached to Box #1.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-jade-600 shrink-0 mt-2" />
                <span><strong className="text-ink-950">E-Way Bill Integration:</strong> Consignments valued over ₹50,000 are accompanied by government-issued E-Way bills for hassle-free interstate transport.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Support Banner */}
        <div className="bg-ink-950 text-parchment-text p-6 rounded-[12px] border border-ink-800 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-warm">
          <div>
            <h4 className="font-display text-lg text-parchment-50 font-bold">Have Questions About Freight Rates?</h4>
            <p className="text-xs text-muted">Speak directly with our logistics manager on WhatsApp for custom courier quotes.</p>
          </div>
          <a
            href={`https://wa.me/${INITIAL_STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Shashi%20Enterprises%2C%20I%20have%20a%20shipping%20query.`}
            target="_blank"
            rel="noreferrer"
            className="bg-jade-600 hover:bg-jade-600/90 text-white text-xs font-bold py-2.5 px-5 rounded-[6px] transition-colors uppercase tracking-wider shrink-0 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Logistics Desk</span>
          </a>
        </div>

      </div>
    </div>
  );
}
