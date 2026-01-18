import os
import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base, SessionLocal
from .routers import workouts, plans, chat, auth, profile
from .routers.auth import seed_admin_user

# Initialize Sentry for error tracking
if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        traces_sample_rate=0.1,  # 10% of requests for performance monitoring
        profiles_sample_rate=0.1,
        environment=os.getenv("ENVIRONMENT", "development"),
    )
    print("[Sentry] Initialized for error tracking")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed admin
    Base.metadata.create_all(bind=engine)
    
    # Add is_admin column if it doesn't exist (migration for existing databases)
    from sqlalchemy import text, inspect
    with engine.connect() as conn:
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('users')]
        if 'is_admin' not in columns:
            print("[Migration] Adding is_admin column to users table")
            conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0"))
            conn.commit()
    
    db = SessionLocal()
    try:
        seed_admin_user(db)
    finally:
        db.close()
    yield
    # Shutdown: cleanup if needed

app = FastAPI(
    title="WorkoutGenie AI",
    description="AI-powered workout tracking and plan generation",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS - allow frontend domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://workout-genie.vercel.app",
        "https://workout-genie-*.vercel.app",  # Preview deployments
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",  # All Vercel deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(workouts.router, prefix="/api")
app.include_router(plans.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(profile.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "WorkoutGenie AI API", "version": "1.0.0"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
