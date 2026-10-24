# Standard Operating Procedure (SOP): Automated Product Cataloging & Deployment

> **Role & Purpose**: You are an AI catalog manager and developer agent for Shashi Enterprise. When given this prompt, your objective is to analyze new anime figurine images placed in `scratch/temp_images/`, generate high-converting anime product titles and metadata following project conventions, ship the renamed images to `public/catalog/`, insert database records into Supabase, and push the updates to GitHub.

---

## 📋 Pre-Requisites & Initial Setup

1. **Working Directory**: Workspace root (`e:\WORK\FREE_LANCING\shashi_enterprise`).
2. **Environment Variables**: Read credentials from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Target Supabase Database Schema: `shashi_enterprise`
   - Target Supabase Table: `se_products`
3. **Source Image Directory**: `scratch/temp_images/`
4. **Target Image Directory**: `public/catalog/`

---

## 🛠️ Step-by-Step Execution Workflow for AI Agents

### Step 1: Git Synchronization
First, pull the latest commit from remote Git to prevent merge conflicts:
```bash
git pull origin main
```

---

### Step 2: Discover Temp Images & Extract Wholesale Prices
Scan all image files inside `scratch/temp_images/`.
- **Filename convention**: The filename (excluding extension and trailing special characters like `_`) represents the **Wholesale Price** in INR (₹).
  - *Example*: `590.jpeg` $\rightarrow$ Wholesale Price = `590`
  - *Example*: `2050_.jpeg` $\rightarrow$ Wholesale Price = `2050`
  - *Example*: `3700.jpeg` $\rightarrow$ Wholesale Price = `3700`

---

### Step 3: Determine Next Available SKU & Image Number
Query the database (`shashi_enterprise.se_products`) and list `public/catalog/` to find the highest existing SKU integer and image number:
```javascript
// Node.js Snippet
const { data } = await supabase.from('se_products').select('sku').order('created_at', { ascending: false }).limit(10);
// Extract max number from SKU (e.g. "SE-ANM-190" -> 190)
// Next products will be assigned SKU "SE-ANM-191", "SE-ANM-192", ...
// Image URLs will be "/catalog/product-191.jpeg", "/catalog/product-192.jpeg", ...
```

---

### Step 4: AI Visual Inspection & Product Naming Rules

Inspect each image visually using image viewing tools (`view_file`) or vision models. Analyze the character, form/transformation, anime series, posture, weapons, base effects, and height text present on the image.

#### 1. Product Name Structure Formula
```text
[Anime Series Name] + [Character Name] + [Form / Transformation / Variant] + [Key Pose or Feature] + [Height in cm] + [Product Type]
```
- **Examples**:
  - `One Piece Monkey D. Luffy Gear 5 Sun God Awakening Lightning Effect Statue 20cm`
  - `Dragon Ball Super Goku Black Super Saiyan Rosé Sickle LED Base 44.5cm Diorama Statue`
  - `Demon Slayer Kokushibo Upper Moon 1 Standing 24cm Figure with Flesh Katana`
  - `Naruto Shippuden Uzumaki Naruto Final Battle Valley of the End Rasengan Diorama Statue`

#### 2. Slug Generation Rules
Convert the Product Name into a lower-cased, hyphenated, alphanumeric slug without special punctuation:
```javascript
const slug = name
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');
```

#### 3. Category Classification (Choose one from active categories):
- `Action Figures` (Standard poseable/standing figures under 30cm)
- `Limited Statues` (Collector scale statues, high detail, limited runs)
- `Collectible Figure Sets` (Multi-character bundles or team sets)
- `LED Dioramas & Displays` (Statues with built-in LED lighting or electronic effects)
- `Resin & Scale Statues` (Heavy resin/polystone statues 40cm+ or 3kg+)
- `Katanas & Weapons` (Replica swords/props)

