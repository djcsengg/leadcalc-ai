"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalculatorRenderer } from "@/components/CalculatorRenderer";
import { getStarterTemplates } from "@/lib/gemini";
import {
  Sparkles,
  ArrowRight,
  Code2,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const templates = getStarterTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/builder?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  const handleSelectTemplate = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setPrompt(template.name);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 bg-gradient-to-tr from-brand-200/40 via-indigo-100/30 to-purple-200/30 blur-3xl" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 rounded-full border border-brand-200 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm mb-6">
          <Sparkles className="h-3.5 w-3.5 text-brand-600 animate-spin" />
          <span>Product #1 by ATS • Powered by Gemini 3.8 & Stripe</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.15]">
          Turn Passive Website Visitors into{" "}
          <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
            High-Intent Leads
          </span>{" "}
          in 30 Seconds
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">
          Create embeddable, interactive ROI, pricing, and savings calculators for your business via natural language. Capture 3x more qualified leads before or after showing results.
        </p>

        {/* AI Prompt Input Bar */}
        <div className="mx-auto mt-10 max-w-2xl">
          <form onSubmit={handleGenerate} className="relative flex items-center shadow-lg rounded-2xl bg-white p-2 border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
            <div className="pl-3 text-brand-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Solar panel ROI for homeowners or Freelance hourly rate"
              className="flex-1 border-0 bg-transparent py-3 pl-3 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="inline-flex items-center space-x-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700 transition-colors"
            >
              <span>Generate AI Calc</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Template Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Popular Templates:</span>
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTemplate(t)}
                className={`rounded-full px-3 py-1 font-medium transition-all ${
                  selectedTemplate.id === t.id
                    ? "bg-brand-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Interactive Preview Section */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="text-center mb-6">
            <span className="inline-block rounded-lg bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 uppercase tracking-wide">
              Live Demo Preview
            </span>
            <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              Experience the Live Interactive Calculation
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Adjust the sliders below to see reactive recalculation in real time.
            </p>
          </div>

          <CalculatorRenderer
            schema={selectedTemplate.schema}
            styling={{
              primaryColor: "#4f46e5",
              showBadge: true,
            }}
            gateConfig={{
              enabled: true,
              timing: "after_results",
              headline: "Receive this calculation report via email",
              buttonLabel: "Send PDF Report",
            }}
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything You Need to Turn Visitors into Paying Customers
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Interactive calculators convert at up to 42% compared to generic static lead forms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">30-Second AI Creation</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Describe your formula or business niche in plain English. Gemini AI formulates inputs, reactive math formulas, and styled output cards automatically.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-6">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1-Line Universal Embed</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Drop a single &lt;script&gt; or responsive &lt;iframe&gt; into Webflow, WordPress, Framer, Shopify, or custom React apps. Responsive on all devices.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Automated Lead CRM & CSV</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Gate results or collect emails before or after calculation. Export captured leads with contact data, input snapshots, and projections to CSV in 1 click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-slate-900 py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to generate your first interactive calculator?
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Start free with zero credit card required. Upgrade anytime for unlimited leads and white-label branding.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => router.push("/builder")}
              className="inline-flex items-center space-x-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-brand-600 transition-colors"
            >
              <span>Build Free Calculator Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
