import { Product, ProductFilterParams, QuoteOrder, StoreSettings } from './types';
import { DEFAULT_STORE_SETTINGS } from './constants';
import { createClient } from '@/lib/supabase/client';

const PRODUCTS_KEY = 'shashi_enterprises_products_v8';
const ORDERS_KEY = 'shashi_enterprises_orders_v8';
const SETTINGS_KEY = 'shashi_enterprises_settings_v8';

const supabase = createClient();

// Helper to simulate network latency if needed
const simulateLatency = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 200));
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "IRON SPIDERMAN 20CM ACTION FIGURE (OPP PACKING) WITH BOX",
    slug: "iron-spiderman-20cm-action-figure",
    sku: "SE-ANM-101",
    category: "Action Figures",
    series: "Marvel",
    retailRegPrice: 1499,
    retailSalePrice: 1100,
    wholesalePrice: 670,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 670 },
      { minQty: 20, maxQty: 49, pricePerPc: 620 },
      { minQty: 50, pricePerPc: 580 }
    ],
    stockQty: 50,
    moq: 1,
    status: "active",
    image: "/catalog/product-001.jpeg",
    description: "Premium Marvel Iron Spiderman 20cm collectible action figure.",
    shortDesc: "Iron Spiderman 20cm action figure with box packing.",
    badges: ["bestseller"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p2",
    name: "IRON SPIDERMAN ON TRUNK 24CM ACTION FIGURE",
    slug: "iron-spiderman-on-trunk-24cm-action-figure",
    sku: "SE-ANM-102",
    category: "Action Figures",
    series: "Marvel",
    retailRegPrice: 1399,
    retailSalePrice: 999,
    wholesalePrice: 610,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 610 },
      { minQty: 20, maxQty: 49, pricePerPc: 570 },
      { minQty: 50, pricePerPc: 530 }
    ],
    stockQty: 50,
    moq: 1,
    status: "active",
    image: "/catalog/product-002.jpeg",
    description: "Iron Spiderman sitting on trunk 24cm detailed collectible statue.",
    shortDesc: "Iron Spiderman on trunk 24cm action figure.",
    badges: ["new"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p3",
    name: "PAIN STANDING 22CM FIGURE (OPP PACKING)",
    slug: "pain-standing-22cm-figure",
    sku: "SE-ANM-103",
    category: "Action Figures",
    series: "Naruto",
    retailRegPrice: 799,
    retailSalePrice: 599,
    wholesalePrice: 320,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 320 },
      { minQty: 20, maxQty: 49, pricePerPc: 295 },
      { minQty: 50, pricePerPc: 275 }
    ],
    stockQty: 80,
    moq: 1,
    status: "active",
    image: "/catalog/product-003.jpeg",
    description: "Naruto Shippuden Pain Akatsuki standing 22cm figure.",
    shortDesc: "Pain standing 22cm figure (OPP packing).",
    badges: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "p4",
    name: "DBZ GOKU AND VEGETA 32CM STANDING COMBO FIGURE (BOX PACKING)",
    slug: "dbz-goku-and-vegeta-32cm-standing-combo-figure",
    sku: "SE-ANM-104",
    category: "Limited Statues",
    series: "Dragon Ball",
    retailRegPrice: 3999,
    retailSalePrice: 2999,
    wholesalePrice: 1800,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 1800 },
      { minQty: 20, maxQty: 49, pricePerPc: 1680 },
      { minQty: 50, pricePerPc: 1550 }
    ],
    stockQty: 30,
    moq: 1,
    status: "active",
    image: "/catalog/product-004.jpeg",
    description: "Dragon Ball Z Goku & Vegeta 32cm combo statue with premium box.",
    shortDesc: "Goku & Vegeta 32cm standing combo figure.",
    badges: ["bestseller", "limited"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p5",
    name: "LUFFY GEAR 5 DOUBLE HEAD PREMIUM BIG FIGURE 37CM (WITH BLISTER ONLY)",
    slug: "luffy-gear-5-double-head-premium-big-figure-37cm",
    sku: "SE-ANM-105",
    category: "Premium Resin Statues",
    series: "One Piece",
    retailRegPrice: 3499,
    retailSalePrice: 2699,
    wholesalePrice: 1600,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 1600 },
      { minQty: 20, maxQty: 49, pricePerPc: 1490 },
      { minQty: 50, pricePerPc: 1380 }
    ],
    stockQty: 25,
    moq: 1,
    status: "active",
    image: "/catalog/product-005.jpeg",
    description: "One Piece Luffy Gear 5 37cm large scale figure with double heads.",
    shortDesc: "Luffy Gear 5 double head 37cm premium figure.",
    badges: ["new", "bestseller"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p6",
    name: "ZORO FIGHTING ACTION FIGURE 10CM",
    slug: "zoro-fighting-action-figure-10cm",
    sku: "SE-ANM-106",
    category: "Action Figures",
    series: "One Piece",
    retailRegPrice: 599,
    retailSalePrice: 399,
    wholesalePrice: 225,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 225 },
      { minQty: 20, maxQty: 49, pricePerPc: 205 },
      { minQty: 50, pricePerPc: 190 }
    ],
    stockQty: 100,
    moq: 1,
    status: "active",
    image: "/catalog/product-006.jpeg",
    description: "Compact One Piece Roronoa Zoro 10cm fighting pose figure.",
    shortDesc: "Zoro fighting action figure 10cm.",
    badges: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "p7",
    name: "SHANKS STANDING ON STONE 70CM PREMIUM ACTION FIGURE (BOX PACKING)",
    slug: "shanks-standing-on-stone-70cm-premium-action-figure",
    sku: "SE-ANM-107",
    category: "Premium Resin Statues",
    series: "One Piece",
    retailRegPrice: 8999,
    retailSalePrice: 7499,
    wholesalePrice: 4900,
    wholesaleTiers: [
      { minQty: 1, maxQty: 4, pricePerPc: 4900 },
      { minQty: 5, maxQty: 19, pricePerPc: 4600 },
      { minQty: 20, pricePerPc: 4300 }
    ],
    stockQty: 10,
    moq: 1,
    status: "active",
    image: "/catalog/product-007.jpeg",
    description: "Massive 70cm Shanks Red Hair Emperor statue standing on rock base.",
    shortDesc: "Shanks 70cm premium statue with box packing.",
    badges: ["limited"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p8",
    name: "ZORO THREE SWORD ACTION FIGURE 21CM (BLISTER PACKING)",
    slug: "zoro-three-sword-action-figure-21cm",
    sku: "SE-ANM-108",
    category: "Action Figures",
    series: "One Piece",
    retailRegPrice: 899,
    retailSalePrice: 699,
    wholesalePrice: 390,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 390 },
      { minQty: 20, maxQty: 49, pricePerPc: 360 },
      { minQty: 50, pricePerPc: 330 }
    ],
    stockQty: 60,
    moq: 1,
    status: "active",
    image: "/catalog/product-008.jpeg",
    description: "Roronoa Zoro three sword style 21cm action figure.",
    shortDesc: "Zoro three sword action figure 21cm.",
    badges: ["bestseller"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p9",
    name: "DEMON SLAYER 6PCS CHARACTER SET 15CM ACTION FIGURE",
    slug: "demon-slayer-6pcs-character-set-15cm",
    sku: "SE-ANM-109",
    category: "Action Figures",
    series: "Demon Slayer",
    retailRegPrice: 1599,
    retailSalePrice: 1199,
    wholesalePrice: 650,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 650 },
      { minQty: 20, maxQty: 49, pricePerPc: 600 },
      { minQty: 50, pricePerPc: 560 }
    ],
    stockQty: 45,
    moq: 1,
    status: "active",
    image: "/catalog/product-009.jpeg",
    description: "Kimetsu no Yaiba 6-piece full hashira & main character set.",
    shortDesc: "Demon Slayer 6pcs character set 15cm.",
    badges: ["new"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p10",
    name: "WHITE SANJI STANDING 30CM (BLISTER+BOX)",
    slug: "white-sanji-standing-30cm",
    sku: "SE-ANM-110",
    category: "Action Figures",
    series: "One Piece",
    retailRegPrice: 899,
    retailSalePrice: 649,
    wholesalePrice: 355,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 355 },
      { minQty: 20, maxQty: 49, pricePerPc: 330 },
      { minQty: 50, pricePerPc: 305 }
    ],
    stockQty: 50,
    moq: 1,
    status: "active",
    image: "/catalog/product-010.jpeg",
    description: "One Piece Vinsmoke Sanji Whole Cake Island white suit 30cm figure.",
    shortDesc: "White Sanji standing 30cm (blister+box).",
    badges: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "p11",
    name: "GOJO STANDING GRAY BLINDFOLD 30CM FIGURE (BLISTER+BOX)",
    slug: "gojo-standing-gray-blindfold-30cm-figure",
    sku: "SE-ANM-111",
    category: "Limited Statues",
    series: "Jujutsu Kaisen",
    retailRegPrice: 2299,
    retailSalePrice: 1799,
    wholesalePrice: 1050,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 1050 },
      { minQty: 20, maxQty: 49, pricePerPc: 980 },
      { minQty: 50, pricePerPc: 910 }
    ],
    stockQty: 40,
    moq: 1,
    status: "active",
    image: "/catalog/product-011.jpeg",
    description: "Jujutsu Kaisen Satoru Gojo gray blindfold 30cm figure.",
    shortDesc: "Gojo standing gray blindfold 30cm figure.",
    badges: ["bestseller"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p12",
    name: "LUFFY GEAR 5 PUNCHING DOWN 13CM ACTION FIGURE",
    slug: "luffy-gear-5-punching-down-13cm",
    sku: "SE-ANM-112",
    category: "Action Figures",
    series: "One Piece",
    retailRegPrice: 799,
    retailSalePrice: 599,
    wholesalePrice: 350,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 350 },
      { minQty: 20, maxQty: 49, pricePerPc: 325 },
      { minQty: 50, pricePerPc: 300 }
    ],
    stockQty: 75,
    moq: 1,
    status: "active",
    image: "/catalog/product-012.jpeg",
    description: "One Piece Sun God Nika Luffy punching pose 13cm figure.",
    shortDesc: "Luffy Gear 5 punching down 13cm figure.",
    badges: ["new"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p13",
    name: "TRENDING DEADPOOL 3PCS SET ACTION FIGURE",
    slug: "trending-deadpool-3pcs-set-action-figure",
    sku: "SE-ANM-113",
    category: "Action Figures",
    series: "Marvel",
    retailRegPrice: 499,
    retailSalePrice: 299,
    wholesalePrice: 160,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 160 },
      { minQty: 20, maxQty: 49, pricePerPc: 145 },
      { minQty: 50, pricePerPc: 135 }
    ],
    stockQty: 120,
    moq: 1,
    status: "active",
    image: "/catalog/product-013.jpeg",
    description: "Marvel Deadpool 3-piece multi-pose mini action figure set.",
    shortDesc: "Trending Deadpool 3pcs set action figure.",
    badges: ["bestseller"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p14",
    name: "DBZ MAJINBU STANDING 27CM FIGURE",
    slug: "dbz-majinbu-standing-27cm-figure",
    sku: "SE-ANM-114",
    category: "Action Figures",
    series: "Dragon Ball",
    retailRegPrice: 1299,
    retailSalePrice: 899,
    wholesalePrice: 550,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 550 },
      { minQty: 20, maxQty: 49, pricePerPc: 510 },
      { minQty: 50, pricePerPc: 470 }
    ],
    stockQty: 35,
    moq: 1,
    status: "active",
    image: "/catalog/product-014.jpeg",
    description: "Dragon Ball Z Majin Buu 27cm standing collectible figure.",
    shortDesc: "DBZ Majinbu standing 27cm figure.",
    badges: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "p15",
    name: "WHOLESALE GOKU 16CM ACTION FIGURE",
    slug: "wholesale-goku-16cm-action-figure",
    sku: "SE-ANM-115",
    category: "Action Figures",
    series: "Dragon Ball",
    retailRegPrice: 599,
    retailSalePrice: 399,
    wholesalePrice: 225,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 225 },
      { minQty: 20, maxQty: 49, pricePerPc: 205 },
      { minQty: 50, pricePerPc: 190 }
    ],
    stockQty: 90,
    moq: 1,
    status: "active",
    image: "/catalog/product-015.jpeg",
    description: "Dragon Ball Z Son Goku 16cm martial arts pose figure.",
    shortDesc: "Wholesale Goku 16cm action figure.",
    badges: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "p16",
    name: "DBZ GOKU STANDING 21CM ACTION FIGURE",
    slug: "dbz-goku-standing-21cm-action-figure",
    sku: "SE-ANM-116",
    category: "Action Figures",
    series: "Dragon Ball",
    retailRegPrice: 499,
    retailSalePrice: 299,
    wholesalePrice: 165,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 165 },
      { minQty: 20, maxQty: 49, pricePerPc: 150 },
      { minQty: 50, pricePerPc: 140 }
    ],
    stockQty: 100,
    moq: 1,
    status: "active",
    image: "/catalog/product-016.jpeg",
    description: "Dragon Ball Z Goku SSJ standing 21cm figure.",
    shortDesc: "DBZ Goku standing 21cm action figure.",
    badges: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "p17",
    name: "NARUTO 6 CHARACTER SET 17CM ACTION FIGURE",
    slug: "naruto-6-character-set-17cm-action-figure",
    sku: "SE-ANM-117",
    category: "Action Figures",
    series: "Naruto",
    retailRegPrice: 1799,
    retailSalePrice: 1299,
    wholesalePrice: 750,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 750 },
      { minQty: 20, maxQty: 49, pricePerPc: 700 },
      { minQty: 50, pricePerPc: 650 }
    ],
    stockQty: 40,
    moq: 1,
    status: "active",
    image: "/catalog/product-017.jpeg",
    description: "Naruto Shippuden 6-piece full character team figure set.",
    shortDesc: "Naruto 6 character set 17cm action figure.",
    badges: ["bestseller"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p18",
    name: "NEON WOODEN KATANA 104CM",
    slug: "neon-wooden-katana-104cm",
    sku: "SE-ANM-118",
    category: "Katanas & Weapons",
    series: "Pop Culture",
    retailRegPrice: 2499,
    retailSalePrice: 1899,
    wholesalePrice: 1185,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 1185 },
      { minQty: 20, maxQty: 49, pricePerPc: 1100 },
      { minQty: 50, pricePerPc: 1020 }
    ],
    stockQty: 30,
    moq: 1,
    status: "active",
    image: "/catalog/product-018.jpeg",
    description: "104cm full size wooden cosplay katana with neon edge detail.",
    shortDesc: "Neon wooden katana 104cm.",
    badges: ["new"],
    createdAt: new Date().toISOString()
  },
  {
    id: "p19",
    name: "ASSEMBLED WOODEN KATANA 104CM",
    slug: "assembled-wooden-katana-104cm",
    sku: "SE-ANM-119",
    category: "Katanas & Weapons",
    series: "Pop Culture",
    retailRegPrice: 1499,
    retailSalePrice: 1099,
    wholesalePrice: 700,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 700 },
      { minQty: 20, maxQty: 49, pricePerPc: 650 },
      { minQty: 50, pricePerPc: 600 }
    ],
    stockQty: 50,
    moq: 1,
    status: "active",
    image: "/catalog/product-019.jpeg",
    description: "104cm full size assembled wooden katana replica.",
    shortDesc: "Assembled wooden katana 104cm.",
    badges: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "p20",
    name: "GOD OF WAR KRATOS 19CM ACTION FIGURE (SET OF 4PCS)",
    slug: "god-of-war-kratos-19cm-action-figure",
    sku: "SE-ANM-120",
    category: "Action Figures",
    series: "Pop Culture",
    retailRegPrice: 2999,
    retailSalePrice: 2199,
    wholesalePrice: 1350,
    wholesaleTiers: [
      { minQty: 1, maxQty: 19, pricePerPc: 1350 },
      { minQty: 20, maxQty: 49, pricePerPc: 1250 },
      { minQty: 50, pricePerPc: 1150 }
    ],
    stockQty: 25,
    moq: 1,
    status: "active",
    image: "/catalog/product-020.jpeg",
    description: "God of War Kratos 19cm action figure 4-piece set.",
    shortDesc: "God of War Kratos 19cm action figure (Set of 4pcs).",
    badges: ["limited"],
    createdAt: new Date().toISOString()
  }
];

