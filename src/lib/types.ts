export interface PriceTier {
  minQty: number;
  maxQty?: number;
  pricePerPc: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  series: string;
  retailRegPrice: number;
  retailSalePrice: number;
  wholesalePrice: number;
  wholesaleTiers: PriceTier[];
  stockQty: number;
  moq: number;
  status: 'active' | 'draft' | 'out-of-stock' | 'archived';
  image: string;
  gallery?: string[];
  heightCm?: number;
  material?: string;
  description: string;
  shortDesc?: string;
  badges: ('new' | 'bestseller' | 'limited' | string)[];
  featured?: boolean;
  showOldPrice?: boolean;
  createdAt: string;
  updatedAt?: string;
}


export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  type: 'series' | 'type';
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedTierPrice: number;
  lineTotal: number;
}

export interface QuoteOrder {
  id: string;
  orderNumber: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin?: string;
  address: string;
  city: string;
  pincode: string;
  paymentPreference: string;
  items: CartItem[];
  subtotal: number;
  status: 'New' | 'Quoted' | 'Confirmed' | 'Dispatched' | 'Delivered';
  createdAt: string;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  legalName: string;
  tagline: string;
  logoUrl: string;
  logoMarkUrl: string;
  address: string;
  whatsapp: string;
  email: string;
  gstin: string;
  facebook: string;
  instagram: string;
  minimumOrderValue: number;
  minimumOrderNote: string;
  paymentMethods: string[];
  adminEmail: string;
}

export interface ProductFilterParams {
  category?: string;
  series?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  badge?: string;
  search?: string;
  sortBy?: 'recommended' | 'price-low' | 'price-high' | 'newest';
}
