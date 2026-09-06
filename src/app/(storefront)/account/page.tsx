'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QuoteOrder } from '@/lib/types';
import { getOrders } from '@/lib/catalog-store';
import { Button } from '@/components/ui/button';
import { User, Package, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

export default function BuyerAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('buyer@toyworld.in');
  const [orders, setOrders] = useState<QuoteOrder[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('shashi_buyer_email');
      if (storedEmail) setEmail(storedEmail);
    }
    async function load() {
      const allOrders = await getOrders();
      setOrders(allOrders);
    }
    load();
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shashi_buyer_logged_in');
    }
    router.push('/login');
  };

  return (
    <div className="bg-parchment-50 min-h-screen py-10 border-b border-parchment-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-parchment-100 border border-parchment-300 p-6 rounded-[12px]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-ember-500 text-white font-display text-2xl font-bold flex items-center justify-center border border-ember-600">
              TW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl text-ink-950">Toy World Karol Bagh</h1>
                <span className="text-xs bg-jade-100 text-jade-600 font-bold px-2 py-0.5 rounded border border-jade-600/30">
                  Verified Dealer ✓
                </span>
              </div>
              <p className="text-xs text-muted">Account Email: {email} • GSTIN: 07AAAAA0000A1Z5</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 border-parchment-300">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* Order History */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-ink-950 flex items-center gap-2">
            <Package className="w-5 h-5 text-ember-500" />
            <span>Wholesale Purchase Order History</span>
          </h2>

          <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] overflow-hidden">
            <div className="divide-y divide-parchment-300">
              {orders.map(ord => (
                <div key={ord.id} className="p-4 sm:flex items-center justify-between gap-4 space-y-2 sm:space-y-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-ink-950">{ord.orderNumber}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        ord.status === 'Confirmed' ? 'bg-jade-100 text-jade-600 border border-jade-600/30' : 'bg-amber-100 text-amber-700 border border-amber-300'
                      }`}>
                        {ord.status === 'Confirmed' ? 'Confirmed' : 'Pending Approval'}
                      </span>
                    </div>
                    <div className="text-xs text-muted mt-1">
                      Submitted on {new Date(ord.createdAt).toLocaleDateString('en-IN')} • {ord.items.length} SKUs requested
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted">Estimated Subtotal</div>
                      <div className="font-display text-lg text-ember-600 font-bold">
                        ₹{ord.subtotal.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <Link href={`/order-confirmation/${ord.id}`}>
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <span>Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
