'use client';

import React, { useEffect, useState } from 'react';
import { QuoteOrder } from '@/lib/types';
import { getOrders, updateOrderStatus, deleteOrder, getStoreSettings } from '@/lib/catalog-store';
import { generateOrderPdf } from '@/lib/pdf-generator';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Trash2, Loader2, MailCheck, Download } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<QuoteOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<QuoteOrder | null>(null);
  const [updatingOrderIds, setUpdatingOrderIds] = useState<Record<string, boolean>>({});
  const [downloadingOrderIds, setDownloadingOrderIds] = useState<Record<string, boolean>>({});

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDownloadPdf = async (ord: QuoteOrder) => {
    setDownloadingOrderIds(prev => ({ ...prev, [ord.id]: true }));
    try {
      const settings = await getStoreSettings();
      await generateOrderPdf(ord, { settings, download: true });
    } catch (err) {
      console.error('Failed to generate order PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingOrderIds(prev => ({ ...prev, [ord.id]: false }));
    }
  };

  const handleStatusChange = async (id: string, newStatus: QuoteOrder['status']) => {
    setUpdatingOrderIds(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders(prev => prev.map(o => o.id === id ? data.order : o));
        if (selectedOrder?.id === id) {
          setSelectedOrder(data.order);
        }
      } else {
        const updated = await updateOrderStatus(id, newStatus);
        setOrders(prev => prev.map(o => o.id === id ? updated : o));
        if (selectedOrder?.id === id) {
          setSelectedOrder(updated);
        }
      }
    } catch (err) {
      console.error('Failed to update status via API:', err);
      const updated = await updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      if (selectedOrder?.id === id) {
        setSelectedOrder(updated);
      }
    } finally {
      setUpdatingOrderIds(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteOrder = async (id: string, orderNumber: string) => {
    if (confirm(`Are you sure you want to delete order #${orderNumber}?`)) {
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id && o.orderNumber !== id));
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="font-display text-3xl text-ink-950">Wholesale Quote Orders</h1>
        <p className="text-xs text-muted">Review business order requests, issue formal GST quotes, and manage dispatch status.</p>
      </div>

      {/* MOBILE VIEW: Compact Quote Order Cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="p-6 text-center text-muted bg-parchment-100 rounded-[10px] border border-parchment-300">
            Loading quote orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-muted bg-parchment-100 rounded-[10px] border border-parchment-300">
            No quote order requests found.
          </div>
        ) : (
          orders.map(ord => {
            const isUpdating = updatingOrderIds[ord.id];

            return (
              <div
                key={ord.id}
                className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-3.5 text-xs space-y-3 shadow-sm"
              >
                {/* Top Bar: Ref # & Amount */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono font-bold text-ink-950 text-sm">{ord.orderNumber}</div>
                    <div className="text-[11px] text-muted">{new Date(ord.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-sm font-bold text-ember-600">₹{ord.subtotal.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-muted">{ord.items.length} SKUs</div>
                  </div>
                </div>

                {/* Middle: Business & Contact Info */}
                <div className="pt-2 border-t border-parchment-300/80 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-ink-950">{ord.businessName}</div>
                    <div className="text-[11px] text-muted">{ord.contactPerson} ({ord.phone}) • {ord.city}</div>
                  </div>
                </div>

                {/* Bottom Actions: Status Dropdown / Loader + Inspect + Delete Button */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-parchment-300/80">
                  {isUpdating ? (
                    <div className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded font-bold uppercase bg-ember-100 text-ember-600 border border-ember-300 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating & Emailing...</span>
                    </div>
                  ) : (
                    <select
                      value={ord.status}
                      disabled={isUpdating}
                      onChange={e => handleStatusChange(ord.id, e.target.value as any)}
                      className={`text-[11px] px-2.5 py-1 rounded font-bold uppercase border focus:outline-none cursor-pointer ${
                        ord.status === 'Confirmed' ? 'bg-jade-100 text-jade-600 border-jade-600/30' : 'bg-gold-500/10 text-gold-500 border-gold-500/30'
                      }`}
                    >
                      <option value="New">Pending Request</option>
                      <option value="Confirmed">Approved & Confirmed</option>
                    </select>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownloadPdf(ord)}
                      disabled={downloadingOrderIds[ord.id]}
                      className={`p-1.5 rounded transition-all flex items-center gap-1 ${
                        downloadingOrderIds[ord.id]
                          ? 'bg-ember-100 text-ember-600 border border-ember-300 animate-pulse cursor-wait'
                          : 'text-ember-600 hover:bg-ember-500/10 hover:scale-105'
                      }`}
                      title={downloadingOrderIds[ord.id] ? "Generating Invoice PDF..." : "Download Invoice PDF"}
                    >
                      {downloadingOrderIds[ord.id] ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-ember-600" />
                          <span className="text-[10px] font-bold uppercase">Generating...</span>
                        </>
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(ord)}
                      className="text-xs"
                    >
                      Inspect
                    </Button>
                    <button
                      onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                      className="p-1.5 text-danger hover:bg-danger/10 rounded transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP VIEW: Full Data Table */}
      <div className="hidden md:block bg-parchment-100 border border-parchment-300 rounded-[10px] overflow-hidden shadow-sm">
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
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted">No quote order requests found.</td></tr>
              ) : orders.map(ord => {
                const isUpdating = updatingOrderIds[ord.id];

                return (
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
                      {isUpdating ? (
                        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded font-bold uppercase bg-ember-100 text-ember-600 border border-ember-300 animate-pulse">
                          <Loader2 className="w-4 h-4 animate-spin text-ember-600" />
                          <span>Updating DB & Sending Mail...</span>
                        </div>
                      ) : (
                        <select
                          value={ord.status}
                          disabled={isUpdating}
                          onChange={e => handleStatusChange(ord.id, e.target.value as any)}
                          className={`text-xs px-2.5 py-1.5 rounded font-bold uppercase border focus:outline-none cursor-pointer transition-all ${
                            ord.status === 'Confirmed' ? 'bg-jade-100 text-jade-600 border-jade-600/30' : 'bg-gold-500/10 text-gold-500 border-gold-500/30'
                          }`}
                        >
                          <option value="New">Pending Request</option>
                          <option value="Confirmed">Approved & Confirmed</option>
                        </select>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownloadPdf(ord)}
                          disabled={downloadingOrderIds[ord.id]}
                          className={`p-1.5 rounded transition-all flex items-center gap-1 ${
                            downloadingOrderIds[ord.id]
                              ? 'bg-ember-100 text-ember-600 border border-ember-300 animate-pulse cursor-wait'
                              : 'text-ember-600 hover:bg-ember-500/10 hover:scale-105'
                          }`}
                          title={downloadingOrderIds[ord.id] ? "Generating Invoice PDF..." : "Download Invoice PDF"}
                        >
                          {downloadingOrderIds[ord.id] ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-ember-600" />
                              <span className="text-[10px] font-bold uppercase">Generating...</span>
                            </>
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(ord)}
                          className="text-xs"
                        >
                          Inspect
                        </Button>
                        <button
                          onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                          className="p-1.5 text-danger hover:bg-danger/10 rounded transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Detail */}
      {selectedOrder && (() => {
        const isUpdating = updatingOrderIds[selectedOrder.id];

        return (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <div className="fixed inset-0 bg-ink-950/50" onClick={() => setSelectedOrder(null)} />
            <div className="relative bg-parchment-50 w-full max-w-lg border-l border-ink-800 p-6 flex flex-col justify-between shadow-2xl z-10">
              
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-parchment-300 pb-3">
                  <div>
                    <h3 className="font-display text-xl text-ink-950">Order #{selectedOrder.orderNumber}</h3>
                    <div className="mt-1">
                      {selectedOrder.status === 'Confirmed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-jade-600 bg-jade-100 border border-jade-600/30 px-2 py-0.5 rounded uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Confirmed & Mail Dispatched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-500 bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded uppercase">
                          <Clock className="w-3 h-3" /> Pending Confirmation
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-muted hover:text-ink-950 font-bold text-lg p-1">✕</button>
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

              <div className="pt-4 border-t border-parchment-300 flex flex-col gap-2">
                {selectedOrder.status !== 'Confirmed' && (
                  <Button
                    variant="ember"
                    size="lg"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(selectedOrder.id, 'Confirmed')}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Updating DB & Sending Confirmation Email...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Send Confirmation Email</span>
                      </>
                    )}
                  </Button>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    disabled={downloadingOrderIds[selectedOrder.id]}
                    onClick={() => handleDownloadPdf(selectedOrder)}
                    className="text-xs text-ember-600 border-ember-300 hover:bg-ember-50 gap-1.5"
                  >
                    {downloadingOrderIds[selectedOrder.id] ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-ember-600" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download Invoice PDF</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.orderNumber)}
                    className="text-xs text-danger border-danger/30 hover:bg-danger/10 gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Order</span>
                  </Button>
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setSelectedOrder(null)}>
                    Close Drawer
                  </Button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
