'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/constants';

export const CategoryStrip: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
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
    { size: 'w-16 h-24 sm:w-20 sm:h-28', scale: 'scale-75 opacity-40 blur-[0.5px]', text: 'text-[10px] font-semibold text-white/50' }, // 0 (Outer Left)
    { size: 'w-20 h-28 sm:w-24 sm:h-36', scale: 'scale-90 opacity-75', text: 'text-[11px] font-bold text-white/80' },            // 1 (Mid Left)
    { size: 'w-24 h-36 sm:w-32 sm:h-44', scale: 'scale-100 opacity-95', text: 'text-xs font-bold text-white' },                    // 2 (Inner Left)
    { size: 'w-32 h-44 sm:w-44 sm:h-60', scale: 'scale-125 opacity-100 z-30 drop-shadow-[0_20px_20px_rgba(0,0,0,0.9)]', text: 'text-xs sm:text-sm font-extrabold text-white bg-ink-950/90 px-3.5 py-1 rounded-full border border-white/30 shadow-xl tracking-wider' }, // 3 (CENTER SPOTLIGHT)
    { size: 'w-24 h-36 sm:w-32 sm:h-44', scale: 'scale-100 opacity-95', text: 'text-xs font-bold text-white' },                    // 4 (Inner Right)
    { size: 'w-20 h-28 sm:w-24 sm:h-36', scale: 'scale-90 opacity-75', text: 'text-[11px] font-bold text-white/80' },            // 5 (Mid Right)
    { size: 'w-16 h-24 sm:w-20 sm:h-28', scale: 'scale-75 opacity-40 blur-[0.5px]', text: 'text-[10px] font-semibold text-white/50' }, // 6 (Outer Right)
  ];

  return (
    <section className="bg-ink-950 border-b border-ink-800 py-12 sm:py-16 overflow-hidden relative">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-display text-lg sm:text-xl uppercase tracking-wider text-white flex items-center gap-2.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span>Explore Taxonomies</span>
          </h3>
          <Link href="/shop" className="text-xs sm:text-sm text-white/90 font-bold hover:text-white hover:underline transition-colors">
            View All Categories →
          </Link>
        </div>

        {/* 3D Action Figure Showcase Stage */}
        <div className="flex items-end justify-around sm:justify-between gap-2 sm:gap-4 md:gap-6 pt-4 pb-8 px-1 sm:px-2 min-h-[240px] sm:min-h-[300px] w-full max-w-full overflow-hidden">
          {visibleItems.map((category, slotIdx) => {
            const style = slotStyles[slotIdx];
            const isCenter = slotIdx === 3;
            const isMobileVisible = slotIdx >= 2 && slotIdx <= 4;

            return (
              <Link
                key={`${category.id}-${slotIdx}`}
                href={`/shop/${category.slug}`}
                className={`${isMobileVisible ? 'flex' : 'hidden sm:flex'} flex-col items-center shrink-0 group text-center transition-all duration-700 ease-in-out cursor-pointer relative ${style.scale}`}
              >
                {/* 3D Standing Figure Container - Pure Cutout Figure, No Circle Border */}
                <div className={`relative ${style.size} flex items-end justify-center mb-3 transition-transform duration-500 group-hover:-translate-y-2`}>
                  {/* Standing 3D Figure Image with Transparent Background */}
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 150px, 240px"
                    className="object-contain object-bottom drop-shadow-[0_15px_15px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_20px_25px_rgba(255,255,255,0.25)] transition-all duration-500"
                  />

                  {/* 3D Floor Shadow */}
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-[100%] transition-all duration-500 ${
                    isCenter 
                      ? 'w-4/5 h-3 bg-black/90 blur-sm shadow-[0_4px_12px_rgba(255,255,255,0.15)]' 
                      : 'w-2/3 h-2 bg-black/80 blur-xs'
                  }`} />
                </div>

                {/* Small White Text Category Label */}
                <span className={`uppercase tracking-wider transition-colors duration-300 line-clamp-1 ${style.text}`}>
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


