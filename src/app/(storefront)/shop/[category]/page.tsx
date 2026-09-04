'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { getProducts } from '@/lib/catalog-store';
import { CATEGORIES } from '@/lib/mock-data';
import { ProductCard } from '@/components/storefront/product-card';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { Tag } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.category as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const matchedCategory = CATEGORIES.find(c => c.slug === slug);
  const title = matchedCategory ? matchedCategory.name : slug.replace(/-/g, ' ');

  useEffect(() => {
    async function loadCategoryProducts() {
      setLoading(true);
      const data = await getProducts({ category: slug });
      setProducts(data);
      setLoading(false);
    }
    loadCategoryProducts();
  }, [slug]);

  return (
    <div className="bg-parchment-50 min-h-screen pb-16">
      
      {/* Category Hero Banner */}
      <section className="bg-ink-950 text-parchment-text py-10 border-b border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs text-gold-500 font-bold uppercase tracking-wider mb-2">
            <Link href="/" className="hover:underline">Home</Link> / <Link href="/shop" className="hover:underline">Shop</Link> / <span className="text-parchment-50">{title}</span>
          </div>

          <div className="flex items-center gap-3">
            <Tag className="w-7 h-7 text-ember-500" />
            <h1 className="font-display text-3xl sm:text-5xl text-parchment-50 capitalize">
              {title} Wholesale Catalog
            </h1>
          </div>

          <p className="text-sm text-parchment-text/80 mt-2 max-w-2xl">
            Sourced bulk stock for {title} collectibles. All listings include tiered volume discounts, GST tax invoices, and pan-India insured dispatch.
          </p>
        </div>
      </section>

      {/* Grid Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs text-muted font-bold uppercase">
            Showing <strong className="text-ink-950">{products.length}</strong> items in {title}
          </span>
          <Link href="/shop" className="text-xs text-ember-600 font-bold hover:underline">
            View All Categories →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-12 text-center">
            <h3 className="font-display text-xl text-ink-950">No products found in {title}</h3>
            <p className="text-xs text-muted mt-1">Check back soon for upcoming container drops.</p>
            <Link href="/shop" className="inline-block mt-4 text-xs font-bold text-ember-600 hover:underline">
              Browse Full Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
