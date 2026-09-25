import os
import sys
import json
import time
import re
import urllib.request
from pathlib import Path
from dotenv import load_dotenv

# Ensure UTF-8 output encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Try importing Playwright and Supabase
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Error: Playwright package not found. Install via 'pip install playwright' and 'playwright install'")
    sys.exit(1)

try:
    from supabase import create_client, Client, ClientOptions
except ImportError:
    print("Error: supabase package not found. Install via 'pip install supabase'")
    sys.exit(1)

# -----------------------------------------------------------------------------
# Configuration & Constants
# -----------------------------------------------------------------------------
WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_PATH = os.path.join(WORKSPACE_DIR, ".env.local")

# Load environment variables
load_dotenv(dotenv_path=ENV_PATH)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://vzcarcbjzbaosviuepvb.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SCHEMA_NAME = "shashi_enterprise"

# Terms to exclude from keyword extraction
BOILERPLATE_TERMS = {
    "google", "lens", "search", "images", "visual matches", "exact matches", "terms of service",
    "privacy policy", "help", "feedback", "sign in", "camera", "drag", "drop", "file", "remove",
    "attachment", "about", "settings", "tools", "filters", "shopping", "overview", "ai overview",
    "see more", "learn more", "skip to main content", "accessibility help", "press / to jump",
    "verbatim", "custom range", "past hour", "past 24 hours", "past week", "past month", "past year",
    "why did this happen?", "translate", "choosing what you're giving feedback on", "search results"
}

# Common anime/manga franchises for accurate classification
KNOWN_FRANCHISES = [
    "Bleach", "Jujutsu Kaisen", "Dragon Ball Z", "Dragon Ball", "Hunter x Hunter",
    "One Piece", "Demon Slayer", "Naruto", "Naruto Shippuden", "Tom and Jerry",
    "Marvel", "DC Comics", "Attack on Titan", "My Hero Academia", "Pokemon",
    "Chainsaw Man", "Tokyo Ghoul", "Death Note", "Solo Leveling", "Gundam"
]

# -----------------------------------------------------------------------------
# Database Helper
# -----------------------------------------------------------------------------
def get_supabase_client() -> Client:
    """Initialize Supabase client targeting shashi_enterprise schema."""
    if not SUPABASE_KEY:
        raise ValueError("Supabase Key not found in environment variables!")
    return create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(schema=SCHEMA_NAME))



def fetch_products(limit: int = 5):
    """Fetch product records from Supabase se_products table."""
    print(f"[*] Connecting to Supabase database (Schema: '{SCHEMA_NAME}')...")
    supabase = get_supabase_client()
    response = supabase.from_("se_products").select("id, sku, name, category, series, image_url, description").order("created_at").limit(limit).execute()
    return response.data or []

# -----------------------------------------------------------------------------
# Image Resolution Helper
# -----------------------------------------------------------------------------
def resolve_image_file(image_url: str) -> str:
    """
    Resolves local file path or downloads remote URL to a temporary path.
    """
    if not image_url:
        return ""

    # If it's a relative path in catalog or public directory
    clean_url = image_url.lstrip("/")
    local_public_path = os.path.join(WORKSPACE_DIR, "public", clean_url)
    
    if os.path.exists(local_public_path):
        return os.path.abspath(local_public_path)

    # Check directly in workspace root
    local_root_path = os.path.join(WORKSPACE_DIR, clean_url)
    if os.path.exists(local_root_path):
        return os.path.abspath(local_root_path)

    # If it is a remote HTTP URL, download to scratch/temp_images/
    if image_url.startswith("http://") or image_url.startswith("https://"):
        temp_dir = os.path.join(os.path.dirname(__file__), "temp_images")
        os.makedirs(temp_dir, exist_ok=True)
        file_name = os.path.basename(image_url.split("?")[0]) or "temp_img.jpg"
        target_path = os.path.join(temp_dir, file_name)
        try:
            print(f"[*] Downloading remote image: {image_url} -> {target_path}")
            urllib.request.urlretrieve(image_url, target_path)
            return os.path.abspath(target_path)
        except Exception as e:
            print(f"[-] Error downloading image {image_url}: {e}")

    return ""

