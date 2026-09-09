'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { useCart } from '@/lib/cart-store';
import { ShieldCheck, Settings } from 'lucide-react';

export const FloatingAdmin: React.FC = () => {
  const { isAdmin } = useAuth();
  const { isCartOpen } = useCart();

  if (!isAdmin) return null;

  return (
    <Link
      href="/admin"
      aria-label="Open Admin Console"
      className={`fixed bottom-6 left-6 z-50 flex items-center gap-2.5 bg-gold-500 hover:bg-gold-600 text-ink-950 px-4 py-2.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-gold-400/60 group font-bold text-xs uppercase tracking-wider ${
        isCartOpen ? 'pointer-events-none opacity-0 translate-y-6 scale-90 invisible' : 'opacity-100 translate-y-0 scale-100 visible'
      }`}
    >
      <div className="w-6 h-6 rounded-full bg-ink-950 text-gold-500 flex items-center justify-center shrink-0 shadow-md group-hover:rotate-12 transition-transform">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <span className="font-display font-extrabold text-ink-950">Admin Panel</span>
      <Settings className="w-3.5 h-3.5 text-ink-950 opacity-80 group-hover:rotate-90 transition-transform duration-500" />
    </Link>
  );
};
