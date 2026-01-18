from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


# Exercise Set Schemas
class ExerciseSetBase(BaseModel):
    set_number: int
    reps: Optional[int] = None
    weight: Optional[float] = None
    duration_seconds: Optional[int] = None
    completed: bool = False
    notes: Optional[str] = None  # For myoreps, drop sets, RPE, etc.
    set_type: Optional[str] = None  # regular, warmup, dropset, myorep, failure


class ExerciseSetCreate(ExerciseSetBase):
    pass


class ExerciseSetResponse(ExerciseSetBase):
    id: int
    exercise_id: int
    
    class Config:
        from_attributes = True


# Exercise Schemas
class ExerciseBase(BaseModel):
    name: str
    order: int = 0


class ExerciseCreate(ExerciseBase):
    sets: List[ExerciseSetCreate] = []


class ExerciseResponse(ExerciseBase):
    id: int
    workout_id: int
    sets: List[ExerciseSetResponse] = []
    
    class Config:
        from_attributes = True


# Workout Schemas
class WorkoutBase(BaseModel):
    name: str
    date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None


class WorkoutCreate(WorkoutBase):
    exercises: List[ExerciseCreate] = []


class WorkoutResponse(WorkoutBase):
    id: int
    created_at: datetime
    exercises: List[ExerciseResponse] = []
    
    class Config:
        from_attributes = True


class WorkoutUpdate(BaseModel):
    name: Optional[str] = None
    date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None


# Workout Plan Schemas
class QuestionnaireData(BaseModel):
    fitness_level: str  # beginner, intermediate, advanced
    primary_goal: str  # strength, muscle_building, weight_loss, endurance, general_fitness
    workout_days_per_week: int
    workout_duration_minutes: int
    available_equipment: List[str]
    focus_areas: List[str]
    injuries_limitations: Optional[str] = None
    extra_comments: Optional[str] = None


class WorkoutPlanCreate(BaseModel):
    name: str
    description: Optional[str] = None
    cycle_type: str  # weekly, monthly, bi-monthly
    questionnaire_data: QuestionnaireData
    plan_data: Any


class WorkoutPlanResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    cycle_type: str
    cycle_weeks: int
    questionnaire_data: Optional[Any] = None
    plan_data: Any
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class GeneratePlanRequest(BaseModel):
    questionnaire_data: QuestionnaireData
    cycle_type: str  # weekly, monthly, bi-monthly


class GeneratePlanResponse(BaseModel):
    plan_name: str
    plan_description: str
    plan_data: Any
    cycle_type: str
    cycle_weeks: int
