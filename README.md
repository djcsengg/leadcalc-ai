# LeadCalc AI (Product #1)

> **Embeddable, AI-Powered Interactive Calculator & Lead Magnet Generator**  
> *Developed by Autonomous Technology Solutions (ATS) — Phase 2 MVP Implementation ([ATS-4](/ATS/issues/ATS-4))*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-darkblue?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-21%2F21%20Passing-brightgreen)](https://vitest.dev/)

---

## 1. Overview

**LeadCalc AI** enables non-technical founders, consultants, agencies, and SMB websites to generate dynamic ROI, pricing, and savings calculators in 30 seconds via natural language. Users can embed them onto any website with a single `<script>` tag or `<iframe>`, and automatically capture qualified B2B leads before or after displaying results.

### Key Highlights
- **30-Second AI Generation:** Describe your business model or formula in plain English; Google Gemini automatically generates reactive input sliders, numeric fields, safe math formulas, and styled output cards.
- **Viral Growth Flywheel:** Free tier includes a discreet "Powered by LeadCalc AI" badge that links to product signup.
- **Self-Serve Stripe Monetization:** Fully automated billing with Pro Monthly subscriptions ($19/mo) and Founder Lifetime passes ($49 one-time).
- **Universal Embeddability:** One-line script snippet (`<script src="/embed.js"></script>`) or responsive `<iframe>` compatible with Webflow, WordPress, Framer, Squarespace, Shopify, and custom React sites.
- **Automated Lead CRM & CSV Export:** Captures visitor contact details, input parameter snapshots, and calculated outcomes, with 1-click CSV download.

---

## 2. Architecture & Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Unified React frontend + serverless API route handlers |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive modern SaaS aesthetic |
| **ORM & DB** | Prisma + SQLite | Zero-cost serverless-ready local DB; instant migration to PostgreSQL/Supabase |
| **Formula Engine** | Math.js AST parser | Client & server sandboxed reactive mathematical evaluation (prevents arbitrary JS execution) |
| **AI Engine** | Google Gemini (Gemini 3.8 / 2.5 Flash) | Natural language to structured JSON calculator schemas with smart template fallbacks |
| **Payments** | Stripe Checkout & Webhooks | Automated global payments, subscriptions, and lifetime deals |
| **Testing** | Vitest | Lightning-fast unit and API integration test suite |

---

## 3. Project Directory Structure

```text
├── Dockerfile                  # Multi-stage production container build
├── docker-compose.yml          # Production container orchestration
├── package.json                # Dependencies and scripts
├── prisma/
│   ├── dev.db                  # Local SQLite database
│   ├── schema.prisma           # User, Calculator, LeadSubmission, Subscription models
│   └── seed.js                 # Demo data seed script
├── public/
│   └── embed.js                # Lightweight universal embed snippet for client websites
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
│   │   ├── c/[slug]/           # Public standalone direct share page
│   │   ├── dashboard/          # Performance analytics & calculator management
│   │   ├── embed/[slug]/       # Standalone embed widget page
│   │   ├── leads/              # Captured leads CRM
│   │   ├── pricing/            # Self-serve Stripe pricing plans
│   │   ├── globals.css         # Tailwind global styles
│   │   ├── layout.tsx          # Root application layout & navigation
│   │   └── page.tsx            # High-converting landing page & live demo
│   ├── components/
│   │   ├── CalculatorRenderer.tsx  # Core reactive interactive calculator component
│   │   ├── EmbedCodeModal.tsx      # Embed script & iframe modal
│   │   └── Navbar.tsx              # Application header
│   ├── lib/
│   │   ├── auth.ts             # User session resolver
│   │   ├── formulaEngine.ts    # Sandboxed reactive formula evaluation & formatting
│   │   ├── gemini.ts           # Gemini AI model & resilient starter templates
│   │   └── prisma.ts           # Prisma client singleton
│   └── types/
│       └── calculator.ts       # TypeScript schemas and definitions
└── tests/
    ├── api.test.ts             # API integration tests (CRUD, embed, submit, CSV, billing)
    ├── formulaEngine.test.ts   # Formula engine math & unit tests
    └── gemini.test.ts          # AI generation & template fallback tests
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

### Test Coverage Highlights:
- **`formulaEngine.test.ts`**: Tests arithmetic expressions, percentage calculations, math functions (`min`, `max`, `round`, `sqrt`), division-by-zero resilience, currency/percentage formatting, and chained formula outputs.
- **`gemini.test.ts`**: Tests AI schema generation, prompt normalization, and intelligent template fallback logic.
- **`api.test.ts`**: Tests `/api/health`, `/api/ai/generate`, `/api/calculators` CRUD, `/api/embed/[slug]` delivery, `/api/embed/[slug]/submit` lead capture, `/api/leads?format=csv` export, and Stripe `/api/billing/checkout` & `/api/billing/webhook` processing.

---

## 8. Production Deployment

### Docker Deployment
```bash
docker-compose up --build -d
```

### Serverless Deployment (Vercel)
1. Push repository to GitHub.
2. Import project in Vercel.
3. Configure environment variables (`DATABASE_URL`, `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`).
4. Deploy!
