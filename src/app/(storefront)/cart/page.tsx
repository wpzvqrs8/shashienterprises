'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, AlertTriangle, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    isMovMet,
    movRemaining,
    minimumOrderValue
  } = useCart();

  const targetMOV = minimumOrderValue || 6000;
  const progressPercent = Math.min(100, Math.round((subtotal / targetMOV) * 100));

  return (
    <div className="bg-parchment-50 min-h-screen py-10 border-b border-parchment-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-1">
            Home / Wholesale Shopping Cart
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-ink-950">
            Wholesale Order Review
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-16 text-center space-y-4 max-w-lg mx-auto my-8">
            <ShoppingBag className="w-16 h-16 text-muted mx-auto stroke-1" />
            <h2 className="font-display text-2xl text-ink-950">Your Wholesale Cart is Empty</h2>
            <p className="text-xs text-muted">
              Add products from our wholesale catalog to build your business purchase order.
            </p>
            <Link href="/shop" className="inline-block pt-2">
              <Button variant="ember" size="md">Browse Wholesale Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Line Items Table */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* MOV Progress Bar */}
              <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-4">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span>Minimum Order Value (MOV) Threshold (₹{targetMOV.toLocaleString('en-IN')})</span>
                  <span className={isMovMet ? 'text-jade-600 font-bold' : 'text-ember-600 font-bold'}>
                    {isMovMet ? 'MOV Met (₹6,000 Unlocked) ✓' : `Need ₹${movRemaining.toLocaleString('en-IN')} more to unlock checkout`}
                  </span>
                </div>
                <div className="w-full h-3 bg-parchment-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isMovMet ? 'bg-jade-600' : 'bg-ember-500'}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 bg-parchment-300/60 p-3 text-xs font-bold uppercase text-ink-950">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-2 text-right">Wholesale Rate</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Line Subtotal</div>
                </div>

                <div className="divide-y divide-parchment-300">
                  {items.map((item) => (
                    <div key={item.product.id} className="p-4 sm:grid sm:grid-cols-12 items-center gap-4 flex flex-col sm:flex-row">
                      
                      {/* Product Thumbnail & Title */}
                      <div className="sm:col-span-6 flex items-center gap-3 w-full">
                        <div className="w-16 h-16 bg-parchment-50 rounded-[6px] relative overflow-hidden border border-parchment-300 shrink-0">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <Link href={`/product/${item.product.slug}`} className="font-display text-base text-ink-950 hover:text-ember-600 line-clamp-1">
                            {item.product.name}
                          </Link>
                          <div className="text-xs text-muted">
                            SKU: {item.product.sku} • MOQ: {item.product.moq} pcs
                          </div>
                        </div>
                      </div>

                      {/* Rate */}
                      <div className="sm:col-span-2 sm:text-right w-full sm:w-auto flex sm:block justify-between text-xs">
                        <span className="sm:hidden text-muted">Rate:</span>
                        <span className="font-bold text-ember-600">₹{item.selectedTierPrice.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Stepper */}
                      <div className="sm:col-span-2 flex justify-center w-full sm:w-auto">
                        <div className="flex items-center border border-parchment-300 rounded bg-parchment-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= item.product.moq}
                            className="px-2 py-1 text-ink-950 disabled:opacity-30"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-mono font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 text-ink-950"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Line Total & Delete */}
                      <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <span className="font-display text-base text-ink-950 font-bold">
                          ₹{item.lineTotal.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted hover:text-danger p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-ink-950 text-parchment-text p-6 rounded-[10px] border border-ink-800 space-y-4 sticky top-24 shadow-warm">
                <h3 className="font-display text-xl text-parchment-50 border-b border-ink-800 pb-3">
                  Wholesale Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Cart Subtotal</span>
                    <span className="font-bold text-parchment-50">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Estimated Freight</span>
                    <span className="text-gold-500 font-bold">Calculated Post Quote</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">GST Tax Invoice</span>
                    <span className="text-jade-600 font-bold">Included ✓</span>
                  </div>
                </div>

                <div className="border-t border-ink-800 pt-3 flex justify-between items-center">
                  <span className="font-display text-base text-parchment-50">Estimated Total</span>
                  <span className="font-display text-2xl text-ember-500 font-bold">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {!isMovMet && (
                  <div className="bg-ember-500/10 border border-ember-500/30 text-ember-500 p-3 rounded text-xs leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Minimum Order Value is ₹{targetMOV.toLocaleString('en-IN')}. Add ₹{movRemaining.toLocaleString('en-IN')} more worth of products to unlock checkout.</span>
                  </div>
                )}

                <Link
                  href={isMovMet ? "/checkout" : "#"}
                  onClick={(e) => { if (!isMovMet) e.preventDefault(); }}
                  className="block"
                >
                  <Button
                    variant="ember"
                    size="lg"
                    fullWidth
                    disabled={!isMovMet}
                    className="gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <div className="text-[11px] text-muted flex items-center gap-1.5 pt-2">
                  <ShieldCheck className="w-4 h-4 text-jade-600" />
                  <span>No payment required right now. Submit request to receive a formal invoice.</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
