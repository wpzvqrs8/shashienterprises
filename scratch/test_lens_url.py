import time
import urllib.parse
from playwright.sync_api import sync_playwright

def test_url_lens():
    raw_url = "https://www.shashienterprises.store/catalog/product-100.jpeg"
    encoded_url = urllib.parse.quote(raw_url, safe='')
    lens_url = f"https://lens.google.com/uploadbyurl?url={encoded_url}"
    print("Opening Google Lens URL:", lens_url)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()
        page.goto(lens_url, wait_until="load")
        time.sleep(5)

        print("Final URL:", page.url)
        print("Page Title:", page.title())

        # Extract text snippets, headings, search match titles
        # Google Lens typically lists titles under elements like H2, H3, div with text, or links with specific classes
        results = page.eval_on_selector_all(
            "a, h2, h3, div[role='heading'], span",
            "elements => elements.map(e => e.innerText.trim()).filter(t => t.length > 5)"
        )
        
        print("Total extracted text items:", len(results))
        unique_results = list(dict.fromkeys(results))
        print("First 15 unique extracted titles/snippets:")
        for res in unique_results[:15]:
            print("-", res)

        browser.close()

if __name__ == "__main__":
    test_url_lens()
