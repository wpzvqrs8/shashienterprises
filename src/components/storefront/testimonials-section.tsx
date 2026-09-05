import React from 'react';
import { TESTIMONIALS } from '@/lib/constants';
import { Star, Store, MapPin } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  if (!TESTIMONIALS || TESTIMONIALS.length === 0) {
    return null;
  }
  return (
    <section className="bg-parchment-50 py-16 border-b border-parchment-300">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs bg-gold-500/10 text-gold-500 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-gold-500/30">
            Retail Partner Feedback
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-ink-950 mt-3">
            Trusted by 450+ Anime Retailers & Comic Shops
          </h2>
          <p className="text-sm text-muted mt-2">
            Here is what verified shop owners across India say about sourcing bulk inventory from Shashi Enterprises.
          </p>
        </div>


        {/* 3 Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-6 flex flex-col justify-between shadow-sm hover:border-ink-800 transition-all duration-200"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-gold-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm text-ink-text leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 border-t border-parchment-300/80 flex items-center justify-between mt-6">
                <div>
                  <h4 className="font-display text-base text-ink-950 font-bold">
                    {item.author}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-muted mt-0.5">
                    <Store className="w-3.5 h-3.5 text-ember-500" />
                    <span>{item.store}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted bg-parchment-50 px-2.5 py-1 rounded border border-parchment-300">
                  <MapPin className="w-3 h-3 text-jade-600" />
                  <span>{item.city}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
