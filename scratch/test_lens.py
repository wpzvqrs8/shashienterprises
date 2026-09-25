import os
import time
from playwright.sync_api import sync_playwright

def test_lens_upload():
    img_path = os.path.abspath("public/catalog/product-100.jpeg")
    print("Testing image path:", img_path)
    if not os.path.exists(img_path):
        print("Image file does not exist!")
        return

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a realistic user agent
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()
        
        # Navigate to Google Images / Google Lens
        print("Navigating to google.com...")
        page.goto("https://www.google.com", wait_until="networkidle")
        
        # Check if search by image button exists or navigate to lens directly
        print("Navigating to https://lens.google.com...")
        page.goto("https://lens.google.com", wait_until="load")
        time.sleep(3)
        
        print("Page title:", page.title())
        # Print file input if any
        file_inputs = page.query_selector_all('input[type="file"]')
        print("Found file inputs on lens.google.com:", len(file_inputs))
        
        # Also try google images lens icon
        page.goto("https://images.google.com", wait_until="load")
        time.sleep(2)
        print("Images page title:", page.title())
        camera_btn = page.query_selector('div[aria-label="Search by image"], div[button-action="14"], [data-lens-p="1"], span.Gko7ed, div.n5if')
        print("Camera button found:", camera_btn is not None)

        browser.close()

if __name__ == "__main__":
    test_lens_upload()
