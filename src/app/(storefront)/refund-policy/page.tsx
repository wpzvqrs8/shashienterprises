import React from 'react';
import { INITIAL_STORE_SETTINGS } from '@/lib/mock-data';
import { RefreshCw, ShieldAlert, FileText, CheckCircle2, MessageSquare, Video } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="bg-parchment-50 min-h-screen pb-16">
      
      {/* Dark Hero Header Banner */}
      <section className="bg-ink-950 text-parchment-text py-12 md:py-16 border-b border-ink-800">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ember-500 bg-ember-500/10 px-3 py-1 rounded-full border border-ember-500/20">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Returns & Quality Assurance</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl text-parchment-50 leading-tight">
            Damaged Goods & Replacement Policy
          </h1>
          <p className="text-xs sm:text-sm text-parchment-text/80 max-w-2xl leading-relaxed">
            Strict commercial B2B protection protocols for verified transit damage, replacement shipments, and trade ledger credit notes.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Core Protection Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <Video className="w-6 h-6 text-ember-500" />
            <h3 className="font-display text-lg text-ink-950 font-bold">48-Hr Video Proof</h3>
            <p className="text-xs text-muted leading-relaxed">
              Unboxing video requirement guarantees instant replacement approval for damaged cartons.
            </p>
          </div>
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-jade-600" />
            <h3 className="font-display text-lg text-ink-950 font-bold">100% Replacement Guarantee</h3>
            <p className="text-xs text-muted leading-relaxed">
              Verified defective items are replaced free of charge in your subsequent stock dispatch.
            </p>
          </div>
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <FileText className="w-6 h-6 text-gold-500" />
            <h3 className="font-display text-lg text-ink-950 font-bold">Instant Ledger Credits</h3>
            <p className="text-xs text-muted leading-relaxed">
              Option to receive immediate credit notes credited against your trade account balance.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="space-y-6">
          
          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-ember-500" />
              <span>1. Commercial B2B Trade Terms</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Wholesale Commercial Nature:</strong> As a B2B trade counter supplying items at wholesale rates, sales are final upon delivery confirmation. Returns based on retail change-of-mind are strictly not supported.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Covered Exceptions:</strong> Claims are eligible exclusively for physical transit damage to figure blister packs, resin statue breakage, or factory assembly missing parts.</span>
              </li>
            </ul>
          </div>

          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <Video className="w-5 h-5 text-gold-500" />
              <span>2. Claim Verification Protocol</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Unboxing Video Mandatory:</strong> To protect both parties against freight pilferage, buyers must record an uninterrupted unboxing video showing the sealed outer master box label before opening.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Submission Window:</strong> Video proof and damaged SKU photos must be submitted to our WhatsApp Trade Desk within 48 hours of shipment delivery.</span>
              </li>
            </ul>
          </div>

          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-jade-600" />
              <span>3. Resolution Options</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-jade-600 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Option A — Physical Replacement:</strong> Replacement units will be added to your immediate next stock consignment at zero extra cost.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-jade-600 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Option B — Trade Credit Note:</strong> A formal GST credit note will be issued against your dealer ledger balance, deductible from future orders.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Support Banner */}
        <div className="bg-ink-950 text-parchment-text p-6 rounded-[12px] border border-ink-800 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-warm">
          <div>
            <h4 className="font-display text-lg text-parchment-50 font-bold">Need to Submit a Damaged Item Claim?</h4>
            <p className="text-xs text-muted">Send your unboxing video directly to our trade manager on WhatsApp for fast processing.</p>
          </div>
          <a
            href={`https://wa.me/${INITIAL_STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Shashi%20Enterprises%2C%20I%20want%20to%20report%20a%20damaged%20item.`}
            target="_blank"
            rel="noreferrer"
            className="bg-jade-600 hover:bg-jade-600/90 text-white text-xs font-bold py-2.5 px-5 rounded-[6px] transition-colors uppercase tracking-wider shrink-0 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Submit Claim on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}
