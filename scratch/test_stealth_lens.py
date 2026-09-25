import os
import time
import re
from playwright.sync_api import sync_playwright

def scrape_lens_for_image(image_path):
    print(f"\n[+] Processing image: {image_path}")
    if not os.path.exists(image_path):
        print(f"[-] Image file not found: {image_path}")
        return []

    with sync_playwright() as p:
        # Launch Chromium with anti-bot detection flags
        browser = p.chromium.launch(
            headless=True,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-size=1280,800'
            ]
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )
        
        # Override navigator.webdriver
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
        """)
        
        page = context.new_page()

        print("[*] Navigating to Google Images...")
        page.goto("https://images.google.com", wait_until="networkidle")
        time.sleep(1)

        # Click search by image (camera icon)
        camera_btn = page.query_selector('div[aria-label="Search by image"], div[button-action="14"], span.Gko7ed, div.n5if, svg.Gko7ed')
        if not camera_btn:
            print("[-] Camera button selector not found, navigating to lens directly...")
            page.goto("https://lens.google.com", wait_until="load")
            time.sleep(2)
        else:
            print("[*] Clicking Lens camera button...")
            camera_btn.click()
            time.sleep(1.5)

        # Upload image file
        file_input = page.query_selector('input[type="file"]')
        if not file_input:
            print("[-] File input not found on page.")
            browser.close()
            return []

        print("[*] Uploading image file to Google Lens...")
        file_input.set_input_files(image_path)
        
        print("[*] Waiting for Google Lens to process image and display results...")
        time.sleep(7)

        current_url = page.url
        print(f"[*] Lens Results URL: {current_url[:100]}...")

        # Extract text snippets from page
        raw_texts = page.eval_on_selector_all(
            "a, h1, h2, h3, div[role='heading'], span, div.Vd210d, div.title, div.VwiC3b",
            "elements => elements.map(e => e.innerText ? e.innerText.trim() : '').filter(t => t.length > 3)"
        )

        browser.close()

        # Clean and filter extracted titles/keywords
        ignore_list = {
            "google", "images", "lens", "search", "upload", "terms", "privacy", "help", "feedback",
            "sign in", "camera", "drag", "drop", "file", "remove", "attachment", "visual matches",
            "find image source", "search by image", "about", "settings", "tools", "filters", "shopping"
        }

        cleaned = []
        seen = set()
        for item in raw_texts:
            clean_item = item.strip()
            # Filter out single line CSS or long scripts or boilerplate
            if len(clean_item) < 4 or len(clean_item) > 120 or '\n' in clean_item:
                continue
            if clean_item.lower() in ignore_list:
                continue
            if clean_item.lower() not in seen:
                seen.add(clean_item.lower())
                cleaned.append(clean_item)

        print(f"[+] Successfully extracted {len(cleaned)} keywords/titles from Google Lens.")
        return cleaned

if __name__ == "__main__":
    img = os.path.abspath("public/catalog/product-100.jpeg")
    results = scrape_lens_for_image(img)
    print("\n=== Extracted Results Preview ===")
    for r in results[:15]:
        print(" •", r)
