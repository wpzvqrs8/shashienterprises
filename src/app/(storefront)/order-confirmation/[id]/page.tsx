'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QuoteOrder } from '@/lib/types';
import { getOrders } from '@/lib/catalog-store';
import { Button } from '@/components/ui/button';
import { INITIAL_STORE_SETTINGS } from '@/lib/mock-data';
import { CheckCircle2, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<QuoteOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const orders = await getOrders();
      const found = orders.find(o => o.id === id || o.orderNumber === id);
      setOrder(found || null);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-muted">
        Loading order details...
      </div>
    );
  }

  const orderNum = order ? order.orderNumber : `SE-2026-${id.slice(0, 4)}`;

  const whatsappMessage = encodeURIComponent(
    `Hello Shashi Enterprises! I just submitted order request #${orderNum} for business ${order?.businessName || 'Trade Account'}. Please share the formal quote with shipping details.`
  );
  const whatsappUrl = `https://wa.me/${INITIAL_STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;


  return (
    <div className="bg-parchment-50 min-h-screen py-12 border-b border-parchment-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <div className="w-16 h-16 rounded-full bg-jade-100 text-jade-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-jade-600 bg-jade-100 px-3 py-1 rounded-full">
            Order Request Received
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-ink-950">
            Thank You for Your Order Request!
          </h1>
          <p className="text-sm text-muted">
            Order Reference Number: <strong className="text-ember-600 font-mono text-base">{orderNum}</strong>
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 text-left space-y-4 shadow-sm">
          <h3 className="font-display text-lg text-ink-950 border-b border-parchment-300 pb-2">
            What Happens Next?
          </h3>
          <div className="space-y-3 text-xs text-ink-text/90 leading-relaxed">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-ember-500 text-white font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-ink-950">Stock Allocation:</strong> Our warehouse desk locks your requested SKU quantities.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-ember-500 text-white font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-ink-950">Formal Tax Invoice & Freight Quote:</strong> We calculate exact shipping weight/packing and send a detailed GST invoice to your WhatsApp ({order?.phone || 'provided phone'}) within 24 hours.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-ember-500 text-white font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-ink-950">Payment & Pan-India Dispatch:</strong> Upon invoice confirmation, payment is collected via {order?.paymentPreference || 'your selected method'} and packed for express transport.
              </div>
            </div>
          </div>
        </div>

        {/* Immediate Followup Actions */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-jade-600 hover:bg-jade-600/90 text-white font-bold text-sm px-6 py-3.5 rounded-[6px] transition-all gap-2 uppercase tracking-wider shadow-warm"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Follow Up Immediately on WhatsApp</span>
          </a>

          <Link href="/shop">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              <span>Return to Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
