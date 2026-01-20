# AffiTarget - Amazon Influencer Campaign Platform

A full-stack web application for managing Amazon-only influencer campaigns. Connect brands with influencers, track purchases, verify posts, and manage everything from one platform.

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT with httpOnly cookies

### Frontend
- **Framework**: React 19
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Notifications**: Sonner

## Setup Instructions

### 1. Install Dependencies

**Backend**:
```bash
cd /app/backend
pip install -r requirements.txt
```

**Frontend**:
```bash
cd /app/frontend
yarn install
```

### 2. Seed Database

```bash
cd /app/backend
python seed.py
```

### 3. Start Services

Services are managed by supervisorctl:
```bash
sudo supervisorctl restart backend frontend
sudo supervisorctl status
```

### 4. Access Application

Open browser to: `https://brandfluence-6.preview.emergentagent.com`

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@example.com | Admin@123 |
| **Brand** | brand@example.com | Brand@123 |
| **Influencer** | creator@example.com | Creator@123 |

## Key Features

- ✅ Amazon Attribution URL tracking
- ✅ Purchase proof verification workflow
- ✅ Multi-step campaign builder
- ✅ Role-based dashboards (Admin/Brand/Influencer)
- ✅ Application & assignment management
- ✅ Click tracking with IP hashing
- ✅ Email settings configuration
- ✅ CSV exports
- ✅ Audit logs

## API Endpoints

All endpoints prefixed with `/api/v1`. See full documentation in project files.

## Workflows

### Brand: Create Campaign
1. Login → Dashboard → New Campaign
2. Enter campaign brief
3. Add Amazon Attribution URL
4. Set purchase & post windows
5. Review & Create

### Influencer: Complete Assignment
1. Browse Campaigns → Apply
2. Brand accepts → Assignment created
3. Click "Buy on Amazon" (tracked link)
4. Submit purchase proof
5. Wait for approval
6. Submit post (after approval)

## Production Notes

- Change JWT_SECRET and IP_HASH_SALT in .env
- Enable MongoDB authentication
- Add database indexes
- Implement rate limiting
- Enable HTTPS

## License

Proprietary - All rights reserved
