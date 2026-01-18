import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use /data directory for persistent volume on Railway, or local file for dev
DATA_DIR = os.getenv("DATA_DIR", ".")
DB_PATH = os.path.join(DATA_DIR, "workoutgenie.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# Ensure data directory exists
if DATA_DIR != ".":
    os.makedirs(DATA_DIR, exist_ok=True)
    print(f"[Database] Using persistent storage at: {DB_PATH}")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
