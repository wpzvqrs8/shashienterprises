import os
import sys
import json
from dotenv import load_dotenv
from supabase import create_client, ClientOptions

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
load_dotenv(os.path.join(WORKSPACE_DIR, ".env.local"))

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://vzcarcbjzbaosviuepvb.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(schema="shashi_enterprise"))

res = supabase.from_("se_products").select("sku, name, slug, series, category").order("sku").execute()
products = res.data or []

print(f"Total Products: {len(products)}\n")

fixes = []

for p in products:
    name = p["name"]
    series = p["series"]
    category = p["category"]
    
    expected_series = series
    n_lower = name.lower()
    
    # Precise rules without substring traps
    if "demon slayer" in n_lower or "rengoku" in n_lower or "tomioka" in n_lower or "tanjiro" in n_lower or "nezuko" in n_lower or "zenitsu" in n_lower or "inosuke" in n_lower or "shinobu" in n_lower:
        expected_series = "Demon Slayer"
    elif "solo leveling" in n_lower or "sung jinwoo" in n_lower:
        expected_series = "Solo Leveling"
    elif "tom and jerry" in n_lower or "tom cat" in n_lower or "jerry mouse" in n_lower:
        expected_series = "Tom and Jerry"
    elif "doraemon" in n_lower or "nobita" in n_lower:
        expected_series = "Doraemon"
    elif "crayon shin-chan" in n_lower or "shinnosuke" in n_lower:
        expected_series = "Crayon Shin-chan"
    elif "pop mart" in n_lower or "labubu" in n_lower:
        expected_series = "Pop Mart"
    elif "pokemon" in n_lower or "pikachu" in n_lower or "charizard" in n_lower or "mewtwo" in n_lower:
        expected_series = "Pokemon"
    elif "league of legends" in n_lower or "k/da" in n_lower:
        expected_series = "League of Legends"
    elif "super mario" in n_lower:
        expected_series = "Super Mario Bros"
    elif "god of war" in n_lower or "kratos" in n_lower:
        expected_series = "God of War"
    elif "k-pop" in n_lower or "kpop" in n_lower:
        expected_series = "K-Pop"
    elif "dragon ball super" in n_lower or "ultra instinct" in n_lower or "goku black" in n_lower or "super saiyan rose" in n_lower or "broly" in n_lower:
        expected_series = "Dragon Ball Super"
    elif "dragon ball gt" in n_lower or "ssj4" in n_lower:
        expected_series = "Dragon Ball GT"
    elif "dragon ball z" in n_lower or "vegeta" in n_lower or "majin buu" in n_lower or "kamehameha" in n_lower:
        expected_series = "Dragon Ball Z"
    elif "dragon ball" in n_lower or "son goku" in n_lower or "goku" in n_lower or "shenron" in n_lower or "gogeta" in n_lower:
        expected_series = "Dragon Ball"
    elif "naruto" in n_lower or "sasuke" in n_lower or "itachi" in n_lower or "kakashi" in n_lower or "akatsuki" in n_lower or "gaara" in n_lower or "minato" in n_lower or "tsunade" in n_lower or "orochimaru" in n_lower or "jiraiya" in n_lower or "obito" in n_lower or "pain" in n_lower:
        expected_series = "Naruto Shippuden"
    elif "one piece" in n_lower or "zoro" in n_lower or "luffy" in n_lower or "yamato" in n_lower or "crocodile" in n_lower or "katakuri" in n_lower or "brook" in n_lower or "chopper" in n_lower:
        expected_series = "One Piece"
    elif "jujutsu kaisen" in n_lower or "gojo" in n_lower or "yuta" in n_lower or "geto" in n_lower or "maki" in n_lower or "todo" in n_lower or "megumi" in n_lower or "nobara" in n_lower:
        expected_series = "Jujutsu Kaisen"
    elif "hunter x hunter" in n_lower or "killua" in n_lower or "gon" in n_lower or "hisoka" in n_lower or "chrollo" in n_lower or "kurapika" in n_lower or "netero" in n_lower or "meruem" in n_lower:
        expected_series = "Hunter x Hunter"
    elif "bleach" in n_lower or "ulquiorra" in n_lower or "ichigo" in n_lower or "aizen" in n_lower:
        expected_series = "Bleach"
    elif "one punch man" in n_lower or "saitama" in n_lower or "genos" in n_lower or "garou" in n_lower:
        expected_series = "One Punch Man"
    elif "chainsaw man" in n_lower or "denji" in n_lower or "pochita" in n_lower or "makima" in n_lower or "power fiend" in n_lower or "hayakawa" in n_lower:
        expected_series = "Chainsaw Man"
    elif "marvel" in n_lower or "spider-man" in n_lower or "iron man" in n_lower or "avengers" in n_lower or "x-men" in n_lower or "groot" in n_lower or "hulk" in n_lower or "thor" in n_lower or "captain america" in n_lower:
        expected_series = "Marvel"
    elif "dc comics" in n_lower or "batman" in n_lower or "joker" in n_lower or "superman" in n_lower:
        expected_series = "DC Comics"

    if expected_series != series:
        print(f"FIX NEEDED [{p['sku']}]: '{name}' -> Current Series: '{series}' | Correct Series: '{expected_series}'")
        fixes.append((p['sku'], expected_series))

print(f"\nTotal fixes identified: {len(fixes)}")
for sku, new_s in fixes:
    supabase.from_("se_products").update({"series": new_s}).eq("sku", sku).execute()
    print(f"  [✓] Updated {sku} series to '{new_s}'")

print("\nVerification done.")
