'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, FileText, Send } from 'lucide-react';

export default function BecomeADealerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    phone: '',
    email: '',
    gstin: '',
    city: '',
    storeType: 'Physical Retail Shop',
    comments: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-parchment-50 min-h-screen py-12 border-b border-parchment-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-ember-600 bg-ember-100 px-3 py-1 rounded-full">
            B2B Dealer Onboarding
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-ink-950">
            Apply for Verified Dealer Account
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
            Gain direct access to tier-3 volume pricing, priority container allocation, and dedicated account manager support on WhatsApp.
          </p>
        </div>

        {submitted ? (
          <div className="bg-jade-100 border border-jade-600/30 text-jade-600 p-8 rounded-[12px] text-center space-y-4 shadow-sm">
            <CheckCircle2 className="w-12 h-12 mx-auto" />
            <h2 className="font-display text-2xl">Dealer Application Submitted!</h2>
            <p className="text-xs max-w-md mx-auto leading-relaxed text-ink-text/90">
              Our trade onboarding desk will verify your store credentials and contact you via WhatsApp ({formData.phone}) within 12 business hours.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Requirements & Perks */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-4">
                <h3 className="font-display text-lg text-ink-950 border-b border-parchment-300 pb-2">
                  Wholesale Requirements
                </h3>
                <ul className="space-y-3 text-xs text-ink-text/90">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-jade-600 shrink-0 mt-0.5" />
                    <span>Minimum ₹15,000 per purchase order threshold.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-ember-500 shrink-0 mt-0.5" />
                    <span>Valid GSTIN or business registration proof required.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span>Minimum 5 pcs per individual SKU quantity.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Application Form */}
            <div className="md:col-span-7 bg-parchment-100 border border-parchment-300 p-6 rounded-[12px] shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display text-xl text-ink-950 border-b border-parchment-300 pb-2">
                  Dealer Registration Form
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Store / Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                    placeholder="e.g. Collectible Corner"
                    className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-ink-950">Proprietor Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Full Name"
                      className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-ink-950">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-ink-950">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="trade@store.com"
                      className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-ink-950">City / Location *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Pune"
                      className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">GSTIN Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                    placeholder="07BWTPD0774Q1ZR"
                    className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950 uppercase"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="ember" size="md" fullWidth className="gap-2">
                    <Send className="w-4 h-4" />
                    <span>Submit Dealer Application</span>
                  </Button>
                </div>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
