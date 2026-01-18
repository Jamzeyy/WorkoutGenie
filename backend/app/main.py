import os
import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base, SessionLocal
from .routers import workouts, plans, chat, auth, profile, subscriptions
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


def run_migrations():
    """Run database migrations for new columns."""
    from sqlalchemy import text, inspect
    
    with engine.connect() as conn:
        inspector = inspect(engine)
        
        # Users table migrations
        user_columns = [col['name'] for col in inspector.get_columns('users')]
        
        user_migrations = [
            ('is_admin', 'BOOLEAN DEFAULT 0'),
            ('height_cm', 'REAL'),
            ('weight_kg', 'REAL'),
            ('age', 'INTEGER'),
            ('gender', 'VARCHAR(20)'),
            ('fitness_goal', 'VARCHAR(100)'),
            ('activity_level', 'VARCHAR(50)'),
            # Subscription fields
            ('subscription_tier', "VARCHAR(20) DEFAULT 'free'"),
            ('subscription_status', "VARCHAR(20) DEFAULT 'none'"),
            ('paddle_customer_id', 'VARCHAR(100)'),
            ('paddle_subscription_id', 'VARCHAR(100)'),
            ('subscription_plan', 'VARCHAR(20)'),
            ('subscription_ends_at', 'DATETIME'),
            ('monthly_workouts_count', 'INTEGER DEFAULT 0'),
            ('monthly_workouts_reset', 'DATETIME'),
            ('daily_chat_count', 'INTEGER DEFAULT 0'),
            ('daily_chat_reset', 'DATETIME'),
            ('trial_ends_at', 'DATETIME'),  # Free trial expiration
        ]
        
        for col_name, col_type in user_migrations:
            if col_name not in user_columns:
                print(f"[Migration] Adding {col_name} column to users table")
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
        
        # Workouts table migrations
        workout_columns = [col['name'] for col in inspector.get_columns('workouts')]
        
        workout_migrations = [
            ('completed_at', 'DATETIME'),
            ('plan_id', 'INTEGER'),
            ('plan_week', 'INTEGER'),
            ('plan_day', 'INTEGER'),
        ]
        
        for col_name, col_type in workout_migrations:
            if col_name not in workout_columns:
                print(f"[Migration] Adding {col_name} column to workouts table")
                conn.execute(text(f"ALTER TABLE workouts ADD COLUMN {col_name} {col_type}"))
        
        conn.commit()
        print("[Migration] Database migrations complete")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and run migrations
    Base.metadata.create_all(bind=engine)
    
    # Run database migrations for new columns
    run_migrations()
    
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
app.include_router(subscriptions.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "WorkoutGenie AI API", "version": "1.0.0"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