# -----------------------------------------------------------------------------
# Playwright Google Lens Scraper Engine
# -----------------------------------------------------------------------------
def scrape_google_lens(image_file_path: str, headless: bool = True) -> list:
    """
    Launches Playwright, uploads the image file to Visual Search (Bing + Google Lens),
    and extracts visual match titles, keywords, and product tags.
    """
    if not image_file_path or not os.path.exists(image_file_path):
        print(f"[-] Invalid or non-existent image path: {image_file_path}")
        return []

    print(f"[*] Playwright starting visual analysis for: {os.path.basename(image_file_path)}")
    extracted_items = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=headless,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1366, "height": 768},
            locale="en-US"
        )

        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
        """)

        page = context.new_page()

        # STEP 1: Bing Visual Search Engine (No Captcha & Extremely Detailed Match Titles)
        try:
            print("[*] Uploading image to Visual Search engine...")
            page.goto("https://www.bing.com/visualsearch", wait_until="networkidle")
            time.sleep(1)

            file_input = page.query_selector('input[type="file"]')
            if file_input:
                file_input.set_input_files(image_file_path)
                print("[*] Processing image recognition & visual matches...")
                time.sleep(5)

                raw_snippets = page.eval_on_selector_all(
                    "a, h2, h3, div.title, div.caption, span, img[alt]",
                    "els => els.map(e => e.alt ? e.alt.trim() : (e.innerText ? e.innerText.trim() : '')).filter(t => t.length > 3)"
                )

                seen = set()
                for text in raw_snippets:
                    t_clean = text.strip()
                    if not t_clean or len(t_clean) < 3 or len(t_clean) > 140 or '\n' in t_clean:
                        continue
                    if t_clean.lower() in BOILERPLATE_TERMS or any(bp in t_clean.lower() for bp in ["privacy", "terms", "feedback", "skip to", "accessibility", "unusual traffic"]):
                        continue
                    if t_clean.lower() not in seen:
                        seen.add(t_clean.lower())
                        extracted_items.append(t_clean)

        except Exception as err:
            print(f"[-] Visual Search error: {err}")

        # STEP 2: Google Lens Engine (if needed)
        if len(extracted_items) < 3:
            try:
                print("[*] Attempting Google Lens visual analysis...")
                page.goto("https://images.google.com", wait_until="networkidle")
                time.sleep(1)

                camera_btn = page.query_selector('div[aria-label="Search by image"], div[button-action="14"], span.Gko7ed, div.n5if, svg.Gko7ed')
                if camera_btn:
                    camera_btn.click()
                    time.sleep(1)

                g_file_input = page.query_selector('input[type="file"]')
                if g_file_input:
                    g_file_input.set_input_files(image_file_path)
                    time.sleep(5)

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
            except Exception as err:
                print(f"[-] Google Lens error: {err}")

        browser.close()

    return extracted_items

# -----------------------------------------------------------------------------
# Keyword Refinement & Product Namer
# -----------------------------------------------------------------------------
def process_scraped_data(product: dict, scraped_terms: list) -> dict:
    """
    Processes scraped Lens terms alongside original product metadata to build:
    1. Comprehensive SEO keywords list
    2. Perfect catalog product name optimized for e-commerce
    """
    orig_name = product.get("name", "")
    orig_series = product.get("series", "")
    orig_category = product.get("category", "")

    # Extract height pattern (e.g. 32cm, 28 cm)
    height_match = re.search(r'(\d+\s*cm)', orig_name, re.IGNORECASE)
    height_str = height_match.group(1).replace(" ", "") if height_match else ""

    # Detect franchise
    franchise = orig_series or ""
    for f in KNOWN_FRANCHISES:
        if f.lower() in orig_name.lower():
            franchise = f
            break

    # Gather keywords from scraped Lens terms
    keywords = set()
    if franchise:
        keywords.add(franchise)
    keywords.add("Action Figure")
    keywords.add("Collectible Statue")
    keywords.add("Anime Figure")

    cleaned_match_titles = []
    for term in scraped_terms:
        # Ignore purely numeric or standard UI strings
        if term.isdigit() or len(term) < 4:
            continue
        cleaned_match_titles.append(term)
        # Extract potential keyword words
        words = re.findall(r'\b[A-Za-z0-9\-]{3,}\b', term)
        for w in words:
            if w.lower() not in BOILERPLATE_TERMS and not w.isdigit():
                keywords.add(w.capitalize())

    # Build optimized product title
    # Strategy: [Franchise] + [Character & Pose/Variant] + [Statue/Figure] + [Size]
    # Remove existing height from orig_name for processing
    base_character_name = orig_name
    if height_str:
        base_character_name = re.sub(r'\d+\s*cm', '', orig_name, flags=re.IGNORECASE).strip()

    # Refine title
    suggested_title = base_character_name
    if franchise and not base_character_name.lower().startswith(franchise.lower()):
        suggested_title = f"{franchise} {base_character_name}"
    
    if height_str and height_str not in suggested_title:
        suggested_title = f"{suggested_title} {height_str}"

    # Standardize spacing
    suggested_title = re.sub(r'\s+', ' ', suggested_title).strip()

    return {
        "product_id": product.get("id"),
        "sku": product.get("sku"),
        "original_name": orig_name,
        "image_url": product.get("image_url"),
        "suggested_catalog_name": suggested_title,
        "extracted_keywords": sorted(list(keywords))[:15],
        "top_google_lens_matches": cleaned_match_titles[:8]
    }

# -----------------------------------------------------------------------------
# Main Execution / Demo Routine
# -----------------------------------------------------------------------------
def run_catalog_namer_demo(limit: int = 5):
    """
    Main function to run the full scraping and catalog naming pipeline on first N DB images.
    """
    print("\n" + "="*80)
    print(f" SHASHI ENTERPRISES — GOOGLE LENS PRODUCT CATALOG NAMER & KEYWORD SCRAPER")
    print(f" Target: First {limit} Product Images from Supabase Database")
    print("="*80 + "\n")

    products = fetch_products(limit=limit)
    if not products:
        print("[-] No products retrieved from database.")
        return

    print(f"[+] Successfully fetched {len(products)} products from 'shashi_enterprise.se_products'.\n")

    demo_results = []
    for idx, prod in enumerate(products, 1):
        print("-" * 80)
        print(f"[{idx}/{len(products)}] Processing SKU: {prod.get('sku')} | Current Name: {prod.get('name')}")
        img_url = prod.get("image_url", "")
        print(f"    Image URL in DB: {img_url}")

        local_img_path = resolve_image_file(img_url)
        if not local_img_path:
            print(f"    [-] Could not resolve image path for {img_url}. Skipping.")
            continue

        print(f"    Local Image Path: {local_img_path}")

        # Run Google Lens scraping via Playwright
        lens_raw_terms = scrape_google_lens(local_img_path, headless=False)

        # Process and refine
        result = process_scraped_data(prod, lens_raw_terms)
        demo_results.append(result)

        print("\n    >>> SCRAPED GOOGLE LENS MATCHES:")
        if result["top_google_lens_matches"]:
            for match in result["top_google_lens_matches"]:
                print(f"        • {match}")
        else:
            print("        (No distinct visual match text detected)")

        print("\n    >>> PROPOSED PERFECT CATALOG NAME:")
        print(f"        ✨ {result['suggested_catalog_name']}")

        print("\n    >>> GENERATED HIGH-VALUE KEYWORDS:")
        print(f"        🏷️  {', '.join(result['extracted_keywords'])}")
        print("-" * 80 + "\n")

    # Save output to JSON for reference
    output_json_path = os.path.join(os.path.dirname(__file__), "scraped_product_catalog_demo.json")
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(demo_results, f, indent=2, ensure_ascii=False)

    print("\n" + "="*80)
    print(f" DEMO COMPLETED SUCCESSFULLY FOR {len(demo_results)} PRODUCTS!")
    print(f" Results saved to: {output_json_path}")
    print("="*80 + "\n")

if __name__ == "__main__":
    limit_count = 5
    if len(sys.argv) > 1:
        try:
            limit_count = int(sys.argv[1])
        except ValueError:
            pass
    run_catalog_namer_demo(limit=limit_count)
