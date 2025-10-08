# Local Development Commands

http://localhost:5001/admin
6262

commands:
imitate railway build:

cd /Users/michaelmishayev/Desktop/signals && docker build -t railway-test -f Dockerfile .

build:
cd signals/next-saas-nextjs          
npm run dev


run:
cd signals/next-saas-nextjs          
npm run build
## Quick Start

### 1. Launch Site Locally
```bash
cd signals/next-saas-nextjs
npm run dev
```
Site will be available at: `http://localhost:5001`

### 2. Access Admin Dashboard
1. Navigate to: `http://localhost:5001/admin`
2. Enter admin password: `6262`
3. Access the comprehensive dashboard showing:
   - All application routes and pages
   - Production visibility status (visible/hidden)
   - Authentication requirements
   - Route categories (public, auth, admin, drill, signal, api)
   - Search and filter functionality

### 3. Admin Quick Actions
Available from the admin dashboard:

- **📈 Signals & Drills** (`/admin/signals`) - Manage trading content
- **🚩 Feature Flags** (`/admin/feature-flags`) - Turn features on/off instantly
- **🇵🇰 Urdu Demand** (`/admin/urdu-demand`) - Phase 0: View analytics for Urdu interest tracking
- **👀 View Live Site** (`/`) - See what visitors see
- **🚀 Test Production Mode** - Use dev toggle

### 4. Phase 0: Urdu Demand Validation
**Purpose**: Track user interest in Urdu translation before investing 243 hours

1. **User-facing**: Button on homepage (`/en`) - "🇵🇰 اردو میں دیکھیں؟ (View in Urdu?)"
2. **Admin Dashboard**: View analytics at `/admin/urdu-demand`
   - Total clicks tracked
   - Last 7 days / 30 days statistics
   - Conversion rate calculation
   - Demand level indicator (HIGH/MODERATE/LOW)
   - Automated recommendations

3. **API Endpoints**:
   - `POST /api/analytics/track` - Track Urdu interest clicks
   - `GET /api/analytics/urdu-demand` - Get analytics summary

4. **Decision Criteria** (after 4 weeks):
   - 🟢 **>30% demand** → Proceed to Phase 1 (20 hours)
   - 🟡 **10-30% demand** → Monitor 3 more months
   - 🔴 **<10% demand** → Stop, save 243 hours

## Database Setup
```bash
# Run database migrations
cd signals/next-saas-nextjs
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

## Environment Requirements
- Node.js 18+
- PostgreSQL database running
- `.env.local` file with `DATABASE_URL` configured

## Common Issues
- If admin dashboard doesn't work, make sure you enter the correct password: `6262`
- If database errors occur, run `npx prisma migrate dev` to apply latest schema
- If build fails, run `npm install` to ensure dependencies are up to date