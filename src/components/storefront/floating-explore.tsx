'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { useCart } from '@/lib/cart-store';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const FloatingExplore: React.FC = () => {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const { isCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show button on the landing page ('/') and for non-admin users
  if (pathname !== '/' || isAdmin) return null;

  return (
    <Link
      href="/shop"
      aria-label="Shop Now - Browse Wholesale Products Catalog"
      className={`fixed bottom-6 left-6 z-50 flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-full shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-blue-300/50 group font-bold text-xs uppercase tracking-wider animate-shake-periodic cursor-pointer ${
        isCartOpen
          ? 'pointer-events-none opacity-0 translate-y-6 scale-90 invisible'
          : isScrolled
          ? 'opacity-100 pointer-events-auto translate-y-0 visible'
          : 'opacity-100 pointer-events-auto translate-y-0 visible md:opacity-0 md:pointer-events-none md:translate-y-4 md:invisible'
      }`}
    >
      <div className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-md group-hover:rotate-12 transition-transform">
        <ShoppingBag className="w-3.5 h-3.5" />
      </div>
      <span className="font-display font-extrabold text-white tracking-wider text-xs">
        Shop Now
      </span>
      <ArrowRight className="w-4 h-4 text-blue-100 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
};
