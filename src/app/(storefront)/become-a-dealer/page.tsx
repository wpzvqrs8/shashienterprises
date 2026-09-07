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
import { CheckCircle2, ShieldCheck, FileText, Send, AlertTriangle, Mail, ExternalLink, RefreshCw } from 'lucide-react';

const COMPANY_EMAIL = 'enterprisesshashi95@gmail.com';

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
  const [mailtoLink, setMailtoLink] = useState('');
  const [gmailWebLink, setGmailWebLink] = useState('');

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

    const emailSubject = `B2B Dealer Application - ${formData.storeName.trim()}`;
    const emailBody = `Dear Shashi Enterprises Team,

I would like to apply for a B2B Verified Dealer Account on your platform. Here are my verified application details:

--------------------------------------------------
DEALER APPLICATION DETAILS
--------------------------------------------------
Store / Business Name : ${formData.storeName.trim()}
Proprietor Name       : ${formData.ownerName.trim()}
WhatsApp Mobile       : ${formData.phone.trim()}
Business Email        : ${formData.email.trim()}
City / Location       : ${formData.city.trim()}
GSTIN Number          : ${formData.gstin.trim() || 'N/A'}
Store Type            : ${formData.storeType}
Additional Comments   : ${formData.comments.trim() || 'N/A'}
--------------------------------------------------

Please process my dealer application and reach out to me on WhatsApp/Email.

Thank you,
${formData.ownerName.trim()}
${formData.storeName.trim()}`;

    const mailto = `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    const gmailWeb = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${COMPANY_EMAIL}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    setMailtoLink(mailto);
    setGmailWebLink(gmailWeb);
    setSubmitted(true);

    // Trigger redirection to device email client / mobile mail app
    if (typeof window !== 'undefined') {
      window.location.href = mailto;
    }
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
          <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-8 text-center space-y-6 shadow-md max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-jade-100 border border-jade-600/30 text-jade-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display text-2xl text-ink-950 font-bold">Opening Email Application...</h2>
              <p className="text-xs text-muted max-w-lg mx-auto leading-relaxed">
                Your dealer application formatted data has been generated for <strong className="text-ink-950">{COMPANY_EMAIL}</strong>. If your email application did not open automatically, please click below to send:
              </p>
            </div>

            <div className="bg-parchment-50 p-4 rounded-[8px] border border-parchment-300 text-left text-xs space-y-1 font-mono text-ink-text/90">
              <div className="font-sans font-bold text-ink-950 mb-1 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-ember-500" />
                <span>Email Summary Prepared:</span>
              </div>
              <div><strong>To:</strong> {COMPANY_EMAIL}</div>
              <div><strong>Business:</strong> {formData.storeName} ({formData.ownerName})</div>
              <div><strong>Contact:</strong> {formData.phone} | {formData.email}</div>
              <div><strong>City & GSTIN:</strong> {formData.city} | {formData.gstin || 'N/A'}</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={mailtoLink}
                className="inline-flex items-center justify-center gap-2 bg-ember-600 hover:bg-ember-700 text-white font-bold text-xs py-3 px-6 rounded-[6px] transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Open Mobile / Desktop Mail App</span>
              </a>

              <a
                href={gmailWebLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-ink-950 hover:bg-ink-900 text-parchment-text font-bold text-xs py-3 px-6 rounded-[6px] transition-colors border border-ink-800 shadow-sm"
              >
                <ExternalLink className="w-4 h-4 text-gold-500" />
                <span>Open in Gmail Web</span>
              </a>
            </div>

            <div className="pt-4 border-t border-parchment-300/60">
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-muted hover:text-ink-950 font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Edit Application Details</span>
              </button>
            </div>
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
                    <span>Minimum Order Value (MOV) of ₹6,000 per order threshold.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-ember-500 shrink-0 mt-0.5" />
                    <span>Valid GSTIN or business registration proof required.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span>5 pcs minimum order quantity per SKU.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-ink-950 text-parchment-text p-5 rounded-[10px] border border-ink-800 space-y-2">
                <h4 className="font-display text-base text-gold-500 font-bold">Direct Company Email</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Submitting this form redirects directly to your email app/Gmail with formatted details to send to <strong className="text-parchment-50">{COMPANY_EMAIL}</strong>.
                </p>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-ink-950">Store Type</label>
                    <select
                      name="storeType"
                      value={formData.storeType}
                      onChange={handleChange}
                      className="w-full text-xs p-2.5 rounded-[6px] bg-parchment-50 border border-parchment-300 text-ink-950 focus:outline-none focus:border-ember-500"
                    >
                      <option value="Physical Retail Shop">Physical Retail Shop</option>
                      <option value="Online E-commerce Store">Online E-commerce Store</option>
                      <option value="Comic & Hobby Store">Comic & Hobby Store</option>
                      <option value="Social Media Reseller (Instagram/FB)">Social Media Reseller</option>
                      <option value="Wholesale Distributor">Wholesale Distributor</option>
                    </select>
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
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Additional Comments / Notes (Optional)</label>
                  <textarea
                    name="comments"
                    rows={2}
                    value={formData.comments}
                    onChange={handleChange}
                    placeholder="Describe your expected monthly volume or product categories of interest..."
                    className="w-full text-xs p-2.5 rounded-[6px] bg-parchment-50 border border-parchment-300 text-ink-950 focus:outline-none focus:border-ember-500"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="ember" size="md" fullWidth className="gap-2 font-bold uppercase">
                    <Send className="w-4 h-4" />
                    <span>Submit & Open Email Application</span>
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

