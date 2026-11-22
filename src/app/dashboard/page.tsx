"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EmbedCodeModal } from "@/components/EmbedCodeModal";
import {
  Sparkles,
  Users,
  Eye,
  TrendingUp,
  PlusCircle,
  Code2,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Check,
} from "lucide-react";

interface CalculatorItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  viewCount: number;
  leadsCount: number;
  createdAt: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const planName = searchParams.get("plan");

  const [calculators, setCalculators] = useState<CalculatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCalc, setSelectedCalc] = useState<{ slug: string; title: string } | null>(null);

  const fetchCalculators = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/calculators");
      const data = await res.json();
      if (data.calculators) {
        setCalculators(data.calculators);
      }
    } catch (err) {
      console.error("Failed to fetch calculators:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculators();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this calculator?")) return;
    try {
      await fetch(`/api/calculators/${id}`, { method: "DELETE" });
      setCalculators((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalCalculators = calculators.length;
  const totalViews = calculators.reduce((acc, c) => acc + (c.viewCount || 0), 0);
  const totalLeads = calculators.reduce((acc, c) => acc + (c.leadsCount || 0), 0);
  const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Payment Success Notification */}
      {paymentStatus === "success" && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-900">
                Payment Confirmed! You're now on {planName === "founder" ? "Founder Lifetime" : "Pro Plan"}.
              </h3>
              <p className="text-xs text-emerald-700">
                Unlimited calculators, unlimited leads, custom themes, and badge removal are unlocked.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-200/60 px-3 py-1 text-xs font-bold text-emerald-800">
            Active
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Calculators & Performance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track views, lead conversions, and manage your embeddable widgets.
          </p>
        </div>

        <Link
          href="/builder"
          className="inline-flex items-center space-x-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Calculator</span>
        </Link>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Calculators</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-brand-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{totalCalculators}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Live embeddable widgets</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Views</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{totalViews.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Impressions across all embeds</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Captured Leads</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{totalLeads.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Verified emails & contacts</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversion Rate</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{conversionRate}%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Views to lead submissions</span>
        </div>
      </div>

      {/* Calculators Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Your Calculators</h2>
          <span className="text-xs text-slate-500">{calculators.length} total</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading calculators...</div>
        ) : calculators.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No calculators created yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Build your first interactive calculator with our AI generator in under 30 seconds.
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center space-x-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-brand-700"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Calculator</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Calculator</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Views</th>
                  <th className="px-6 py-3.5">Leads</th>
                  <th className="px-6 py-3.5">Conv. Rate</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculators.map((calc) => {
                  const rate = calc.viewCount > 0 ? ((calc.leadsCount / calc.viewCount) * 100).toFixed(1) : "0.0";

                  return (
                    <tr key={calc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{calc.title}</div>
                        <div className="text-xs text-slate-400 font-mono">/c/{calc.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {calc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {calc.viewCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center space-x-1 font-bold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{calc.leadsCount}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {rate}%
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedCalc({ slug: calc.slug, title: calc.title })}
                          className="inline-flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Code2 className="h-3.5 w-3.5 text-brand-600" />
                          <span>Embed</span>
                        </button>
                        <Link
                          href={`/c/${calc.slug}`}
                          target="_blank"
                          className="inline-flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(calc.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCalc && (
        <EmbedCodeModal
          isOpen={!!selectedCalc}
          onClose={() => setSelectedCalc(null)}
          slug={selectedCalc.slug}
          title={selectedCalc.title}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading performance dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
