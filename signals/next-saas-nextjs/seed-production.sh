#!/bin/bash

echo "🌱 Production Database Seeding Script"
echo "======================================"
echo ""

# Supabase production DATABASE_URL
export DATABASE_URL="postgresql://postgres.avxygvzqfyxpzdxwmefe:Jtbdtjtb6262@aws-1-eu-central-1.pooler.supabase.com:6543/postgres"

echo "📡 Database: Supabase Production (aws-1-eu-central-1)"
echo ""

# Confirm with user
read -p "⚠️  This will DELETE existing signals and add 10 new sample signals. Continue? (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "❌ Seeding cancelled"
  exit 0
fi

echo ""
echo "🚀 Running seed script..."
echo ""

# Run the TypeScript seed file
npx tsx prisma/seed-production.ts

echo ""
echo "✅ Seeding complete!"
echo ""
echo "🌐 Check your signals at: https://www.pipguru.club/en"
