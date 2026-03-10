from fastapi import FastAPI, APIRouter, HTTPException, Depends, File, UploadFile, BackgroundTasks, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import base64

from auth import hash_password, verify_password, create_access_token, verify_token, generate_otp
from emails import send_appointment_confirmation, send_doctor_application_notification, send_contact_form_notification
from ai_chat import gopu_ai
from speech import speech_service

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="PashuVaani API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============ MODELS ============

class UserRegister(BaseModel):
    full_name: str
    phone_or_email: str
    password: str

class UserLogin(BaseModel):
    phone_or_email: str
    password: str

class PetCreate(BaseModel):
    name: str
    pet_type: str
    age: Optional[str] = None
    gender: Optional[str] = None
    weight: Optional[str] = None

class DoctorApplication(BaseModel):
    name: str
    phone: str
    email: EmailStr
    qualification: str
    registration_number: str
    specialization: str
    district: str
    experience_years: int
    consultation_fee: float
    availability: str

class AppointmentCreate(BaseModel):
    pet_name: str
    pet_type: str
    gender: str
    age: Optional[str] = "NA"
    weight: Optional[str] = "NA"
    weight_unit: str = "KG"
    owner_name: str
    owner_number: str
    vaccination_status: bool
    medical_history_available: bool
    medical_history: Optional[str] = ""
    time_slot: str

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None
    image_base64: Optional[str] = None

class SpeechTranscribe(BaseModel):
    audio_base64: str
    language: Optional[str] = None

class SpeechSynthesize(BaseModel):
    text: str

class BlogCreate(BaseModel):
    title: str
    description: str
    content: str
    cover_image_url: Optional[str] = ""
    published: bool = False

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class CreditPurchase(BaseModel):
    plan_type: str  # daily, monthly
    payment_id: str

class CareerApplication(BaseModel):
    name: str
    phone: str
    email: EmailStr
    resume_base64: str
    resume_filename: str

