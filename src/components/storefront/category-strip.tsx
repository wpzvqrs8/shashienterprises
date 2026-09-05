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

  // Size and style definitions for 7 symmetrical slots (outer edge -> middle center)
  const slotStyles = [
    { size: 'w-14 h-14 sm:w-16 sm:h-16', scale: 'scale-90 opacity-60', text: 'text-xs font-medium' },       // 0 (Outer Left)
    { size: 'w-16 h-16 sm:w-20 sm:h-20', scale: 'scale-100 opacity-80', text: 'text-xs font-semibold' },    // 1 (Mid Left)
    { size: 'w-20 h-20 sm:w-24 sm:h-24', scale: 'scale-110 opacity-95', text: 'text-sm font-bold' },        // 2 (Inner Left)
    { size: 'w-24 h-24 sm:w-32 sm:h-32', scale: 'scale-125 opacity-100 z-30 shadow-xl', text: 'text-sm sm:text-base font-extrabold text-ember-500' }, // 3 (CENTER - BIGGEST)
    { size: 'w-20 h-20 sm:w-24 sm:h-24', scale: 'scale-110 opacity-95', text: 'text-sm font-bold' },        // 4 (Inner Right)
    { size: 'w-16 h-16 sm:w-20 sm:h-20', scale: 'scale-100 opacity-80', text: 'text-xs font-semibold' },    // 5 (Mid Right)
    { size: 'w-14 h-14 sm:w-16 sm:h-16', scale: 'scale-90 opacity-60', text: 'text-xs font-medium' },       // 6 (Outer Right)
  ];

  return (
    <section className="bg-ink-900 border-b border-ink-800 py-12 sm:py-16 overflow-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg sm:text-xl uppercase tracking-wider text-white flex items-center gap-2 font-bold">
            <span className="w-3 h-3 rounded-full bg-ember-500 animate-pulse" />
            <span>Explore Wholesale Taxonomies</span>
          </h3>
          <Link href="/shop" className="text-xs sm:text-sm text-ember-500 font-bold hover:underline">
            View All Categories →
          </Link>
        </div>

        {/* 7 Symmetrical Queued Items (3 visible on Mobile, 7 on Desktop) */}
        <div className="flex items-center justify-around sm:justify-between gap-2 sm:gap-6 md:gap-8 py-6 px-1 sm:px-2 min-h-[200px] sm:min-h-[260px] w-full max-w-full overflow-hidden">
          {visibleItems.map((category, slotIdx) => {
            const style = slotStyles[slotIdx];
            const displayName = category.name.length > 13 ? `${category.name.slice(0, 13)}...` : category.name;

            // Slots 2, 3 (Center), 4 (3 items) are visible on mobile; slots 0, 1, 5, 6 are hidden on mobile
            const isMobileVisible = slotIdx >= 2 && slotIdx <= 4;

            return (
              <Link
                key={`${category.id}-${slotIdx}`}
                href={`/shop/${category.slug}`}
                className={`${isMobileVisible ? 'flex' : 'hidden sm:flex'} flex-col items-center shrink-0 group text-center transition-all duration-700 ease-in-out cursor-pointer ${style.scale}`}
              >
                <div
                  className={`relative ${style.size} rounded-full bg-ink-950 p-1 transition-all duration-500 shadow-md overflow-hidden mb-3`}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-ink-950 flex items-center justify-center">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="128px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span className="font-display text-xs text-ember-500 uppercase font-bold p-1">
                        {category.name.slice(0, 3)}
                      </span>
                    )}
                  </div>
                </div>

                <span className={`text-white transition-colors duration-300 line-clamp-1 ${style.text}`}>
                  {displayName}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
