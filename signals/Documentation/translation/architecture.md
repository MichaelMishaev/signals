# Translation System - Technical Architecture (Dual-Layer Approach)

## System Overview

Multi-language translation system for TradeSignal PK with English (default) and Urdu (RTL) support. Dual-layer approach combining:
1. **JSON files** for static UI (buttons, labels, navigation)
2. **Direct database columns** for dynamic content (signals, drills) - High performance
3. **TranslationDynamic table** for content management workflow and approval process

**Status**: ✅ Implemented & Active (Database schema updated, API locale-aware, Components integrated)

---

## Quick Start Guide (For Developers)

### Adding Urdu Translations to Existing Signals

**Option 1: Direct Database Update (Supabase Dashboard)**
```sql
-- Update a specific signal
UPDATE signals
SET
  title_ur = 'EUR/USD خریداری سگنل',
  content_ur = 'مضبوط تیزی کی رفتار متوقع',
  author_ur = 'احمد علی'
WHERE id = 1;
```

**Option 2: Programmatic Update (TypeScript Script)**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(supabaseUrl, supabaseKey);

await supabase
  .from('signals')
  .update({
    title_ur: 'EUR/USD خریداری سگنل',
    content_ur: 'مضبوط تیزی کی رفتار متوقع',
    author_ur: 'احمد علی'
  })
  .eq('id', 1);
```

### Using Translations in Components

**Static UI (Labels, Buttons)**
```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('signals.sidebar');
<button>{t('actions.buyNow')}</button>  // "Buy Now" or "ابھی خریدیں"
```

**Dynamic Content (API Data)**
```typescript
import { useLocale } from 'next-intl';

const locale = useLocale();  // 'en' or 'ur'
const response = await fetch(`/api/signals?locale=${locale}&status=ACTIVE`);
// API returns localized content automatically
```

### Testing Translations

1. Navigate to `http://localhost:5001/en` - See English
2. Navigate to `http://localhost:5001/ur` - See Urdu (RTL)
3. Language switcher automatically changes URL and content

---

## 1. Core Architecture

### Technology Stack
```
Frontend: Next.js 15 + React 19 + TypeScript
i18n Library: next-intl
Database: Supabase (existing)
Cache: Next.js Cache API (1 hour TTL)
Static Storage: JSON files in /public/locales/
API: Next.js API Routes
Auth: Existing auth system
```

### Hybrid Model

**Two Content Types:**

1. **Static UI (JSON-based)**
   - Buttons, labels, navigation, footer
   - ~120 strings total
   - Translate once, use forever
   - No approval needed after initial setup

2. **Dynamic Content (Database-based)**
   - Signal titles, descriptions
   - News articles, market analysis
   - User-generated content
   - Requires approval workflow

### Data Flow

#### Static UI Flow
```
User Request
    ↓
Next.js loads JSON file
    ↓
/public/locales/ur/common.json (cached by Next.js)
    ↓
Render with translations

Time: ~10-50ms (instant)
```

#### Dynamic Content Flow
```
User Request
    ↓
Language Detection/Selection
    ↓
Check Cache (1 hour TTL)
    ↓
Cache Hit? → Return Cached Translations
    ↓
Cache Miss? → API Call → Database Query (approved only)
    ↓
Store in Cache
    ↓
Return to Frontend
    ↓
Render with Translations

Time: ~200-500ms first load, ~50ms cached
```

---

## 2. Database Schema

### Dual-Layer Architecture

#### Layer 1: Direct Columns (Performance) - **✅ IMPLEMENTED**

