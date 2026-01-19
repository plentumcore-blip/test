import asyncio
import sys
sys.path.append('/app/backend')

from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
from datetime import datetime, timezone, timedelta
import uuid

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'affitarget_db')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_database():
    print("🌱 Seeding database...")
    
    # Clear existing data
    await db.users.delete_many({})
    await db.brands.delete_many({})
    await db.influencers.delete_many({})
    await db.campaigns.delete_many({})
    
    # Create Admin
    admin_user = {
        "id": str(uuid.uuid4()),
        "email": "admin@example.com",
        "password_hash": pwd_context.hash("Admin@123"),
        "role": "admin",
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "deleted_at": None
    }
    await db.users.insert_one(admin_user)
    print("✅ Created admin user: admin@example.com / Admin@123")
    
    # Create Brand User
    brand_user = {
        "id": str(uuid.uuid4()),
        "email": "brand@example.com",
        "password_hash": pwd_context.hash("Brand@123"),
        "role": "brand",
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "deleted_at": None
    }
    await db.users.insert_one(brand_user)
    
    # Create Brand Profile
    brand = {
        "id": str(uuid.uuid4()),
        "user_id": brand_user["id"],
        "company_name": "Demo Brand Co",
        "website": "https://demobrand.com",
        "description": "Leading Amazon seller of quality products",
        "status": "approved",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.brands.insert_one(brand)
    print("✅ Created brand user: brand@example.com / Brand@123")
    
    # Create Influencer User
    influencer_user = {
        "id": str(uuid.uuid4()),
        "email": "creator@example.com",
        "password_hash": pwd_context.hash("Creator@123"),
        "role": "influencer",
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "deleted_at": None
    }
    await db.users.insert_one(influencer_user)
    
    # Create Influencer Profile
    influencer = {
        "id": str(uuid.uuid4()),
        "user_id": influencer_user["id"],
        "name": "Demo Creator",
        "bio": "Professional product reviewer with 50k+ followers",
        "status": "approved",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.influencers.insert_one(influencer)
    print("✅ Created influencer user: creator@example.com / Creator@123")
    
    # Create sample campaign
    now = datetime.now(timezone.utc)
    campaign = {
        "id": str(uuid.uuid4()),
        "brand_id": brand["id"],
        "title": "Summer Product Launch Campaign",
        "description": "Promote our new summer product line on Amazon. Perfect for lifestyle and product review influencers!",
        "amazon_attribution_url": "https://www.amazon.com/dp/B08N5WRWNW?tag=demo-20",
        "purchase_window_start": now.isoformat(),
        "purchase_window_end": (now + timedelta(days=14)).isoformat(),
        "post_window_start": (now + timedelta(days=3)).isoformat(),
        "post_window_end": (now + timedelta(days=21)).isoformat(),
        "status": "live",
        "asin_allowlist": None,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    }
    await db.campaigns.insert_one(campaign)
    print("✅ Created sample campaign")
    
    print("\n🎉 Database seeded successfully!")
    print("\n📝 Test Accounts:")
    print("   Admin:      admin@example.com / Admin@123")
    print("   Brand:      brand@example.com / Brand@123")
    print("   Influencer: creator@example.com / Creator@123")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
