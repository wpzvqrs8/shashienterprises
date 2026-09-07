'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/components/providers/auth-provider';
import { addOrder } from '@/lib/catalog-store';
import {
  validateBusinessName,
  validateName,
  validatePhone,
  validateEmail,
  validateGSTIN,
  validateAddress,
  validateCity,
  validatePincode
} from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, ArrowLeft, Lock, LogIn, Send, AlertTriangle, Loader2, Mail } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, openLoginModal } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    gstin: '',
    address: '',
    city: '',
    pincode: '',
    paymentPreference: 'Quote Billing',
    agreeTerms: false
  });

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill user data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: prev.email || user.email || '',
        contactPerson: prev.contactPerson || user.user_metadata?.full_name || user.user_metadata?.name || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;

    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error on change if field becomes valid
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    const bErr = validateBusinessName(formData.businessName);
    if (bErr) newErrors.businessName = bErr;

    const cErr = validateName(formData.contactPerson, 'Contact Person Name');
    if (cErr) newErrors.contactPerson = cErr;

    const pErr = validatePhone(formData.phone);
    if (pErr) newErrors.phone = pErr;

    const eErr = validateEmail(formData.email || user?.email || '');
    if (eErr) newErrors.email = eErr;

    const gErr = validateGSTIN(formData.gstin);
    if (gErr) newErrors.gstin = gErr;

    const aErr = validateAddress(formData.address);
    if (aErr) newErrors.address = aErr;

    const ciErr = validateCity(formData.city);
    if (ciErr) newErrors.city = ciErr;

    const pinErr = validatePincode(formData.pincode);
    if (pinErr) newErrors.pincode = pinErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openLoginModal('Please sign in with your Google Account to proceed with wholesale checkout.');
      return;
    }

    if (!validateStep1()) {
      return;
    }

    setStep(2);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Authentication required. Please sign in with your Google account to submit a quote request.');
      openLoginModal();
      return;
    }

    if (!validateStep1()) {
      setStep(1);
      return;
    }

    if (!formData.agreeTerms) {
      setErrors(prev => ({ ...prev, agreeTerms: 'Please accept the wholesale trade terms to proceed.' }));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName.trim(),
          contactPerson: formData.contactPerson.trim(),
          phone: formData.phone.trim(),
          email: (formData.email || user.email || '').trim(),
          gstin: formData.gstin.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          paymentPreference: formData.paymentPreference,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process checkout request.');
      }

      if (data.order) {
        await addOrder(data.order);
      }

      clearCart();
      router.push(`/track/${data.orderNumber || data.order.orderNumber}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to submit quote request. Please try again.');
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-display text-2xl text-ink-950">No Order Items to Submit</h2>
        <p className="text-xs text-muted">Your cart is currently empty.</p>
        <Button variant="ember" size="md" onClick={() => router.push('/shop')}>
          Browse Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-parchment-50 min-h-screen py-10 border-b border-parchment-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-ember-600 bg-ember-100 px-3 py-1 rounded-full">
            Quote-Based B2B Checkout
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-ink-950 mt-2">
            Submit Wholesale Purchase Request
          </h1>
          <p className="text-xs text-muted mt-1">
            No instant payment required. We generate a formal tax quote & dispatch window within 24 hours.
          </p>
        </div>

        {/* Authentication Notice Banner if not logged in */}
        {!user && (
          <div className="mb-8 bg-amber-50 border border-amber-300 rounded-[10px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-900 text-xs">
              <Lock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong>Google Account Required for Checkout:</strong> You can add items to your cart freely, but placing a wholesale quote request requires a verified Google sign-in.
              </div>
            </div>
            <Button variant="ember" size="sm" onClick={() => openLoginModal()} className="shrink-0 gap-2 text-xs">
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </Button>
          </div>
        )}

        {/* 2-Step Indicator Bar */}
        <div className="flex items-center justify-between mb-8 bg-parchment-100 p-3 rounded-[10px] border border-parchment-300">
          <div className={`flex items-center gap-2 text-xs font-bold uppercase ${step >= 1 ? 'text-ember-600' : 'text-muted'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-ember-500 text-white' : 'bg-parchment-300 text-ink-950'}`}>1</span>
            <span>Business Details</span>
          </div>
          <div className="h-[2px] flex-1 mx-4 bg-parchment-300" />
          <div className={`flex items-center gap-2 text-xs font-bold uppercase ${step >= 2 ? 'text-ember-600' : 'text-muted'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-ember-500 text-white' : 'bg-parchment-300 text-ink-950'}`}>2</span>
            <span>Review & Submit Order Request</span>
          </div>
        </div>

        {/* Step Forms Container */}
        <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 shadow-sm">
          
          {/* Validation Error Summary Box */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-300 text-red-900 p-4 rounded-[8px] text-xs space-y-1">
              <div className="font-bold flex items-center gap-2 text-red-950 text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Please correct the invalid fields below before proceeding:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] pt-1">
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* STEP 1: Business Details */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <h3 className="font-display text-xl text-ink-950 border-b border-parchment-300 pb-2">
                Step 1: Business & Delivery Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Shop / Business Name *</label>
                  <input
                    type="text"
                    required
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Toy World Karol Bagh"
                    className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 ${
                      errors.businessName ? 'bg-red-50 border-2 border-red-500' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                    }`}
                  />
                  {errors.businessName && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.businessName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 ${
                      errors.contactPerson ? 'bg-red-50 border-2 border-red-500' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                    }`}
                  />
                  {errors.contactPerson && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.contactPerson}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Mobile / WhatsApp Number *</label>
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

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Verified Email Address *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    readOnly={!!user}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="trade@yourshop.com"
                    className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 ${
                      errors.email ? 'bg-red-50 border-2 border-red-500' : user ? 'bg-parchment-200/70 border border-parchment-300 cursor-not-allowed font-medium' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.email}</p>}
                  {user && !errors.email && (
                    <span className="text-[10px] text-jade-700 font-semibold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3" /> Signed in via Google ({user.email})
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-ink-950">GSTIN Number (Optional for GST Invoice)</label>
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

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-ink-950">Delivery Street Address *</label>
                <textarea
                  required
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Shop number, building name, street address..."
                  className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 ${
                    errors.address ? 'bg-red-50 border-2 border-red-500' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Delhi"
                    className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 ${
                      errors.city ? 'bg-red-50 border-2 border-red-500' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                    }`}
                  />
                  {errors.city && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.city}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Pincode *</label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="110005"
                    className={`w-full text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 ${
                      errors.pincode ? 'bg-red-50 border-2 border-red-500' : 'bg-parchment-50 border border-parchment-300 focus:border-ember-500'
                    }`}
                  />
                  {errors.pincode && <p className="text-[11px] text-red-600 font-semibold mt-0.5">{errors.pincode}</p>}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="ember" size="md" className="gap-2">
                  <span>Continue to Order Review</span>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: Review Purchase Items & Submit */}
          {step === 2 && (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <h3 className="font-display text-xl text-ink-950 border-b border-parchment-300 pb-2">
                Step 2: Review Purchase Items & Submit Request
              </h3>

              <div className="bg-parchment-50 p-3 rounded border border-parchment-300 text-xs space-y-1">
                <div><strong className="text-ink-950">Business:</strong> {formData.businessName} ({formData.contactPerson})</div>
                <div><strong className="text-ink-950">Phone/WhatsApp:</strong> {formData.phone} | {formData.email}</div>
                <div><strong className="text-ink-950">Dispatch Address:</strong> {formData.address}, {formData.city} - {formData.pincode}</div>
                {formData.gstin && <div><strong className="text-ink-950">GSTIN:</strong> {formData.gstin}</div>}
              </div>

              <div className="divide-y divide-parchment-300 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.product.id} className="py-2 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-ink-950">{item.product.name}</div>
                      <div className="text-muted">{item.quantity} pcs @ ₹{item.selectedTierPrice}/pc</div>
                    </div>
                    <div className="font-bold text-ember-600">₹{item.lineTotal.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>

              <div className="bg-ink-950 text-parchment-text p-3 rounded text-xs flex justify-between items-center font-bold">
                <span>Subtotal (Excl. Shipping):</span>
                <span className="text-ember-500 text-base">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {/* 2-EMAILS MANDATE NOTICE BOX */}
              <div className="bg-blue-50 border border-blue-300 rounded-[8px] p-4 text-blue-950 text-xs space-y-2 shadow-sm">
                <div className="font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-blue-900">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Important: You Will Receive 2 Emails</span>
                </div>
                <p className="text-[11.5px] leading-relaxed">
                  Please check your inbox ({formData.email || user?.email}) for <strong>two automated emails</strong>:
                </p>
                <div className="bg-white/80 p-2.5 rounded border border-blue-200 text-[11px] space-y-1.5 text-blue-900">
                  <div>
                    <strong className="text-blue-950">1st Email (Order Received):</strong> Sent immediately after you click <em>Submit Order Request</em> to acknowledge your submission.
                  </div>
                  <div>
                    <strong className="text-blue-950">2nd Email (Order Confirmation):</strong> Sent once your request is reviewed & approved by Shashi Enterprises Admin.
                  </div>
                  <div className="pt-1.5 border-t border-blue-200/80 text-[11px] text-amber-900 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>If you don't see the email in your main inbox, please check your <u>Spam / Junk folder</u> and mark as "Not Spam".</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed bg-ember-100/50 p-3 rounded border border-ember-500/20">
                ℹ️ <strong>Note:</strong> Final total including packing & freight will be calculated and shared with you on WhatsApp ({formData.phone}) within 24 hours for your confirmation prior to payment.
              </p>

              <div className="pt-2 border-t border-parchment-300 space-y-1">
                <label className="flex items-start gap-2.5 text-xs text-ink-text/90 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="accent-ember-500 mt-0.5"
                  />
                  <span>
                    I confirm that I am purchasing as a business/reseller and agree to the <strong>Wholesale B2B Terms of Trade</strong>.
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-[11px] text-red-600 font-semibold">{errors.agreeTerms}</p>}
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" size="md" onClick={() => setStep(1)} className="gap-2" disabled={submitting}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Business Info</span>
                </Button>
                <Button
                  type="submit"
                  variant="ember"
                  size="lg"
                  disabled={submitting || !formData.agreeTerms}
                  className="gap-2 min-w-[220px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Submitting Order Request...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Submit Order Request</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}



