from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://postgres.dcuscebijrddltgragcb:LsEFWBdiml6ukeOV@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require"

engine = create_engine(
    DATABASE_URL,
    pool_size=10,          # Keep 10 connections always open
    max_overflow=20,       # Allow 20 extra if needed
    pool_pre_ping=True,    # Check connection before using
    pool_recycle=300,      # Recycle connections every 5 mins
    connect_args={
        "connect_timeout": 10,
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 5,
        "keepalives_count": 5
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()