'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CATEGORIES, INITIAL_STORE_SETTINGS, MARQUEE_TEXT } from '@/lib/constants';

import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/components/providers/auth-provider';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  ShieldCheck,
  Package
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { itemCount, setIsCartOpen, activeTab, setActiveTab, openOrders } = useCart();
  const { user, isAdmin, signOut, openLoginModal } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = React.useRef<HTMLDivElement>(null);

  // Auto-hide navbar & close dropdowns logic on scroll / click outside
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = React.useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      lastScrollYRef.current = window.scrollY;
    }

    const handleScroll = () => {
      // Auto-close user dropdown on scroll
      setIsUserDropdownOpen(false);

      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollYRef.current;
      const diff = currentScrollY - prevScrollY;

      if (currentScrollY <= 60) {
        setIsVisible(true);
      } else if (diff > 4) {
        // User scrolling down the page -> hide navbar
        setIsVisible(false);
      } else if (diff < -4) {
        // User scrolling up the page -> drop navbar down from top of screen
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  const getUserInitials = (email?: string, name?: string): string => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email && email.trim()) {
      const username = email.split('@')[0];
      return username.slice(0, 2).toUpperCase();
    }
    return 'SE';
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-ink-950 border-b border-ink-800 text-parchment-text shadow-xl transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ backgroundColor: '#141218' }}
    >

      {/* Main Navbar */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative h-10 sm:h-12 w-36 sm:w-52 group-hover:scale-105 transition-transform">
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
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold uppercase tracking-wide">
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
                  <div className="absolute top-full left-0 w-[680px] max-w-[calc(100vw-32px)] bg-ink-900 border border-ink-800 shadow-warm-lg p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 z-50 rounded-b-[10px]">
                    <div>
                      <h4 className="font-display text-base text-ember-500 mb-3 border-b border-ink-800 pb-1 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> Shop by Series
                      </h4>
                      <ul className="space-y-2 text-sm normal-case text-parchment-text/80 tracking-wide">
                        {seriesCategories.map(cat => (
                          <li key={cat.id}>
                            <Link href={`/shop/${cat.slug}`} className="hover:text-ember-500 transition-colors block py-0.5" onClick={() => setIsMegaMenuOpen(false)}>
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-display text-base text-gold-500 mb-3 border-b border-ink-800 pb-1">
                        Shop by Type
                      </h4>
                      <ul className="space-y-2 text-sm normal-case text-parchment-text/80 tracking-wide">
                        {typeCategories.map(cat => (
                          <li key={cat.id}>
                            <Link href={`/shop/${cat.slug}`} className="hover:text-ember-500 transition-colors block py-0.5" onClick={() => setIsMegaMenuOpen(false)}>
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-ink-950 p-4 rounded-[8px] border border-ink-800 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] bg-ember-500 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          Bulk Special
                        </span>
                        <h5 className="font-display text-base text-parchment-50 mt-2">
                          Tiered Discounts Up To 45% OFF
                        </h5>
                      </div>
                      <Link href="/shop" onClick={() => setIsMegaMenuOpen(false)} className="text-sm text-ember-500 font-bold hover:underline mt-4 block">
                        Explore All Products →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {!isAdmin && (
                <>
                  <Link href="/become-a-dealer" className="hover:text-ember-500 transition-colors">
                    Become a Dealer
                  </Link>
                  <Link href="/blog" className="hover:text-ember-500 transition-colors">
                    Trade Blog
                  </Link>
                  <Link href="/contact" className="hover:text-ember-500 transition-colors">
                    Contact
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Icons: Search, Cart, Account */}
          <div className="flex items-center space-x-2 sm:space-x-6 shrink-0">
            
            {/* Search Input Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center max-w-[calc(100vw-80px)]">
                  <input
                    type="text"
                    placeholder="Search SKU, series, product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-ink-900 border border-ink-800 text-parchment-50 text-xs px-2.5 py-1.5 rounded-l-[6px] w-32 xs:w-40 sm:w-64 focus:outline-none focus:border-ember-500 min-w-0"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-ember-500 text-white px-3 py-1.5 rounded-r-[6px] hover:bg-ember-600 shrink-0"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-1.5 text-muted hover:text-white shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button onClick={() => setIsSearchOpen(true)} aria-label="Search" className="p-2 text-parchment-text hover:text-ember-500 transition-colors">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>

            {/* Direct Admin Panel Button in Navbar for Admin Users */}
            {user && isAdmin && (
              <Link
                href="/admin"
                className="hidden lg:flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-ink-950 text-xs font-extrabold px-3 py-1.5 rounded-[6px] transition-all shadow-md uppercase tracking-wider shrink-0"
              >
                <ShieldCheck className="w-4 h-4 text-ink-950" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Desktop Account / Sign In State */}
            {user ? (
              <div ref={userDropdownRef} className="relative hidden lg:block">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 bg-ink-900 hover:bg-ink-800 border border-ink-800 text-xs font-bold px-3 py-1.5 rounded-[6px] transition-all text-parchment-50"
                >
                  <div className="w-5 h-5 rounded-full bg-ember-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 uppercase tracking-tight shadow-sm">
                    {getUserInitials(user.email, user.user_metadata?.full_name)}
                  </div>
                  <span className="max-w-[120px] truncate">{user.user_metadata?.full_name || user.email}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-ink-900 border border-ink-800 rounded-[8px] p-2 shadow-2xl z-50 text-xs space-y-1">
                    <div className="px-3 py-2 border-b border-ink-800">
                      <div className="font-bold text-parchment-50 truncate">{user.user_metadata?.full_name || 'Dealer Account'}</div>
                      <div className="text-[11px] text-muted truncate">{user.email}</div>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-ink-800 text-gold-500 font-bold rounded"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Console</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-ink-800 text-danger font-bold rounded text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal('Sign in with your Google Account to place wholesale quote orders and track dispatch updates.')}
                className="hidden lg:flex items-center gap-2 bg-ember-500 hover:bg-ember-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-[6px] transition-all shadow-md uppercase tracking-wider"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Desktop Only My Orders & Cart Icon */}
            <button
              onClick={openOrders}
              aria-label="My Orders"
              className="hidden lg:flex items-center gap-1.5 p-2 text-parchment-text hover:text-gold-500 transition-colors cursor-pointer text-xs font-bold"
            >
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gold-500" />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('cart');
                setIsCartOpen(true);
              }}
              aria-label="Cart"
              className="hidden lg:flex relative p-2 text-parchment-text hover:text-ember-500 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-ember-500 text-white text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border border-ink-950 animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle (ONLY icon on mobile) */}
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

      {/* Streamlined Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-ink-900 border-b border-ink-800 px-4 pt-3.5 pb-5 space-y-3.5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {/* Quick Cart & My Orders bar for Mobile */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveTab('cart');
                setIsCartOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-ember-500/10 border border-ember-500/30 text-ember-400 py-2 px-3 rounded-md text-xs font-semibold hover:bg-ember-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({itemCount})</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openOrders();
              }}
              className="flex items-center justify-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-500 py-2 px-3 rounded-md text-xs font-semibold hover:bg-gold-500/20"
            >
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </button>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              placeholder="Search SKUs, anime series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-ink-950 border border-ink-800 text-parchment-50 text-xs px-3 py-2 rounded-l-md w-full focus:outline-none focus:border-ember-500"
            />
            <button type="submit" className="bg-ember-500 hover:bg-ember-600 text-white px-3.5 py-2 rounded-r-md transition-colors flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Core Navigation Links */}
          <nav className="flex flex-col space-y-2 text-xs font-semibold uppercase tracking-wider">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 border-b border-ink-800/80 flex items-center justify-between text-parchment-100 hover:text-ember-500"
            >
              <span>Home</span>
            </Link>
            
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 border-b border-ink-800/80 flex items-center justify-between text-parchment-100 hover:text-ember-500"
            >
              <span>Shop Catalog</span>
            </Link>

            {/* Popular Series (Top 4) */}
            <div className="py-1.5 border-b border-ink-800/80 space-y-1.5">
              <div className="text-[11px] text-ember-500 font-bold uppercase tracking-wider">
                Popular Series
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] normal-case font-normal">
                {seriesCategories.slice(0, 4).map(cat => (
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

            {!isAdmin && (
              <>
                <Link
                  href="/become-a-dealer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-1.5 border-b border-ink-800/80 text-parchment-100 hover:text-ember-500"
                >
                  Become a Dealer
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-1.5 border-b border-ink-800/80 text-parchment-100 hover:text-ember-500"
                >
                  Contact Us
                </Link>
              </>
            )}

            {/* Admin Console Shortcut strictly for Admin email */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 mt-1 text-ink-950 bg-gold-500 hover:bg-gold-600 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-sm"
              >
                <span>Admin Portal</span>
                <span>→</span>
              </Link>
            )}
          </nav>

          {/* Mobile User Authentication / Account Section */}
          <div className="pt-2 border-t border-ink-800">
            {user ? (
              <div className="bg-ink-950 p-3 rounded-[8px] border border-ink-800 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ember-500 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase tracking-tight shadow-sm">
                    {getUserInitials(user.email, user.user_metadata?.full_name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-parchment-50 truncate">
                      {user.user_metadata?.full_name || 'Dealer Account'}
                    </div>
                    <div className="text-[11px] text-muted truncate">{user.email}</div>
                  </div>
                  {isAdmin && (
                    <span className="text-[10px] bg-gold-500/20 text-gold-500 border border-gold-500/40 px-2 py-0.5 rounded font-extrabold uppercase">
                      Admin
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-2 px-3 rounded-md font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({user.email ? user.email.split('@')[0] : 'Account'})</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openLoginModal('Sign in with your Google Account to place wholesale quote orders and track dispatch updates.');
                }}
                className="w-full flex items-center justify-center gap-2 bg-ember-500 hover:bg-ember-600 text-white py-2.5 px-4 rounded-md font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
