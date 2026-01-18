from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models import Workout, Exercise, ExerciseSet, User
from ..schemas import (
    WorkoutCreate, WorkoutResponse, WorkoutUpdate,
    ExerciseCreate, ExerciseSetCreate
)
from ..services.auth_service import get_optional_user

router = APIRouter(prefix="/workouts", tags=["workouts"])


@router.get("/", response_model=List[WorkoutResponse])
def get_workouts(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(Workout)
    if current_user:
        query = query.filter(Workout.user_id == current_user.id)
    workouts = query.order_by(Workout.date.desc()).offset(skip).limit(limit).all()
    return workouts


@router.get("/{workout_id}", response_model=WorkoutResponse)
def get_workout(
    workout_id: int, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(Workout).filter(Workout.id == workout_id)
    if current_user:
        query = query.filter(Workout.user_id == current_user.id)
    workout = query.first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout


@router.post("/", response_model=WorkoutResponse)
def create_workout(
    workout_data: WorkoutCreate, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    workout = Workout(
        user_id=current_user.id if current_user else None,
        name=workout_data.name,
        date=workout_data.date or datetime.utcnow(),
        duration_minutes=workout_data.duration_minutes,
        notes=workout_data.notes
    )
    db.add(workout)
    db.flush()
    
    for i, exercise_data in enumerate(workout_data.exercises):
        exercise = Exercise(
            workout_id=workout.id,
            name=exercise_data.name,
            order=exercise_data.order or i
        )
        db.add(exercise)
        db.flush()
        
        for set_data in exercise_data.sets:
            exercise_set = ExerciseSet(
                exercise_id=exercise.id,
                set_number=set_data.set_number,
                reps=set_data.reps,
                weight=set_data.weight,
                duration_seconds=set_data.duration_seconds,
                completed=set_data.completed
            )
            db.add(exercise_set)
    
    db.commit()
    db.refresh(workout)
    return workout


@router.put("/{workout_id}", response_model=WorkoutResponse)
def update_workout(workout_id: int, workout_data: WorkoutUpdate, db: Session = Depends(get_db)):
    workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    if workout_data.name is not None:
        workout.name = workout_data.name
    if workout_data.date is not None:
        workout.date = workout_data.date
    if workout_data.duration_minutes is not None:
        workout.duration_minutes = workout_data.duration_minutes
    if workout_data.notes is not None:
        workout.notes = workout_data.notes
    
    db.commit()
    db.refresh(workout)
    return workout


@router.delete("/{workout_id}")
def delete_workout(workout_id: int, db: Session = Depends(get_db)):
    workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    db.delete(workout)
    db.commit()
    return {"message": "Workout deleted successfully"}


@router.post("/{workout_id}/exercises", response_model=WorkoutResponse)
def add_exercise(workout_id: int, exercise_data: ExerciseCreate, db: Session = Depends(get_db)):
    workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    max_order = db.query(Exercise).filter(Exercise.workout_id == workout_id).count()
    
    exercise = Exercise(
        workout_id=workout_id,
        name=exercise_data.name,
        order=exercise_data.order or max_order
    )
    db.add(exercise)
    db.flush()
    
    for set_data in exercise_data.sets:
        exercise_set = ExerciseSet(
            exercise_id=exercise.id,
            set_number=set_data.set_number,
            reps=set_data.reps,
            weight=set_data.weight,
            duration_seconds=set_data.duration_seconds,
            completed=set_data.completed
        )
        db.add(exercise_set)
    
    db.commit()
    db.refresh(workout)
    return workout


@router.put("/sets/{set_id}")
def update_set(set_id: int, set_data: ExerciseSetCreate, db: Session = Depends(get_db)):
    exercise_set = db.query(ExerciseSet).filter(ExerciseSet.id == set_id).first()
    if not exercise_set:
        raise HTTPException(status_code=404, detail="Set not found")
    
    exercise_set.reps = set_data.reps
    exercise_set.weight = set_data.weight
    exercise_set.duration_seconds = set_data.duration_seconds
    exercise_set.completed = set_data.completed
    exercise_set.notes = set_data.notes
    exercise_set.set_type = set_data.set_type
    
    db.commit()
    return {"message": "Set updated successfully"}


@router.post("/from-plan")
def create_workout_from_plan(
    plan_day: dict, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Create a workout pre-populated with exercises from a plan day."""
    workout = Workout(
        user_id=current_user.id if current_user else None,
        name=plan_day.get("workout_name", "Workout"),
        date=datetime.utcnow(),
        duration_minutes=plan_day.get("duration_minutes"),
        notes=f"From plan: {plan_day.get('focus', '')}"
    )
    db.add(workout)
    db.flush()
    
    for i, exercise_data in enumerate(plan_day.get("exercises", [])):
        exercise = Exercise(
            workout_id=workout.id,
            name=exercise_data.get("name", "Exercise"),
            order=i
        )
        db.add(exercise)
        db.flush()
        
        # Parse sets and reps from plan
        num_sets = exercise_data.get("sets", 3)
        reps_str = str(exercise_data.get("reps", "10"))
        notes = exercise_data.get("notes", "")
        
        for set_num in range(1, num_sets + 1):
            exercise_set = ExerciseSet(
                exercise_id=exercise.id,
                set_number=set_num,
                reps=None,  # Leave empty for user to fill
                weight=None,
                completed=False,
                notes=notes if set_num == 1 else None,  # Add notes to first set
                set_type="regular"
            )
            db.add(exercise_set)
    
    db.commit()
    db.refresh(workout)
    return workout


@router.post("/{workout_id}/complete", response_model=WorkoutResponse)
def complete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Mark a workout as completed."""
    query = db.query(Workout).filter(Workout.id == workout_id)
    if current_user:
        query = query.filter(Workout.user_id == current_user.id)
    
    workout = query.first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    # Mark workout as completed
    workout.completed_at = datetime.utcnow()
    
    # Mark all sets as completed if not already
    for exercise in workout.exercises:
        for exercise_set in exercise.sets:
            if not exercise_set.completed:
                exercise_set.completed = True
    
    db.commit()
    db.refresh(workout)
    return workout


@router.post("/{workout_id}/uncomplete", response_model=WorkoutResponse)
def uncomplete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Unmark a workout as completed."""
    query = db.query(Workout).filter(Workout.id == workout_id)
    if current_user:
        query = query.filter(Workout.user_id == current_user.id)
    
    workout = query.first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    workout.completed_at = None
    db.commit()
    db.refresh(workout)
    return workout
