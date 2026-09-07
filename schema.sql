-- ====================================================================
-- SHASHI ENTERPRISES B2B PLATFORM — COMPLETE FRESH DATABASE SETUP SCRIPT
-- Target Database: PostgreSQL / Supabase
-- Anti-Collision Protection: Isolated schema 'shashi_enterprise' & prefix 'se_'
-- ====================================================================

-- 1. Create Dedicated Isolated Schema
CREATE SCHEMA IF NOT EXISTS shashi_enterprise;
SET search_path TO shashi_enterprise, public;

-- Grant schema access permissions for Supabase APIs
GRANT USAGE ON SCHEMA shashi_enterprise TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA shashi_enterprise GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA shashi_enterprise GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA shashi_enterprise GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- 2. CLEANUP EXISTING TABLES & VIEWS (WIPE ALL DUMMY DATA & RESTART FRESH 0-0)
DROP TABLE IF EXISTS shashi_enterprise.se_order_status_history CASCADE;
DROP TABLE IF EXISTS shashi_enterprise.se_order_items CASCADE;
DROP TABLE IF EXISTS shashi_enterprise.se_orders CASCADE;
DROP TABLE IF EXISTS shashi_enterprise.se_product_price_tiers CASCADE;
DROP TABLE IF EXISTS shashi_enterprise.se_products CASCADE;
DROP TABLE IF EXISTS shashi_enterprise.se_store_settings CASCADE;
DROP TABLE IF EXISTS shashi_enterprise.se_profiles CASCADE;

