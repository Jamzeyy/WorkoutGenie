from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Profile data for personalized plans
    height_cm = Column(Float, nullable=True)  # Height in centimeters
    weight_kg = Column(Float, nullable=True)  # Weight in kilograms
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)  # male, female, other
    fitness_goal = Column(String(100), nullable=True)  # Build muscle, lose weight, etc.
    activity_level = Column(String(50), nullable=True)  # sedentary, light, moderate, active, very_active
    
    # Subscription data (Paddle)
    subscription_tier = Column(String(20), default="free")  # free, pro
    subscription_status = Column(String(20), default="none")  # none, active, cancelled, past_due
    paddle_customer_id = Column(String(100), nullable=True)
    paddle_subscription_id = Column(String(100), nullable=True)
    subscription_plan = Column(String(20), nullable=True)  # monthly, annual, two_year
    subscription_ends_at = Column(DateTime, nullable=True)
    
    # Free trial (7 days of Pro access for new users)
    trial_ends_at = Column(DateTime, nullable=True)  # When free trial expires
    
    # Usage tracking for free tier limits
    monthly_workouts_count = Column(Integer, default=0)
    monthly_workouts_reset = Column(DateTime, default=datetime.utcnow)
    daily_chat_count = Column(Integer, default=0)
    daily_chat_reset = Column(DateTime, default=datetime.utcnow)
    
    # Onboarding
    has_seen_onboarding = Column(Boolean, default=False)
    
    workouts = relationship("Workout", back_populates="user", cascade="all, delete-orphan")
    plans = relationship("WorkoutPlan", back_populates="user", cascade="all, delete-orphan")


class Workout(Base):
    __tablename__ = "workouts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # nullable for migration
    name = Column(String(255), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    duration_minutes = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)  # When workout was marked complete
    plan_id = Column(Integer, ForeignKey("workout_plans.id"), nullable=True)  # Link to plan if from a plan
    plan_week = Column(Integer, nullable=True)  # Which week in the plan
    plan_day = Column(Integer, nullable=True)  # Which day in the week
    
    user = relationship("User", back_populates="workouts")
    exercises = relationship("Exercise", back_populates="workout", cascade="all, delete-orphan")


class Exercise(Base):
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    workout_id = Column(Integer, ForeignKey("workouts.id"), nullable=False)
    name = Column(String(255), nullable=False)
    order = Column(Integer, default=0)
    
    workout = relationship("Workout", back_populates="exercises")
    sets = relationship("ExerciseSet", back_populates="exercise", cascade="all, delete-orphan")


class ExerciseSet(Base):
    __tablename__ = "exercise_sets"
    
    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    set_number = Column(Integer, nullable=False)
    reps = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    completed = Column(Boolean, default=False)
    notes = Column(String(255), nullable=True)  # For myoreps, drop sets, RPE, etc.
    set_type = Column(String(50), nullable=True)  # regular, warmup, dropset, myorep, failure
    
    exercise = relationship("Exercise", back_populates="sets")


class WorkoutPlan(Base):
    __tablename__ = "workout_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # nullable for migration
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    cycle_type = Column(String(50), nullable=False)  # weekly, monthly, bi-monthly
    cycle_weeks = Column(Integer, nullable=False)
    questionnaire_data = Column(JSON, nullable=True)
    plan_data = Column(JSON, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="plans")


class FeedbackReport(Base):
    __tablename__ = "feedback_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    exercise_name = Column(String(255), nullable=False)
    issue_type = Column(String(50), nullable=False)  # video_private, video_wrong, video_broken, other
    message = Column(Text, nullable=True)
    status = Column(String(20), default="pending")  # pending, resolved, dismissed
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)