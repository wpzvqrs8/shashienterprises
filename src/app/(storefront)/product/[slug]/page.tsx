'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { getProductBySlug, getProducts } from '@/lib/catalog-store';
import { useCart, calculateTierPrice } from '@/lib/cart-store';
import { PriceTierTable } from '@/components/storefront/price-tier-table';
import { ProductCard } from '@/components/storefront/product-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { INITIAL_STORE_SETTINGS } from '@/lib/constants';
import {
  ShoppingBag,
  MessageSquare,
  Plus,
  Minus,
  Star,
  ShieldCheck,
  Truck,
  Box,
  Check,
  AlertCircle
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState<string>('');
  const [qty, setQty] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'bulk'>('description');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getProductBySlug(slug);
      setProduct(data);
      if (data) {
        setActiveImage(data.image);
        setQty(data.moq || 50);
        const related = await getProducts({ category: data.category });
        setRelatedProducts(related.filter(r => r.id !== data.id).slice(0, 4));
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-muted">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-display text-3xl text-ink-950">Product Not Found</h2>
        <p className="text-sm text-muted">The requested wholesale SKU could not be found.</p>
        <Link href="/shop">
          <Button variant="ember" size="md">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const unitRate = calculateTierPrice(product, qty);
  const lineTotal = unitRate * qty;

  const handleIncrement = () => setQty(prev => prev + 1);
  const handleDecrement = () => {
    if (qty > product.moq) {
      setQty(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addItem(product, qty);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Shashi Enterprises! I would like to inquire about a bulk order for: ${product.name} (SKU: ${product.sku}). Quantity requested: ${qty} pcs. Line total: ₹${lineTotal.toLocaleString('en-IN')}. Please confirm availability and shipping freight.`
  );
  const whatsappUrl = `https://wa.me/${INITIAL_STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="bg-parchment-50 min-h-screen py-10 border-b border-parchment-300">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">

        
        {/* Breadcrumb */}
        <div className="text-xs text-muted font-bold uppercase tracking-wider mb-6">
          <Link href="/" className="hover:underline">Home</Link> / <Link href="/shop" className="hover:underline">Shop</Link> / <span className="text-ink-950">{product.name}</span>
        </div>

        {/* Success Toast */}
        {addedToast && (
          <div className="mb-6 bg-jade-100 border border-jade-600/30 text-jade-600 p-4 rounded-[8px] flex items-center justify-between shadow-sm animate-bounce">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Check className="w-5 h-5" />
              <span>Added {qty} pcs of "{product.name}" to your Wholesale Order Draft!</span>
            </div>
            <Link href="/cart" className="text-xs underline font-bold uppercase">
              View Cart →
            </Link>
          </div>
        )}

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full bg-parchment-100 border border-parchment-300 rounded-[12px] overflow-hidden shadow-sm group">
              <Image
                src={activeImage || product.image}
                alt={product.name}
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              {product.badges && product.badges.length > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant={product.badges[0]}>{product.badges[0]}</Badge>
                </div>
              )}
            </div>

            {/* Deduplicated Thumbnail Rail */}
            {(() => {
              const uniqueImages = Array.from(new Set([product.image, ...(product.gallery || [])])).filter(Boolean);
              if (uniqueImages.length <= 1) return null;

              return (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {uniqueImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-[8px] overflow-hidden border-2 shrink-0 transition-all ${
                        (activeImage || product.image) === img ? 'border-ember-500 ring-2 ring-ember-500/30' : 'border-parchment-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Right Column: Info Panel */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  {product.series} • {product.category}
                </span>
                <span className="text-xs text-muted">|</span>
                <span className="text-xs font-mono font-bold text-ink-950 bg-parchment-100 px-2 py-0.5 rounded">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl text-ink-950 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Stock Pill */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1 text-gold-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-gold-500" />
                  <span>4.8</span>
                  <span className="text-muted font-normal">(32 verified dealer reviews)</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                  product.stockQty > 0 ? 'bg-jade-100 text-jade-600' : 'bg-danger/10 text-danger'
                }`}>
                  {product.stockQty > 0 ? `In Stock (${product.stockQty} pcs)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Tiered Price Table */}
            <PriceTierTable
              retailPrice={product.retailSalePrice}
              wholesalePrice={product.wholesalePrice}
              tiers={product.wholesaleTiers}
              currentQty={qty}
              showOldPrice={product.showOldPrice !== false}
            />


            {/* Stepper + Dynamic Line Total */}
            <div className="bg-parchment-100 border border-parchment-300 p-4 rounded-[10px] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Quantity Stepper */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-ink-950 flex items-center gap-1">
                    <span>Order Quantity</span>
                    <span className="text-muted font-normal">(MOQ: {product.moq} pcs)</span>
                  </label>
                  <div className="flex items-center border border-parchment-300 rounded-[6px] bg-parchment-50 w-fit">
                    <button
                      onClick={handleDecrement}
                      disabled={qty <= product.moq}
                      className="px-3 py-2 text-ink-950 hover:bg-parchment-100 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || product.moq;
                        setQty(Math.max(product.moq, val));
                      }}
                      className="w-16 text-center font-mono font-bold text-sm bg-transparent border-x border-parchment-300 py-1.5 focus:outline-none"
                    />
                    <button
                      onClick={handleIncrement}
                      className="px-3 py-2 text-ink-950 hover:bg-parchment-100 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Line Total */}
                <div className="text-right">
                  <div className="text-xs text-muted uppercase font-semibold">Line Total Subtotal</div>
                  <div className="font-display text-2xl text-ember-600 font-bold">
                    ₹{lineTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-muted">
                    Applied Rate: ₹{unitRate.toLocaleString('en-IN')} /pc
                  </div>
                </div>

              </div>

              {qty < product.moq && (
                <div className="text-xs text-danger flex items-center gap-1 font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Minimum Order Quantity for this SKU is {product.moq} pcs.</span>
                </div>
              )}
            </div>

            {/* Action Buttons: Add to Cart & WhatsApp Link */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                variant="ember"
                size="lg"
                className="flex-1 gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Wholesale Cart</span>
              </Button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-jade-600 hover:bg-jade-600/90 text-white font-bold text-sm px-6 py-3.5 rounded-[6px] transition-all gap-2 uppercase tracking-wider shadow-warm"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp Quote</span>
              </a>
            </div>

            {/* Product Specifications Grid */}
            <div className="bg-parchment-100 border border-parchment-300 rounded-[8px] p-4 text-xs space-y-2">
              <h4 className="font-display text-sm text-ink-950 font-bold uppercase border-b border-parchment-300 pb-1">
                Technical Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-muted">
                <div>Height: <strong className="text-ink-950">{product.heightCm ? `${product.heightCm} cm` : 'Standard Scale'}</strong></div>
                <div>Material: <strong className="text-ink-950">{product.material || 'PVC/Resin'}</strong></div>
                <div>Category: <strong className="text-ink-950">{product.category}</strong></div>
                <div>Franchise: <strong className="text-ink-950">{product.series}</strong></div>
              </div>
            </div>

            {/* Description & Shipping Tabs */}
            <div className="border border-parchment-300 rounded-[8px] bg-parchment-50 overflow-hidden">
              <div className="flex border-b border-parchment-300 bg-parchment-100 text-xs font-bold uppercase">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-2.5 px-4 ${activeTab === 'description' ? 'bg-parchment-50 text-ember-600 border-b-2 border-ember-500' : 'text-muted'}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`py-2.5 px-4 ${activeTab === 'shipping' ? 'bg-parchment-50 text-ember-600 border-b-2 border-ember-500' : 'text-muted'}`}
                >
                  Shipping & Packaging
                </button>
                <button
                  onClick={() => setActiveTab('bulk')}
                  className={`py-2.5 px-4 ${activeTab === 'bulk' ? 'bg-parchment-50 text-ember-600 border-b-2 border-ember-500' : 'text-muted'}`}
                >
                  Bulk Trade Terms
                </button>
              </div>
              <div className="p-4 text-xs text-ink-text/90 leading-relaxed">
                {activeTab === 'description' && (
                  <p>{product.description}</p>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-ember-500" />
                      <span>Packaged in heavy 5-ply corrugated master cartons with bubble cushioning.</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-jade-600" />
                      <span>Dispatched via express road freight (2–4 business days pan-India).</span>
                    </p>
                  </div>
                )}
                {activeTab === 'bulk' && (
                  <div className="space-y-1 text-muted">
                    <p>• GST invoice is mandatorily attached with every trade consignment.</p>
                    <p>• Returns accepted strictly for transit damaged goods reported within 48 hours of delivery.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-parchment-300">
            <h3 className="font-display text-2xl text-ink-950 mb-6">
              Related {product.category} Wholesale Items
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
