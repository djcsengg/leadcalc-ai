import { Metadata } from "next";
import {
  getAllSeoCalculators,
  getSeoCategories,
} from "@/data/seoCalculators";
import { CalculatorsDirectoryClient } from "@/components/CalculatorsDirectoryClient";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Code2, Users } from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Interactive Calculators Directory (2026) | LeadCalc AI",
  description:
    "Free interactive calculators for ROI, SaaS unit economics, mortgage amortization, and freelance rates. Embed responsive widgets on any website with 1 line of code.",
  keywords: [
    "interactive calculators directory",
    "roi calculators",
    "saas pricing calculator",
    "mortgage payment estimator",
    "freelance hourly rate calculator",
    "embeddable lead magnets",
  ],
  alternates: {
    canonical: "https://leadcalc.ai/calculators",
  },
  openGraph: {
    title: "Interactive Calculators Directory | LeadCalc AI",
    description:
      "Explore high-intent ROI, SaaS unit economic, and financial calculators. Embed them anywhere to capture 3x more qualified leads.",
    url: "https://leadcalc.ai/calculators",
    siteName: "LeadCalc AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Calculators Directory | LeadCalc AI",
    description:
      "Browse and embed free ROI, SaaS churn, mortgage, and freelance rate calculators.",
  },
};

export default function CalculatorsDirectoryPage() {
  const calculators = getAllSeoCalculators();
  const categories = getSeoCategories();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leadcalc.ai";

  // Schema.org CollectionPage and ItemList
  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Interactive Business & Financial Calculators Directory",
    description:
      "A curated collection of embeddable, interactive calculators for business valuation, marketing ROI, mortgage estimates, and freelancing.",
    url: `${baseUrl}/calculators`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: calculators.map((calc, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${baseUrl}/c/${calc.slug}`,
        name: calc.title,
        description: calc.summary,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollection) }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-xs mb-4">
            <Sparkles className="h-3.5 w-3.5 text-brand-600" />
            <span>Curated Programmatic Directory</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Interactive Business & Financial Calculators
          </h1>

          <p className="mt-4 text-base text-slate-600 sm:text-lg leading-relaxed">
            Explore ready-to-use calculators for high-volume search niches. Use them online or embed them onto your Webflow, WordPress, or React website with a single snippet.
          </p>
        </div>

        {/* Interactive Client Search & Filterable Grid */}
        <CalculatorsDirectoryClient
          calculators={calculators}
          categories={categories}
        />

        {/* SEO Informational Section: Why Interactive Calculators Work */}
        <div className="mt-24 border-t border-slate-200 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Why Embed Interactive Calculators on Your Website?
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Static PDF lead magnets and generic contact forms suffer from declining conversion rates. Interactive tools provide instant personalized utility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3x Higher Conversion</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Visitors willingly trade their email or phone number in exchange for personalized calculations and custom PDF reports.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Maintenance Embed</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Drop one script tag or responsive iframe into any CMS. Updates, styling tweaks, and lead gates sync automatically without redeploying code.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">High-Intent Traffic</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Search queries ending in "calculator" or "estimator" exhibit the highest commercial intent on Google, signaling buyers actively shopping for solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-20 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-8 sm:p-12 text-center text-white shadow-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Don't see your specific niche or formula?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
            LeadCalc AI generates custom inputs, formulas, and styled widgets in 30 seconds from natural language.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/builder"
              className="inline-flex items-center space-x-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-600 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Create Custom Calculator Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
