'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, QuoteOrder } from '@/lib/types';
import { getProducts, getOrders } from '@/lib/catalog-store';
import { Package, ShoppingBag, AlertTriangle, DollarSign, Plus, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<QuoteOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [prods, ords] = await Promise.all([getProducts(), getOrders()]);
      setProducts(prods);
      setOrders(ords);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stockQty < 50 || p.status === 'out-of-stock').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'New').length;
  const totalCatalogValue = products.reduce((sum, p) => sum + (p.wholesalePrice * p.stockQty), 0);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      
      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink-950 font-bold">Administrative Overview</h1>
          <p className="text-xs text-muted">Real-time analytics for inventory, wholesale orders, and catalog value.</p>
        </div>
        <Link href="/admin/catalog/new">
          <Button variant="ember" size="sm" className="w-full sm:w-auto gap-2 text-xs">
            <Plus className="w-4 h-4" />
            <span>Add New Wholesale SKU</span>
          </Button>
        </Link>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-muted text-xs font-bold uppercase">
            <span>Total Wholesale SKUs</span>
            <Package className="w-4 h-4 text-ember-500" />
          </div>
          <div className="font-display text-3xl text-ink-950 font-bold">{totalProducts}</div>
          <div className="text-[11px] text-jade-600 font-semibold">{products.filter(p => p.status === 'active').length} Active Listings</div>
        </div>

        <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-muted text-xs font-bold uppercase">
            <span>Low Stock / Out</span>
            <AlertTriangle className="w-4 h-4 text-danger" />
          </div>
          <div className="font-display text-3xl text-danger font-bold">{lowStockCount}</div>
          <div className="text-[11px] text-muted">Stock under 50 units or out</div>
        </div>

        <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-muted text-xs font-bold uppercase">
            <span>Pending Quote Orders</span>
            <ShoppingBag className="w-4 h-4 text-gold-500" />
          </div>
          <div className="font-display text-3xl text-ink-950 font-bold">{pendingOrdersCount}</div>
          <div className="text-[11px] text-gold-500 font-semibold">Requires invoice review</div>
        </div>

        <div className="bg-parchment-100 border border-parchment-300 p-5 rounded-[10px] space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-muted text-xs font-bold uppercase">
            <span>Est. Stock Inventory Value</span>
            <DollarSign className="w-4 h-4 text-jade-600" />
          </div>
          <div className="font-display text-2xl text-ink-950 font-bold">
            ₹{totalCatalogValue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-muted">At base wholesale rates</div>
        </div>

      </div>

      {/* Grid: Recent Orders & Quick Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Quote Orders */}
        <div className="lg:col-span-7 bg-parchment-100 border border-parchment-300 rounded-[10px] p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-parchment-300 pb-3">
            <h3 className="font-display text-lg text-ink-950 font-bold">Recent Quote Requests</h3>
            <Link href="/admin/orders" className="text-xs text-ember-600 font-bold hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="divide-y divide-parchment-300">
            {orders.slice(0, 5).map(ord => (
              <div key={ord.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-ink-950">{ord.businessName}</div>
                  <div className="text-muted">{ord.orderNumber} • {ord.city}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-ember-600">₹{ord.subtotal.toLocaleString('en-IN')}</div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    ord.status === 'Confirmed' ? 'bg-jade-100 text-jade-600' : 'bg-ember-100 text-ember-600'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catalog Low Stock Watchlist */}
        <div className="lg:col-span-5 bg-parchment-100 border border-parchment-300 rounded-[10px] p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-parchment-300 pb-3">
            <h3 className="font-display text-lg text-ink-950 font-bold">Low Stock Watchlist</h3>
            <Link href="/admin/catalog" className="text-xs text-ember-600 font-bold hover:underline">
              Manage Catalog →
            </Link>
          </div>

          <div className="divide-y divide-parchment-300">
            {products.filter(p => p.stockQty < 100).slice(0, 5).map(p => (
              <div key={p.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-ink-950">{p.name}</div>
                  <div className="text-muted">SKU: {p.sku}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-black">
                    {p.stockQty} pcs left
                  </div>
                  <Link href={`/admin/catalog/${p.id}/edit`} className="text-[11px] text-ember-600 hover:underline">
                    Edit Stock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
