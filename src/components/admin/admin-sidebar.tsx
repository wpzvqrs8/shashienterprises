'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Settings, ArrowUpRight, ChevronLeft, GripVertical } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // Handle desktop drag resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(180, Math.min(420, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Catalog Manager', href: '/admin/catalog', icon: Package },
    { label: 'Quote Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* MOBILE-ONLY: Slim Collapsed 4-Icon Strip (Fixed to left of screen) */}
      <div
        onClick={() => setIsMobileExpanded(true)}
        className="md:hidden fixed top-0 left-0 bottom-0 w-14 z-30 bg-ink-950 border-r border-ink-800 flex flex-col items-center justify-between py-5 shadow-lg cursor-pointer select-none"
        title="Tap to expand Admin Menu"
      >
        <div className="space-y-6 w-full flex flex-col items-center">
          <div className="relative w-8 h-8 rounded bg-ember-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
            SE
          </div>

          <div className="space-y-4 w-full flex flex-col items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <div
                  key={item.href}
                  className={`p-2.5 rounded-[6px] transition-colors ${
                    isActive ? 'bg-ember-500 text-white shadow-warm' : 'text-white/70 hover:text-white hover:bg-ink-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-[10px] text-ember-500 font-bold tracking-widest uppercase rotate-180 writing-mode-vertical">
          MENU
        </div>
      </div>

      {/* MOBILE-ONLY: Retractable Backdrop */}
      {isMobileExpanded && (
        <div
          onClick={() => setIsMobileExpanded(false)}
          className="md:hidden fixed inset-0 bg-ink-950/80 z-40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* MOBILE-ONLY: Expanded Retractable Full Menu Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 w-72 z-50 bg-ink-950 text-white border-r border-ink-800 flex flex-col justify-between transition-transform duration-300 shadow-2xl ${
          isMobileExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header with Retract Closing Arrow */}
          <div className="p-4 border-b border-ink-800 flex items-center justify-between">
            <Link href="/" className="relative h-9 w-40 block" onClick={() => setIsMobileExpanded(false)}>
              <Image
                src="/logo_black_bg.png"
                alt="Shashi Enterprises Admin"
                fill
                className="object-contain object-left"
              />
            </Link>

            {/* Retract Closing Arrow Button */}
            <button
              onClick={() => setIsMobileExpanded(false)}
              className="p-1.5 rounded-full bg-ink-900 border border-ink-800 text-ember-500 hover:text-white transition-colors"
              aria-label="Close admin menu"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-2 text-xs font-bold uppercase tracking-wider">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileExpanded(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[6px] transition-colors ${
                    isActive
                      ? 'bg-ember-500 text-white shadow-warm'
                      : 'text-white/80 hover:bg-ink-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-white" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Link */}
        <div className="p-4 border-t border-ink-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            onClick={() => setIsMobileExpanded(false)}
            className="flex items-center justify-between px-3 py-2.5 bg-ink-900 hover:bg-ink-800 rounded-[6px] text-xs text-white/90 font-semibold"
          >
            <span>View Public Storefront</span>
            <ArrowUpRight className="w-4 h-4 text-ember-500" />
          </Link>
        </div>
      </aside>

      {/* DESKTOP-ONLY: Drag-resizable Sidebar */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="hidden md:flex sticky top-0 left-0 bottom-0 z-30 bg-ink-950 text-white border-r border-ink-800 flex-col justify-between shrink-0 min-h-screen"
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-ink-800 flex items-center justify-between">
            <Link href="/" className="relative h-10 w-44 block">
              <Image
                src="/logo_black_bg.png"
                alt="Shashi Enterprises Admin"
                fill
                className="object-contain object-left"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-bold uppercase tracking-wider">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[6px] transition-colors ${
                    isActive
                      ? 'bg-ember-500 text-white shadow-warm'
                      : 'text-white/80 hover:bg-ink-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-white" />
                  <span className="text-white">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Return Link */}
        <div className="p-4 border-t border-ink-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 bg-ink-900 hover:bg-ink-800 rounded-[6px] text-xs text-white/90 hover:text-white transition-colors"
          >
            <span>View Public Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-ember-500" />
          </Link>
        </div>

        {/* Desktop Width Drag Resize Handle */}
        <div
          onMouseDown={() => setIsResizing(true)}
          className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-ember-500/50 group items-center justify-center transition-colors flex"
          title="Drag to resize sidebar width"
        >
          <GripVertical className="w-3 h-3 text-muted group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </aside>
    </>
  );
};
