import { Product, ProductFilterParams, QuoteOrder, StoreSettings } from './types';
import { DEFAULT_STORE_SETTINGS } from './constants';
import { createClient } from '@/lib/supabase/client';

const PRODUCTS_KEY = 'shashi_enterprises_products_v10';
const ORDERS_KEY = 'shashi_enterprises_orders_v10';
const SETTINGS_KEY = 'shashi_enterprises_settings_v10';

const supabase = createClient();

// Helper to simulate network latency if needed
const simulateLatency = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 200));
};

export const DEFAULT_PRODUCTS: Product[] = [];

// LocalStorage helpers
const getStoredProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(PRODUCTS_KEY);
    if (!item) return [];
    const parsed = JSON.parse(item);
    return (parsed && parsed.length > 0) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const setStoredProducts = (products: Product[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {}
};

const getStoredOrders = (): QuoteOrder[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(ORDERS_KEY);
    if (!item) return [];
    return JSON.parse(item);
  } catch (e) {
    return [];
  }
};

const setStoredOrders = (orders: QuoteOrder[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {}
};

function filterAndSortProductsList(products: Product[], params?: ProductFilterParams): Product[] {
  if (!params) return products;
  let result = [...products];

  if (params.category) {
    const categoryLower = params.category.toLowerCase().replace(/-/g, ' ');
    result = result.filter(p => 
      p.category.toLowerCase().replace(/[^a-z0-9]/g, '') === categoryLower.replace(/[^a-z0-9]/g, '') ||
      p.series.toLowerCase().replace(/[^a-z0-9]/g, '') === categoryLower.replace(/[^a-z0-9]/g, '')
    );
  }
  if (params.series) {
    result = result.filter(p => p.series.toLowerCase() === params.series!.toLowerCase());
  }
  if (params.minPrice !== undefined) {
    result = result.filter(p => p.wholesalePrice >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    result = result.filter(p => p.wholesalePrice <= params.maxPrice!);
  }
  if (params.inStockOnly) {
    result = result.filter(p => p.stockQty > 0 && p.status === 'active');
  }
  if (params.badge) {
    result = result.filter(p => p.badges && p.badges.includes(params.badge as any));
  }
  if (params.search && params.search.trim() !== '') {
    const query = params.search.toLowerCase().trim();
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.series.toLowerCase().includes(query)
    );
  }
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.wholesalePrice - a.wholesalePrice);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'recommended':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
  }

  return result;
}

// ====================================================================
// CATALOG API FUNCTIONS (Supabase Live DB + Local Sync)
// ====================================================================