# ============ AUTH DEPENDENCY ============

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"id": payload.get("user_id")}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    admin = await db.admin_users.find_one({"id": payload.get("user_id")}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin not found")
    return admin

# ============ ROOT ============

@api_router.get("/")
async def root():
    return {
        "message": "PashuVaani API",
        "version": "2.0.0",
        "status": "running"
    }

# ============ USER AUTH ROUTES ============

@api_router.post("/auth/register")
async def register_user(user: UserRegister):
    existing_user = await db.users.find_one({"phone_or_email": user.phone_or_email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "full_name": user.full_name,
        "phone_or_email": user.phone_or_email,
        "password": hash_password(user.password),
        "credits": 3,
        "daily_message_count": 0,
        "last_message_date": None,
        "has_subscription": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "pets": []
    }
    
    await db.users.insert_one(user_doc)
    token = create_access_token({"user_id": user_id, "role": "user"})
    
    return {
        "message": "User registered successfully",
        "token": token,
        "user_id": user_id,
        "full_name": user.full_name,
        "credits": 3
    }

@api_router.post("/auth/login")
async def login_user(user: UserLogin):
    db_user = await db.users.find_one({"phone_or_email": user.phone_or_email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"user_id": db_user["id"], "role": "user"})
    
    return {
        "message": "Login successful",
        "token": token,
        "user_id": db_user["id"],
        "full_name": db_user["full_name"],
        "credits": db_user.get("credits", 0)
    }

@api_router.get("/auth/me")
async def get_me(current_user = Depends(get_current_user)):
    return current_user

# ============ CREDIT SYSTEM ============

@api_router.get("/credits/balance")
async def get_credit_balance(current_user = Depends(get_current_user)):
    """Get user's current credit balance"""
    today = datetime.now(timezone.utc).date().isoformat()
    
    # Reset daily count if new day
    if current_user.get("last_message_date") != today:
        await db.users.update_one(
            {"id": current_user["id"]},
            {"$set": {"daily_message_count": 0, "last_message_date": today}}
        )
        daily_count = 0
    else:
        daily_count = current_user.get("daily_message_count", 0)
    
    credits = current_user.get("credits", 0)
    has_subscription = current_user.get("has_subscription", False)
    
    return {
        "credits": credits,
        "daily_count": daily_count,
        "has_subscription": has_subscription,
        "can_chat": has_subscription or daily_count < 3
    }

@api_router.post("/credits/purchase")
async def purchase_credits(purchase: CreditPurchase, current_user = Depends(get_current_user)):
    """Purchase credit plan"""
    plans = {
        "daily": {"price": 10, "credits": 25, "images": 2, "validity_hours": 24},
        "monthly": {"price": 99, "credits": 300, "images": 20, "validity_days": 30}
    }
    
    if purchase.plan_type not in plans:
        raise HTTPException(status_code=400, detail="Invalid plan type")
    
    plan = plans[purchase.plan_type]
    
    # Update user credits
    await db.users.update_one(
        {"id": current_user["id"]},
        {
            "$set": {
                "credits": plan["credits"],
                "has_subscription": True,
                "subscription_plan": purchase.plan_type,
                "subscription_expires": (
                    datetime.now(timezone.utc) + timedelta(hours=plan.get("validity_hours", 0)) + timedelta(days=plan.get("validity_days", 0))
                ).isoformat()
            }
        }
    )
    
    # Record purchase
    await db.credit_purchases.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "plan_type": purchase.plan_type,
        "amount": plan["price"],
        "credits": plan["credits"],
        "payment_id": purchase.payment_id,
        "purchased_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "message": "Credits purchased successfully",
        "credits": plan["credits"],
        "plan": purchase.plan_type
    }

# ============ PET ROUTES ============

@api_router.post("/pets")
async def add_pet(pet: PetCreate, current_user = Depends(get_current_user)):
    pet_id = str(uuid.uuid4())
    pet_doc = {
        "id": pet_id,
        "user_id": current_user["id"],
        **pet.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.pets.insert_one(pet_doc)
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$push": {"pets": pet_id}}
    )
    
    return {"message": "Pet added successfully", "pet_id": pet_id}

@api_router.get("/pets")
async def get_user_pets(current_user = Depends(get_current_user)):
    pets = await db.pets.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(100)
    return pets

# ============ DOCTOR ROUTES (NO REGISTRATION) ============

@api_router.get("/doctors")
async def get_doctors():
    """Get static doctor list"""
    static_doctors = [
        {
            "id": "doc1",
            "name": "Dr. Rajesh Kumar",
            "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
            "specialization": "Large Animal Medicine",
            "years_of_practice": 15,
            "consultation_fee": 500
        },
        {
            "id": "doc2",
            "name": "Dr. Priya Sharma",
            "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
            "specialization": "Small Animal Surgery",
            "years_of_practice": 12,
            "consultation_fee": 600
        },
        {
            "id": "doc3",
            "name": "Dr. Amit Patel",
            "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
            "specialization": "Dairy & Livestock Health",
            "years_of_practice": 18,
            "consultation_fee": 450
        },
        {
            "id": "doc4",
            "name": "Dr. Sneha Reddy",
            "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
            "specialization": "Exotic & Pet Animals",
            "years_of_practice": 10,
            "consultation_fee": 550
        }
    ]
    return static_doctors

# ============ APPOINTMENT ROUTES ============

@api_router.post("/appointments")
async def create_appointment(appointment: AppointmentCreate, background_tasks: BackgroundTasks):
    appointment_id = str(uuid.uuid4())
    appointment_doc = {
        "id": appointment_id,
        **appointment.model_dump(),
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.appointments.insert_one(appointment_doc)
    
    return {
        "message": "Appointment booked successfully",
        "appointment_id": appointment_id,
        "status": "pending"
    }

@api_router.get("/appointments")
async def get_appointments(current_user = Depends(get_current_user)):
    appointments = await db.appointments.find(
        {"owner_number": current_user.get("phone_or_email")},
        {"_id": 0}
    ).to_list(100)
    return appointments

# ============ AI CHAT ROUTES WITH CREDIT CHECK ============

@api_router.post("/chat")
async def chat_with_gopu(chat: ChatMessage, current_user = Depends(get_current_user)):
    try:
        session_id = chat.session_id or str(uuid.uuid4())
        today = datetime.now(timezone.utc).date().isoformat()
        
        # Check if user has subscription
        has_subscription = current_user.get("has_subscription", False)
        
        if has_subscription:
            # Check subscription expiry
            exp_date = current_user.get("subscription_expires")
            if exp_date and datetime.fromisoformat(exp_date) < datetime.now(timezone.utc):
                has_subscription = False
                await db.users.update_one(
                    {"id": current_user["id"]},
                    {"$set": {"has_subscription": False}}
                )
        
        if not has_subscription:
            # Free tier: Check daily limit
            if current_user.get("last_message_date") != today:
                # Reset daily count
                await db.users.update_one(
                    {"id": current_user["id"]},
                    {"$set": {"daily_message_count": 0, "last_message_date": today}}
                )
                daily_count = 0
            else:
                daily_count = current_user.get("daily_message_count", 0)
            
            # Soft warnings
            if daily_count == 8:
                return {
                    "response": "You're nearing your free consultation limit. You have 2 messages remaining.",
                    "severity": "warning",
                    "session_id": session_id,
                    "credits_warning": True,
                    "remaining": 2
                }
            elif daily_count == 9:
                return {
                    "response": "You have 1 message remaining before credit purchase is required.",
                    "severity": "warning",
                    "session_id": session_id,
                    "credits_warning": True,
                    "remaining": 1
                }
            elif daily_count >= 10:
                # Hard limit
                return {
                    "response": "You've used your free messages for today. We truly hope Gopu.AI has been helpful for your Pashu's care. Because Pashu bhi Pariwar hai, we never want you to feel unsupported when it matters most. To continue receiving unlimited guidance and immediate assistance, please purchase credits and let Gopu stay by your side.",
                    "severity": "blocked",
                    "session_id": session_id,
                    "limit_reached": True,
                    "show_purchase": True
                }
        
        # Get AI response
        response = await gopu_ai.chat(
            session_id=session_id,
            message=chat.message,
            image_base64=chat.image_base64
        )
        
        # Increment message count for free users
        if not has_subscription:
            await db.users.update_one(
                {"id": current_user["id"]},
                {"$inc": {"daily_message_count": 1}}
            )
        
        # Store chat in history
        chat_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "user_id": current_user["id"],
            "message": chat.message,
            "response": response["response"],
            "severity": response["severity"],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "has_image": bool(chat.image_base64)
        }
        await db.chat_history.insert_one(chat_doc)
        
        # Log emergency
        if response["severity"] == "red":
            emergency_doc = {
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "user_id": current_user["id"],
                "severity": "red",
                "message": chat.message,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            await db.emergency_logs.insert_one(emergency_doc)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============ SPEECH ROUTES ============

@api_router.post("/speech/transcribe")
async def transcribe_speech(speech: SpeechTranscribe):
    try:
        text = await speech_service.transcribe_audio(
            audio_base64=speech.audio_base64,
            language=speech.language
        )
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/speech/synthesize")
async def synthesize_speech(speech: SpeechSynthesize):
    try:
        audio_base64 = await speech_service.synthesize_speech(
            text=speech.text
        )
        return {"audio_base64": audio_base64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============ BLOG ROUTES ============

@api_router.get("/blogs")
async def get_blogs():
    blogs = await db.blogs.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return blogs

@api_router.get("/blogs/{blog_id}")
async def get_blog(blog_id: str):
    blog = await db.blogs.find_one({"id": blog_id, "published": True}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

# ============ CONTACT ROUTE ============

@api_router.post("/contact")
async def submit_contact_form(form: ContactForm, background_tasks: BackgroundTasks):
    contact_id = str(uuid.uuid4())
    contact_doc = {
        "id": contact_id,
        **form.model_dump(),
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.contact_submissions.insert_one(contact_doc)
    background_tasks.add_task(send_contact_form_notification, form.model_dump())
    
    return {"message": "Thank you for contacting us. We will get back to you soon."}

# ============ CAREER APPLICATION ROUTES ============

@api_router.post("/careers/apply")
async def submit_career_application(application: CareerApplication):
    app_id = str(uuid.uuid4())
    app_doc = {
        "id": app_id,
        "name": application.name,
        "phone": application.phone,
        "email": application.email,
        "resume_filename": application.resume_filename,
        "resume_base64": application.resume_base64,
        "status": "pending",
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.career_applications.insert_one(app_doc)
    
    return {"message": "Application submitted successfully", "application_id": app_id}

@api_router.get("/admin/career-applications")
async def get_career_applications(current_admin = Depends(get_current_admin)):
    applications = await db.career_applications.find({}, {"_id": 0, "resume_base64": 0}).sort("submitted_at", -1).to_list(100)
    return applications

# ============ ADMIN ROUTES ============

@api_router.post("/admin/login")
async def admin_login(admin: AdminLogin):
    db_admin = await db.admin_users.find_one({"email": admin.email})
    if not db_admin or not verify_password(admin.password, db_admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"user_id": db_admin["id"], "role": "admin"})
    
    return {
        "message": "Admin login successful",
        "token": token,
        "admin_id": db_admin["id"],
        "email": db_admin["email"]
    }

@api_router.get("/admin/dashboard")
async def get_admin_dashboard(current_admin = Depends(get_current_admin)):
    total_users = await db.users.count_documents({})
    total_pets = await db.pets.count_documents({})
    total_appointments = await db.appointments.count_documents({})
    total_doctors = 4  # Static doctors
    
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
    today_appointments = await db.appointments.count_documents({
        "created_at": {"$gte": today}
    })
    
    emergency_alerts = await db.emergency_logs.count_documents({
        "timestamp": {"$gte": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()}
    })
    
    # Credit Analytics
    total_credits_purchased = await db.credit_purchases.count_documents({})
    
    # Calculate total credits used (sum of daily_message_count across all users)
    pipeline = [
        {"$group": {"_id": None, "total_used": {"$sum": "$daily_message_count"}}}
    ]
    credits_used_result = await db.users.aggregate(pipeline).to_list(1)
    total_credits_used = credits_used_result[0]["total_used"] if credits_used_result else 0
    
    # Calculate revenue from credits
    revenue_pipeline = [
        {"$group": {"_id": None, "total_revenue": {"$sum": "$amount"}}}
    ]
    revenue_result = await db.credit_purchases.aggregate(revenue_pipeline).to_list(1)
    revenue_from_credits = revenue_result[0]["total_revenue"] if revenue_result else 0
    
    return {
        "total_users": total_users,
        "total_pets": total_pets,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "today_appointments": today_appointments,
        "emergency_alerts_7d": emergency_alerts,
        "pending_doctor_applications": 0,
        "total_credits_purchased": total_credits_purchased,
        "total_credits_used": total_credits_used,
        "revenue_from_credits": revenue_from_credits
    }

@api_router.get("/admin/appointments")
async def get_all_appointments(current_admin = Depends(get_current_admin)):
    appointments = await db.appointments.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return appointments

@api_router.put("/admin/appointments/{appointment_id}/confirm")
async def confirm_appointment(appointment_id: str, current_admin = Depends(get_current_admin)):
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": "confirmed", "confirmed_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment confirmed"}

@api_router.put("/admin/appointments/{appointment_id}/cancel")
async def cancel_appointment(appointment_id: str, current_admin = Depends(get_current_admin)):
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": "cancelled", "cancelled_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment cancelled"}

@api_router.get("/admin/emergency-logs")
async def get_emergency_logs(current_admin = Depends(get_current_admin)):
    logs = await db.emergency_logs.find({}, {"_id": 0}).sort("timestamp", -1).to_list(100)
    return logs

@api_router.post("/admin/blogs")
async def create_blog(blog: BlogCreate, current_admin = Depends(get_current_admin)):
    blog_id = str(uuid.uuid4())
    blog_doc = {
        "id": blog_id,
        **blog.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.blogs.insert_one(blog_doc)
    
    return {"message": "Blog created successfully", "blog_id": blog_id}

@api_router.get("/admin/blogs")
async def get_all_blogs(current_admin = Depends(get_current_admin)):
    blogs = await db.blogs.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return blogs

@api_router.post("/admin/init")
async def initialize_admin():
    existing_admin = await db.admin_users.find_one({"email": "admin@pashuvaani.com"})
    if existing_admin:
        return {"message": "Admin already exists"}
    
    admin_doc = {
        "id": str(uuid.uuid4()),
        "email": "admin@pashuvaani.com",
        "password": hash_password("admin123"),
        "role": "super_admin",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.admin_users.insert_one(admin_doc)
    
    return {"message": "Admin created successfully", "email": "admin@pashuvaani.com", "password": "admin123"}

@api_router.post("/seed/blogs")
async def seed_blogs():
    """Seed initial blog posts"""
    existing_blogs = await db.blogs.count_documents({})
    if existing_blogs > 0:
        return {"message": "Blogs already seeded", "count": existing_blogs}
    
    sample_blogs = [
        {
            "id": str(uuid.uuid4()),
            "title": "Essential Vaccination Guide for Your Pets",
            "description": "Learn about the importance of vaccinations and the recommended schedule for dogs and cats to keep them healthy and protected.",
            "content": """<h2>Why Vaccinations Matter</h2>
<p>Vaccinations are one of the most important preventive measures you can take for your pet's health. They protect against serious and potentially fatal diseases.</p>

<h3>Core Vaccines for Dogs</h3>
<ul>
<li><strong>Rabies</strong> - Required by law in most areas</li>
<li><strong>Distemper</strong> - Protects against a highly contagious viral disease</li>
<li><strong>Parvovirus</strong> - Essential protection against this deadly virus</li>
<li><strong>Adenovirus</strong> - Prevents hepatitis and respiratory disease</li>
</ul>

<h3>Core Vaccines for Cats</h3>
<ul>
<li><strong>Rabies</strong> - Essential for all cats</li>
<li><strong>Feline Panleukopenia</strong> - Also known as feline distemper</li>
<li><strong>Feline Calicivirus</strong> - Protects against respiratory infections</li>
<li><strong>Feline Herpesvirus</strong> - Prevents upper respiratory infections</li>
</ul>

<h3>Vaccination Schedule</h3>
<p>Puppies and kittens should start their vaccination series at 6-8 weeks of age, with boosters every 3-4 weeks until they are 16 weeks old. Adult pets need regular boosters as recommended by your veterinarian.</p>

<p>Always consult with your veterinarian to create a personalized vaccination plan for your pet based on their lifestyle and risk factors.</p>""",
            "cover_image_url": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
            "published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Common Signs Your Pet Needs Immediate Veterinary Care",
            "description": "Recognize the warning signs that indicate your pet needs emergency medical attention. Early detection can save lives.",
            "content": """<h2>Emergency Warning Signs</h2>
<p>As a pet owner, knowing when your pet needs immediate medical attention can be the difference between life and death. Here are the critical signs to watch for:</p>

<h3>Seek Emergency Care If You Notice:</h3>
<ul>
<li><strong>Difficulty Breathing</strong> - Labored breathing, gasping, or blue gums</li>
<li><strong>Severe Bleeding</strong> - Bleeding that won't stop with pressure</li>
<li><strong>Collapse or Inability to Stand</strong> - Sudden weakness or paralysis</li>
<li><strong>Seizures</strong> - Especially if lasting more than 2 minutes</li>
<li><strong>Bloated Abdomen</strong> - Particularly in large breed dogs</li>
<li><strong>Ingestion of Toxic Substances</strong> - Chocolate, xylitol, antifreeze, etc.</li>
</ul>

<h3>Other Concerning Symptoms</h3>
<ul>
<li>Persistent vomiting or diarrhea (especially with blood)</li>
<li>Not eating for more than 24 hours</li>
<li>Straining to urinate or defecate</li>
<li>Extreme lethargy or unresponsiveness</li>
<li>Eye injuries or sudden vision changes</li>
</ul>

<p><strong>Remember:</strong> When in doubt, always err on the side of caution and contact your veterinarian or emergency animal hospital.</p>""",
            "cover_image_url": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
            "published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Nutrition Tips for Healthy Farm Animals",
            "description": "Proper nutrition is key to maintaining healthy livestock. Learn about balanced diets for cattle, goats, and poultry.",
            "content": """<h2>Farm Animal Nutrition Basics</h2>
<p>Proper nutrition is the foundation of animal health and productivity. Whether you're raising cattle, goats, or poultry, understanding their nutritional needs is essential.</p>

<h3>Cattle Nutrition</h3>
<p>Cattle require a balanced diet of:</p>
<ul>
<li><strong>Roughage</strong> - Hay, silage, and pasture grass</li>
<li><strong>Concentrates</strong> - Grains for energy</li>
<li><strong>Minerals</strong> - Salt, calcium, phosphorus</li>
<li><strong>Clean Water</strong> - Access to fresh water at all times</li>
</ul>

<h3>Goat Nutrition</h3>
<p>Goats are natural browsers and thrive on:</p>
<ul>
<li>Varied forage including leaves, twigs, and shrubs</li>
<li>Quality hay during dry seasons</li>
<li>Mineral supplements, especially copper</li>
<li>Clean, fresh water</li>
</ul>

<h3>Poultry Nutrition</h3>
<p>Chickens and other poultry need:</p>
<ul>
<li>Balanced commercial feed appropriate for their age</li>
<li>Calcium supplements for laying hens (oyster shells)</li>
<li>Grit for digestion</li>
<li>Fresh water changed daily</li>
</ul>

<p>Always consult with a veterinarian or animal nutritionist to develop a feeding program tailored to your animals' specific needs.</p>""",
            "cover_image_url": "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
            "published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.blogs.insert_many(sample_blogs)
    
    return {"message": "Blogs seeded successfully", "count": len(sample_blogs)}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()