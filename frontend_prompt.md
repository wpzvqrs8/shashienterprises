# Frontend Build Prompt — "Shashi Wholesale" B2B Anime Collectibles Platform

> **Read this entire document before writing any code.** This is a complete frontend
> specification for a Next.js application. Follow it precisely — the design system,
> page architecture, component behavior, and dummy data are all intentional and
> tested against real reference sites. Do not substitute generic patterns
> (purple‑blue gradients, glassmorphism cards, default shadcn styling left
> unthemed, stock hero illustrations) — the client has explicitly rejected an
> "AI‑generated template" look.

**Before starting:** check this project's skills folder and load the UI/UX skill
provided alongside this prompt. Apply its guidance for design tokens, layout
rigor, and component polish on top of everything specified below — this prompt
defines *what* to build, the skill defines *how* to execute it to a professional
standard.

---

## 1. What this project is

This is the **wholesale (B2B) sister platform** to a live retail anime‑figurine
site. The retail site — **Shashi Enterprises** (`shashienterprises.org`) — sells
premium anime statues and action figures one at a time to individual collectors.
The new site sells the **same catalog** (plus overlapping wholesale‑only SKUs) in
bulk to shop owners, resellers, and distributors. Think: the retail site is the
showroom, this new site is the trade counter behind it.

The client owns both the retail brand and this new wholesale brand. Reuse the
retail brand's visual DNA (name, product photography, category language) but the
wholesale site needs its **own identity, its own color system, and B2B‑specific
UX** — it is not a reskin of the retail site.

This is a **frontend‑only build**. There is no backend in this task — Supabase
will be wired up later by someone else. Your job is to build every screen, every
interaction, and every piece of state as if it were already talking to a real
database, using realistic **mock/dummy data and mock async functions** so the
whole thing behaves correctly and can be demoed today, then swapped for real
Supabase calls later with minimal rework.

---

## 2. Tech stack & hard constraints

- **Next.js** (App Router), TypeScript.
- Styling: Tailwind CSS, using **CSS variables for the design tokens** defined
  in Section 4 (so theming/dark‑mode later is trivial). No component library
  left in its default unthemed state — everything must be restyled to match
  the design system below.
- State: local component state + React Context (or Zustand) for cart/quote
  state and for the mock "catalog store." No real backend calls — build a
  `lib/mock-data.ts` (or `/data` folder) that exports the catalog as typed
  objects, and a `lib/catalog-store.ts` with functions like
  `addProduct()`, `updateProduct()`, `deleteProduct()`, `getProducts()` that
  operate on in‑memory/localStorage state and return Promises with artificial
  latency (300–700ms) — this is what will later become Supabase calls, so
  shape the function signatures like real async DB calls
  (`async function getProducts(filters): Promise<Product[]>`).
- Images: use real image URLs supplied in Section 6 (dummy data) plus
  `placehold.co` / `picsum.photos` fallbacks where noted. Use `next/image`
  everywhere, with explicit width/height or `fill` + a defined aspect‑ratio
  container so nothing shifts on load (no CLS).
- Fonts: **Google Fonts**, loaded via `next/font/google`:
  - **`ZCOOL QingKe HuangYou`** → all headers, hero text, big display numbers,
    section titles, product card names, price call‑outs, the logo wordmark.
  - **`Jaro`** → all body copy, nav links, buttons, form labels, table text,
    badges, footer text — everything that is NOT a header.
  - Set both as CSS variables (`--font-display`, `--font-body`) in the root
    layout and reference them via Tailwind's `fontFamily` theme extension.
    Never fall back to system fonts visibly — provide a sensible fallback
    stack but the intent is these two fonts everywhere.