-- 3. Define Custom Types & Enums in shashi_enterprise schema
DO $$ BEGIN
  CREATE TYPE shashi_enterprise.user_role AS ENUM ('CUSTOMER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE shashi_enterprise.product_status AS ENUM ('ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE shashi_enterprise.order_status AS ENUM ('NEW_REQUEST', 'QUOTED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ====================================================================
-- TABLE 1: Customer & Admin Profiles (Synced with Google OAuth)
-- ====================================================================
CREATE TABLE shashi_enterprise.se_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  gstin TEXT,
  city TEXT,
  address TEXT,
  pincode TEXT,
  role shashi_enterprise.user_role DEFAULT 'CUSTOMER'::shashi_enterprise.user_role NOT NULL,
  auth_provider TEXT DEFAULT 'google' NOT NULL,
  google_id TEXT,
  is_email_verified BOOLEAN DEFAULT TRUE NOT NULL,
  avatar_url TEXT,
  last_login_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- TABLE 2: Wholesale Products Catalog (0-0 Fresh State)
-- ====================================================================
CREATE TABLE shashi_enterprise.se_products (
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
  status shashi_enterprise.product_status DEFAULT 'ACTIVE'::shashi_enterprise.product_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- TABLE 3: Wholesale Tier Discounts
-- ====================================================================
CREATE TABLE shashi_enterprise.se_product_price_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES shashi_enterprise.se_products(id) ON DELETE CASCADE NOT NULL,
  min_qty INT NOT NULL,
  max_qty INT,
  price_per_pc NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- TABLE 4: B2B Orders
-- ====================================================================
CREATE TABLE shashi_enterprise.se_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE,
  customer_id UUID REFERENCES shashi_enterprise.se_profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  business_name TEXT NOT NULL,
  gstin TEXT,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  payment_preference TEXT DEFAULT 'UPI' NOT NULL,
  status shashi_enterprise.order_status DEFAULT 'NEW_REQUEST'::shashi_enterprise.order_status NOT NULL,
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

-- ====================================================================
-- TABLE 5: Order Line Items
-- ====================================================================
CREATE TABLE shashi_enterprise.se_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES shashi_enterprise.se_orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES shashi_enterprise.se_products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_image TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL
);

-- ====================================================================
-- TABLE 6: Order Status Audit History
-- ====================================================================
CREATE TABLE shashi_enterprise.se_order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES shashi_enterprise.se_orders(id) ON DELETE CASCADE NOT NULL,
  previous_status shashi_enterprise.order_status,
  new_status shashi_enterprise.order_status NOT NULL,
  note TEXT,
  updated_by UUID REFERENCES shashi_enterprise.se_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- TABLE 7: Store Settings & Variables
-- ====================================================================
CREATE TABLE shashi_enterprise.se_store_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  store_name TEXT DEFAULT 'Shashi Enterprises' NOT NULL,
  legal_name TEXT DEFAULT 'Shashi Enterprises' NOT NULL,
  tagline TEXT DEFAULT 'India''s Trade Source for Premium Anime Collectibles' NOT NULL,
  logo_url TEXT DEFAULT '/logo_black_bg.png' NOT NULL,
  logo_mark_url TEXT DEFAULT '/logo_black_bg.png' NOT NULL,
  address TEXT DEFAULT 'Delhi, India' NOT NULL,
  whatsapp TEXT DEFAULT '+91-8796138389' NOT NULL,
  email TEXT DEFAULT 'enterprisesshashi95@gmail.com' NOT NULL,
  gstin TEXT DEFAULT '',
  facebook TEXT DEFAULT 'https://www.facebook.com/profile.php?id=61589057115880',
  instagram TEXT DEFAULT 'https://www.instagram.com/shashienterprises5',
  minimum_order_value NUMERIC(10,2) DEFAULT 15000 NOT NULL,
  minimum_order_note TEXT DEFAULT '₹15,000 minimum per wholesale order · 5 pcs minimum per SKU' NOT NULL,
  payment_methods JSONB DEFAULT '["UPI", "Bank Transfer", "Cash on Pickup"]'::jsonb NOT NULL,
  admin_email TEXT DEFAULT 'enterprisesshashi95@gmail.com' NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

INSERT INTO shashi_enterprise.se_store_settings (id, admin_email) VALUES (1, 'enterprisesshashi95@gmail.com');

-- ====================================================================
-- AUTOMATIC ALPHANUMERIC ORDER NUMBER GENERATOR TRIGGER
-- ====================================================================
CREATE OR REPLACE FUNCTION shashi_enterprise.generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := '';
  i INT;
  year_str TEXT;
  candidate_number TEXT;
BEGIN
  IF NEW.order_number IS NULL THEN
    year_str := to_char(NOW(), 'YYYY');
    LOOP
      code := '';
      FOR i IN 1..8 LOOP
        code := code || substr(chars, floor(random() * 32 + 1)::int, 1);
      END LOOP;
      candidate_number := 'SE-' || year_str || '-' || code;
      EXIT WHEN NOT EXISTS (SELECT 1 FROM shashi_enterprise.se_orders WHERE order_number = candidate_number);
    END LOOP;
    NEW.order_number := candidate_number;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_number BEFORE INSERT ON shashi_enterprise.se_orders FOR EACH ROW EXECUTE FUNCTION shashi_enterprise.generate_order_number();

-- ====================================================================
-- AUTOMATIC GOOGLE OAUTH USER PROFILE SYNC
-- ====================================================================
CREATE OR REPLACE FUNCTION shashi_enterprise.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO shashi_enterprise.se_profiles (id, email, full_name, avatar_url, auth_provider, is_email_verified, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Valued Customer'),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_app_meta_data->>'provider', 'google'),
    TRUE,
    CASE WHEN NEW.email IN ('enterprisesshashi95@gmail.com', 'wpzvqrs8@gmail.com') THEN 'ADMIN'::shashi_enterprise.user_role ELSE 'CUSTOMER'::shashi_enterprise.user_role END
  ) ON CONFLICT (id) DO UPDATE SET last_login_at = NOW(), updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION shashi_enterprise.handle_new_user();

-- ====================================================================
-- GRANTS & RLS POLICIES FOR SHASHI_ENTERPRISE SCHEMA
-- ====================================================================
GRANT ALL ON ALL TABLES IN SCHEMA shashi_enterprise TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA shashi_enterprise TO anon, authenticated, service_role;

ALTER TABLE shashi_enterprise.se_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shashi_enterprise.se_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shashi_enterprise.se_product_price_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shashi_enterprise.se_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shashi_enterprise.se_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shashi_enterprise.se_store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Products" ON shashi_enterprise.se_products FOR SELECT USING (true);
CREATE POLICY "Public Insert Products" ON shashi_enterprise.se_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON shashi_enterprise.se_products FOR UPDATE USING (true);
CREATE POLICY "Public Delete Products" ON shashi_enterprise.se_products FOR DELETE USING (true);

CREATE POLICY "Public Read Tiers" ON shashi_enterprise.se_product_price_tiers FOR SELECT USING (true);
CREATE POLICY "Public Insert Tiers" ON shashi_enterprise.se_product_price_tiers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Tiers" ON shashi_enterprise.se_product_price_tiers FOR UPDATE USING (true);
CREATE POLICY "Public Delete Tiers" ON shashi_enterprise.se_product_price_tiers FOR DELETE USING (true);

CREATE POLICY "Public Read Orders" ON shashi_enterprise.se_orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON shashi_enterprise.se_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Orders" ON shashi_enterprise.se_orders FOR UPDATE USING (true);
CREATE POLICY "Public Delete Orders" ON shashi_enterprise.se_orders FOR DELETE USING (true);

CREATE POLICY "Public Read Order Items" ON shashi_enterprise.se_order_items FOR SELECT USING (true);
CREATE POLICY "Public Insert Order Items" ON shashi_enterprise.se_order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Store Settings" ON shashi_enterprise.se_store_settings FOR SELECT USING (true);
CREATE POLICY "Public Update Store Settings" ON shashi_enterprise.se_store_settings FOR UPDATE USING (true);

CREATE POLICY "Public Read Profiles" ON shashi_enterprise.se_profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert Profiles" ON shashi_enterprise.se_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Profiles" ON shashi_enterprise.se_profiles FOR UPDATE USING (true);
