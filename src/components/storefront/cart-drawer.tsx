'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/components/providers/auth-provider';
import { QuoteOrder } from '@/lib/types';
import { getOrders } from '@/lib/catalog-store';
import { Button } from '@/components/ui/button';
import { X, ShoppingBag, Trash2, Plus, Minus, AlertTriangle, ArrowRight, Package, ExternalLink, ShieldCheck, User } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const { user, openLoginModal } = useAuth();
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    isMovMet,
    movRemaining,
    minimumOrderValue,
    isCartOpen,
    setIsCartOpen,
    activeTab,
    setActiveTab
  } = useCart();

  const [userOrders, setUserOrders] = useState<QuoteOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    async function loadUserOrders() {
      if (activeTab === 'orders' && user && user.email) {
        setLoadingOrders(true);
        const allOrders = await getOrders();
        const myOrders = allOrders.filter(o => o.email.toLowerCase() === user.email?.toLowerCase());
        setUserOrders(myOrders);
        setLoadingOrders(false);
      }
    }
    loadUserOrders();
  }, [activeTab, user]);

  if (!isCartOpen) return null;

  const targetMOV = minimumOrderValue || 6000;
  const progressPercent = Math.min(100, Math.round((subtotal / targetMOV) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Flat Scrim Background Overlay (No Blur) */}
      <div
        className="absolute inset-0 bg-ink-950/60 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-3 sm:pl-10">
        <div className="w-[calc(100vw-12px)] sm:w-screen sm:max-w-md bg-parchment-50 border-l border-ink-800 text-ink-text flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 bg-ink-950 text-parchment-text flex items-center justify-between border-b border-ink-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-ember-500" />
              <h3 className="font-display text-lg text-white font-bold">Trade Desk Drawer</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-muted hover:text-white p-1 cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dual Tab Switcher: [ Wholesale Cart ] & [ My Orders ] */}
          <div className="flex border-b border-ink-800 bg-ink-900 px-2 pt-2 gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex-1 py-2.5 rounded-t-[6px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'cart'
                  ? 'bg-parchment-50 text-ink-950 font-extrabold border-t-2 border-ember-500 shadow-sm'
                  : 'text-parchment-text/70 hover:text-white bg-ink-950/40'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-ember-500" />
              <span>Wholesale Cart ({items.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2.5 rounded-t-[6px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-parchment-50 text-ink-950 font-extrabold border-t-2 border-gold-500 shadow-sm'
                  : 'text-parchment-text/70 hover:text-white bg-ink-950/40'
              }`}
            >
              <Package className="w-4 h-4 text-gold-500" />
              <span>My Orders {userOrders.length > 0 && `(${userOrders.length})`}</span>
            </button>
          </div>

          {activeTab === 'cart' ? (
            <>
              {/* Minimum Order Value (MOV) Progress Bar */}
              <div className="p-3 bg-parchment-100 border-b border-parchment-300">
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span>Minimum Order Value (₹{targetMOV.toLocaleString('en-IN')})</span>
                  <span className={isMovMet ? 'text-jade-600 font-bold' : 'text-ember-600 font-bold'}>
                    {isMovMet ? 'MOV Unlocked ✓' : `Need ₹${movRemaining.toLocaleString('en-IN')} more`}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-parchment-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isMovMet ? 'bg-jade-600' : 'bg-ember-500'}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {!isMovMet && (
                  <p className="text-[11px] text-muted mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-ember-600 shrink-0" />
                    <span>Add ₹{movRemaining.toLocaleString('en-IN')} more worth of SKUs to enable checkout.</span>
                  </p>
                )}
              </div>

              {/* Cart Line Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-muted mx-auto stroke-1" />
                    <h4 className="font-display text-lg text-ink-950">Your wholesale cart is empty</h4>
                    <p className="text-xs text-muted max-w-xs mx-auto">
                      Browse our catalog and add minimum order quantities of premium anime collectibles.
                    </p>
                    <div className="mt-4">
                      <Button variant="ember" size="sm" onClick={() => setIsCartOpen(false)}>Start Ordering</Button>
                    </div>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-parchment-100 border border-parchment-300 rounded-[8px] p-3 flex gap-3 relative group"
                    >
                      {/* Item Image */}
                      <div className="w-16 h-16 bg-parchment-50 rounded-[6px] relative overflow-hidden border border-parchment-300 shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-display text-sm text-ink-950 line-clamp-1 pr-4">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-muted hover:text-danger p-0.5 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-muted">
                            Rate: <strong className="text-ember-600 font-bold">₹{item.selectedTierPrice.toLocaleString('en-IN')}</strong> /pc
                          </div>
                        </div>

                        {/* Stepper + Line Total */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-parchment-300/60">
                          <div className="flex items-center border border-parchment-300 rounded bg-parchment-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= item.product.moq}
                              className="px-1.5 py-0.5 text-ink-950 disabled:opacity-30 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-1.5 py-0.5 text-ink-950 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-display text-sm text-ink-950 font-bold">
                            ₹{item.lineTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary & Checkout CTA */}
              {items.length > 0 && (
                <div className="p-4 bg-ink-950 text-parchment-text border-t border-ink-800 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted uppercase tracking-wider font-bold">Subtotal (Excl. Freight)</span>
                    <span className="font-display text-xl text-ember-500 font-bold">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-tight">
                    Packing, insurance & freight will be calculated upon quote submission. GST invoice included.
                  </p>
                  
                  <div className="flex gap-2 pt-1">
                    <Link
                      href="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="w-1/3"
                    >
                      <Button variant="outline" size="md" fullWidth className="text-xs !text-white border-ink-800">
                        View Cart
                      </Button>
                    </Link>
                    <div className="w-2/3">
                      <Button
                        variant="ember"
                        size="md"
                        fullWidth
                        disabled={!isMovMet}
                        onClick={() => {
                          if (!isMovMet) return;
                          setIsCartOpen(false);
                          if (!user) {
                            openLoginModal('Please sign in with your Google Account to place a wholesale quote request.', '/checkout');
                          } else {
                            router.push('/checkout');
                          }
                        }}
                        className="gap-1.5"
                      >
                        <span>Check Out</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* MY ORDERS TAB CONTENT */
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!user ? (
                <div className="text-center py-16 space-y-4 bg-parchment-100 border border-parchment-300 rounded-[10px] p-6 shadow-sm">
                  <Package className="w-12 h-12 text-gold-500 mx-auto stroke-1" />
                  <h4 className="font-display text-xl text-ink-950 font-bold">Sign In to View Orders</h4>
                  <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
                    Log in with your Google Account to track your active quote requests, GST invoices, and Pan-India dispatch updates.
                  </p>
                  <Button
                    variant="ember"
                    size="md"
                    className="gap-2 uppercase font-bold text-xs shadow-md"
                    onClick={() => {
                      setIsCartOpen(false);
                      openLoginModal('Sign in to view your wholesale orders and track dispatch updates.');
                    }}
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In with Google</span>
                  </Button>
                </div>
              ) : loadingOrders ? (
                <div className="text-center py-16 text-muted text-xs animate-pulse">
                  Loading your quote orders...
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-16 space-y-3 bg-parchment-100 border border-parchment-300 rounded-[10px] p-6">
                  <Package className="w-12 h-12 text-muted mx-auto stroke-1" />
                  <h4 className="font-display text-lg text-ink-950">No Wholesale Orders Yet</h4>
                  <p className="text-xs text-muted max-w-xs mx-auto">
                    You haven't placed any quote requests with {user.email} yet.
                  </p>
                  <div className="pt-2">
                    <Button variant="ember" size="sm" onClick={() => setActiveTab('cart')}>
                      View Shopping Cart
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-muted uppercase tracking-wider flex justify-between items-center">
                    <span>Recent Quote Orders</span>
                    <span>{userOrders.length} Records</span>
                  </div>

                  {userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-3.5 space-y-2.5 shadow-sm hover:border-ink-800 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-ink-950">{ord.orderNumber}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              ord.status === 'Confirmed' ? 'bg-jade-100 text-jade-600 border border-jade-600/30' : 'bg-amber-100 text-amber-700 border border-amber-300'
                            }`}>
                              {ord.status === 'Confirmed' ? 'Confirmed' : 'Pending Approval'}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted mt-0.5">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN')} • {ord.items.length} SKUs
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-display text-sm font-bold text-ember-600">
                            ₹{ord.subtotal.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1 border-t border-parchment-300/60">
                        <Link
                          href={`/track/${ord.orderNumber}`}
                          onClick={() => setIsCartOpen(false)}
                          className="flex-1"
                        >
                          <Button variant="ember" size="sm" fullWidth className="text-xs gap-1.5 py-1">
                            <Package className="w-3.5 h-3.5" />
                            <span>Track Package</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
