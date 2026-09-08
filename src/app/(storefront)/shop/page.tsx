'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, ProductFilterParams } from '@/lib/types';
import { getProducts } from '@/lib/catalog-store';
import { CATEGORIES } from '@/lib/constants';
import { ProductCard } from '@/components/storefront/product-card';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Filter, X, RefreshCw, ChevronDown, Search } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedSeries, setSelectedSeries] = useState<string>(searchParams.get('series') || '');
  const [selectedBadge, setSelectedBadge] = useState<string>(searchParams.get('badge') || '');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [inStockOnly, setInStockOnly] = useState<boolean>(searchParams.get('inStock') === 'true');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'newest'>('recommended');
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const params: ProductFilterParams = {
        category: selectedCategory || undefined,
        series: selectedSeries || undefined,
        badge: selectedBadge || undefined,
        search: searchQuery || undefined,
        inStockOnly: inStockOnly || undefined,
        maxPrice: maxPrice < 5000 ? maxPrice : undefined,
        sortBy
      };
      const data = await getProducts(params);
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, [selectedCategory, selectedSeries, selectedBadge, searchQuery, inStockOnly, maxPrice, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSeries('');
    setSelectedBadge('');
    setSearchQuery('');
    setInStockOnly(false);
    setMaxPrice(5000);
    setSortBy('recommended');
    router.push('/shop');
  };

  const seriesOptions = CATEGORIES.filter(c => c.type === 'series');
  const typeOptions = CATEGORIES.filter(c => c.type === 'type');

  return (
    <div className="bg-parchment-50 min-h-screen py-8 border-b border-parchment-300">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">

        
        {/* Header Breadcrumb & Title */}
        <div className="mb-4">
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-1">
            Home / Wholesale Catalog
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-ink-950">
            Wholesale Collectibles Catalog
          </h1>
        </div>

        {/* Top Control Bar with Integrated Eye-Catching Search Bar */}
        <div className="bg-parchment-100 border border-parchment-300 rounded-[12px] p-3.5 sm:p-4 mb-4 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3.5 sm:gap-4 shadow-sm">
          
          {/* Left: Filter Toggle & SKU Count */}
          <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-ink-950 text-parchment-text px-3 py-2 rounded-[6px] text-xs font-bold uppercase shrink-0"
            >
              <Filter className="w-4 h-4 text-ember-500" />
              <span>Filters</span>
            </button>

            <span className="text-xs sm:text-sm text-ink-950 font-semibold shrink-0">
              Showing <strong className="text-ember-600 font-bold text-base sm:text-lg">{products.length}</strong> Wholesale SKUs
            </span>
          </div>

          {/* Center: Eye-Catching Integrated Search Bar */}
          <div className="flex-1 max-w-xl mx-0 lg:mx-4">
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-stretch h-10 sm:h-11 rounded-lg overflow-hidden bg-white border-2 border-ember-500 shadow-sm focus-within:ring-2 focus-within:ring-ember-500/20 transition-all">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-ember-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Search SKU, series, character, figure name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent text-ink-950 text-xs sm:text-sm pl-9 sm:pl-10 pr-9 focus:outline-none placeholder:text-gray-500 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-20 sm:right-24 top-1/2 -translate-y-1/2 text-muted hover:text-ink-950 p-1 z-10"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
              <button
                type="submit"
                className="h-full bg-ember-500 hover:bg-ember-600 text-white font-extrabold text-xs px-4 sm:px-5 uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-1.5 self-stretch border-l border-ember-600 cursor-pointer"
              >
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Right: Sort By Dropdown */}
          <div className="flex items-center gap-2 justify-between sm:justify-end shrink-0">
            <span className="text-xs font-bold text-muted uppercase shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-parchment-300 text-ink-950 text-xs px-3 py-2 rounded-[6px] focus:outline-none focus:border-ember-500 font-bold shadow-sm"
            >
              <option value="recommended">Recommended (Best Selling)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

        </div>

        {/* Active Filter Chips Bar */}
        {(selectedCategory || selectedSeries || selectedBadge || searchQuery || inStockOnly) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-parchment-100/80 border border-parchment-300/80 rounded-lg shadow-2xs">
            <span className="text-xs font-bold text-muted uppercase shrink-0">Active Filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-ember-100 text-ember-600 text-xs px-2.5 py-1 rounded-full font-bold border border-ember-500/20">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3 hover:text-ink-950" /></button>
              </span>
            )}
            {selectedSeries && (
              <span className="inline-flex items-center gap-1 bg-ember-100 text-ember-600 text-xs px-2.5 py-1 rounded-full font-bold border border-ember-500/20">
                Series: {selectedSeries}
                <button onClick={() => setSelectedSeries('')}><X className="w-3 h-3 hover:text-ink-950" /></button>
              </span>
            )}
            {selectedBadge && (
              <span className="inline-flex items-center gap-1 bg-gold-500/10 text-gold-500 text-xs px-2.5 py-1 rounded-full font-bold border border-gold-500/30">
                Badge: {selectedBadge}
                <button onClick={() => setSelectedBadge('')}><X className="w-3 h-3 hover:text-ink-950" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-ember-500 text-white text-xs px-2.5 py-1 rounded-full font-bold border border-ember-600 shadow-sm">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 hover:text-ink-950" /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 bg-jade-100 text-jade-600 text-xs px-2.5 py-1 rounded-full font-bold border border-jade-600/30">
                In Stock Only
                <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3 hover:text-ink-950" /></button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs text-ember-600 font-bold hover:underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Grid & Sidebar Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filter (Desktop + Mobile Drawer) */}
          <aside className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} space-y-6 bg-parchment-100 p-5 rounded-[10px] border border-parchment-300 h-fit`}>
            
            <div className="flex justify-between items-center border-b border-parchment-300 pb-3">
              <h3 className="font-display text-lg text-ink-950 flex items-center gap-2">
                <Filter className="w-4 h-4 text-ember-500" />
                <span>Filter Catalog</span>
              </h3>
              <button
                onClick={clearAllFilters}
                className="text-xs text-muted hover:text-ember-500"
              >
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-ink-950">Search Keywords</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="SKU, figure name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
                />
                <Search className="w-3.5 h-3.5 text-muted absolute right-3 top-3" />
              </div>
            </div>

            {/* In Stock Only Toggle */}
            <div className="flex items-center justify-between py-2 border-y border-parchment-300/80">
              <label className="text-xs font-bold uppercase text-ink-950 cursor-pointer">
                In Stock Only
              </label>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-ember-500 rounded cursor-pointer"
              />
            </div>

            {/* Badge Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-ink-950">Product Badges</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: '', label: 'All' },
                  { id: 'new', label: 'New' },
                  { id: 'bestseller', label: 'Best Seller' },
                  { id: 'limited', label: 'Limited' },
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBadge(b.id)}
                    className={`text-xs px-2.5 py-1 rounded-[4px] font-bold uppercase border transition-colors ${
                      selectedBadge === b.id
                        ? 'bg-ember-500 text-white border-ember-500'
                        : 'bg-parchment-50 border-parchment-300 text-ink-950 hover:bg-parchment-100'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop by Series */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-ink-950">Shop by Series</label>
              <div className="space-y-1 text-xs max-h-48 overflow-y-auto pr-1">
                {seriesOptions.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 text-ink-text/80 cursor-pointer hover:text-ink-950">
                    <input
                      type="radio"
                      name="seriesFilter"
                      checked={selectedSeries === cat.name}
                      onChange={() => setSelectedSeries(selectedSeries === cat.name ? '' : cat.name)}
                      className="accent-ember-500"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Shop by Category Type */}
            <div className="space-y-2 pt-2 border-t border-parchment-300">
              <label className="text-xs font-bold uppercase text-ink-950">Shop by Category</label>
              <div className="space-y-1 text-xs max-h-48 overflow-y-auto pr-1">
                {typeOptions.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 text-ink-text/80 cursor-pointer hover:text-ink-950">
                    <input
                      type="radio"
                      name="typeFilter"
                      checked={selectedCategory === cat.name}
                      onChange={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
                      className="accent-ember-500"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2 pt-2 border-t border-parchment-300">
              <div className="flex justify-between items-center text-xs font-bold text-ink-950">
                <span>Max Wholesale Rate:</span>
                <span className="text-ember-600">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-ember-500"
              />
            </div>

          </aside>

          {/* Main Product Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(9)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-12 text-center space-y-4">
                <Search className="w-12 h-12 text-muted mx-auto stroke-1" />
                <h3 className="font-display text-2xl text-ink-950">No Wholesale Products Match Your Filter</h3>
                <p className="text-xs text-muted max-w-md mx-auto">
                  Try clearing some filter criteria or searching for a different anime franchise keyword.
                </p>
                <Button onClick={clearAllFilters} variant="ember" size="md">
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {products.slice(0, visibleCount).map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleCount < products.length && (
                  <div className="text-center mt-10">
                    <Button
                      onClick={() => setVisibleCount(prev => prev + 9)}
                      variant="dark"
                      size="md"
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Load More Wholesale Items ({products.length - visibleCount} remaining)</span>
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
