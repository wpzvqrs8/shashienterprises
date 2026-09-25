import os
import sys
import json
import csv
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

CSV_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "scraped_catalog_products.csv")
JSON_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "scraped_catalog_products.json")

USER_PROVIDED_ITEMS = [
  {
    "item_number": 1,
    "sku": "SE-ANM-001",
    "correct_catalog_name": "K-Pop Idol Chibi Collectible Figure 6-Piece Set",
    "keywords": ["K-Pop", "Idol", "Chibi", "Figure Set", "Collectible", "Music", "Blind Box Style"]
  },
  {
    "item_number": 2,
    "sku": "SE-ANM-002",
    "correct_catalog_name": "Solo Leveling Sung Jinwoo Dual Daggers Action Figure",
    "keywords": ["Solo Leveling", "Sung Jinwoo", "Hunter", "Shadow Monarch", "Anime Figure", "Action Figure", "Manhwa"]
  },
  {
    "item_number": 3,
    "sku": "SE-ANM-004",
    "correct_catalog_name": "Dragon Ball Z Vegeta Saiyan Armor Standing Figure 27cm",
    "keywords": ["Dragon Ball Z", "Vegeta", "Saiyan Prince", "Anime Figure", "27cm", "Action Figure", "DBZ Collectible"]
  },
  {
    "item_number": 4,
    "sku": "SE-ANM-005",
    "correct_catalog_name": "Dragon Ball Super Mastered Ultra Instinct Goku Figure",
    "keywords": ["Dragon Ball Super", "Goku", "Ultra Instinct", "MUI", "Anime Figure", "Statue", "Aura Base"]
  },
  {
    "item_number": 5,
    "sku": "SE-ANM-007",
    "correct_catalog_name": "One Piece Roronoa Zoro Wano Three Sword Style Haki Figure 22cm",
    "keywords": ["One Piece", "Roronoa Zoro", "Wano Country", "Three Sword Style", "Haki", "Anime Figure", "Statue"]
  },
  {
    "item_number": 6,
    "sku": "SE-ANM-008",
    "correct_catalog_name": "Naruto Shippuden Sasuke Uchiha Akatsuki Cloak Figure",
    "keywords": ["Naruto Shippuden", "Sasuke Uchiha", "Akatsuki", "Sharingan", "Anime Figure", "Action Figure", "Shinobi"]
  },
  {
    "item_number": 7,
    "sku": "SE-ANM-009",
    "correct_catalog_name": "Tom and Jerry Tom Riding Red Motorcycle Collectible Figure 12.5cm",
    "keywords": ["Tom and Jerry", "Tom Cat", "Motorcycle", "Cartoon", "Collectible", "Figure", "Desk Toy"]
  },
  {
    "item_number": 8,
    "sku": "SE-ANM-010",
    "correct_catalog_name": "Naruto Shippuden Itachi Uchiha Crow Genjutsu Statue",
    "keywords": ["Naruto Shippuden", "Itachi Uchiha", "Akatsuki", "Crow Genjutsu", "Anime Figure", "Statue", "Collectible"]
  },
  {
    "item_number": 9,
    "sku": "SE-ANM-012",
    "correct_catalog_name": "Demon Slayer Giyu Tomioka Water Breathing LED Statue 10cm",
    "keywords": ["Demon Slayer", "Kimetsu no Yaiba", "Giyu Tomioka", "Water Hashira", "LED", "Anime Figure", "Statue"]
  },
  {
    "item_number": 10,
    "sku": "SE-ANM-013",
    "correct_catalog_name": "Demon Slayer Kyojuro Rengoku Flame Breathing LED Statue 14cm",
    "keywords": ["Demon Slayer", "Kimetsu no Yaiba", "Kyojuro Rengoku", "Flame Hashira", "LED", "Anime Figure", "Statue"]
  },
  {
    "item_number": 11,
    "sku": "SE-ANM-014",
    "correct_catalog_name": "Pop Mart Labubu The Monsters Macaron Vinyl Face Blind Box Figure",
    "keywords": ["Pop Mart", "Labubu", "Blind Box", "The Monsters", "Designer Toy", "Collectible Figure"]
  },
  {
    "item_number": 12,
    "sku": "SE-ANM-015",
    "correct_catalog_name": "Hunter x Hunter Killua Zoldyck Godspeed Lightning Effect Statue",
    "keywords": ["Hunter x Hunter", "Killua Zoldyck", "Godspeed", "Anime Statue", "Lightning Effect", "Nen"]
  },
  {
    "item_number": 13,
    "sku": "SE-ANM-016",
    "correct_catalog_name": "Tom and Jerry Jerry Riding Yellow Scooter Figure 13cm",
    "keywords": ["Tom and Jerry", "Jerry Mouse", "Motorcycle Scooter", "Cartoon Figure", "Collectible", "Classic Animation"]
  },
  {
    "item_number": 14,
    "sku": "SE-ANM-017",
    "correct_catalog_name": "Dragon Ball Z Goku Super Saiyan Battle Damaged Figure 43cm",
    "keywords": ["Dragon Ball Z", "Goku", "Super Saiyan", "Battle Damaged", "Anime Figure", "DBZ Collectible"]
  },
  {
    "item_number": 15,
    "sku": "SE-ANM-018",
    "correct_catalog_name": "Dragon Ball Z Son Goku & Family Kamehameha with Shenron Base Statue",
    "keywords": ["Dragon Ball Z", "Son Goku", "Shenron", "Kamehameha", "Anime Statue", "Diorama"]
  },
  {
    "item_number": 16,
    "sku": "SE-ANM-019",
    "correct_catalog_name": "One Piece Monkey D. Luffy Multiple Gears Evolution Set Figure Set",
    "keywords": ["One Piece", "Monkey D. Luffy", "Gear Forms", "Anime Figure Set", "Pirate King", "Action Figure"]
  },
  {
    "item_number": 17,
    "sku": "SE-ANM-020",
    "correct_catalog_name": "Dragon Ball Super Goku & Vegeta Set Super Saiyan Blue Evolution Figure Set 18cm",
    "keywords": ["Dragon Ball Super", "Goku", "Vegeta", "Broly", "Super Saiyan Blue", "Anime Figure Set"]
  },
  {
    "item_number": 18,
    "sku": "SE-ANM-021",
    "correct_catalog_name": "Naruto Shippuden Uzumaki Naruto Evolution Forms Set Figure Set 10cm",
    "keywords": ["Naruto Shippuden", "Uzumaki Naruto", "Kurama Mode", "Sage Mode", "Anime Figure Set", "Shinobi"]
  },
  {
    "item_number": 19,
    "sku": "SE-ANM-023",
    "correct_catalog_name": "Solo Leveling Sung Jinwoo Dual Dagger Long Coat Figure",
    "keywords": ["Solo Leveling", "Sung Jinwoo", "Shadow Monarch", "Anime Figure", "Manhwa", "Action Figure"]
  },
  {
    "item_number": 20,
    "sku": "SE-ANM-024",
    "correct_catalog_name": "Dragon Ball Super Goku Vegeta Broly Super Saiyan Form Set Figure Set 18cm",
    "keywords": ["Dragon Ball Super", "Goku", "Vegeta", "Broly", "Super Saiyan", "Anime Figure Set"]
  },
  {
    "item_number": 21,
    "sku": "SE-ANM-025",
    "correct_catalog_name": "Naruto Shippuden Akatsuki Members Chibi Action Pose Figure Set",
    "keywords": ["Naruto Shippuden", "Akatsuki", "Pain", "Itachi", "Chibi Figure", "Anime Set"]
  },
  {
    "item_number": 22,
    "sku": "SE-ANM-026",
    "correct_catalog_name": "Doraemon & Friends Musical Instruments Band Figure Set 11.5cm",
    "keywords": ["Doraemon", "Nobita", "Music Band", "Anime Figure Set", "Cartoon Collectible", "Chibi"]
  },
  {
    "item_number": 23,
    "sku": "SE-ANM-027",
    "correct_catalog_name": "Super Mario Bros Mario & Friends Classic Character Collection Figure Set",
    "keywords": ["Super Mario Bros", "Mario", "Luigi", "Nintendo", "Video Game Figure", "Action Figure Set"]
  },
  {
    "item_number": 24,
    "sku": "SE-ANM-029",
    "correct_catalog_name": "One Piece Monkey D. Luffy Onigashima Captain Cloak Figure 16cm",
    "keywords": ["One Piece", "Monkey D. Luffy", "Wano Country", "Captain Cloak", "Anime Figure", "Action Figure"]
  },
  {
    "item_number": 25,
    "sku": "SE-ANM-030",
    "correct_catalog_name": "Naruto Shippuden Kage & Shinobi Standing Pose Figure Set 17cm",
    "keywords": ["Naruto Shippuden", "Gaara", "Minato", "Hokage", "Anime Figure Set", "Shinobi"]
  },
  {
    "item_number": 26,
    "sku": "SE-ANM-031",
    "correct_catalog_name": "Pokemon Pikachu & Starters Battle Effect Figure Set",
    "keywords": ["Pokemon", "Pikachu", "Charizard", "Mewtwo", "Battle Effect", "Anime Figure Set"]
  },
  {
    "item_number": 27,
    "sku": "SE-ANM-032",
    "correct_catalog_name": "K-Pop Girl Group Idols Chibi Boxed Style Figure Set",
    "keywords": ["K-Pop", "Idol Group", "Chibi Figure", "Blind Box", "Girl Group", "Collectible Toy"]
  },
  {
    "item_number": 28,
    "sku": "SE-ANM-033",
    "correct_catalog_name": "Demon Slayer Kamado Squad & Hashira Chibi Sitting Pose Figure Set",
    "keywords": ["Demon Slayer", "Tanjiro", "Nezuko", "Hashira", "Chibi Figure", "Anime Set"]
  },
  {
    "item_number": 29,
    "sku": "SE-ANM-034",
    "correct_catalog_name": "Jujutsu Kaisen Gojo & Students Action Pose Chibi Figure Set",
    "keywords": ["Jujutsu Kaisen", "Satoru Gojo", "Yuji Itadori", "Action Chibi", "Anime Figure Set", "JJK"]
  },
  {
    "item_number": 30,
    "sku": "SE-ANM-035",
    "correct_catalog_name": "Dragon Ball Kid Goku Power Pole Stance Figure Set",
    "keywords": ["Dragon Ball", "Kid Goku", "Power Pole", "Classic Anime", "Figure Set", "Martial Arts"]
  },
  {
    "item_number": 31,
    "sku": "SE-ANM-036",
    "correct_catalog_name": "League of Legends K/DA Group Pop Star Outfits Chibi Figure Set 10.5cm",
    "keywords": ["League of Legends", "K/DA", "Ahri", "Akali", "Gaming Figure", "Chibi Set"]
  },
  {
    "item_number": 32,
    "sku": "SE-ANM-037",
    "correct_catalog_name": "Naruto Shippuden Uchiha & Shinobi Big Head Chibi Figure Set",
    "keywords": ["Naruto Shippuden", "Kakashi", "Itachi", "Uchiha", "Chibi Figure", "Anime Set"]
  },
  {
    "item_number": 33,
    "sku": "SE-ANM-038",
    "correct_catalog_name": "Marvel Avengers & X-Men Superheroes Collection Action Figure Set 17cm",
    "keywords": ["Marvel", "Avengers", "X-Men", "Spider-Man", "Iron Man", "Action Figure Set"]
  },
  {
    "item_number": 34,
    "sku": "SE-ANM-039",
    "correct_catalog_name": "Demon Slayer Main Cast & Hashira Action Pose Figure Set 9-10cm",
    "keywords": ["Demon Slayer", "Tanjiro", "Inosuke", "Zenitsu", "Anime Figure Set", "Action Pose"]
  },
  {
    "item_number": 35,
    "sku": "SE-ANM-040",
    "correct_catalog_name": "Naruto Shippuden Akatsuki & Sasuke Standing Pose Figure Set 18-20cm",
    "keywords": ["Naruto Shippuden", "Akatsuki", "Sasuke", "Kakashi", "Anime Figure Set", "Action Figure"]
  },
  {
    "item_number": 36,
    "sku": "SE-ANM-041",
    "correct_catalog_name": "Naruto Shippuden Hokage & Sannin Standing Pose Figure Set 19cm",
    "keywords": ["Naruto Shippuden", "Jiraiya", "Tsunade", "Hokage", "Sannin", "Anime Figure Set"]
  },
  {
    "item_number": 37,
    "sku": "SE-ANM-042",
    "correct_catalog_name": "Demon Slayer The Hashira Kneeling Meeting Pose Figure Set 10-15cm",
    "keywords": ["Demon Slayer", "Hashira", "Rengoku", "Shinobu", "Kneeling Pose", "Anime Figure Set"]
  },
  {
    "item_number": 38,
    "sku": "SE-ANM-043",
    "correct_catalog_name": "Pokemon Starters & Legendaries Action Pose Figure Set",
    "keywords": ["Pokemon", "Charizard", "Blastoise", "Venusaur", "Legendary", "Anime Figure Set"]
  },
  {
    "item_number": 39,
    "sku": "SE-ANM-044",
    "correct_catalog_name": "Demon Slayer Kyojuro Rengoku Flame Breathing Stance Figure 16cm",
    "keywords": ["Demon Slayer", "Kyojuro Rengoku", "Flame Hashira", "Anime Figure", "Breathing Style", "Action Pose"]
  },
  {
    "item_number": 40,
    "sku": "SE-ANM-045",
    "correct_catalog_name": "Naruto Shippuden Team 7 & Uchiha Action Stance Figure Set 7-19cm",
    "keywords": ["Naruto Shippuden", "Team 7", "Sasuke", "Itachi", "Anime Figure Set", "Action Pose"]
  },
  {
    "item_number": 41,
    "sku": "SE-ANM-046",
    "correct_catalog_name": "Naruto Shippuden Main Characters Standing Pose Figure Set 19-20cm",
    "keywords": ["Naruto Shippuden", "Naruto", "Sasuke", "Kakashi", "Anime Figure Set", "Action Figure"]
  },
  {
    "item_number": 42,
    "sku": "SE-ANM-047",
    "correct_catalog_name": "Jujutsu Kaisen Gojo & Students Standing Pose Figure Set",
    "keywords": ["Jujutsu Kaisen", "Gojo", "Megumi", "Nobara", "Anime Figure Set", "JJK Collectible"]
  },
  {
    "item_number": 43,
    "sku": "SE-ANM-048",
    "correct_catalog_name": "Dragon Ball Z Heroes & Villains Action Pose Figure Set 16cm",
    "keywords": ["Dragon Ball Z", "Gogeta", "Vegito", "Broly", "Anime Figure Set", "Action Figure"]
  },
  {
    "item_number": 44,
    "sku": "SE-ANM-049",
    "correct_catalog_name": "Dragon Ball Super Tournament of Power & Future Saga Figure Set 16cm",
    "keywords": ["Dragon Ball Super", "Ultra Instinct Goku", "Goku Black", "Jiren", "Anime Figure Set", "DBS"]
  },
  {
    "item_number": 45,
    "sku": "SE-ANM-050",
    "correct_catalog_name": "Naruto Shippuden Shinobi Assorted Standing Pose Figure Set 10cm",
    "keywords": ["Naruto Shippuden", "Minato", "Kakashi", "Shinobi", "Anime Figure Set", "Standing Pose"]
  },
  {
    "item_number": 46,
    "sku": "SE-ANM-051",
    "correct_catalog_name": "Dragon Ball Z Goku & Majin Vegeta Super Saiyan Stance Statue Set 32cm",
    "keywords": ["Dragon Ball Z", "Majin Vegeta", "Goku", "Super Saiyan", "Anime Statue Set", "DBZ"]
  },
  {
    "item_number": 47,
    "sku": "SE-ANM-052",
    "correct_catalog_name": "One Piece Roronoa Zoro Enma Purple Haki Statue",
    "keywords": ["One Piece", "Roronoa Zoro", "Enma", "Wano", "Anime Statue", "Haki Effect"]
  },
  {
    "item_number": 48,
    "sku": "SE-ANM-054",
    "correct_catalog_name": "Dragon Ball Son Goku Adult with Power Pole Figure 23cm",
    "keywords": ["Dragon Ball", "Son Goku", "Power Pole", "Anime Figure", "Martial Arts", "DBZ"]
  },
  {
    "item_number": 49,
    "sku": "SE-ANM-055",
    "correct_catalog_name": "Dragon Ball Z Teen Gohan Super Saiyan 2 Aura Statue",
    "keywords": ["Dragon Ball Z", "Teen Gohan", "Super Saiyan 2", "Aura Effect", "Anime Statue", "Cell Games"]
  },
  {
    "item_number": 50,
    "sku": "SE-ANM-057",
    "correct_catalog_name": "Jujutsu Kaisen Satoru Gojo Unblindfolded Stance Figure 30cm",
    "keywords": ["Jujutsu Kaisen", "Satoru Gojo", "Limitless", "Anime Figure", "JJK Statue", "Unblindfolded"]
  },
  {
    "item_number": 51,
    "sku": "SE-ANM-058",
    "correct_catalog_name": "Naruto Shippuden Team 7 & Itachi Action Stance Figure Set",
    "keywords": ["Naruto Shippuden", "Kakashi", "Itachi", "Sasuke", "Anime Figure Set", "Action Stance"]
  },
  {
    "item_number": 52,
    "sku": "SE-ANM-059",
    "correct_catalog_name": "One Piece Monkey D. Luffy Gear 5 Sun God Nika Statue",
    "keywords": ["One Piece", "Luffy Gear 5", "Sun God Nika", "Joyboy", "Anime Statue", "Awakening"]
  },
  {
    "item_number": 53,
    "sku": "SE-ANM-060",
    "correct_catalog_name": "Dragon Ball Z Vegeta Super Saiyan Arms Crossed Figure 33cm",
    "keywords": ["Dragon Ball Z", "Vegeta", "Super Saiyan", "Saiyan Prince", "Anime Figure", "Large Scale"]
  },
  {
    "item_number": 54,
    "sku": "SE-ANM-061",
    "correct_catalog_name": "One Piece Yamato Thunder Bagua Attack Statue",
    "keywords": ["One Piece", "Yamato", "Thunder Bagua", "Kaido's Son", "Anime Statue", "Wano Country"]
  },
  {
    "item_number": 55,
    "sku": "SE-ANM-064",
    "correct_catalog_name": "Dragon Ball Z Son Goku Kamehameha Light Up Box Diorama",
    "keywords": ["Dragon Ball Z", "Goku", "Kamehameha", "LED Light Box", "Diorama", "Anime Display"]
  },
  {
    "item_number": 56,
    "sku": "SE-ANM-066",
    "correct_catalog_name": "One Piece Monkey D. Luffy Gear 5 Moon Silhouette LED Statue",
    "keywords": ["One Piece", "Luffy Gear 5", "Nika", "Moon Silhouette", "LED Statue", "Anime Diorama"]
  },
  {
    "item_number": 57,
    "sku": "SE-ANM-068",
    "correct_catalog_name": "God of War Kratos Multiple Armors Collection Action Figure Set",
    "keywords": ["God of War", "Kratos", "Blades of Chaos", "Leviathan Axe", "Action Figure Set", "Gaming Collectible"]
  },
  {
    "item_number": 58,
    "sku": "SE-ANM-069",
    "correct_catalog_name": "Crayon Shin-chan Shinnosuke Nohara Sleeping Bag Roll Figure 10cm",
    "keywords": ["Crayon Shin-chan", "Shinnosuke", "Sleeping Bag", "Anime Figure", "Comedy Cartoon", "Collectible Toy"]
  },
  {
    "item_number": 59,
    "sku": "SE-ANM-070",
    "correct_catalog_name": "Dragon Ball GT Gogeta Super Saiyan 4 Kamehameha Figure",
    "keywords": ["Dragon Ball GT", "Gogeta", "Super Saiyan 4", "Big Bang Kamehameha", "Anime Figure", "SSJ4"]
  },
  {
    "item_number": 60,
    "sku": "SE-ANM-071",
    "correct_catalog_name": "Marvel Spider-Man Crouching on Gargoyle Statue",
    "keywords": ["Marvel", "Spider-Man", "Gargoyle", "Superhero Statue", "Comic Collectible", "Web Slinger"]
  },
  {
    "item_number": 61,
    "sku": "SE-ANM-072",
    "correct_catalog_name": "Dragon Ball Z Goku & Kid Gohan Piggyback Ride Figure 30cm",
    "keywords": ["Dragon Ball Z", "Goku", "Kid Gohan", "Piggyback", "Anime Figure", "Father and Son"]
  },
  {
    "item_number": 62,
    "sku": "SE-ANM-073",
    "correct_catalog_name": "Marvel Spider-Man Iron Spider Armor Action Figure Box Set",
    "keywords": ["Marvel", "Spider-Man", "Iron Spider", "Action Figure", "Boxed Set", "MCU Collectible"]
  },
  {
    "item_number": 63,
    "sku": "SE-ANM-074",
    "correct_catalog_name": "Dragon Ball Super Goku Black Super Saiyan Rose Masked Figure 30cm",
    "keywords": ["Dragon Ball Super", "Goku Black", "Super Saiyan Rose", "Masked Saiyan", "Anime Figure", "DBS Villain"]
  },
  {
    "item_number": 64,
    "sku": "SE-ANM-075",
    "correct_catalog_name": "Marvel Spider-Man Iron Spider with Waldo Tentacles Statue",
    "keywords": ["Marvel", "Spider-Man", "Iron Spider", "Waldo Tentacles", "Superhero Statue", "Avengers Infinity War"]
  },
  {
    "item_number": 65,
    "sku": "SE-ANM-076",
    "correct_catalog_name": "Dragon Ball GT Goku & Vegeta Super Saiyan 4 Duo Figure Set",
    "keywords": ["Dragon Ball GT", "Goku", "Vegeta", "Super Saiyan 4", "Anime Figure Set", "SSJ4 Duo"]
  },
  {
    "item_number": 66,
    "sku": "SE-ANM-077",
    "correct_catalog_name": "DC Comics Batman The Dark Knight Suit Action Figure",
    "keywords": ["DC Comics", "Batman", "The Dark Knight", "Action Figure", "Bruce Wayne", "Superhero Collectible"]
  },
  {
    "item_number": 67,
    "sku": "SE-ANM-078",
    "correct_catalog_name": "Dragon Ball Z Goku Super Saiyan Battle Damaged Figure 23cm",
    "keywords": ["Dragon Ball Z", "Goku", "Super Saiyan", "Battle Damaged", "Anime Figure", "Namek Saga"]
  },
  {
    "item_number": 68,
    "sku": "SE-ANM-079",
    "correct_catalog_name": "Dragon Ball Super Goku Ultra Instinct Sign Battle Damaged Figure 23cm",
    "keywords": ["Dragon Ball Super", "Goku", "Ultra Instinct Sign", "Battle Damaged", "Anime Figure", "Tournament of Power"]
  },
  {
    "item_number": 69,
    "sku": "SE-ANM-080",
    "correct_catalog_name": "Naruto Shippuden Uzumaki Naruto Sage Mode Rasenshuriken Statue 25cm",
    "keywords": ["Naruto Shippuden", "Uzumaki Naruto", "Sage Mode", "Rasenshuriken", "Anime Statue", "Shinobi"]
  },
  {
    "item_number": 70,
    "sku": "SE-ANM-081",
    "correct_catalog_name": "Dragon Ball Super Goku Mastered Ultra Instinct Figure 31cm",
    "keywords": ["Dragon Ball Super", "Goku", "Mastered Ultra Instinct", "MUI", "Anime Figure", "Silver Hair"]
  },
  {
    "item_number": 71,
    "sku": "SE-ANM-082",
    "correct_catalog_name": "DC Comics The Joker The Dark Knight Sitting Statue 22cm",
    "keywords": ["DC Comics", "The Joker", "Heath Ledger", "The Dark Knight", "Villain Statue", "Movie Collectible"]
  },
  {
    "item_number": 72,
    "sku": "SE-ANM-085",
    "correct_catalog_name": "Dragon Ball Son Goku Dynamic Flying Pose Figure",
    "keywords": ["Dragon Ball", "Son Goku", "Flying Pose", "Martial Arts", "Anime Figure", "Action Pose"]
  },
  {
    "item_number": 73,
    "sku": "SE-ANM-086",
    "correct_catalog_name": "Dragon Ball Z Goku Super Saiyan Kamehameha Stance Figure",
    "keywords": ["Dragon Ball Z", "Goku", "Super Saiyan", "Kamehameha", "Anime Figure", "Action Stance"]
  },
  {
    "item_number": 74,
    "sku": "SE-ANM-087",
    "correct_catalog_name": "Bleach Ulquiorra Cifer Segunda Etapa Resurreccion Statue",
    "keywords": ["Bleach", "Ulquiorra Cifer", "Espada", "Segunda Etapa", "Anime Statue", "Resurreccion"]
  },
  {
    "item_number": 75,
    "sku": "SE-ANM-088",
    "correct_catalog_name": "Dragon Ball Son Goku Eating Rice Bowl Figure 30cm",
    "keywords": ["Dragon Ball", "Son Goku", "Eating Rice", "Hungry Saiyan", "Anime Figure", "Casual Pose"]
  },
  {
    "item_number": 76,
    "sku": "SE-ANM-089",
    "correct_catalog_name": "Dragon Ball Super Goku Ultra Instinct Sign LED Aura Diorama",
    "keywords": ["Dragon Ball Super", "Goku", "Ultra Instinct Sign", "LED Aura", "Anime Diorama", "Statue"]
  },
  {
    "item_number": 77,
    "sku": "SE-ANM-090",
    "correct_catalog_name": "Dragon Ball Super Goku Mastered Ultra Instinct LED Aura Diorama 28cm",
    "keywords": ["Dragon Ball Super", "Goku", "Mastered Ultra Instinct", "LED Aura", "Anime Diorama", "Statue"]
  },
  {
    "item_number": 78,
    "sku": "SE-ANM-091",
    "correct_catalog_name": "Marvel Avengers Classic Superheroes Figure Set 14cm",
    "keywords": ["Marvel", "Avengers", "Spider-Man", "Iron Man", "Hulk", "Action Figure Set"]
  },
  {
    "item_number": 79,
    "sku": "SE-ANM-092",
    "correct_catalog_name": "Doraemon & Friends Musical Instruments Band Figure Set 11.5cm",
    "keywords": ["Doraemon", "Nobita", "Music Band", "Anime Figure Set", "Cartoon Collectible", "Chibi"]
  },
  {
    "item_number": 80,
    "sku": "SE-ANM-093",
    "correct_catalog_name": "Marvel Avengers & X-Men Superheroes Collection Action Figure Set 17cm",
    "keywords": ["Marvel", "Avengers", "X-Men", "Superhero Collection", "Action Figure Set", "Comic Collectible"]
  },
  {
    "item_number": 81,
    "sku": "SE-ANM-094",
    "correct_catalog_name": "Dragon Ball Z Son Goku Base Form with Power Pole Figure 20cm",
    "keywords": ["Dragon Ball Z", "Son Goku", "Base Form", "Power Pole", "Anime Figure", "Martial Arts"]
  },
  {
    "item_number": 82,
    "sku": "SE-ANM-095",
    "correct_catalog_name": "One Punch Man Garou Half Monster Awakened Figure 15cm",
    "keywords": ["One Punch Man", "Garou", "Hero Hunter", "Monster Association", "Anime Figure", "OPM"]
  },
  {
    "item_number": 83,
    "sku": "SE-ANM-096",
    "correct_catalog_name": "Marvel Iron Man Mark 85 Nano Lightning Refocuser Statue",
    "keywords": ["Marvel", "Iron Man", "Mark 85", "Avengers Endgame", "Superhero Statue", "Nano Suit"]
  },
  {
    "item_number": 84,
    "sku": "SE-ANM-097",
    "correct_catalog_name": "Dragon Ball Z Majin Buu All Forms Evolution Figure Set",
    "keywords": ["Dragon Ball Z", "Majin Buu", "Kid Buu", "Super Buu", "Anime Figure Set", "DBZ Villain"]
  },
  {
    "item_number": 85,
    "sku": "SE-ANM-098",
    "correct_catalog_name": "Doraemon Various Classic Gadgets Figure Set 7-10cm",
    "keywords": ["Doraemon", "Gadget Cat", "Future Robot", "Anime Figure Set", "Classic Cartoon", "Chibi"]
  },
  {
    "item_number": 86,
    "sku": "SE-ANM-099",
    "correct_catalog_name": "Crayon Shin-chan Shinnosuke Nohara Summer Festival Figure Set 10cm",
    "keywords": ["Crayon Shin-chan", "Shinnosuke", "Summer Festival", "Anime Figure Set", "Comedy Cartoon", "Collectible"]
  },
  {
    "item_number": 87,
    "sku": "SE-ANM-100",
    "correct_catalog_name": "Marvel Groot Baby Groot Expressions Figure Set",
    "keywords": ["Marvel", "Guardians of the Galaxy", "Baby Groot", "Expressions", "Figure Set", "MCU Collectible"]
  },
  {
    "item_number": 88,
    "sku": "SE-ANM-101",
    "correct_catalog_name": "Dragon Ball Z Gohan & Goku Father-Son Kamehameha Statue",
    "keywords": ["Dragon Ball Z", "Gohan", "Father Son Kamehameha", "Goku Spirit", "Anime Statue", "Cell Saga"]
  },
  {
    "item_number": 89,
    "sku": "SE-ANM-102",
    "correct_catalog_name": "Dragon Ball Super Broly Legendary Super Saiyan Full Power Statue 22cm",
    "keywords": ["Dragon Ball Super", "Broly", "Legendary Super Saiyan", "Full Power", "Anime Statue", "DBS Movie"]
  },
  {
    "item_number": 90,
    "sku": "SE-ANM-103",
    "correct_catalog_name": "DC Comics Superman Man of Steel Standing Statue",
    "keywords": ["DC Comics", "Superman", "Man of Steel", "Clark Kent", "Superhero Statue", "Justice League"]
  }
]

