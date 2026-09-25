import os
import sys
import json
import csv
import base64
import time
import re
import requests
from dotenv import load_dotenv

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

try:
    from supabase import create_client, ClientOptions
except ImportError:
    print("Error: supabase package not found.")
    sys.exit(1)

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_PATH = os.path.join(WORKSPACE_DIR, ".env.local")
load_dotenv(dotenv_path=ENV_PATH)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://vzcarcbjzbaosviuepvb.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SCHEMA_NAME = "shashi_enterprise"

API_KEY = "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"
INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

MANIFEST_PATH = os.path.join(os.path.dirname(__file__), "collages", "collage_manifest.json")
CSV_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "nvidia_ai_catalog_products.csv")
JSON_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "nvidia_ai_catalog_products.json")

# -----------------------------------------------------------------------------
# NVIDIA Vision API Handler
# -----------------------------------------------------------------------------
def analyze_collage_with_nvidia(image_path: str, product_batch: list) -> list:
    """
    Sends a 10-product grid collage image to NVIDIA Vision AI API.
    Returns parsed list of catalog titles and keywords for each item in the batch.
    """
    if not os.path.exists(image_path):
        print(f"[-] Image not found: {image_path}")
        return []

    with open(image_path, "rb") as f:
        base64_img = base64.b64encode(f.read()).decode("utf-8")

    prompt_text = f"""
You are an expert e-commerce catalog manager for an anime action figure & collectible store.
Analyze the {len(product_batch)} product items shown in this grid image (arranged in 2 rows of 5).

CRITICAL INSTRUCTIONS:
1. IGNORE any placeholder text written under/inside each card. Identify each figure purely from visual image recognition.
2. For each numbered item (#1 to #{len(product_batch)}), provide:
   - "item_number": integer (1 to {len(product_batch)})
   - "correct_catalog_name": "[Anime/Franchise] [Character Name] [Pose/Variant] [Figure/Statue]"
   - "keywords": list of high-converting search tags (franchise, character name, figure scale, anime, action figure)

Output ONLY a JSON array like:
[
  {{
    "item_number": 1,
    "correct_catalog_name": "Dragon Ball Z Super Saiyan Goku Kamehameha Figure",
    "keywords": ["Dragon Ball Z", "Goku", "Super Saiyan", "Action Figure", "Anime Collectible"]
  }}
]
"""

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json"
    }

    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt_text},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_img}"
                        }
                    }
                ]
            }
        ],
        "model": "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
        "max_tokens": 4096,
        "temperature": 0.2
    }

    max_retries = 4
    for attempt in range(1, max_retries + 1):
        try:
            response = requests.post(INVOKE_URL, headers=headers, json=payload, timeout=120)
            if response.status_code == 200:
                res_data = response.json()
                choices = res_data.get("choices", [])
                if not choices:
                    return []

                content = choices[0]["message"]["content"].strip()
                json_match = re.search(r'\[\s*\{.*\}\s*\]', content, re.DOTALL)
                if json_match:
                    content = json_match.group(0)

                parsed = json.loads(content)
                return parsed
            elif response.status_code in (503, 429):
                print(f"    [-] Rate limited (HTTP {response.status_code}). Retrying in 10s (Attempt {attempt}/{max_retries})...")
                time.sleep(10)
            else:
                print(f"    [-] API Error HTTP {response.status_code}: {response.text}")
                return []
        except Exception as e:
            print(f"    [-] Request attempt {attempt} error: {e}")
            time.sleep(5)

    return []

# -----------------------------------------------------------------------------
# Main Batch Processing Pipeline
# -----------------------------------------------------------------------------
def run_nvidia_catalog_renamer():
    if not os.path.exists(MANIFEST_PATH):
        print(f"[-] Manifest file not found: {MANIFEST_PATH}")
        return

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    collages = manifest.get("collages", [])
    print("\n" + "="*80)
    print(" SHASHI ENTERPRISES — NVIDIA VISION AI FULL CATALOG RENAMER")
    print(f" Total Collages to Process: {len(collages)}")
    print("="*80 + "\n")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(schema=SCHEMA_NAME))

    all_catalog_results = []
    db_updated_count = 0

    fieldnames = ["id", "sku", "old_name", "new_catalog_name", "keywords", "collage_batch"]
    csv_file = open(CSV_OUTPUT_PATH, "w", newline="", encoding="utf-8-sig")
    csv_writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    csv_writer.writeheader()
    csv_file.flush()

    for c_idx, collage_info in enumerate(collages, 1):
        file_path = collage_info.get("file_path")
        file_name = collage_info.get("file_name")
        items = collage_info.get("items", [])

        print("-" * 80)
        print(f"[{c_idx}/{len(collages)}] Processing {file_name} ({len(items)} product items)...")

        ai_results = analyze_collage_with_nvidia(file_path, items)
        ai_by_num = {res.get("item_number"): res for res in ai_results if isinstance(res, dict)}

        for local_i, item_manifest in enumerate(items, 1):
            global_idx = item_manifest["global_index"]
            prod_id = item_manifest["id"]
            sku = item_manifest["sku"]
            old_name = item_manifest["name"]

            ai_data = ai_by_num.get(local_i) or {}
            new_name = ai_data.get("correct_catalog_name", "").strip() or old_name
            keywords_list = ai_data.get("keywords", [])
            keywords_str = ", ".join(keywords_list) if isinstance(keywords_list, list) else str(keywords_list)

            # Preserve size/height from old_name if not already present
            height_match = re.search(r'(\d+\s*cm)', old_name, re.IGNORECASE)
            if height_match:
                h_str = height_match.group(1).replace(" ", "")
                if h_str.lower() not in new_name.lower():
                    new_name = f"{new_name} {h_str}"

            new_name = re.sub(r'\s+', ' ', new_name).strip()

            print(f"  #{global_idx:02d} [{sku}]")
            print(f"     Old Name: {old_name}")
            print(f"     New Name: {new_name}")
            print(f"     Keywords: {keywords_str}")

            record = {
                "id": prod_id,
                "sku": sku,
                "old_name": old_name,
                "new_catalog_name": new_name,
                "keywords": keywords_str,
                "collage_batch": file_name
            }
            all_catalog_results.append(record)

            # Write row live to CSV
            csv_writer.writerow(record)
            csv_file.flush()

            # Update Database
            try:
                up_res = supabase.from_("se_products").update({"name": new_name}).eq("id", prod_id).execute()
                if up_res.data:
                    db_updated_count += 1
            except Exception as err:
                print(f"     [-] Error updating DB for {sku}: {err}")

    csv_file.close()

    # Export to JSON
    with open(JSON_OUTPUT_PATH, "w", encoding="utf-8") as json_f:
        json.dump(all_catalog_results, json_f, indent=2, ensure_ascii=False)

    print("\n" + "="*80)
    print(" NVIDIA VISION AI FULL CATALOG PROCESSING COMPLETE!")
    print(f" Total Products Processed: {len(all_catalog_results)}")
    print(f" Database Records Updated: {db_updated_count}")
    print(f" 📄 Final CSV Saved:  {CSV_OUTPUT_PATH}")
    print(f" 📄 Final JSON Saved: {JSON_OUTPUT_PATH}")
    print("="*80 + "\n")

if __name__ == "__main__":
    run_nvidia_catalog_renamer()
