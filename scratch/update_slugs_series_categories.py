import os
import sys
import json
import re
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

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_PATH = os.path.join(WORKSPACE_DIR, ".env.local")
load_dotenv(dotenv_path=ENV_PATH)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://vzcarcbjzbaosviuepvb.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SCHEMA_NAME = "shashi_enterprise"

FRANCHISE_PATTERNS = [
    ("Dragon Ball Z", [r"dragon ball z", r"dbz", r"gohan", r"majin buu", r"cell saga", r"namek"]),
    ("Dragon Ball Super", [r"dragon ball super", r"dbs", r"ultra instinct", r"goku black", r"super saiyan rose", r"broly movie"]),
    ("Dragon Ball GT", [r"dragon ball gt", r"ssj4", r"super saiyan 4"]),
    ("Dragon Ball", [r"dragon ball", r"goku", r"vegeta", r"gohan", r"shenron", r"broly", r"gogeta"]),
    ("Naruto Shippuden", [r"naruto shippuden", r"naruto", r"sasuke", r"itachi", r"kakashi", r"akatsuki", r"gaara", r"minato", r"tsunade", r"orochimaru", r"jiraiya", r"obito", r"pain yahiko"]),
    ("One Piece", [r"one piece", r"roronoa zoro", r"luffy", r"monkey d\. luffy", r"yamato", r"crocodile", r"katakuri", r"brook soul king", r"chopper"]),
    ("Demon Slayer", [r"demon slayer", r"kimetsu no yaiba", r"giyu tomioka", r"rengoku", r"tanjiro", r"nezuko", r"zenitsu", r"inosuke", r"hashira", r"shinobu", r"makima"]),
    ("Jujutsu Kaisen", [r"jujutsu kaisen", r"jjk", r"satoru gojo", r"gojo", r"yuta okkotsu", r"suguru geto", r"maki zenin", r"aoi todo", r"megumi", r"nobara"]),
    ("Solo Leveling", [r"solo leveling", r"sung jinwoo", r"shadow monarch"]),
    ("Tom and Jerry", [r"tom and jerry", r"tom cat", r"jerry mouse", r"tom riding", r"jerry riding"]),
    ("Hunter x Hunter", [r"hunter x hunter", r"killua", r"gon freecss", r"hisoka", r"chrollo", r"kurapika", r"netero", r"meruem"]),
    ("Bleach", [r"bleach", r"ulquiorra", r"ichigo", r"aizen", r"bankai"]),
    ("Marvel", [r"marvel", r"spider-man", r"iron man", r"avengers", r"x-men", r"captain america", r"groot", r"hulk", r"thor"]),
    ("DC Comics", [r"dc comics", r"batman", r"superman", r"joker", r"dark knight"]),
    ("Doraemon", [r"doraemon", r"nobita"]),
    ("Crayon Shin-chan", [r"crayon shin-chan", r"shinnosuke"]),
    ("Pokemon", [r"pokemon", r"pikachu", r"charizard", r"mewtwo"]),
    ("League of Legends", [r"league of legends", r"k/da", r"ahri", r"akali"]),
    ("Super Mario Bros", [r"super mario", r"mario"]),
    ("God of War", [r"god of war", r"kratos"]),
    ("One Punch Man", [r"one punch man", r"saitama", r"genos", r"garou"]),
    ("Chainsaw Man", [r"chainsaw man", r"denji", r"pochita", r"makima", r"power fiend"]),
    ("Pop Mart", [r"pop mart", r"labubu"]),
    ("K-Pop", [r"k-pop", r"kpop"])
]

def derive_slug(product_name: str) -> str:
    """Derives a clean, URL-safe slug from product name."""
    s = product_name.lower().strip()
    s = re.sub(r'[^a-z0-9\s\-]', '', s)
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')

def derive_franchise(product_name: str) -> str:
    """Derives the accurate Franchise/Series based on product name."""
    name_lower = product_name.lower()
    for series_name, patterns in FRANCHISE_PATTERNS:
        for p in patterns:
            if re.search(p, name_lower):
                return series_name
    return "Anime Collectibles"

def derive_category(product_name: str) -> str:
    """Derives the Category Type based on product name."""
    name_lower = product_name.lower()
    if any(w in name_lower for w in ["led", "light up", "light box", "diorama", "moon silhouette", "aura diorama"]):
        return "LED Dioramas & Displays"
    if any(w in name_lower for w in ["katana", "sword", "prop", "weapon"]):
        return "Weapons & Prop Replicas"
    if any(w in name_lower for w in ["blind box", "pop mart"]):
        return "Blind Box Toys"
    if any(w in name_lower for w in ["statue"]):
        return "Resin & Scale Statues"
    if any(w in name_lower for w in ["set", "pack", "collection", "band", "group"]):
        return "Collectible Figure Sets"
    return "Action Figures"

def update_slugs_and_categories():
    print("\n" + "="*80)
    print(" SHASHI ENTERPRISES — RE-CLASSIFYING SLUGS, SERIES & CATEGORIES")
    print("="*80 + "\n")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(schema=SCHEMA_NAME))
    res = supabase.from_("se_products").select("id, sku, name, slug, series, category").order("sku").execute()
    products = res.data or []

    print(f"[+] Loaded {len(products)} products from Supabase.\n")

    updated_count = 0
    used_slugs = set()

    for idx, prod in enumerate(products, 1):
        prod_id = prod["id"]
        sku = prod["sku"]
        name = prod["name"]
        old_slug = prod.get("slug", "")
        old_series = prod.get("series", "")
        old_category = prod.get("category", "")

        new_slug = derive_slug(name)
        # Prevent slug collision
        if new_slug in used_slugs:
            new_slug = f"{new_slug}-{sku.lower()}"
        used_slugs.add(new_slug)

        new_series = derive_franchise(name)
        new_category = derive_category(name)

        print(f"[{idx}/{len(products)}] {sku}: {name}")
        print(f"    Slug:     '{old_slug}' -> '{new_slug}'")
        print(f"    Series:   '{old_series}' -> '{new_series}'")
        print(f"    Category: '{old_category}' -> '{new_category}'")

        try:
            up = supabase.from_("se_products").update({
                "slug": new_slug,
                "series": new_series,
                "category": new_category
            }).eq("id", prod_id).execute()

            if up.data:
                updated_count += 1
                print("    [✓] Database updated.")
        except Exception as e:
            print(f"    [-] Error updating {sku}: {e}")

        print("-" * 60)

    print("\n" + "="*80)
    print(" RE-CLASSIFICATION COMPLETED SUCCESSFULLY!")
    print(f" Total Products Processed: {len(products)}")
    print(f" Database Records Updated: {updated_count}")
    print("="*80 + "\n")

if __name__ == "__main__":
    update_slugs_and_categories()
