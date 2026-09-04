'use client';

import React, { useEffect, useState } from 'react';
import { QuoteOrder } from '@/lib/types';
import { getOrders, updateOrderStatus } from '@/lib/catalog-store';
import { Button } from '@/components/ui/button';
import { ShoppingBag, CheckCircle2, Clock, Send, ShieldCheck, ChevronRight } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<QuoteOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<QuoteOrder | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: QuoteOrder['status']) => {
    const updated = await updateOrderStatus(id, newStatus);
    setOrders(prev => prev.map(o => o.id === id ? updated : o));
    if (selectedOrder?.id === id) {
      setSelectedOrder(updated);
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="font-display text-3xl text-ink-950">Wholesale Quote Orders</h1>
        <p className="text-xs text-muted">Review business order requests, issue formal GST quotes, and manage dispatch status.</p>
      </div>

      <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-parchment-300/60 border-b border-parchment-300 text-ink-950 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order Ref #</th>
                <th className="py-3 px-4">Business & Contact</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-right">Items / Total</th>
                <th className="py-3 px-4">Status Pipeline</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-300">
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted">Loading orders...</td></tr>
              ) : orders.map(ord => (
                <tr key={ord.id} className="hover:bg-parchment-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-ink-950">
                    {ord.orderNumber}
                    <div className="text-[10px] text-muted font-sans">{new Date(ord.createdAt).toLocaleDateString('en-IN')}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-ink-950">{ord.businessName}</div>
                    <div className="text-[11px] text-muted">{ord.contactPerson} ({ord.phone})</div>
                  </td>

                  <td className="py-3.5 px-4 text-muted font-medium">{ord.city}</td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="font-display text-sm font-bold text-ember-600">₹{ord.subtotal.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-muted">{ord.items.length} SKUs</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={ord.status}
                      onChange={e => handleStatusChange(ord.id, e.target.value as any)}
                      className={`text-xs px-2.5 py-1 rounded font-bold uppercase border focus:outline-none ${
                        ord.status === 'Confirmed' ? 'bg-jade-100 text-jade-600 border-jade-600/30' :
                        ord.status === 'Dispatched' ? 'bg-ember-100 text-ember-600 border-ember-500/30' :
                        'bg-parchment-50 text-ink-950 border-parchment-300'
                      }`}
                    >
                      <option value="New">New Request</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(ord)}
                      className="text-xs"
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Detail */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div className="fixed inset-0 bg-ink-950/50" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-parchment-50 w-full max-w-lg border-l border-ink-800 p-6 flex flex-col justify-between shadow-2xl z-10">
            
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-parchment-300 pb-3">
                <h3 className="font-display text-xl text-ink-950">Order #{selectedOrder.orderNumber}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-muted hover:text-ink-950">✕</button>
              </div>

              <div className="bg-parchment-100 p-4 rounded border border-parchment-300 text-xs space-y-1">
                <div><strong className="text-ink-950">Business:</strong> {selectedOrder.businessName}</div>
                <div><strong className="text-ink-950">Contact:</strong> {selectedOrder.contactPerson} ({selectedOrder.phone})</div>
                <div><strong className="text-ink-950">Email:</strong> {selectedOrder.email}</div>
                {selectedOrder.gstin && <div><strong className="text-ink-950">GSTIN:</strong> {selectedOrder.gstin}</div>}
                <div><strong className="text-ink-950">Address:</strong> {selectedOrder.address}, {selectedOrder.city} - {selectedOrder.pincode}</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-sm text-ink-950 uppercase border-b border-parchment-300 pb-1">Requested Line Items</h4>
                <div className="divide-y divide-parchment-300 max-h-56 overflow-y-auto">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between text-xs">
                      <div>
                        <div className="font-bold text-ink-950">{item.product.name}</div>
                        <div className="text-muted">{item.quantity} pcs @ ₹{item.selectedTierPrice}/pc</div>
                      </div>
                      <div className="font-bold text-ember-600">₹{item.lineTotal.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-ink-950 text-parchment-text p-4 rounded text-xs flex justify-between items-center font-bold">
                <span>Subtotal:</span>
                <span className="text-ember-500 font-display text-xl">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-parchment-300">
              <Button variant="ember" size="md" fullWidth onClick={() => setSelectedOrder(null)}>
                Close Drawer
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
