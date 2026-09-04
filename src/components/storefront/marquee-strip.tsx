'use client';

import React, { useState } from 'react';
import { MARQUEE_TEXT } from '@/lib/mock-data';
import { X } from 'lucide-react';

export const MarqueeStrip: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-ink-950 text-ember-500 text-xs font-bold uppercase tracking-widest py-2 border-b border-ink-800 relative select-none z-50">
      <div className="flex w-full overflow-hidden whitespace-nowrap group pr-10">
        <div className="inline-block animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] shrink-0">
          <span className="mx-6">{MARQUEE_TEXT}</span>
          <span className="mx-6">{MARQUEE_TEXT}</span>
          <span className="mx-6">{MARQUEE_TEXT}</span>
        </div>
        <div className="inline-block animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] shrink-0" aria-hidden="true">
          <span className="mx-6">{MARQUEE_TEXT}</span>
          <span className="mx-6">{MARQUEE_TEXT}</span>
          <span className="mx-6">{MARQUEE_TEXT}</span>
        </div>
      </div>

      {/* Dismiss Cross Button */}
      <button
  onClick={() => setDismissed(true)}
  aria-label="Dismiss announcement banner"
  className="absolute right-0 top-0 bottom-0 px-3 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center border-l border-red-700 transition-colors cursor-pointer z-10"
>
  <X className="w-4 h-4" />
</button>


      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
