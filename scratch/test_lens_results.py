import os
import time
from playwright.sync_api import sync_playwright

def test_upload_and_scrape():
    img_path = os.path.abspath("public/catalog/product-100.jpeg")
    print("Testing image file upload to Google Lens:", img_path)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()
        
        print("Navigating to https://lens.google.com/search ...")
        # Direct lens search upload page
        page.goto("https://lens.google.com", wait_until="networkidle")
        time.sleep(2)

        # Upload image to first file input
        file_inputs = page.query_selector_all('input[type="file"]')
        if file_inputs:
            print(f"Uploading file to input element (total inputs: {len(file_inputs)})...")
            file_inputs[0].set_input_files(img_path)
            
            # Wait for navigation / lens results
            print("Waiting for Lens results page to load...")
            time.sleep(6)
            
            print("Current URL:", page.url)
            print("Page Title:", page.title())
            
            # Take screenshot for debugging if needed
            page.screenshot(path="scratch/lens_result_test.png")
            print("Saved screenshot to scratch/lens_result_test.png")

            # Extract visual match headings / text
            # Lens results usually contain elements with text content, headings, titles
            elements = page.query_selector_all('a, h2, h3, span, div')
            titles = []
            for el in elements:
                try:
                    txt = el.inner_text().strip()
                    if len(txt) > 5 and '\n' not in txt:
                        titles.append(txt)
                except Exception:
                    pass

            print(f"Extracted {len(titles)} text snippets/titles.")
            print("Sample snippets:", titles[:20])

        browser.close()

if __name__ == "__main__":
    test_upload_and_scrape()
