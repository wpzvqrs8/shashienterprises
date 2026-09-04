'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { INITIAL_STORE_SETTINGS } from './mock-data';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  isMovMet: boolean;
  movRemaining: number;
  minimumOrderValue: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shashi_wholesale_cart_v1';

export function calculateTierPrice(product: Product, quantity: number): number {
  if (!product.wholesaleTiers || product.wholesaleTiers.length === 0) {
    return product.wholesalePrice;
  }

  const sortedTiers = [...product.wholesaleTiers].sort((a, b) => a.minQty - b.minQty);
  
  let applicablePrice = product.wholesalePrice;

  for (const tier of sortedTiers) {
    if (quantity >= tier.minQty) {
      if (!tier.maxQty || quantity <= tier.maxQty) {
        applicablePrice = tier.pricePerPc;
      } else if (quantity > tier.maxQty) {
        applicablePrice = tier.pricePerPc;
      }
    }
  }

  return applicablePrice;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const minimumOrderValue = INITIAL_STORE_SETTINGS.minimumOrderValue || 15000;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, isLoaded]);

  const addItem = (product: Product, qtyToAdd?: number) => {
    const minQty = qtyToAdd && qtyToAdd >= product.moq ? qtyToAdd : product.moq;
    
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(i => i.product.id === product.id);
      
      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + minQty;
        const tierPrice = calculateTierPrice(product, newQty);
        
        const updated = [...prevItems];
        updated[existingIndex] = {
          product,
          quantity: newQty,
          selectedTierPrice: tierPrice,
          lineTotal: newQty * tierPrice
        };
        return updated;
      } else {
        const tierPrice = calculateTierPrice(product, minQty);
        return [...prevItems, {
          product,
          quantity: minQty,
          selectedTierPrice: tierPrice,
          lineTotal: minQty * tierPrice
        }];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, newQty: number) => {
    setItems((prevItems) => {
      const existing = prevItems.find(i => i.product.id === productId);
      if (!existing) return prevItems;

      if (newQty <= 0) {
        return prevItems.filter(i => i.product.id !== productId);
      }

      const effectiveQty = Math.max(newQty, existing.product.moq);
      const tierPrice = calculateTierPrice(existing.product, effectiveQty);

      return prevItems.map(item => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity: effectiveQty,
            selectedTierPrice: tierPrice,
            lineTotal: effectiveQty * tierPrice
          };
        }
        return item;
      });
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter(i => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isMovMet = subtotal >= minimumOrderValue;
  const movRemaining = Math.max(0, minimumOrderValue - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        itemCount,
        isMovMet,
        movRemaining,
        minimumOrderValue,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
