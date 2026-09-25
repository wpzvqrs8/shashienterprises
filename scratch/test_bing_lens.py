import os
import time
from playwright.sync_api import sync_playwright

def test_bing_visual_search():
    img_path = os.path.abspath("public/catalog/product-100.jpeg")
    print("Testing Bing Visual Search for image:", img_path)

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
            print("Uploading image to Bing Visual Search...")
            file_input.set_input_files(img_path)
            time.sleep(5)

            print("Page URL:", page.url)
            print("Page Title:", page.title())

            titles = page.eval_on_selector_all(
                "a, h2, h3, div.title, div.caption, span",
                "els => els.map(e => e.innerText ? e.innerText.trim() : '').filter(t => t.length > 4)"
            )
            unique = list(dict.fromkeys([t for t in titles if '\n' not in t and len(t) < 120]))
            print(f"Extracted {len(unique)} items from Bing Visual Search:")
            for u in unique[:20]:
                print(" ->", u)

        browser.close()

if __name__ == "__main__":
    test_bing_visual_search()
