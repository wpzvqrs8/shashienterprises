import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BLOG_POSTS, getBlogPostBySlug } from '@/lib/blog-data';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { Clock, Calendar, ArrowLeft, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Shashi Enterprises',
    };
  }

  return {
    title: `${post.title} | Shashi Enterprises B2B Insights`,
    description: post.summary,
    keywords: post.keywords,
    alternates: {
      canonical: `https://shashienterprises.store/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: `https://shashienterprises.store/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  return (
    <div className="bg-parchment-50 min-h-screen py-10 border-b border-parchment-300">
      <ArticleJsonLd post={post} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-ink-950 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 text-ember-500" />
            <span>Back to Trade Blog</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 border-b border-parchment-300 pb-6">
          <div className="inline-block bg-ember-500/10 border border-ember-500/30 text-ember-600 font-extrabold text-xs uppercase tracking-wider px-3 py-1 rounded-md">
            {post.category}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink-950 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted font-medium pt-2">
            <span className="flex items-center gap-1.5 text-ink-950 font-bold">
              <UserCheck className="w-4 h-4 text-ember-500" />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Featured Banner Image */}
        <div className="relative aspect-[21/9] w-full bg-ink-950 rounded-[14px] overflow-hidden border border-parchment-300 shadow-md">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover object-center"
          />
        </div>

        {/* Main Content & B2B Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          
          {/* Article Body */}
          <div className="lg:col-span-8 prose prose-slate max-w-none text-ink-text text-sm leading-relaxed space-y-4">
            {post.content.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-display text-xl sm:text-2xl text-ink-950 pt-4 pb-1 border-b border-parchment-300">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }

              if (trimmed.startsWith('---')) {
                return <hr key={idx} className="my-6 border-parchment-300" />;
              }

              if (trimmed.startsWith('- ')) {
                const listItems = trimmed.split('\n').map((li) => li.replace(/^- /, ''));
                return (
                  <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2 text-ink-text/90">
                    {listItems.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={idx} className="text-ink-text/90 text-sm leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* B2B Dealer Call-to-Action Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-ink-950 text-parchment-text p-6 rounded-[14px] border border-ink-800 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-ember-500/20 text-ember-500 border border-ember-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>

              <h3 className="font-display text-xl text-parchment-50 font-bold">
                Source Anime Figurines Wholesale
              </h3>

              <p className="text-xs text-parchment-text/80 leading-relaxed">
                Verified B2B dealers get tier-3 bulk pricing, pan-India express dispatch, and GST tax invoices on every shipment.
              </p>

              <div className="pt-2 space-y-2">
                <Link href="/become-a-dealer" className="block">
                  <Button variant="ember" size="md" fullWidth className="gap-2 font-bold uppercase text-xs">
                    <span>Apply for Dealer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/shop" className="block">
                  <Button variant="outline" size="md" fullWidth className="border-ink-800 text-parchment-text hover:text-white text-xs">
                    <span>Browse B2B Catalog</span>
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