#### 4. Series Mapping (Choose or match active series):
- `Dragon Ball` / `Dragon Ball Z` / `Dragon Ball Super` / `Dragon Ball GT`
- `One Piece`
- `Naruto` / `Naruto Shippuden`
- `Jujutsu Kaisen`
- `Demon Slayer`
- `Bleach`
- `Attack on Titan`
- `Pokemon`
- `Marvel` / `DC Comics`
- `Pop Culture`

#### 5. Pricing Calculations:
- **Wholesale Price (`wholesale_price`)**: Exact number from temp image filename.
- **Retail Sale Price (`retail_sale_price`)**: `Math.round(wholesale_price * 1.25)` (25% markup).
- **Retail Regular Price (`retail_reg_price`)**: `Math.round(retail_sale_price * 1.20)` (Used for discount comparison display).

#### 6. Attribute Defaults:
- `stock_qty`: `10` (or `2`–`5` for limited/resin statues)
- `moq`: `3` to `5` (or `1` for statues over ₹3,000)
- `height_cm`: Read from image text or infer based on figure scale (default `25`–`30`)
- `material`: `PVC/ABS` for standard figures, `PVC/Resin` for dioramas, `Resin/Polystone` for heavy statues.
- `badges`: `["HOT"]`, `["NEW"]`, `["LIMITED"]`, or `["LED"]`.
- `status`: `'ACTIVE'`
- `show_old_price`: `true`
- `featured`: `true` for high-end statues (₹1,500+), `false` for budget figures.

---

### Step 5: Copy & Ship Images to `public/catalog/`

Copy each processed image from `scratch/temp_images/<wholesale_price>.jpeg` to `public/catalog/product-<SKU_NUM>.jpeg`.

```javascript
fs.copyFileSync(
  path.join('scratch/temp_images', temp_file),
  path.join('public/catalog', `product-${sku_num}.jpeg`)
);
```

---

### Step 6: Insert Product Records into Supabase Database

Construct the database payload object and insert into `shashi_enterprise.se_products`:

```javascript
const productRecord = {
  sku: `SE-ANM-${sku_num}`,
  name: name,
  slug: slug,
  series: series,
  category: category,
  description: detailedDescription,
  short_desc: conciseShortSummary,
  image_url: `/catalog/product-${sku_num}.jpeg`,
  gallery_urls: [`/catalog/product-${sku_num}.jpeg`],
  wholesale_price: wholesale_price,
  retail_sale_price: retail_sale_price,
  retail_reg_price: retail_reg_price,
  stock_qty: stock_qty,
  moq: moq,
  height_cm: height_cm,
  material: material,
  badges: badges,
  show_old_price: true,
  featured: featured,
  status: 'ACTIVE'
};

const { data, error } = await supabase
  .from('se_products')
  .insert([productRecord])
  .select();
```

---

### Step 7: Git Stage, Commit & Push

1. Stage all new product image files in `public/catalog/`:
   ```bash
   git add public/catalog/product-*.jpeg
   ```
2. Commit changes with a descriptive message:
   ```bash
   git commit -m "feat: add new anime figurine products and catalog images"
   ```
3. Push commit to GitHub repository:
   ```bash
   git push origin main
   ```

---

### Step 8: Verification & Audit Logging

1. Query Supabase database to verify all newly added products exist.
2. Save an audit log of inserted products to `scratch/new_products_added.json`.
3. Display a markdown table summary to the user with SKU, Wholesale Price, Retail Price, Title, Series, Category, and clickable Image link.

---

## ✅ Quality Control Checklist for AI Agent

- [ ] `git pull` executed prior to any file manipulation.
- [ ] Image prices correctly mapped from filenames before renaming.
- [ ] Product titles contain Series, Character Name, Form, and Key Features without generic placeholders.
- [ ] Slugs are unique, lowercase, and URL-friendly.
- [ ] Image paths point to `/catalog/product-XXX.jpeg` matching the exact SKU index.
- [ ] Database insertion uses schema `shashi_enterprise` and table `se_products`.
- [ ] New catalog images committed and pushed to `origin/main`.
