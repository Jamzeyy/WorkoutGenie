from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta

from ..database import get_db
from ..models import User, Workout, WorkoutPlan
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/profile", tags=["profile"])


# Schemas
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    fitness_goal: Optional[str] = None
    activity_level: Optional[str] = None


class ProfileResponse(BaseModel):
    id: int
    email: str
    name: Optional[str]
    height_cm: Optional[float]
    weight_kg: Optional[float]
    age: Optional[int]
    gender: Optional[str]
    fitness_goal: Optional[str]
    activity_level: Optional[str]
    bmi: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True


class WorkoutStat(BaseModel):
    date: str
    completed: bool
    workout_name: Optional[str] = None
    workout_id: Optional[int] = None


class MilestoneProgress(BaseModel):
    name: str
    description: str
    target: int
    current: int
    completed: bool
    icon: str


class StatsResponse(BaseModel):
    total_workouts: int
    completed_workouts: int
    current_streak: int
    longest_streak: int
    this_week: int
    this_month: int
    total_exercises: int
    workout_calendar: List[WorkoutStat]
    milestones: List[MilestoneProgress]


def calculate_bmi(height_cm: Optional[float], weight_kg: Optional[float]) -> Optional[float]:
    """Calculate BMI from height and weight."""
    if height_cm and weight_kg and height_cm > 0:
        height_m = height_cm / 100
        return round(weight_kg / (height_m ** 2), 1)
    return None


def calculate_streak(completed_dates: List[datetime]) -> tuple[int, int]:
    """Calculate current and longest workout streak."""
    if not completed_dates:
        return 0, 0
    
    # Sort dates and get unique days
    unique_days = sorted(set(d.date() for d in completed_dates), reverse=True)
    
    if not unique_days:
        return 0, 0
    
    today = datetime.utcnow().date()
    yesterday = today - timedelta(days=1)
    
    # Calculate current streak
    current_streak = 0
    check_date = today
    
    # Allow for today or yesterday to count as streak start
    if unique_days[0] == today or unique_days[0] == yesterday:
        check_date = unique_days[0]
        for day in unique_days:
            if day == check_date:
                current_streak += 1
                check_date -= timedelta(days=1)
            elif day < check_date:
                break
    
    # Calculate longest streak
    longest_streak = 1
    current_run = 1
    
    for i in range(1, len(unique_days)):
        if unique_days[i-1] - unique_days[i] == timedelta(days=1):
            current_run += 1
            longest_streak = max(longest_streak, current_run)
        else:
            current_run = 1
    
    return current_streak, longest_streak


def get_milestones(total_workouts: int, current_streak: int, longest_streak: int) -> List[MilestoneProgress]:
    """Generate milestone progress list."""
    milestones = [
        {
            "name": "First Workout",
            "description": "Complete your first workout",
            "target": 1,
            "current": min(total_workouts, 1),
            "icon": "🎯"
        },
        {
            "name": "Getting Started",
            "description": "Complete 5 workouts",
            "target": 5,
            "current": min(total_workouts, 5),
            "icon": "🌱"
        },
        {
            "name": "Building Habits",
            "description": "Complete 10 workouts",
            "target": 10,
            "current": min(total_workouts, 10),
            "icon": "💪"
        },
        {
            "name": "Dedicated",
            "description": "Complete 25 workouts",
            "target": 25,
            "current": min(total_workouts, 25),
            "icon": "🔥"
        },
        {
            "name": "Committed",
            "description": "Complete 50 workouts",
            "target": 50,
            "current": min(total_workouts, 50),
            "icon": "⭐"
        },
        {
            "name": "Century Club",
            "description": "Complete 100 workouts",
            "target": 100,
            "current": min(total_workouts, 100),
            "icon": "💯"
        },
        {
            "name": "3-Day Streak",
            "description": "Workout 3 days in a row",
            "target": 3,
            "current": min(longest_streak, 3),
            "icon": "🔗"
        },
        {
            "name": "Week Warrior",
            "description": "7-day workout streak",
            "target": 7,
            "current": min(longest_streak, 7),
            "icon": "📅"
        },
        {
            "name": "Two Week Champion",
            "description": "14-day workout streak",
            "target": 14,
            "current": min(longest_streak, 14),
            "icon": "🏆"
        },
        {
            "name": "Monthly Master",
            "description": "30-day workout streak",
            "target": 30,
            "current": min(longest_streak, 30),
            "icon": "👑"
        },
    ]
    
    return [
        MilestoneProgress(
            name=m["name"],
            description=m["description"],
            target=m["target"],
            current=m["current"],
            completed=m["current"] >= m["target"],
            icon=m["icon"]
        )
        for m in milestones
    ]


