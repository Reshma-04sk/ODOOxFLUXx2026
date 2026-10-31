"""
PlanLedger Database Connection Readiness Checker
Polls the configured database until connection succeeds or timeout is reached.
"""

import os
import sys
import time
import psycopg


def wait_for_database(max_retries=30, delay_seconds=2):
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("[wait_for_db] No DATABASE_URL specified. Assuming SQLite or local default.")
        return True

    print(f"[wait_for_db] Checking database connection at {db_url.split('@')[-1]}...")
    retries = 0
    while retries < max_retries:
        try:
            with psycopg.connect(db_url) as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1;")
                    print("[wait_for_db] Database is ready and accepting queries!")
                    return True
        except Exception as exc:
            retries += 1
            print(f"[wait_for_db] Connection attempt {retries}/{max_retries} failed: {exc}. Retrying in {delay_seconds}s...")
            time.sleep(delay_seconds)

    print("[wait_for_db] Timed out waiting for database connection.", file=sys.stderr)
    return False


if __name__ == "__main__":
    if not wait_for_database():
        sys.exit(1)
