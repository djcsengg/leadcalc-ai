# LeadCalc AI (Product #1)

> **Embeddable, AI-Powered Interactive Calculator & Lead Magnet Generator**  
> *Developed by Autonomous Technology Solutions (ATS) — Phases 1–4 Complete ([ATS-3](/ATS/issues/ATS-3), [ATS-4](/ATS/issues/ATS-4), [ATS-7](/ATS/issues/ATS-7), [ATS-12](/ATS/issues/ATS-12))*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-darkblue?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-38%2F38%20Passing-brightgreen)](https://vitest.dev/)

---

## 1. Overview

**LeadCalc AI** enables non-technical founders, consultants, agencies, and SMB websites to generate dynamic ROI, pricing, and savings calculators in 30 seconds via natural language. Users can embed them onto any website with a single `<script>` tag or `<iframe>`, and automatically capture qualified B2B leads before or after displaying results.

### Key Highlights
- **30-Second AI Generation & Builder Preview:** Describe your business model or formula in plain English; Google Gemini automatically generates reactive input sliders, numeric fields, safe math formulas, and styled output cards with real-time preview without requiring account creation.
- **Security Hardening & Rate Limiting:** Sliding-window rate limiting on `/api/ai/generate` protects against token exhaustion and scrapers; formulas are rigorously sanitized against prototype pollution and code injection constructs.
- **Client-Side Scalable Math Execution:** 100% of formula calculations run client-side via sandboxed `mathjs`, resulting in $0 backend compute costs for calculations even at millions of embeds.
- **Clean Sandboxed Embeds:** One-line script snippet (`<script src="/embed.js"></script>`) or responsive sandboxed `<iframe>` (`sandbox="allow-scripts allow-forms allow-same-origin allow-popups"`) compatible with Webflow, WordPress, Framer, Squarespace, Shopify, and custom React sites with cross-domain auto-resizing.
- **Dual Deployment Passive Revenue Model:**
  - **Free Tier:** 3 active calculators, 100 captured leads/month, instant AI generation, universal script & iframe embeds.
  - **Pro Monthly ($19/mo):** Unlimited active calculators, unlimited leads, custom brand styling, 1-click CSV exports, badge removal.
  - **Founder Lifetime Deal ($49 / ₹2,499 one-time):** Lifetime access to all Pro features, unlimited calculators, white-labeling, direct roadmap access.
- **Programmatic SEO Directory & AI Discovery:** 12 curated, high-intent calculators across ROI, SaaS economics, loans/finance, and freelance rate estimators (`/calculators` and `/c/[slug]`), paired with automated XML sitemap (`/sitemap.xml`), robots crawler control (`/robots.txt`), and `/llms.txt` for AI search discovery.
- **Automated Lead CRM & CSV Export:** Captures visitor contact details, input parameter snapshots, and calculated outcomes, with 1-click CSV download.

---

## 2. Architecture & Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Unified React frontend + edge/serverless API route handlers |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive modern SaaS aesthetic |
| **ORM & DB** | Prisma + SQLite (PostgreSQL Ready) | Connection-pooled client instance reuse for serverless lambda containers |
| **Formula Engine** | Math.js AST parser + Sanitizer | Client & server sandboxed reactive mathematical evaluation (prevents prototype pollution & arbitrary JS execution) |
| **AI Engine** | Google Gemini (Gemini Flash) | Natural language to structured JSON calculator schemas with smart template fallbacks |
| **Rate Limiter** | In-Memory Sliding Window | Protects AI generation from scraping and token drainage |
| **Payments** | Stripe Checkout & Webhooks | Automated global payments, subscriptions, and lifetime deals ($49 / ₹2,499) |
| **Programmatic SEO & AI** | Dynamic Metadata & Schema.org + `/llms.txt` | `CollectionPage`, `ItemList`, `WebApplication`, `BreadcrumbList`, and `FAQPage` JSON-LD |
| **Testing** | Vitest | Comprehensive unit, security, and API integration test suite (38 tests passing) |

---

## 3. Project Directory Structure

```text
├── Dockerfile                  # Multi-stage production container build
├── docker-compose.yml          # Production container orchestration
├── docs/
│   ├── LAUNCH_PACKAGE.md       # Multi-channel launch kits (Product Hunt, Show HN, Indie Hackers, Reddit, X)
│   └── PRODUCTION_DEPLOYMENT.md# Production environment variables & deployment checklist
├── package.json                # Dependencies and scripts
├── prisma/
│   ├── dev.db                  # Local SQLite database
│   ├── schema.prisma           # User, Calculator, LeadSubmission, Subscription models
│   └── seed.js                 # Demo data seed script
├── public/
│   └── embed.js                # Lightweight universal embed snippet with iframe auto-resize
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/generate/    # AI schema generation endpoint
│   │   │   ├── billing/        # Stripe Checkout & Webhook handlers
│   │   │   ├── calculators/    # Calculator CRUD endpoints
│   │   │   ├── embed/          # Public embed endpoints & lead submissions
│   │   │   ├── health/         # System health check endpoint
│   │   │   └── leads/          # Leads retrieval & RFC 4180 CSV export
│   │   ├── builder/            # Visual Studio & AI generator studio
│   │   ├── c/[slug]/           # Public standalone direct share & programmatic SEO page
│   │   ├── calculators/        # Curated programmatic SEO calculator directory
│   │   ├── dashboard/          # Performance analytics & calculator management
│   │   ├── embed/[slug]/       # Standalone embed widget page
│   │   ├── leads/              # Captured leads CRM
│   │   ├── pricing/            # Self-serve Stripe pricing plans
│   │   ├── robots.ts           # Robots.txt handler with crawler directives
│   │   ├── sitemap.ts          # Dynamic XML sitemap generator
│   │   ├── globals.css         # Tailwind global styles
│   │   ├── layout.tsx          # Root application layout & navigation
│   │   └── page.tsx            # High-converting landing page & live demo
│   ├── components/
│   │   ├── CalculatorRenderer.tsx  # Core reactive interactive calculator component
│   │   ├── EmbedCodeModal.tsx      # Embed script & iframe modal
│   │   └── Navbar.tsx              # Application header
│   ├── data/
│   │   └── seoCalculators.ts   # 12 high-intent programmatic calculator definitions
│   ├── lib/
│   │   ├── auth.ts             # User session resolver
│   │   ├── formulaEngine.ts    # Sandboxed reactive formula evaluation & formatting
│   │   ├── gemini.ts           # Gemini AI model & resilient starter templates
│   │   └── prisma.ts           # Prisma client singleton
│   └── types/
│       └── calculator.ts       # TypeScript schemas and definitions
├── tests/
│   ├── api.test.ts             # API integration tests (CRUD, embed, submit, CSV, billing)
│   ├── formulaEngine.test.ts   # Formula engine math & unit tests
│   ├── gemini.test.ts          # AI generation & template fallback tests
│   ├── phase3Distribution.test.ts # SEO, sitemap, robots, and documentation tests
│   └── seoCalculators.test.ts  # Validation of all 12 SEO calculator schemas & formulas
└── vercel.json                 # Vercel deployment & permissive embed headers
```

---

## 4. Getting Started

### Prerequisites
- Node.js >= 18.x (tested on Node v20 & v24)
- npm >= 9.x

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd leadcalc-ai

# Install dependencies
npm install

# Initialize database schema and generate Prisma client
npx prisma db push

# Seed demo calculators and sample leads
node prisma/seed.js

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Environment Variables

Copy `.env.example` to `.env`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Public App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI Generator (Google Gemini)
GEMINI_API_KEY=""

# Stripe Payments (Optional - sandbox mock mode active if omitted)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID="price_pro_monthly"
NEXT_PUBLIC_STRIPE_FOUNDER_PRICE_ID="price_founder_lifetime"
```

*Note: If `STRIPE_SECRET_KEY` is not provided, LeadCalc AI automatically operates in interactive sandbox/mock mode, allowing full verification of checkout redirects, webhook processing, and tier upgrades without requiring live API keys.*

---

## 6. Embed Instructions for Websites

### Method A: Single-Line JavaScript Tag (Recommended)
Place this HTML anywhere on your page:
```html
<div id="leadcalc-embed" data-calc="solar-roi"></div>
<script src="https://your-domain.com/embed.js" async></script>
```

### Method B: Responsive iFrame
```html
<iframe
  src="https://your-domain.com/embed/solar-roi"
  width="100%"
  height="650"
  frameborder="0"
  style="border:none; border-radius: 12px; overflow: hidden;"
  title="Calculator"
></iframe>
```

---

## 7. Verification & Automated Tests

Run the complete test suite:
```bash
npm test
```

### Test Coverage Highlights (38/38 Tests Passing):
- **`formulaEngine.test.ts`**: Tests arithmetic expressions, percentage calculations, math functions (`min`, `max`, `round`, `sqrt`), division-by-zero resilience, currency/percentage formatting, chained formula outputs, prototype pollution blocking, and formula injection sanitization.
- **`gemini.test.ts`**: Tests AI schema generation, prompt normalization, and intelligent template fallback logic.
- **`api.test.ts`**: Tests `/api/health`, `/api/ai/generate` rate limiting (10 req/min per IP with `X-RateLimit-*` & `Retry-After`), `/api/calculators` CRUD & tier limits, `/api/embed/[slug]` delivery & CORS preflight, `/api/embed/[slug]/submit` lead capture & Free tier 100 leads limit, `/api/leads?format=csv` export, and Stripe `/api/billing/checkout` & `/api/billing/webhook` processing.
- **`phase3Distribution.test.ts`**: Verifies dynamic sitemap, robots indexing, launch assets, `/llms.txt` AI discovery, `docs/ENVIRONMENT_CHECKLIST.md`, and Vercel cross-domain frame-ancestors headers.
- **`seoCalculators.test.ts`**: Validates schema compliance, keyword targets, and formula calculation accuracy for all 12 programmatic calculators.

---

## 8. Production Deployment & Launch Kit

- **Environment Checklist**: Pre-flight environment variable validation is documented in [`docs/ENVIRONMENT_CHECKLIST.md`](docs/ENVIRONMENT_CHECKLIST.md).
- **Deployment Checklist**: Step-by-step setup for Vercel, Supabase, and Stripe is documented in [`docs/PRODUCTION_DEPLOYMENT.md`](docs/PRODUCTION_DEPLOYMENT.md).
- **Launch Package**: Ready-to-copy launch copy and distribution schedules are available in [`docs/LAUNCH_PACKAGE.md`](docs/LAUNCH_PACKAGE.md).
- **Vercel Config**: Pre-configured in [`vercel.json`](vercel.json) with edge security, CORS preflight, and embed headers.
