'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CATEGORIES, INITIAL_STORE_SETTINGS } from '@/lib/mock-data';

import { useCart } from '@/lib/cart-store';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  // Auto-hide navbar logic on scroll
  const [isVisible, setIsVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shashi_admin_logged_in', 'true');
    }

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 60) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // User scrolling down the page -> shift navbar up out of screen
        setIsVisible(false);
      } else {
        // User scrolling up the page -> bring navbar back down into position
        setIsVisible(true);
      }


      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const seriesCategories = CATEGORIES.filter(c => c.type === 'series');
  const typeCategories = CATEGORIES.filter(c => c.type === 'type');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-ink-950 text-parchment-text border-b border-ink-800 shadow-md transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-52 group-hover:scale-105 transition-transform">
                <Image
                  src="/logo_black_bg.png"
                  alt="Shashi Enterprises B2B Anime Collectibles"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7 text-sm sm:text-base font-semibold uppercase tracking-wide">
              <Link href="/" className="hover:text-ember-500 transition-colors">
                Home
              </Link>

              {/* Shop Mega Menu Trigger */}
              <div
                className="relative py-6"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <Link
                  href="/shop"
                  className="flex items-center gap-1 hover:text-ember-500 transition-colors"
                >
                  <span>Shop Catalog</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>

                {/* Mega Menu Dropdown */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full left-0 w-[680px] bg-ink-900 border border-ink-800 shadow-warm-lg p-6 grid grid-cols-3 gap-6 z-50 rounded-b-[10px]">
                    
                    {/* Series Column */}
                    <div>
                      <h4 className="font-display text-base text-ember-500 mb-3 border-b border-ink-800 pb-1 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> Shop by Series
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm normal-case text-parchment-text/80 tracking-wide">
                        {seriesCategories.slice(0, 7).map(cat => (
                          <li key={cat.id}>
                            <Link
                              href={`/shop/${cat.slug}`}
                              className="hover:text-ember-500 transition-colors block py-0.5"
                              onClick={() => setIsMegaMenuOpen(false)}
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Category Type Column */}
                    <div>
                      <h4 className="font-display text-base text-gold-500 mb-3 border-b border-ink-800 pb-1">
                        Shop by Type
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm normal-case text-parchment-text/80 tracking-wide">
                        {typeCategories.map(cat => (
                          <li key={cat.id}>
                            <Link
                              href={`/shop/${cat.slug}`}
                              className="hover:text-ember-500 transition-colors block py-0.5"
                              onClick={() => setIsMegaMenuOpen(false)}
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Featured Tile */}
                    <div className="bg-ink-950 p-4 rounded-[8px] border border-ink-800 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] bg-ember-500 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          Bulk Special
                        </span>
                        <h5 className="font-display text-base text-parchment-50 mt-2">
                          Tiered Discounts Up To 45% OFF
                        </h5>
                        <p className="text-xs text-muted mt-1 normal-case leading-relaxed">
                          GST invoices on all bulk anime statue dispatch from Shashi Enterprises.
                        </p>
                      </div>
                      <Link
                        href="/shop"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="text-xs sm:text-sm text-ember-500 font-bold hover:underline mt-4 block"
                      >
                        Explore All Products →
                      </Link>
                    </div>

                  </div>
                )}
              </div>

              <Link href="/about" className="hover:text-ember-500 transition-colors">
                About
              </Link>
              <Link href="/become-a-dealer" className="hover:text-ember-500 transition-colors">
                Become a Dealer
              </Link>
              <Link href="/contact" className="hover:text-ember-500 transition-colors">
                Contact 
              </Link>
            </nav>

          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Conditional Admin Quick Console Button */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-ink-950 text-xs font-bold px-3.5 py-1.5 rounded-[6px] transition-all shadow-md uppercase tracking-wider mr-4 sm:mr-6 ml-2 sm:ml-4"
              >
                <span>Admin Portal</span>
              </Link>
            )}

            {/* Expanded Search Input */}

            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search SKU, series, product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-ink-900 border border-ember-500 text-parchment-50 text-xs sm:text-sm px-3.5 py-1.5 rounded-l-[6px] focus:outline-none w-48 sm:w-72 tracking-wide"
                />
                <button
                  type="submit"
                  className="bg-ember-500 text-white px-3.5 py-1.5 rounded-r-[6px] hover:bg-ember-600"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-2 text-muted hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="p-2 text-parchment-text hover:text-ember-500 transition-colors"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Account Icon */}
            <Link
              href="/login"
              aria-label="Account"
              className="p-2 text-parchment-text hover:text-ember-500 transition-colors"
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>

            {/* Cart Icon & Counter */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
              className="relative p-2 text-parchment-text hover:text-ember-500 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-ember-500 text-white text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border border-ink-950 animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle (Custom 2-Line Animated Icon -> X) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              className="lg:hidden p-2 text-parchment-text hover:text-ember-500 relative flex items-center justify-center w-10 h-10 rounded-md focus:outline-none"
            >
              <div className="w-6 h-6 relative flex items-center justify-center">
                <span
                  className={`absolute w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out origin-center ${
                    isMobileMenuOpen ? 'top-[11px] rotate-45' : 'top-[6px] rotate-0'
                  }`}
                />
                <span
                  className={`absolute w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out origin-center ${
                    isMobileMenuOpen ? 'top-[11px] -rotate-45' : 'bottom-[6px] rotate-0'
                  }`}
                />
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-ink-900 border-b border-ink-800 px-4 pt-4 pb-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              placeholder="Search SKUs, anime series, figures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-ink-950 border border-ink-800 text-parchment-50 text-xs sm:text-sm px-3.5 py-2.5 rounded-l-md w-full focus:outline-none focus:border-ember-500"
            />
            <button type="submit" className="bg-ember-500 hover:bg-ember-600 text-white px-4 py-2.5 rounded-r-md transition-colors flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Core Navigation Links */}
          <nav className="flex flex-col space-y-3 text-sm font-semibold uppercase tracking-wider">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-ink-800 flex items-center justify-between text-parchment-100 hover:text-ember-500"
            >
              <span>Home</span>
              <span className="text-xs text-muted font-normal">01</span>
            </Link>
            
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-ink-800 flex items-center justify-between text-parchment-100 hover:text-ember-500"
            >
              <span>All Wholesale Catalog</span>
              <span className="text-xs text-muted font-normal">21 SKUs</span>
            </Link>

            {/* Shop by Anime Series */}
            <div className="py-2 border-b border-ink-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-ember-500 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Shop by Series</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs normal-case pt-1 font-normal">
                {seriesCategories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/shop/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-parchment-text/80 hover:text-ember-400 py-1 px-2 rounded bg-ink-950/60 border border-ink-800/60 truncate"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Shop by Product Type */}
            <div className="py-2 border-b border-ink-800 space-y-2">
              <div className="text-xs text-gold-500 font-bold uppercase tracking-wider">
                Product Categories
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs normal-case pt-1 font-normal">
                {typeCategories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/shop/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-parchment-text/80 hover:text-gold-400 py-1 px-2 rounded bg-ink-950/60 border border-ink-800/60 truncate"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Institutional Links */}
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-ink-800 text-parchment-100 hover:text-ember-500"
            >
              About Us
            </Link>
            <Link
              href="/become-a-dealer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-ink-800 text-parchment-100 hover:text-ember-500"
            >
              Become a Dealer
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-ink-800 text-parchment-100 hover:text-ember-500"
            >
              Contact Us
            </Link>

            {/* Admin Console Shortcut */}
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3 mt-2 text-ink-950 bg-gold-500 hover:bg-gold-600 rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-sm"
            >
              <span>Admin Control Center</span>
              <span>→</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
