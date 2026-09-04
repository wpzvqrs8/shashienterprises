'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { INITIAL_STORE_SETTINGS } from '@/lib/mock-data';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(INITIAL_STORE_SETTINGS.adminEmail);
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase().trim() === INITIAL_STORE_SETTINGS.adminEmail.toLowerCase()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('shashi_admin_logged_in', 'true');
      }
      router.push('/admin');
    } else {
      setError(`Access Restricted. Only authorized admin email (${INITIAL_STORE_SETTINGS.adminEmail}) is permitted.`);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 text-parchment-text flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-ink-900 border border-ink-800 rounded-[14px] p-8 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="relative h-14 w-52 mx-auto">
            <Image
              src="/logo_black_bg.png"
              alt="Shashi Enterprises Admin"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-display text-2xl text-parchment-50 tracking-wide">
            Admin Console Login
          </h1>
          <p className="text-xs text-muted">
            Shashi Enterprises B2B Internal Administration
          </p>

        </div>

        {/* Note comment in UI & Code */}
        {/* NOTE: Access restricted to hardcoded admin email once Supabase auth is wired in */}
        <div className="bg-ink-950 p-3 rounded-[6px] border border-ink-800 text-[11px] text-gold-500 font-mono">
          🔒 Production restriction note: Supabase RLS will restrict table access strictly to single authorized email: <strong>{INITIAL_STORE_SETTINGS.adminEmail}</strong>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger p-3 rounded text-xs flex items-center gap-2 font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-parchment-text/80">Admin Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-ink-950 border border-ink-800 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-parchment-50 pl-9 font-mono"
              />
              <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-parchment-text/80">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-ink-950 border border-ink-800 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-parchment-50 pl-9 font-mono"
              />
              <Lock className="w-4 h-4 text-muted absolute left-3 top-3" />
            </div>
          </div>

          <Button type="submit" variant="ember" size="md" fullWidth className="gap-2 pt-2">
            <span>Authenticate Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

      </div>
    </div>
  );
}
