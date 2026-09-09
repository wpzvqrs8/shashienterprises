'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useCart, calculateTierPrice } from '@/lib/cart-store';
import { ShoppingBag, Plus, Minus, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const minOrderQty = product.moq || 1;
  const [qty, setQty] = useState(minOrderQty);
  const [isLiked, setIsLiked] = useState(false);

  const activeBadge = product.badges && product.badges.length > 0 ? product.badges[0] : null;

  const currentWholesaleRate = calculateTierPrice(product, qty);

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    setQty(prev => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (qty > minOrderQty) {
      setQty(prev => prev - 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, qty);
  };

  return (
    <div className="group relative bg-[#F0EAE0] hover:bg-[#F0EAE0] rounded-[10px] p-3 flex flex-col justify-between transition-all duration-300 border border-parchment-300/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] overflow-hidden h-full">
      
      {/* Header Row ABOVE the product image: Badge (Left) & Wishlist (Right) */}
      <div className="flex justify-between items-center mb-2.5 h-7">
        <div>
          {activeBadge ? (
            <Badge variant={activeBadge}>
              {activeBadge === 'bestseller' ? 'Best Seller' : activeBadge}
            </Badge>
          ) : <div />}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          aria-label="Save product to wishlist"
          className="w-7 h-7 rounded-full bg-parchment-100 flex items-center justify-center border border-parchment-300 shadow-sm hover:bg-white transition-all cursor-pointer"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-600 text-red-600' : 'text-red-600 hover:fill-red-600/30'}`} />
        </button>

      </div>

      {/* Main Image Container */}
      <Link href={`/product/${product.slug}`} className="block overflow-hidden rounded-[8px] bg-parchment-100 relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain object-center p-1.5 group-hover:scale-105 transition-transform duration-400 ease-out"
        />

        {/* Quick Add Bar Slide-up on Desktop Hover with Solid Pure White Background */}
        <div className="hidden md:flex absolute bottom-0 left-0 right-0 p-2 bg-white border-t border-parchment-300 shadow-lg text-ink-950 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 justify-between items-center z-20 gap-1">
          <div className="flex items-center border border-parchment-300 rounded bg-parchment-50 text-ink-950 px-1">
            <button
              onClick={handleDecrement}
              disabled={qty <= minOrderQty}
              className="p-1 text-ink-950 hover:text-ember-500 disabled:opacity-30 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-mono font-bold min-w-[24px] text-center">{qty}</span>
            <button
              onClick={handleIncrement}
              className="p-1 text-ink-950 hover:text-ember-500 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-ember-500 text-white text-xs font-bold px-3.5 py-1.5 rounded hover:bg-ember-600 uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ADD</span>
          </button>
        </div>
      </Link>

      {/* Details Container */}
      <div className="pt-3 flex flex-col flex-grow justify-between">
        <div>
          {/* Eyebrow */}
          <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1 truncate">
            {product.series} • {product.category}
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-display text-lg text-ink-950 line-clamp-2 leading-tight group-hover:text-ember-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & MOQ Block */}
        <div className="pt-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold font-display text-ember-600">
              ₹{currentWholesaleRate.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-muted font-normal">/pc</span>
            {product.showOldPrice !== false && (
              <span className="text-xs text-muted line-through">
                ₹{product.retailSalePrice.toLocaleString('en-IN')}
              </span>
            )}

          </div>

          <div className="flex justify-between items-center mt-1 text-[11px] text-muted border-t border-parchment-300/60 pt-2">
            <span>MOQ: <strong className="text-ink-950 font-bold">{minOrderQty} {minOrderQty === 1 ? 'pc' : 'pcs'}</strong></span>
            <span className={product.stockQty > 0 ? 'text-jade-600 font-semibold' : 'text-danger font-semibold'}>
              {product.stockQty > 0 ? `${product.stockQty} in stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Touch / Mobile Stepper & Add Button */}
          <div className="flex md:hidden items-center gap-2 mt-3 pt-2 border-t border-parchment-300">
            <div className="flex items-center border border-parchment-300 rounded bg-parchment-100 text-ink-950 px-1">
              <button
                onClick={handleDecrement}
                disabled={qty <= minOrderQty}
                className="p-1 text-ink-950 disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-mono font-bold">{qty}</span>
              <button
                onClick={handleIncrement}
                className="p-1 text-ink-950"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-ember-500 text-white text-xs font-bold py-1.5 px-2 rounded uppercase flex items-center justify-center gap-1 active:bg-ember-600"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