**`signals` Table** - Direct Urdu columns for fast lookups
```sql
CREATE TABLE signals (
  id SERIAL PRIMARY KEY,
  -- English fields (required)
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,

  -- Urdu fields (optional, nullable)
  title_ur VARCHAR(255),           -- Urdu title
  content_ur TEXT,                  -- Urdu content
  author_ur VARCHAR(100),           -- Urdu author name

  -- Other fields...
  pair VARCHAR(20) NOT NULL,
  action VARCHAR(4) NOT NULL,      -- BUY or SELL
  entry DECIMAL(10,5) NOT NULL,
  stop_loss DECIMAL(10,5) NOT NULL,
  take_profit DECIMAL(10,5) NOT NULL,
  confidence INTEGER NOT NULL,
  market VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  priority VARCHAR(10) DEFAULT 'MEDIUM',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**`drills` Table** - Direct Urdu columns
```sql
CREATE TABLE drills (
  id SERIAL PRIMARY KEY,
  signal_id INTEGER REFERENCES signals(id) ON DELETE CASCADE,

  -- English fields (required)
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,

  -- Urdu fields (optional, nullable)
  title_ur VARCHAR(255),           -- Urdu title
  description_ur TEXT,              -- Urdu description
  content_ur TEXT,                  -- Urdu content

  -- Other fields...
  type VARCHAR(20) NOT NULL,
  order_index INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Benefits:**
- ✅ Single query returns both languages
- ✅ No joins required
- ✅ Simple API logic
- ✅ Fast reads (~50-100ms)
- ✅ Nullable Urdu columns (graceful fallback)

#### Layer 2: TranslationDynamic Table (Workflow) - **🔄 AVAILABLE**

For content management workflow and approval process:

```sql
CREATE TABLE translations_dynamic (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL,   -- 'signal_title', 'signal_description', 'news', 'analysis'
  content_id VARCHAR(100),             -- Reference to original content (e.g., signal ID)
  key VARCHAR(255) NOT NULL UNIQUE,    -- Unique identifier: "signal_123_title"
  en_value TEXT NOT NULL,              -- English (always exists)
  ur_value TEXT,                       -- Urdu translation
  ur_status VARCHAR(20) DEFAULT 'pending',  -- pending|approved|rejected
  ur_updated_by VARCHAR(100) REFERENCES users(id),  -- Content manager
  ur_approved_by VARCHAR(100) REFERENCES users(id), -- Admin
  ur_updated_at TIMESTAMP,
  ur_approved_at TIMESTAMP,
  namespace VARCHAR(50),               -- signals|news|analysis
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_translations_key ON translations_dynamic(key);
CREATE INDEX idx_translations_status ON translations_dynamic(ur_status);
CREATE INDEX idx_translations_content_type ON translations_dynamic(content_type);
CREATE INDEX idx_translations_approved ON translations_dynamic(ur_status, ur_value)
WHERE ur_status = 'approved';
```

**When to use each:**
- **Direct columns**: Production reads (99% of traffic) - Fast, simple
- **TranslationDynamic**: Content manager workflow, approval process, audit trail

### `users` Table (Extend Existing)
```sql
-- Add role column if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Roles: 'admin' | 'content_manager' | 'user'
```

### `translation_history` Table (Audit Log)
```sql
CREATE TABLE translation_history (
  id SERIAL PRIMARY KEY,
  translation_id INTEGER REFERENCES translations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(20),                  -- created|updated|approved|rejected
  old_value TEXT,
  new_value TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_history_translation ON translation_history(translation_id);
CREATE INDEX idx_history_user ON translation_history(user_id);
```

---

## 3. JSON File Structure (Static UI)

### Directory Layout
```
/public/locales/
├── en/
│   ├── common.json          # Buttons, labels, common UI
│   ├── navigation.json      # Menu, header, footer
│   ├── hero.json           # Hero section
│   ├── signals.json        # Signal UI labels
│   ├── risk.json           # Risk disclaimer
│   └── footer.json         # Footer content
└── ur/
    ├── common.json
    ├── navigation.json
    ├── hero.json
    ├── signals.json
    ├── risk.json
    └── footer.json
```

### Example: `/public/locales/en/common.json`
```json
{
  "actions": {
    "buy": "Buy",
    "sell": "Sell",
    "buyNow": "Buy Now",
    "sellNow": "Sell Now",
    "viewAll": "View All",
    "viewDetails": "View Details",
    "refresh": "Refresh"
  },
  "labels": {
    "entry": "Entry",
    "stopLoss": "Stop Loss",
    "takeProfit": "Take Profit",
    "confidence": "Confidence",
    "status": "Status",
    "market": "Market",
    "priority": "Priority"
  },
  "status": {
    "active": "Active",
    "closed": "Closed",
    "cancelled": "Cancelled",
    "pending": "Pending"
  },
  "markets": {
    "forex": "Forex",
    "crypto": "Crypto",
    "psx": "PSX",
    "commodities": "Commodities"
  }
}
```

### Example: `/public/locales/ur/common.json`
```json
{
  "actions": {
    "buy": "خریدیں",
    "sell": "بیچیں",
    "buyNow": "ابھی خریدیں",
    "sellNow": "ابھی بیچیں",
    "viewAll": "تمام دیکھیں",
    "viewDetails": "تفصیلات دیکھیں",
    "refresh": "تازہ کریں"
  },
  "labels": {
    "entry": "داخلہ",
    "stopLoss": "نقصان روکیں",
    "takeProfit": "منافع لیں",
    "confidence": "اعتماد",
    "status": "حیثیت",
    "market": "مارکیٹ",
    "priority": "ترجیح"
  },
  "status": {
    "active": "فعال",
    "closed": "بند",
    "cancelled": "منسوخ",
    "pending": "زیر التواء"
  },
  "markets": {
    "forex": "فاریکس",
    "crypto": "کرپٹو",
    "psx": "پی ایس ایکس",
    "commodities": "اجناس"
  }
}
```

---

## 4. API Architecture - **✅ IMPLEMENTED**

### Public APIs (Frontend)

#### Static UI Translations (via next-intl)
```typescript
// Automatic via next-intl
// No API needed - JSON files loaded by Next.js during build
// Files: /public/locales/{en|ur}/*.json
```

#### Dynamic Content API - **✅ ACTIVE**

**Signals API with Locale Support**
```typescript
GET /api/signals?locale={en|ur}&status=ACTIVE&limit=10

// Implementation (src/app/api/signals/route.ts):
export async function GET(request: NextRequest) {
  const locale = searchParams.get('locale') || 'en';

  // Query database
  const { data } = await supabase
    .from('signals')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  // Transform based on locale
  const localizedSignals = data?.map(signal => {
    if (locale === 'ur') {
      return {
        ...signal,
        title: signal.title_ur || signal.title,        // Urdu or fallback
        content: signal.content_ur || signal.content,  // Urdu or fallback
        author: signal.author_ur || signal.author,     // Urdu or fallback
      };
    }
    return signal;  // Return English as-is
  });

  return NextResponse.json({ signals: localizedSignals });
}

// Response (locale=ur):
{
  "signals": [
    {
      "id": 1,
      "title": "ٹیسٹ سگنل منتظم سے",  // Urdu if available
      "content": "ڈیٹا بیس کنکشن کی جانچ",
      "author": "احمد علی",
      "pair": "USD/CAD",
      "action": "SELL",
      "entry": 1.3500,
      "stop_loss": 1.3550,
      "take_profit": 1.3400,
      "confidence": 90,
      // ... other fields unchanged
    }
  ]
}

// Response (locale=en or no translation):
{
  "signals": [
    {
      "id": 1,
      "title": "Test Signal from Admin",  // English fallback
      "content": "Testing database connection",
      // ...
    }
  ]
}
```

**Benefits of this approach:**
- ✅ Single API endpoint for all languages
- ✅ Client-controlled via `locale` parameter
- ✅ Graceful fallback to English
- ✅ No client-side translation logic needed
- ✅ Simple integration with `useLocale()` hook

### Admin APIs (Protected)

#### Translation Management
```typescript
GET /api/admin/translations
  - List all dynamic translations with status
  - Filters: ?status=pending&type=signals&page=1&limit=50
  - Response: {
      translations: [...],
      total: 120,
      page: 1,
      pending_count: 5
    }

GET /api/admin/translations/pending
  - Get pending translations for approval
  - Response: { pending: [...], count: 5 }

POST /api/admin/translations
  - Create new translation entry
  - Body: {
      content_type: 'signal_title',
      content_id: '123',
      key: 'signal_123_title',
      en_value: 'EUR/USD BUY Signal',
      namespace: 'signals'
    }
  - Auto-creates when new signal created

PUT /api/admin/translations/[id]
  - Update Urdu translation (content manager)
  - Body: { ur_value: 'EUR/USD خرید سگنل' }
  - Sets ur_status to "pending"
  - Returns: { success: true, translation: {...} }

PUT /api/admin/translations/[id]/approve
  - Approve translation (admin only)
  - Sets ur_status to "approved"
  - Clears cache
  - Logs to history
  - Returns: { success: true }

PUT /api/admin/translations/[id]/reject
  - Reject translation (admin only)
  - Body: { reason: 'Optional reason' }
  - Sets ur_status to "rejected"
  - Returns: { success: true }

DELETE /api/admin/translations/[id]
  - Delete translation (admin only)
  - Cascade deletes history
```

#### JSON File Management (Static UI)
```typescript
GET /api/admin/static-translations
  - Get all static UI translations (JSON content)
  - Response: {
      locales: ['en', 'ur'],
      files: {
        'en/common': {...},
        'ur/common': {...}
      }
    }

PUT /api/admin/static-translations
  - Update JSON file content
  - Body: {
      locale: 'ur',
      file: 'common',
      content: {...}
    }
  - Writes to /public/locales/ur/common.json
  - Triggers rebuild (optional)
```

#### User Management
```typescript
POST /api/admin/users
  - Create content manager account
  - Body: {
      email: 'manager@example.com',
      password: 'temp123',
      name: 'Ahmad',
      role: 'content_manager'
    }

GET /api/admin/users
  - List content managers
  - Filter: ?role=content_manager

PUT /api/admin/users/[id]
  - Update user (enable/disable)
  - Body: { active: true }
```

---

## 5. Frontend Integration

### next-intl Setup - **✅ IMPLEMENTED**

#### Installation
```bash
npm install next-intl  # ✅ Installed
```

#### Configuration: `src/i18n/request.ts` - **Next.js 15 Compatible**
```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // Next.js 15: requestLocale is now a Promise
  let locale = await requestLocale;

  // Fallback to 'en' if no locale
  if (!locale) {
    locale = 'en';
  }

  // Load all translation files
  const [common, hero, signals] = await Promise.all([
    import(`@/../public/locales/${locale}/common.json`),
    import(`@/../public/locales/${locale}/hero.json`),
    import(`@/../public/locales/${locale}/signals.json`),
  ]);

  return {
    locale,  // IMPORTANT: Return locale explicitly
    messages: {
      ...common.default,
      hero: hero.default,
      signals: signals.default,
    },
  };
});
```

**Key Changes for Next.js 15:**
- ❌ Old: `async ({ locale })`
- ✅ New: `async ({ requestLocale })` - Must await the Promise
- ✅ Must return `locale` in the config object

#### App Layout: `app/[locale]/layout.tsx` - **✅ ACTIVE**
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

const locales = ['en', 'ur'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;  // Next.js 15: params is a Promise
}>) {
  // Await params as required by Next.js 15
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Load messages for the specific locale
  const messages = await getMessages();  // No need to pass locale

  // Determine text direction
  const dir = locale === 'ur' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${interTight.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Your app content */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

#### Middleware: `middleware.ts` - **✅ Integrated with Auth**
```typescript
import createIntlMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const locales = ['en', 'ur'];
const defaultLocale = 'en';

// Create i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'  // Always show /en or /ur in URL
});

// Combine with auth middleware
const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.includes("/auth");
    const isDrillPage = req.nextUrl.pathname.includes("/drill");

    // Auth logic...
    if (isAuthPage && isAuth) {
      const locale = req.nextUrl.pathname.split('/')[1];
      return NextResponse.redirect(new URL(`/${locale}/drill`, req.url));
    }

    if (isDrillPage && !isAuth) {
      const locale = req.nextUrl.pathname.split('/')[1];
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin`, req.url)
      );
    }

    return intlMiddleware(req as NextRequest);
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

