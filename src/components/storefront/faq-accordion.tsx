'use client';

import React, { useState } from 'react';
import { FAQ_ITEMS } from '@/lib/constants';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-parchment-100 py-16 border-b border-parchment-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-ember-600 font-bold text-xs uppercase tracking-widest bg-ember-100 px-3 py-1 rounded-full mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Wholesale FAQ</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-ink-950">
            Frequently Asked B2B Questions
          </h2>
          <p className="text-sm text-muted mt-1">
            Everything you need to know about MOQs, GST invoicing, lead times, and dealer accounts.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-parchment-50 border border-parchment-300 rounded-[8px] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 text-left flex justify-between items-center font-display text-lg text-ink-950 hover:text-ember-600 focus:outline-none cursor-pointer"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180 text-ember-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-sm text-ink-text/80 border-t border-parchment-300/60 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
