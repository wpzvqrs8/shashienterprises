import os
import time
from playwright.sync_api import sync_playwright

def test_headful_lens():
    img_path = os.path.abspath("public/catalog/product-100.jpeg")
    print("Testing Google Lens with headless=False...")

    with sync_playwright() as p:
        # Launch headful browser
        browser = p.chromium.launch(
            headless=False,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--start-maximized'
            ]
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport=None
        )
        page = context.new_page()

        print("Navigating to https://images.google.com ...")
        page.goto("https://images.google.com", wait_until="networkidle")
        time.sleep(2)

        camera_btn = page.query_selector('div[aria-label="Search by image"], div[button-action="14"], span.Gko7ed, div.n5if, svg.Gko7ed')
        if camera_btn:
            camera_btn.click()
            time.sleep(1.5)

            file_input = page.query_selector('input[type="file"]')
            if file_input:
                print("Setting file input...")
                file_input.set_input_files(img_path)
                print("Waiting for Lens results page...")
                time.sleep(8)

                print("Current Page URL:", page.url)
                print("Page Title:", page.title())

                texts = page.eval_on_selector_all(
                    "a, h1, h2, h3, div[role='heading'], span, div.Vd210d",
                    "els => els.map(e => e.innerText ? e.innerText.trim() : '').filter(t => t.length > 3)"
                )
                unique = list(dict.fromkeys([t for t in texts if '\n' not in t and len(t) < 120]))
                print(f"Extracted {len(unique)} items from Lens headful mode:")
                for u in unique[:30]:
                    print(" ->", u)

        browser.close()

if __name__ == "__main__":
    test_headful_lens()
