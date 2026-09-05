'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { QuoteOrder } from '@/lib/types';
import { getOrders } from '@/lib/catalog-store';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Search,
  ArrowRight,
  AlertTriangle,
  LogOut
} from 'lucide-react';

interface TrackPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default function OrderTrackingPage({ params }: TrackPageProps) {
  const resolvedParams = use(params);
  const orderNumber = resolvedParams.orderNumber;

  const { user, isAdmin, loading: authLoading, openLoginModal, signOut } = useAuth();

  const [order, setOrder] = useState<QuoteOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // Search input state
  const [searchCode, setSearchCode] = useState(orderNumber);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      const orders = await getOrders();
      const match = orders.find(
        o => o.orderNumber.toLowerCase() === orderNumber.toLowerCase() || o.id === orderNumber
      );
      setOrder(match || null);
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderNumber]);

  // Check if current user is authorized to view this order
  const isAuthorized =
    isAdmin || (user && order && user.email?.toLowerCase() === order.email.toLowerCase());

  const trackingSteps = [
    { key: 'New', label: 'Order Received', desc: 'Quote request registered in system' },
    { key: 'Quoted', label: 'Quote Reviewed', desc: 'Wholesale pricing & stock verified' },
    { key: 'Confirmed', label: 'Confirmed & Invoiced', desc: 'GST invoice generated' },
    { key: 'Dispatched', label: 'Freight Dispatched', desc: 'Insured transit in progress' },
    { key: 'Delivered', label: 'Delivered', desc: 'Successfully delivered to warehouse' },
  ];

  const currentStepIdx = order ? trackingSteps.findIndex(s => s.key === order.status) : 0;

  return (
    <div className="min-h-screen bg-parchment-50 py-10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-300 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-ember-500 font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Order Verification Protocol</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink-950">
              Track Order #{orderNumber}
            </h1>
          </div>

          {/* Quick Search */}
          <form
            onSubmit={e => {
              e.preventDefault();
              if (searchCode.trim()) {
                window.location.href = `/track/${encodeURIComponent(searchCode.trim())}`;
              }
            }}
            className="flex items-center"
          >
            <input
              type="text"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              placeholder="Enter Order # (e.g. SE-Q-1002)"
              className="bg-parchment-100 border border-parchment-300 text-xs px-3 py-2 rounded-l-md text-ink-950 focus:outline-none focus:border-ember-500 w-48 font-mono"
            />
            <button type="submit" className="bg-ember-500 hover:bg-ember-600 text-white px-3 py-2 rounded-r-md text-xs font-bold transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {loading || authLoading ? (
          <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-12 text-center text-muted animate-pulse">
            Loading order details for #{orderNumber}...
          </div>
        ) : !order ? (
          <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-10 text-center space-y-4 shadow-sm">
            <AlertTriangle className="w-12 h-12 text-gold-500 mx-auto" />
            <h2 className="font-display text-2xl text-ink-950">Order Record Not Found</h2>
            <p className="text-xs text-muted max-w-md mx-auto">
              We couldn't locate an order record matching <strong>#{orderNumber}</strong>. Please check your order confirmation code or contact dealer support.
            </p>
            <Link href="/shop">
              <Button variant="ember" size="md" className="gap-2">
                <span>Browse Storefront Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : !user ? (
          /* Google Authentication Required Barrier */
          <div className="bg-parchment-100 border border-ember-500/40 rounded-[10px] p-8 sm:p-10 space-y-6 shadow-warm text-center">
            <div className="w-14 h-14 rounded-full bg-ember-500/10 text-ember-500 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="font-display text-2xl text-ink-950">Google Sign-In Required</h2>
              <p className="text-xs text-muted leading-relaxed">
                To protect business privacy and GST tax records, please sign in with the Google account associated with order <strong>#{order.orderNumber}</strong>.
              </p>
            </div>

            {/* Google Sign-In Button */}
            <div className="pt-2">
              <button
                onClick={() => openLoginModal()}
                className="bg-ink-950 hover:bg-ink-900 text-parchment-text font-bold text-xs sm:text-sm px-6 py-3 rounded-md inline-flex items-center gap-3 shadow-md transition-all border border-ink-800"
              >
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-0.5">
                  <span className="font-extrabold text-blue-600 text-xs">G</span>
                </div>
                <span>Sign In with Google</span>
              </button>
            </div>

            <div className="text-[11px] text-muted pt-2 border-t border-parchment-300/80">
              Only authorized purchaser or Shashi Enterprises Admin can view this private record.
            </div>
          </div>
        ) : !isAuthorized ? (
          /* Access Restricted Mismatched Account Box */
          <div className="bg-red-50 border border-red-300 rounded-[10px] p-8 text-center space-y-4 text-red-900 shadow-sm">
            <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
            <h2 className="font-display text-xl text-red-950 font-bold">Access Restricted</h2>
            <p className="text-xs text-red-800 max-w-md mx-auto">
              You are currently signed in as <strong>{user.email}</strong>. Order #{order.orderNumber} belongs to another dealer account.
            </p>
            <Button variant="dark" size="sm" onClick={signOut} className="text-xs gap-2">
              <LogOut className="w-4 h-4" />
              <span>Sign Out & Switch Account</span>
            </Button>
          </div>
        ) : (
          /* Authorized View: Order Tracking Dashboard */
          <div className="space-y-6 animate-fade-in">
            
            {/* Logged In Identity Banner */}
            <div className="bg-jade-100 border border-jade-600/30 text-jade-600 p-3 rounded-[8px] flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Identity Verified: {user.email} {isAdmin ? '(Admin Access)' : '(Customer Owner)'}</span>
              </div>
              <button onClick={signOut} className="text-xs text-muted hover:text-ink-950 underline font-normal">
                Sign Out
              </button>
            </div>

            {/* Order Brief Summary Card */}
            <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-parchment-300 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-muted">Order Reference:</span>
                  <div className="font-mono text-xl font-extrabold text-ink-950">{order.orderNumber}</div>
                  <div className="text-xs text-muted">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold uppercase text-muted">Total Amount:</span>
                  <div className="font-display text-2xl font-bold text-ember-600">₹{order.subtotal.toLocaleString('en-IN')}</div>
                  <Badge variant={order.status === 'Confirmed' ? 'stock' : 'draft'} className="mt-1">
                    Status: {order.status}
                  </Badge>
                </div>
              </div>

              {/* Business Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted block font-bold uppercase text-[10px]">Purchasing Business:</span>
                  <div className="font-bold text-ink-950">{order.businessName}</div>
                  <div className="text-muted">{order.contactPerson} ({order.phone})</div>
                  <div className="text-muted">{order.email}</div>
                  {order.gstin && <div className="font-mono font-bold text-gold-500 mt-1">GSTIN: {order.gstin}</div>}
                </div>

                <div>
                  <span className="text-muted block font-bold uppercase text-[10px]">Dispatch Shipping Address:</span>
                  <div className="font-medium text-ink-950">{order.address}</div>
                  <div className="text-muted">{order.city} - {order.pincode}</div>
                </div>
              </div>
            </div>

            {/* Tracking Progress Pipeline */}
            <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-6 space-y-6 shadow-sm">
              <h3 className="font-display text-lg text-ink-950 border-b border-parchment-300 pb-2">
                Order Status Pipeline
              </h3>

              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2 pt-2">
                {trackingSteps.map((step, idx) => {
                  const isPassed = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 relative z-10 text-left md:text-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                          isCurrent
                            ? 'bg-ember-500 text-white ring-4 ring-ember-500/20 shadow-warm scale-110'
                            : isPassed
                            ? 'bg-jade-600 text-white'
                            : 'bg-parchment-300 text-muted'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div>
                        <div className={`text-xs font-bold uppercase ${isPassed ? 'text-ink-950' : 'text-muted'}`}>
                          {step.label}
                        </div>
                        <div className="text-[11px] text-muted max-w-[140px] hidden md:block">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Line Items List */}
            <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-6 space-y-4 shadow-sm">
              <h3 className="font-display text-lg text-ink-950 border-b border-parchment-300 pb-2">
                Requested Itemization ({order.items.length} SKUs)
              </h3>

              <div className="divide-y divide-parchment-300">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-parchment-50 rounded border border-parchment-300 relative overflow-hidden shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-ink-950 text-sm">{item.product.name}</div>
                        <div className="text-[11px] font-mono text-muted">
                          SKU: {item.product.sku} • {item.quantity} pcs @ ₹{item.selectedTierPrice}/pc
                        </div>
                      </div>
                    </div>

                    <div className="font-display font-bold text-ember-600 text-sm text-right">
                      ₹{item.lineTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total Footer */}
              <div className="bg-ink-950 text-parchment-text p-4 rounded-[8px] flex justify-between items-center font-bold text-xs mt-4">
                <span>Total Wholesale Order Amount:</span>
                <span className="font-display text-xl text-ember-500">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
