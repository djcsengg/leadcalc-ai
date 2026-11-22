# LeadCalc AI — Production Deployment Guide & Checklist

## 1. Architecture & Cost Profile Overview

LeadCalc AI is engineered for zero fixed monthly runtime overhead ($0/month base cost) while maintaining enterprise-grade horizontal scaling and sub-second response times:

- **Frontend & Edge Hosting**: Vercel Serverless / Cloudflare Pages ($0/mo hobby / free tier)
- **Database**: PostgreSQL on Supabase or Neon Serverless ($0/mo free tier, pooling via pgBouncer)
- **AI Engine**: Google Gemini API via `@google/generative-ai` (Pay-per-token with built-in instant template fallback on rate limit/timeout)
- **Payments & Subscriptions**: Stripe Checkout & Webhooks (Pay-per-transaction, 2.9% + $0.30)
- **Static Assets & Embed Script**: Distributed CDN Edge via Next.js `/embed.js` with `frame-ancestors *` and public caching headers

---

## 2. Required Production Environment Variables

All variables below must be populated in the production environment (e.g., Vercel Project Settings → Environment Variables):

| Variable Name | Required | Description | Example / Format |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | PostgreSQL connection string (supports direct or pooled connection like Supabase/Neon) | `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?pgbouncer=true` |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API Key from Google AI Studio | `AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxx` |
| `STRIPE_SECRET_KEY` | **Yes** | Stripe Live Secret Key | `sk_live_your_stripe_secret_key` |
| `STRIPE_PUBLISHABLE_KEY` | **Yes** | Stripe Live Publishable Key (client-accessible) | `pk_live_your_stripe_publishable_key` |
| `STRIPE_WEBHOOK_SECRET` | **Yes** | Stripe Webhook Signing Secret for endpoint `/api/billing/webhook` | `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `STRIPE_PRICE_PRO_MONTHLY` | **Yes** | Stripe Price ID for $29/mo Pro Subscription | `price_1Qxxxxxxxxxxxxxxxxxx` |
| `STRIPE_PRICE_PRO_ANNUAL` | **Yes** | Stripe Price ID for $290/year Pro Subscription | `price_1Qxxxxxxxxxxxxxxxxxx` |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Canonical production URL without trailing slash | `https://leadcalc.ai` |
| `PORT` | Optional | Internal port (defaults to 3000 for Docker/standalone) | `3000` |

---

## 3. Step-by-Step Vercel Deployment

### Step 1: Connect Git Repository
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select the `leadcalc-ai` repository.

### Step 2: Configure Build Settings
- **Framework Preset**: `Next.js`
- **Root Directory**: `./`
- **Build Command**: `prisma generate && next build` (or leave default if `vercel.json` is present)
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 3: Enter Production Environment Variables
In the **Environment Variables** panel, paste all keys listed in Section 2 above for the `Production` environment.

### Step 4: Provision & Seed Database
1. In your PostgreSQL instance (e.g. Supabase or Neon), ensure connections are open.
2. Run database migration and initial seed:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

### Step 5: Configure Stripe Webhook
1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks).
2. Click **Add an endpoint**.
3. **Endpoint URL**: `https://leadcalc.ai/api/billing/webhook`
4. **Events to listen for**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Reveal **Signing secret** and set as `STRIPE_WEBHOOK_SECRET` in Vercel.

---

## 4. Alternative: Cloudflare Pages / Docker Deployment

### Self-Hosted Docker Container
LeadCalc AI includes an optimized multi-stage `Dockerfile` and `docker-compose.yml`:
```bash
# 1. Clone repository
git clone https://github.com/ats-org/leadcalc-ai.git
cd leadcalc-ai

# 2. Configure .env.production
cp .env.example .env.production
# Edit .env.production with live keys

# 3. Build & start container
docker compose up -d --build

# 4. Run migrations
docker compose exec web npx prisma db push
```

---

## 5. Pre-Launch Verification Checklist

Before opening public traffic, run this checklist against the live domain:

- [ ] **Health Check**: `GET https://leadcalc.ai/api/health` returns `{"status":"ok"}`.
- [ ] **AI Generation**: Visit `https://leadcalc.ai/builder`, test prompt "Fitness trainer rate calculator", confirm valid formula and input fields generate within 3-5 seconds.
- [ ] **Programmatic SEO Directory**: Visit `https://leadcalc.ai/calculators`, verify search filter and 12 curated calculators load cleanly.
- [ ] **Landing Page SEO**: Check `https://leadcalc.ai/c/solar-roi`, verify Schema.org `WebApplication` and `BreadcrumbList` tags are present in `<head>`.
- [ ] **Sitemap & Robots**: Verify `https://leadcalc.ai/sitemap.xml` and `https://leadcalc.ai/robots.txt` return HTTP 200 with all programmatic URLs.
- [ ] **Embed Widget & Viral Loop**:
  - Test `/embed/solar-roi` in an external sandbox (e.g., CodeSandbox, JSFiddle, Webflow).
  - Confirm `embed.js` automatically resizes iframe height via `postMessage`.
  - Confirm "⚡ Powered by LeadCalc AI" badge links to `https://leadcalc.ai/?utm_source=calculator_embed...`.
- [ ] **Lead Capture**: Fill out the email gate in a live calculator, confirm lead arrives in `/leads` and Prisma database.
- [ ] **Stripe Checkout**: Click Upgrade to Pro on `/pricing`, verify redirect to Stripe Checkout and return to `/dashboard?success=true`.
