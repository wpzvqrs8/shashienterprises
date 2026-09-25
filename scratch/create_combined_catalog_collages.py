import os
import sys
import json
import base64
import io
import math
import urllib.request
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_PATH = os.path.join(WORKSPACE_DIR, ".env.local")
load_dotenv(dotenv_path=ENV_PATH)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://vzcarcbjzbaosviuepvb.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SCHEMA_NAME = "shashi_enterprise"

OUTPUT_COLLAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "collages"))
os.makedirs(OUTPUT_COLLAGE_DIR, exist_ok=True)

# Try loading Supabase client
try:
    from supabase import create_client, ClientOptions
except ImportError:
    print("Error: supabase package not found.")
    sys.exit(1)

# -----------------------------------------------------------------------------
# Fetch All Products
# -----------------------------------------------------------------------------
def fetch_all_products():
    print(f"[*] Connecting to Supabase (Schema: '{SCHEMA_NAME}')...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(schema=SCHEMA_NAME))
    res = supabase.from_("se_products").select("id, sku, name, image_url, category, series").order("sku").execute()
    products = res.data or []
    print(f"[+] Retrieved {len(products)} products from database.")
    return products

# -----------------------------------------------------------------------------
# Load Image to PIL Object (Handles Base64, Local Paths, HTTP URLs)
# -----------------------------------------------------------------------------
def load_product_pil_image(image_url: str, sku: str) -> Image.Image:
    """Loads any image reference into a clean RGB PIL Image."""
    if not image_url:
        return None

    # Handle Base64 URIs
    if image_url.startswith("data:"):
        try:
            header, encoded = image_url.split(",", 1) if "," in image_url else ("", image_url)
            img_bytes = base64.b64decode(encoded)
            img = Image.open(io.BytesIO(img_bytes))
            return img.convert("RGB")
        except Exception as e:
            print(f"    [-] Error decoding base64 image for {sku}: {e}")
            return None

    # Handle Local Relative Paths
    clean_path = image_url.lstrip("/")
    local_public_path = os.path.join(WORKSPACE_DIR, "public", clean_path)
    if os.path.exists(local_public_path):
        try:
            return Image.open(local_public_path).convert("RGB")
        except Exception as e:
            print(f"    [-] Error opening local file {local_public_path}: {e}")

    local_root_path = os.path.join(WORKSPACE_DIR, clean_path)
    if os.path.exists(local_root_path):
        try:
            return Image.open(local_root_path).convert("RGB")
        except Exception as e:
            print(f"    [-] Error opening root file {local_root_path}: {e}")

    # Handle Remote HTTP URLs
    if image_url.startswith("http://") or image_url.startswith("https://"):
        try:
            req = urllib.request.Request(image_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req) as resp:
                img_bytes = resp.read()
                return Image.open(io.BytesIO(img_bytes)).convert("RGB")
        except Exception as e:
            print(f"    [-] Error downloading HTTP image for {sku}: {e}")

    return None

# -----------------------------------------------------------------------------
# Create 10-Image High Clarity Grid Collage
# -----------------------------------------------------------------------------
def create_grid_collage(product_batch: list, batch_index: int) -> tuple:
    """
    Combines 10 product images into a single ultra-clear grid image (2 rows x 5 cols).
    Cell size: 700x700 px -> Total Grid resolution: 3600 x 1600 px
    """
    cols = 5
    rows = 2
    cell_w = 700
    cell_h = 700
    padding = 20
    header_h = 100
    footer_text_h = 70

    grid_w = cols * cell_w + (cols + 1) * padding
    grid_h = header_h + rows * cell_h + (rows + 1) * padding

    # High-contrast clean background (Light Gray / White)
    bg_color = (248, 249, 250)
    card_bg = (255, 255, 255)
    border_color = (220, 224, 230)
    text_color = (15, 23, 42)
    accent_color = (37, 99, 235)

    collage_img = Image.new("RGB", (grid_w, grid_h), bg_color)
    draw = ImageDraw.Draw(collage_img)

    # Try loading a clean font, or default
    try:
        font_title = ImageFont.truetype("arial.ttf", 36)
        font_label = ImageFont.truetype("arial.ttf", 22)
        font_sub = ImageFont.truetype("arial.ttf", 18)
    except IOError:
        font_title = ImageFont.load_default()
        font_label = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    # Draw Top Header Banner
    header_title = f"CATALOG PRODUCTS BATCH #{batch_index:02d} (Items {(batch_index-1)*10 + 1} to {(batch_index-1)*10 + len(product_batch)})"
    draw.rectangle([(0, 0), (grid_w, header_h)], fill=(15, 23, 42))
    draw.text((padding * 2, 30), header_title, fill=(255, 255, 255), font=font_title)

    manifest_entries = []

    for i, prod in enumerate(product_batch):
        r = i // cols
        c = i % cols

        x0 = padding + c * (cell_w + padding)
        y0 = header_h + padding + r * (cell_h + padding)
        x1 = x0 + cell_w
        y1 = y0 + cell_h

        # Draw card container with subtle shadow border
        draw.rectangle([(x0, y0), (x1, y1)], fill=card_bg, outline=border_color, width=3)

        sku = prod.get("sku", f"ITEM-{i+1}")
        name = prod.get("name", "Product")
        img_url = prod.get("image_url", "")
        global_idx = (batch_index - 1) * 10 + i + 1

        manifest_entries.append({
            "global_index": global_idx,
            "grid_position": f"Row {r+1}, Col {c+1}",
            "sku": sku,
            "name": name,
            "id": prod.get("id")
        })

        # Load product PIL image
        pil_img = load_product_pil_image(img_url, sku)

        # Image area inside cell
        img_area_w = cell_w - 30
        img_area_h = cell_h - footer_text_h - 30
        img_x = x0 + 15
        img_y = y0 + 15

        if pil_img:
            # Resize keeping aspect ratio for maximum clarity
            pil_img.thumbnail((img_area_w, img_area_h), Image.Resampling.LANCZOS)
            iw, ih = pil_img.size

            # Center image in card area
            paste_x = img_x + (img_area_w - iw) // 2
            paste_y = img_y + (img_area_h - ih) // 2

            collage_img.paste(pil_img, (paste_x, paste_y))
        else:
            # Placeholder text if image missing
            draw.rectangle([(img_x, img_y), (img_x + img_area_w, img_y + img_area_h)], fill=(241, 245, 249))
            draw.text((img_x + 50, img_y + 100), "[IMAGE MISSING]", fill=(148, 163, 184), font=font_label)

        # Draw card header badge (e.g. #1 SE-ANM-001)
        badge_text = f"#{global_idx} | {sku}"
        draw.rectangle([(x0 + 10, y0 + 10), (x0 + 260, y0 + 45)], fill=accent_color)
        draw.text((x0 + 20, y0 + 15), badge_text, fill=(255, 255, 255), font=font_label)

        # Draw card footer label (Product Name truncated nicely)
        footer_top = y1 - footer_text_h
        draw.rectangle([(x0 + 3, footer_top), (x1 - 3, y1 - 3)], fill=(248, 250, 252), outline=border_color, width=1)
        
        display_name = name if len(name) <= 42 else name[:40] + "..."
        draw.text((x0 + 15, footer_top + 15), display_name, fill=text_color, font=font_sub)

    out_file_name = f"collage_batch_{batch_index:02d}.jpg"
    out_file_path = os.path.join(OUTPUT_COLLAGE_DIR, out_file_name)
    
    # Save as high-quality JPEG (Quality 95 for maximum clarity)
    collage_img.save(out_file_path, "JPEG", quality=95, optimize=True)
    print(f"[+] Saved High-Clarity Collage #{batch_index:02d} -> {out_file_path} ({grid_w}x{grid_h} px)")

    return out_file_path, manifest_entries

# -----------------------------------------------------------------------------
# Main Execution Pipeline
# -----------------------------------------------------------------------------
def generate_all_collages():
    products = fetch_all_products()
    if not products:
        print("[-] No products found in database!")
        return

    total_products = len(products)
    batch_size = 10
    total_collages = math.ceil(total_products / batch_size)

    print("\n" + "="*80)
    print(f" GENERATING {total_collages} HIGH-CLARITY 10-IMAGE COMBINED COLLAGES")
    print(f" Total Catalog Products: {total_products}")
    print(f" Output Directory: {OUTPUT_COLLAGE_DIR}")
    print("="*80 + "\n")

    manifest = {
        "generated_at": str(os.getenv("CURRENT_TIME", "")),
        "total_products": total_products,
        "total_collages": total_collages,
        "collages": []
    }

    for i in range(total_collages):
        batch_index = i + 1
        start_idx = i * batch_size
        end_idx = min(start_idx + batch_size, total_products)
        product_batch = products[start_idx:end_idx]

        print(f"[*] Processing Collage {batch_index}/{total_collages} (Products {start_idx+1} to {end_idx})...")
        collage_path, batch_manifest = create_grid_collage(product_batch, batch_index)

        manifest["collages"].append({
            "batch_number": batch_index,
            "file_name": os.path.basename(collage_path),
            "file_path": collage_path,
            "product_count": len(product_batch),
            "items": batch_manifest
        })

    # Save manifest JSON
    manifest_path = os.path.join(OUTPUT_COLLAGE_DIR, "collage_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print("\n" + "="*80)
    print(f" ALL {total_collages} COMBINED COLLAGE IMAGES GENERATED SUCCESSFULLY!")
    print(f" 📂 Collages Folder: {OUTPUT_COLLAGE_DIR}")
    print(f" 📄 Manifest File:   {manifest_path}")
    print("="*80 + "\n")

if __name__ == "__main__":
    generate_all_collages()
