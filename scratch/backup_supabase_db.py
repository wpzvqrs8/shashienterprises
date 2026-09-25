import os
import sys
import json
from datetime import datetime
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

TABLES_TO_BACKUP = [
    "se_products",
    "se_product_price_tiers",
    "se_orders",
    "se_order_items",
    "se_profiles",
    "se_store_settings"
]

def format_sql_value(val):
    """Format Python values into valid SQL values for INSERT statements."""
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "TRUE" if val else "FALSE"
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, (dict, list)):
        escaped_json = json.dumps(val).replace("'", "''")
        return f"'{escaped_json}'::jsonb"
    # String escaping
    escaped_str = str(val).replace("'", "''")
    return f"'{escaped_str}'"

def backup_supabase_database():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_json_file = os.path.join(os.path.dirname(__file__), f"supabase_backup_{timestamp}.json")
    backup_latest_json = os.path.join(os.path.dirname(__file__), "supabase_backup_latest.json")
    backup_sql_file = os.path.join(os.path.dirname(__file__), f"supabase_backup_{timestamp}.sql")
    backup_latest_sql = os.path.join(os.path.dirname(__file__), "supabase_backup_latest.sql")

    print("\n" + "="*80)
    print(" STARTING COMPLETE SUPABASE DATABASE BACKUP")
    print(f" Schema: '{SCHEMA_NAME}' | Target: {SUPABASE_URL}")
    print("="*80 + "\n")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(schema=SCHEMA_NAME))

    full_database_dump = {
        "timestamp": timestamp,
        "schema": SCHEMA_NAME,
        "supabase_url": SUPABASE_URL,
        "tables": {}
    }

    sql_statements = [
        f"-- ====================================================================",
        f"-- SHASHI ENTERPRISES SUPABASE BACKUP DUMP",
        f"-- Timestamp: {timestamp}",
        f"-- Schema: {SCHEMA_NAME}",
        f"-- ====================================================================\n",
        f"SET search_path TO {SCHEMA_NAME}, public;\n"
    ]

    for table in TABLES_TO_BACKUP:
        print(f"[*] Backing up table: {SCHEMA_NAME}.{table} ...")
        try:
            res = supabase.from_(table).select("*").execute()
            rows = res.data or []
            print(f"    [+] Extracted {len(rows)} records.")
            full_database_dump["tables"][table] = rows

            if rows:
                cols = list(rows[0].keys())
                col_names_str = ", ".join([f'"{c}"' for c in cols])
                sql_statements.append(f"-- --------------------------------------------------");
                sql_statements.append(f"-- Table: {SCHEMA_NAME}.{table} ({len(rows)} rows)");
                sql_statements.append(f"-- --------------------------------------------------");

                for r in rows:
                    vals = [format_sql_value(r.get(c)) for c in cols]
                    val_str = ", ".join(vals)
                    stmt = f'INSERT INTO {SCHEMA_NAME}."{table}" ({col_names_str}) VALUES ({val_str}) ON CONFLICT DO NOTHING;'
                    sql_statements.append(stmt)

                sql_statements.append("")

        except Exception as e:
            print(f"    [-] Warning backing up table {table}: {e}")

    # 1. Save JSON Dump
    with open(backup_json_file, "w", encoding="utf-8") as f:
        json.dump(full_database_dump, f, indent=2, ensure_ascii=False)

    with open(backup_latest_json, "w", encoding="utf-8") as f:
        json.dump(full_database_dump, f, indent=2, ensure_ascii=False)

    # 2. Save SQL Restore Script Dump
    sql_content = "\n".join(sql_statements)
    with open(backup_sql_file, "w", encoding="utf-8") as f:
        f.write(sql_content)

    with open(backup_latest_sql, "w", encoding="utf-8") as f:
        f.write(sql_content)

    print("\n" + "="*80)
    print(" BACKUP COMPLETED SUCCESSFULLY!")
    print(f" 📄 JSON Backup (Timestamped): {backup_json_file}")
    print(f" 📄 JSON Backup (Latest):      {backup_latest_json}")
    print(f" 📄 SQL Backup (Timestamped):  {backup_sql_file}")
    print(f" 📄 SQL Backup (Latest):       {backup_latest_sql}")
    print("="*80 + "\n")

if __name__ == "__main__":
    backup_supabase_database()
