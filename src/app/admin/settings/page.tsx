'use client';

import React, { useState, useEffect } from 'react';
import { StoreSettings } from '@/lib/types';
import { getStoreSettings, updateStoreSettings } from '@/lib/catalog-store';
import { Button } from '@/components/ui/button';
import { Save, Check, Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getStoreSettings();
      setSettings(data);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    await updateStoreSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) {
    return <div className="p-8 text-center text-muted">Loading store settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center border-b border-parchment-300 pb-4">
        <div>
          <h1 className="font-display text-3xl text-ink-950">Store & Trade Settings</h1>
          <p className="text-xs text-muted">Configure B2B store metadata, GSTIN registration, WhatsApp line, and MOV thresholds.</p>
        </div>
      </div>

      {saved && (
        <div className="bg-jade-100 border border-jade-600/30 text-jade-600 p-4 rounded-[8px] flex items-center gap-2 font-bold text-xs">
          <Check className="w-5 h-5" />
          <span>Store settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Brand Information */}
        <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-6 space-y-4 shadow-sm">
          <h3 className="font-display text-xl text-ink-950 border-b border-parchment-300 pb-2">
            1. Brand & Business Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-ink-950">Store Brand Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-ink-950">Legal Registered Name</label>
              <input
                type="text"
                value={settings.legalName}
                onChange={e => setSettings({ ...settings, legalName: e.target.value })}
                className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-ink-950">GSTIN Registration Number</label>
              <input
                type="text"
                value={settings.gstin}
                onChange={e => setSettings({ ...settings, gstin: e.target.value })}
                className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 uppercase font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-ink-950">Minimum Order Value (MOV ₹)</label>
              <input
                type="number"
                value={settings.minimumOrderValue}
                onChange={e => setSettings({ ...settings, minimumOrderValue: Number(e.target.value) })}
                className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ember-600 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Contact Channels */}
        <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-6 space-y-4 shadow-sm">
          <h3 className="font-display text-xl text-ink-950 border-b border-parchment-300 pb-2">
            2. Direct Trade Contact Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-ink-950">WhatsApp Trade Number</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-ink-950">Official Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="ember" size="lg" disabled={saving} className="gap-2 shadow-warm">
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>

      </form>

    </div>
  );
}
