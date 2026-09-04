import { Product, ProductFilterParams, QuoteOrder, StoreSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_STORE_SETTINGS } from './mock-data';

const PRODUCTS_KEY = 'shashi_enterprises_products_v4';
const ORDERS_KEY = 'shashi_enterprises_orders_v4';
const SETTINGS_KEY = 'shashi_enterprises_settings_v4';

// Helper to simulate DB network latency (300ms - 700ms)
const simulateLatency = (): Promise<void> => {
  const delay = Math.floor(Math.random() * 400) + 300;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Initialize localStorage on client side
const getStoredProducts = (): Product[] => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const item = localStorage.getItem(PRODUCTS_KEY);
    if (!item) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed: Product[] = JSON.parse(item);
    // Sanity check: if stored products have broken Wix URLs, refresh with INITIAL_PRODUCTS
    const hasCorruptImage = parsed.some(p => !p.image || p.image === 'https://static.wixstatic.com/' || p.image.endsWith('.com/'));
    if (hasCorruptImage || parsed.length === 0) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse products from localStorage', e);
    return INITIAL_PRODUCTS;
  }
};

const setStoredProducts = (products: Product[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to localStorage', e);
  }
};

const getStoredOrders = (): QuoteOrder[] => {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const item = localStorage.getItem(ORDERS_KEY);
    if (!item) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error('Failed to parse orders from localStorage', e);
    return INITIAL_ORDERS;
  }
};

const setStoredOrders = (orders: QuoteOrder[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
};

// Catalog API functions
export async function getProducts(params?: ProductFilterParams): Promise<Product[]> {
  await simulateLatency();
  let products = getStoredProducts();

  if (!params) return products;

  // Filter category / series
  if (params.category) {
    const categoryLower = params.category.toLowerCase().replace(/-/g, ' ');
    products = products.filter(p => 
      p.category.toLowerCase().replace(/[^a-z0-9]/g, '') === categoryLower.replace(/[^a-z0-9]/g, '') ||
      p.series.toLowerCase().replace(/[^a-z0-9]/g, '') === categoryLower.replace(/[^a-z0-9]/g, '')
    );
  }

  if (params.series) {
    const seriesLower = params.series.toLowerCase();
    products = products.filter(p => p.series.toLowerCase() === seriesLower);
  }

  // Price range
  if (params.minPrice !== undefined) {
    products = products.filter(p => p.wholesalePrice >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    products = products.filter(p => p.wholesalePrice <= params.maxPrice!);
  }

  // In Stock only
  if (params.inStockOnly) {
    products = products.filter(p => p.stockQty > 0 && p.status === 'active');
  }

  // Badge filter
  if (params.badge) {
    products = products.filter(p => p.badges.includes(params.badge as any));
  }

  // Search query
  if (params.search && params.search.trim() !== '') {
    const query = params.search.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.series.toLowerCase().includes(query)
    );
  }

  // Sorting
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'price-low':
        products.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
        break;
      case 'price-high':
        products.sort((a, b) => b.wholesalePrice - a.wholesalePrice);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'recommended':
      default:
        // Featured & Bestsellers first
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await simulateLatency();
  const products = getStoredProducts();
  return products.find(p => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  await simulateLatency();
  const products = getStoredProducts();
  return products.find(p => p.id === id) || null;
}

export async function addProduct(productData: Partial<Product>): Promise<Product> {
  await simulateLatency();
  const products = getStoredProducts();

  const slug = productData.slug || (productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${Date.now()}`);
  const id = `prod-${Date.now()}`;

  const newProduct: Product = {
    id,
    name: productData.name || 'Untitled Product',
    slug,
    sku: productData.sku || `SE-WH-${Math.floor(1000 + Math.random() * 9000)}`,
    category: productData.category || 'Action Figures',
    series: productData.series || 'Dragon Ball',
    retailRegPrice: Number(productData.retailRegPrice) || 1999,
    retailSalePrice: Number(productData.retailSalePrice) || 1200,
    wholesalePrice: Number(productData.wholesalePrice) || 750,
    wholesaleTiers: productData.wholesaleTiers && productData.wholesaleTiers.length > 0 
      ? productData.wholesaleTiers 
      : [
          { minQty: Number(productData.moq) || 5, pricePerPc: Number(productData.wholesalePrice) || 750 },
          { minQty: (Number(productData.moq) || 5) * 4, pricePerPc: Math.round((Number(productData.wholesalePrice) || 750) * 0.9) }
        ],
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

  const updatedProducts = [newProduct, ...products];
  setStoredProducts(updatedProducts);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  await simulateLatency();
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    throw new Error(`Product with ID ${id} not found`);
  }

  const updatedProduct: Product = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  products[index] = updatedProduct;
  setStoredProducts(products);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await simulateLatency();
  const products = getStoredProducts();
  const filtered = products.filter(p => p.id !== id);
  setStoredProducts(filtered);
  return true;
}

export async function bulkDeleteProducts(ids: string[]): Promise<boolean> {
  await simulateLatency();
  const products = getStoredProducts();
  const filtered = products.filter(p => !ids.includes(p.id));
  setStoredProducts(filtered);
  return true;
}

// Orders API
export async function getOrders(): Promise<QuoteOrder[]> {
  await simulateLatency();
  return getStoredOrders();
}

export async function addOrder(orderData: Partial<QuoteOrder>): Promise<QuoteOrder> {
  await simulateLatency();
  const orders = getStoredOrders();

  const newOrder: QuoteOrder = {
    id: `ord-${Date.now()}`,
    orderNumber: `SE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
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

  const updatedOrders = [newOrder, ...orders];
  setStoredOrders(updatedOrders);
  return newOrder;
}

export async function updateOrderStatus(id: string, status: QuoteOrder['status']): Promise<QuoteOrder> {
  await simulateLatency();
  const orders = getStoredOrders();
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) {
    throw new Error(`Order with ID ${id} not found`);
  }

  orders[index].status = status;
  setStoredOrders(orders);
  return orders[index];
}

// Store Settings API
export async function getStoreSettings(): Promise<StoreSettings> {
  await simulateLatency();
  if (typeof window === 'undefined') return INITIAL_STORE_SETTINGS;
  try {
    const item = localStorage.getItem(SETTINGS_KEY);
    return item ? JSON.parse(item) : INITIAL_STORE_SETTINGS;
  } catch (e) {
    return INITIAL_STORE_SETTINGS;
  }
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  await simulateLatency();
  const current = await getStoreSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  }
  return updated;
}
