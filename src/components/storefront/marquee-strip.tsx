'use client';

import React, { useState, useEffect } from 'react';
import { MARQUEE_TEXT } from '@/lib/constants';
import { X } from 'lucide-react';

export const MarqueeStrip: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 60);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (dismissed || !isAtTop) return null;

  return (
    <div className="bg-ink-950 text-ember-500 text-xs font-bold uppercase tracking-widest py-2 border-b border-ink-800 relative select-none z-50 w-full overflow-hidden">
      <div className="flex w-max items-center">
        {/* Track 1 */}
        <div className="flex shrink-0 items-center animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
          <span className="mx-6">{MARQUEE_TEXT}</span>
          <span className="mx-6">{MARQUEE_TEXT}</span>
          <span className="mx-6">{MARQUEE_TEXT}</span>
          <span className="mx-6">{MARQUEE_TEXT}</span>
        </div>
        {/* Track 2 (Seamless clone) */}
        <div className="flex shrink-0 items-center animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]" aria-hidden="true">
          <span className="mx-6">{MARQUEE_TEXT}</span>
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
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};
