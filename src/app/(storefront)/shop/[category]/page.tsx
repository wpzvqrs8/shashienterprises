'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { getProducts } from '@/lib/catalog-store';
import { CATEGORIES } from '@/lib/constants';
import { ProductCard } from '@/components/storefront/product-card';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { Tag } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'dragon-ball': 'Explore authentic B2B wholesale Dragon Ball Z and Super statues, S.H.Figuarts scale action figures, and collector busts in India. Direct trade supply for hobby stores, comic shops, and online retailers with tiered bulk volume pricing from Delhi NCR HQ.',
  'one-piece': 'Source high-demand One Piece wholesale action figures including Gear 5 Luffy, Wano Zoro, Trafalgar Law, and Shanks statues. Pan-India B2B dispatch with 100% compliant GST tax invoices.',
  'naruto': 'Wholesale Naruto Shippuden action figures and statues in bulk. Sourcing Sage Mode Naruto, Kakashi Hatake, Itachi Uchiha, and Akatsuki dioramas at direct importer trade rates.',
  'demon-slayer': 'Bulk Demon Slayer action figures, Hashira statues, and replica katanas for Indian retailers. High-turnover SKUs including Tanjiro Kamado, Nezuko, Kyojuro Rengoku, and Tengen Uzui.',
  'jujutsu-kaisen': 'Wholesale Jujutsu Kaisen statues and figures in India. Premium stock of Satoru Gojo, Ryomen Sukuna, and Yuji Itadori figures for comic stores and social media resellers.',
  'action-figures': 'Comprehensive B2B catalog of wholesale anime action figures in India. Poseable PVC figures, scale collectibles, and trade stock with low MOQ (5 pcs per SKU).',
  'limited-statues': 'High-margin limited edition anime dioramas and scale statues for premium hobby shops. Shipped with reinforced wooden crate protection and pan-India express freight.',
  'premium-resin-statues': 'Direct importer supply of premium 1/6 and 1/4 scale resin anime statues in India. Exclusive collector centerpieces commanding high retail margins.',
  'katanas-weapons': 'Wholesale anime replica katanas, Nichirin blades, and cosplay props. High-quality steel and bamboo construction with GST tax invoices on every B2B order.',
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.category as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const matchedCategory = CATEGORIES.find(c => c.slug === slug);
  const title = matchedCategory ? matchedCategory.name : slug.replace(/-/g, ' ');
  const categoryDescription = CATEGORY_DESCRIPTIONS[slug] || `Sourced bulk stock for ${title} collectibles in India. All listings include tiered volume discounts, GST tax invoices, and pan-India insured dispatch from Delhi HQ.`;

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
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Shop', url: '/shop' },
          { name: title, url: `/shop/${slug}` },
        ]}
      />
      
      {/* Category Hero Banner */}
      <section className="bg-ink-950 text-parchment-text py-10 border-b border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs text-gold-500 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline">Home</Link> / <Link href="/shop" className="hover:underline">Shop</Link> / <span className="text-parchment-50">{title}</span>
          </div>

          <div className="flex items-center gap-3">
            <Tag className="w-7 h-7 text-ember-500" />
            <h1 className="font-display text-3xl sm:text-5xl text-parchment-50 capitalize">
              Wholesale {title} Statues & Figures India
            </h1>
          </div>

          <p className="text-sm text-parchment-text/90 max-w-3xl leading-relaxed">
            {categoryDescription}
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
