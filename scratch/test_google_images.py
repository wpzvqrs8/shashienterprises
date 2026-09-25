import os
import time
from playwright.sync_api import sync_playwright

def test_google_images():
    img_path = os.path.abspath("public/catalog/product-100.jpeg")
    print("Testing image path:", img_path)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()

        print("Navigating to https://images.google.com...")
        page.goto("https://images.google.com", wait_until="networkidle")
        time.sleep(1)

        # Click lens/camera icon
        camera_btn = page.query_selector('div[aria-label="Search by image"], div[button-action="14"], span.Gko7ed, div.n5if, svg.Gko7ed')
        if camera_btn:
            print("Found camera button, clicking...")
            camera_btn.click()
            time.sleep(2)
        
        # Look for upload tab or input
        file_input = page.query_selector('input[type="file"]')
        if file_input:
            print("Found file input, setting file...")
            file_input.set_input_files(img_path)
            print("File submitted, waiting for results...")
            time.sleep(6)
            print("Current URL:", page.url)
            print("Page Title:", page.title())

            # Extract visual match headers / links / titles
            # Visual match items on Google Lens usually have text, aria-labels, or titles
            elements = page.query_selector_all('a, h1, h2, h3, div[role="heading"], span')
            titles = []
            for el in elements:
                try:
                    txt = el.inner_text().strip()
                    if len(txt) > 3 and '\n' not in txt and len(txt) < 150:
                        titles.append(txt)
                except Exception:
                    pass

            unique_titles = list(dict.fromkeys(titles))
            print(f"Extracted {len(unique_titles)} text items:")
            for t in unique_titles[:25]:
                print(" ->", t)

        else:
            print("File input not found after clicking camera button.")

        browser.close()

if __name__ == "__main__":
    test_google_images()
