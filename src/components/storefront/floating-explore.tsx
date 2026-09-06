'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FloatingExplore: React.FC = () => {
  const { isAdmin } = useAuth();

  // If the user is an Admin, do not show the Explore Products button (keep usual Admin floating button)
  if (isAdmin) return null;

  return (
    <Link
      href="/shop"
      aria-label="Explore Products Catalog"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-ink-950 hover:bg-ink-900 text-parchment-text px-4 py-2.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-ember-500/80 group font-bold text-xs uppercase tracking-wider animate-shake-periodic cursor-pointer"
    >
      <div className="w-6 h-6 rounded-full bg-ember-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:rotate-12 transition-transform">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col text-left">
        <span className="font-display font-extrabold text-parchment-50 tracking-wide text-xs">
          Explore Products
        </span>
      </div>
      <ArrowRight className="w-4 h-4 text-ember-500 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
};
