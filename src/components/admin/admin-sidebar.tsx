'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Settings, ArrowUpRight, Menu, X, GripVertical } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
      {/* Mobile Small Floating Menu Icon */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle Admin Sidebar"
        className="md:hidden fixed bottom-6 left-6 z-50 bg-ink-950 text-gold-500 p-3.5 rounded-full border-2 border-gold-500/40 shadow-2xl hover:scale-110 active:scale-95 transition-all"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-ink-950/80 z-40 backdrop-blur-sm"
        />
      )}

      {/* Main Admin Sidebar */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 bg-ink-950 text-white border-r border-ink-800 flex flex-col justify-between shrink-0 min-h-screen transition-transform md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
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
                  onClick={() => setIsMobileOpen(false)}
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
          className="hidden md:flex absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-ember-500/50 group items-center justify-center transition-colors"
          title="Drag to resize sidebar width"
        >
          <GripVertical className="w-3 h-3 text-muted group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </aside>
    </>
  );
};
