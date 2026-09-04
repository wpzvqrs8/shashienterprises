'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { addOrder } from '@/lib/catalog-store';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, isMovMet } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
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
    paymentPreference: 'UPI',
    agreeTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setFormData(prev => ({ ...prev, [target.name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.businessName || !formData.contactPerson || !formData.phone || !formData.address) {
        alert('Please fill out all required business and address fields.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Please accept the wholesale trade terms.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await addOrder({
        businessName: formData.businessName,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        gstin: formData.gstin,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        paymentPreference: formData.paymentPreference,
        items,
        subtotal
      });

      clearCart();
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to submit quote request. Please try again.');
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

        {/* 3-Step Indicator Bar */}
        <div className="flex items-center justify-between mb-8 bg-parchment-100 p-3 rounded-[10px] border border-parchment-300">
          <div className={`flex items-center gap-2 text-xs font-bold uppercase ${step >= 1 ? 'text-ember-600' : 'text-muted'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-ember-500 text-white' : 'bg-parchment-300 text-ink-950'}`}>1</span>
            <span>Business Details</span>
          </div>
          <div className="h-[2px] flex-1 mx-3 bg-parchment-300" />
          <div className={`flex items-center gap-2 text-xs font-bold uppercase ${step >= 2 ? 'text-ember-600' : 'text-muted'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-ember-500 text-white' : 'bg-parchment-300 text-ink-950'}`}>2</span>
            <span>Review Order</span>
          </div>
          <div className="h-[2px] flex-1 mx-3 bg-parchment-300" />
          <div className={`flex items-center gap-2 text-xs font-bold uppercase ${step >= 3 ? 'text-ember-600' : 'text-muted'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-ember-500 text-white' : 'bg-parchment-300 text-ink-950'}`}>3</span>
            <span>Submit Request</span>
          </div>
        </div>

        {/* Step Forms Container */}
        <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 shadow-sm">
          
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
                    className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                  />
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
                    className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Email Address *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="trade@yourshop.com"
                    className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-ink-950">GSTIN Number (Optional for GST Invoice)</label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="e.g. 079988D0GBSQ1HJ"
                  className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-ink-950">Delivery Street Address *</label>
                <textarea
                  required
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Shop number, building name, street..."
                  className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                />
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
                    className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                  />
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
                    className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="ember" size="md" className="gap-2">
                  <span>Continue to Order Review</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: Review Order */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-display text-xl text-ink-950 border-b border-parchment-300 pb-2">
                Step 2: Review Purchase Items & Terms
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

              <p className="text-xs text-muted leading-relaxed bg-ember-100/50 p-3 rounded border border-ember-500/20">
                ℹ️ <strong>Note:</strong> Final total including packing & freight will be calculated and shared with you on WhatsApp ({formData.phone}) within 24 hours for your confirmation prior to payment.
              </p>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" size="md" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Business Info</span>
                </Button>
                <Button variant="ember" size="md" onClick={() => setStep(3)} className="gap-2">
                  <span>Continue to Payment Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Preference & Submit */}
          {step === 3 && (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <h3 className="font-display text-xl text-ink-950 border-b border-parchment-300 pb-2">
                Step 3: Preferred Payment Method & Submit
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-ink-950">Preferred Payment Mode (Selected on Invoice)</label>
                <div className="space-y-2 text-xs">
                  {[
                    { id: 'UPI', label: 'UPI / QR Code (Instant Confirmation)' },
                    { id: 'Bank Transfer', label: 'NEFT / RTGS / IMPS Bank Transfer' },
                    { id: 'Cash on Pickup', label: 'Cash on Collection (Delhi Warehouse Pickup)' },
                  ].map(m => (
                    <label key={m.id} className="flex items-center gap-3 p-3 bg-parchment-50 border border-parchment-300 rounded cursor-pointer hover:border-ember-500">
                      <input
                        type="radio"
                        name="paymentPreference"
                        value={m.id}
                        checked={formData.paymentPreference === m.id}
                        onChange={handleChange}
                        className="accent-ember-500"
                      />
                      <span className="font-bold text-ink-950">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-parchment-300">
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
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" size="md" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="ember"
                  size="lg"
                  disabled={submitting || !formData.agreeTerms}
                  className="gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{submitting ? 'Submitting Order Request...' : 'Submit Order Request'}</span>
                </Button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
