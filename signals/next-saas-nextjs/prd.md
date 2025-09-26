# TradeSignal PK — Master Requirements Document

## (PRD + Technical Spec)

**Version:** v1.2 • **Date:** 22 Sep 2025
**Owner:** Michael (Product + Engineering) • **Primary Market:** Pakistan (Urdu + English)

## 0) Executive Summary

TradeSignal PK is a responsive web app delivering buy/sell signals with entry, SL, TP. It starts semi-automated (AI/indicators propose → admin reviews/publishes) and grows into full automation. Core value: beginner-friendly UX, transparent history, fast notifications, Urdu support, and freemium access.

## 1) Product Requirements (PRD)

### 1.1 Objectives & Success

• **Trust:** Transparent, immutable history.
• **Acquisition:** Urdu UI, mobile-first, freemium.
• **Engagement:** Fast web push alerts, simple explanations, chat.
• **Monetization:** Freemium → Premium.
• **Compliance:** Risk disclaimers, consent tracking.

### 1.2 Target Users

• **Beginner (Free):** clear 'what to do now'.
• **Beginner+ (Premium):** full feed, speed, history, chat.
• **Admin/Analyst:** curates/edits AI drafts, publishes signals, moderates chat.

### 1.3 Scope (Phase 1 / MVP)

• **Included:** Signals feed, history, freemium model, push, chat, admin panel, Urdu/English, SEO.
• **Excluded:** SMS/email alerts, demo trading.
• **Phase 2:** Broker integrations, advanced metrics, paper trading.
• **PWA instead of native apps:** Add to homescreen, offline capability, push notifications.

### 1.4 Core Features & Acceptance

• Signals Feed with open/closed/cancelled labels.
• History gated to registered users.
• Push notifications for new signals.
• Freemium daily limits; premium unlimited.
• Chat rooms with moderation.
• Admin panel with AI draft edit/publish.
• Disclaimers on every signal.

### 1.5 UX & Branding

• Mobile-first, minimal jargon, tooltips.
• Colors: Blue/Gold palette; red for losses.
• Light/Dark mode toggle.

### 1.7 Roadmap

• **M1–2:** Auth, schema, feed, PWA foundation.
• **M3:** Admin, history, push notifications, offline mode.
• **M4:** Freemium, basic payments (Stripe), i18n, SEO pages, install prompts.
• **M5:** Signal comments, local PK payments, telemetry, background sync.
• **M6:** Beta launch, chat rooms, broker affiliate.
• **M7+:** Advanced stats, paper trading, education modules.

### 1.8 Growth & Engagement Hooks

#### UI Hooks

• Signal of the Day
• Usage Progress Indicator
• Trust Labels
• Quick Filters
• Theme Toggle

#### Info Hooks

• Tooltips/Glossary
• Signal Confidence Score
• Weekly Recap
• Transparency Widget

#### CTAs

• Inline Upgrade Nudges
• Header Ribbon
• Social Proof
• Referral Incentives
• Exit-Intent Modal
• Onboarding CTAs

#### Retention UX

• Favorites
• Push Personalization
• Daily Streak
• Micro-Education Tips

#### Admin & SEO

• Admin Override Alerts
• SEO Blog/Glossary
• Structured Data Markup

### 1.9 Admin Panel Flows

• Dashboard Overview with active signals, graphs, user activity.
• Signals Management: drafts, edits, publish, close.
• User Management: view users, manage plans, ban users.
• Chat Moderation: delete, mute, ban, flagged queue.

### 1.10 Algo/AI Signal Generation

• **Phase 1:** Full automation (RSI, MACD, MA cross) with confidence scores.
• **Admin capabilities:** Override, disable, or boost specific signals.
• **Phase 2:** ML model with backtesting requirements.
• **Explainability:** reasons and confidence shown per signal.
• **Quality gates:** Min 55% win rate over 30-day rolling window.

### 1.11 Payments & Monetization

• **Freemium:** 3 signals/day, 7-day history.
• **Premium:** unlimited signals, full history.
• **Payment via** JazzCash, Easypaisa, bank, Stripe/PayPal.
• **Entitlements table** tracks expiry, grace period of 3 days.

### 1.12 Chat & Community

