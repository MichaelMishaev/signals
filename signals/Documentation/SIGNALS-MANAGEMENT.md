# Signals Management Guide

Complete guide for managing trading signals in the PipGuru application.

## 📋 Table of Contents
1. [Database Setup](#database-setup)
2. [Adding New Signals](#adding-new-signals)
3. [Signal Data Structure](#signal-data-structure)
4. [Import/Export Tools](#importexport-tools)

---

## 🗄️ Database Setup

### Production Database
- **Provider**: Supabase (PostgreSQL)
- **Host**: Railway (AWS EU-Central-1)
- **Connection**: Pooler on port 6543
- **Database**: `postgres`

### Database URL Format
```
postgresql://postgres.avxygvzqfyxpzdxwmefe:PASSWORD@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
```

---

## ➕ Adding New Signals

### Method 1: Direct TypeScript Seeding (Quick & Easy)

**Best for**: Bulk signal updates, initial setup

1. **Edit the seed file**:
   ```bash
   cd signals/next-saas-nextjs
   nano prisma/seed-production.ts
   ```

2. **Add your signals** to the `signals` array (lines 11-192):
   ```typescript
   {
     title: 'EUR/USD Strong BUY Signal',
     title_ur: 'EUR/USD مضبوط خریداری کا سگنل',
     content: 'Detailed technical analysis...',
     content_ur: 'تفصیلی تکنیکی تجزیہ...',
     pair: 'EUR/USD',
     action: 'BUY',
     entry: 1.0850,
     stop_loss: 1.0820,
     take_profit: 1.0920,
     confidence: 87,
     market: 'FOREX',
     status: 'ACTIVE',
     priority: 'HIGH',
     author: 'Your Name',
     author_ur: 'آپ کا نام',
     published_date: new Date().toISOString(),
   }
   ```

3. **Run the seed script**:
   ```bash
   ./seed-production.sh
   ```

   ⚠️ **Warning**: This **DELETES all existing signals** before inserting new ones!

---

### Method 2: JSON Import (Flexible & Reusable)

**Best for**: Regular updates, importing from external sources

1. **Create a JSON file** with your signals (see `sample-signals.json`):
   ```json
   [
     {
       "title": "Signal Title",
       "title_ur": "اردو عنوان",
       "content": "Analysis...",
       "content_ur": "تجزیہ...",
       "pair": "EUR/USD",
       "action": "BUY",
       "entry": 1.0850,
       "stop_loss": 1.0820,
       "take_profit": 1.0920,
       "confidence": 87,
       "market": "FOREX",
       "status": "ACTIVE",
       "priority": "HIGH",
       "author": "Name",
       "author_ur": "نام",
       "published_date": "2025-10-10T12:00:00.000Z"
     }
   ]
   ```

2. **Import to production**:
   ```bash
   cd signals/next-saas-nextjs
   node import-signals-from-json.js your-signals.json
   ```

   ✅ **Advantage**: Adds signals WITHOUT deleting existing ones!

---

## 📊 Signal Data Structure

### Required Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | String | English title | "EUR/USD Strong BUY" |
| `pair` | String | Trading pair | "EUR/USD" |
| `action` | String | BUY or SELL | "BUY" |
| `entry` | Number | Entry price | 1.0850 |
| `market` | String | Market type | "FOREX" |
| `status` | String | Signal status | "ACTIVE" |

### Optional Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title_ur` | String | Urdu title | "خریداری کا سگنل" |
| `content` | String | English description | "Technical analysis..." |
| `content_ur` | String | Urdu description | "تکنیکی تجزیہ..." |
| `stop_loss` | Number | Stop loss price | 1.0820 |
| `take_profit` | Number | Take profit price | 1.0920 |
| `confidence` | Number | 0-100 confidence | 87 |
| `priority` | String | HIGH/MEDIUM/LOW | "HIGH" |
| `author` | String | English author name | "Ahmad Ali" |
| `author_ur` | String | Urdu author name | "احمد علی" |
| `published_date` | ISO8601 | Publication date | "2025-10-10T12:00:00.000Z" |

### Enums

**Action**:
- `BUY`
- `SELL`

**Market**:
- `FOREX` - Foreign exchange
- `CRYPTO` - Cryptocurrency
- `PSX` - Pakistan Stock Exchange
- `COMMODITIES` - Gold, oil, etc.

**Status**:
- `ACTIVE` - Currently active signal
- `CLOSED` - Completed signal
- `CANCELLED` - Cancelled signal

**Priority**:
- `HIGH` - Important signal
- `MEDIUM` - Normal priority
- `LOW` - Lower priority

---

## 🔧 Import/Export Tools

### Export Signals from Local Database

```bash
node export-local-signals.js
```

This creates `local-signals-export.json` with signals from your local database.

### Import Signals to Production

```bash
node import-signals-from-json.js <filename.json>
```

**Features**:
- Validates all signals before import
- Shows preview of what will be imported
- Asks for confirmation before making changes
- Reports success/failure for each signal
- **Does NOT delete existing signals**

### Sample JSON File

See `sample-signals.json` for a working example with 2 signals.

---

## 🚀 Quick Workflows

### Add 1-5 New Signals
```bash
# Create JSON file
cat > new-signals.json << EOF
[
  {
    "title": "New Signal",
    "pair": "GBP/USD",
    "action": "BUY",
    ...
  }
]
EOF

# Import
node import-signals-from-json.js new-signals.json
```

### Replace All Signals
```bash
# Edit the seed file
nano prisma/seed-production.ts

# Run seed script
./seed-production.sh
```

### Backup Current Signals
```bash
# Export from production (you'll need to modify export script)
node export-local-signals.js  # Modify to use production URL
```

---

## 🔐 Security Notes

- Database credentials are in `seed-production.sh`
- **DO NOT** commit `.env` files with production credentials
- Use environment variables in production
- The import tool prompts for confirmation before making changes

---

## 📝 Tips

1. **Always test JSON files** before importing to production
2. **Keep backups** of your signal data
3. **Use ISO8601 dates** for published_date: `2025-10-10T12:00:00.000Z`
4. **Include both English and Urdu** content for better UX
5. **Set realistic confidence levels** (70-95 is typical)
6. **Use appropriate priorities** to help users focus on important signals

---

## 🐛 Troubleshooting

### "Connection refused"
- Check DATABASE_URL in environment
- Verify Supabase/Railway is running
- Check network/firewall settings

### "Table does not exist"
- Run migrations: `npx prisma migrate deploy`
- Check Prisma schema matches database

### "Invalid JSON"
- Validate JSON syntax: `node -e "JSON.parse(require('fs').readFileSync('file.json'))"`
- Check for trailing commas
- Ensure proper UTF-8 encoding for Urdu text

### "Missing required fields"
- Review the required fields table above
- The import tool will show which fields are missing

---

**Need Help?** Check the Prisma schema at `prisma/schema.prisma` for complete field definitions.
