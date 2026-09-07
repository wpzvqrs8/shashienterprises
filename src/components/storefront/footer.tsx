import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { INITIAL_STORE_SETTINGS, CATEGORIES } from '@/lib/constants';
import { ShieldCheck, MessageSquare, Mail, MapPin, ExternalLink } from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-950 text-parchment-text border-t border-ink-800 pt-16 pb-8">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info & Social Icons */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-52">
                <Image
                  src="/logo_black_bg.png"
                  alt="Shashi Enterprises"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed tracking-wide">
              {INITIAL_STORE_SETTINGS.tagline}. Direct B2B supplier for verified comic shops, anime retail stores, and figure resellers across India.
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={INITIAL_STORE_SETTINGS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Shashi Enterprises on Instagram"
                className="w-9 h-9 rounded-full bg-ink-900 border border-ink-800 flex items-center justify-center text-parchment-text/80 hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300 shadow-sm group"
              >
                <InstagramIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={INITIAL_STORE_SETTINGS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Shashi Enterprises on Facebook"
                className="w-9 h-9 rounded-full bg-ink-900 border border-ink-800 flex items-center justify-center text-parchment-text/80 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 shadow-sm group"
              >
                <FacebookIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 2: Shop Taxonomy */}
          <div>
            <h4 className="font-display text-lg text-ember-500 mb-4 border-b border-ink-800 pb-2 font-bold">
              Wholesale Taxonomies
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link href={`/shop/${cat.slug}`} className="text-parchment-text/80 hover:text-ember-500 hover:underline transition-colors duration-200 block font-medium">
                    • {cat.name} Bulk
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company & Policies */}
          <div>
            <h4 className="font-display text-lg text-gold-500 mb-4 border-b border-ink-800 pb-2 font-bold">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link href="/about" className="text-parchment-text/80 hover:text-gold-500 hover:underline transition-colors duration-200 block font-medium">About Shashi Enterprises</Link></li>
              <li><Link href="/become-a-dealer" className="text-parchment-text/80 hover:text-gold-500 hover:underline transition-colors duration-200 block font-medium">Become a Dealer (B2B Account)</Link></li>
              <li><Link href="/contact" className="text-parchment-text/80 hover:text-gold-500 hover:underline transition-colors duration-200 block font-medium">Contact & Support</Link></li>
              <li><Link href="/shipping-policy" className="text-parchment-text/80 hover:text-gold-500 hover:underline transition-colors duration-200 block font-medium">Pan-India Shipping Policy</Link></li>
              <li><Link href="/refund-policy" className="text-parchment-text/80 hover:text-gold-500 hover:underline transition-colors duration-200 block font-medium">Damaged Goods & Replacement Policy</Link></li>
              <li><Link href="/terms" className="text-parchment-text/80 hover:text-gold-500 hover:underline transition-colors duration-200 block font-medium">Terms of Wholesale Trade</Link></li>
            </ul>
          </div>

          {/* Col 4: Direct Trade Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-lg text-parchment-50 mb-4 border-b border-ink-800 pb-2">
              Direct Trade Desk
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-ember-500 shrink-0 mt-0.5" />
                <span>{INITIAL_STORE_SETTINGS.address} (Pan-India Dispatch)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-ember-500 shrink-0" />
                <a href={`mailto:${INITIAL_STORE_SETTINGS.email}`} className="text-parchment-text/80 hover:text-ember-500 hover:underline transition-colors duration-200">{INITIAL_STORE_SETTINGS.email}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-jade-600 shrink-0" />
                <a href={`https://wa.me/${INITIAL_STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-jade-500 hover:text-jade-400 hover:underline transition-colors duration-200 font-bold">{INITIAL_STORE_SETTINGS.whatsapp}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-pink-500 shrink-0" />
                <a href={INITIAL_STORE_SETTINGS.instagram} target="_blank" rel="noreferrer" className="text-parchment-text/80 hover:text-pink-400 hover:underline transition-colors duration-200 font-medium">@shashienterprises5</a>
              </div>
              <div className="flex items-center gap-2.5">
                <FacebookIcon className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={INITIAL_STORE_SETTINGS.facebook} target="_blank" rel="noreferrer" className="text-parchment-text/80 hover:text-blue-400 hover:underline transition-colors duration-200 font-medium">Shashi Enterprises Facebook</a>
              </div>
            </div>

            <a
              href={`https://wa.me/${INITIAL_STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Shashi%20Enterprises%2C%20I%20want%20to%20place%20a%20bulk%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-jade-600 hover:bg-jade-600/90 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-[6px] transition-colors uppercase tracking-wider"
            >
              Contact Us on WhatsApp
            </a>
          </div>

        </div>

        {/* Bottom copyright & payment methods */}
        <div className="border-t border-ink-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-muted gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>© {new Date().getFullYear()} {INITIAL_STORE_SETTINGS.legalName}. All rights reserved. Wholesale B2B Trade Counter.</span>
            <span className="hidden sm:inline text-ink-800">•</span>
            <a
              href="http://axiselevate.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:underline-offset-2 text-parchment-text/90 hover:text-ember-500 transition-all duration-200 font-semibold"
            >
              Developed By : Axis Elevate
            </a>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs font-bold">
            <span className="text-parchment-text/60">Accepted Payment Preferences:</span>
            {INITIAL_STORE_SETTINGS.paymentMethods.map((method, i) => (
              <span key={i} className="bg-ink-900 border border-ink-800 px-2 py-1 rounded text-parchment-text">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
