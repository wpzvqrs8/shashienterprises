import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/blog-data';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'B2B Trade Insights & Guides | Shashi Enterprises Anime Wholesale',
  description: 'Guides, market trends, GST tax invoicing tips, and wholesale reselling strategies for Indian anime collectible dealers and retailers.',
  keywords: [
    'anime figure wholesale guide India',
    'start anime collectible business',
    'toy business GST invoicing',
    'anime reselling strategy India'
  ],
  alternates: {
    canonical: 'https://shashienterprises.store/blog',
  },
};

export default function BlogIndexPage() {
  return (
    <div className="bg-parchment-50 min-h-screen py-12 border-b border-parchment-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-ember-500/10 border border-ember-500/30 text-ember-600 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-ember-500" />
            <span>B2B Reseller Knowledge Base</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink-950">
            Wholesale Trade Insights & Market Guides
          </h1>

          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Essential strategies, tax guidance, and inventory insights for comic shop owners, online sellers, and verified trade partners in India.
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-parchment-100 border border-parchment-300 rounded-[14px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="relative aspect-[16/9] w-full bg-ink-950 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-ink-950/80 backdrop-blur-md border border-ink-800 text-gold-500 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-muted font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-ember-500" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <h2 className="font-display text-xl text-ink-950 group-hover:text-ember-600 transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-ink-text/80 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-parchment-300/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-950">{post.author}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-ember-600 group-hover:translate-x-0.5 transition-transform uppercase tracking-wider"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
