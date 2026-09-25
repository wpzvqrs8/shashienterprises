import os
import sys
from dotenv import load_dotenv
from supabase import create_client, ClientOptions

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

load_dotenv(".env.local")
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

client = create_client(url, key, options=ClientOptions(schema="shashi_enterprise"))
res = client.from_("se_products").select("sku, name").order("sku").execute()
data = res.data or []

print(f"\n==================================================")
print(f" SUPABASE DATABASE VERIFICATION ({len(data)} PRODUCTS)")
print(f"==================================================\n")

for i, p in enumerate(data, 1):
    print(f"  [{i:02d}] {p['sku']}: {p['name']}")

print(f"\n==================================================\n")