// Main middleware dispatcher
export default function middleware(req: NextRequest) {
  const isAuthProtectedPath = req.nextUrl.pathname.match(/\/(en|ur)\/(drill|auth)/);

  if (isAuthProtectedPath) {
    return (authMiddleware as any)(req);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(en|ur)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

**Benefits:**
- ✅ Locale routing handled automatically
- ✅ Auth protection works with locale prefixes
- ✅ Clean URLs: `/en/signals`, `/ur/signals`

### Usage in Components

#### Static UI (from JSON)
```typescript
import { useTranslations } from 'next-intl';

export function SignalCard() {
  const t = useTranslations('common');

  return (
    <div>
      <button>{t('actions.buy')}</button>
      <label>{t('labels.entry')}</label>
      <span>{t('status.active')}</span>
    </div>
  );
}
```

#### Dynamic Content (from Database) - **✅ IMPLEMENTED**

**Example: SignalsFeed Component** (`src/components/tradesignal/SignalsFeed.tsx`)
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { SignalData } from '@/utils/supabase';

const SignalsFeed = () => {
  const t = useTranslations('signals.sidebar');
  const locale = useLocale();  // Get current locale ('en' or 'ur')
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch signals from API with locale parameter
  useEffect(() => {
    const fetchSignals = async () => {
      try {
        // Pass locale to API
        const response = await fetch(`/api/signals?limit=5&status=ACTIVE&locale=${locale}`);
        const data = await response.json();
        setSignals(data.signals || []);  // Already localized by API
      } catch (error) {
        console.error('Error fetching signals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSignals, 30000);
    return () => clearInterval(interval);
  }, [locale]);  // Re-fetch when locale changes

  return (
    <div>
      <h3>{t('title')}</h3>  {/* Static UI from JSON */}

      {signals.map(signal => (
        <div key={signal.id}>
          <h4>{signal.title}</h4>  {/* Dynamic: Urdu if available, else English */}
          <p>{signal.content}</p>  {/* Dynamic: Localized by API */}
          <span>{t('labels.entry')}: {signal.entry}</span>  {/* Static UI */}
          <span>{t('labels.sl')}: {signal.stop_loss}</span>
        </div>
      ))}
    </div>
  );
}

export default SignalsFeed;
```

**Example: ChangelogContent Component**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { SignalData } from '@/utils/supabase';

const ChangelogContent = () => {
  const [signalsData, setSignalsData] = useState<SignalUpdate[]>([]);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        // Extract locale from URL path
        const locale = window.location.pathname.split('/')[1] || 'en';

        // Fetch with locale parameter
        const response = await fetch(`/api/signals?limit=10&status=ACTIVE&locale=${locale}`);
        const data = await response.json();

        setSignalsData(data.signals);  // API returns localized content
      } catch (error) {
        console.error('Error fetching signals:', error);
      }
    };

    fetchSignals();
    const interval = setInterval(fetchSignals, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {signalsData.map(signal => (
        <div key={signal.id}>
          <h3>{signal.title}</h3>  {/* Automatically localized */}
          <p>{signal.content}</p>
        </div>
      ))}
    </div>
  );
}
```

**Key Points:**
- ✅ Use `useLocale()` hook to get current locale
- ✅ Pass `locale` parameter to API calls
- ✅ API returns pre-localized content (no client-side translation)
- ✅ Re-fetch when locale changes
- ✅ Combine with static UI translations from `useTranslations()`

#### Language Switcher
```typescript
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div>
      <button
        onClick={() => switchLanguage('en')}
        className={locale === 'en' ? 'active' : ''}>
        English
      </button>
      <button
        onClick={() => switchLanguage('ur')}
        className={locale === 'ur' ? 'active' : ''}>
        اردو
      </button>
    </div>
  );
}
```

---

## 6. RTL (Right-to-Left) Support

### Automatic RTL via HTML dir Attribute
```html
<!-- English -->
<html lang="en" dir="ltr">

<!-- Urdu -->
<html lang="ur" dir="rtl">
```

### Tailwind CSS RTL Configuration

#### Install Plugin
```bash
npm install tailwindcss-rtl
```

#### Configure: `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('tailwindcss-rtl')
  ]
};

export default config;
```

### CSS Logical Properties
```css
/* Use logical properties for RTL support */
.element {
  margin-inline-start: 1rem;  /* Left in LTR, Right in RTL */
  margin-inline-end: 1rem;    /* Right in LTR, Left in RTL */
  padding-inline-start: 2rem;
  text-align: start;          /* Left in LTR, Right in RTL */
}

/* Conditional RTL classes */
<div className="ltr:ml-4 rtl:mr-4">
```

### Components Needing RTL Attention
```
✓ Hero section (gradient positions)
✓ Navigation (menu alignment)
✓ Signal cards (layout flip)
✓ Timeline (left/right indicators)
✓ Sidebar (sticky positioning)
✓ Footer (column alignment)
✓ Buttons (icon positions)
```

---

## 7. Admin Panel Architecture

### Pages Structure

#### Static UI Editor
```
/admin/translations/static
  - Select locale: [English] [Urdu]
  - Select file: [common] [navigation] [hero] [signals]
  - Inline table editor
  - Save & Preview
  - Deploy button (triggers rebuild)
```

#### Dynamic Content Manager
```
/admin/translations/dynamic
  - List all dynamic translations
  - Filters:
    * Status: [All] [Pending] [Approved] [Rejected]
    * Type: [Signals] [News] [Analysis]
    * Search by key or content
  - Pagination
  - Bulk actions (approve multiple)
```

#### Pending Approvals Queue
```
/admin/translations/pending
  - Priority queue (newest first)
  - Side-by-side EN/UR comparison
  - Metadata: Translator, timestamp, content type
  - Quick actions: Approve / Reject
  - Bulk approve (checkbox selection)
```

#### Translation Editor
```
/admin/translations/edit/[id]
  - Content type badge
  - English preview (readonly)
  - Urdu textarea (editable by content manager)
  - Character count
  - Preview in context (optional)
  - Submit / Save Draft
  - Status indicator
```

#### User Management
```
/admin/users
  - List content managers
  - Activity metrics (translations/day)
  - Add new content manager
  - Enable/disable accounts
```

### Component Hierarchy

```
AdminLayout
  ├── AdminSidebar
  │   ├── Dashboard link
  │   ├── Static UI link
  │   ├── Dynamic Content link
  │   ├── Pending Approvals (with badge)
  │   └── Users link
  ├── Header
  │   ├── PendingBadge (count)
  │   └── UserMenu
  └── Content Area

StaticUIEditor
  ├── LocaleSelector
  ├── FileSelector
  ├── TranslationTable
  │   ├── KeyColumn (readonly)
  │   ├── EnglishColumn (readonly)
  │   └── UrduColumn (editable)
  └── ActionBar
      ├── SaveButton
      ├── PreviewButton
      └── DeployButton

DynamicTranslationList
  ├── SearchBar
  ├── FilterControls
  │   ├── StatusFilter
  │   ├── TypeFilter
  │   └── DateRange
  ├── TranslationTable
  │   ├── TableRow
  │   │   ├── ContentTypeBadge
  │   │   ├── EnglishPreview
  │   │   ├── UrduPreview
  │   │   ├── StatusBadge
  │   │   └── Actions (Edit/View)
  │   └── BulkSelectCheckbox
  └── Pagination

ApprovalQueue
  ├── QueueStats (total pending, avg wait time)
  ├── PendingItem
  │   ├── SideBySide
  │   │   ├── EnglishSection
  │   │   └── UrduSection
  │   ├── MetaInfo
  │   │   ├── Translator name
  │   │   ├── Timestamp
  │   │   └── Content type
  │   └── ActionButtons
  │       ├── ApproveButton
  │       └── RejectButton
  └── BulkActions
      └── ApproveSelectedButton
```

---

## 8. Permission System

### Middleware Protection
```typescript
// middleware.ts (updated)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUser } from '@/utils/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    const user = await getUser(request);

    // Require logged in + role
    if (!user || !['admin', 'content_manager'].includes(user.role)) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Admin-only routes
    const adminOnlyRoutes = [
      '/admin/translations/pending',
      '/admin/translations/approve',
      '/admin/users'
    ];

    if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
```

### API Route Guards
```typescript
// utils/auth.ts
export async function requireRole(req: Request, allowedRoles: string[]) {
  const user = await getCurrentUser(req);

  if (!user) {
    throw new Error('Unauthorized: Not logged in');
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Forbidden: Requires one of ${allowedRoles.join(', ')}`);
  }

  return user;
}

// Usage in API route
// api/admin/translations/[id]/approve/route.ts
export async function PUT(req: Request) {
  const user = await requireRole(req, ['admin']);

  // ... approval logic
}

// api/admin/translations/[id]/route.ts
export async function PUT(req: Request) {
  const user = await requireRole(req, ['admin', 'content_manager']);

  // ... update logic
}
```

---

## 9. Translation Workflows

### Static UI Workflow (One-time Setup)

#### Initial Translation
```
1. Developer extracts all UI strings → Creates JSON structure
2. Content manager logs in → Admin panel
3. Selects "Static UI" section
4. Edits Urdu values in table view
5. Clicks "Save"
6. Admin reviews changes
7. Admin clicks "Deploy" → Triggers rebuild
8. Changes go live (2-3 min)
9. Done forever ✅
```

### Dynamic Content Workflow (Ongoing)

#### Signal Creation & Translation
```
Backend (Auto):
1. Analyst creates signal (English only)
2. System auto-creates translation entry:
   - content_type: 'signal_title'
   - en_value: "EUR/USD Strong BUY Signal"
   - ur_value: NULL
   - ur_status: 'pending'

Content Manager:
3. Logs in → Sees new untranslated signal
4. Opens editor → Translates to Urdu
5. Submits for approval
   → ur_value: "EUR/USD مضبوط خرید سگنل"
   → ur_status: 'pending'

Admin (You):
6. Gets notification → Pending count badge
7. Reviews side-by-side
8. Clicks "Approve"
   → ur_status: 'approved'
   → Cache cleared
9. Translation goes live

Frontend:
10. User selects Urdu
11. Signal shows Urdu title (if approved)
12. If not approved → Shows English with note
```

#### News/Analysis Translation (Optional)
```
Same workflow as signals:
- Create content → Auto-generate translation entry
- Content manager translates
- Admin approves
- Goes live

Timeline: Hours to days (acceptable)
```

---

## 10. Caching Strategy

### Static UI (JSON)
```typescript
// No custom cache needed
// Next.js automatically caches static files
// Changes only after rebuild

Performance: ~10-50ms (instant)
```

### Dynamic Content (Database)
```typescript
// Next.js Cache API or Redis
import { cache } from 'react';

export const getApprovedTranslations = cache(async (locale: string, type?: string) => {
  const cacheKey = `translations:${locale}:${type || 'all'}`;

  // Try cache first
  const cached = await cacheStore.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Query database
  const query = supabase
    .from('translations')
    .select('key, ur_value')
    .eq('ur_status', 'approved')
    .not('ur_value', 'is', null);

  if (type) query.eq('content_type', type);

  const { data } = await query;

  // Transform to key-value object
  const translations = data.reduce((acc, row) => {
    acc[row.key] = row.ur_value;
    return acc;
  }, {});

  // Cache for 1 hour
  await cacheStore.set(cacheKey, JSON.stringify(translations), 3600);

  return translations;
});

// Clear cache on approval
export async function clearTranslationCache(locale: string) {
  await cacheStore.del(`translations:${locale}:*`);
}
```

---

## 11. Error Handling & Fallbacks

### Missing Translation Strategy
```typescript
export function getTranslation(
  key: string,
  locale: string,
  translations: Record<string, string>
): string {
  // 1. Try Urdu translation
  if (locale === 'ur' && translations[key]) {
    return translations[key];
  }

  // 2. Fallback to English
  const enTranslations = getEnglishTranslations();
  if (enTranslations[key]) {
    return enTranslations[key];
  }

  // 3. Return key as last resort
  console.error(`Missing translation: ${key} for locale ${locale}`);
  return key;
}
```

### Frontend Display
```typescript
export function ContentWithFallback({ contentKey, locale }) {
  const translation = useTranslation(contentKey, locale);
  const isEnglishFallback = locale === 'ur' && !translation.isUrdu;

  return (
    <div>
      <p>{translation.value}</p>
      {isEnglishFallback && (
        <span className="text-xs text-gray-500">
          English version only
        </span>
      )}
    </div>
  );
}
```

---

## 12. Performance Optimization

### Query Optimization
```sql
-- Index for approved translations only
CREATE INDEX idx_approved_translations
ON translations(ur_status, ur_value)
WHERE ur_status = 'approved' AND ur_value IS NOT NULL;

-- Fetch approved translations efficiently
SELECT key, ur_value
FROM translations
WHERE ur_status = 'approved'
  AND ur_value IS NOT NULL
  AND content_type = 'signal_title'
ORDER BY created_at DESC;
```

### Bundle Size
```typescript
// Split JSON files by namespace
// Load only needed translations per page
import common from '@/public/locales/ur/common.json';
import signals from '@/public/locales/ur/signals.json';
// Don't load all at once
```

### Lazy Loading
```typescript
// Admin panel: Load translations on demand
const { data, isLoading } = useSWR(
  `/api/admin/translations?page=${page}&limit=50`,
  fetcher,
  {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  }
);
```

---

## 13. Deployment & Migration

### Environment Variables
```bash
# .env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,ur

# Optional: Redis for caching
REDIS_URL=redis://...

# Admin credentials
ADMIN_EMAIL=admin@tradesignal.pk
```

### Initial Migration

#### Database Setup
```bash
# Run migration to create tables
npm run db:migrate

# Seed with initial data (if needed)
npm run db:seed
```

#### Extract Static UI Strings
```bash
# Custom script to extract strings from code
npm run i18n:extract

# Output: /public/locales/en/*.json
```

#### Content Manager Setup
```bash
# Create first content manager account via admin panel
# Or via script:
npm run create:content-manager -- --email ahmad@example.com --name Ahmad
```

### Build Process
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

### Deployment Checklist
```
Initial Setup:
□ Database tables created
□ JSON structure setup
□ Admin account created
□ Content manager account created
□ Static UI strings extracted
□ Initial Urdu translation (static UI)
□ Deploy & test

Ongoing:
□ Content created (English)
□ Translation entries auto-generated
□ Content manager translates
□ Admin approves
□ Cache cleared
□ Live immediately
```

---

## 14. Monitoring & Analytics

### Metrics to Track
```typescript
// Admin dashboard queries
const metrics = {
  // Translation coverage
  staticCoverage: 'SELECT COUNT(*) FROM locales WHERE locale = "ur"',

  // Dynamic content stats
  pendingCount: 'SELECT COUNT(*) FROM translations WHERE ur_status = "pending"',
  approvedCount: 'SELECT COUNT(*) FROM translations WHERE ur_status = "approved"',
  rejectedCount: 'SELECT COUNT(*) FROM translations WHERE ur_status = "rejected"',

  // Content manager activity
  translationsThisWeek: `
    SELECT COUNT(*) FROM translations
    WHERE ur_updated_at > NOW() - INTERVAL '7 days'
  `,

  // Average approval time
  avgApprovalTime: `
    SELECT AVG(ur_approved_at - ur_updated_at)
    FROM translations
    WHERE ur_status = 'approved'
  `,

  // Cache hit rate (if using Redis)
  cacheHitRate: 'Redis STATS'
};
```

### Dashboard Display
```
Translation Dashboard
├── Static UI: 120/120 translated ✅
├── Dynamic Content:
│   ├── Pending: 5
│   ├── Approved: 248
│   └── Rejected: 12
├── Activity:
│   ├── This week: 32 translations
│   └── Avg approval time: 2.3 hours
└── Cache:
    └── Hit rate: 94.2%
```

---

## 15. Security Considerations

### Input Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeTranslation(value: string): string {
  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [], // No HTML
    ALLOWED_ATTR: []
  });
}

// Apply before saving
const sanitized = sanitizeTranslation(userInput);
```

### SQL Injection Prevention
```typescript
// Use parameterized queries (Supabase handles this)
const { data } = await supabase
  .from('translations')
  .select('*')
  .eq('key', userProvidedKey); // Safe
```

### Rate Limiting
```typescript
// Limit translation submissions
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h') // 10 per hour
});