// LocalStorage helpers
// LocalStorage helpers
const getStoredProducts = (): Product[] => {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  try {
    const item = localStorage.getItem(PRODUCTS_KEY);
    let parsed: Product[] = [];
    if (item) {
      try {
        parsed = JSON.parse(item);
      } catch (e) {
        parsed = [];
      }
    }

    // Always merge code DEFAULT_PRODUCTS so updated catalog prices take effect immediately across all client sessions
    const merged = DEFAULT_PRODUCTS.map(defP => {
      const existing = (parsed || []).find(p => p.sku === defP.sku || p.id === defP.id);
      if (!existing) return defP;
      return {
        ...existing,
        wholesalePrice: defP.wholesalePrice,
        retailRegPrice: defP.retailRegPrice,
        retailSalePrice: defP.retailSalePrice,
        wholesaleTiers: defP.wholesaleTiers,
        moq: defP.moq,
        name: defP.name,
        image: defP.image || existing.image
      };
    });

    const customProducts = (parsed || []).filter(p => !DEFAULT_PRODUCTS.some(defP => defP.sku === p.sku || defP.id === p.id));
    const result = [...merged, ...customProducts];

    // Re-save merged products to localStorage to clear out any stale cached pricing
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(result));
    } catch (e) {}

    return result;
  } catch (e) {
    return DEFAULT_PRODUCTS;
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
  let dbProductsList: Product[] = [];

  try {
    const { data: dbProducts, error } = await supabase
      .from('se_products')
      .select('*, se_product_price_tiers(*)');

    if (!error && dbProducts) {
      dbProductsList = dbProducts.map((p: any) => ({
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
        retailRegPrice: Number(p.retail_reg_price),
        retailSalePrice: Number(p.retail_sale_price || p.retail_reg_price),
        wholesalePrice: Number(p.wholesale_price),
        stockQty: Number(p.stock_qty) || 50,
        moq: Number(p.moq) || 5,
        heightCm: p.height_cm ? Number(p.height_cm) : undefined,
        material: p.material || 'PVC/Resin',
        badges: p.badges || [],
        showOldPrice: p.show_old_price,
        featured: p.featured,
        status: p.status ? p.status.toLowerCase() : 'active',
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        wholesaleTiers: (p.se_product_price_tiers || []).map((t: any) => ({
          minQty: t.min_qty,
          maxQty: t.max_qty || undefined,
          pricePerPc: Number(t.price_per_pc)
        }))
      }));
    }
  } catch (err) {
    console.warn('Supabase products fetch fallback to local state:', err);
  }

  // Merge DEFAULT_PRODUCTS with DB products so featured/catalog SKUs (SE-ANM-101 to SE-ANM-120)
  // are ALWAYS present and have correct prices!
  const dbSkus = new Set(dbProductsList.map(p => p.sku));
  const missingDefaultProducts = DEFAULT_PRODUCTS.filter(defP => !dbSkus.has(defP.sku));

  // Override pricing for matching SKUs from DEFAULT_PRODUCTS
  const updatedDbProducts = dbProductsList.map(p => {
    const defP = DEFAULT_PRODUCTS.find(d => d.sku === p.sku || d.id === p.id);
    if (defP) {
      return {
        ...p,
        wholesalePrice: defP.wholesalePrice,
        retailRegPrice: defP.retailRegPrice,
        retailSalePrice: defP.retailSalePrice,
        wholesaleTiers: defP.wholesaleTiers,
        moq: defP.moq,
        name: defP.name,
        image: defP.image || p.image,
      };
    }
    return p;
  });

  const combinedProducts = [...missingDefaultProducts, ...updatedDbProducts];
  const finalProducts = combinedProducts.length > 0 ? combinedProducts : getStoredProducts();

  const filteredAndSorted = filterAndSortProductsList(finalProducts, params);
  setStoredProducts(filteredAndSorted);
  return filteredAndSorted;
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
