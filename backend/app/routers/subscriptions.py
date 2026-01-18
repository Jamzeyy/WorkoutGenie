import os
import hmac
import hashlib
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta

from ..database import get_db
from ..models import User
from ..services.auth_service import get_current_user, get_optional_user

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])

# Paddle configuration
PADDLE_WEBHOOK_SECRET = os.getenv("PADDLE_WEBHOOK_SECRET", "")

# Pricing configuration
PRICING = {
    "monthly": {
        "price": 9.99,
        "interval": "month",
        "paddle_price_id": os.getenv("PADDLE_PRICE_MONTHLY", ""),
    },
    "annual": {
        "price": 71.88,
        "monthly_equivalent": 5.99,
        "discount": 40,
        "interval": "year",
        "paddle_price_id": os.getenv("PADDLE_PRICE_ANNUAL", ""),
    },
    "two_year": {
        "price": 119.76,
        "monthly_equivalent": 4.99,
        "discount": 50,
        "interval": "2 years",
        "paddle_price_id": os.getenv("PADDLE_PRICE_TWO_YEAR", ""),
    },
}

# Feature limits for free tier
FREE_TIER_LIMITS = {
    "monthly_workouts": 3,
    "daily_chat_messages": 5,
    "history_days": 7,
    "can_generate_plans": False,
    "can_view_milestones": False,
    "can_export": False,
    "has_ads": True,
}


class SubscriptionStatus(BaseModel):
    tier: str  # free, pro
    status: str  # none, active, cancelled, past_due, trial
    plan: Optional[str]  # monthly, annual, two_year
    ends_at: Optional[datetime]
    limits: dict
    is_pro: bool
    # Trial info
    in_trial: bool = False
    trial_ends_at: Optional[datetime] = None
    trial_days_remaining: int = 0


class CheckoutRequest(BaseModel):
    plan: str  # monthly, annual, two_year


class CheckoutResponse(BaseModel):
    checkout_url: Optional[str]
    paddle_price_id: str
    customer_email: str


