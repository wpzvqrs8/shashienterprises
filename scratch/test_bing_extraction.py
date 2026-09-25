import os
import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

img_path = os.path.abspath("scratch/temp_images/SE-ANM-101_base64.jpg")
print("Testing Bing Visual Search extraction on decoded base64 image:", img_path)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        viewport={"width": 1280, "height": 800}
    )
    page = context.new_page()

    page.goto("https://www.bing.com/visualsearch", wait_until="networkidle")
    time.sleep(1)

    file_input = page.query_selector('input[type="file"]')
    if file_input:
        file_input.set_input_files(img_path)
        print("Uploaded file, waiting for results...")
        time.sleep(5)

        print("Page Title:", page.title())

        # Extract titles from search match elements
        # Bing visual search shows titles in links, captions, headings, or img alt tags
        raw_titles = page.eval_on_selector_all(
            "div.title, div.caption, a.vs_r_title, h2, h3, a[href*='http']",
            "els => els.map(e => e.innerText ? e.innerText.trim() : '').filter(t => t.length > 5)"
        )

        unique_titles = list(dict.fromkeys([t for t in raw_titles if '\n' not in t and len(t) < 150]))
        print(f"Extracted {len(unique_titles)} match titles:")
        for t in unique_titles[:20]:
            print(" ->", t)

    browser.close()
