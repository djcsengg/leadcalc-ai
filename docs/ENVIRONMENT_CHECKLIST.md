# LeadCalc AI — Production Environment Variable Checklist

Use this checklist before triggering a production deployment to Vercel, Cloudflare, or Docker.

## 1. Required Production Variables

| Variable Name | Environment | Purpose | Validation / Expected Format |
|---|---|---|---|
| `DATABASE_URL` | Production, Preview | PostgreSQL Connection with Pooling (Supabase / Neon) | `postgresql://user:password@host:5432/db?pgbouncer=true&connection_limit=10` |
| `GEMINI_API_KEY` | Production, Preview | Google Gemini 3.8 Flash model generation | AI Studio API key (`AIzaSy...`) |
| `STRIPE_SECRET_KEY` | Production | Live Stripe Secret Key for processing payments | `sk_live_your_secret_key` |
| `STRIPE_PUBLISHABLE_KEY` | Production | Live Stripe Publishable Key | `pk_live_your_publishable_key` |
| `STRIPE_WEBHOOK_SECRET` | Production | Stripe Webhook Secret for `/api/billing/webhook` | `whsec_...` |
| `NEXT_PUBLIC_APP_URL` | Production | Canonical site URL (no trailing slash) | `https://leadcalc.ai` |

## 2. Optional & Development Defaults

| Variable Name | Default / Local | Purpose |
|---|---|---|
| `PORT` | `3000` | Port for standalone Docker or Node server |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | `price_pro_monthly` | Custom Stripe Price ID for monthly Pro tier |
| `NEXT_PUBLIC_STRIPE_FOUNDER_PRICE_ID` | `price_founder_lifetime` | Custom Stripe Price ID for $49 Lifetime Pass |

## 3. Pre-Flight Verification Steps

- [x] **Database Schema**: Ensure Prisma migrations are executed (`npx prisma db push`).
- [x] **Rate Limiting**: `/api/ai/generate` enforced at 10 requests/min per IP with standard headers.
- [x] **Formula Sandbox**: mathjs sanitized against code injection and syntax crashes.
- [x] **Iframe Security**: `/embed/:slug*` served with `Content-Security-Policy: frame-ancestors *` and sandboxed snippets.
- [x] **CORS Preflight**: `/api/embed/:path*` accepts cross-origin GET and POST with OPTIONS handling.
- [x] **AI Discovery**: `/llms.txt` active and accessible to search and LLM crawlers.
- [x] **Automated Tests**: All unit and integration test suites passing.
