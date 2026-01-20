from fastapi import FastAPI, APIRouter, HTTPException, Depends, Response, Request, status, Query, UploadFile, File
from fastapi.responses import RedirectResponse, StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
import logging
import uuid
import hashlib
import io
import csv
from enum import Enum
import re
import aiofiles
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Import email service
from email_service import EmailService
email_service = EmailService(db)

# Get app URL for email links
APP_URL = os.environ.get('APP_URL', 'https://brandfluence-6.preview.emergentagent.com')

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
IP_HASH_SALT = os.environ.get('IP_HASH_SALT', 'salt-for-ip-hashing')

# Storage
STORAGE_DIR = Path("/app/storage")
STORAGE_DIR.mkdir(exist_ok=True)
(STORAGE_DIR / "screenshots").mkdir(exist_ok=True)
(STORAGE_DIR / "emails").mkdir(exist_ok=True)

# Enums
class UserRole(str, Enum):
    ADMIN = "admin"
    BRAND = "brand"
    INFLUENCER = "influencer"

class UserStatus(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    DELETED = "deleted"

class BrandStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class InfluencerStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class CampaignStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    LIVE = "live"
    CLOSED = "closed"

class ApplicationStatus(str, Enum):
    APPLIED = "applied"
    SHORTLISTED = "shortlisted"
    ACCEPTED = "accepted"
    DECLINED = "declined"

class AssignmentStatus(str, Enum):
    PURCHASE_REQUIRED = "purchase_required"
    PURCHASE_REVIEW = "purchase_review"
    PURCHASE_APPROVED = "purchase_approved"
    POSTING = "posting"
    COMPLETED = "completed"

class PurchaseProofStatus(str, Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    CHANGES_REQUESTED = "changes_requested"
    REJECTED = "rejected"

class DeliverableType(str, Enum):
    POST = "post"
    STORY = "story"
    REEL = "reel"
    VIDEO = "video"

class SocialPlatform(str, Enum):
    INSTAGRAM = "instagram"
    YOUTUBE = "youtube"
    TIKTOK = "tiktok"
    TWITTER = "twitter"

class ReviewStatus(str, Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    CHANGES_REQUESTED = "changes_requested"
    REJECTED = "rejected"

class BrandMemberRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"

class PayoutStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    PAID = "paid"
    FAILED = "failed"
    CANCELLED = "cancelled"

class PayoutType(str, Enum):
    REIMBURSEMENT = "reimbursement"  # Purchase price reimbursement
    COMMISSION = "commission"  # Commission for the campaign
    REVIEW_BONUS = "review_bonus"  # Bonus for submitting review

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    role: UserRole
    status: UserStatus = UserStatus.PENDING
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = None

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: UserRole
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Brand(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    company_name: str
    website: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    status: BrandStatus = BrandStatus.PENDING
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Influencer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    portfolio_images: List[str] = []  # URLs to portfolio images
    portfolio_videos: List[str] = []  # URLs to portfolio videos
    public_profile_slug: Optional[str] = None  # URL-friendly slug for public profile
    paypal_email: Optional[str] = None  # PayPal email for payouts
    status: InfluencerStatus = InfluencerStatus.PENDING
    profile_completed: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InfluencerPlatform(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    influencer_id: str
    platform: SocialPlatform
    username: str
    profile_url: str
    followers_count: Optional[int] = None
    engagement_rate: Optional[float] = None
    verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Campaign(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    brand_id: str
    title: str
    description: str
    amazon_attribution_url: str
    purchase_window_start: datetime
    purchase_window_end: datetime
    post_window_start: datetime
    post_window_end: datetime
    status: CampaignStatus = CampaignStatus.DRAFT
    asin_allowlist: Optional[List[str]] = None
    # Payment fields
    commission_amount: float = 0.0  # Commission paid to influencer
    review_bonus: float = 0.0  # Bonus for submitting approved review
    # Landing page fields
    landing_page_enabled: bool = False
    landing_page_slug: Optional[str] = None
    landing_page_hero_image: Optional[str] = None
    landing_page_content: Optional[str] = None  # HTML/Markdown content
    landing_page_cta_text: Optional[str] = "Apply Now"
    landing_page_testimonials: Optional[List[Dict]] = None
    landing_page_faqs: Optional[List[Dict]] = None
    landing_page_why_join: Optional[List[Dict]] = None  # Why join perks
    landing_page_how_it_works: Optional[List[Dict]] = None  # How it works steps
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    @field_validator('amazon_attribution_url')
    def validate_amazon_url(cls, v):
        if not v:
            raise ValueError('Amazon Attribution URL is required')
        if not (re.search(r'amazon\.[a-z.]+', v.lower()) or 'amzn.to' in v.lower()):
            raise ValueError('URL must be a valid Amazon link (amazon.* or amzn.to)')
        return v

class Assignment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    campaign_id: str
    influencer_id: str
    application_id: str
    status: AssignmentStatus = AssignmentStatus.PURCHASE_REQUIRED
    amazon_attribution_url: Optional[str] = None  # Override campaign URL
    redirect_token: str = Field(default_factory=lambda: str(uuid.uuid4()).replace('-', '')[:16])
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PurchaseProof(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assignment_id: str
    order_id: str
    order_date: datetime
    price: float  # Mandatory price field
    screenshot_urls: List[str] = []
    status: PurchaseProofStatus = PurchaseProofStatus.PENDING
    review_notes: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ClickLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assignment_id: str
    ip_hash: str
    user_agent: Optional[str] = None
    clicked_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Payout(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assignment_id: str
    influencer_id: str
    brand_id: str
    campaign_id: str
    payout_type: str = "reimbursement"  # reimbursement, commission, review_bonus
    amount: float
    currency: str = "USD"
    status: PayoutStatus = PayoutStatus.PENDING
    payment_method: str = "paypal"  # PayPal is default
    paypal_email: Optional[str] = None  # Influencer's PayPal email
    notes: Optional[str] = None
    paid_at: Optional[datetime] = None
    paid_by: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentDetails(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    influencer_id: str
    account_holder_name: str
    account_number: str
    routing_number: str
    bank_name: str
    swift_code: Optional[str] = None
    iban: Optional[str] = None
    paypal_email: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    influencer_id: str
    payout_id: str
    amount: float
    currency: str = "USD"
    type: str  # "payout", "bonus", "adjustment"
    description: str
    status: str  # "completed", "pending", "failed"
    transaction_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Create app
app = FastAPI()
api_router = APIRouter(prefix="/api/v1")

# Startup event - ensure uploads directory is ready
@app.on_event("startup")
async def startup_event():
    """Initialize application - ensure uploads directory exists and is writable"""
    logger.info("Starting application initialization...")
    
    # Setup uploads directory
    possible_dirs = [
        Path("/app/backend/uploads"),
        Path("./uploads"),
        Path("../uploads"),
        Path.cwd() / "uploads"
    ]
    
    uploads_ready = False
    for dir_path in possible_dirs:
        try:
            # Create directory
            dir_path.mkdir(parents=True, exist_ok=True)
            
            # Test write permissions
            test_file = dir_path / ".startup_test"
            test_file.write_text("test")
            test_file.unlink()
            
            # Try to set permissions (ignore errors in restrictive environments)
            try:
                os.chmod(dir_path, 0o775)
            except:
                pass
            
            logger.info(f"✓ Uploads directory ready: {dir_path.absolute()}")
            uploads_ready = True
            break
            
        except Exception as e:
            logger.warning(f"✗ Cannot use uploads directory {dir_path}: {str(e)}")
            continue
    
    if not uploads_ready:
        logger.error("❌ CRITICAL: No writable uploads directory found! File uploads will fail.")
        logger.error("Please ensure /app/backend/uploads directory exists with write permissions.")
    
    logger.info("Application startup complete")

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password meets security requirements
    Returns (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number"
    
    if not any(c in '!@#$%^&*(),.?":{}|<>' for c in password):
        return False, "Password must contain at least one special character"
    
    return True, ""

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def hash_ip(ip: str) -> str:
    return hashlib.sha256(f"{ip}{IP_HASH_SALT}".encode()).hexdigest()

async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id, "deleted_at": None})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(allowed_roles: List[UserRole]):
    async def role_checker(user: dict = Depends(get_current_user)):
        if user["role"] not in [r.value for r in allowed_roles]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return role_checker

async def log_audit(user_id: str, action: str, entity_type: str, entity_id: str, details: dict = None):
    audit_log = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "action": action,
        "entity_type": entity_type,
        "entity_id": entity_id,
        "details": details or {},
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.audit_logs.insert_one(audit_log)

# Auth Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister, response: Response):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email, "deleted_at": None})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate password strength
    is_valid, error_message = validate_password_strength(user_data.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_message)
    
    # Create user
    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role=user_data.role,
        status=UserStatus.ACTIVE if user_data.role == UserRole.ADMIN else UserStatus.PENDING
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.users.insert_one(doc)
    
    # Create role-specific profile
    if user_data.role == UserRole.BRAND:
        brand = Brand(user_id=user.id, company_name=user_data.email.split('@')[0])
        brand_doc = brand.model_dump()
        brand_doc['created_at'] = brand_doc['created_at'].isoformat()
        brand_doc['updated_at'] = brand_doc['updated_at'].isoformat()
        await db.brands.insert_one(brand_doc)
    elif user_data.role == UserRole.INFLUENCER:
        influencer = Influencer(user_id=user.id, name=user_data.email.split('@')[0])
        inf_doc = influencer.model_dump()
        inf_doc['created_at'] = inf_doc['created_at'].isoformat()
        inf_doc['updated_at'] = inf_doc['updated_at'].isoformat()
        await db.influencers.insert_one(inf_doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id, "role": user.role.value})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax"
    )
    
    # Send welcome email and notify admins
    user_name = user_data.email.split('@')[0]
    if user_data.role == UserRole.INFLUENCER:
        asyncio.create_task(email_service.send_influencer_welcome(user_data.email, user_name, APP_URL))
    elif user_data.role == UserRole.BRAND:
        asyncio.create_task(email_service.send_brand_welcome(user_data.email, user_name, APP_URL))
    
    # Notify admins of new registration
    admins = await db.users.find({"role": "admin", "deleted_at": None}).to_list(100)
    for admin in admins:
        asyncio.create_task(email_service.send_admin_new_user(
            admin["email"], user_name, user_data.email, user_data.role.value,
            datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"), APP_URL
        ))
    
    return {"message": "Registration successful", "user": {"id": user.id, "email": user.email, "role": user.role}}

@api_router.post("/auth/login")
async def login(credentials: UserLogin, response: Response):
    user = await db.users.find_one({"email": credentials.email, "deleted_at": None})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user["status"] == UserStatus.SUSPENDED:
        raise HTTPException(status_code=403, detail="Account suspended")
    
    access_token = create_access_token(data={"sub": user["id"], "role": user["role"]})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax"
    )
    
    return {"message": "Login successful", "user": {"id": user["id"], "email": user["email"], "role": user["role"]}}

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out"}

@api_router.post("/auth/forgot-password")
async def forgot_password(data: Dict[str, Any]):
    """Request a password reset email"""
    email = data.get("email", "").lower().strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    # Find user
    user = await db.users.find_one({"email": email, "deleted_at": None})
    
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If an account with that email exists, a password reset link has been sent."}
    
    # Generate reset token
    import secrets
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    
    # Store reset token
    await db.password_resets.update_one(
        {"user_id": user["id"]},
        {"$set": {
            "user_id": user["id"],
            "token": reset_token,
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "used": False
        }},
        upsert=True
    )
    
    # Send reset email
    reset_url = f"{APP_URL}/reset-password?token={reset_token}"
    user_name = email.split('@')[0]
    
    asyncio.create_task(email_service.send_password_reset(
        email, user_name, reset_url, APP_URL
    ))
    
    return {"message": "If an account with that email exists, a password reset link has been sent."}

@api_router.post("/auth/reset-password")
async def reset_password(data: Dict[str, Any]):
    """Reset password using token"""
    token = data.get("token", "")
    new_password = data.get("password", "")
    
    if not token:
        raise HTTPException(status_code=400, detail="Reset token is required")
    if not new_password:
        raise HTTPException(status_code=400, detail="New password is required")
    
    # Validate password strength
    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    if not any(c.isupper() for c in new_password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")
    if not any(c.islower() for c in new_password):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter")
    if not any(c.isdigit() for c in new_password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")
    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in new_password):
        raise HTTPException(status_code=400, detail="Password must contain at least one special character")
    
    # Find reset token
    reset_record = await db.password_resets.find_one({
        "token": token,
        "used": False
    })
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Check if token is expired
    expires_at = datetime.fromisoformat(reset_record["expires_at"].replace('Z', '+00:00'))
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    # Find user
    user = await db.users.find_one({"id": reset_record["user_id"]})
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    # Update password
    hashed_password = pwd_context.hash(new_password)
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {
            "password_hash": hashed_password,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Mark token as used
    await db.password_resets.update_one(
        {"token": token},
        {"$set": {"used": True}}
    )
    
    # Send confirmation email
    user_name = user["email"].split('@')[0]
    asyncio.create_task(email_service.send_password_reset_success(
        user["email"], user_name, APP_URL
    ))
    
    return {"message": "Password has been reset successfully"}

@api_router.get("/auth/verify-reset-token")
async def verify_reset_token(token: str):
    """Verify if a reset token is valid"""
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")
    
    reset_record = await db.password_resets.find_one({
        "token": token,
        "used": False
    })
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Check if token is expired
    expires_at = datetime.fromisoformat(reset_record["expires_at"].replace('Z', '+00:00'))
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    return {"valid": True, "message": "Token is valid"}

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    user_data = {"id": user["id"], "email": user["email"], "role": user["role"], "status": user["status"]}
    
    # Get profile
    if user["role"] == "brand":
        brand = await db.brands.find_one({"user_id": user["id"]}, {"_id": 0})
        user_data["profile"] = brand
    elif user["role"] == "influencer":
        influencer = await db.influencers.find_one({"user_id": user["id"]}, {"_id": 0})
        # Get platforms
        platforms = await db.influencer_platforms.find({"influencer_id": influencer["id"]}, {"_id": 0}).to_list(10)
        influencer["platforms"] = platforms
        user_data["profile"] = influencer
    
    return user_data

# Influencer Profile & Platforms
@api_router.post("/influencer/platforms")
async def add_influencer_platform(
    platform_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.INFLUENCER]))
):
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    # Check if platform already exists
    existing = await db.influencer_platforms.find_one({
        "influencer_id": influencer["id"],
        "platform": platform_data["platform"]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Platform already added")
    
    platform = InfluencerPlatform(
        influencer_id=influencer["id"],
        platform=SocialPlatform(platform_data["platform"]),
        username=platform_data["username"],
        profile_url=platform_data["profile_url"],
        followers_count=platform_data.get("followers_count"),
        engagement_rate=platform_data.get("engagement_rate")
    )
    
    platform_doc = platform.model_dump()
    platform_doc['created_at'] = platform_doc['created_at'].isoformat()
    platform_doc['updated_at'] = platform_doc['updated_at'].isoformat()
    
    await db.influencer_platforms.insert_one(platform_doc)
    
    # Check if profile is complete (at least one platform)
    platforms_count = await db.influencer_platforms.count_documents({"influencer_id": influencer["id"]})
    if platforms_count >= 1:
        await db.influencers.update_one(
            {"id": influencer["id"]},
            {"$set": {"profile_completed": True, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    
    await log_audit(user["id"], "add", "influencer_platform", platform.id)
    
    return {"id": platform.id, "message": "Platform added"}

@api_router.get("/influencer/platforms")
async def get_influencer_platforms(user: dict = Depends(require_role([UserRole.INFLUENCER]))):
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    platforms = await db.influencer_platforms.find({"influencer_id": influencer["id"]}, {"_id": 0}).to_list(10)
    return {"data": platforms}

@api_router.put("/influencer/platforms/{platform_id}")
async def update_influencer_platform(
    platform_id: str,
    platform_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.INFLUENCER]))
):
    platform = await db.influencer_platforms.find_one({"id": platform_id})
    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")
    
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if platform["influencer_id"] != influencer["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = {
        "username": platform_data.get("username", platform["username"]),
        "profile_url": platform_data.get("profile_url", platform["profile_url"]),
        "followers_count": platform_data.get("followers_count", platform.get("followers_count")),
        "engagement_rate": platform_data.get("engagement_rate", platform.get("engagement_rate")),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.influencer_platforms.update_one(
        {"id": platform_id},
        {"$set": update_data}
    )
    
    await log_audit(user["id"], "update", "influencer_platform", platform_id)
    
    return {"message": "Platform updated"}

@api_router.delete("/influencer/platforms/{platform_id}")
async def delete_influencer_platform(
    platform_id: str,
    user: dict = Depends(require_role([UserRole.INFLUENCER]))
):
    platform = await db.influencer_platforms.find_one({"id": platform_id})
    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")
    
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if platform["influencer_id"] != influencer["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.influencer_platforms.delete_one({"id": platform_id})
    
    await log_audit(user["id"], "delete", "influencer_platform", platform_id)
    
    return {"message": "Platform deleted"}

@api_router.put("/influencer/profile")
async def update_influencer_profile(
    profile_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.INFLUENCER]))
):
    """Update influencer profile including portfolio media"""
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
    
    # Update basic fields
    if "name" in profile_data:
        update_data["name"] = profile_data["name"]
    if "bio" in profile_data:
        update_data["bio"] = profile_data["bio"]
    if "avatar_url" in profile_data:
        update_data["avatar_url"] = profile_data["avatar_url"]
    if "paypal_email" in profile_data:
        update_data["paypal_email"] = profile_data["paypal_email"]
    
    # Update portfolio media
    if "portfolio_images" in profile_data:
        update_data["portfolio_images"] = profile_data["portfolio_images"]
    if "portfolio_videos" in profile_data:
        update_data["portfolio_videos"] = profile_data["portfolio_videos"]
    
    # Generate or update public profile slug
    if "name" in profile_data and not influencer.get("public_profile_slug"):
        import re
        slug = re.sub(r'[^a-z0-9]+', '-', profile_data["name"].lower()).strip('-')
        # Ensure uniqueness
        existing = await db.influencers.find_one({"public_profile_slug": slug})
        if existing and existing["id"] != influencer["id"]:
            slug = f"{slug}-{influencer['id'][:8]}"
        update_data["public_profile_slug"] = slug
    
    await db.influencers.update_one(
        {"id": influencer["id"]},
        {"$set": update_data}
    )
    
    await log_audit(user["id"], "update", "influencer_profile", influencer["id"])
    
    return {"message": "Profile updated", "slug": update_data.get("public_profile_slug", influencer.get("public_profile_slug"))}

# Public profile endpoint (no authentication required)
@app.get("/api/v1/public/influencers/{slug}")
async def get_public_influencer_profile(slug: str):
    """Get public influencer profile by slug"""
    influencer = await db.influencers.find_one({"public_profile_slug": slug}, {"_id": 0})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    # Get social platforms
    platforms = await db.influencer_platforms.find(
        {"influencer_id": influencer["id"]}, 
        {"_id": 0}
    ).to_list(100)
    
    # Return public data only
    return {
        "id": influencer["id"],
        "name": influencer.get("name", ""),
        "bio": influencer.get("bio", ""),
        "avatar_url": influencer.get("avatar_url"),
        "portfolio_images": influencer.get("portfolio_images", []),
        "portfolio_videos": influencer.get("portfolio_videos", []),
        "platforms": platforms,
        "public_profile_slug": influencer.get("public_profile_slug")
    }

# Campaigns
@api_router.post("/campaigns")
async def create_campaign(campaign_data: Dict[str, Any], user: dict = Depends(require_role([UserRole.BRAND]))):
    brand = await db.brands.find_one({"user_id": user["id"]})
    if not brand:
        raise HTTPException(status_code=404, detail="Brand profile not found")
    
    # Parse dates for validation
    purchase_start = datetime.fromisoformat(campaign_data["purchase_window_start"])
    purchase_end = datetime.fromisoformat(campaign_data["purchase_window_end"])
    post_start = datetime.fromisoformat(campaign_data["post_window_start"])
    post_end = datetime.fromisoformat(campaign_data["post_window_end"])
    
    # Validate date windows
    if purchase_end <= purchase_start:
        raise HTTPException(status_code=400, detail="Purchase end date must be after purchase start date")
    if post_end <= post_start:
        raise HTTPException(status_code=400, detail="Post end date must be after post start date")
    if post_start < purchase_start:
        raise HTTPException(status_code=400, detail="Post start date cannot be earlier than purchase start date")
    
    campaign = Campaign(
        brand_id=brand["id"],
        title=campaign_data["title"],
        description=campaign_data["description"],
        amazon_attribution_url=campaign_data["amazon_attribution_url"],
        purchase_window_start=purchase_start,
        purchase_window_end=purchase_end,
        post_window_start=post_start,
        post_window_end=post_end,
        asin_allowlist=campaign_data.get("asin_allowlist")
    )
    
    doc = campaign.model_dump()
    doc['purchase_window_start'] = doc['purchase_window_start'].isoformat()
    doc['purchase_window_end'] = doc['purchase_window_end'].isoformat()
    doc['post_window_start'] = doc['post_window_start'].isoformat()
    doc['post_window_end'] = doc['post_window_end'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.campaigns.insert_one(doc)
    await log_audit(user["id"], "create", "campaign", campaign.id)
    
    return {"id": campaign.id, "message": "Campaign created"}

@api_router.get("/campaigns")
async def list_campaigns(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    skip = (page - 1) * page_size
    query = {}
    
    if user["role"] == "brand":
        brand = await db.brands.find_one({"user_id": user["id"]})
        if not brand:
            # If brand profile doesn't exist, return empty list
            return {
                "data": [],
                "page": page,
                "page_size": page_size,
                "total": 0
            }
        query["brand_id"] = brand["id"]
    elif user["role"] == "influencer":
        # Influencers should see both published and live campaigns
        query["status"] = {"$in": [CampaignStatus.PUBLISHED.value, CampaignStatus.LIVE.value]}
    
    if status:
        # If status filter is provided, override the above for non-brand users
        if user["role"] == "brand":
            # For brands, always filter by their brand_id regardless of status filter
            if status == "live":
                query["status"] = {"$in": [CampaignStatus.PUBLISHED.value, CampaignStatus.LIVE.value]}
            else:
                query["status"] = status
        else:
            # For other roles
            if status == "live":
                query["status"] = {"$in": [CampaignStatus.PUBLISHED.value, CampaignStatus.LIVE.value]}
            else:
                query["status"] = status
    
    campaigns = await db.campaigns.find(query, {"_id": 0}).skip(skip).limit(page_size).to_list(page_size)
    total = await db.campaigns.count_documents(query)
    
    return {
        "data": campaigns,
        "page": page,
        "page_size": page_size,
        "total": total
    }

@api_router.get("/campaigns/{campaign_id}")
async def get_campaign(campaign_id: str, user: dict = Depends(get_current_user)):
    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@api_router.put("/campaigns/{campaign_id}/publish")
async def publish_campaign(campaign_id: str, user: dict = Depends(require_role([UserRole.BRAND]))):
    campaign = await db.campaigns.find_one({"id": campaign_id})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    brand = await db.brands.find_one({"user_id": user["id"]})
    if campaign["brand_id"] != brand["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.campaigns.update_one(
        {"id": campaign_id},
        {"$set": {"status": CampaignStatus.PUBLISHED.value, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    await log_audit(user["id"], "publish", "campaign", campaign_id)
    return {"message": "Campaign published"}

@api_router.put("/campaigns/{campaign_id}/dates")
async def update_campaign_dates(
    campaign_id: str,
    dates_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.BRAND]))
):
    """Update campaign dates (purchase window, post window) - allows extending published campaigns"""
    campaign = await db.campaigns.find_one({"id": campaign_id})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    brand = await db.brands.find_one({"user_id": user["id"]})
    if campaign["brand_id"] != brand["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Parse dates for validation
    purchase_start = datetime.fromisoformat(dates_data.get("purchase_window_start", campaign["purchase_window_start"]))
    purchase_end = datetime.fromisoformat(dates_data.get("purchase_window_end", campaign["purchase_window_end"]))
    post_start = datetime.fromisoformat(dates_data.get("post_window_start", campaign["post_window_start"]))
    post_end = datetime.fromisoformat(dates_data.get("post_window_end", campaign["post_window_end"]))
    
    # Validate date windows
    if purchase_end <= purchase_start:
        raise HTTPException(status_code=400, detail="Purchase end date must be after purchase start date")
    if post_end <= post_start:
        raise HTTPException(status_code=400, detail="Post end date must be after post start date")
    if post_start < purchase_start:
        raise HTTPException(status_code=400, detail="Post start date cannot be earlier than purchase start date")
    
    # Validate dates
    update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
    
    if "purchase_window_start" in dates_data:
        update_data["purchase_window_start"] = dates_data["purchase_window_start"]
    if "purchase_window_end" in dates_data:
        update_data["purchase_window_end"] = dates_data["purchase_window_end"]
    if "post_window_start" in dates_data:
        update_data["post_window_start"] = dates_data["post_window_start"]
    if "post_window_end" in dates_data:
        update_data["post_window_end"] = dates_data["post_window_end"]
    
    await db.campaigns.update_one(
        {"id": campaign_id},
        {"$set": update_data}
    )
    
    await log_audit(user["id"], "update_dates", "campaign", campaign_id, update_data)
    return {"message": "Campaign dates updated successfully"}

@api_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(
    campaign_id: str,
    force: bool = Query(False, description="Force delete (admin only) - deletes even with active assignments"),
    user: dict = Depends(require_role([UserRole.BRAND, UserRole.ADMIN]))
):
    """Delete a campaign and all associated data"""
    campaign = await db.campaigns.find_one({"id": campaign_id})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Check authorization (brands can only delete their own campaigns)
    if user["role"] == UserRole.BRAND.value:
        brand = await db.brands.find_one({"user_id": user["id"]})
        if campaign["brand_id"] != brand["id"]:
            raise HTTPException(status_code=403, detail="Not authorized to delete this campaign")
        # Brands cannot force delete
        if force:
            raise HTTPException(status_code=403, detail="Only admins can force delete campaigns")
    
    # Check if campaign has active assignments (unless force delete by admin)
    if not force:
        active_assignments = await db.assignments.find_one({
            "campaign_id": campaign_id,
            "status": {"$nin": ["completed", "cancelled"]}
        })
        
        if active_assignments:
            raise HTTPException(
                status_code=400, 
                detail="Cannot delete campaign with active assignments. Please complete or cancel all assignments first."
            )
    
    # Delete all associated data
    # Get all assignments for this campaign to delete their purchase proofs
    assignment_ids = await db.assignments.find({"campaign_id": campaign_id}).distinct("id")
    if assignment_ids:
        await db.purchase_proofs.delete_many({"assignment_id": {"$in": assignment_ids}})
        await db.click_logs.delete_many({"assignment_id": {"$in": assignment_ids}})
    
    await db.payouts.delete_many({"campaign_id": campaign_id})
    await db.applications.delete_many({"campaign_id": campaign_id})
    await db.assignments.delete_many({"campaign_id": campaign_id})
    await db.campaigns.delete_one({"id": campaign_id})
    
    await log_audit(user["id"], "delete", "campaign", campaign_id, {"force": force})
    
    return {"message": "Campaign and all associated data deleted successfully"}


# Admin endpoint to get all campaigns with brand info
@api_router.get("/admin/campaigns")
async def admin_list_campaigns(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    brand_id: Optional[str] = None,
    user: dict = Depends(require_role([UserRole.ADMIN]))
):
    """Admin endpoint to list all campaigns with brand info"""
    skip = (page - 1) * page_size
    query = {}
    
    if status:
        query["status"] = status
    if brand_id:
        query["brand_id"] = brand_id
    
    campaigns = await db.campaigns.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(page_size).to_list(page_size)
    total = await db.campaigns.count_documents(query)
    
    # Enrich campaigns with brand info and statistics
    enriched_campaigns = []
    for campaign in campaigns:
        brand = await db.brands.find_one({"id": campaign["brand_id"]}, {"_id": 0})
        
        # Get statistics
        applications_count = await db.applications.count_documents({"campaign_id": campaign["id"]})
        assignments_count = await db.assignments.count_documents({"campaign_id": campaign["id"]})
        active_assignments_count = await db.assignments.count_documents({
            "campaign_id": campaign["id"],
            "status": {"$nin": ["completed", "cancelled"]}
        })
        
        enriched_campaigns.append({
            **campaign,
            "brand": brand,
            "statistics": {
                "applications_count": applications_count,
                "assignments_count": assignments_count,
                "active_assignments_count": active_assignments_count
            }
        })
    
    return {
        "data": enriched_campaigns,
        "page": page,
        "page_size": page_size,
        "total": total
    }

# Applications
@api_router.post("/applications")
async def apply_to_campaign(application_data: Dict[str, Any], user: dict = Depends(require_role([UserRole.INFLUENCER]))):
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    # Check if already applied
    existing = await db.applications.find_one({
        "campaign_id": application_data["campaign_id"],
        "influencer_id": influencer["id"]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already applied")
    
    application = {
        "id": str(uuid.uuid4()),
        "campaign_id": application_data["campaign_id"],
        "influencer_id": influencer["id"],
        "status": ApplicationStatus.APPLIED.value,
        "answers": application_data.get("answers", {}),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.applications.insert_one(application)
    await log_audit(user["id"], "apply", "application", application["id"])
    
    # Send notification email to brand
    campaign = await db.campaigns.find_one({"id": application_data["campaign_id"]})
    if campaign:
        brand = await db.brands.find_one({"id": campaign["brand_id"]})
        brand_user = await db.users.find_one({"id": brand["user_id"]}) if brand else None
        influencer_user = await db.users.find_one({"id": user["id"]})
        
        if brand_user and influencer_user:
            asyncio.create_task(email_service.send_new_application(
                brand_user["email"],
                brand.get("company_name", brand_user["email"].split('@')[0]),
                campaign["title"],
                campaign["id"],
                influencer.get("name", influencer_user["email"].split('@')[0]),
                influencer_user["email"],
                APP_URL
            ))
    
    return {"id": application["id"], "message": "Application submitted"}

@api_router.get("/campaigns/{campaign_id}/applications")
async def list_applications(
    campaign_id: str,
    user: dict = Depends(require_role([UserRole.BRAND, UserRole.ADMIN]))
):
    applications = await db.applications.find({"campaign_id": campaign_id}, {"_id": 0}).to_list(1000)
    
    # Enrich with influencer data and social platforms
    for app in applications:
        influencer = await db.influencers.find_one({"id": app["influencer_id"]}, {"_id": 0})
        if influencer:
            # Get social platforms for this influencer
            platforms = await db.influencer_platforms.find(
                {"influencer_id": influencer["id"]}, 
                {"_id": 0}
            ).to_list(100)
            influencer["platforms"] = platforms
        app["influencer"] = influencer
    
    return {"data": applications}

@api_router.put("/applications/{application_id}/status")
async def update_application_status(
    application_id: str,
    status_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.BRAND]))
):
    application = await db.applications.find_one({"id": application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {
            "status": status_data["status"],
            "notes": status_data.get("notes"),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Get influencer and campaign data for email
    influencer = await db.influencers.find_one({"id": application["influencer_id"]})
    influencer_user = await db.users.find_one({"id": influencer["user_id"]}) if influencer else None
    campaign = await db.campaigns.find_one({"id": application["campaign_id"]})
    
    # Create assignment if accepted
    if status_data["status"] == ApplicationStatus.ACCEPTED.value:
        assignment = Assignment(
            campaign_id=application["campaign_id"],
            influencer_id=application["influencer_id"],
            application_id=application_id
        )
        
        assign_doc = assignment.model_dump()
        assign_doc['created_at'] = assign_doc['created_at'].isoformat()
        assign_doc['updated_at'] = assign_doc['updated_at'].isoformat()
        await db.assignments.insert_one(assign_doc)
        
        # Send approval email to influencer
        if influencer_user and campaign:
            asyncio.create_task(email_service.send_application_approved(
                influencer_user["email"],
                influencer.get("name", influencer_user["email"].split('@')[0]),
                campaign["title"],
                APP_URL
            ))
    elif status_data["status"] == ApplicationStatus.REJECTED.value:
        # Send rejection email to influencer
        if influencer_user and campaign:
            asyncio.create_task(email_service.send_application_rejected(
                influencer_user["email"],
                influencer.get("name", influencer_user["email"].split('@')[0]),
                campaign["title"],
                APP_URL
            ))
    
    await log_audit(user["id"], "update_status", "application", application_id, {"status": status_data["status"]})
    return {"message": "Application updated"}

# Assignments & Amazon Links
@api_router.get("/assignments")
async def list_assignments(
    user: dict = Depends(get_current_user)
):
    query = {}
    
    if user["role"] == "influencer":
        influencer = await db.influencers.find_one({"user_id": user["id"]})
        query["influencer_id"] = influencer["id"]
    elif user["role"] == "brand":
        brand = await db.brands.find_one({"user_id": user["id"]})
        campaigns = await db.campaigns.find({"brand_id": brand["id"]}, {"_id": 0, "id": 1}).to_list(1000)
        campaign_ids = [c["id"] for c in campaigns]
        query["campaign_id"] = {"$in": campaign_ids}
    
    assignments = await db.assignments.find(query, {"_id": 0}).to_list(1000)
    
    # Enrich
    for assignment in assignments:
        campaign = await db.campaigns.find_one({"id": assignment["campaign_id"]}, {"_id": 0})
        assignment["campaign"] = campaign
    
    return {"data": assignments}

@api_router.get("/assignments/{assignment_id}/amazon-link")
async def get_amazon_link(assignment_id: str, user: dict = Depends(require_role([UserRole.INFLUENCER]))):
    assignment = await db.assignments.find_one({"id": assignment_id})
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if assignment["influencer_id"] != influencer["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Generate redirect URL with /api prefix for proper routing
    base_url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
    redirect_url = f"{base_url}/api/redirect/{assignment['redirect_token']}"
    
    return {"redirect_url": redirect_url, "token": assignment["redirect_token"]}

# Public redirect endpoint (with /api prefix for Kubernetes ingress)
@app.get("/api/redirect/{token}")
async def redirect_amazon(token: str, request: Request):
    assignment = await db.assignments.find_one({"redirect_token": token})
    if not assignment:
        raise HTTPException(status_code=404, detail="Invalid link")
    
    # Log click
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "")
    
    click_log = ClickLog(
        assignment_id=assignment["id"],
        ip_hash=hash_ip(client_ip),
        user_agent=user_agent
    )
    
    click_doc = click_log.model_dump()
    click_doc['clicked_at'] = click_doc['clicked_at'].isoformat()
    await db.amazon_click_logs.insert_one(click_doc)
    
    # Get Amazon URL
    amazon_url = assignment.get("amazon_attribution_url")
    if not amazon_url:
        campaign = await db.campaigns.find_one({"id": assignment["campaign_id"]})
        amazon_url = campaign["amazon_attribution_url"]
    
    return RedirectResponse(url=amazon_url, status_code=302)

# Purchase Proofs
@api_router.post("/assignments/{assignment_id}/purchase-proof")
async def submit_purchase_proof(
    assignment_id: str,
    proof_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.INFLUENCER]))
):
    assignment = await db.assignments.find_one({"id": assignment_id})
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if assignment["influencer_id"] != influencer["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Validate required fields
    if not proof_data.get("order_id"):
        raise HTTPException(status_code=400, detail="Order ID is required")
    if not proof_data.get("order_date"):
        raise HTTPException(status_code=400, detail="Order date is required")
    if "price" not in proof_data or proof_data.get("price") is None:
        raise HTTPException(status_code=400, detail="Price is required")
    if not proof_data.get("screenshot_urls") or len(proof_data.get("screenshot_urls", [])) == 0:
        raise HTTPException(status_code=400, detail="At least one screenshot is required")
    
    # Parse and validate price
    try:
        price = float(proof_data["price"])
        if price <= 0:
            raise HTTPException(status_code=400, detail="Price must be greater than 0")
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid price format")
    
    # Parse order date with error handling
    try:
        order_date = datetime.fromisoformat(proof_data["order_date"])
    except (ValueError, TypeError) as e:
        raise HTTPException(status_code=400, detail=f"Invalid order date format: {str(e)}")
    
    # Create purchase proof
    purchase_proof = PurchaseProof(
        assignment_id=assignment_id,
        order_id=proof_data["order_id"],
        order_date=order_date,
        price=price,
        screenshot_urls=proof_data.get("screenshot_urls", [])
    )
    
    proof_doc = purchase_proof.model_dump()
    proof_doc['order_date'] = proof_doc['order_date'].isoformat()
    proof_doc['created_at'] = proof_doc['created_at'].isoformat()
    proof_doc['updated_at'] = proof_doc['updated_at'].isoformat()
    
    await db.purchase_proofs.insert_one(proof_doc)
    
    # Update assignment status
    await db.assignments.update_one(
        {"id": assignment_id},
        {"$set": {"status": AssignmentStatus.PURCHASE_REVIEW.value, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    await log_audit(user["id"], "submit", "purchase_proof", purchase_proof.id)
    
    # Send notification email to brand
    campaign = await db.campaigns.find_one({"id": assignment["campaign_id"]})
    if campaign:
        brand = await db.brands.find_one({"id": campaign["brand_id"]})
        brand_user = await db.users.find_one({"id": brand["user_id"]}) if brand else None
        
        if brand_user:
            asyncio.create_task(email_service.send_new_purchase_proof(
                brand_user["email"],
                brand.get("company_name", brand_user["email"].split('@')[0]),
                campaign["title"],
                influencer.get("name", user["email"].split('@')[0]),
                proof_data["order_id"],
                APP_URL
            ))
    
    return {"id": purchase_proof.id, "message": "Purchase proof submitted"}


@api_router.get("/assignments/{assignment_id}/purchase-proof")
async def get_assignment_purchase_proof(assignment_id: str, user: dict = Depends(get_current_user)):
    proof = await db.purchase_proofs.find_one({"assignment_id": assignment_id}, {"_id": 0})
    if not proof:
        raise HTTPException(status_code=404, detail="No purchase proof found for this assignment")
    return proof

@api_router.get("/purchase-proofs/{proof_id}")
async def get_purchase_proof(proof_id: str, user: dict = Depends(get_current_user)):
    proof = await db.purchase_proofs.find_one({"id": proof_id}, {"_id": 0})
    if not proof:
        raise HTTPException(status_code=404, detail="Purchase proof not found")
    
    # Mask order_id for non-owners
    if user["role"] not in ["admin", "brand"]:
        assignment = await db.assignments.find_one({"id": proof["assignment_id"]})
        influencer = await db.influencers.find_one({"user_id": user["id"]})
        if not influencer or assignment["influencer_id"] != influencer["id"]:
            proof["order_id"] = "****" + proof["order_id"][-4:]
    
    return proof

# Post Submissions
@api_router.post("/assignments/{assignment_id}/post-submission")
async def submit_post(
    assignment_id: str,
    post_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.INFLUENCER]))
):
    # Get influencer and assignment
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    assignment = await db.assignments.find_one({"id": assignment_id})
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    if assignment["influencer_id"] != influencer["id"]:
        raise HTTPException(status_code=403, detail="Not your assignment")
    
    if assignment["status"] not in ["purchase_approved", "posting"]:
        raise HTTPException(status_code=400, detail="Purchase must be approved first")
    
    # Check if post already exists
    existing = await db.post_submissions.find_one({"assignment_id": assignment_id})
    if existing:
        raise HTTPException(status_code=400, detail="Post already submitted")
    
    post_submission = {
        "id": str(uuid.uuid4()),
        "assignment_id": assignment_id,
        "influencer_id": influencer["id"],
        "campaign_id": assignment["campaign_id"],
        "post_url": post_data["post_url"],
        "platform": post_data["platform"],
        "post_type": post_data["post_type"],
        "screenshot_url": post_data.get("screenshot_url"),
        "caption": post_data.get("caption"),
        "status": "pending",
        "is_addon": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.post_submissions.insert_one(post_submission)
    
    # Update assignment status
    await db.assignments.update_one(
        {"id": assignment_id},
        {"$set": {"status": "post_review", "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    await log_audit(user["id"], "create", "post_submission", post_submission["id"])
    
    # Get campaign and brand info for commission payout
    campaign = await db.campaigns.find_one({"id": assignment["campaign_id"]})
    brand = await db.brands.find_one({"id": campaign["brand_id"]}) if campaign else None
    
    # Create commission payout when post is submitted
    if campaign and brand:
        commission_amount = campaign.get("commission_amount", 0)
        if commission_amount > 0:
            # Check if commission payout already exists
            existing_commission = await db.payouts.find_one({
                "assignment_id": assignment_id,
                "payout_type": "commission"
            })
            
            if not existing_commission:
                commission_payout = Payout(
                    assignment_id=assignment_id,
                    influencer_id=influencer["id"],
                    brand_id=brand["id"],
                    campaign_id=campaign["id"],
                    payout_type="commission",
                    amount=commission_amount,
                    paypal_email=influencer.get("paypal_email"),
                    notes=f"Commission for posting content - {campaign['title']}"
                )
                payout_doc = commission_payout.model_dump()
                payout_doc['created_at'] = payout_doc['created_at'].isoformat()
                payout_doc['updated_at'] = payout_doc['updated_at'].isoformat()
                await db.payouts.insert_one(payout_doc)
    
    # Send notification email to brand
    if campaign:
        brand_user = await db.users.find_one({"id": brand["user_id"]}) if brand else None
        
        if brand_user:
            asyncio.create_task(email_service.send_new_post_submission(
                brand_user["email"],
                brand.get("company_name", brand_user["email"].split('@')[0]),
                campaign["title"],
                influencer.get("name", user["email"].split('@')[0]),
                APP_URL
            ))
    
    return {"id": post_submission["id"], "message": "Post submitted for review"}

@api_router.post("/assignments/{assignment_id}/review")
async def submit_product_review(
    assignment_id: str,
    review_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.INFLUENCER]))
):
    # Get influencer and assignment
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    assignment = await db.assignments.find_one({"id": assignment_id})
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    if assignment["influencer_id"] != influencer["id"]:
        raise HTTPException(status_code=403, detail="Not your assignment")
    
    if assignment["status"] != "completed":
        raise HTTPException(status_code=400, detail="Main post must be approved first")
    
    # Check if review already exists
    existing_review = await db.product_reviews.find_one({
        "assignment_id": assignment_id
    })
    if existing_review:
        raise HTTPException(status_code=400, detail="Product review already submitted")
    
    product_review = {
        "id": str(uuid.uuid4()),
        "assignment_id": assignment_id,
        "influencer_id": influencer["id"],
        "campaign_id": assignment["campaign_id"],
        "review_text": review_data["review_text"],
        "rating": review_data.get("rating", 5),
        "screenshot_url": review_data["screenshot_url"],
        "amazon_review_url": review_data.get("amazon_review_url"),  # URL to the Amazon review
        "platform": "amazon",  # Always Amazon review
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.product_reviews.insert_one(product_review)
    
    # Update assignment to indicate review is under review
    await db.assignments.update_one(
        {"id": assignment_id},
        {"$set": {
            "review_status": "review",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    await log_audit(user["id"], "create", "product_review", product_review["id"])
    
    # Get campaign and brand info for review bonus payout
    campaign = await db.campaigns.find_one({"id": assignment["campaign_id"]})
    brand = await db.brands.find_one({"id": campaign["brand_id"]}) if campaign else None
    
    # Create review bonus payout when review is submitted
    if campaign and brand:
        review_bonus = campaign.get("review_bonus", 0)
        if review_bonus > 0:
            # Check if review bonus payout already exists
            existing_bonus = await db.payouts.find_one({
                "assignment_id": assignment_id,
                "payout_type": "review_bonus"
            })
            
            if not existing_bonus:
                bonus_payout = Payout(
                    assignment_id=assignment_id,
                    influencer_id=influencer["id"],
                    brand_id=brand["id"],
                    campaign_id=campaign["id"],
                    payout_type="review_bonus",
                    amount=review_bonus,
                    paypal_email=influencer.get("paypal_email"),
                    notes=f"Review bonus for Amazon review - {campaign['title']}"
                )
                payout_doc = bonus_payout.model_dump()
                payout_doc['created_at'] = payout_doc['created_at'].isoformat()
                payout_doc['updated_at'] = payout_doc['updated_at'].isoformat()
                await db.payouts.insert_one(payout_doc)
    
    # Send notification email to brand
    if campaign:
        brand_user = await db.users.find_one({"id": brand["user_id"]}) if brand else None
        
        if brand_user:
            asyncio.create_task(email_service.send_new_product_review(
                brand_user["email"],
                brand.get("company_name", brand_user["email"].split('@')[0]),
                campaign["title"],
                influencer.get("name", user["email"].split('@')[0]),
                review_data.get("rating", 5),
                APP_URL
            ))
    
    return {"id": product_review["id"], "message": "Product review submitted for review"}

@api_router.get("/assignments/{assignment_id}/post-submission")
async def get_assignment_post_submission(assignment_id: str, user: dict = Depends(get_current_user)):
    post = await db.post_submissions.find_one({
        "assignment_id": assignment_id,
        "is_addon": False
    }, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="No post submission found for this assignment")
    return post

@api_router.get("/assignments/{assignment_id}/review")
async def get_assignment_product_review(assignment_id: str, user: dict = Depends(get_current_user)):
    review = await db.product_reviews.find_one({
        "assignment_id": assignment_id
    }, {"_id": 0})
    if not review:
        raise HTTPException(status_code=404, detail="No product review found for this assignment")
    return review

@api_router.put("/product-reviews/{review_id}/review")
async def review_product_review(
    review_id: str,
    review_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.BRAND, UserRole.ADMIN]))
):
    review = await db.product_reviews.find_one({"id": review_id})
    if not review:
        raise HTTPException(status_code=404, detail="Product review not found")
    
    # Get assignment and campaign
    assignment = await db.assignments.find_one({"id": review["assignment_id"]})
    campaign = await db.campaigns.find_one({"id": review["campaign_id"]})
    
    # For brands, verify they own the campaign
    if user["role"] == "brand":
        brand = await db.brands.find_one({"user_id": user["id"]})
        if campaign["brand_id"] != brand["id"]:
            raise HTTPException(status_code=403, detail="Not your campaign")
    
    status = review_data.get("status")
    if status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Status must be 'approved' or 'rejected'")
    
    update_data = {
        "status": status,
        "review_notes": review_data.get("notes"),
        "reviewed_by": user["id"],
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.product_reviews.update_one({"id": review_id}, {"$set": update_data})
    
    # Update assignment review_status
    review_status = "approved" if status == "approved" else "rejected"
    await db.assignments.update_one(
        {"id": review["assignment_id"]},
        {"$set": {
            "review_status": review_status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Get influencer and brand info
    influencer = await db.influencers.find_one({"id": review["influencer_id"]})
    influencer_user = await db.users.find_one({"id": influencer["user_id"]}) if influencer else None
    brand = await db.brands.find_one({"id": campaign["brand_id"]}) if campaign else None
    
    # Create commission + review bonus payout when approved
    if status == "approved" and influencer and campaign and brand:
        commission_amount = campaign.get("commission_amount", 0)
        review_bonus = campaign.get("review_bonus", 0)
        total_bonus = commission_amount + review_bonus
        
        if total_bonus > 0:
            # Check if commission payout already exists
            existing_commission = await db.payouts.find_one({
                "assignment_id": assignment["id"],
                "payout_type": {"$in": ["commission", "review_bonus"]}
            })
            
            if not existing_commission:
                commission_payout = Payout(
                    assignment_id=assignment["id"],
                    influencer_id=influencer["id"],
                    brand_id=brand["id"],
                    campaign_id=campaign["id"],
                    payout_type="commission",
                    amount=total_bonus,
                    paypal_email=influencer.get("paypal_email"),
                    notes=f"Commission (${commission_amount}) + Review Bonus (${review_bonus}) for {campaign['title']}"
                )
                payout_doc = commission_payout.model_dump()
                payout_doc['created_at'] = payout_doc['created_at'].isoformat()
                payout_doc['updated_at'] = payout_doc['updated_at'].isoformat()
                await db.payouts.insert_one(payout_doc)
    
    # Send email notification to influencer
    if influencer_user and campaign:
        if status == "approved":
            asyncio.create_task(email_service.send_review_approved(
                influencer_user["email"],
                influencer.get("name", influencer_user["email"].split('@')[0]),
                campaign["title"],
                APP_URL
            ))
        else:
            asyncio.create_task(email_service.send_review_rejected(
                influencer_user["email"],
                influencer.get("name", influencer_user["email"].split('@')[0]),
                campaign["title"],
                assignment["id"],
                review_data.get("notes", ""),
                APP_URL
            ))
    
    await log_audit(user["id"], "review", "product_review", review_id, {"status": status})
    
    return {"message": f"Product review {status}"}

@api_router.put("/post-submissions/{submission_id}/review")
async def review_post_submission(
    submission_id: str,
    review_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.BRAND, UserRole.ADMIN]))
):
    submission = await db.post_submissions.find_one({"id": submission_id})
    if not submission:
        raise HTTPException(status_code=404, detail="Post submission not found")
    
    # Get assignment and campaign
    assignment = await db.assignments.find_one({"id": submission["assignment_id"]})
    campaign = await db.campaigns.find_one({"id": submission["campaign_id"]})
    
    # For brands, verify they own the campaign
    if user["role"] == "brand":
        brand = await db.brands.find_one({"user_id": user["id"]})
        if campaign["brand_id"] != brand["id"]:
            raise HTTPException(status_code=403, detail="Not your campaign")
    
    status = review_data.get("status")
    if status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Status must be 'approved' or 'rejected'")
    
    update_data = {
        "status": status,
        "review_notes": review_data.get("notes"),
        "reviewed_by": user["id"],
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.post_submissions.update_one({"id": submission_id}, {"$set": update_data})
    
    # Update assignment status
    new_assignment_status = "completed" if status == "approved" else "posting"
    await db.assignments.update_one(
        {"id": submission["assignment_id"]},
        {"$set": {"status": new_assignment_status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Send email notification to influencer
    influencer = await db.influencers.find_one({"id": submission["influencer_id"]})
    influencer_user = await db.users.find_one({"id": influencer["user_id"]}) if influencer else None
    
    if influencer_user and campaign:
        if status == "approved":
            asyncio.create_task(email_service.send_post_approved(
                influencer_user["email"],
                influencer.get("name", influencer_user["email"].split('@')[0]),
                campaign["title"],
                assignment["id"],
                APP_URL
            ))
        else:
            asyncio.create_task(email_service.send_post_rejected(
                influencer_user["email"],
                influencer.get("name", influencer_user["email"].split('@')[0]),
                campaign["title"],
                assignment["id"],
                review_data.get("notes", ""),
                APP_URL
            ))
    
    await log_audit(user["id"], "review", "post_submission", submission_id, {"status": status})
    
    return {"message": f"Post {status}"}

@api_router.put("/purchase-proofs/{proof_id}/review")
async def review_purchase_proof(
    proof_id: str,
    review_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.BRAND, UserRole.ADMIN]))
):
    proof = await db.purchase_proofs.find_one({"id": proof_id})
    if not proof:
        raise HTTPException(status_code=404, detail="Purchase proof not found")
    
    await db.purchase_proofs.update_one(
        {"id": proof_id},
        {"$set": {
            "status": review_data["status"],
            "review_notes": review_data.get("notes"),
            "reviewed_by": user["id"],
            "reviewed_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Get assignment, influencer, and campaign for email
    assignment = await db.assignments.find_one({"id": proof["assignment_id"]})
    influencer = await db.influencers.find_one({"id": assignment["influencer_id"]}) if assignment else None
    influencer_user = await db.users.find_one({"id": influencer["user_id"]}) if influencer else None
    campaign = await db.campaigns.find_one({"id": assignment["campaign_id"]}) if assignment else None
    brand = await db.brands.find_one({"id": campaign["brand_id"]}) if campaign else None
    
    # Update assignment if approved
    if review_data["status"] == PurchaseProofStatus.APPROVED.value:
        await db.assignments.update_one(
            {"id": proof["assignment_id"]},
            {"$set": {"status": AssignmentStatus.PURCHASE_APPROVED.value, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        # Create reimbursement payout for the purchase price
        if assignment and influencer and campaign and brand:
            purchase_amount = proof.get("price", 0)
            if purchase_amount > 0:
                # Check if reimbursement payout already exists for this assignment
                existing_reimbursement = await db.payouts.find_one({
                    "assignment_id": assignment["id"],
                    "payout_type": "reimbursement"
                })
                
                if not existing_reimbursement:
                    reimbursement_payout = Payout(
                        assignment_id=assignment["id"],
                        influencer_id=influencer["id"],
                        brand_id=brand["id"],
                        campaign_id=campaign["id"],
                        payout_type="reimbursement",
                        amount=purchase_amount,
                        paypal_email=influencer.get("paypal_email"),
                        notes=f"Product purchase reimbursement for {campaign['title']}"
                    )
                    payout_doc = reimbursement_payout.model_dump()
                    payout_doc['created_at'] = payout_doc['created_at'].isoformat()
                    payout_doc['updated_at'] = payout_doc['updated_at'].isoformat()
                    await db.payouts.insert_one(payout_doc)
        
        # Send approval email to influencer
        if influencer_user and campaign:
            asyncio.create_task(email_service.send_purchase_proof_approved(
                influencer_user["email"],
                influencer.get("name", influencer_user["email"].split('@')[0]),
                campaign["title"],
                assignment["id"],
                APP_URL
            ))
    elif review_data["status"] == PurchaseProofStatus.REJECTED.value:
        # Send rejection email to influencer
        if influencer_user and campaign:
            asyncio.create_task(email_service.send_purchase_proof_rejected(
                influencer_user["email"],
                influencer.get("name", influencer_user["email"].split('@')[0]),
                campaign["title"],
                assignment["id"],
                review_data.get("notes", ""),
                APP_URL
            ))
    
    await log_audit(user["id"], "review", "purchase_proof", proof_id, {"status": review_data["status"]})
    
    return {"message": "Purchase proof reviewed"}

# Verification Queue
@api_router.get("/verification-queue")
async def get_verification_queue(
    queue_type: str = Query(..., regex="^(purchase|post)$"),
    status: Optional[str] = None,
    user: dict = Depends(require_role([UserRole.ADMIN, UserRole.BRAND]))
):
    if queue_type == "purchase":
        query = {}
        if status:
            query["status"] = status
        else:
            query["status"] = {"$in": [PurchaseProofStatus.PENDING.value, PurchaseProofStatus.UNDER_REVIEW.value]}
        
        proofs = await db.purchase_proofs.find(query, {"_id": 0}).to_list(1000)
        return {"data": proofs}
    
    return {"data": []}

# Reports & CSV
@api_router.get("/brand/reports")
async def get_brand_reports(
    status: str = Query("all"),
    user: dict = Depends(require_role([UserRole.BRAND]))
):
    brand = await db.brands.find_one({"user_id": user["id"]})
    if not brand:
        raise HTTPException(status_code=404, detail="Brand profile not found")
    
    # Get all campaigns for this brand
    campaigns = await db.campaigns.find({"brand_id": brand["id"]}, {"_id": 0}).to_list(1000)
    campaign_ids = [c["id"] for c in campaigns]
    
    # Get assignments for these campaigns
    query = {"campaign_id": {"$in": campaign_ids}}
    if status == "completed":
        query["status"] = AssignmentStatus.COMPLETED.value
    elif status == "pending":
        query["status"] = {"$ne": AssignmentStatus.COMPLETED.value}
    
    assignments = await db.assignments.find(query, {"_id": 0}).to_list(1000)
    
    # Build detailed report
    report_data = []
    total_product_cost = 0
    total_content_fees = 0
    total_addon_fees = 0
    
    for assignment in assignments:
        # Get purchase proof to get product cost
        purchase_proof = await db.purchase_proofs.find_one(
            {"assignment_id": assignment["id"], "status": PurchaseProofStatus.APPROVED.value},
            {"_id": 0}
        )
        
        # Get influencer name
        influencer = await db.influencers.find_one({"id": assignment["influencer_id"]}, {"_id": 0})
        
        # Get campaign title
        campaign = await db.campaigns.find_one({"id": assignment["campaign_id"]}, {"_id": 0})
        
        # Get payout info
        payout = await db.payouts.find_one({"assignment_id": assignment["id"]}, {"_id": 0})
        
        # Calculate costs
        product_cost = purchase_proof["total"] if purchase_proof and purchase_proof.get("total") else 0
        content_fee = 10.00  # Base content fee
        addon_posts = 0  # Could be tracked via deliverables
        addon_fee = addon_posts * 5.00
        
        total_payable = product_cost + content_fee + addon_fee
        
        total_product_cost += product_cost
        total_content_fees += content_fee
        total_addon_fees += addon_fee
        
        report_data.append({
            "id": assignment["id"],
            "campaign_title": campaign["title"] if campaign else "Unknown",
            "influencer_name": influencer["name"] if influencer else "Unknown",
            "status": assignment["status"],
            "payment_status": payout["status"] if payout else "pending",
            "product_cost": product_cost,
            "content_fee": content_fee,
            "addon_posts": addon_posts,
            "addon_fee": addon_fee,
            "total_payable": total_payable,
            "order_date": purchase_proof["order_date"] if purchase_proof else None,
            "order_id": purchase_proof["order_id"] if purchase_proof else None
        })
    
    return {
        "summary": {
            "total_products": len(report_data),
            "total_product_cost": total_product_cost,
            "total_content_fees": total_content_fees,
            "total_addon_fees": total_addon_fees,
            "total_payable": total_product_cost + total_content_fees + total_addon_fees
        },
        "assignments": report_data
    }

@api_router.get("/brand/reports/export")
async def export_brand_reports_csv(user: dict = Depends(require_role([UserRole.BRAND]))):
    brand = await db.brands.find_one({"user_id": user["id"]})
    if not brand:
        raise HTTPException(status_code=404, detail="Brand profile not found")
    
    # Get report data (reuse logic from above)
    campaigns = await db.campaigns.find({"brand_id": brand["id"]}, {"_id": 0}).to_list(1000)
    campaign_ids = [c["id"] for c in campaigns]
    assignments = await db.assignments.find({"campaign_id": {"$in": campaign_ids}}, {"_id": 0}).to_list(1000)
    
    csv_data = []
    for assignment in assignments:
        purchase_proof = await db.purchase_proofs.find_one(
            {"assignment_id": assignment["id"], "status": PurchaseProofStatus.APPROVED.value},
            {"_id": 0}
        )
        influencer = await db.influencers.find_one({"id": assignment["influencer_id"]}, {"_id": 0})
        campaign = await db.campaigns.find_one({"id": assignment["campaign_id"]}, {"_id": 0})
        payout = await db.payouts.find_one({"assignment_id": assignment["id"]}, {"_id": 0})
        
        product_cost = purchase_proof["total"] if purchase_proof and purchase_proof.get("total") else 0
        content_fee = 10.00
        addon_posts = 0
        addon_fee = addon_posts * 5.00
        total_payable = product_cost + content_fee + addon_fee
        
        csv_data.append({
            "Campaign": campaign["title"] if campaign else "Unknown",
            "Influencer": influencer["name"] if influencer else "Unknown",
            "Order ID": purchase_proof["order_id"] if purchase_proof else "",
            "Order Date": purchase_proof["order_date"] if purchase_proof else "",
            "Product Cost": f"${product_cost:.2f}",
            "Content Fee": "$10.00",
            "Addon Posts": addon_posts,
            "Addon Fee": f"${addon_fee:.2f}",
            "Total Payable": f"${total_payable:.2f}",
            "Payment Status": payout["status"] if payout else "pending",
            "Status": assignment["status"]
        })
    
    output = io.StringIO()
    if csv_data:
        writer = csv.DictWriter(output, fieldnames=csv_data[0].keys())
        writer.writeheader()
        writer.writerows(csv_data)
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=campaign-reports-{datetime.now(timezone.utc).strftime('%Y-%m-%d')}.csv"}
    )

@api_router.get("/reports/clicks")
async def export_clicks_csv(user: dict = Depends(require_role([UserRole.BRAND, UserRole.ADMIN]))):
    clicks = await db.amazon_click_logs.find({}, {"_id": 0}).to_list(10000)
    
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["id", "assignment_id", "ip_hash", "user_agent", "clicked_at"])
    writer.writeheader()
    writer.writerows(clicks)
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=clicks.csv"}
    )

# Admin - User Approval
@api_router.put("/admin/users/{user_id}/approve")
async def approve_user(
    user_id: str,
    approval_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.ADMIN]))
):
    target_user = await db.users.find_one({"id": user_id})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user status
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"status": UserStatus.ACTIVE.value, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Update profile status
    if target_user["role"] == "brand":
        await db.brands.update_one(
            {"user_id": user_id},
            {"$set": {"status": BrandStatus.APPROVED.value, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    elif target_user["role"] == "influencer":
        await db.influencers.update_one(
            {"user_id": user_id},
            {"$set": {"status": InfluencerStatus.APPROVED.value, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    
    await log_audit(user["id"], "approve", "user", user_id)
    
    return {"message": "User approved"}

# Admin Dashboard
@api_router.get("/admin/dashboard")
async def admin_dashboard(user: dict = Depends(require_role([UserRole.ADMIN]))):
    total_users = await db.users.count_documents({"deleted_at": None})
    pending_users = await db.users.count_documents({"status": UserStatus.PENDING.value, "deleted_at": None})
    total_campaigns = await db.campaigns.count_documents({})
    total_clicks = await db.amazon_click_logs.count_documents({})
    pending_purchase_proofs = await db.purchase_proofs.count_documents({"status": PurchaseProofStatus.PENDING.value})
    
    return {
        "total_users": total_users,
        "pending_users": pending_users,
        "total_campaigns": total_campaigns,
        "total_clicks": total_clicks,
        "pending_purchase_proofs": pending_purchase_proofs
    }

# Email Settings
@api_router.get("/admin/email-settings")
async def get_email_settings(user: dict = Depends(require_role([UserRole.ADMIN]))):
    settings = await db.email_settings.find_one({"id": "default"}, {"_id": 0})
    if not settings:
        settings = {
            "id": "default",
            "provider": "smtp",
            "smtp_host": "",
            "smtp_port": 587,
            "smtp_user": "",
            "smtp_password": "",
            "from_email": "",
            "from_name": ""
        }
    return settings

@api_router.put("/admin/email-settings")
async def update_email_settings(
    settings_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.ADMIN]))
):
    settings_data["id"] = "default"
    settings_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.email_settings.update_one(
        {"id": "default"},
        {"$set": settings_data},
        upsert=True
    )
    
    await log_audit(user["id"], "update", "email_settings", "default")
    
    return {"message": "Email settings updated"}

# Payouts
@api_router.post("/payouts")
async def create_payout(
    payout_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.BRAND, UserRole.ADMIN]))
):
    # Get assignment details
    assignment = await db.assignments.find_one({"id": payout_data["assignment_id"]})
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    # Get campaign to verify brand ownership
    campaign = await db.campaigns.find_one({"id": assignment["campaign_id"]})
    if user["role"] == "brand":
        brand = await db.brands.find_one({"user_id": user["id"]})
        if campaign["brand_id"] != brand["id"]:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    # Verify influencer has payment details
    payment_details = await db.payment_details.find_one({"influencer_id": assignment["influencer_id"]})
    if not payment_details:
        raise HTTPException(
            status_code=400, 
            detail="Influencer has not set up payment details yet. Payout cannot be created."
        )
    
    # Create payout
    payout = Payout(
        assignment_id=payout_data["assignment_id"],
        influencer_id=assignment["influencer_id"],
        brand_id=campaign["brand_id"],
        campaign_id=assignment["campaign_id"],
        amount=payout_data["amount"],
        currency=payout_data.get("currency", "USD"),
        payment_method=payout_data.get("payment_method"),
        payment_details=payout_data.get("payment_details"),
        notes=payout_data.get("notes")
    )
    
    payout_doc = payout.model_dump()
    payout_doc['created_at'] = payout_doc['created_at'].isoformat()
    payout_doc['updated_at'] = payout_doc['updated_at'].isoformat()
    
    await db.payouts.insert_one(payout_doc)
    await log_audit(user["id"], "create", "payout", payout.id, {"amount": payout.amount})
    
    return {"id": payout.id, "message": "Payout created"}

@api_router.get("/payouts")
async def list_payouts(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    skip = (page - 1) * page_size
    query = {}
    
    if user["role"] == "influencer":
        influencer = await db.influencers.find_one({"user_id": user["id"]})
        query["influencer_id"] = influencer["id"]
    elif user["role"] == "brand":
        brand = await db.brands.find_one({"user_id": user["id"]})
        query["brand_id"] = brand["id"]
    
    if status:
        query["status"] = status
    
    payouts = await db.payouts.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(page_size).to_list(page_size)
    total = await db.payouts.count_documents(query)
    
    # Calculate totals for summary
    total_pending = await db.payouts.aggregate([
        {"$match": {**query, "status": "pending"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]).to_list(1)
    total_paid = await db.payouts.aggregate([
        {"$match": {**query, "status": "paid"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]).to_list(1)
    
    # Enrich with assignment, campaign, and influencer data
    for payout in payouts:
        assignment = await db.assignments.find_one({"id": payout["assignment_id"]}, {"_id": 0})
        campaign = await db.campaigns.find_one({"id": payout["campaign_id"]}, {"_id": 0, "title": 1})
        influencer = await db.influencers.find_one({"id": payout["influencer_id"]}, {"_id": 0})
        payout["assignment"] = assignment
        payout["campaign"] = campaign
        payout["influencer"] = influencer
    
    return {
        "data": payouts,
        "page": page,
        "page_size": page_size,
        "total": total,
        "summary": {
            "total_pending": total_pending[0]["total"] if total_pending else 0,
            "total_paid": total_paid[0]["total"] if total_paid else 0
        }
    }

@api_router.get("/payouts/{payout_id}")
async def get_payout(payout_id: str, user: dict = Depends(get_current_user)):
    payout = await db.payouts.find_one({"id": payout_id}, {"_id": 0})
    if not payout:
        raise HTTPException(status_code=404, detail="Payout not found")
    
    # Check authorization
    if user["role"] == "influencer":
        influencer = await db.influencers.find_one({"user_id": user["id"]})
        if payout["influencer_id"] != influencer["id"]:
            raise HTTPException(status_code=403, detail="Not authorized")
    elif user["role"] == "brand":
        brand = await db.brands.find_one({"user_id": user["id"]})
        if payout["brand_id"] != brand["id"]:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    return payout

@api_router.put("/payouts/{payout_id}/status")
async def update_payout_status(
    payout_id: str,
    status_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.BRAND, UserRole.ADMIN]))
):
    payout = await db.payouts.find_one({"id": payout_id})
    if not payout:
        raise HTTPException(status_code=404, detail="Payout not found")
    
    update_data = {
        "status": status_data["status"],
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    if status_data["status"] == PayoutStatus.PAID.value:
        update_data["paid_at"] = datetime.now(timezone.utc).isoformat()
        update_data["paid_by"] = user["id"]
    
    if "notes" in status_data:
        update_data["notes"] = status_data["notes"]
    
    await db.payouts.update_one(
        {"id": payout_id},
        {"$set": update_data}
    )
    
    await log_audit(user["id"], "update_status", "payout", payout_id, {"status": status_data["status"]})
    
    return {"message": "Payout status updated"}


# Influencer Payout Summary endpoint
@api_router.get("/influencer/payout-summary")
async def get_influencer_payout_summary(user: dict = Depends(require_role([UserRole.INFLUENCER]))):
    """Get payout summary for influencer dashboard"""
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    # Get pending payouts
    pending_payouts = await db.payouts.find({
        "influencer_id": influencer["id"],
        "status": "pending"
    }, {"_id": 0}).to_list(100)
    
    # Calculate totals
    total_pending = sum(p.get("amount", 0) for p in pending_payouts)
    
    # Get paid payouts total
    paid_result = await db.payouts.aggregate([
        {"$match": {"influencer_id": influencer["id"], "status": "paid"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]).to_list(1)
    total_paid = paid_result[0]["total"] if paid_result else 0
    
    # Get breakdown by type
    pending_reimbursements = sum(p.get("amount", 0) for p in pending_payouts if p.get("payout_type") == "reimbursement")
    pending_commissions = sum(p.get("amount", 0) for p in pending_payouts if p.get("payout_type") in ["commission", "review_bonus"])
    
    # Enrich pending payouts with campaign info
    for payout in pending_payouts:
        campaign = await db.campaigns.find_one({"id": payout["campaign_id"]}, {"_id": 0, "title": 1})
        payout["campaign"] = campaign
    
    return {
        "paypal_email": influencer.get("paypal_email"),
        "total_pending": total_pending,
        "total_paid": total_paid,
        "pending_reimbursements": pending_reimbursements,
        "pending_commissions": pending_commissions,
        "pending_payouts": pending_payouts,
        "payout_count": len(pending_payouts)
    }


# Campaign Landing Pages
@api_router.put("/campaigns/{campaign_id}/landing-page")
async def update_campaign_landing_page(
    campaign_id: str,
    landing_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.BRAND]))
):
    campaign = await db.campaigns.find_one({"id": campaign_id})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    brand = await db.brands.find_one({"user_id": user["id"]})
    if campaign["brand_id"] != brand["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Generate slug if not provided
    if not landing_data.get("landing_page_slug"):
        import re
        slug = re.sub(r'[^a-z0-9]+', '-', campaign["title"].lower()).strip('-')
        landing_data["landing_page_slug"] = f"{slug}-{campaign_id[:8]}"
    
    update_data = {
        "landing_page_enabled": landing_data.get("landing_page_enabled", True),
        "landing_page_slug": landing_data.get("landing_page_slug"),
        "landing_page_hero_image": landing_data.get("landing_page_hero_image"),
        "landing_page_content": landing_data.get("landing_page_content"),
        "landing_page_cta_text": landing_data.get("landing_page_cta_text", "Apply Now"),
        "landing_page_testimonials": landing_data.get("landing_page_testimonials", []),
        "landing_page_faqs": landing_data.get("landing_page_faqs", []),
        "landing_page_why_join": landing_data.get("landing_page_why_join", []),
        "landing_page_how_it_works": landing_data.get("landing_page_how_it_works", []),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.campaigns.update_one(
        {"id": campaign_id},
        {"$set": update_data}
    )
    
    await log_audit(user["id"], "update", "campaign_landing_page", campaign_id)
    
    return {"message": "Landing page updated", "slug": update_data["landing_page_slug"]}

# Public landing page endpoint (no auth required) - at /api route to avoid frontend routing conflict
@api_router.get("/public/campaigns/{slug}")
async def get_campaign_landing_page(slug: str):
    campaign = await db.campaigns.find_one({
        "landing_page_slug": slug, 
        "landing_page_enabled": True,
        "status": {"$in": ["published", "live"]}
    }, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or not published")
    
    # Get brand info
    brand = await db.brands.find_one({"id": campaign["brand_id"]}, {"_id": 0, "company_name": 1, "logo_url": 1})
    campaign["brand"] = brand
    
    return campaign

# Marketing Landing Page Content (public endpoint - no auth required)
@api_router.get("/public/landing-content")
async def get_landing_content():
    """Get the marketing landing page content (video URL, stats, portfolio videos, etc.)"""
    content = await db.landing_content.find_one({"id": "default"}, {"_id": 0})
    if not content:
        # Return default content
        return {
            "stats": [
                {"label": "Active Creators", "value": "50,000+"},
                {"label": "Campaigns Completed", "value": "12,000+"},
                {"label": "Content Pieces Generated", "value": "850k+"},
                {"label": "Average ROI", "value": "5.2x"}
            ],
            "videoUrl": "",
            "videoTitle": "How Influiv Works",
            "portfolioVideos": []
        }
    return content

# Admin endpoint to update marketing landing page content
@api_router.put("/admin/landing-content")
async def update_landing_content(
    content_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.ADMIN]))
):
    """Update the marketing landing page content (video URL, stats, portfolio videos, etc.)"""
    update_data = {
        "id": "default",
        "stats": content_data.get("stats", [
            {"label": "Active Creators", "value": "50,000+"},
            {"label": "Campaigns Completed", "value": "12,000+"},
            {"label": "Content Pieces Generated", "value": "850k+"},
            {"label": "Average ROI", "value": "5.2x"}
        ]),
        "videoUrl": content_data.get("videoUrl", ""),
        "videoTitle": content_data.get("videoTitle", "How Influiv Works"),
        "portfolioVideos": content_data.get("portfolioVideos", []),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.landing_content.update_one(
        {"id": "default"},
        {"$set": update_data},
        upsert=True
    )
    
    await log_audit(user["id"], "update", "landing_content", "default")
    
    return {"message": "Landing content updated successfully"}

@api_router.get("/admin/landing-content")
async def get_admin_landing_content(user: dict = Depends(require_role([UserRole.ADMIN]))):
    """Get the marketing landing page content for admin editing"""
    content = await db.landing_content.find_one({"id": "default"}, {"_id": 0})
    if not content:
        return {
            "stats": [
                {"label": "Active Creators", "value": "50,000+"},
                {"label": "Campaigns Completed", "value": "12,000+"},
                {"label": "Content Pieces Generated", "value": "850k+"},
                {"label": "Average ROI", "value": "5.2x"}
            ],
            "videoUrl": "",
            "videoTitle": "How Influiv Works",
            "portfolioVideos": []
        }
    return content

# Payment Details endpoints
@api_router.post("/influencer/payment-details")
async def create_payment_details(
    payment_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.INFLUENCER]))
):
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    # Check if payment details already exist
    existing = await db.payment_details.find_one({"influencer_id": influencer["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Payment details already exist. Use PUT to update.")
    
    payment_details = PaymentDetails(
        influencer_id=influencer["id"],
        account_holder_name=payment_data["account_holder_name"],
        account_number=payment_data["account_number"],
        routing_number=payment_data["routing_number"],
        bank_name=payment_data["bank_name"],
        swift_code=payment_data.get("swift_code"),
        iban=payment_data.get("iban"),
        paypal_email=payment_data.get("paypal_email")
    )
    
    payment_doc = payment_details.model_dump()
    payment_doc['created_at'] = payment_doc['created_at'].isoformat()
    payment_doc['updated_at'] = payment_doc['updated_at'].isoformat()
    
    await db.payment_details.insert_one(payment_doc)
    await log_audit(user["id"], "create", "payment_details", payment_details.id)
    
    return {"id": payment_details.id, "message": "Payment details created successfully"}

@api_router.put("/influencer/payment-details")
async def update_payment_details(
    payment_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.INFLUENCER]))
):
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    existing = await db.payment_details.find_one({"influencer_id": influencer["id"]})
    
    update_data = {
        "account_holder_name": payment_data["account_holder_name"],
        "account_number": payment_data["account_number"],
        "routing_number": payment_data["routing_number"],
        "bank_name": payment_data["bank_name"],
        "swift_code": payment_data.get("swift_code"),
        "iban": payment_data.get("iban"),
        "paypal_email": payment_data.get("paypal_email"),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    if existing:
        # Update existing
        await db.payment_details.update_one(
            {"influencer_id": influencer["id"]},
            {"$set": update_data}
        )
        await log_audit(user["id"], "update", "payment_details", existing["id"])
        return {"message": "Payment details updated successfully"}
    else:
        # Create new if doesn't exist
        payment_details = PaymentDetails(
            influencer_id=influencer["id"],
            **{k: v for k, v in update_data.items() if k != "updated_at"}
        )
        payment_doc = payment_details.model_dump()
        payment_doc['created_at'] = payment_doc['created_at'].isoformat()
        payment_doc['updated_at'] = update_data['updated_at']
        
        await db.payment_details.insert_one(payment_doc)
        await log_audit(user["id"], "create", "payment_details", payment_details.id)
        return {"message": "Payment details created successfully"}

@api_router.get("/influencer/payment-details")
async def get_payment_details(user: dict = Depends(require_role([UserRole.INFLUENCER]))):
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    payment_details = await db.payment_details.find_one({"influencer_id": influencer["id"]}, {"_id": 0})
    
    if not payment_details:
        return {"has_payment_details": False, "data": None}
    
    return {"has_payment_details": True, "data": payment_details}

@api_router.get("/influencer/transactions")
async def get_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user: dict = Depends(require_role([UserRole.INFLUENCER]))
):
    influencer = await db.influencers.find_one({"user_id": user["id"]})
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    
    skip = (page - 1) * page_size
    
    # Get all payouts for this influencer as transactions
    payouts = await db.payouts.find(
        {"influencer_id": influencer["id"]},
        {"_id": 0}
    ).sort("created_at", -1).skip(skip).limit(page_size).to_list(page_size)
    
    total = await db.payouts.count_documents({"influencer_id": influencer["id"]})
    
    # Transform payouts into transaction format
    transactions = []
    for payout in payouts:
        campaign = await db.campaigns.find_one({"id": payout["campaign_id"]}, {"_id": 0, "title": 1})
        transactions.append({
            "id": payout["id"],
            "amount": payout["amount"],
            "currency": payout["currency"],
            "type": "payout",
            "description": f"Payout for campaign: {campaign['title'] if campaign else 'Unknown'}",
            "status": payout["status"],
            "transaction_date": payout.get("paid_at", payout["created_at"]),
            "created_at": payout["created_at"],
            "campaign_title": campaign["title"] if campaign else "Unknown"
        })
    
    return {
        "data": transactions,
        "page": page,
        "page_size": page_size,
        "total": total
    }

# Admin User Management endpoints
@api_router.get("/admin/users")
async def get_all_users(user: dict = Depends(require_role([UserRole.ADMIN]))):
    users = await db.users.find({"deleted_at": None}, {"_id": 0, "password_hash": 0}).to_list(None)
    return {"data": users}

@api_router.put("/admin/users/{user_id}")
async def update_user(
    user_id: str,
    user_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.ADMIN]))
):
    # Don't allow updating own account
    if user_id == user["id"]:
        raise HTTPException(status_code=400, detail="Cannot edit your own account")
    
    update_data = {}
    if "email" in user_data:
        # Check if email is already taken
        existing = await db.users.find_one({"email": user_data["email"], "id": {"$ne": user_id}})
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        update_data["email"] = user_data["email"]
    
    if "role" in user_data:
        update_data["role"] = user_data["role"]
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.users.update_one({"id": user_id}, {"$set": update_data})
    await log_audit(user["id"], "update", "user", user_id, update_data)
    
    return {"message": "User updated successfully"}

@api_router.put("/admin/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    status_data: Dict[str, Any],
    user: dict = Depends(require_role([UserRole.ADMIN]))
):
    # Don't allow updating own status
    if user_id == user["id"]:
        raise HTTPException(status_code=400, detail="Cannot change your own status")
    
    new_status = status_data.get("status")
    if new_status not in ["active", "pending", "suspended", "deleted"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    update_data = {
        "status": new_status,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.update_one({"id": user_id}, {"$set": update_data})
    await log_audit(user["id"], "update_status", "user", user_id, {"status": new_status})
    
    return {"message": f"User status updated to {new_status}"}

@api_router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, user: dict = Depends(require_role([UserRole.ADMIN]))):
    # Don't allow deleting own account
    if user_id == user["id"]:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    # Soft delete by setting deleted_at
    update_data = {
        "deleted_at": datetime.now(timezone.utc).isoformat(),
        "status": "deleted",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.update_one({"id": user_id}, {"$set": update_data})
    await log_audit(user["id"], "delete", "user", user_id)
    
    return {"message": "User deleted successfully"}

# Admin Reports endpoint
@api_router.get("/admin/reports")
async def get_admin_reports(user: dict = Depends(require_role([UserRole.ADMIN]))):
    # Get all brands with their metrics
    brands = await db.brands.find({}, {"_id": 0}).to_list(None)
    
    brand_reports = []
    for brand in brands:
        # Get brand user info
        brand_user = await db.users.find_one({"id": brand["user_id"]}, {"_id": 0, "email": 1})
        
        # Count campaigns
        total_campaigns = await db.campaigns.count_documents({"brand_id": brand["id"]})
        
        # Get all payouts for this brand
        payouts = await db.payouts.find({"brand_id": brand["id"]}).to_list(None)
        total_spent = sum(p["amount"] for p in payouts)
        pending_payouts = sum(p["amount"] for p in payouts if p["status"] == "pending")
        completed_payouts = sum(p["amount"] for p in payouts if p["status"] == "paid")
        
        # Count unique influencers working with this brand
        assignments = await db.assignments.find({"campaign_id": {"$in": [c["id"] for c in await db.campaigns.find({"brand_id": brand["id"]}, {"_id": 0, "id": 1}).to_list(None)]}}).to_list(None)
        unique_influencers = len(set(a["influencer_id"] for a in assignments))
        
        # Count applications
        campaigns_ids = [c["id"] for c in await db.campaigns.find({"brand_id": brand["id"]}, {"_id": 0, "id": 1}).to_list(None)]
        total_applications = await db.applications.count_documents({"campaign_id": {"$in": campaigns_ids}})
        
        # Count completed assignments
        completed_assignments = await db.assignments.count_documents({
            "campaign_id": {"$in": campaigns_ids},
            "status": "completed"
        })
        
        brand_reports.append({
            "brand_id": brand["id"],
            "company_name": brand["company_name"],
            "email": brand_user["email"] if brand_user else "N/A",
            "status": brand["status"],
            "total_campaigns": total_campaigns,
            "total_spent": total_spent,
            "pending_payouts": pending_payouts,
            "completed_payouts": completed_payouts,
            "unique_influencers": unique_influencers,
            "total_applications": total_applications,
            "completed_assignments": completed_assignments,
            "created_at": brand["created_at"]
        })
    
    # Get all influencers with their earnings
    influencers = await db.influencers.find({}, {"_id": 0}).to_list(None)
    
    influencer_reports = []
    for influencer in influencers:
        # Get influencer user info
        influencer_user = await db.users.find_one({"id": influencer["user_id"]}, {"_id": 0, "email": 1})
        
        # Get payment details status
        payment_details = await db.payment_details.find_one({"influencer_id": influencer["id"]})
        has_payment_details = payment_details is not None
        
        # Get all payouts
        payouts = await db.payouts.find({"influencer_id": influencer["id"]}).to_list(None)
        total_earnings = sum(p["amount"] for p in payouts)
        pending_earnings = sum(p["amount"] for p in payouts if p["status"] == "pending")
        paid_earnings = sum(p["amount"] for p in payouts if p["status"] == "paid")
        
        # Count assignments
        total_assignments = await db.assignments.count_documents({"influencer_id": influencer["id"]})
        completed_assignments = await db.assignments.count_documents({
            "influencer_id": influencer["id"],
            "status": "completed"
        })
        
        # Count applications
        total_applications = await db.applications.count_documents({"influencer_id": influencer["id"]})
        
        # Get platforms
        platforms = await db.influencer_platforms.find({"influencer_id": influencer["id"]}, {"_id": 0, "platform": 1, "followers_count": 1}).to_list(None)
        
        influencer_reports.append({
            "influencer_id": influencer["id"],
            "name": influencer["name"],
            "email": influencer_user["email"] if influencer_user else "N/A",
            "status": influencer["status"],
            "profile_completed": influencer.get("profile_completed", False),
            "has_payment_details": has_payment_details,
            "total_earnings": total_earnings,
            "pending_earnings": pending_earnings,
            "paid_earnings": paid_earnings,
            "total_assignments": total_assignments,
            "completed_assignments": completed_assignments,
            "total_applications": total_applications,
            "platforms": platforms,
            "created_at": influencer["created_at"]
        })
    
    return {
        "brands": brand_reports,
        "influencers": influencer_reports,
        "summary": {
            "total_brands": len(brand_reports),
            "total_influencers": len(influencer_reports),
            "total_platform_spending": sum(b["total_spent"] for b in brand_reports),
            "total_platform_earnings": sum(i["total_earnings"] for i in influencer_reports)
        }
    }

# File Upload Endpoint
@api_router.post("/upload")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """
    Upload a file and return the filename.
    The file can be accessed via /api/v1/files/{filename}
    This approach stores only filenames, making it work across all environments.
    """
    
    # Validate file
    if not file or not file.filename:
        logger.error("Upload failed: No file provided")
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Validate file size (50MB limit)
    MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB in bytes
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        logger.error(f"Upload failed: File too large ({len(content)} bytes)")
        raise HTTPException(status_code=400, detail=f"File too large. Maximum size is 50MB")
    
    # Reset file pointer
    await file.seek(0)
    
    # Use fixed uploads directory
    uploads_dir = Path("/app/backend/uploads")
    uploads_dir.mkdir(parents=True, exist_ok=True)
    
    # Set directory permissions (ignore errors in restrictive environments)
    try:
        os.chmod(uploads_dir, 0o775)
    except Exception as e:
        logger.warning(f"Could not set directory permissions: {str(e)}")
    
    # Generate unique filename with sanitization
    file_extension = Path(file.filename).suffix.lower()
    # Sanitize extension
    allowed_extensions = {
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',  # Images
        '.mp4', '.mov', '.avi', '.webm', '.mkv',  # Videos
        '.pdf', '.doc', '.docx', '.txt',  # Documents
        '.zip', '.tar', '.gz'  # Archives
    }
    
    if file_extension not in allowed_extensions:
        logger.warning(f"Potentially unsafe file extension: {file_extension}")
    
    unique_filename = f"{str(uuid.uuid4())}{file_extension}"
    file_path = uploads_dir / unique_filename
    
    # Save file with comprehensive error handling
    try:
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Verify file was written
        if not file_path.exists():
            raise Exception("File was not created on disk")
        
        file_size = file_path.stat().st_size
        if file_size == 0:
            raise Exception("File is empty after save")
        
        # Set file permissions (ignore errors)
        try:
            os.chmod(file_path, 0o664)
        except Exception as e:
            logger.warning(f"Could not set file permissions: {str(e)}")
        
        logger.info(f"File uploaded successfully: {unique_filename} ({file_size} bytes)")
        
    except PermissionError as e:
        logger.error(f"Permission denied when saving file: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Permission denied. Please contact administrator to fix upload directory permissions."
        )
    except OSError as e:
        logger.error(f"OS error when saving file: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Disk error: {str(e)}. Check disk space and permissions."
        )
    except Exception as e:
        logger.error(f"Unexpected error when saving file: {str(e)}")
        # Try to clean up partial file
        try:
            if file_path.exists():
                file_path.unlink()
        except:
            pass
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Construct the URL dynamically based on request origin
    # This makes it work in any environment (dev, staging, production)
    origin = request.headers.get('origin', '')
    host = request.headers.get('host', '')
    
    # Determine base URL from request
    if origin:
        base_url = origin
    elif host:
        # Determine protocol
        forwarded_proto = request.headers.get('x-forwarded-proto', 'https')
        base_url = f"{forwarded_proto}://{host}"
    else:
        # Fallback to environment variable
        base_url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
    
    # Construct full URL using the /api/v1/files/ endpoint
    file_url = f"{base_url}/api/v1/files/{unique_filename}"
    
    # Log audit
    try:
        await log_audit(user["id"], "upload", "file", unique_filename, {
            "original_name": file.filename,
            "size": file_size,
            "extension": file_extension
        })
    except Exception as e:
        logger.warning(f"Failed to log audit: {str(e)}")
    
    return {
        "filename": unique_filename,
        "original_filename": file.filename,
        "url": file_url,
        "size": file_size,
        "message": "File uploaded successfully"
    }


# Dynamic file serving endpoint - works across all environments
@api_router.get("/files/{filename}")
async def get_file(filename: str):
    """
    Serve uploaded files dynamically.
    This endpoint allows files to be accessed regardless of deployment environment.
    """
    # Sanitize filename to prevent directory traversal
    safe_filename = Path(filename).name
    if safe_filename != filename or '..' in filename or '/' in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    uploads_dir = Path("/app/backend/uploads")
    file_path = uploads_dir / safe_filename
    
    if not file_path.exists():
        logger.warning(f"File not found: {safe_filename}")
        raise HTTPException(status_code=404, detail="File not found")
    
    # Determine content type
    extension = file_path.suffix.lower()
    content_types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.mp4': 'video/mp4',
        '.mov': 'video/quicktime',
        '.avi': 'video/x-msvideo',
        '.webm': 'video/webm',
        '.mkv': 'video/x-matroska',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain',
        '.zip': 'application/zip',
        '.tar': 'application/x-tar',
        '.gz': 'application/gzip'
    }
    
    content_type = content_types.get(extension, 'application/octet-stream')
    
    return FileResponse(
        path=file_path,
        media_type=content_type,
        filename=safe_filename
    )


# Include router
app.include_router(api_router)

# Also keep static files mount as backup (for backwards compatibility)
try:
    app.mount("/api/uploads", StaticFiles(directory="/app/backend/uploads"), name="uploads")
except Exception as e:
    logger.warning(f"Could not mount static files: {str(e)}")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()