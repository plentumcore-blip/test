# AffiTarget - Product Requirements Document

## Overview
AffiTarget is a full-stack influencer marketing platform connecting brands with influencers for authentic Amazon product campaigns. The platform enables:
- **Brands**: Create campaigns, review influencer applications, verify purchases and content
- **Influencers**: Browse campaigns, apply, submit purchase proofs and content
- **Admins**: Manage users, verify content, configure platform settings

## Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: React with TailwindCSS
- **Database**: MongoDB
- **Authentication**: JWT-based cookie authentication

## Core Features

### User Roles
1. **Admin** - Platform administrators with full access
2. **Brand** - Company accounts that create and manage campaigns
3. **Influencer** - Content creators who participate in campaigns

### Authentication & Security
- JWT-based authentication with httpOnly cookies
- Strict password validation (8+ chars, uppercase, lowercase, number, special char)
- Role-based access control (RBAC)

### Campaign Lifecycle
1. Brand creates campaign (draft)
2. Brand publishes campaign
3. Influencers browse and apply
4. Brand accepts/declines applications
5. Influencer submits purchase proof
6. Brand reviews purchase proof
7. Influencer creates and submits content
8. Brand reviews content
9. Optional: Influencer submits product review (+$5 bonus)
10. Brand initiates payout

### Key Modules

#### Campaign Management
- Campaign creation with Amazon Attribution URLs
- Landing page builder for campaigns
- Purchase and post window scheduling

#### Assignment Workflow
- Application review system
- Purchase proof verification
- Content submission and review
- Product review submission (+$5 bonus)

#### File Upload System
- Direct file uploads (no URL inputs)
- Stored in `/app/backend/uploads`
- Served via FastAPI StaticFiles

#### Payment System
- Influencer payment settings (bank/PayPal)
- Brand payout management
- Transaction tracking

---

## What's Been Implemented

### January 16, 2026 - Edit Campaign Dates Feature
- ✅ Added `PUT /api/v1/campaigns/{id}/dates` endpoint for brands to update campaign dates
- ✅ "Edit Dates" button visible for published/live campaigns on brand campaigns page
- ✅ Modal with date pickers for purchase window (start/end) and post window (start/end)
- ✅ Date validation prevents end date before start date
- ✅ Pre-fills current dates when modal opens
- ✅ Success toast and automatic modal close on save

### January 16, 2026 - Email Notifications System
- ✅ Created comprehensive email service (`/app/backend/email_service.py`) with 16 email templates
- ✅ Integrated email notifications into all key flows:
  - **Registration**: Welcome emails to new influencers/brands + Admin notifications
  - **Applications**: Brand notified on new application, influencer notified on approve/reject
  - **Purchase Proofs**: Brand notified on submission, influencer notified on approve/reject
  - **Content Posts**: Brand notified on submission, influencer notified on approve/reject
  - **Product Reviews**: Brand notified on submission, influencer notified on approve/reject
- ✅ SMTP configuration via admin settings (supports MailSlurp, SendGrid, or any SMTP)
- ✅ Asynchronous email sending using `asyncio.create_task()` for non-blocking operations
- ✅ Beautiful HTML email templates with branding

### January 16, 2026 - Marketing Landing Page & Campaign Landing Page Editor
- ✅ Created new marketing landing page (`MarketingLandingPage.js`)
- ✅ Backend-manageable video section and stats
- ✅ Admin page for managing landing content (`/admin/landing-content`)
- ✅ **Enhanced Campaign Landing Page Builder** (`/brand/campaigns/:id/landing-page`):
  - **3 Tabs**: Settings, Sections, Custom HTML
  - Visual editor with formatting toolbar (bold, italic, headings, lists, alignment, links)
  - HTML code editor with dark theme
  - Quick insert templates (Product Features, Requirements List, Call to Action, Video Embed)
  - Live preview with responsive breakpoints (desktop/tablet/mobile)
  - **Editable "Why Join" section**: Add/Edit/Delete perks with title and description
  - **Editable "How It Works" section**: Add/Edit/Delete steps with auto-numbered step, title, description
  - Editable: slug, CTA text, hero image, testimonials, FAQs
