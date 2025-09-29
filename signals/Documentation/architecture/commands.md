# Local Development Commands

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
4. Use "Manage Feature Flags" button to access the improved feature flags panel
5. Create flags with clear explanations and examples
6. Toggle flags on/off with visual switches
7. Search and filter flags easily

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