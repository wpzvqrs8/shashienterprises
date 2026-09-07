import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-[#141218] text-[#FAF8F3] min-h-screen flex flex-col items-center justify-center p-6 text-center select-none">
      
      {/* 1. Very Big 404 Text in Distinct Display Font */}
      <h1 className="font-display text-[120px] sm:text-[180px] lg:text-[220px] font-black leading-none tracking-tighter text-[#E2632B]">
        404
      </h1>

      {/* 2. Smaller Subtitle */}
      <p className="font-body text-lg sm:text-2xl font-bold uppercase tracking-widest text-[#FAF8F3] mt-2 mb-8">
        Page Not Found
      </p>

      {/* 3. Clean Home Page Button */}
      <Link
        href="/"
        className="bg-[#E2632B] text-[#FAF8F3] font-body font-bold text-sm sm:text-base px-8 py-3.5 rounded-[8px] hover:bg-[#FAF8F3] hover:text-[#141218] transition-colors uppercase tracking-wider shadow-none border-none cursor-pointer"
      >
        Back To Home
      </Link>

    </div>
  );
}
