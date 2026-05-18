import asyncio
import logging
import uuid
import datetime
from sqlalchemy.future import select
from sqlalchemy import func
from app.db.session import AsyncSessionLocal, engine
from app.core.config import settings
from app.crud.user import crud_user
from app.schemas.user import UserRegister
from app.models.user import User
from app.models.blog import Blog
from app.models.doctor import Doctor
from app.models.farm import Farmer, Animal, FarmConsultation, AIAlert
import app.db.base  # Ensures all models are registered

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sample_blogs = [
    {
        "title": "Understanding Seasonal Changes in Cattle",
        "description": "Learn about how seasonal changes affect your cattle's health and milk production.",
        "content": "Detailed article about seasonal impacts on livestock...",
        "cover_image_url": "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=1000",
        "published": True
    },
    {
        "title": "Essential Vaccinations for Dogs in 2024",
        "description": "A comprehensive guide to keeping your canine companion safe from common diseases.",
        "content": "Complete vaccination schedule for dogs...",
        "cover_image_url": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000",
        "published": True
    }
]

static_doctors = [
    {
        "name": "Dr. Ramesh Kumar",
        "specialty": "Large Animal Specialist",
        "experience": "15+ Years",
        "rating": 4.8,
        "reviews": 124,
        "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200",
        "availability": "Mon - Sat",
        "consultation_fee": "₹500",
        "languages": "English, Hindi"
    },
    {
        "name": "Dr. Priya Sharma",
        "specialty": "Small Animal & Avian",
        "experience": "8+ Years",
        "rating": 4.9,
        "reviews": 89,
        "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200",
        "availability": "Tue - Sun",
        "consultation_fee": "₹400",
        "languages": "English, Hindi, Marathi"
    }
]

async def init_db() -> None:
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(app.db.base.Base.metadata.create_all)
        
    async with AsyncSessionLocal() as db:
        admin_email = settings.ADMIN_EMAIL
        result = await db.execute(select(User).where(User.phone_or_email == admin_email))
        admin_user = result.scalars().first()
        
        if not admin_user:
            logger.info("Seeding first superadmin user...")
            user_in = UserRegister(
                full_name="System Admin",
                email=admin_email,
                password=settings.ADMIN_PASSWORD
            )
            admin_user = await crud_user.create(db, user_in)
            admin_user.role = "superadmin"
            admin_user.credits_remaining = 999999
            await db.commit()
        elif admin_user.role not in ("admin", "superadmin"):
            # Existing user was a regular user — promote to superadmin
            logger.info("Promoting existing user %s to superadmin...", admin_email)
            admin_user.role = "superadmin"
            await db.commit()
        # If already admin/superadmin, leave role unchanged so manual promotions are preserved
            
        # Seed Blogs
        blogs_count = await db.scalar(select(func.count(Blog.id)))
        if not blogs_count:
             logger.info("Seeding static blogs...")
             for blog_data in sample_blogs:
                 db.add(Blog(**blog_data))
             await db.commit()
             
        # Seed Doctors
        doctors_count = await db.scalar(select(func.count(Doctor.id)))
        if not doctors_count:
             logger.info("Seeding static doctors...")
             for doc_data in static_doctors:
                  doc = Doctor(**doc_data)
                  db.add(doc)
             await db.commit()

        # Seed Legacy Farm Data
        farmers_count = await db.scalar(select(func.count(Farmer.id)))
        if not farmers_count:
            logger.info("Seeding legacy farm data...")
            
            # Farmers
            f1 = Farmer(name="Aman Singh", location="Ambala, HR", contact="9876543210", status="Active")
            f2 = Farmer(name="Rajesh Patil", location="Karnal, HR", contact="9876543211", status="Active")
            f3 = Farmer(name="Sunita Devi", location="Rohtak, HR", contact="9876543212", status="Active")
            db.add_all([f1, f2, f3])
            await db.flush() # Get IDs
            
            # Animals
            a1 = Animal(tag_id="#TAG-88", species="Cow", breed="Gir", health_status="Healthy", recent_diagnosis="Routine Checkup - Clear", farmer_id=f1.id)
            a2 = Animal(tag_id="#TAG-42", species="Buffalo", breed="Murrah", health_status="Critical", recent_diagnosis="HS Infection detected by AI", farmer_id=f2.id)
            a3 = Animal(tag_id="#TAG-15", species="Goat", breed="Jamnapari", health_status="Monitoring", recent_diagnosis="Mild fever, nutritional gap", farmer_id=f3.id)
            db.add_all([a1, a2, a3])
            await db.flush()
            
            # Consultations
            c1 = FarmConsultation(ticket_id="C-12", animal_id=a1.id, farmer_id=f1.id, symptom="Reduced milk yield", diagnosis="Mastitis Risk (92%)", status="Active")
            c2 = FarmConsultation(ticket_id="G-08", animal_id=a3.id, farmer_id=f3.id, symptom="Loss of appetite", diagnosis="Nutritional Gap", status="Resolved")
            c3 = FarmConsultation(ticket_id="B-45", animal_id=a2.id, farmer_id=f2.id, symptom="Fever & lethargy", diagnosis="HS Infection (High)", status="Critical")
            db.add_all([c1, c2, c3])
            
            # AI Alerts
            al1 = AIAlert(alert_id="AI-8821", farm="Patil Dairy", tag_id="#TAG-42", type="Health Anomaly", confidence=94.0, time_label="2 mins ago", status="Critical", description="Thermal camera detects elevated body temperature. Potential HS Infection.")
            al2 = AIAlert(alert_id="AI-8820", farm="Sunita Farm", tag_id="#TAG-15", type="Behavioral Shift", confidence=82.0, time_label="15 mins ago", status="Warning", description="Reduced feeding activity detected over the last 6 hours.")
            db.add_all([al1, al2])
            
            await db.commit()

        logger.info("Database seeding complete!")

if __name__ == "__main__":
    asyncio.run(init_db())
