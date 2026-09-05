# Architecture, Database Design & Workflow Plan: Shashi Enterprises B2B Platform

This document outlines the complete architectural design, database schema, authentication flow, order tracking lifecycle, notification engine (Email & WhatsApp), and Admin RBAC security system for **Shashi Enterprises**.

---

## 1. System Architecture Overview

```
                      +------------------------------------------+
                      |         Next.js 16 App Router            |
                      |   (Storefront, Admin, API Routes)        |
                      +--------------------+---------------------+
                                           |
                  +------------------------+------------------------+
                  |                        |                        |
        +---------v---------+    +---------v---------+    +---------v---------+
        | Supabase Auth     |    | Supabase Postgres |    | Supabase Storage  |
        | (Google OAuth2)   |    | DB & RLS Security |    | (PNG/JPG/JPEG CDN)|
        +-------------------+    +-------------------+    +-------------------+
                                           |
                                  +--------+--------+
                                  |                 |
                         +--------v-------+ +-------v--------+
                         | Resend Email   | | WhatsApp Cloud |
                         | Notification   | | API Webhooks   |
                         +----------------+ +----------------+
```

---

## 2. Database Schema Specification (PostgreSQL / Supabase)

### 2.1 Enums & Types
```sql
-- Role-based access control enum
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN');

-- Product listing status enum
CREATE TYPE product_status AS ENUM ('ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED');

-- Order status lifecycle pipeline enum
CREATE TYPE order_status AS ENUM (
  'NEW_REQUEST', 
  'QUOTED', 
  'CONFIRMED', 
  'DISPATCHED', 
  'DELIVERED', 
  'CANCELLED'
);
```

### 2.2 Profiles Table (`public.profiles`)
Links directly to Supabase Auth (`auth.users`) to store customer profile and business credentials.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  gstin TEXT,
  city TEXT,
  address TEXT,
  pincode TEXT,
  role user_role DEFAULT 'CUSTOMER' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### 2.3 Products Table (`public.products`)
Stores wholesale anime collectible products, images, dimensions, stock, and pricing.

```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  series TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  short_desc TEXT,
  image_url TEXT NOT NULL,
  gallery_urls TEXT[] DEFAULT '{}',
  retail_reg_price NUMERIC(10,2) NOT NULL,
  retail_sale_price NUMERIC(10,2),
  wholesale_price NUMERIC(10,2) NOT NULL,
  stock_qty INT DEFAULT 0 NOT NULL,
  moq INT DEFAULT 5 NOT NULL,
  height_cm NUMERIC(5,2),
  material TEXT DEFAULT 'PVC/Resin',
  badges TEXT[] DEFAULT '{}',
  show_old_price BOOLEAN DEFAULT TRUE NOT NULL,
  featured BOOLEAN DEFAULT FALSE NOT NULL,
  status product_status DEFAULT 'ACTIVE' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### 2.4 Product Price Tiers (`public.product_price_tiers`)
Manages bulk volume tier discounts per SKU.

```sql
CREATE TABLE public.product_price_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  min_qty INT NOT NULL,
  max_qty INT, -- NULL means infinity (e.g. 50+ pcs)
  price_per_pc NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### 2.5 Orders Table (`public.orders`)
Stores business quote requests and purchase orders.

```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- Format: SE-YYYYMMDD-XXXX (e.g., SE-20260905-4819)
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  business_name TEXT NOT NULL,
  gstin TEXT,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  status order_status DEFAULT 'NEW_REQUEST' NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) DEFAULT 0 NOT NULL,
  shipping_cost NUMERIC(10,2) DEFAULT 0 NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  admin_notes TEXT,
  tracking_courier TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### 2.6 Order Line Items (`public.order_items`)
Freezes product details and unit rates at time of order checkout.

```sql
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_image TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL
);
```

### 2.7 Order Status Tracking Logs (`public.order_status_history`)
Audit trail for every status change made by admin or system.

```sql
CREATE TABLE public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  previous_status order_status,
  new_status order_status NOT NULL,
  note TEXT,
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

---

