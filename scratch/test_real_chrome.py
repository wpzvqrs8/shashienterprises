import os
import time
from playwright.sync_api import sync_playwright

def test_real_chrome():
    img_path = os.path.abspath("public/catalog/product-100.jpeg")
    print("Testing Chrome channel with image:", img_path)

    for channel_name in ["chrome", "msedge"]:
        print(f"\n--- Testing channel: {channel_name} ---")
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    channel=channel_name,
                    headless=True,
                    args=['--disable-blink-features=AutomationControlled']
                )
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    locale="en-US"
                )
                page = context.new_page()
                page.goto("https://images.google.com")
                time.sleep(1)

                camera_btn = page.query_selector('div[aria-label="Search by image"], div[button-action="14"], span.Gko7ed, div.n5if, svg.Gko7ed')
                if camera_btn:
                    camera_btn.click()
                    time.sleep(1.5)
                    file_input = page.query_selector('input[type="file"]')
                    if file_input:
                        file_input.set_input_files(img_path)
                        time.sleep(7)
                        print("Final Page URL:", page.url)
                        print("Final Page Title:", page.title())

                        # Extract headings / links
                        texts = page.eval_on_selector_all(
                            "a, h1, h2, h3, div[role='heading'], span",
                            "els => els.map(e => e.innerText ? e.innerText.trim() : '').filter(t => t.length > 3)"
                        )
                        unique = list(dict.fromkeys([t for t in texts if '\n' not in t]))
                        print("Extracted items count:", len(unique))
                        print("Sample items:", unique[:15])
                browser.close()
        except Exception as e:
            print(f"Error testing {channel_name}: {e}")

if __name__ == "__main__":
    test_real_chrome()
