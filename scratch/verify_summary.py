import os
import sys
from dotenv import load_dotenv
from supabase import create_client, ClientOptions

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

load_dotenv(".env.local")
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://vzcarcbjzbaosviuepvb.supabase.co")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase = create_client(url, key, options=ClientOptions(schema="shashi_enterprise"))

res = supabase.from_("se_products").select("sku, name, slug, series, category").order("sku").execute()
items = res.data or []

print(f"=== TOTAL DB PRODUCTS VERIFIED: {len(items)} ===\n")

sample_skus = ["SE-ANM-005", "SE-ANM-013", "SE-ANM-076", "SE-ANM-077", "SE-ANM-079", "SE-ANM-095", "SE-ANM-096", "SE-ANM-103"]
for sku in sample_skus:
    match = next((i for i in items if i["sku"] == sku), None)
    if match:
        print(f"SKU: {match['sku']}")
        print(f"  Name:     {match['name']}")
        print(f"  Slug URL: https://www.shashienterprises.store/product/{match['slug']}")
        print(f"  Series:   {match['series']}")
        print(f"  Category: {match['category']}\n")