• **Phase 1:** Signal-specific comments (like mini-forum per signal).
• **Phase 2:** General chat room with proven moderation.
• **Phase 3:** Asset-specific & premium-only rooms.
• **Moderation:** profanity filter, spam detection, rate limits, strikes.
• **Reduced spam surface area** with gradual expansion.

### 1.13 Referral & Sharing

• **Referral program:** invite 3 → 1 week Premium.
• **Referral codes tracked;** fraud prevention.
• **Share signals** to WhatsApp with CTA links.

### 1.14 Monitoring & SLAs

• **Metrics:** API latency, push delay, DB performance.
• **Alerts:** push delay >10s, API errors >2%, DB CPU >80%.
• **SLA:** push latency <30s (accounting for PK infrastructure), uptime ≥99.5%, recovery <30min.
• **Future optimization target:** <10s push latency once stable.

## 2) Technical Specification

### 2.1 Progressive Web App (PWA)

• **Next.js with next-pwa plugin** for automatic service worker generation.
• **App manifest** for installability (name, icons, theme colors).
• **Offline-first:** Cache recent signals, show stale-while-revalidate.
• **Background sync** for chat messages and signal updates.
• **App-like experience:** fullscreen, splash screen, custom status bar.
• **Storage:** IndexedDB for offline signal history (last 20 signals).
• **Network detection:** Show connection status, queue actions when offline.
• **Install prompts:** Smart timing after 2 successful visits.
• **Size target:** <500KB initial bundle, <2MB total cached.

### 2.2 PWA Benefits for Pakistan Market

• Works on cheap Android phones (majority market share).
• Saves data costs with aggressive caching.
• No app store friction or approval delays.
• Updates instantly without store review.
• 3x faster than native app development.
• Push notifications work just like native.

### 2.3 Core Architecture

Covers architecture, data model, indexing, TimescaleDB option, APIs, realtime, security, performance, DevEx.

## 3) Analytics & Testing

**Metrics:** registrations, DAU/WAU, retention, signals/day, win rate, push, chat, SEO.
**Testing:** unit, integration, e2e, SEO checks, load tests, acceptance flows.

## 4) Risks & Mitigations

• **Accuracy distrust** → immutable history, show losses.
• **Push delays** → regional workers, alerts.
• **Chat spam** → moderation tools, rate limits.
• **Payment failures** → fallback/manual verification.
• **Referral abuse** → device tracking, fraud detection.
• **Regulatory** → legal review, disclaimers.

## 5) Regulatory Compliance & Legal

• SECP (Securities & Exchange Commission Pakistan) advisory regulations.
• Mandatory disclaimers: "Not financial advice", "Trade at your own risk".
• KYC/AML requirements for payment processing.
• Data localization requirements in Pakistan.
• Liability insurance for signal provision.
• Terms of Service with arbitration clause.
• Risk acknowledgment form before premium upgrade.

## 6) Technical Scalability

• Database sharding strategy for time-series data (consider TimescaleDB).
• CDN deployment for mobile users on 3G/4G connections.
• Regional caching servers in Karachi, Lahore, Islamabad.
• Circuit breakers for high volatility periods.
• Horizontal scaling plan for viral growth scenarios.
• Message queue (Redis/RabbitMQ) for push notifications.
• Load balancer configuration for >10K concurrent users.

## 7) Competitive Moat

• Urdu-first educational content library.
• Partnerships with local brokers (KTrade, Next Capital, Tez Financial).
• Community features: trader profiles, leaderboards, achievements.
• Exclusive "Pakistan 30" - signals for PSX top stocks.
• Integration with local market data providers.
• Referral program with Pakistani influencers.
• WhatsApp Business API for instant alerts.

## 8) Risk Management Framework

• Max daily loss warnings (2% of stated capital).
• Position sizing recommendations.
• Risk/reward ratio display (minimum 1:2).
• Mandatory cooling period after 3 consecutive losses.
• Stop-loss validation and enforcement.
• Market volatility indicators and warnings.
• User risk profile assessment quiz.

## 9) Open Items

• Confirm freemium quota numbers.
• Choose PK payment provider integration partner.
• Decide chat moderation tool (custom vs third-party).
• Select AI indicators (RSI/MACD confirmed).
• Finalize referral scheme.
• Decide pricing (PKR vs USD).
