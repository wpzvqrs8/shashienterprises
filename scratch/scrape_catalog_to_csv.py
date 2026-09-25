import os
import sys
import json
import csv
import base64
import time
import re
import urllib.request
from dotenv import load_dotenv

# Ensure UTF-8 output encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Error: Playwright package not found. Install via 'pip install playwright'")
    sys.exit(1)

try:
    from supabase import create_client, Client, ClientOptions
except ImportError:
    print("Error: supabase package not found. Install via 'pip install supabase'")
    sys.exit(1)

# -----------------------------------------------------------------------------
# Configuration & Setup
# -----------------------------------------------------------------------------
WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_PATH = os.path.join(WORKSPACE_DIR, ".env.local")
load_dotenv(dotenv_path=ENV_PATH)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://vzcarcbjzbaosviuepvb.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SCHEMA_NAME = "shashi_enterprise"

TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp_images")
os.makedirs(TEMP_DIR, exist_ok=True)

CSV_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "scraped_catalog_products.csv")
JSON_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "scraped_catalog_products.json")

# Boilerplate filtering terms
BOILERPLATE_TERMS = {
    "bing", "google", "lens", "search", "images", "visual search", "visual matches", "exact matches",
    "terms of service", "privacy policy", "help", "feedback", "sign in", "camera", "drag", "drop",
    "file", "remove", "attachment", "about", "settings", "tools", "filters", "shopping", "overview",
    "ai overview", "see more", "learn more", "skip to content", "accessibility feedback", "unusual traffic",
    "text is copied to clipboard", "autodetect", "target language", "close", "translation", "remove translation",
    "privacy policy", "terms of use", "open camera", "drop image anywhere", "english", "save", "saved",
    "access your collections", "collections", "saving...", "removing...", "save to", "saved to"
}

KNOWN_FRANCHISES = [
    "Bleach", "Jujutsu Kaisen", "Dragon Ball Z", "Dragon Ball Super", "Dragon Ball", "Hunter x Hunter",
    "One Piece", "Demon Slayer", "Naruto", "Naruto Shippuden", "Tom and Jerry", "Superman", "Batman",
    "Marvel", "DC Comics", "Attack on Titan", "My Hero Academia", "Pokemon", "Chainsaw Man",
    "Tokyo Ghoul", "Death Note", "Solo Leveling", "Gundam", "Transformers", "Spider-Man"
]

