import React from 'react';
import { INITIAL_STORE_SETTINGS } from '@/lib/mock-data';
import { Lock, ShieldCheck, Database, EyeOff, MessageSquare } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-parchment-50 min-h-screen pb-16">
      
      {/* Dark Hero Header Banner */}
      <section className="bg-ink-950 text-parchment-text py-12 md:py-16 border-b border-ink-800">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-jade-600 bg-jade-600/10 px-3 py-1 rounded-full border border-jade-600/20">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl text-parchment-50 leading-tight">
            Privacy & Business Data Policy
          </h1>
          <p className="text-xs sm:text-sm text-parchment-text/80 max-w-2xl leading-relaxed">
            How Shashi Enterprises safeguards commercial buyer information, GST credentials, phone numbers, and trade ledger security.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Protection Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-jade-600" />
            <h3 className="font-display text-lg text-ink-950 font-bold">100% Confidential</h3>
            <p className="text-xs text-muted leading-relaxed">
              Your dealer database details are kept strictly private and never shared with third parties.
            </p>
          </div>
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <Database className="w-6 h-6 text-ember-500" />
            <h3 className="font-display text-lg text-ink-950 font-bold">Encrypted Invoicing Data</h3>
            <p className="text-xs text-muted leading-relaxed">
              GSTIN records and billing addresses are secured with bank-grade encryption protocols.
            </p>
          </div>
          <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
            <EyeOff className="w-6 h-6 text-gold-500" />
            <h3 className="font-display text-lg text-ink-950 font-bold">Zero Spam Guarantee</h3>
            <p className="text-xs text-muted leading-relaxed">
              We send relevant trade updates only on new container arrivals and stock drops.
            </p>
          </div>
        </div>

        {/* Detailed Sections with Bullet Points */}
        <div className="space-y-6">
          
          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-ember-500" />
              <span>1. Information We Collect</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Business Credentials:</strong> Store name, proprietor name, business email, and registered GSTIN number submitted during account application.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Dispatch Coordinates:</strong> Delivery address, PIN code, contact mobile number, and preferred logistics partner.</span>
              </li>
            </ul>
          </div>

          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-500" />
              <span>2. How We Use Business Data</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Order Fulfilling:</strong> Generating tax invoices, printing dispatch shipping labels, and E-Way bill creation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Direct Trade Alerts:</strong> Notifying dealers via WhatsApp/Email regarding stock availability, container unboxings, or price updates.</span>
              </li>
            </ul>
          </div>

          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-ink-950 border-b border-parchment-300 pb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-jade-600" />
              <span>3. Data Security & Partner Privacy</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-text/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-jade-600 shrink-0 mt-2" />
                <span><strong className="text-ink-950">No Third-Party Sharing:</strong> Dealer contact details are never rented, sold, or shared with external marketing agencies.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-jade-600 shrink-0 mt-2" />
                <span><strong className="text-ink-950">Opt-Out Control:</strong> Dealers can opt out of stock drop newsletter alerts at any time by messaging our support desk.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Support Banner */}
        <div className="bg-ink-950 text-parchment-text p-6 rounded-[12px] border border-ink-800 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-warm">
          <div>
            <h4 className="font-display text-lg text-parchment-50 font-bold">Questions Regarding Business Privacy?</h4>
            <p className="text-xs text-muted">Contact our data privacy desk directly on WhatsApp.</p>
          </div>
          <a
            href={`https://wa.me/${INITIAL_STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Shashi%20Enterprises%2C%20I%20have%20a%20privacy%20query.`}
            target="_blank"
            rel="noreferrer"
            className="bg-jade-600 hover:bg-jade-600/90 text-white text-xs font-bold py-2.5 px-5 rounded-[6px] transition-colors uppercase tracking-wider shrink-0 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Privacy Support</span>
          </a>
        </div>

      </div>
    </div>
  );
}