- ✅ Campaign landing page renders all sections from database with defaults if not customized

### Previous Session
- ✅ Full assignment lifecycle (purchase proof, content post, product review)
- ✅ Platform-wide file upload system
- ✅ Admin user management (list, edit, ban, delete)
- ✅ Admin dashboard UI unification with sidebar
- ✅ Password security enhancement
- ✅ Campaign publishing & visibility fix
- ✅ Campaign landing page for individual campaigns
- ✅ Branding removal ("Made with Emergent" removed)
- ✅ Various bug fixes (CORS, icon overlap, default signup role)

---

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Landing Content (NEW)
- `GET /api/v1/public/landing-content` - Get marketing page content (public)
- `GET /api/v1/admin/landing-content` - Get landing content (admin)
- `PUT /api/v1/admin/landing-content` - Update landing content (admin)

### Campaigns
- `POST /api/v1/campaigns` - Create campaign
- `GET /api/v1/campaigns` - List campaigns
- `GET /api/v1/campaigns/{id}` - Get campaign
- `PUT /api/v1/campaigns/{id}/publish` - Publish campaign
- `PUT /api/v1/campaigns/{id}/landing-page` - Update landing page
- `GET /api/v1/public/campaigns/{slug}` - Public campaign landing page

### Applications & Assignments
- `POST /api/v1/applications` - Apply to campaign
- `GET /api/v1/campaigns/{id}/applications` - List applications
- `PUT /api/v1/applications/{id}/status` - Update application status
- `GET /api/v1/assignments` - List assignments
- `POST /api/v1/assignments/{id}/post` - Submit content post
- `POST /api/v1/assignments/{id}/review` - Submit product review

### File Upload
- `POST /api/v1/upload` - Upload file
- `GET /uploads/{filename}` - Serve uploaded file

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET/PUT/DELETE /api/v1/admin/users/{id}` - User management
- `PUT /api/v1/admin/users/{id}/approve` - Approve user
- `GET/PUT /api/v1/admin/email-settings` - Email settings

---

## File Structure

```
/app/
├── backend/
│   ├── server.py          # Main FastAPI application
│   ├── seed.py            # Database seeding script
│   ├── uploads/           # Uploaded files storage
│   └── tests/             # Backend tests
│       └── test_landing_content.py
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── AdminSidebar.js
│       │   ├── BrandSidebar.js
│       │   ├── InfluencerSidebar.js
│       │   ├── FileUpload.js
│       │   └── PasswordInput.js
│       ├── pages/
│       │   ├── MarketingLandingPage.js  # NEW
│       │   ├── CampaignLandingPage.js
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── admin/
│       │   │   ├── Dashboard.js
│       │   │   ├── Users.js
│       │   │   ├── Verification.js
│       │   │   ├── Settings.js
│       │   │   ├── Reports.js
│       │   │   └── LandingContent.js    # NEW
│       │   ├── brand/
│       │   └── influencer/
│       └── contexts/
│           └── AuthContext.js
└── test_reports/
```

---

## Test Credentials
- **Admin**: admin@example.com / Admin@123
- **Brand**: brand@example.com / Brand@123
- **Influencer**: creator@example.com / Creator@123

---

## Prioritized Backlog

### P0 - Critical
- None (all critical features implemented)

### P1 - High Priority
- Full user verification of file uploads across all flows

### P2 - Medium Priority
- Create custom `useFileUpload` React hook to reduce boilerplate
- Payment integration (Stripe/PayPal)
- Email notifications for key events

### P3 - Future Enhancements
- Analytics dashboard with charts
- Bulk campaign operations
- Influencer portfolio/profile pages
- Campaign performance metrics
- A/B testing for campaign landing pages
