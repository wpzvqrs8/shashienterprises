'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/constants';

export const CategoryStrip: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    // Preload ALL category figure images into browser cache immediately on mount
    CATEGORIES.forEach((cat) => {
      if (cat.image && typeof window !== 'undefined') {
        const img = new window.Image();
        img.src = cat.image;
      }
    });

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % CATEGORIES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  // Compute 7 visible items in queue
  const visibleItems = Array.from({ length: 7 }, (_, i) => {
    const index = (startIndex + i) % CATEGORIES.length;
    return { ...CATEGORIES[index], slot: i };
  });

  // Size and style definitions for 7 symmetrical 3D Action Figure slots
  const slotStyles = [
    { size: 'w-14 h-20 sm:w-16 sm:h-24', opacity: 'opacity-40 blur-[0.5px]', text: 'text-[10px] font-semibold text-white/60' }, // 0 (Outer Left)
    { size: 'w-16 h-24 sm:w-20 sm:h-32', opacity: 'opacity-70', text: 'text-[11px] font-bold text-white/80' },            // 1 (Mid Left)
    { size: 'w-20 h-28 sm:w-28 sm:h-40', opacity: 'opacity-90', text: 'text-xs font-bold text-white/90' },                 // 2 (Inner Left)
    { size: 'w-28 h-36 sm:w-40 sm:h-52', opacity: 'opacity-100 z-30 drop-shadow-[0_15px_20px_rgba(0,0,0,0.9)]', text: 'text-xs sm:text-sm font-black text-ember-400 tracking-wider' }, // 3 (CENTER SPOTLIGHT)
    { size: 'w-20 h-28 sm:w-28 sm:h-40', opacity: 'opacity-90', text: 'text-xs font-bold text-white/90' },                 // 4 (Inner Right)
    { size: 'w-16 h-24 sm:w-20 sm:h-32', opacity: 'opacity-70', text: 'text-[11px] font-bold text-white/80' },            // 5 (Mid Right)
    { size: 'w-14 h-20 sm:w-16 sm:h-24', opacity: 'opacity-40 blur-[0.5px]', text: 'text-[10px] font-semibold text-white/60' }, // 6 (Outer Right)
  ];

  return (
    <section className="bg-ink-950 border-b border-ink-800 py-6 sm:py-8 overflow-hidden relative">
      {/* Hidden preloader container to ensure browser caches all category images upfront */}
      <div className="hidden aria-hidden pointer-events-none" aria-hidden="true">
        {CATEGORIES.map((cat) => (
          <img key={`preload-${cat.id}`} src={cat.image} alt="" decoding="async" />
        ))}
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base sm:text-lg uppercase tracking-wider text-white flex items-center gap-2 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-ember-500 animate-pulse" />
            <span>Explore Taxonomies</span>
          </h3>
          <Link href="/shop" className="text-xs sm:text-sm text-ember-500 font-bold hover:underline">
            View All Categories →
          </Link>
        </div>

        {/* 3D Action Figure Showcase Stage */}
        <div className="flex items-end justify-around sm:justify-between gap-1.5 sm:gap-4 md:gap-6 pt-1 pb-2 px-1 sm:px-2 min-h-[200px] sm:min-h-[250px] w-full max-w-full overflow-hidden">
          {visibleItems.map((category, slotIdx) => {
            const style = slotStyles[slotIdx];
            const isCenter = slotIdx === 3;
            const isMobileVisible = slotIdx >= 2 && slotIdx <= 4;

            return (
              <Link
                key={`${category.id}-${slotIdx}`}
                href={`/shop/${category.slug}`}
                className={`${isMobileVisible ? 'flex' : 'hidden sm:flex'} flex-col items-center shrink-0 group text-center transition-all duration-500 ease-in-out cursor-pointer relative ${style.opacity}`}
              >
                {/* 3D Standing Figure Container */}
                <div className={`relative ${style.size} flex items-end justify-center mb-1.5 transition-transform duration-300 group-hover:-translate-y-1.5`}>
                  {/* Standing 3D Figure Image */}
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 150px, 240px"
                    className="object-contain object-bottom drop-shadow-[0_12px_12px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_16px_20px_rgba(255,255,255,0.25)] transition-all duration-300"
                  />

                  {/* 3D Floor Shadow */}
                  <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-[100%] transition-all duration-300 ${
                    isCenter 
                      ? 'w-4/5 h-2.5 bg-black/90 blur-xs shadow-[0_3px_8px_rgba(255,255,255,0.15)]' 
                      : 'w-2/3 h-1.5 bg-black/80 blur-xs'
                  }`} />
                </div>

                {/* Visible Category Text Label - Unclipped, Perfectly Centered */}
                <span className={`uppercase tracking-wider transition-colors duration-300 text-center ${style.text} max-w-[100px] sm:max-w-[140px] leading-tight block truncate`}>
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};



