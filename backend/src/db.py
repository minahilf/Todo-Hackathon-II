from sqlmodel import create_engine, Session, SQLModel
import os
from dotenv import load_dotenv
from pathlib import Path
from typing import Generator

# 1. Setup Path to find .env (Go up two levels from src/db.py to backend/.env)
current_file = Path(__file__)
env_path = current_file.parent.parent / ".env"

# 2. Load the .env file
load_dotenv(dotenv_path=env_path)

# 3. Get Database URL
DATABASE_URL = os.getenv("DATABASE_URL")

# 4. Fallback: If still None, try standard load (in case run from different dir)
if not DATABASE_URL:
    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")

# 5. Validation
if not DATABASE_URL:
    raise ValueError(f"DATABASE_URL is missing! Checked path: {env_path.absolute()}")

# 6. Database Connection
engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)

def create_db_and_tables():
    """
    Creates all database tables defined by SQLModel metadata.
    This function should be called on application startup.
    """
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """
    Dependency to get a database session.
    Yields a session which is automatically closed after the request.
    """
    with Session(engine) as session:
        yield session