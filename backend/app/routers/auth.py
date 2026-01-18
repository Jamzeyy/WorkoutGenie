from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import timedelta, datetime

from ..database import get_db
from ..models import User
from ..services.auth_service import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_DAYS
)

router = APIRouter(prefix="/auth", tags=["auth"])

# Admin credentials - will be seeded on first run
ADMIN_EMAIL = "markymarkmanna@gmail.com"
ADMIN_PASSWORD = "2235351mD!"


# Request/Response schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str]
    is_admin: bool = False
    
    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    id: int
    email: str
    name: Optional[str]
    is_admin: bool
    created_at: datetime
    workout_count: int = 0
    plan_count: int = 0
    
    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    user: UserResponse
    token: Token


@router.post("/register", response_model=AuthResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user."""
    # Normalize email to lowercase
    email_lower = user_data.email.lower()
    
    # Check if user exists
    existing_user = db.query(User).filter(User.email == email_lower).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user with lowercase email
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=email_lower,
        hashed_password=hashed_password,
        name=user_data.name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create token (sub must be a string)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    )
    
    return AuthResponse(
        user=UserResponse(id=user.id, email=user.email, name=user.name, is_admin=user.is_admin),
        token=Token(access_token=access_token, token_type="bearer")
    )


@router.post("/login", response_model=AuthResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password."""
    # Find user (case-insensitive email)
    email_lower = user_data.email.lower()
    user = db.query(User).filter(User.email == email_lower).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create token (sub must be a string)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    )
    
    return AuthResponse(
        user=UserResponse(id=user.id, email=user.email, name=user.name, is_admin=user.is_admin),
        token=Token(access_token=access_token, token_type="bearer")
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        is_admin=current_user.is_admin
    )


def get_admin_user(current_user: User = Depends(get_current_user)):
    """Dependency to check if user is admin."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("/admin/users", response_model=List[UserListResponse])
def get_all_users(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)."""
    users = db.query(User).order_by(User.created_at.desc()).all()
    
    result = []
    for user in users:
        result.append(UserListResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            is_admin=user.is_admin,
            created_at=user.created_at,
            workout_count=len(user.workouts),
            plan_count=len(user.plans)
        ))
    
    return result


@router.delete("/admin/users/{user_id}")
def delete_user(
    user_id: int,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a user (admin only)."""
    if user_id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}


def seed_admin_user(db: Session):
    """Create admin user if it doesn't exist."""
    admin = db.query(User).filter(User.email == ADMIN_EMAIL.lower()).first()
    if not admin:
        admin = User(
            email=ADMIN_EMAIL.lower(),
            hashed_password=get_password_hash(ADMIN_PASSWORD),
            name="Admin",
            is_admin=True
        )
        db.add(admin)
        db.commit()
        print(f"[Auth] Admin user created: {ADMIN_EMAIL}")
    elif not admin.is_admin:
        admin.is_admin = True
        db.commit()
        print(f"[Auth] Admin privileges granted to: {ADMIN_EMAIL}")
