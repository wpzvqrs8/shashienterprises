import os
import sys
import csv
import re
from dotenv import load_dotenv

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

try:
    from supabase import create_client, ClientOptions
except ImportError:
    print("Error: supabase package not found.")
    sys.exit(1)

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_PATH = os.path.join(WORKSPACE_DIR, ".env.local")
load_dotenv(dotenv_path=ENV_PATH)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://vzcarcbjzbaosviuepvb.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SCHEMA_NAME = "shashi_enterprise"

CSV_PATH = os.path.join(os.path.dirname(__file__), "scraped_catalog_products.csv")

def clean_name(name_str: str) -> str:
    """Clean extra spaces or weird decimal formatting in names."""
    if not name_str:
        return ""
    cleaned = re.sub(r'Pop Culture\s+', '', name_str, flags=re.IGNORECASE) if name_str.startswith("Pop Culture ") else name_str
    cleaned = re.sub(r'(\d+)\.\s+(\d+)\s*cm', r'\1.\2cm', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def update_product_names_from_csv():
    if not os.path.exists(CSV_PATH):
        print(f"[-] CSV file not found at: {CSV_PATH}")
        return

    print("\n" + "="*80)
    print(" UPDATING DATABASE PRODUCT NAMES FROM SCRAPED CSV")
    print(f" Source CSV: {CSV_PATH}")
    print(f" Schema: '{SCHEMA_NAME}' | Table: 'se_products'")
    print("="*80 + "\n")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(schema=SCHEMA_NAME))

    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"[+] Loaded {len(rows)} product rows from CSV.\n")

    updated_count = 0
    skipped_count = 0
    failed_count = 0

    for idx, row in enumerate(rows, 1):
        product_id = row.get("id", "").strip()
        sku = row.get("sku", "").strip()
        orig_name = row.get("original_name", "").strip()
        new_name_raw = row.get("proposed_catalog_name", "").strip()

        new_name = clean_name(new_name_raw)

        if not new_name or new_name == orig_name:
            skipped_count += 1
            continue

        print(f"[{idx}/{len(rows)}] Updating {sku}:")
        print(f"    Old Name: {orig_name}")
        print(f"    New Name: {new_name}")

        try:
            res = supabase.from_("se_products").update({"name": new_name}).eq("id", product_id).execute()
            if res.data:
                updated_count += 1
                print("    [✓] Database updated successfully.")
            else:
                print("    [-] Update returned empty response.")
                failed_count += 1
        except Exception as e:
            print(f"    [-] Error updating {sku}: {e}")
            failed_count += 1

        print("-" * 60)

    print("\n" + "="*80)
    print(" PRODUCT NAMES UPDATE SUMMARY")
    print(f" Total Rows in CSV: {len(rows)}")
    print(f" Updated Product Names: {updated_count}")
    print(f" Skipped / Unchanged:   {skipped_count}")
    print(f" Failed Updates:        {failed_count}")
    print("="*80 + "\n")

if __name__ == "__main__":
    update_product_names_from_csv()
