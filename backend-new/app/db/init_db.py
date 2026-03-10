import asyncio
import logging
from app.db.session import AsyncSessionLocal
from app.core.config import settings
from app.crud.user import crud_user, pwd_context
from app.schemas.user import UserRegister
from app.models.user import User
from app.models.blog import Blog
from app.models.doctor import Doctor
import app.db.base  # Ensures all models are registered
from sqlalchemy.future import select

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
    async with AsyncSessionLocal() as db:
        admin_email = settings.ADMIN_EMAIL
        result = await db.execute(select(User).where(User.phone_or_email == admin_email))
        admin_user = result.scalars().first()
        
        if not admin_user:
            logger.info("Seeding Admin User...")
            user_in = UserRegister(
                full_name="System Admin",
                phone_or_email=admin_email,
                password=settings.ADMIN_PASSWORD
            )
            admin_user = await crud_user.create(db, user_in)
            admin_user.role = "admin"
            admin_user.credits_remaining = 999999
            await db.commit()
            
        # Seed Blogs
        blogs_count = await db.scalar(select(User).where(Blog.published == True))
        if blogs_count is None or blogs_count == 0:
             logger.info("Seeding static blogs...")
             for blog_data in sample_blogs:
                 db.add(Blog(**blog_data))
             await db.commit()
             
        # Seed Doctors
        doctors_count = await db.scalar(select(User).where(Doctor.name != None))
        if doctors_count is None or doctors_count == 0:
             logger.info("Seeding static doctors...")
             for doc_data in static_doctors:
                  doc = Doctor(**doc_data)
                  # Handle type conversion for testing legacy float vs string
                  doc.rating = float(doc_data["rating"])
                  doc.reviews = int(doc_data["reviews"])
                  db.add(doc)
             await db.commit()

        logger.info("Database seeding complete!")

if __name__ == "__main__":
    asyncio.run(init_db())
