import asyncio
import os
import sys

# Add the project root to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.future import select
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.models.pet import Pet
from app.models.appointment import Appointment
from app.models.chat import ChatSession

async def main():
    if len(sys.argv) > 1:
        email = sys.argv[1]
    else:
        email = input("Enter email for main admin: ")
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.phone_or_email == email))
        user = result.scalars().first()
        if user:
            user.role = "superadmin"
            await session.commit()
            print(f"\nSuccess! Updated {email} to 'superadmin' role.")
            print("This user can now add and remove other admins in the pvadmin panel.")
        else:
            print("\nError: User not found in the database. Please make sure the user exists first.")

if __name__ == "__main__":
    asyncio.run(main())
