from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import WorkoutPlan, User
from ..schemas import WorkoutPlanCreate, WorkoutPlanResponse, GeneratePlanRequest, GeneratePlanResponse
from ..services.openai_service import generate_workout_plan
from ..services.auth_service import get_optional_user

router = APIRouter(prefix="/plans", tags=["plans"])


@router.get("/", response_model=List[WorkoutPlanResponse])
def get_plans(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(WorkoutPlan)
    if current_user:
        query = query.filter(WorkoutPlan.user_id == current_user.id)
    plans = query.order_by(WorkoutPlan.created_at.desc()).offset(skip).limit(limit).all()
    return plans


@router.get("/active", response_model=List[WorkoutPlanResponse])
def get_active_plans(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(WorkoutPlan).filter(WorkoutPlan.is_active == True)
    if current_user:
        query = query.filter(WorkoutPlan.user_id == current_user.id)
    plans = query.order_by(WorkoutPlan.created_at.desc()).all()
    return plans


@router.get("/{plan_id}", response_model=WorkoutPlanResponse)
def get_plan(
    plan_id: int, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id)
    if current_user:
        query = query.filter(WorkoutPlan.user_id == current_user.id)
    plan = query.first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan


@router.post("/generate", response_model=GeneratePlanResponse)
async def generate_plan(
    request: GeneratePlanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Generate a workout plan using AI based on the questionnaire data."""
    try:
        print(f"[Generate] Starting plan generation...")
        
        # Build user profile data if available
        user_profile = None
        if current_user:
            user_profile = {
                "height_cm": current_user.height_cm,
                "weight_kg": current_user.weight_kg,
                "age": current_user.age,
                "gender": current_user.gender,
                "fitness_goal": current_user.fitness_goal,
                "activity_level": current_user.activity_level,
            }
            # Filter out None values
            user_profile = {k: v for k, v in user_profile.items() if v is not None}
            print(f"[Generate] User profile: {user_profile}")
        
        result = generate_workout_plan(
            questionnaire_data=request.questionnaire_data.model_dump(),
            cycle_type=request.cycle_type,
            user_profile=user_profile
        )
        print(f"[Generate] Plan generated successfully!")
        return GeneratePlanResponse(**result)
    except Exception as e:
        import traceback
        print(f"[Generate] ERROR: {str(e)}")
        print(f"[Generate] Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to generate plan: {str(e)}")


@router.post("/save", response_model=WorkoutPlanResponse)
def save_plan(
    plan_data: WorkoutPlanCreate, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Save a generated workout plan."""
    cycle_weeks_map = {
        "weekly": 1,
        "monthly": 4,
        "bi-monthly": 8
    }
    
    plan = WorkoutPlan(
        user_id=current_user.id if current_user else None,
        name=plan_data.name,
        description=plan_data.description,
        cycle_type=plan_data.cycle_type,
        cycle_weeks=cycle_weeks_map.get(plan_data.cycle_type, 4),
        questionnaire_data=plan_data.questionnaire_data.model_dump() if plan_data.questionnaire_data else None,
        plan_data=plan_data.plan_data,
        is_active=True
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.put("/{plan_id}/toggle-active")
def toggle_plan_active(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    plan.is_active = not plan.is_active
    db.commit()
    return {"message": f"Plan {'activated' if plan.is_active else 'deactivated'} successfully"}


@router.delete("/{plan_id}")
def delete_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    db.delete(plan)
    db.commit()
    return {"message": "Plan deleted successfully"}
