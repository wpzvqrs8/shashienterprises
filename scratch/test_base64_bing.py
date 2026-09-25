import os
import sys
import base64
import re
import time
from dotenv import load_dotenv
from supabase import create_client, ClientOptions

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_PATH = os.path.join(WORKSPACE_DIR, ".env.local")
load_dotenv(dotenv_path=ENV_PATH)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://vzcarcbjzbaosviuepvb.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(schema="shashi_enterprise"))

# Fetch 3 base64 products to test base64 decoding and visual search
res = supabase.from_("se_products").select("id, sku, name, image_url").like("image_url", "data:%").limit(3).execute()
base64_products = res.data or []
print(f"Found {len(base64_products)} base64 products in database.")

temp_dir = os.path.join(os.path.dirname(__file__), "temp_images")
os.makedirs(temp_dir, exist_ok=True)

for p in base64_products:
    sku = p["sku"]
    img_data = p["image_url"]
    print(f"\nProcessing SKU: {sku} | Original Name: {p['name']}")
    print(f"Base64 string length: {len(img_data)}")
    
    # Extract base64 part
    if "," in img_data:
        header, encoded = img_data.split(",", 1)
    else:
        encoded = img_data

    image_bytes = base64.b64decode(encoded)
    out_path = os.path.join(temp_dir, f"{sku}_base64.jpg")
    with open(out_path, "wb") as f:
        f.write(image_bytes)

    print(f"[+] Successfully decoded base64 image to: {out_path} ({len(image_bytes)} bytes)")
