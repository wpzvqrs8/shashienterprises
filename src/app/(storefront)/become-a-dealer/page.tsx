'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  validateBusinessName,
  validateName,
  validatePhone,
  validateEmail,
  validateCity,
  validateGSTIN
} from '@/lib/validation';
import { CheckCircle2, ShieldCheck, FileText, Send, AlertTriangle } from 'lucide-react';

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    const sErr = validateBusinessName(formData.storeName);
    if (sErr) newErrors.storeName = sErr;

    const oErr = validateName(formData.ownerName, 'Proprietor Name');
    if (oErr) newErrors.ownerName = oErr;

    const pErr = validatePhone(formData.phone);
    if (pErr) newErrors.phone = pErr;

    const eErr = validateEmail(formData.email);
    if (eErr) newErrors.email = eErr;

    const cErr = validateCity(formData.city);
    if (cErr) newErrors.city = cErr;

    const gErr = validateGSTIN(formData.gstin);
    if (gErr) newErrors.gstin = gErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
                    <span>Minimum 50 pcs per purchase order threshold.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-ember-500 shrink-0 mt-0.5" />
                    <span>Valid GSTIN or business registration proof required.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span>50 pcs minimum order quantity per order.</span>
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

                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-50 border border-red-300 text-red-900 p-3 rounded text-xs space-y-0.5 font-bold">
                    <div className="flex items-center gap-1.5 text-red-950">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Please fix the validation errors:</span>
                    </div>
                    {Object.values(errors).map((err, i) => (
                      <div key={i} className="text-[11px] font-normal text-red-700 pl-5">• {err}</div>
                    ))}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Store / Company Name *</label>
                  <input
                    type="text"
                    required
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="e.g. Collectible Corner"
                    className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 ${
                      errors.storeName ? 'bg-red-50 border-2 border-red-500' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                    }`}
                  />
                  {errors.storeName && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.storeName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-ink-950">Proprietor Name *</label>
                    <input
                      type="text"
                      required
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 ${
                        errors.ownerName ? 'bg-red-50 border-2 border-red-500' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                      }`}
                    />
                    {errors.ownerName && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.ownerName}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-ink-950">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 ${
                        errors.phone ? 'bg-red-50 border-2 border-red-500' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-ink-950">Business Email *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="trade@store.com"
                      className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 ${
                        errors.email ? 'bg-red-50 border-2 border-red-500' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.email}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-ink-950">City / Location *</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Pune"
                      className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 ${
                        errors.city ? 'bg-red-50 border-2 border-red-500' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                      }`}
                    />
                    {errors.city && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.city}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">GSTIN Number (Optional)</label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="e.g. 07AAAAA0000A1Z5"
                    className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 uppercase ${
                      errors.gstin ? 'bg-red-50 border-2 border-red-500' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                    }`}
                  />
                  {errors.gstin && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.gstin}</p>}
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

