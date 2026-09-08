import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/blog-data';
import { Clock, ArrowRight, Sparkles, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wholesale B2B Anime Trade Insights & Guides | Shashi Enterprises',
  description: 'Reseller guides, market insights, GST invoicing regulations, and wholesale procurement strategies for Indian anime collectible retailers.',
  keywords: [
    'wholesale anime figures India guide',
    'anime collectible reseller guide',
    'toy wholesale GST invoicing India',
    'anime figure MOQ pricing'
  ],
  alternates: {
    canonical: 'https://shashienterprises.store/blog',
  },
};

export default function BlogIndexPage() {
  return (
    <div className="bg-parchment-50 min-h-screen py-10 sm:py-14 border-b border-parchment-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Compact Header */}
        <div className="space-y-2 border-b border-parchment-300 pb-6">
          <div className="inline-flex items-center gap-1.5 bg-ember-500/10 border border-ember-500/30 text-ember-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-ember-500" />
            <span>B2B Reseller Trade Insights</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl text-ink-950">
            Wholesale Trade Insights & Market Guides
          </h1>

          <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            Concise market telemetry, tax invoicing compliance, and margin optimization strategies for verified Indian retail dealers and anime figure resellers.
          </p>
        </div>

        {/* Text-First Impactful Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-ink-950 text-gold-500 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-muted font-medium">
                    <Clock className="w-3.5 h-3.5 text-ember-500" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h2 className="font-display text-lg sm:text-xl text-ink-950 group-hover:text-ember-600 transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs text-ink-text/80 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-parchment-300/80 flex items-center justify-between text-xs">
                <span className="font-bold text-ink-950 text-[11px] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-ember-500" />
                  {post.author}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 font-extrabold text-ember-600 group-hover:translate-x-0.5 transition-transform uppercase tracking-wider text-[11px]"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
