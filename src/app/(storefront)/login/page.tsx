'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function BuyerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('shashi_buyer_logged_in', 'true');
      localStorage.setItem('shashi_buyer_email', email || 'buyer@toyworld.in');
    }
    router.push('/account');
  };

  return (
    <div className="bg-parchment-50 min-h-screen py-16 flex items-center justify-center border-b border-parchment-300">
      <div className="max-w-md w-full mx-4 bg-parchment-100 border border-parchment-300 rounded-[12px] p-8 shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <div className="relative h-14 w-52 mx-auto">
            <Image
              src="/logo_white_bg.png"
              alt="Shashi Enterprises"
              fill
              className="object-contain"
            />

          </div>
          <h1 className="font-display text-2xl text-ink-950">Dealer Account Portal</h1>
          <p className="text-xs text-muted">Sign in to view order history and saved business addresses.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Business Email</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="trade@yourshop.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950 pl-9"
              />
              <User className="w-4 h-4 text-muted absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Account Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950 pl-9"
              />
              <Lock className="w-4 h-4 text-muted absolute left-3 top-3" />
            </div>
          </div>

          <Button type="submit" variant="ember" size="md" fullWidth className="gap-2 pt-2">
            <span>Sign In to Account</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="pt-4 border-t border-parchment-300 text-center text-xs text-muted space-y-2">
          <div>Don't have a wholesale account yet?</div>
          <Link href="/become-a-dealer" className="font-bold text-ember-600 hover:underline block">
            Apply for Dealer Onboarding →
          </Link>
          <div className="pt-2 text-[11px]">
            Are you a store administrator? <Link href="/admin/login" className="text-gold-500 font-bold hover:underline">Admin Login</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
