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

def derive_slug(name: str) -> str:
    s = name.lower().strip()
    s = re.sub(r'[^a-z0-9\s\-]', '', s)
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')

def classify_series(name: str) -> str:
    n = name.lower()
    
    # Specific series mapping based on exact AI knowledge of characters & franchises
    if "k-pop" in n or "kpop" in n:
        return "K-Pop"
    if "solo leveling" in n or "sung jinwoo" in n:
        return "Solo Leveling"
    if "tom and jerry" in n or "tom & jerry" in n or "tom cat" in n or "jerry mouse" in n:
        return "Tom and Jerry"
    if "doraemon" in n or "nobita" in n:
        return "Doraemon"
    if "crayon shin-chan" in n or "shinnosuke" in n:
        return "Crayon Shin-chan"
    if "pop mart" in n or "labubu" in n:
        return "Pop Mart"
    if "pokemon" in n or "pikachu" in n or "charizard" in n or "mewtwo" in n:
        return "Pokemon"
    if "league of legends" in n or "k/da" in n or "ahri" in n:
        return "League of Legends"
    if "super mario" in n or "mario" in n:
        return "Super Mario Bros"
    if "god of war" in n or "kratos" in n:
        return "God of War"
    
    # Dragon Ball sub-franchises
    if "dragon ball super" in n or "ultra instinct" in n or "goku black" in n or "super saiyan rose" in n or "broly" in n:
        return "Dragon Ball Super"
    if "dragon ball gt" in n or "ssj4" in n or "super saiyan 4" in n:
        return "Dragon Ball GT"
    if "dragon ball z" in n or "dbz" in n or "vegeta" in n or "majin buu" in n or "cell" in n or "gohan" in n or "kamehameha" in n:
        return "Dragon Ball Z"
    if "dragon ball" in n or "goku" in n or "shenron" in n or "gogeta" in n:
        return "Dragon Ball"
        
    # Naruto
    if "naruto" in n or "sasuke" in n or "itachi" in n or "kakashi" in n or "akatsuki" in n or "gaara" in n or "minato" in n or "tsunade" in n or "orochimaru" in n or "jiraiya" in n or "obito" in n or "pain yahiko" in n:
        return "Naruto Shippuden"
        
    # One Piece
    if "one piece" in n or "zoro" in n or "luffy" in n or "yamato" in n or "crocodile" in n or "katakuri" in n or "brook" in n or "chopper" in n:
        return "One Piece"
        
    # Demon Slayer
    if "demon slayer" in n or "kimetsu" in n or "tomioka" in n or "rengoku" in n or "tanjiro" in n or "nezuko" in n or "zenitsu" in n or "inosuke" in n or "shinobu" in n:
        return "Demon Slayer"
        
    # Jujutsu Kaisen
    if "jujutsu kaisen" in n or "jjk" in n or "gojo" in n or "yuta" in n or "geto" in n or "maki" in n or "todo" in n or "megumi" in n or "nobara" in n:
        return "Jujutsu Kaisen"
        
    # Hunter x Hunter
    if "hunter x hunter" in n or "killua" in n or "gon" in n or "hisoka" in n or "chrollo" in n or "kurapika" in n or "netero" in n or "meruem" in n:
        return "Hunter x Hunter"
        
    # Bleach
    if "bleach" in n or "ulquiorra" in n or "ichigo" in n or "aizen" in n:
        return "Bleach"
        
    # One Punch Man
    if "one punch man" in n or "saitama" in n or "genos" in n or "garou" in n:
        return "One Punch Man"
        
    # Chainsaw Man
    if "chainsaw man" in n or "denji" in n or "pochita" in n or "makima" in n or "power fiend" in n or "hayakawa" in n:
        return "Chainsaw Man"
        
    # Marvel
    if "marvel" in n or "spider-man" in n or "iron man" in n or "avengers" in n or "x-men" in n or "captain america" in n or "groot" in n or "hulk" in n or "thor" in n:
        return "Marvel"
        
    # DC Comics
    if "dc comics" in n or "batman" in n or "joker" in n or "superman" in n:
        return "DC Comics"
        
    return "Anime Collectibles"

def classify_category(name: str) -> str:
    n = name.lower()
    
    if any(w in n for w in ["led", "light up", "diorama", "silhouette"]):
        return "LED Dioramas & Displays"
    if any(w in n for w in ["katana", "sword", "weapon", "prop"]):
        return "Weapons & Prop Replicas"
    if any(w in n for w in ["blind box", "pop mart"]):
        return "Blind Box Toys"
    if any(w in n for w in ["statue"]):
        return "Resin & Scale Statues"
    if any(w in n for w in ["set", "pack", "collection", "band", "duo"]):
        return "Collectible Figure Sets"
    return "Action Figures"

def process_all_products():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(schema=SCHEMA_NAME))
    
    with open('scratch/current_90_products.json', 'r', encoding='utf-8') as f:
        products = json.load(f)
        
    print(f"Loaded {len(products)} products from local cache.\n")
    
    used_slugs = set()
    updates = []
    
    for p in products:
        pid = p["id"]
        sku = p["sku"]
        name = p["name"]
        
        slug = derive_slug(name)
        if slug in used_slugs:
            slug = f"{slug}-{sku.lower()}"
        used_slugs.add(slug)
        
        series = classify_series(name)
        category = classify_category(name)
        
        updates.append({
            "id": pid,
            "sku": sku,
            "name": name,
            "slug": slug,
            "series": series,
            "category": category
        })
        
    print("AI Classification Summary (First 15 items):")
    for item in updates[:15]:
        print(f"SKU: {item['sku']} | Name: {item['name']}")
        print(f"  -> Slug:     {item['slug']}")
        print(f"  -> Series:   {item['series']}")
        print(f"  -> Category: {item['category']}\n")
        
    # Execute batch database update
    print("Updating Supabase database...")
    success_count = 0
    for u in updates:
        res = supabase.from_("se_products").update({
            "slug": u["slug"],
            "series": u["series"],
            "category": u["category"]
        }).eq("id", u["id"]).execute()
        if res.data:
            success_count += 1
            
    print(f"\n[SUCCESS] Updated {success_count}/{len(updates)} records in Supabase se_products.")

if __name__ == "__main__":
    process_all_products()
