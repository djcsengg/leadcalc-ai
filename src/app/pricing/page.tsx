"use client";

import React, { useState } from "react";
import { Check, Sparkles, ArrowRight, Zap, Shield } from "lucide-react";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    try {
      setLoadingPlan(plan);
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to initiate checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 shadow-sm mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Simple, Transparent Pricing</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Scale Your Inbound Leads with Zero Overhead
        </h1>
        <p className="mt-4 text-base text-slate-600">
          Start free today. Upgrade anytime for unlimited calculators, white-label branding, and lead exports.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Free Tier */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Free Tier</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Starter</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">For solopreneurs testing calculators on their personal sites.</p>

            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900">$0</span>
              <span className="text-xs text-slate-500 ml-1">/ month</span>
            </div>

            <ul className="mt-8 space-y-3.5 text-xs text-slate-600">
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>3 Active Calculators</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Up to 100 Captured Leads / month</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Gemini 3.8 AI Generation</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Universal Script & iFrame Embed</span>
              </li>
              <li className="flex items-center space-x-2.5 text-slate-400">
                <span>Includes "Powered by LeadCalc AI"</span>
              </li>
            </ul>
          </div>

          <a
            href="/builder"
            className="mt-8 block text-center rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Get Started Free
          </a>
        </div>

        {/* Pro Tier (Popular) */}
        <div className="relative rounded-3xl border-2 border-brand-600 bg-white p-8 shadow-xl shadow-brand-500/10 flex flex-col justify-between scale-105 z-10">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3.5 py-1 text-[11px] font-bold text-white shadow-sm uppercase tracking-wide">
            Most Popular
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Pro Plan</h3>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">Recurring</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">For agencies, consultants, and high-traffic SMB websites.</p>

            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900">$19</span>
              <span className="text-xs text-slate-500 ml-1">/ month</span>
            </div>

            <ul className="mt-8 space-y-3.5 text-xs text-slate-600">
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-brand-600 flex-shrink-0" />
                <span className="font-semibold text-slate-900">Unlimited Active Calculators</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-brand-600 flex-shrink-0" />
                <span className="font-semibold text-slate-900">Unlimited Captured Leads</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-brand-600 flex-shrink-0" />
                <span>Remove "Powered by LeadCalc AI" Badge</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-brand-600 flex-shrink-0" />
                <span>Custom Brand Colors & Styling</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-brand-600 flex-shrink-0" />
                <span>1-Click CSV Export & Webhooks</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-brand-600 flex-shrink-0" />
                <span>Priority Email Support</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout("pro")}
            disabled={loadingPlan === "pro"}
            className="mt-8 w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-brand-600 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            <span>{loadingPlan === "pro" ? "Redirecting..." : "Upgrade to Pro"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Founder Lifetime Pass */}
        <div className="rounded-3xl border border-purple-200 bg-gradient-to-b from-purple-50/50 to-white p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-purple-950">Founder Lifetime</h3>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">Limited (100 spots)</span>
            </div>
            <p className="mt-2 text-xs text-purple-700/80">Pay once, own forever. Zero recurring monthly bills.</p>

            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900">$49</span>
              <span className="text-sm font-semibold text-purple-700 ml-2">(₹2,499)</span>
              <span className="text-xs text-slate-500 ml-1">one-time payment</span>
            </div>

            <ul className="mt-8 space-y-3.5 text-xs text-slate-600">
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span className="font-semibold text-slate-900">Lifetime Access to All Pro Features</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span>Unlimited Calculators & Leads Forever</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span>Full White-Labeling & Custom Domain Ready</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span>All Future Product Updates Included</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span>Direct Roadmap Input with ATS Engineers</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout("founder")}
            disabled={loadingPlan === "founder"}
            className="mt-8 w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-purple-600 py-3 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <span>{loadingPlan === "founder" ? "Redirecting..." : "Claim Lifetime Pass ($49 / ₹2,499)"}</span>
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