def verify_paddle_signature(payload: bytes, signature_header: str) -> bool:
    """Verify Paddle webhook signature.
    
    Paddle signature format: ts=1234567890;h1=abc123...
    Signed payload format: ts:payload
    """
    if not PADDLE_WEBHOOK_SECRET:
        print("[Paddle] Warning: No webhook secret configured, skipping verification")
        return True  # Allow in development
    
    try:
        # Parse signature header
        parts = {}
        for part in signature_header.split(";"):
            if "=" in part:
                key, value = part.split("=", 1)
                parts[key] = value
        
        timestamp = parts.get("ts", "")
        signature = parts.get("h1", "")
        
        if not timestamp or not signature:
            print(f"[Paddle] Invalid signature format: {signature_header}")
            return False
        
        # Build signed payload: ts:payload
        signed_payload = f"{timestamp}:{payload.decode('utf-8')}"
        
        # Calculate expected signature
        expected = hmac.new(
            PADDLE_WEBHOOK_SECRET.encode(),
            signed_payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        is_valid = hmac.compare_digest(expected, signature)
        if not is_valid:
            print(f"[Paddle] Signature mismatch. Expected: {expected[:20]}..., Got: {signature[:20]}...")
        
        return is_valid
    except Exception as e:
        print(f"[Paddle] Signature verification error: {e}")
        return False


def is_user_in_trial(user: User) -> bool:
    """Check if user is currently in their free trial period."""
    if not user.trial_ends_at:
        return False
    return datetime.utcnow() < user.trial_ends_at


def get_trial_days_remaining(user: User) -> int:
    """Get number of days remaining in trial."""
    if not user.trial_ends_at:
        return 0
    remaining = user.trial_ends_at - datetime.utcnow()
    return max(0, remaining.days)


def is_user_pro(user: User) -> bool:
    """Check if user has Pro access (paid or trial)."""
    # Paid Pro subscriber
    if user.subscription_tier == "pro" and user.subscription_status == "active":
        return True
    # In trial period
    if is_user_in_trial(user):
        return True
    return False


def get_user_limits(user: User) -> dict:
    """Get feature limits based on user's subscription or trial status."""
    if is_user_pro(user):
        return {
            "monthly_workouts": -1,  # Unlimited
            "daily_chat_messages": -1,
            "history_days": -1,
            "can_generate_plans": True,
            "can_view_milestones": True,
            "can_export": True,
            "has_ads": False,
        }
    return FREE_TIER_LIMITS.copy()


def check_and_reset_limits(user: User, db: Session):
    """Reset usage counters if needed."""
    now = datetime.utcnow()
    
    # Reset monthly workout count
    if user.monthly_workouts_reset:
        if now - user.monthly_workouts_reset > timedelta(days=30):
            user.monthly_workouts_count = 0
            user.monthly_workouts_reset = now
            db.commit()
    else:
        user.monthly_workouts_reset = now
        db.commit()
    
    # Reset daily chat count
    if user.daily_chat_reset:
        if now - user.daily_chat_reset > timedelta(days=1):
            user.daily_chat_count = 0
            user.daily_chat_reset = now
            db.commit()
    else:
        user.daily_chat_reset = now
        db.commit()


def can_create_workout(user: User, db: Session) -> tuple[bool, str]:
    """Check if user can create a workout."""
    if is_user_pro(user):
        return True, ""
    
    check_and_reset_limits(user, db)
    
    if user.monthly_workouts_count >= FREE_TIER_LIMITS["monthly_workouts"]:
        return False, f"Free plan limited to {FREE_TIER_LIMITS['monthly_workouts']} workouts/month. Upgrade to Pro for unlimited!"
    
    return True, ""


def can_send_chat(user: User, db: Session) -> tuple[bool, str]:
    """Check if user can send a chat message."""
    if is_user_pro(user):
        return True, ""
    
    check_and_reset_limits(user, db)
    
    if user.daily_chat_count >= FREE_TIER_LIMITS["daily_chat_messages"]:
        return False, f"Free plan limited to {FREE_TIER_LIMITS['daily_chat_messages']} messages/day. Upgrade to Pro for unlimited!"
    
    return True, ""


def can_generate_plan(user: User) -> tuple[bool, str]:
    """Check if user can generate AI plans."""
    if is_user_pro(user):
        return True, ""
    return False, "AI Plan Generation is a Pro feature. Upgrade to create personalized workout plans!"


def increment_workout_count(user: User, db: Session):
    """Increment the user's monthly workout count."""
    user.monthly_workouts_count = (user.monthly_workouts_count or 0) + 1
    db.commit()


def increment_chat_count(user: User, db: Session):
    """Increment the user's daily chat count."""
    user.daily_chat_count = (user.daily_chat_count or 0) + 1
    db.commit()


@router.get("/status", response_model=SubscriptionStatus)
def get_subscription_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's subscription status and limits."""
    check_and_reset_limits(current_user, db)
    limits = get_user_limits(current_user)
    
    # Add current usage to limits
    limits["workouts_used"] = current_user.monthly_workouts_count or 0
    limits["chat_used"] = current_user.daily_chat_count or 0
    
    # Check trial status
    in_trial = is_user_in_trial(current_user)
    trial_days = get_trial_days_remaining(current_user)
    
    # Determine effective status
    if in_trial and current_user.subscription_status != "active":
        effective_status = "trial"
    else:
        effective_status = current_user.subscription_status or "none"
    
    return SubscriptionStatus(
        tier=current_user.subscription_tier or "free",
        status=effective_status,
        plan=current_user.subscription_plan,
        ends_at=current_user.subscription_ends_at,
        limits=limits,
        is_pro=is_user_pro(current_user),
        in_trial=in_trial,
        trial_ends_at=current_user.trial_ends_at,
        trial_days_remaining=trial_days
    )


@router.get("/pricing")
def get_pricing():
    """Get pricing information."""
    return {
        "plans": PRICING,
        "free_limits": FREE_TIER_LIMITS,
        "currency": "USD",
    }


@router.post("/checkout", response_model=CheckoutResponse)
def create_checkout(
    request: CheckoutRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a Paddle checkout session."""
    if request.plan not in PRICING:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    plan = PRICING[request.plan]
    
    # In production, you would create a Paddle checkout here
    # For now, return the price ID for client-side checkout
    return CheckoutResponse(
        checkout_url=None,  # Paddle.js handles this client-side
        paddle_price_id=plan["paddle_price_id"],
        customer_email=current_user.email
    )


@router.post("/webhook")
async def paddle_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Paddle webhook events."""
    payload = await request.body()
    signature = request.headers.get("Paddle-Signature", "")
    
    # Verify signature in production
    if PADDLE_WEBHOOK_SECRET and not verify_paddle_signature(payload, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    try:
        data = await request.json()
        event_type = data.get("event_type", "")
        event_data = data.get("data", {})
        
        print(f"[Paddle] Webhook received: {event_type}")
        
        if event_type == "subscription.created" or event_type == "subscription.updated":
            await handle_subscription_update(event_data, db)
        elif event_type == "subscription.canceled":
            await handle_subscription_cancelled(event_data, db)
        elif event_type == "subscription.past_due":
            await handle_subscription_past_due(event_data, db)
        elif event_type == "transaction.completed":
            await handle_transaction_completed(event_data, db)
        
        return {"status": "ok"}
    except Exception as e:
        print(f"[Paddle] Webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def handle_subscription_update(data: dict, db: Session):
    """Handle subscription created/updated."""
    customer_email = data.get("customer", {}).get("email", "").lower()
    subscription_id = data.get("id")
    status = data.get("status")
    
    # Find user by email
    user = db.query(User).filter(User.email == customer_email).first()
    if not user:
        print(f"[Paddle] User not found: {customer_email}")
        return
    
    # Determine plan type from price
    price_id = data.get("items", [{}])[0].get("price", {}).get("id", "")
    plan = None
    for plan_name, plan_info in PRICING.items():
        if plan_info["paddle_price_id"] == price_id:
            plan = plan_name
            break
    
    # Update user subscription
    user.subscription_tier = "pro"
    user.subscription_status = "active" if status == "active" else status
    user.paddle_subscription_id = subscription_id
    user.paddle_customer_id = data.get("customer", {}).get("id")
    user.subscription_plan = plan
    
    # Set end date from next billing date
    next_billed = data.get("next_billed_at")
    if next_billed:
        user.subscription_ends_at = datetime.fromisoformat(next_billed.replace("Z", "+00:00"))
    
    db.commit()
    print(f"[Paddle] Updated subscription for {customer_email}: {plan} - {status}")


async def handle_subscription_cancelled(data: dict, db: Session):
    """Handle subscription cancellation."""
    subscription_id = data.get("id")
    
    user = db.query(User).filter(User.paddle_subscription_id == subscription_id).first()
    if not user:
        print(f"[Paddle] User not found for subscription: {subscription_id}")
        return
    
    user.subscription_status = "cancelled"
    # Keep tier as pro until subscription_ends_at
    db.commit()
    print(f"[Paddle] Subscription cancelled for {user.email}")


async def handle_subscription_past_due(data: dict, db: Session):
    """Handle subscription payment failure."""
    subscription_id = data.get("id")
    
    user = db.query(User).filter(User.paddle_subscription_id == subscription_id).first()
    if not user:
        return
    
    user.subscription_status = "past_due"
    db.commit()
    print(f"[Paddle] Subscription past due for {user.email}")


async def handle_transaction_completed(data: dict, db: Session):
    """Handle successful transaction."""
    print(f"[Paddle] Transaction completed: {data.get('id')}")
    # Additional logic if needed
