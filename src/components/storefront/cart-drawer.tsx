'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { X, ShoppingBag, Trash2, Plus, Minus, AlertTriangle, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    isMovMet,
    movRemaining,
    minimumOrderValue,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / minimumOrderValue) * 100));

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
              <h3 className="font-display text-lg tracking-wider text-parchment-50">
                Wholesale Order Draft
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-muted hover:text-white p-1"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Minimum Order Value (MOV) Progress Bar */}
          <div className="p-3 bg-parchment-100 border-b border-parchment-300">
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span>Wholesale MOV Progress (₹15,000 Min)</span>
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
                <span>Add ₹{movRemaining.toLocaleString('en-IN')} worth of SKUs to enable checkout.</span>
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
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4"
                >
                  <Button variant="ember" size="sm">Start Ordering</Button>
                </button>
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
                      className="object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-display text-sm text-ink-950 line-clamp-1 pr-4">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted hover:text-danger p-0.5"
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
                          className="px-1.5 py-0.5 text-ink-950 disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-1.5 py-0.5 text-ink-950"
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
                <Link
                  href={isMovMet ? "/checkout" : "#"}
                  onClick={(e) => {
                    if (!isMovMet) {
                      e.preventDefault();
                    } else {
                      setIsCartOpen(false);
                    }
                  }}
                  className="w-2/3"
                >
                  <Button
                    variant="ember"
                    size="md"
                    fullWidth
                    disabled={!isMovMet}
                    className="gap-1.5"
                  >
                    <span>Request Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