## 3. Row Level Security (RLS) Policies

To protect customer privacy and restrict catalog modifications to Admins:

1. **Products & Price Tiers**:
   - `SELECT`: Public access for active products (`status = 'ACTIVE'`). Admins can view all.
   - `INSERT / UPDATE / DELETE`: Restricted strictly to users where `profiles.role = 'ADMIN'`.

2. **Orders & Items**:
   - `INSERT`: Anyone (authenticated or guest checkout) can place an order.
   - `SELECT`: Customer can ONLY view their own orders (`customer_email = auth.email()` OR `customer_id = auth.uid()`). Admins can view all orders.
   - `UPDATE`: Restricted strictly to Admins (for status changes and adding tracking numbers).

---

## 4. End-to-End Order Lifecycle & Notifications

```
+-----------------------------------------------------------------------------------+
| 1. CUSTOMER CHECKOUT                                                               |
|    - User submits Cart at /checkout                                              |
|    - System generates unique Order # (e.g. SE-20260905-8942)                      |
|    - Record created in `orders` & `order_items` DB tables                        |
|    - TRIGGER 1: Email (Resend API) + WhatsApp message sent to customer           |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| 2. ADMIN REVIEW & CONFIRMATION                                                    |
|    - Order appears in real-time on /admin/orders                                  |
|    - Admin verifies stock and clicks "Confirm Order"                              |
|    - DB status updates to 'CONFIRMED' / 'QUOTED'                                  |
|    - TRIGGER 2: Secondary Confirmation Email + WhatsApp sent to customer with     |
|      formal invoice & tracking link                                               |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| 3. ORDER DISPATCH & TRACKING                                                      |
|    - Admin enters Courier Name (e.g. BlueDart) & Tracking Number                  |
|    - DB status updates to 'DISPATCHED'                                            |
|    - TRIGGER 3: Dispatch Email + WhatsApp sent with tracking URL                  |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| 4. CUSTOMER TRACKING & SECURITY VERIFICATION                                      |
|    - User visits /track/[orderNumber]                                             |
|    - System prompts Google Auth login if unauthenticated                          |
|    - Security check: Verifies `currentUser.email === order.customerEmail`         |
|      (or `currentUser.role === 'ADMIN'`)                                          |
|    - Access Granted: Displays tracking pipeline, itemization & invoice           |
|    - Access Denied: Displays security restriction warning                         |
+-----------------------------------------------------------------------------------+
```

---

## 5. Google Auth & Admin Setup

1. **Google OAuth 2.0 Integration**:
   - Configure Google Cloud Console Credentials (Client ID & Client Secret).
   - Enable Google Provider in Supabase Auth Dashboard.
   - Attach `<GoogleSignInButton />` on `/login` and `/checkout`.

2. **Admin Email Whitelisting**:
   - Defined via environment variable `ADMIN_EMAILS="enterprisesshashi5@gmail.com"`.
   - On user login, database trigger checks if `new.email IN (ADMIN_EMAILS)`. If true, automatically sets `profiles.role = 'ADMIN'`.

3. **Admin Panel Access**:
   - `/admin/*` routes verify session token + `profiles.role === 'ADMIN'`. Non-admin users are automatically redirected to `/account`.

---

## 6. Implementation Checklist & Dependencies

### New Dependencies to Install
- `@supabase/supabase-js` & `@supabase/ssr` (Database, Auth, Storage)
- `resend` or `nodemailer` (Transactional Emails)
- `twilio` or Interakt API client (WhatsApp Messages)

### Next Steps & Action Plan
- [ ] Initialize Supabase project & execute SQL migration script.
- [ ] Configure Supabase Auth with Google Client ID/Secret.
- [ ] Replace mock stores (`catalog-store.ts`, `cart-store.tsx`) with Supabase SQL client calls.
- [ ] Create Next.js API route `/api/orders/checkout` with Order ID generator & notification triggers.
- [ ] Build `/track/[orderNumber]` page with Google login ownership verification.
- [ ] Update `/admin/catalog` and `/admin/orders` to execute live DB queries.
