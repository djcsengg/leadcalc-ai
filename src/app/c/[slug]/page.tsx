import { notFound } from "next/navigation";
import { CalculatorRenderer } from "@/components/CalculatorRenderer";
import { getOrInitCalculator } from "@/lib/calculatorService";
import { getSeoCalculatorBySlug, getAllSeoCalculators } from "@/data/seoCalculators";
import { EmbedButton } from "@/components/EmbedButton";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  Calculator as CalcIcon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leadcalc.ai";
  const seoCalc = getSeoCalculatorBySlug(slug);

  if (seoCalc) {
    return {
      title: `${seoCalc.metaTitle} | LeadCalc AI`,
      description: seoCalc.metaDescription,
      keywords: seoCalc.targetKeywords,
      alternates: {
        canonical: `${baseUrl}/c/${seoCalc.slug}`,
      },
      openGraph: {
        title: seoCalc.metaTitle,
        description: seoCalc.metaDescription,
        url: `${baseUrl}/c/${seoCalc.slug}`,
        siteName: "LeadCalc AI",
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seoCalc.metaTitle,
        description: seoCalc.metaDescription,
      },
    };
  }

  const calculator = await getOrInitCalculator(slug);
  if (!calculator) {
    return { title: "Calculator Not Found - LeadCalc AI" };
  }

  return {
    title: `${calculator.title} - LeadCalc AI`,
    description: calculator.description || "Interactive ROI & savings calculator.",
    alternates: {
      canonical: `${baseUrl}/c/${calculator.slug}`,
    },
    openGraph: {
      title: `${calculator.title} - LeadCalc AI`,
      description: calculator.description || "Interactive ROI & savings calculator.",
      url: `${baseUrl}/c/${calculator.slug}`,
      siteName: "LeadCalc AI",
      type: "website",
    },
  };
}

export default async function CalculatorPublicPage({ params }: Props) {
  const { slug } = params;
  const calculator = await getOrInitCalculator(slug);

  if (!calculator || !calculator.isPublished) {
    notFound();
  }

  const seoCalc = getSeoCalculatorBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leadcalc.ai";

  const schema = JSON.parse(calculator.schemaJson);
  const styling = calculator.stylingJson ? JSON.parse(calculator.stylingJson) : {};
  const gateConfig = calculator.gateConfigJson ? JSON.parse(calculator.gateConfigJson) : {};

  // Free tier badge enforcement
  if (calculator.user.planTier === "free") {
    styling.showBadge = true;
  }

  // Related calculators in same category
  const allSeo = getAllSeoCalculators();
  const relatedCalcs = seoCalc
    ? allSeo.filter((c) => c.categorySlug === seoCalc.categorySlug && c.slug !== seoCalc.slug).slice(0, 3)
    : allSeo.slice(0, 3);

  // Schema.org Structured Data
  const jsonLdSoftwareApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calculator.title,
    description: calculator.description || seoCalc?.metaDescription,
    url: `${baseUrl}/c/${calculator.slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculators",
        item: `${baseUrl}/calculators`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: calculator.title,
        item: `${baseUrl}/c/${calculator.slug}`,
      },
    ],
  };

  const jsonLdFaq = seoCalc?.longFormGuide?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seoCalc.longFormGuide.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}

      {/* Header & Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <nav className="flex items-center space-x-1.5" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <Link href="/calculators" className="hover:text-slate-900 transition-colors">
                Calculators
              </Link>
              {seoCalc && (
                <>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                  <span className="text-slate-700 font-medium">{seoCalc.category}</span>
                </>
              )}
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className="text-brand-600 font-semibold truncate max-w-[200px] sm:max-w-none">
                {calculator.title}
              </span>
            </nav>

            <div className="flex items-center space-x-2">
              <EmbedButton slug={calculator.slug} title={calculator.title} />
              <Link
                href={`/builder?prompt=${encodeURIComponent(calculator.title)}`}
                className="inline-flex items-center space-x-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Clone in Builder</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 mb-4">
            <CalcIcon className="h-3.5 w-3.5 text-brand-600" />
            <span>{seoCalc?.category || "Interactive Calculator"}</span>
            {seoCalc && (
              <>
                <span>•</span>
                <span className="text-brand-600">{seoCalc.searchVolume} Searches</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {calculator.title}
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            {calculator.description || seoCalc?.summary}
          </p>
        </div>

        {/* Live Interactive Calculator Card */}
        <div className="mx-auto max-w-4xl shadow-xl rounded-2xl bg-white border border-slate-200 overflow-hidden mb-16">
          <div className="p-4 sm:p-8">
            <CalculatorRenderer
              schema={schema}
              styling={styling}
              gateConfig={gateConfig}
              slug={calculator.slug}
            />
          </div>
        </div>

        {/* Long-Form SEO Guide & Structured Content */}
        {seoCalc?.longFormGuide && (
          <div className="mx-auto max-w-4xl space-y-12">
            {/* 1. Overview */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-brand-600" />
                <span>Overview & Commercial Application</span>
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {seoCalc.longFormGuide.overview}
              </p>
            </section>

            {/* 2. Step-by-Step Instructions */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>How to Use This Calculator</span>
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seoCalc.longFormGuide.howItWorks.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <p className="text-xs font-medium text-slate-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Mathematical Formula Breakdown */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <span>Mathematical Formulation & Methodology</span>
              </h2>
              <div className="mt-4 rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                <code>{seoCalc.longFormGuide.formulaExplanation}</code>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Calculations are evaluated client-side in real-time with zero latency and high precision.
              </p>
            </section>

            {/* 4. Industry Benchmarks */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <span>Industry Benchmarks & Comparative Metrics (2026)</span>
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {seoCalc.longFormGuide.industryBenchmarks.map((bench, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 text-center"
                  >
                    <p className="text-xs font-semibold text-slate-500">{bench.label}</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{bench.value}</p>
                    <p className="mt-1 text-[11px] text-slate-500 leading-tight">{bench.context}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. FAQs */}
            {seoCalc.longFormGuide.faqs.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                  <span>Frequently Asked Questions</span>
                </h2>
                <div className="mt-6 space-y-4">
                  {seoCalc.longFormGuide.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4"
                    >
                      <h3 className="text-sm font-bold text-slate-900">{faq.question}</h3>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Related Calculators */}
            {relatedCalcs.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Related Calculators in {seoCalc.category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedCalcs.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/c/${rel.slug}`}
                      className="group rounded-xl border border-slate-200 p-4 hover:border-brand-300 hover:shadow-md transition-all bg-white"
                    >
                      <span className="inline-block rounded bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                        {rel.searchVolume}
                      </span>
                      <h3 className="mt-2 text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {rel.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                        {rel.summary}
                      </p>
                      <div className="mt-3 flex items-center text-xs font-semibold text-brand-600 group-hover:translate-x-1 transition-transform">
                        <span>Open Calculator</span>
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Bottom Viral CTA Box */}
        <div className="mx-auto mt-16 max-w-4xl rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Build Your Own Interactive Lead Magnet</span>
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Want an interactive calculator like this on your website?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
            Describe your formula in plain English and Gemini AI generates formulas, input sliders, and lead capture gates in 30 seconds.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href={`/builder?prompt=${encodeURIComponent(`Interactive version of ${calculator.title}`)}`}
              className="inline-flex items-center space-x-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-600 transition-colors"
            >
              <span>Build Free with AI</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
