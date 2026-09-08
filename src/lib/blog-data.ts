export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown / HTML content
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  image: string;
  keywords: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'how-to-start-anime-figure-reselling-business-india',
    title: 'How to Start an Anime Figure Reselling Business in India (2026 Guide)',
    summary: 'A step-by-step roadmap for Indian retail shop owners and social media sellers to source authentic wholesale anime statues, set profit margins, and manage B2B dispatch logistics.',
    category: 'Business Guide',
    author: 'Shashi Enterprises Trade Team',
    publishedAt: '2026-03-01',
    readTime: '6 min read',
    image: '/hero-goku.jpg',
    keywords: [
      'how to start anime figure business India',
      'anime merchandise reseller India',
      'wholesale anime figures Delhi',
      'anime toy store setup India'
    ],
    content: `
### The Rising Demand for Anime Collectibles in India

Anime culture in India has surged dramatically over recent years. Driven by anime streaming platforms, pop culture conventions, and dedicated fan communities across metro cities and tier-2 hubs, demand for physical action figures, resin statues, and collectibles has reached an all-time high.

For hobby shop owners, comic store proprietors, and online Instagram/Facebook sellers, adding anime collectibles to your inventory offers exceptional gross profit margins (typically **35% to 60%**).

---

### Step 1: Secure a Reliable B2B Wholesale Supplier

The single biggest mistake new resellers make is buying retail or unverified import batches from marketplace sellers with unpredictable lead times and missing GST invoices.

When choosing a B2B partner, ensure they provide:
- **Pan-India Express Dispatch**: Dispatch within 24–48 hours from a central warehouse (such as Delhi NCR HQ).
- **Compliant GST B2B Invoices**: Essential for claiming Input Tax Credit (ITC) on your business GSTIN.
- **Low Minimum Order Quantities (MOQ)**: Allows testing new anime series (e.g. 5 pcs per SKU with a ₹6,000 Minimum Order Value).

---

### Step 2: Understand High-Demand Series vs. Niche Statues

Not all figures sell at the same velocity. Structure your initial catalog ratio as follows:

1. **Core High-Velocity Drivers (60% of inventory)**:
   - *Dragon Ball Z/Super*: Ultra Instinct Goku, Super Saiyan Vegeta, Future Trunks.
   - *One Piece*: Gear 5 Luffy, Roronoa Zoro, Trafalgar Law.
   - *Naruto Shippuden*: Sage Mode Naruto, Kakashi Hatake, Itachi Uchiha.
2. **Trending Seasonal Hits (25% of inventory)**:
   - *Demon Slayer*: Tanjiro, Nezuko, Kyojuro Rengoku.
   - *Jujutsu Kaisen*: Satoru Gojo, Sukuna, Megumi Fushiguro.
   - *Solo Leveling*: Sung Jinwoo.
3. **High-Margin Premium Dioramas & Resin Statues (15% of inventory)**:
   - 40cm+ limited resin statues for display counters that command premium pricing (₹8,000 to ₹25,000+ retail).

---

### Step 3: Tax Compliance & GST Invoicing

Operating a legitimate retail business in India requires issuing valid receipts to your customers. Sourcing your inventory through **Shashi Enterprises** ensures every batch comes with a 100% compliant B2B tax invoice containing your business GSTIN, simplifying your monthly GST filings.

---

### Step 4: Storage, Display, and Packaging

Collectibles require careful handling:
- **Display Shelf Presentation**: Keep figures in well-lit acrylic cases or spotlight risers. Displayed figures act as instant eye-catchers in retail stores.
- **Outer Box Integrity**: Anime collectors value mint condition box packaging. Always ship out orders to end-consumers using double-wall corrugated boxes with bubble wrap buffer layers.
    `
  },
  {
    id: 'post-2',
    slug: 'anime-figure-wholesale-moq-pricing-explained',
    title: 'Anime Figure Wholesale MOQ & Tiered Bulk Pricing Explained for New Dealers',
    summary: 'Understand how Minimum Order Quantities (MOQ) and tiered volume discounts work when purchasing anime action figures and resin statues at wholesale trade rates.',
    category: 'Wholesale Trade',
    author: 'Shashi Enterprises Procurement Desk',
    publishedAt: '2026-03-03',
    readTime: '5 min read',
    image: '/hero-resin.jpg',
    keywords: [
      'anime figure wholesale MOQ India',
      'bulk anime figures pricing',
      'B2B anime supplier terms',
      'tiered wholesale pricing anime'
    ],
    content: `
### Demystifying Wholesale Terms for Retail Buyers

If you are transitioning from retail purchasing to B2B wholesale ordering, terms like **MOQ**, **MOV**, and **Tiered Volume Pricing** are critical to maximizing your resale margins.

---

### What is Minimum Order Quantity (MOQ)?

**MOQ (Minimum Order Quantity)** refers to the lowest number of units of a single product SKU you can purchase at wholesale rate. 

At **Shashi Enterprises**, our wholesale MOQ is set at **5 pcs per SKU**. This lower threshold gives new dealers the flexibility to curate a diverse mix of anime series without locking up capital in excessive inventory of a single character.

---

### What is Minimum Order Value (MOV)?

**MOV (Minimum Order Value)** is the minimum total billing amount required for a wholesale order to process. Our standard MOV is **₹6,000 per order**. 

You can combine multiple SKUs across different categories (e.g. 5 pcs Dragon Ball + 5 pcs One Piece + 5 pcs Demon Slayer) to meet the ₹6,000 minimum threshold.

---

### How Volume Tiered Discounts Work

Wholesale pricing rewards volume. The more units you order per SKU, the lower your unit cost becomes:

- **Tier 1 (5–19 Pcs)**: Standard Wholesale B2B Rate (approx 35% margin potential).
- **Tier 2 (20–49 Pcs)**: Super Bulk Rate (approx 42% margin potential).
- **Tier 3 (50+ Pcs Master Carton)**: Direct Importer Master Carton Pricing (up to 50%+ margin potential).

---

### Calculating Your Resale Margins

For example, if a 28cm Grandista Goku figure retails to end-collectors in India for **₹2,499**:
- **Wholesale Cost (Tier 1)**: ₹1,350 / unit
- **Your Gross Margin**: ₹1,149 per unit (85% markup / 46% margin)
- **Input Tax Credit**: Claim full 18% GST back on your monthly GST filings.

This pricing structure empowers Indian retail partners to remain highly competitive online and in brick-and-mortar storefronts.
    `
  },
  {
    id: 'post-3',
    slug: 'gst-invoicing-wholesale-toy-purchases-india',
    title: 'GST Invoicing for Wholesale Toy & Collectible Purchases in India — Retailer Guide',
    summary: 'A complete guide to HSN codes, GST rates, and Input Tax Credit (ITC) claiming for Indian retailers importing and purchasing anime action figures wholesale.',
    category: 'Legal & Tax',
    author: 'Shashi Enterprises Compliance Team',
    publishedAt: '2026-03-05',
    readTime: '4 min read',
    image: '/logo_black_bg.png',
    keywords: [
      'GST invoice wholesale anime figures',
      'toy wholesale HSN code India',
      'B2B input tax credit toys',
      'anime figure GST rate'
    ],
    content: `
### Why GST Compliance Matters for B2B Wholesale

When sourcing inventory for your retail shop or e-commerce business in India, purchasing with proper GST documentation is essential. Buying unbilled goods exposes your business to regulatory risks and deprives you of **Input Tax Credit (ITC)**.

---

### Applicable HSN Codes for Action Figures & Statues

In India, anime collectibles and action figures fall under Chapter 95 of the Harmonized System of Nomenclature (HSN):

- **HSN 9503**: Toys, scale models, and recreational figurines.
- **Standard GST Rate**: 12% or 18% depending on material composition (PVC vs Resin / Electronic components).

---

### How Input Tax Credit (ITC) Saves You Money

When you purchase wholesale inventory from **Shashi Enterprises**, your invoice contains your 15-digit **GSTIN**. 

1. You pay the wholesale amount + applicable GST at checkout.
2. We upload the transaction to GSTN (Form GSTR-1).
3. The tax amount automatically reflects in your **GSTR-2B** portal as Input Tax Credit.
4. When you sell the item to your customer and collect output GST, you offset your tax liability using your GSTR-2B balance.

---

### Checklist for Receiving Wholesale Shipments

When your freight dispatch arrives from our Delhi HQ, verify:
- B2B GST Tax Invoice physically attached to the master carton.
- Matches your registered business name and GSTIN.
- HSN code breakdown and vehicle transport e-Way bill for orders exceeding ₹50,000 in value.
    `
  },
  {
    id: 'post-4',
    slug: 'fastest-moving-anime-figures-indian-retail',
    title: 'Dragon Ball vs One Piece vs Demon Slayer: Which Anime Figures Sell Fastest in Indian Retail?',
    summary: 'Market insights and sales velocity breakdown of top anime franchises across Indian metro cities, tier-2 retail shops, and pop-culture conventions.',
    category: 'Market Trends',
    author: 'Shashi Enterprises Product Strategy',
    publishedAt: '2026-03-07',
    readTime: '5 min read',
    image: '/hero-goku.jpg',
    keywords: [
      'best selling anime figures India',
      'Dragon Ball vs One Piece figures sales',
      'top anime merchandise India',
      'fast moving action figures wholesale'
    ],
    content: `
### Analyzing Sales Velocity Across Franchise Categories

Which anime series should you stock first to maximize turnover? Based on sales telemetry across hundreds of verified Indian dealers, here is a detailed breakdown of market demand:

---

### 1. Dragon Ball Z & Super (The Evergreen Heavyweight)
- **Demand Index**: 10/10
- **Primary Demographic**: Ages 16 to 38.
- **Top Moving Characters**: Goku (Super Saiyan, Ultra Instinct), Vegeta (Majin, Prince), Gohan (Beast), Broly.
- **Retail Velocity**: Instant turnaround. Dragon Ball figures have the highest recall across all Indian regions.

---

### 2. One Piece (The Fastest Growing Franchise)
- **Demand Index**: 9.5/10
- **Primary Demographic**: Ages 14 to 30.
- **Top Moving Characters**: Monkey D. Luffy (Gear 5, Wano), Roronoa Zoro (Three-Sword Style), Sanji, Trafalgar Law.
- **Retail Velocity**: Gear 5 Luffy statues are currently the single highest-searched collectible keyword in tier-1 Indian metros.

---

### 3. Demon Slayer: Kimetsu no Yaiba
- **Demand Index**: 9.0/10
- **Primary Demographic**: Ages 12 to 28.
- **Top Moving Characters**: Tanjiro Kamado, Nezuko Kamado, Kyojuro Rengoku (Flame Hashira), Tengen Uzui.
- **Retail Velocity**: High impulse purchase factor, especially during convention seasons and festival holidays.

---

### 4. Jujutsu Kaisen & New Gen Anime
- **Demand Index**: 8.5/10
- **Top Moving Characters**: Satoru Gojo (Hollow Purple), Ryomen Sukuna, Megumi Fushiguro.
- **Retail Velocity**: Gojo Satoru figures sell out rapidly among college-age buyers and online shoppers.

---

### Summary Recommendation for New Inventory Orders

For balanced sales momentum, allocate your opening inventory mix as:
- **40%** Dragon Ball Z / Super
- **30%** One Piece
- **20%** Demon Slayer & Jujutsu Kaisen
- **10%** Limited Statues & Katanas
    `
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
