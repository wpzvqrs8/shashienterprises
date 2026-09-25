import os
import time
from playwright.sync_api import sync_playwright

def test_firefox():
    img_path = os.path.abspath("public/catalog/product-100.jpeg")
    with sync_playwright() as p:
        try:
            browser = p.firefox.launch(headless=True)
            page = browser.new_page()
            page.goto("https://images.google.com")
            print("Firefox launched & navigated successfully! Page title:", page.title())
            browser.close()
        except Exception as e:
            print("Firefox launch error:", e)

if __name__ == "__main__":
    test_firefox()
