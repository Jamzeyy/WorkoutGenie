from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import workouts, plans, chat

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WorkoutGenie AI",
    description="AI-powered workout tracking and plan generation",
    version="1.0.0"
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
app.include_router(workouts.router, prefix="/api")
app.include_router(plans.router, prefix="/api")
app.include_router(chat.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "WorkoutGenie AI API", "version": "1.0.0"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
