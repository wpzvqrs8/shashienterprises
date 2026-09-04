'use client';

import React, { useState } from 'react';
import { INITIAL_STORE_SETTINGS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-parchment-50 min-h-screen py-12 border-b border-parchment-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-ember-600 bg-ember-100 px-3 py-1 rounded-full">
            Direct Trade Support
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-ink-950">
            Contact Shashi Enterprises Desk
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Connect with our trade team for bulk inquiries, custom import requests, or order tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Info Card Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-ink-950 text-parchment-text p-6 rounded-[12px] border border-ink-800 space-y-6 shadow-warm">
              <h3 className="font-display text-xl text-parchment-50 border-b border-ink-800 pb-3">
                Trade Desk Channels
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-jade-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-muted font-bold">WhatsApp Direct Trade Line</div>
                    <a
                      href={`https://wa.me/${INITIAL_STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-jade-600 hover:underline text-sm block mt-0.5"
                    >
                      {INITIAL_STORE_SETTINGS.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-ember-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-muted font-bold">Official Trade Email</div>
                    <a href={`mailto:${INITIAL_STORE_SETTINGS.email}`} className="font-bold text-parchment-50 hover:underline">
                      {INITIAL_STORE_SETTINGS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-muted font-bold">Central Dispatch Facility</div>
                    <div className="text-parchment-50">{INITIAL_STORE_SETTINGS.address}</div>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${INITIAL_STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Shashi%20Enterprises%2C%20I%20have%20a%20trade%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-jade-600 hover:bg-jade-600/90 text-white font-bold text-xs py-3 px-4 rounded-[6px] transition-colors uppercase tracking-wider shadow"
              >
                Chat Live on WhatsApp
              </a>

            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-7 bg-parchment-100 border border-parchment-300 p-6 rounded-[12px] shadow-sm">
            {submitted ? (
              <div className="bg-jade-100 border border-jade-600/30 text-jade-600 p-8 rounded-[8px] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <h3 className="font-display text-xl">Inquiry Sent!</h3>
                <p className="text-xs">We have received your message and will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display text-xl text-ink-950 border-b border-parchment-300 pb-2">
                  Send a Trade Message
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Name / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-ink-950">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-ink-950">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950">Inquiry Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Details about SKUs, container shipments, or trade accounts..."
                    className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                  />
                </div>

                <Button type="submit" variant="ember" size="md" className="gap-2">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </Button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