export async function POST(req: Request) {
  const identifier = getUserId(req);
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }

  // ... handle request
}
```

### Audit Trail
```typescript
// Log all approval/rejection actions
async function logAction(
  translationId: number,
  userId: string,
  action: 'approve' | 'reject',
  metadata?: any
) {
  await supabase.from('translation_history').insert({
    translation_id: translationId,
    user_id: userId,
    action,
    timestamp: new Date(),
    metadata: JSON.stringify(metadata)
  });
}
```

---

## 16. Testing Strategy

### Unit Tests
```typescript
// Translation retrieval
describe('getApprovedTranslations', () => {
  it('returns approved Urdu translations', async () => {
    const translations = await getApprovedTranslations('ur');
    expect(translations).toHaveProperty('signal_123_title');
  });

  it('falls back to English if Urdu missing', () => {
    const result = getTranslation('missing.key', 'ur', {});
    expect(result).toBe(enTranslations['missing.key']);
  });
});
```

### Integration Tests
```typescript
// Approval workflow
describe('Translation Approval', () => {
  it('content manager submits, admin approves', async () => {
    // 1. Content manager updates
    const updated = await updateTranslation(
      translationId,
      { ur_value: 'نیا ترجمہ' },
      contentManagerId
    );
    expect(updated.ur_status).toBe('pending');

    // 2. Admin approves
    const approved = await approveTranslation(translationId, adminId);
    expect(approved.ur_status).toBe('approved');

    // 3. Verify live
    const live = await getApprovedTranslations('ur');
    expect(live[translationKey]).toBe('نیا ترجمہ');
  });
});
```

### E2E Tests (Playwright)
```typescript
test('Language switcher changes content', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('button')).toContainText('Buy');

  await page.click('[data-language-switcher]');
  await page.click('[data-lang="ur"]');

  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('button')).toContainText('خریدیں');
});
```

---

## 17. Future Enhancements

### Phase 2 (Optional)
- **AI-assisted translation** (OpenAI/Google Translate suggestions)
- **In-context editing** (edit on actual page preview)
- **Translation memory** (reuse similar translations)
- **Bulk import/export** (CSV/Excel support)
- **Version history** (rollback capability)
- **Glossary management** (consistent terminology)

### Phase 3 (Scaling)
- **CDN for JSON files** (edge caching)
- **Database read replicas** (geographic distribution)
- **Multi-language support** (add Arabic, French, etc.)
- **Automated quality checks** (length validation, format checking)

---

## Summary

### Current Implementation Status - **✅ PRODUCTION READY**

**What's Implemented:**
- ✅ **Database Schema**: Direct Urdu columns in `signals` and `drills` tables
- ✅ **Prisma Migration**: Applied successfully (20251003120202_add_urdu_translations)
- ✅ **API**: Locale-aware `/api/signals?locale=ur` endpoint
- ✅ **Components**: SignalsFeed & ChangelogContent integrated with `useLocale()`
- ✅ **Middleware**: Integrated next-intl with next-auth for locale routing
- ✅ **i18n Config**: Next.js 15 compatible with `requestLocale`
- ✅ **RTL Support**: Automatic via `dir` attribute in HTML

**Architecture:**
- **Static UI** → JSON files (~120 strings) ✅ Working
- **Dynamic Content** → Database direct columns ✅ Working
  - `title_ur`, `content_ur`, `author_ur` in signals table
  - API returns localized content based on `locale` parameter
  - Graceful fallback to English if Urdu not available
- **TranslationDynamic** → Available for workflow (not currently in use)

**Team Setup (When Needed):**
- 1-3 content managers (translate via direct DB updates or admin panel)
- 1 admin (approve translations)

**Workflow (Current):**
1. Signal created in English
2. Add Urdu translations directly to `title_ur`, `content_ur`, `author_ur` columns
3. API automatically returns Urdu when `locale=ur`
4. Components display translated content

**Performance:**
- Static UI: ~10-50ms (instant, JSON cached)
- Dynamic Content: ~50-150ms (single query, direct columns)
- No joins, no complex queries, no caching layer needed yet

**Tech Stack:**
- next-intl (v4.3.9) + Next.js 15 + React 19
- Supabase PostgreSQL
- TypeScript 5
- Prisma ORM
- RTL support via tailwindcss-rtl

**Next Steps (Optional):**
- Build admin panel for managing Urdu translations
- Implement TranslationDynamic workflow for approval process
- Add AI-assisted translation suggestions
- Set up content manager accounts