- **No glassmorphism. No backdrop‑blur panels. No frosted‑glass navbars.**
  No unnecessary `blur()` filters anywhere in the UI (a subtle blur is
  acceptable ONLY inside skeleton loaders' shimmer effect, nowhere else).
  Keep every surface a flat, opaque, intentional color from the palette.
  This must read as a serious B2B trade tool, not a consumer lifestyle app.

---

## 3. Reference sites — what to take from each

You were given (in prior analysis, summarized here) three real sites. Blend
their strongest patterns as follows:

**From `apkastore.in` (WooCommerce wholesale anime site), take:**
- The mega‑menu category structure (Shop by Series + Shop by Category as two
  parallel taxonomies).
- The "Price Summary" box pattern on product detail (MRP vs wholesale/selling
  price vs total) — adapt this into a **tiered wholesale price table**
  (see Section 7.5).
- "Buy Now" placed next to "Add to Cart" on product cards/detail.
- Trust‑badge row (Secure Ordering / Support / Pan‑India Delivery) under the
  hero.
- The persistent "wholesale only" disclaimer strip pinned above the header.

**From `thegiftwholesalers.com` (Shopify wholesale gift site), take:**
- The horizontal scrollable circular category‑icon strip right under the hero
  (Instagram‑story style) — this is the single most distinctive, modern touch
  worth keeping.
- Inline quantity stepper + "ADD" directly on product grid cards (no need to
  open the product page to add to cart) — critical for a bulk‑ordering UX.
- The WhatsApp‑centric contact pattern (a persistent WhatsApp CTA in the nav,
  and a per‑product "Request Bulk Pricing on WhatsApp" deep link, pre‑filled
  with the product name).
- The **quote‑then‑invoice checkout philosophy**: for wholesale, checkout is
  not "pay now" — it's "submit order request → get a formal quote/invoice."
  Model the checkout flow after this (see Section 7.6), but still build a full
  multi‑step UI (it will feed a real payment/invoice backend later).
- The accordion‑style SEO/info blocks instead of a giant wall of homepage
  text.

**From `shashienterprises.org` (the client's live retail site), take:**
- Brand name variants, logo concept, product names/images/categories/prices
  (used as the literal dummy data seed — see Section 6).
- The announcement marquee strip at the very top ("NEW DROPS EVERY WEEK •
  WORLDWIDE SHIPPING AVAILABLE • …") — reuse this pattern but rewrite the
  copy for a wholesale audience (see Section 7.1).
- The testimonial/"Collector's Voices" section — adapt into a **"Trusted by
  Retailers"** section with shop‑owner quotes instead of end‑customer quotes.
- The FAQ accordion content style — rewrite for wholesale (MOQ, GST invoice,
  bulk lead times, dealer onboarding, etc.).

Do not copy any of the three sites' actual color themes — build the new
palette from Section 4.

---

## 4. Design system

### 4.1 Color palette — "Sumi Ink & Ember"

Reject default "AI slop" purple/violet gradients and generic blue SaaS themes
entirely. This palette is warm, inky, and premium — evokes lacquered
collectible display cases and hand‑stamped trade ledgers, not a generic tech
startup.

| Token | Hex | Use |
|---|---|---|
| `--color-ink-950` | `#141218` | Primary background (near‑black warm charcoal, not pure black) |
| `--color-ink-900` | `#1C1A21` | Elevated surface / card background on dark sections |
| `--color-ink-800` | `#28242E` | Borders, dividers on dark surfaces |
| `--color-parchment-50` | `#F7F3EA` | Primary light background (warm off‑white, not stark white) |
| `--color-parchment-100` | `#EFE8D8` | Secondary light surface / alt section background |
| `--color-parchment-300` | `#DCD2B8` | Light‑surface borders/dividers |
| `--color-ember-500` | `#E2632B` | **Primary accent** — CTAs, active nav states, price highlights, sale badges |
| `--color-ember-600` | `#C34F1E` | Ember hover/pressed state |
| `--color-ember-100` | `#FBE3D3` | Ember tint for subtle badges/backgrounds |
| `--color-jade-600` | `#2E6B57` | **Secondary accent** — success states, "In Stock", verified/trust badges, admin "active" states |
| `--color-jade-100` | `#DCEBE4` | Jade tint background |
| `--color-gold-500` | `#C79A2E` | **Tertiary accent** — "Premium"/"Limited Edition"/"Best Seller" badges only, used sparingly |
| `--color-ink-text` | `#1C1A21` | Body text on light backgrounds |
| `--color-parchment-text` | `#F1EAD9` | Body text on dark backgrounds |
| `--color-danger` | `#B8402F` | Errors, "remove", destructive admin actions |
| `--color-muted` | `#8A8375` | Placeholder text, secondary metadata, timestamps |

Usage rule: **the site is predominantly ink‑dark for the public marketing
shell (header, hero, footer) and parchment‑light for content/commerce zones**
(product grids, catalog, forms) — this mirrors the "dark trade‑floor header,
bright well‑lit showroom body" feeling and gives strong visual rhythm instead
of one flat background for the whole page. The admin panel is entirely
parchment‑light with ink‑dark sidebar, for a focused work‑tool feel.

Never use pure `#000000` or pure `#FFFFFF` anywhere — always the warm ink/
parchment values above, including for shadows (use ink‑950 at low opacity for
shadows, never neutral gray).

### 4.2 Typography scale

- Display/H1 (`ZCOOL QingKe HuangYou`): 44–72px desktop, 32–40px mobile,
  tight letter‑spacing (‑0.01em), used for hero headline, big section titles.
- H2/H3 (`ZCOOL QingKe HuangYou`): 28–36px / 22–26px.
- Product card title (`ZCOOL QingKe HuangYou`): 18–20px.
- Body (`Jaro`): 16px base, 14px for secondary/meta text, 13px for table
  cells/badges.
- Buttons/nav (`Jaro`): 14–15px, letter‑spacing +0.02em, uppercase for
  primary CTAs only (not every button).

### 4.3 Spacing, radius, elevation

- 8px base spacing scale (8/16/24/32/48/64/96).
- Border radius: **restrained and consistent** — 6px for buttons/inputs, 10px
  for cards, 14px for large hero/panel containers. No fully‑rounded "pill
  soup"; no 24px+ radii anywhere.
- Elevation via **flat 1px ink‑toned borders + soft warm shadow**
  (`box-shadow: 0 4px 16px rgba(20,18,24,0.12)`), never via blur or glass —
  this is the "professional, not glassmorphic" requirement in practice.

### 4.4 Animation principles — subtle only

- Page/section entrance: fade + 8–12px translate‑up on scroll‑into‑view,
  120–200ms, staggered by ~40ms per grid item max. Use `IntersectionObserver`
  or a lightweight library (Framer Motion is fine) — do not animate on every
  scroll tick, only once per element.
- Hover states: color/border transitions at 150ms ease, buttons get a 2px
  upward translate + shadow lift on hover (not scale‑bounce).
- Product card hover: image does a slow **4% scale** over 400ms (contained by
  `overflow:hidden`), price/CTA row fades in a secondary "Quick Add" bar.
- Category icon strip: native smooth horizontal scroll with momentum, small
  scroll‑snap per item.
- Cart drawer / modals: slide‑in from the right, 220ms ease‑out, with a flat
  scrim (`rgba(20,18,24,0.55)`, no blur) behind it.
- Admin table row actions: no animation beyond a 100ms background fade on
  hover — admin is a work tool, keep it snappy, not decorative.
- **Never** use parallax, auto‑playing carousels that can't be paused,
  infinite marquee that can't be hovered‑paused, or more than one animated
  element competing for attention in the same viewport at once.

### 4.5 Skeleton loaders

Every area that will eventually be populated by a Supabase fetch must have a
matching skeleton state, shown for a simulated 400–900ms on initial mock
fetch (vary randomly per page load so it feels real, not scripted):

- Product grid → skeleton cards: gray‑parchment rounded rect for image
  (matching card aspect ratio exactly), two short bars for title, one short
  bar for price, one pill for the badge slot.
- Product detail → skeleton for gallery + title + price block + description
  paragraph lines.
- Admin table → skeleton rows matching the real row height/column widths
  exactly, 6–8 rows.
- Category strip → skeleton circles + short label bar underneath.
- Use a **shimmer sweep** (subtle diagonal light gradient moving left→right,
  1.4s loop) on a `--color-parchment-300` / `--color-ink-800` base
  (light/dark context respectively) as the only place in the whole UI a soft
  blur/gradient sweep is acceptable.
- Skeletons must reserve the exact final layout space — no layout shift when
  real content swaps in.

---

## 5. Full site map

### Public (storefront) pages
1. **Home `/`** — see Section 7.1
2. **Shop / Catalog `/shop`** — full catalog grid with filters (category,
   franchise/series, price range, in‑stock, sort) + pagination or
   infinite‑scroll load‑more
3. **Category page `/shop/[category]`** — e.g. `/shop/dragon-ball`,
   `/shop/katanas` — same grid, pre‑filtered, with a category hero banner
4. **Product detail `/product/[slug]`** — see Section 7.5
5. **Cart `/cart`**
6. **Quote Request / Checkout `/checkout`** — multi‑step (see 7.6)
7. **Order Submitted / Confirmation `/order-confirmation/[id]`**
8. **About `/about`** — company story, "Trusted by Retailers", trade
   credentials (GSTIN, years in business, cities served)
9. **Become a Dealer / Onboarding `/become-a-dealer`** — a form + info page
   explaining wholesale account requirements (this is B2B — gate real
   pricing behind an account in the real product later; for now show it
   openly with a "Dealer Pricing" badge)
10. **Contact `/contact`** — WhatsApp CTA, form, map/address block
11. **Login / Account `/login`, `/account`** — buyer account with order
    history (mock data), saved addresses, reorder button
12. **Policy pages** `/shipping-policy`, `/refund-policy`, `/privacy-policy`,
    `/terms` — simple content pages, reuse one layout template

### Admin (single email only)
13. **Admin Login `/admin/login`** — separate, minimal, ink‑dark themed
    login screen. Include a visible (but non‑functional for now) note in
    code comments that access must be restricted to one hardcoded admin
    email once Supabase auth is wired in; for the mock version, gate the
    `/admin/*` route group behind a simple mock "logged in as admin"
    context/localStorage flag with a real‑looking login form (email +
    password fields, validation, error state for wrong credentials using a
    hardcoded mock admin email/password combo).
14. **Admin Dashboard `/admin`** — overview cards (total products, low‑stock
    count, pending quote requests, total catalog value) + recent activity
    list — all mock data.
15. **Admin Catalog `/admin/catalog`** — the core requested screen:
    - Data table of every product (image thumb, name, SKU, category, price
      tiers, stock qty, status badge, last updated) with search, category
      filter, sort by column.
    - Row actions: **Edit**, **Duplicate**, **Delete** (with confirm dialog).
    - **"Add Product"** button → opens a full add/edit form (drawer or
      dedicated `/admin/catalog/new` and `/admin/catalog/[id]/edit` pages —
      your choice, but be consistent) with fields: name, slug, SKU,
      category, series/franchise tags, short description, long description,
      images (multi‑upload UI — mock, just show preview thumbnails from
      local file picker), regular price, wholesale tiered prices (see 7.5),
      stock quantity, minimum order quantity, status (draft/active/
      out‑of‑stock/archived), featured toggle, "best seller"/"new"/"limited"
      badge selector.
    - Bulk actions row (select multiple → bulk delete / bulk status change)
      with a sticky action bar that appears when rows are selected.
    - All add/update/delete operations call the mock
      `lib/catalog-store.ts` functions, update local state optimistically,
      show a toast/notification on success or failure, and show the
      skeleton/loading state on the table during the mock async delay.
16. **Admin Orders `/admin/orders`** — table of mock incoming wholesale
    quote requests/orders with status pipeline (New → Quoted → Confirmed →
    Dispatched → Delivered), detail drawer per order.
17. **Admin Settings `/admin/settings`** — store info form (name, logo
    upload, address, contact, GSTIN, minimum order value, policy text) —
    mock only.

Use a persistent **admin shell layout**: fixed left sidebar (ink‑dark,
parchment text) with icon+label nav for Dashboard/Catalog/Orders/Settings,
top bar with admin email + logout, main content area on parchment‑50
background. Sidebar collapses to icon‑only on tablet, becomes a bottom tab
bar or slide‑out drawer on mobile.

---

## 6. Dummy data — use this as the literal seed

Build `lib/mock-data.ts` using this real data pulled from the client's live
retail site (Shashi Enterprises) as the catalog seed, reframed as wholesale
SKUs. Use the real image URLs given below directly in `next/image` (they are
publicly hosted on Wix's CDN and load fine cross‑origin); for any additional
placeholder products you generate to round out the catalog, use
`https://placehold.co/800x800/1C1A21/F7F3EA?text=Product+Name` or
`https://picsum.photos/seed/<unique-slug>/800/800` so every card still has a
distinct image.

### 6.1 Store / brand identity (use in header, footer, about, admin settings)

```json
{
  "storeName": "Shashi Wholesale",
  "legalName": "Shashi Enterprises",
  "tagline": "India's Trade Source for Premium Anime Collectibles",
  "logoUrl": "https://placehold.co/240x80/141218/E2632B?text=SHASHI+WHOLESALE",
  "logoMarkUrl": "https://placehold.co/80x80/141218/E2632B?text=SE",
  "address": "Delhi, India",
  "whatsapp": "+91-8796138389",
  "email": "enterprisesshashi95@gmail.com",
  
  "facebook": "https://www.facebook.com/profile.php?id=61589057115880",
  "instagram": "https://www.instagram.com/shashienterprises5",
  "minimumOrderValue": 15000,
  "minimumOrderNote": "₹15,000 minimum per wholesale order · 5 pcs minimum per SKU",
  "paymentMethods": ["UPI", "Bank Transfer", "Cash on Pickup"],
  "adminEmail": "admin@shashienterprises.org"
}
```

### 6.2 Marquee strip copy (rewrite of the retail site's, for B2B)

```
NEW WHOLESALE DROPS WEEKLY  •  GST INVOICE ON EVERY ORDER  •  PAN‑INDIA DISPATCH  •  BULK PRICING TIERS  •  DEALER ONBOARDING OPEN
```

### 6.3 Categories (Shop by Series + Shop by Type — two taxonomies, mirror apkastore's dual‑nav pattern)

**Shop by Series:**
Dragon Ball, One Piece, Naruto, Attack on Titan, Demon Slayer, Jujutsu
Kaisen, Marvel/DC, Mashle, Ken Jiro

**Shop by Type:**
Limited Statues, Action Figures, Katanas & Weapons, Hot Wheels & Diecast,
Rare Imports, Premium Resin Statues

### 6.4 Product catalog seed (real names/prices/images from the retail site — reframe prices as the *retail comparison* and add a wholesale tier price alongside)

Use these 19 products. For each, treat the given "Sale Price" as the
**retail reference price** shown struck through for context, and invent a
lower **wholesale price** (roughly 45–60% of the retail sale price) plus a
tiered quantity discount, per the pattern in Section 7.5. Suggested wholesale
base prices in parentheses.

| Name | Category | Retail Reg. Price | Retail Sale Price | Suggested Wholesale Price | Image URL |
|---|---|---|---|---|---|
| Ultra Instinct Goku | Dragon Ball / Action Figures | ₹2,199 | ₹1,499 | ₹850 | `https://static.wixstatic.com/media/30f31b_2702e2ec119d4bf29f3da99ae99b1efa~mv2.jpeg/v1/fill/w_980,h_980,al_c,q_85/30f31b_2702e2ec119d4bf29f3da99ae99b1efa~mv2.jpeg` |
| Goku Black in Super Saiyan 3 Rosé Form | Dragon Ball / Limited Statues | ₹2,999 | ₹1,800 | ₹1,050 | `https://placehold.co/800x800/1C1A21/E2632B?text=Goku+Black+Rose` |
| One Piece Shanks 72cm | One Piece / Limited Statues | ₹11,999 | ₹6,000 | ₹3,600 | `https://placehold.co/800x800/1C1A21/C79A2E?text=Shanks+72cm` |
| Dragon Ball Z Goku 35cm | Dragon Ball / Premium Resin Statues | ₹1,999 | ₹850 | ₹520 | `https://placehold.co/800x800/1C1A21/E2632B?text=Goku+35cm` |
| Dragon Ball Z Vegeta (Paper Pulp) | Dragon Ball / Premium Resin Statues | ₹2,499 | ₹1,150 | ₹680 | `https://placehold.co/800x800/1C1A21/E2632B?text=Vegeta+Paper+Pulp` |
| Dragon Ball Vegeta 35cm Pure Paper Pulp | Dragon Ball / Premium Resin Statues | ₹3,599 | ₹1,750 | ₹1,020 | `https://placehold.co/800x800/1C1A21/E2632B?text=Vegeta+35cm` |
| Dragon Ball Z Goku 55cm | Dragon Ball / Limited Statues | ₹6,999 | ₹4,000 | ₹2,300 | `https://placehold.co/800x800/1C1A21/E2632B?text=Goku+55cm` |
| Iron Man 50cm | Marvel/DC / Limited Statues | ₹5,999 | ₹3,200 | ₹1,900 | `https://placehold.co/800x800/1C1A21/C79A2E?text=Iron+Man+50cm` |
| Attack on Titan — Eren Jaeger 35cm | Attack on Titan / Premium Resin Statues | ₹5,999 | ₹2,000 | ₹1,150 | `https://placehold.co/800x800/1C1A21/2E6B57?text=Eren+Jaeger` |
| Roronoa Zoro 40cm | One Piece / Premium Resin Statues | ₹4,999 | ₹1,999 | ₹1,150 | `https://placehold.co/800x800/1C1A21/2E6B57?text=Zoro+40cm` |
| Akaza & Kyojuro Premium Set | Demon Slayer / Limited Statues | ₹6,999 | ₹3,400 | ₹1,950 | `https://placehold.co/800x800/1C1A21/C79A2E?text=Akaza+%26+Kyojuro` |
| Monkey D. Luffy | One Piece / Action Figures | ₹1,799 | ₹900 | ₹520 | `https://placehold.co/800x800/1C1A21/E2632B?text=Monkey+D.+Luffy` |
| Son Goku — Power Pole Master | Dragon Ball / Action Figures | ₹1,199 | ₹299 | ₹180 | `https://placehold.co/800x800/1C1A21/E2632B?text=Goku+Power+Pole` |
| Kakashi Hatake — Copy Ninja | Naruto / Action Figures | ₹2,499 | ₹749 | ₹430 | `https://placehold.co/800x800/1C1A21/2E6B57?text=Kakashi+Hatake` |
| Zenitsu Nichirin Katana (LED) | Demon Slayer / Katanas & Weapons | ₹3,499 | ₹1,800 | ₹1,050 | `https://placehold.co/800x800/1C1A21/C79A2E?text=Zenitsu+Katana` |
| Future Trunks — Super Saiyan Sword | Dragon Ball / Action Figures | ₹1,999 | ₹899 | ₹520 | `https://placehold.co/800x800/1C1A21/E2632B?text=Future+Trunks` |
| Batman Moving Action Figure | Marvel/DC / Action Figures | ₹2,999 | ₹1,799 | ₹1,020 | `https://placehold.co/800x800/1C1A21/2E6B57?text=Batman+Moving` |
| Monkey D. Luffy 5‑Piece Set | One Piece / Action Figures | ₹2,999 | ₹1,999 | ₹1,150 | `https://placehold.co/800x800/1C1A21/E2632B?text=Luffy+5-Piece` |
| Jujutsu Kaisen — Satoru Gojo "Hollow Technique" | Jujutsu Kaisen / Limited Statues | ₹4,999 | ₹3,999 | ₹2,300 | `https://placehold.co/800x800/1C1A21/C79A2E?text=Gojo+Hollow+Technique` |

Add badges to a subset (mirroring the retail site's tags): mark
**Kakashi Hatake, Zenitsu Nichirin Katana, Future Trunks, Batman, Monkey D.
Luffy 5‑Piece** as `"new"`; mark **Gojo Hollow Technique, Ultra Instinct
Goku** as `"bestseller"`; mark **One Piece Shanks 72cm, Akaza & Kyojuro,
Iron Man 50cm** as `"limited"`.

Each mock `Product` object should also include: `sku` (generate e.g.
`SE-DBZ-0142`), `stockQty` (random 20–400), `moq` (5, 10, or 20 depending on
size/price tier), `status` (`active` for all seed products, plus create 2–3
extra `draft` and 1 `out-of-stock` product for admin‑table realism),
`description` (use the retail meta descriptions where given, e.g. Ultra
Instinct Goku's, otherwise write a short 2‑sentence collectible description
in the same voice), `heightCm` where known, `material` (e.g. "Premium PVC/
Resin"), and `createdAt`.

### 6.5 Testimonials → "Trusted by Retailers" section

Adapt the retail testimonials into dealer‑voice quotes, e.g.:

- *"We've been reordering from Shashi every festive season since 2023 — the
  Dragon Ball line moves fastest on our shelves."* — **Vikram T., Toy World, Karol Bagh**
- *"GST invoice on every order made onboarding painless for our accounts
  team."* — **Anita R., Collectible Corner, Pune**
- *"Packaging survives the Delhi‑to‑Guwahati run every time — zero breakage
  in 40+ cartons."* — **Ramesh D., Anime Junction, Guwahati**

### 6.6 FAQ (wholesale‑reframed, accordion style)

- What is the minimum order value? → ₹15,000 per order, 5 pcs minimum per SKU.
- Do you provide a GST invoice? → Yes, on every wholesale order.
- What are your payment terms? → UPI / bank transfer at order confirmation;
  cash accepted on pickup orders only.
- How is bulk pricing calculated? → Tiered by quantity — see the price table
  on each product page.
- How long does dispatch take? → 2–4 business days after payment
  confirmation, pan‑India.
- Can I become a listed dealer? → Yes, via the Become a Dealer page; accounts
  are verified before wholesale pricing is unlocked.

---

## 7. Page‑by‑page component specs

### 7.1 Home page

Order of sections, top to bottom:

1. **Marquee strip** (ink‑950 bg, ember text, scrolling left, pause on
   hover) — copy from 6.2.
2. **Header** (sticky) — logo left, primary nav center/left (Home, Shop
   ▾ mega‑menu, Categories ▾, About, Become a Dealer, Contact), right side:
   search icon (expands to inline search field), WhatsApp icon button
   (ember‑filled, links to wa.me), Account icon, Cart icon with live item
   count badge. Mega‑menu on "Shop" hover/click shows the dual taxonomy from
   6.3 in two columns plus a small featured‑product tile.
3. **Hero** — full‑bleed ink‑950 background, large ZCOOL headline (e.g. "The
   Trade Source for Premium Anime Collectibles"), one line of Jaro subcopy
   about GST invoicing / pan‑India dispatch / dealer pricing, two CTAs:
   "Browse Wholesale Catalog" (ember filled) and "Become a Dealer" (outline,
   parchment border). Right side or background: one of the product images
   from 6.4 large and dramatically lit, NOT a generic stock illustration.
4. **Category icon strip** — horizontal scroll, circular thumbnails per
   category from 6.3 (mix series + type), label under each, ember ring on
   hover.
5. **Trust badge row** — 3–4 items with icon + short label: "GST Invoice on
   Every Order", "Pan‑India Dispatch", "Tiered Wholesale Pricing", "Dealer
   Support on WhatsApp". Flat cards, parchment‑100 background, jade icon
   accents.
6. **"New Wholesale Drops"** — product grid, 8 items, badge = "new" filtered
   from 6.4, "View All" link to `/shop?sort=newest`.
7. **Featured/promo banner** — one big ink‑dark panel, ZCOOL headline
   ("Limited Statues — Order Before They're Gone"), ember CTA, adapted from
   the retail site's "Exclusive Limited Edition Drops" block.
8. **Best sellers grid** — 4–8 items filtered by `bestseller` badge.
9. **"Trusted by Retailers"** — 3‑card testimonial row from 6.5, star
   ratings in gold‑500.
10. **FAQ accordion** — from 6.6.
11. **Newsletter/dealer‑updates signup** — email field + subscribe, ember
    button, parchment‑100 background band.
12. **Footer** — 4‑column: Brand (logo, address, GSTIN, socials), Shop
    (category links), Company (About, Become a Dealer, Contact, Policies),
    Contact block (WhatsApp button, email, phone). Bottom bar: copyright +
    payment method icons row.

### 7.2 Shop / Catalog page

- Left sidebar (collapsible drawer on mobile/tablet): filters — Category
  checkboxes, Series checkboxes, price range slider, "In Stock Only"
  toggle, badge filter (New/Best Seller/Limited).
- Top bar: result count, sort dropdown (Recommended, Price Low‑High,
  Price High‑Low, Newest), active filter chips with individual remove‑X,
  "Clear All".
- Main: responsive product grid — 4 columns desktop, 3 tablet, 2 mobile
  (never 1 column even on small phones — keep it a grid, tighten card
  padding instead).
- Pagination or "Load More" button at the bottom with the skeleton‑card
  loading pattern while more items load.
- Empty state (no results matching filters): illustration‑free, ink‑50 icon
  + message + "Clear Filters" button — keep it simple, no cutesy graphics.

### 7.3 Product card (the highest‑priority component — must look sharp)

Structure, top to bottom:
- Image container, fixed 1:1 aspect ratio, parchment‑100 background behind
  transparent‑ish product photos, subtle inset border. Badge chip
  (top‑left, ember/gold/jade depending on type) absolutely positioned over
  the image. Wishlist/heart icon top‑right, appears on hover on
  desktop, always visible on touch devices.
- On hover (desktop only): image scales 4%, a secondary bar slides up from
  the bottom of the image area with a quick quantity stepper + "Add" button
  (the giftwholesalers.com pattern) so bulk buyers never need to open the
  PDP just to add more units.
- Below image: category/series eyebrow label (small, muted, uppercase,
  Jaro), product name (ZCOOL, 2‑line clamp), then a **price block**: retail
  reference price struck through in muted gray + wholesale price large in
  ember, plus a small "/pc" unit label and MOQ note ("MOQ 5 pcs") in muted
  text.
- Card border: 1px ink‑800/parchment‑300 depending on section background;
  radius 10px; shadow only on hover (soft warm shadow, lift 2px).
- On mobile/touch: no hover state needed — show the quantity stepper +
  price permanently below the name, keep it thumb‑friendly (44px min tap
  targets).

### 7.4 Category page

Same grid as Shop, but with a category‑specific hero band (shorter than
homepage hero) — category name in ZCOOL, one‑line description, background
tinted from that category's accent color family, breadcrumb (Home / Shop /
[Category]) above it.

### 7.5 Product detail page

- Two‑column desktop layout (stacks on mobile): left = image gallery
  (main image + thumbnail rail, click‑to‑swap, subtle zoom‑on‑hover for
  the main image, no lightbox needed but nice to have), right = info panel.
- Info panel: breadcrumb, category/series tag, ZCOOL product title, star
  rating placeholder (mock, e.g. "4.8 · 32 dealer reviews"), SKU + stock
  status pill (Jade "In Stock — 240 units" / Danger "Out of Stock").
- **Wholesale price tier table** (core B2B feature, styled as a clean
  bordered table, not a card):

  | Quantity | Price / pc |
  |---|---|
  | 5–19 pcs | ₹850 |
  | 20–49 pcs | ₹780 |
  | 50+ pcs | ₹700 |

  Retail reference price shown struck‑through above the table
  ("Retail price: ~~₹1,499~~ — your wholesale rate below").
- Quantity stepper respecting MOQ (can't go below MOQ, shows a note if
  user tries), live‑updating line total as they change quantity, "Add to
  Cart" (ember filled, primary) and "Add to Quote & WhatsApp Now" (outline,
  opens `wa.me` deep link pre‑filled with product name + qty — mirror
  thegiftwholesalers.com pattern) side by side.
- Specs list: Height, Material, Category, Series, SKU — simple label/value
  rows.
- Tabs or accordion: Description, Shipping & Packaging, Bulk Order Notes.
- Related products carousel at the bottom (same series or category, 4–6
  items using the same product card component).

### 7.6 Cart page

- Line items: thumbnail, name, unit wholesale price, editable quantity
  stepper (respecting MOQ), line total, remove button.
- Order summary panel (sticky on desktop): subtotal, "Minimum order value:
  ₹15,000" progress indicator (shows how much more is needed if under
  threshold, disables checkout button until met — a genuinely useful B2B
  touch), estimated packing/shipping note ("calculated after order
  review"), "Proceed to Checkout" CTA.
- Empty cart state: simple message + "Browse Catalog" CTA.

### 7.7 Checkout — "Quote Request" flow (multi‑step, not instant payment)

Model this after `thegiftwholesalers.com`'s real philosophy: wholesale
checkout is a **request**, reviewed and invoiced manually, not an instant
card payment. Build it as a clear 3‑step flow with a step indicator at top:

- **Step 1 — Business Details:** business/shop name, contact person, phone,
  email, GSTIN (optional field), delivery address, city, pincode.
- **Step 2 — Review Order:** line‑item summary (read‑only), subtotal, note
  "Final total including packing & shipping will be shared with you on
  WhatsApp/email within 24 hours for confirmation before payment."
- **Step 3 — Submit:** payment method preference (UPI / Bank Transfer / Pay
  on Pickup — radio selection, no actual payment collected here), terms
  checkbox, "Submit Order Request" button.
- On submit (mock): loading state → redirect to
  `/order-confirmation/[id]` showing an order reference number, a summary,
  and "We'll send your formal quote via WhatsApp/email within 24 hours" +
  a WhatsApp CTA button to follow up immediately.

### 7.8 Admin catalog table + form

- Table columns: checkbox, thumbnail, Name (+SKU below in muted small
  text), Category, Wholesale Price (base tier), Stock, Status badge (Active
  = jade, Draft = muted/gray, Out of Stock = danger, Archived = ink‑800),
  Updated date, actions (Edit pencil icon, Delete trash icon — trash opens
  a confirm dialog: "Delete [Product Name]? This cannot be undone." with
  Cancel/Delete buttons).
- Search bar (filters by name/SKU live), category dropdown filter, status
  filter tabs (All / Active / Draft / Out of Stock / Archived) as a
  segmented control above the table.
- "+ Add Product" button top‑right, ember filled.
- Add/Edit form: organized in clear sections (Basic Info, Pricing &
  Inventory, Images, Wholesale Price Tiers — repeatable rows with an "Add
  Tier" button, Description, Status & Badges). Validate required fields
  inline (name, category, base price, stock qty). Save button shows a
  loading spinner during the mock async delay, then a success toast and
  redirect back to the table with the new/updated row visibly highlighted
  briefly (soft ember flash fading over 1.5s) so the admin can see exactly
  what changed.
- All destructive/mutating actions must optimistically update the UI, then
  reconcile with the mock store's response — this matches how it'll behave
  once real Supabase calls replace the mock functions.

---

## 8. Responsiveness — must be flawless on every device

This is explicitly required, not optional polish. Build and verify against
all of the following before considering any page "done":

- **Breakpoints:** mobile (< 480px), large mobile (480–767px), tablet
  (768–1023px), laptop (1024–1439px), desktop (1440px+). Use Tailwind's
  default breakpoints (`sm md lg xl 2xl`) consistently — do not invent
  one‑off pixel breakpoints per component.
- **No horizontal scroll** anywhere except intentionally scrollable strips
  (category icon strip, admin tables on small screens which should scroll
  within a contained wrapper, never break the page layout).
- **Touch targets** minimum 44×44px on all interactive elements on
  touch‑capable breakpoints (buttons, stepper +/‑, icons).
- **Navigation:** desktop = full horizontal nav + mega‑menu; tablet =
  condensed nav, mega‑menu becomes a simpler dropdown; mobile = hamburger
  → full‑screen or slide‑in nav drawer with accordion‑style category
  expansion, search and account/cart icons remain visible in the mobile
  header bar.
- **Grids reflow, never crush:** product grid 4→3→2 columns as described in
  7.2; never let card content overflow, truncate with ellipsis + line‑clamp
  rather than letting text break layout.
- **Images:** always served via `next/image` with responsive `sizes` set
  correctly per breakpoint so mobile doesn't download desktop‑sized
  images.
- **Typography scales fluidly:** use `clamp()` for hero/display headings so
  they scale smoothly between breakpoints instead of jumping.
- **Sticky elements** (header, cart summary panel) must not overlap content
  or eat excessive viewport height on short mobile screens — collapse
  sticky cart summary into a bottom sheet/bar on mobile instead of a
  sidebar.
- **Forms** (checkout, admin add/edit) stack to single column below tablet,
  inputs full‑width, labels always visible (never placeholder‑only labels).
- **Admin sidebar** becomes a bottom tab bar or a hamburger‑triggered
  drawer below `lg` breakpoint — never squeeze the full sidebar onto a
  phone screen.
- **Test orientation changes and safe‑area insets** on mobile (respect
  `env(safe-area-inset-*)` for any fixed bottom bars, since this may be
  installed as a PWA/home‑screen app later similar to the reference sites).
- **No layout shift (CLS):** every image, skeleton, and dynamically loaded
  block must reserve its final size up front.
- Do a final pass checking the site at exactly 320px, 375px, 768px, 1024px,
  1440px, and 1920px widths — nothing should clip, overlap, or require
  horizontal scrolling at any of these.

---

## 9. Accessibility & quality baseline

- Semantic HTML throughout (`nav`, `main`, `header`, `footer`, `button` vs
  `div` with onClick, real `<table>` for admin data grids).
- All interactive elements keyboard‑navigable with visible focus states
  (ember‑colored 2px focus ring, never removed via `outline:none` without a
  replacement).
- Color contrast: verify ember‑on‑ink and ink‑text‑on‑parchment combinations
  meet at least AA contrast for body text.
- Alt text on every product image using the product name.
- Form inputs have associated `<label>` elements, not placeholder‑only.
- Loading and empty states for every async area (never a blank white gap).

---

## 10. Deliverable structure

Organize the codebase clearly:

```
/app
  /(storefront)
    page.tsx                    → home
    /shop/page.tsx
    /shop/[category]/page.tsx
    /product/[slug]/page.tsx
    /cart/page.tsx
    /checkout/page.tsx
    /order-confirmation/[id]/page.tsx
    /about/page.tsx
    /become-a-dealer/page.tsx
    /contact/page.tsx
    /login/page.tsx
    /account/page.tsx
    /shipping-policy/page.tsx  (+ refund/privacy/terms siblings)
  /admin
    /login/page.tsx
    layout.tsx                 → admin shell (sidebar + topbar), gated
    page.tsx                   → dashboard
    /catalog/page.tsx
    /catalog/new/page.tsx
    /catalog/[id]/edit/page.tsx
    /orders/page.tsx
    /settings/page.tsx
/components
  /ui                          → buttons, inputs, badges, skeletons, etc.
  /storefront                  → header, footer, product-card, mega-menu,
                                  category-strip, price-tier-table, etc.
  /admin                       → sidebar, data-table, product-form, etc.
/lib
  mock-data.ts                 → seeded catalog, categories, testimonials,
                                  FAQ, store settings (Section 6)
  catalog-store.ts             → mock async CRUD functions
  types.ts                     → Product, Category, Order, StoreSettings types
/styles / tailwind config      → design tokens from Section 4
```

Ship this as a working Next.js app: every page listed in Section 5 must
exist and be reachable via the nav/links, populated with the dummy data
from Section 6, fully responsive per Section 8, with the admin catalog CRUD
functioning end‑to‑end against the mock store (add a product → see it
appear in the table and the public shop grid; edit → see changes reflected;
delete → confirm dialog then removal from both).