export async function getProducts(params?: ProductFilterParams): Promise<Product[]> {
  try {
    const { data: dbProducts, error } = await supabase
      .from('se_products')
      .select('*, se_product_price_tiers(*)');

    if (!error && dbProducts) {
      let products: Product[] = dbProducts.map((p: any) => {
        const wholesalePrice = Number(p.wholesale_price) || 700;
        const retailRegPrice = Number(p.retail_reg_price) || Math.round(wholesalePrice * 1.8);
        const retailSalePrice = Number(p.retail_sale_price || p.retail_reg_price) || Math.round(wholesalePrice * 1.5);

        const rawTiers = p.se_product_price_tiers || [];
        const hasCustomTiers = rawTiers.some((t: any) => Number(t.price_per_pc) > 0 && Number(t.price_per_pc) !== 700);

        const wholesaleTiers = hasCustomTiers
          ? rawTiers.map((t: any) => ({
              minQty: t.min_qty,
              maxQty: t.max_qty || undefined,
              pricePerPc: Number(t.price_per_pc)
            }))
          : [
              { minQty: 1, maxQty: 19, pricePerPc: wholesalePrice },
              { minQty: 20, maxQty: 49, pricePerPc: Math.round(wholesalePrice * 0.92) },
              { minQty: 50, pricePerPc: Math.round(wholesalePrice * 0.85) }
            ];

        return {
          id: p.id,
          sku: p.sku,
          name: p.name,
          slug: p.slug,
          series: p.series,
          category: p.category,
          description: p.description || '',
          shortDesc: p.short_desc || '',
          image: p.image_url,
          gallery: p.gallery_urls || [],
          retailRegPrice,
          retailSalePrice,
          wholesalePrice,
          stockQty: Number(p.stock_qty) || 50,
          moq: Number(p.moq) || 1,
          heightCm: p.height_cm ? Number(p.height_cm) : undefined,
          material: p.material || 'PVC/Resin',
          badges: p.badges || [],
          showOldPrice: p.show_old_price,
          featured: p.featured,
          status: p.status ? p.status.toLowerCase() : 'active',
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          wholesaleTiers
        };
      });

      const filteredAndSorted = filterAndSortProductsList(products, params);
      setStoredProducts(filteredAndSorted);
      return filteredAndSorted;
    }
  } catch (err) {
    console.warn('Supabase products fetch fallback to local state:', err);
  }

  await simulateLatency();
  const stored = getStoredProducts();
  return filterAndSortProductsList(stored, params);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

export async function generateNextMaterialCode(): Promise<string> {
  let highestNum = 100;
  try {
    const products = await getProducts();
    for (const p of products) {
      if (p.sku) {
        const match = p.sku.match(/SE-ANM-(\d+)/i) || p.sku.match(/(\d+)/);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > highestNum && num < 99999) {
            highestNum = num;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Error computing next material code:', err);
  }

  const candidateCode = `SE-ANM-${highestNum + 1}`;
  return candidateCode;
}

export async function addProduct(productData: Partial<Product>): Promise<Product> {
  const generatedSKU = (productData.sku && productData.sku.trim() !== '' && !productData.sku.includes('Auto-generated'))
    ? productData.sku.trim()
    : await generateNextMaterialCode();

  const slug = productData.slug || (productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${Date.now()}`);

  try {
    const { data, error } = await supabase
      .from('se_products')
      .insert({
        sku: generatedSKU,
        name: productData.name || 'Untitled Product',
        slug,
        series: productData.series || 'Dragon Ball',
        category: productData.category || 'Action Figures',
        description: productData.description || '',
        short_desc: productData.shortDesc || '',
        image_url: productData.image || 'https://placehold.co/800x800/1C1A21/E2632B?text=New+Product',
        gallery_urls: productData.gallery || [],
        retail_reg_price: Number(productData.retailRegPrice) || 1999,
        retail_sale_price: Number(productData.retailSalePrice) || 1200,
        wholesale_price: Number(productData.wholesalePrice) || 750,
        stock_qty: Number(productData.stockQty) || 50,
        moq: Number(productData.moq) || 5,
        height_cm: productData.heightCm ? Number(productData.heightCm) : null,
        material: productData.material || 'PVC/Resin',
        badges: productData.badges || [],
        show_old_price: productData.showOldPrice !== false,
        featured: productData.featured || false,
        status: (productData.status || 'ACTIVE').toUpperCase()
      })
      .select()
      .single();

    if (!error && data) {
      // Insert Tiers if provided
      if (productData.wholesaleTiers && productData.wholesaleTiers.length > 0) {
        await supabase.from('se_product_price_tiers').insert(
          productData.wholesaleTiers.map(t => ({
            product_id: data.id,
            min_qty: t.minQty,
            max_qty: t.maxQty || null,
            price_per_pc: t.pricePerPc
          }))
        );
      }

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        category: data.category,
        series: data.series,
        retailRegPrice: Number(data.retail_reg_price),
        retailSalePrice: Number(data.retail_sale_price),
        wholesalePrice: Number(data.wholesale_price),
        stockQty: Number(data.stock_qty),
        moq: Number(data.moq),
        status: data.status.toLowerCase(),
        image: data.image_url,
        gallery: data.gallery_urls || [],
        heightCm: data.height_cm ? Number(data.height_cm) : undefined,
        material: data.material,
        description: data.description || '',
        shortDesc: data.short_desc || '',
        badges: data.badges || [],
        featured: data.featured,
        wholesaleTiers: productData.wholesaleTiers || [],
        createdAt: data.created_at
      };

      const products = getStoredProducts();
      setStoredProducts([newProduct, ...products]);
      return newProduct;
    }
  } catch (err) {
    console.warn('Supabase add product error:', err);
  }

  // Fallback to local storage
  const id = `prod-${Date.now()}`;
  const newProduct: Product = {
    id,
    name: productData.name || 'Untitled Product',
    slug,
    sku: generatedSKU,
    category: productData.category || 'Action Figures',
    series: productData.series || 'Dragon Ball',
    retailRegPrice: Number(productData.retailRegPrice) || 1999,
    retailSalePrice: Number(productData.retailSalePrice) || 1200,
    wholesalePrice: Number(productData.wholesalePrice) || 750,
    wholesaleTiers: productData.wholesaleTiers || [],
    stockQty: Number(productData.stockQty) || 50,
    moq: Number(productData.moq) || 5,
    status: productData.status || 'active',
    image: productData.image || 'https://placehold.co/800x800/1C1A21/E2632B?text=New+Product',
    gallery: productData.gallery || [],
    heightCm: productData.heightCm ? Number(productData.heightCm) : 25,
    material: productData.material || 'PVC/Resin',
    description: productData.description || 'Premium B2B wholesale collectible statue.',
    shortDesc: productData.shortDesc || 'Wholesale anime statue collectible.',
    badges: productData.badges || [],
    featured: productData.featured || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const products = getStoredProducts();
  const updatedProducts = [newProduct, ...products];
  setStoredProducts(updatedProducts);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  try {
    await supabase.from('se_products').update({
      ...(updates.name && { name: updates.name }),
      ...(updates.sku && { sku: updates.sku }),
      ...(updates.category && { category: updates.category }),
      ...(updates.series && { series: updates.series }),
      ...(updates.wholesalePrice && { wholesale_price: Number(updates.wholesalePrice) }),
      ...(updates.stockQty !== undefined && { stock_qty: Number(updates.stockQty) }),
      ...(updates.status && { status: updates.status.toUpperCase() })
    }).eq('id', id);
  } catch (e) {}

  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
    setStoredProducts(products);
    return products[index];
  }
  throw new Error(`Product with ID ${id} not found`);
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    // 1. Delete associated tier prices first
    await supabase.from('se_product_price_tiers').delete().eq('product_id', id);

    // 2. Delete full product row from se_products DB table by id and by sku
    await supabase.from('se_products').delete().eq('id', id);
    await supabase.from('se_products').delete().eq('sku', id);
  } catch (e) {
    console.warn('Supabase deleteProduct error:', e);
  }

  const products = getStoredProducts();
  const filtered = products.filter(p => p.id !== id && p.sku !== id);
  setStoredProducts(filtered);
  return true;
}

export async function bulkDeleteProducts(ids: string[]): Promise<boolean> {
  try {
    await supabase.from('se_product_price_tiers').delete().in('product_id', ids);
    await supabase.from('se_products').delete().in('id', ids);
    await supabase.from('se_products').delete().in('sku', ids);
  } catch (e) {
    console.warn('Supabase bulkDeleteProducts error:', e);
  }

  const products = getStoredProducts();
  const filtered = products.filter(p => !ids.includes(p.id) && !ids.includes(p.sku));
  setStoredProducts(filtered);
  return true;
}

// ====================================================================
// ORDERS API (Supabase Live DB + Local Sync)
// ====================================================================

// Helper for 8-character uppercase alphanumeric order code generation
export function generateAlphaNumOrderNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `SE-${year}-${code}`;
}

export async function getOrders(): Promise<QuoteOrder[]> {
  let dbMappedOrders: QuoteOrder[] = [];
  try {
    const { data: dbOrders, error } = await supabase
      .from('se_orders')
      .select('*, se_order_items(*)');

    if (!error && dbOrders && dbOrders.length > 0) {
      dbMappedOrders = dbOrders.map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number,
        businessName: o.business_name,
        contactPerson: o.customer_name,
        phone: o.customer_phone,
        email: o.customer_email,
        gstin: o.gstin || '',
        address: o.shipping_address,
        city: o.city,
        pincode: o.pincode,
        paymentPreference: o.payment_preference,
        items: (o.se_order_items || []).map((item: any) => ({
          product: {
            id: item.product_id || `prod-${Date.now()}`,
            name: item.product_name,
            sku: item.product_sku,
            image: item.product_image,
            category: 'Collectibles',
            series: 'Anime',
            retailRegPrice: item.unit_price,
            retailSalePrice: item.unit_price,
            wholesalePrice: item.unit_price,
            wholesaleTiers: [],
            stockQty: 100,
            moq: 1,
            status: 'active',
            description: '',
            badges: [],
            createdAt: new Date().toISOString()
          },
          quantity: item.quantity,
          selectedTierPrice: Number(item.unit_price),
          lineTotal: Number(item.line_total)
        })),
        subtotal: Number(o.subtotal),
        status: o.status === 'CONFIRMED' ? 'Confirmed' : 'New',
        createdAt: o.created_at,
        notes: o.admin_notes || ''
      }));
    }
  } catch (err) {
    console.warn('Supabase getOrders error:', err);
  }

  // Merge with locally saved stored orders to prevent any missing order lookup
  const localOrders = getStoredOrders();
  const combined = [...dbMappedOrders];

  for (const local of localOrders) {
    if (!combined.some(c => c.orderNumber.toLowerCase() === local.orderNumber.toLowerCase() || c.id === local.id)) {
      combined.push(local);
    }
  }

  return combined;
}

export async function addOrder(orderData: Partial<QuoteOrder>): Promise<QuoteOrder> {
  const generatedOrderNum = orderData.orderNumber || generateAlphaNumOrderNumber();

  try {
    const { data: insertedOrder, error } = await supabase
      .from('se_orders')
      .insert({
        order_number: generatedOrderNum,
        customer_name: orderData.contactPerson || 'Buyer',
        customer_email: orderData.email || '',
        customer_phone: orderData.phone || '',
        business_name: orderData.businessName || 'Business Trade Account',
        gstin: orderData.gstin || '',
        shipping_address: orderData.address || '',
        city: orderData.city || '',
        pincode: orderData.pincode || '',
        payment_preference: orderData.paymentPreference || 'UPI',
        subtotal: Number(orderData.subtotal) || 0,
        total_amount: Number(orderData.subtotal) || 0,
        status: 'NEW_REQUEST'
      })
      .select()
      .single();

    if (!error && insertedOrder) {
      if (orderData.items && orderData.items.length > 0) {
        await supabase.from('se_order_items').insert(
          orderData.items.map(item => ({
            order_id: insertedOrder.id,
            product_id: item.product.id && !item.product.id.startsWith('prod-') ? item.product.id : null,
            product_name: item.product.name,
            product_sku: item.product.sku,
            product_image: item.product.image,
            quantity: item.quantity,
            unit_price: item.selectedTierPrice,
            line_total: item.lineTotal
          }))
        );
      }

      const newOrder: QuoteOrder = {
        id: insertedOrder.id,
        orderNumber: insertedOrder.order_number || generatedOrderNum,
        businessName: insertedOrder.business_name,
        contactPerson: insertedOrder.customer_name,
        phone: insertedOrder.customer_phone,
        email: insertedOrder.customer_email,
        gstin: insertedOrder.gstin || '',
        address: insertedOrder.shipping_address,
        city: insertedOrder.city,
        pincode: insertedOrder.pincode,
        paymentPreference: insertedOrder.payment_preference,
        items: orderData.items || [],
        subtotal: Number(insertedOrder.subtotal),
        status: 'New',
        createdAt: insertedOrder.created_at,
        notes: insertedOrder.admin_notes || ''
      };

      const orders = getStoredOrders();
      setStoredOrders([newOrder, ...orders]);
      return newOrder;
    }
  } catch (err) {
    console.warn('Supabase addOrder error:', err);
  }

  // Fallback to local state
  const newOrder: QuoteOrder = {
    id: `ord-${Date.now()}`,
    orderNumber: generatedOrderNum,
    businessName: orderData.businessName || 'Business Trade Account',
    contactPerson: orderData.contactPerson || 'Buyer',
    phone: orderData.phone || '',
    email: orderData.email || '',
    gstin: orderData.gstin || '',
    address: orderData.address || '',
    city: orderData.city || '',
    pincode: orderData.pincode || '',
    paymentPreference: orderData.paymentPreference || 'UPI',
    items: orderData.items || [],
    subtotal: orderData.subtotal || 0,
    status: 'New',
    createdAt: new Date().toISOString(),
    notes: orderData.notes || ''
  };

  const orders = getStoredOrders();
  setStoredOrders([newOrder, ...orders]);
  return newOrder;
}

export async function updateOrderStatus(id: string, status: QuoteOrder['status']): Promise<QuoteOrder> {
  const dbStatus = status === 'Confirmed' ? 'CONFIRMED' : 'NEW_REQUEST';
  try {
    await supabase
      .from('se_orders')
      .update({ status: dbStatus })
      .or(`id.eq.${id},order_number.eq.${id}`);
  } catch (e) {
    console.warn('Supabase updateOrderStatus error:', e);
  }

  const allOrders = await getOrders();
  const searchId = id.trim().toLowerCase();
  const found = allOrders.find(
    o => o.id.toLowerCase() === searchId || o.orderNumber.toLowerCase() === searchId
  );
  if (found) {
    found.status = status;
    if (typeof window !== 'undefined') {
      const localOrders = getStoredOrders();
      const idx = localOrders.findIndex(
        o => o.id.toLowerCase() === searchId || o.orderNumber.toLowerCase() === searchId
      );
      if (idx !== -1) {
        localOrders[idx].status = status;
        setStoredOrders(localOrders);
      }
    }
    return found;
  }

  return {
    id,
    orderNumber: id,
    businessName: 'Business Account',
    contactPerson: 'Valued Customer',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    paymentPreference: 'UPI',
    items: [],
    subtotal: 0,
    status,
    createdAt: new Date().toISOString()
  };
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    await supabase.from('se_order_items').delete().eq('order_id', id);
    await supabase.from('se_orders').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase deleteOrder error:', e);
  }

  const orders = getStoredOrders();
  const filtered = orders.filter(o => o.id !== id && o.orderNumber !== id);
  setStoredOrders(filtered);
  return true;
}

export async function clearAllOrders(): Promise<boolean> {
  try {
    const { data } = await supabase.from('se_orders').select('id');
    if (data && data.length > 0) {
      const ids = data.map(d => d.id);
      await supabase.from('se_order_items').delete().in('order_id', ids);
      await supabase.from('se_orders').delete().in('id', ids);
    }
  } catch (e) {
    console.warn('Supabase clearAllOrders error:', e);
  }

  setStoredOrders([]);
  return true;
}

// ====================================================================
// STORE SETTINGS API (Variables in DB: Minimum Order Value, etc.)
// ====================================================================

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const { data, error } = await supabase
      .from('se_store_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (!error && data) {
      const settings: StoreSettings = {
        storeName: data.store_name,
        legalName: data.legal_name,
        tagline: data.tagline,
        logoUrl: data.logo_url,
        logoMarkUrl: data.logo_mark_url,
        address: data.address,
        whatsapp: data.whatsapp,
        email: data.email,
        gstin: data.gstin || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        minimumOrderValue: Number(data.minimum_order_value),
        minimumOrderNote: data.minimum_order_note,
        paymentMethods: data.payment_methods || ["UPI", "Bank Transfer", "Cash on Pickup"],
        adminEmail: data.admin_email
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      }
      return settings;
    }
  } catch (err) {
    console.warn('Supabase store settings fetch error, fallback to default:', err);
  }

  if (typeof window === 'undefined') return DEFAULT_STORE_SETTINGS;
  try {
    const item = localStorage.getItem(SETTINGS_KEY);
    return item ? JSON.parse(item) : DEFAULT_STORE_SETTINGS;
  } catch (e) {
    return DEFAULT_STORE_SETTINGS;
  }
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  try {
    const updateData: any = {};
    if (settings.storeName) updateData.store_name = settings.storeName;
    if (settings.legalName) updateData.legal_name = settings.legalName;
    if (settings.tagline) updateData.tagline = settings.tagline;
    if (settings.logoUrl) updateData.logo_url = settings.logoUrl;
    if (settings.logoMarkUrl) updateData.logo_mark_url = settings.logoMarkUrl;
    if (settings.address) updateData.address = settings.address;
    if (settings.whatsapp) updateData.whatsapp = settings.whatsapp;
    if (settings.email) updateData.email = settings.email;
    if (settings.gstin !== undefined) updateData.gstin = settings.gstin;
    if (settings.minimumOrderValue) updateData.minimum_order_value = Number(settings.minimumOrderValue);
    if (settings.minimumOrderNote) updateData.minimum_order_note = settings.minimumOrderNote;
    if (settings.paymentMethods) updateData.payment_methods = settings.paymentMethods;
    if (settings.adminEmail) updateData.admin_email = settings.adminEmail;

    updateData.updated_at = new Date().toISOString();

    await supabase
      .from('se_store_settings')
      .update(updateData)
      .eq('id', 1);
  } catch (e) {
    console.warn('Supabase update store settings error:', e);
  }

  const current = await getStoreSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  }
  return updated;
}
