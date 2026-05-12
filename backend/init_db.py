import asyncio
import logging
from sqlalchemy import text
from app.db.base import Base
from app.db.session import engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_db():
    async with engine.begin() as conn:
        # 1. Create all tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)
        
        # 2. Check for missing columns in 'users' table
        try:
            # List of columns to check and add [column_name, sql_type]
            columns_to_ensure = [
                ("phone", "VARCHAR"),
                ("daily_message_count", "INTEGER DEFAULT 0"),
                ("last_message_at", "TIMESTAMP"),
                ("is_verified", "BOOLEAN DEFAULT TRUE"),
                ("verification_token", "VARCHAR")
            ]

            for col_name, col_type in columns_to_ensure:
                result = await conn.execute(text(
                    f"SELECT column_name FROM information_schema.columns "
                    f"WHERE table_name='users' AND column_name='{col_name}'"
                ))
                if not result.fetchone():
                    logger.info(f"Adding missing column '{col_name}' to 'users' table...")
                    await conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                    logger.info(f"Column '{col_name}' added successfully.")

        except Exception as e:
            logger.error(f"Error checking/adding user columns: {e}")

        # 3. Check for missing columns in 'appointments' table
        try:
            result = await conn.execute(text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name='appointments' AND column_name='source'"
            ))
            if not result.fetchone():
                logger.info("Adding missing column 'source' to 'appointments' table...")
                await conn.execute(text("ALTER TABLE appointments ADD COLUMN source VARCHAR DEFAULT 'website'"))
                logger.info("Column 'source' added successfully.")
        except Exception as e:
            logger.error(f"Error checking/adding appointment columns: {e}")

        # 4. Ensure TelegramSession table exists (Base.metadata.create_all handles this, but let's be explicit if needed)
        try:
             await conn.run_sync(Base.metadata.create_all)
        except Exception as e:
            logger.error(f"Error ensuring telegram tables: {e}")

    logger.info("Database initialization and schema check completed.")

if __name__ == "__main__":
    asyncio.run(init_db())
