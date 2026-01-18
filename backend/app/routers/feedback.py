from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from ..database import get_db
from ..models import FeedbackReport
from ..services.auth_service import get_current_user, get_admin_user, get_optional_user

router = APIRouter(prefix="/feedback", tags=["feedback"])


class FeedbackCreate(BaseModel):
    exercise_name: str
    issue_type: str  # video_private, video_wrong, video_broken, other
    message: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: int
    user_id: Optional[int]
    exercise_name: str
    issue_type: str
    message: Optional[str]
    status: str
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True


class FeedbackUpdate(BaseModel):
    status: str  # pending, resolved, dismissed


@router.post("/report", response_model=FeedbackResponse)
async def submit_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_optional_user)
):
    """Submit a feedback report for an exercise video."""
    user_id = current_user.id if current_user else None
    
    report = FeedbackReport(
        user_id=user_id,
        exercise_name=feedback.exercise_name,
        issue_type=feedback.issue_type,
        message=feedback.message,
        status="pending"
    )
    
    db.add(report)
    db.commit()
    db.refresh(report)
    
    return report


@router.get("/reports", response_model=List[FeedbackResponse])
async def get_all_reports(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """Get all feedback reports (admin only)."""
    query = db.query(FeedbackReport)
    
    if status:
        query = query.filter(FeedbackReport.status == status)
    
    reports = query.order_by(FeedbackReport.created_at.desc()).all()
    return reports


@router.patch("/reports/{report_id}", response_model=FeedbackResponse)
async def update_report_status(
    report_id: int,
    update: FeedbackUpdate,
    db: Session = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """Update a feedback report status (admin only)."""
    report = db.query(FeedbackReport).filter(FeedbackReport.id == report_id).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report.status = update.status
    if update.status in ["resolved", "dismissed"]:
        report.resolved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(report)
    
    return report


@router.delete("/reports/{report_id}")
async def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """Delete a feedback report (admin only)."""
    report = db.query(FeedbackReport).filter(FeedbackReport.id == report_id).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db.delete(report)
    db.commit()
    
    return {"message": "Report deleted"}
