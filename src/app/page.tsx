"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalculatorRenderer } from "@/components/CalculatorRenderer";
import { getStarterTemplates } from "@/lib/gemini";
import {
  Sparkles,
  ArrowRight,
  Code2,
  TrendingUp,
  CheckCircle2,
  Zap,
  Sliders,
  ShieldCheck,
  Globe,
  Layers,
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
  };

  const scrollToDemo = () => {
    const el = document.getElementById("live-demo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-50/40">
      {/* Background Accent Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 bg-gradient-to-tr from-brand-200/40 via-indigo-100/30 to-blue-200/30 blur-3xl" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 lg:px-8 text-center">
        {/* Crisp Benefit Pill */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-brand-200 bg-brand-50/80 px-4 py-1.5 text-xs font-bold text-brand-700 shadow-sm mb-6">
          <Zap className="h-3.5 w-3.5 text-brand-600 fill-brand-600" />
          <span>Interactive Website Widget • Zero Code Required</span>
        </div>

        {/* 3-Second Rule Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl sm:leading-[1.12]">
          Add an Interactive Calculator to Your Website. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Get 3x More Leads.
          </span>
        </h1>

        {/* Clear Subheadline */}
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed font-normal">
          Replace boring static forms with interactive ROI, pricing, and quote calculators. Build in 60 seconds and embed on any website with 1 line of code.
        </p>

        {/* 3-Second Benefit Bullet Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Build in 60 seconds
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 1-line copy & paste embed
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Capture verified emails to CSV
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/builder"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>Try It Free — No Credit Card Required</span>
          </Link>

          <button
            onClick={scrollToDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all active:scale-95"
          >
            <Sliders className="h-4 w-4 text-slate-500" />
            <span>Try Live Demo Below</span>
          </button>
        </div>

        {/* Quick Builder Search Bar */}
        <div className="mx-auto mt-10 max-w-2xl">
          <form onSubmit={handleGenerate} className="relative flex items-center shadow-md rounded-2xl bg-white p-2 border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
            <div className="pl-3 text-brand-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Or describe your custom calculator (e.g. Solar ROI, Freelance Rate)..."
              className="flex-1 border-0 bg-transparent py-2.5 pl-3 pr-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
            >
              <span>Build</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </section>

      {/* Live Interactive Preview Section */}
      <section id="live-demo" className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Demo: Test The Sliders
              </div>
              <h2 className="mt-1 text-xl font-black text-slate-900">
                Interactive Calculation & Lead Capture
              </h2>
              <p className="text-xs text-slate-500">
                This is exactly what your visitors experience on your website.
              </p>
            </div>

            {/* Template Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {templates.slice(0, 3).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTemplate(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedTemplate.id === t.id
                      ? "bg-white text-brand-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
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
              headline: "Get a detailed PDF calculation report sent to your email",
              buttonLabel: "Send Calculation Report",
            }}
          />

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 rounded-2xl p-4">
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block">Want this calculator on your site?</span>
              <span className="text-[11px] text-slate-500">Customize formulas, colors, and embed in under 2 minutes.</span>
            </div>
            <Link
              href={`/builder?template=${selectedTemplate.id}`}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
            >
              <span>Customize in Builder</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Simple Value Pillars (No Text Walls) */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Why Top Sites Use Interactive Calculators
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Interactive tools convert up to 3x higher than static contact forms because visitors get instant personalized value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Instant Visual Engagement</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Visitors adjust sliders and see immediate results. Instant feedback keeps attention and eliminates bounce rates.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. 1-Line Universal Embed</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Works seamlessly with Webflow, WordPress, Shopify, Framer, Squarespace, and React. Responsive on mobile and desktop.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. High-Intent Lead Capture</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Gate results to collect emails, company names, and projected budgets. Export captured leads to CSV in 1 click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Pricing Banner */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            Clear Transparent Pricing
          </div>
          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
            Start Free. Upgrade Only When You Scale.
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Build 3 calculators for free with zero credit card required. Lock in the Pro Lifetime Deal for unlimited calculators and white-label branding.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="font-bold text-slate-900 text-sm">Free Starter</div>
              <div className="text-3xl font-black text-slate-950">$0</div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">✓ 3 Active Calculators</li>
                <li className="flex items-center gap-2">✓ 100 Captured Leads/mo</li>
                <li className="flex items-center gap-2">✓ Universal Embed</li>
              </ul>
              <Link
                href="/builder"
                className="w-full mt-2 inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors"
              >
                Start Free
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-brand-600 shadow-lg space-y-3 relative">
              <span className="absolute top-3 right-3 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Most Popular
              </span>
              <div className="font-bold text-slate-900 text-sm">Founder LTD</div>
              <div className="text-3xl font-black text-slate-950">$49 <span className="text-xs text-slate-400 font-normal">/ lifetime</span></div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2 font-semibold text-slate-900">✓ Unlimited Calculators</li>
                <li className="flex items-center gap-2 font-semibold text-slate-900">✓ Unlimited Lead Capture</li>
                <li className="flex items-center gap-2">✓ Remove "Powered By" Badge</li>
                <li className="flex items-center gap-2">✓ CSV & CRM Export</li>
              </ul>
              <Link
                href="/pricing"
                className="w-full mt-2 inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
              >
                Get Lifetime Access ($49)
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