def apply_user_names():
    print("\n" + "="*80)
    print(" APPLYING USER-PROVIDED PERFECT CATALOG NAMES & KEYWORDS TO DATABASE & CSV")
    print(f" Total Provided Items: {len(USER_PROVIDED_ITEMS)}")
    print("="*80 + "\n")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(schema=SCHEMA_NAME))

    # Fetch DB products to map ID by SKU
    db_res = supabase.from_("se_products").select("id, sku, name, image_url").execute()
    db_products = db_res.data or []
    sku_to_id = {p["sku"]: p["id"] for p in db_products}
    sku_to_img = {p["sku"]: p.get("image_url", "") for p in db_products}

    processed_rows = []
    updated_db_count = 0

    for item in USER_PROVIDED_ITEMS:
        sku = item["sku"]
        name = item["correct_catalog_name"].strip()
        keywords_list = item.get("keywords", [])
        keywords_str = ", ".join(keywords_list) if isinstance(keywords_list, list) else str(keywords_list)
        prod_id = sku_to_id.get(sku, "")
        img_url = sku_to_img.get(sku, "")

        if img_url.startswith("data:"):
            display_img = img_url[:40] + "... (Base64)"
        else:
            display_img = img_url

        print(f"[{item['item_number']}/90] SKU: {sku} | New Name: {name}")

        row = {
            "id": prod_id,
            "sku": sku,
            "proposed_catalog_name": name,
            "keywords": keywords_str,
            "image_url": display_img
        }
        processed_rows.append(row)

        if prod_id:
            try:
                up_res = supabase.from_("se_products").update({"name": name}).eq("id", prod_id).execute()
                if up_res.data:
                    updated_db_count += 1
            except Exception as e:
                print(f"    [-] Error updating DB for {sku}: {e}")

    # Write to CSV
    fieldnames = ["id", "sku", "proposed_catalog_name", "keywords", "image_url"]
    with open(CSV_OUTPUT_PATH, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(processed_rows)

    # Write to JSON
    with open(JSON_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(USER_PROVIDED_ITEMS, f, indent=2, ensure_ascii=False)

    print("\n" + "="*80)
    print(" COMPLETED SUCCESSFULLY!")
    print(f" Updated Database Records: {updated_db_count}/{len(USER_PROVIDED_ITEMS)}")
    print(f" 📄 Saved CSV File:  {CSV_OUTPUT_PATH}")
    print(f" 📄 Saved JSON File: {JSON_OUTPUT_PATH}")
    print("="*80 + "\n")

if __name__ == "__main__":
    apply_user_names()
