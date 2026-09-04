import React from 'react';
import { ShieldCheck, Truck, Layers, MessageSquare } from 'lucide-react';

export const TrustBadgeRow: React.FC = () => {
  const items = [
    {
      icon: ShieldCheck,
      title: 'GST Invoice Guaranteed',
      desc: '100% compliant tax invoice with business GSTIN on every order.',
    },
    {
      icon: Truck,
      title: 'Pan-India Express Dispatch',
      desc: 'Packed in 24 hrs, delivered in 2–4 business days via insured freight.',
    },
    {
      icon: Layers,
      title: 'Tiered Bulk Pricing',
      desc: 'Per-unit rates drop automatically as order quantity scales up.',
    },
    {
      icon: MessageSquare,
      title: 'Dealer Support on WhatsApp',
      desc: 'Direct line to your trade account manager for stock reservation.',
    },
  ];

  return (
    <section className="bg-parchment-100 border-b border-parchment-300 py-10">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-parchment-50 text-black flex items-center justify-center shrink-0 border border-parchment-300 shadow-sm">
                  <Icon className="w-6 h-6 text-black" />
                </div>

                <div>
                  <h4 className="font-display text-lg text-ink-950 font-bold leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-ink-text/80 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