@router.get("/", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile."""
    bmi = calculate_bmi(current_user.height_cm, current_user.weight_kg)
    
    return ProfileResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        height_cm=current_user.height_cm,
        weight_kg=current_user.weight_kg,
        age=current_user.age,
        gender=current_user.gender,
        fitness_goal=current_user.fitness_goal,
        activity_level=current_user.activity_level,
        bmi=bmi,
        created_at=current_user.created_at
    )


@router.put("/", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile."""
    update_data = profile_data.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    bmi = calculate_bmi(current_user.height_cm, current_user.weight_kg)
    
    return ProfileResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        height_cm=current_user.height_cm,
        weight_kg=current_user.weight_kg,
        age=current_user.age,
        gender=current_user.gender,
        fitness_goal=current_user.fitness_goal,
        activity_level=current_user.activity_level,
        bmi=bmi,
        created_at=current_user.created_at
    )


@router.get("/stats", response_model=StatsResponse)
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's workout statistics."""
    # Get all user workouts
    workouts = db.query(Workout).filter(Workout.user_id == current_user.id).all()
    
    # Completed workouts
    completed_workouts = [w for w in workouts if w.completed_at is not None]
    completed_dates = [w.completed_at for w in completed_workouts]
    
    # Calculate streaks
    current_streak, longest_streak = calculate_streak(completed_dates)
    
    # This week/month counts
    now = datetime.utcnow()
    week_start = now - timedelta(days=now.weekday())
    month_start = now.replace(day=1)
    
    this_week = len([w for w in completed_workouts if w.completed_at and w.completed_at >= week_start])
    this_month = len([w for w in completed_workouts if w.completed_at and w.completed_at >= month_start])
    
    # Total exercises across all workouts
    total_exercises = sum(len(w.exercises) for w in workouts)
    
    # Build calendar data for last 60 days
    calendar_data = []
    for i in range(60):
        check_date = (now - timedelta(days=59-i)).date()
        workout_on_day = None
        
        for w in completed_workouts:
            if w.completed_at and w.completed_at.date() == check_date:
                workout_on_day = w
                break
        
        calendar_data.append(WorkoutStat(
            date=check_date.isoformat(),
            completed=workout_on_day is not None,
            workout_name=workout_on_day.name if workout_on_day else None,
            workout_id=workout_on_day.id if workout_on_day else None
        ))
    
    # Get milestones
    milestones = get_milestones(len(completed_workouts), current_streak, longest_streak)
    
    return StatsResponse(
        total_workouts=len(workouts),
        completed_workouts=len(completed_workouts),
        current_streak=current_streak,
        longest_streak=longest_streak,
        this_week=this_week,
        this_month=this_month,
        total_exercises=total_exercises,
        workout_calendar=calendar_data,
        milestones=milestones
    )


class ExerciseDataPoint(BaseModel):
    date: str
    weight: Optional[float]
    reps: Optional[int]
    volume: Optional[float]  # weight * reps
    
class ExerciseProgressResponse(BaseModel):
    exercise_name: str
    data_points: List[ExerciseDataPoint]
    max_weight: float
    max_reps: int
    max_volume: float


@router.get("/progress")
def get_exercise_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get progress data for all exercises - max weight/reps over time."""
    from ..models import Exercise, ExerciseSet
    
    # Get all completed workouts with their exercises and sets
    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.completed_at != None
    ).order_by(Workout.completed_at).all()
    
    # Group by exercise name
    exercise_data = {}
    
    for workout in workouts:
        workout_date = workout.completed_at.date().isoformat() if workout.completed_at else workout.date.date().isoformat()
        
        for exercise in workout.exercises:
            name = exercise.name.lower().strip()
            
            if name not in exercise_data:
                exercise_data[name] = {
                    'name': exercise.name,
                    'data_points': [],
                    'max_weight': 0,
                    'max_reps': 0,
                    'max_volume': 0
                }
            
            # Find max weight and reps for this workout
            max_weight = 0
            max_reps = 0
            total_volume = 0
            
            for s in exercise.sets:
                weight = s.weight or 0
                reps = s.reps or 0
                volume = weight * reps
                
                if weight > max_weight:
                    max_weight = weight
                if reps > max_reps:
                    max_reps = reps
                total_volume += volume
            
            if max_weight > 0 or max_reps > 0:
                exercise_data[name]['data_points'].append({
                    'date': workout_date,
                    'weight': max_weight if max_weight > 0 else None,
                    'reps': max_reps if max_reps > 0 else None,
                    'volume': total_volume if total_volume > 0 else None
                })
                
                # Update maxes
                if max_weight > exercise_data[name]['max_weight']:
                    exercise_data[name]['max_weight'] = max_weight
                if max_reps > exercise_data[name]['max_reps']:
                    exercise_data[name]['max_reps'] = max_reps
                if total_volume > exercise_data[name]['max_volume']:
                    exercise_data[name]['max_volume'] = total_volume
    
    # Convert to response format, sorted by most data points
    result = []
    for name, data in sorted(exercise_data.items(), key=lambda x: len(x[1]['data_points']), reverse=True):
        if len(data['data_points']) >= 2:  # Only include exercises with 2+ data points
            result.append(ExerciseProgressResponse(
                exercise_name=data['name'],
                data_points=[ExerciseDataPoint(**dp) for dp in data['data_points']],
                max_weight=data['max_weight'],
                max_reps=data['max_reps'],
                max_volume=data['max_volume']
            ))
    
    return result[:10]  # Return top 10 exercises by frequency
