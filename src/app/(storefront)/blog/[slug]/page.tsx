import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BLOG_POSTS, getBlogPostBySlug } from '@/lib/blog-data';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { Clock, Calendar, ArrowLeft, UserCheck } from 'lucide-react';

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
    },
  };
}

// Inline Markdown Parser for bold **text**, italics *text*
function parseInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-ink-950">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic text-ink-900">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

// Block Markdown Renderer for Headings, Lists, HRs, and Paragraphs
function renderMarkdownContent(content: string) {
  const blocks = content.split('\n\n');

  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Heading 3 (###)
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="font-display text-xl sm:text-2xl text-ink-950 pt-5 pb-1 border-b border-parchment-300 font-bold">
          {parseInlineMarkdown(trimmed.replace('### ', ''))}
        </h3>
      );
    }

    // Heading 2 (##)
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="font-display text-2xl sm:text-3xl text-ink-950 pt-6 pb-1 border-b border-parchment-300 font-bold">
          {parseInlineMarkdown(trimmed.replace('## ', ''))}
        </h2>
      );
    }

    // Horizontal Line (---)
    if (trimmed === '---') {
      return <hr key={idx} className="my-6 border-parchment-300" />;
    }

    // Bullet List (- item)
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').map((item) => item.replace(/^- /, ''));
      return (
        <ul key={idx} className="list-disc list-inside space-y-2 pl-2 text-ink-text/90 my-3">
          {items.map((item, itemIdx) => (
            <li key={itemIdx} className="leading-relaxed">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
    }

    // Numbered List (1. item)
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').map((item) => item.replace(/^\d+\.\s*/, ''));
      return (
        <ol key={idx} className="list-decimal list-inside space-y-2 pl-2 text-ink-text/90 my-3">
          {items.map((item, itemIdx) => (
            <li key={itemIdx} className="leading-relaxed">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
    }

    // Paragraph
    return (
      <p key={idx} className="text-ink-text/90 leading-relaxed text-sm sm:text-base my-3">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });
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
    <div className="bg-parchment-50 min-h-screen py-8 sm:py-12 border-b border-parchment-300">
      <ArticleJsonLd post={post} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-ink-950 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 text-ember-500" />
            <span>Back to Trade Insights</span>
          </Link>
        </div>

        {/* Article Text Header */}
        <header className="space-y-3 border-b border-parchment-300 pb-5">
          <div className="inline-block bg-ember-500/10 border border-ember-500/30 text-ember-600 font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-md">
            {post.category}
          </div>

          <h1 className="font-display text-2xl sm:text-4xl text-ink-950 leading-tight font-bold">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-medium pt-1">
            <span className="flex items-center gap-1 text-ink-950 font-bold">
              <UserCheck className="w-3.5 h-3.5 text-ember-500" />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Formatted Article Body */}
        <article className="prose prose-slate max-w-none text-ink-text text-sm sm:text-base space-y-2">
          {renderMarkdownContent(post.content)}
        </article>

      </div>
    </div>
  );
}
