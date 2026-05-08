"""
Migration script to add raw_html column to quizzes table.
Run this once to update your existing database schema.

Usage:
    python migrate_add_raw_html.py
"""
from sqlalchemy import text, inspect
from database import engine

def migrate():
    """Add raw_html column to quizzes table if it doesn't exist."""
    # Check database type
    db_url = str(engine.url)
    is_postgres = 'postgresql' in db_url or 'postgres' in db_url
    is_mysql = 'mysql' in db_url
    is_sqlite = 'sqlite' in db_url
    
    with engine.begin() as conn:  # begin() auto-commits
        if is_postgres:
            # PostgreSQL: Check if column exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='quizzes' AND column_name='raw_html'
            """))
            
            if result.fetchone() is None:
                print("Adding raw_html column to quizzes table (PostgreSQL)...")
                conn.execute(text("ALTER TABLE quizzes ADD COLUMN raw_html TEXT"))
                print("✅ Migration completed successfully!")
            else:
                print("✅ Column raw_html already exists. No migration needed.")
        
        elif is_mysql:
            # MySQL: Check if column exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = DATABASE()
                AND table_name='quizzes' 
                AND column_name='raw_html'
            """))
            
            if result.fetchone() is None:
                print("Adding raw_html column to quizzes table (MySQL)...")
                conn.execute(text("ALTER TABLE quizzes ADD COLUMN raw_html TEXT"))
                print("✅ Migration completed successfully!")
            else:
                print("✅ Column raw_html already exists. No migration needed.")
        
        elif is_sqlite:
            # SQLite: Try to add column (will fail if exists)
            try:
                print("Adding raw_html column to quizzes table (SQLite)...")
                conn.execute(text("ALTER TABLE quizzes ADD COLUMN raw_html TEXT"))
                print("✅ Migration completed successfully!")
            except Exception as e:
                if "duplicate column" in str(e).lower() or "already exists" in str(e).lower():
                    print("✅ Column raw_html already exists. No migration needed.")
                else:
                    print(f"❌ Error: {e}")
                    raise
        else:
            print("⚠️  Unknown database type. Attempting to add column...")
            try:
                conn.execute(text("ALTER TABLE quizzes ADD COLUMN raw_html TEXT"))
                print("✅ Migration completed!")
            except Exception as e:
                print(f"❌ Error: {e}")
                print("Please add the column manually:")
                print("  ALTER TABLE quizzes ADD COLUMN raw_html TEXT;")

if __name__ == "__main__":
    migrate()