# -----------------------------------------------------------------------------
# Database Helper
# -----------------------------------------------------------------------------
def get_all_products():
    """Fetch all products from Supabase se_products table."""
    print(f"[*] Connecting to Supabase database (Schema: '{SCHEMA_NAME}')...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(schema=SCHEMA_NAME))
    # Fetch all records ordered by SKU
    res = supabase.from_("se_products").select("id, sku, name, category, series, image_url, description").order("sku").execute()
    return res.data or []

# -----------------------------------------------------------------------------
# Image Resolution Helper (Base64, Local Relative Path, HTTP URL)
# -----------------------------------------------------------------------------
def resolve_image_to_file(image_url: str, sku: str) -> str:
    """
    Decodes Base64 data URIs, resolves local file paths, or downloads HTTP image URLs.
    Returns absolute local file path ready for Playwright input upload.
    """
    if not image_url:
        return ""

    # Case 1: Base64 Data URI
    if image_url.startswith("data:"):
        try:
            if "," in image_url:
                header, encoded = image_url.split(",", 1)
            else:
                encoded = image_url
            image_bytes = base64.b64decode(encoded)
            ext = "png" if "png" in image_url[:30].lower() else "jpg"
            target_path = os.path.join(TEMP_DIR, f"{sku}_base64.{ext}")
            with open(target_path, "wb") as f:
                f.write(image_bytes)
            return os.path.abspath(target_path)
        except Exception as e:
            print(f"    [-] Error decoding base64 image for {sku}: {e}")
            return ""

    # Case 2: Relative Local Path
    clean_path = image_url.lstrip("/")
    local_public_path = os.path.join(WORKSPACE_DIR, "public", clean_path)
    if os.path.exists(local_public_path):
        return os.path.abspath(local_public_path)

    local_root_path = os.path.join(WORKSPACE_DIR, clean_path)
    if os.path.exists(local_root_path):
        return os.path.abspath(local_root_path)

    # Case 3: HTTP / HTTPS Remote URL
    if image_url.startswith("http://") or image_url.startswith("https://"):
        file_name = f"{sku}_remote.jpg"
        target_path = os.path.join(TEMP_DIR, file_name)
        try:
            urllib.request.urlretrieve(image_url, target_path)
            return os.path.abspath(target_path)
        except Exception as e:
            print(f"    [-] Error downloading remote image {image_url}: {e}")
            return ""

    return ""

# -----------------------------------------------------------------------------
# Playwright Visual Recognition Scraper (Bing Visual Search + Google Lens)
# -----------------------------------------------------------------------------
def scrape_visual_search(page, image_path: str) -> list:
    """
    Uploads an image file to Bing Visual Search (with Google Lens fallback) using active Playwright page context.
    Returns cleaned visual match titles and text snippets.
    """
    if not image_path or not os.path.exists(image_path):
        return []

    extracted_items = []

    # Attempt 1: Bing Visual Search Engine (No Captchas & Fast Visual Match Titles)
    try:
        page.goto("https://www.bing.com/visualsearch", wait_until="networkidle", timeout=15000)
        time.sleep(1)

        file_input = page.query_selector('input[type="file"]')
        if file_input:
            file_input.set_input_files(image_path)
            time.sleep(4.5)

            raw_snippets = page.eval_on_selector_all(
                "a, h2, h3, div.title, div.caption, span, img[alt]",
                "els => els.map(e => e.alt ? e.alt.trim() : (e.innerText ? e.innerText.trim() : '')).filter(t => t.length > 3)"
            )

            seen = set()
            for text in raw_snippets:
                t_clean = text.strip()
                if not t_clean or len(t_clean) < 3 or len(t_clean) > 150 or '\n' in t_clean:
                    continue
                if t_clean.lower() in BOILERPLATE_TERMS:
                    continue
                if any(bp in t_clean.lower() for bp in ["privacy", "terms", "feedback", "skip to", "accessibility", "unusual traffic"]):
                    continue
                if t_clean.lower() not in seen:
                    seen.add(t_clean.lower())
                    extracted_items.append(t_clean)
    except Exception as e:
        print(f"    [-] Bing Visual Search note: {e}")

    # Attempt 2: Google Lens Engine fallback if Bing returned < 2 items
    if len(extracted_items) < 2:
        try:
            page.goto("https://images.google.com", wait_until="networkidle", timeout=15000)
            time.sleep(1)

            camera_btn = page.query_selector('div[aria-label="Search by image"], div[button-action="14"], span.Gko7ed, div.n5if, svg.Gko7ed')
            if camera_btn:
                camera_btn.click()
                time.sleep(1)

            file_input = page.query_selector('input[type="file"]')
            if file_input:
                file_input.set_input_files(image_path)
                time.sleep(4.5)

                g_snippets = page.eval_on_selector_all(
                    "a, h1, h2, h3, div[role='heading'], span, div.Vd210d, div.title",
                    "els => els.map(e => e.innerText ? e.innerText.trim() : '').filter(t => t.length > 3)"
                )

                seen = set(t.lower() for t in extracted_items)
                for text in g_snippets:
                    t_clean = text.strip()
                    if not t_clean or len(t_clean) < 3 or len(t_clean) > 140 or '\n' in t_clean:
                        continue
                    if t_clean.lower() in BOILERPLATE_TERMS or "unusual traffic" in t_clean.lower():
                        continue
                    if t_clean.lower() not in seen:
                        seen.add(t_clean.lower())
                        extracted_items.append(t_clean)
        except Exception as e:
            print(f"    [-] Google Lens note: {e}")

    return extracted_items

# -----------------------------------------------------------------------------
# Name & Keyword Synthesizer
# -----------------------------------------------------------------------------
def process_product_data(product: dict, scraped_terms: list) -> dict:
    """
    Synthesizes scraped visual terms and original product metadata into:
    - High-ranking Visual Title
    - Refined E-commerce Catalog Product Name
    - Extracted Keywords & Tags
    """
    orig_name = product.get("name", "").strip()
    orig_series = product.get("series", "").strip()

    # Extract height pattern (e.g. 21cm, 28cm)
    height_match = re.search(r'(\d+\s*cm)', orig_name, re.IGNORECASE)
    height_str = height_match.group(1).replace(" ", "") if height_match else ""

    # Detect franchise
    franchise = orig_series or ""
    for f in KNOWN_FRANCHISES:
        if f.lower() in orig_name.lower():
            franchise = f
            break

    # Extract best scraped match title (exclude UI boilerplate)
    best_match_title = ""
    valid_matches = []
    for term in scraped_terms:
        if any(bp in term.lower() for bp in ["visually searched", "text is copied", "autodetect", "translation"]):
            continue
        valid_matches.append(term)
        if not best_match_title and len(term) > 8:
            best_match_title = term

    # Build keywords set
    keywords = set()
    if franchise:
        keywords.add(franchise)
    keywords.add("Action Figure")
    keywords.add("Collectible Statue")
    keywords.add("Anime Collectible")

    for match in valid_matches[:10]:
        words = re.findall(r'\b[A-Za-z0-9\-]{3,}\b', match)
        for w in words:
            if w.lower() not in BOILERPLATE_TERMS and not w.isdigit():
                keywords.add(w.capitalize())

    # Build proposed proper catalog product name
    base_name = orig_name
    if height_str:
        base_name = re.sub(r'\d+\s*cm', '', orig_name, flags=re.IGNORECASE).strip()

    proposed_name = base_name
    if franchise and not base_name.lower().startswith(franchise.lower()):
        proposed_name = f"{franchise} {base_name}"

    if height_str and height_str not in proposed_name:
        proposed_name = f"{proposed_name} {height_str}"

    proposed_name = re.sub(r'\s+', ' ', proposed_name).strip()

    # Truncate image_url for clean CSV display if base64
    raw_img_url = product.get("image_url", "")
    display_img_url = raw_img_url[:40] + "... (Base64)" if raw_img_url.startswith("data:") else raw_img_url

    return {
        "id": product.get("id"),
        "sku": product.get("sku"),
        "original_name": orig_name,
        "image_url": display_img_url,
        "scraped_best_match": best_match_title or (valid_matches[0] if valid_matches else "N/A"),
        "proposed_catalog_name": proposed_name,
        "extracted_keywords": ", ".join(sorted(list(keywords))[:15]),
        "all_match_snippets": " | ".join(valid_matches[:6])
    }

# -----------------------------------------------------------------------------
# Main Execution Pipeline
# -----------------------------------------------------------------------------
def run_full_catalog_scraper(limit: int = None):
    print("\n" + "="*80)
    print(" SHASHI ENTERPRISES — FULL CATALOG VISUAL RECOGNITION & CSV EXPORTER")
    print("="*80 + "\n")

    products = get_all_products()
    if not products:
        print("[-] No products found in database.")
        return

    if limit and limit > 0:
        products = products[:limit]

    total_count = len(products)
    print(f"[+] Loaded {total_count} products from 'shashi_enterprise.se_products'.\n")

    processed_rows = []

    # Initialize CSV header immediately
    fieldnames = [
        "id",
        "sku",
        "original_name",
        "proposed_catalog_name",
        "scraped_best_match",
        "extracted_keywords",
        "image_url",
        "all_match_snippets"
    ]

    print(f"[*] Initializing live CSV export file: {CSV_OUTPUT_PATH}")
    csv_file = open(CSV_OUTPUT_PATH, "w", newline="", encoding="utf-8-sig")
    csv_writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    csv_writer.writeheader()
    csv_file.flush()

    with sync_playwright() as p:
        print("[*] Launching Playwright Chromium in HEADLESS mode...")
        browser = p.chromium.launch(
            headless=True,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )
        context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        page = context.new_page()

        for idx, prod in enumerate(products, 1):
            sku = prod.get("sku", f"SKU-{idx}")
            orig_name = prod.get("name", "Unknown Product")
            img_url = prod.get("image_url", "")

            print(f"[{idx}/{total_count}] Processing {sku} | {orig_name}")

            # Resolve image (handles base64, local relative paths, http URLs)
            image_file_path = resolve_image_to_file(img_url, sku)
            if not image_file_path:
                print(f"    [-] Warning: Image path could not be resolved for {sku}. Skipping visual search.")
                scraped_snippets = []
            else:
                scraped_snippets = scrape_visual_search(page, image_file_path)

            row_data = process_product_data(prod, scraped_snippets)
            processed_rows.append(row_data)

            # Append live to CSV file and flush to disk
            csv_writer.writerow(row_data)
            csv_file.flush()

            print(f"    ✨ Proposed Name: {row_data['proposed_catalog_name']}")
            print(f"    🏷️  Keywords: {row_data['extracted_keywords']}\n")

        browser.close()

    csv_file.close()

    # -------------------------------------------------------------------------
    # Write Output to JSON File
    # -------------------------------------------------------------------------
    with open(JSON_OUTPUT_PATH, "w", encoding="utf-8") as json_file:
        json.dump(processed_rows, json_file, indent=2, ensure_ascii=False)

    print("\n" + "="*80)
    print(f" SUCCESS! PROCESSED ALL {len(processed_rows)} PRODUCTS.")
    print(f" 📄 CSV File Saved:  {CSV_OUTPUT_PATH}")
    print(f" 📄 JSON File Saved: {JSON_OUTPUT_PATH}")
    print("="*80 + "\n")

if __name__ == "__main__":
    limit_arg = None
    if len(sys.argv) > 1:
        try:
            limit_arg = int(sys.argv[1])
        except ValueError:
            pass
    run_full_catalog_scraper(limit=limit_arg)
