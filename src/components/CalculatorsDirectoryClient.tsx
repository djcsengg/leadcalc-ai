"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEOCalculator, SEOCategoryInfo } from "@/data/seoCalculators";
import { EmbedButton } from "@/components/EmbedButton";
import { Search, ArrowRight, Sparkles, TrendingUp, Filter } from "lucide-react";

interface Props {
  calculators: SEOCalculator[];
  categories: SEOCategoryInfo[];
}

export function CalculatorsDirectoryClient({ calculators, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCalculators = useMemo(() => {
    return calculators.filter((calc) => {
      const matchesCategory =
        selectedCategory === "all" || calc.categorySlug === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        calc.title.toLowerCase().includes(q) ||
        calc.summary.toLowerCase().includes(q) ||
        calc.targetKeywords.some((kw) => kw.toLowerCase().includes(q)) ||
        calc.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [calculators, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Search and Category Filter Controls */}
      <div className="mb-10 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword (e.g. churn, solar, mortgage, rate, ltv)..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-brand-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            All Niches ({calculators.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? "bg-brand-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing{" "}
          <strong className="text-slate-900 font-semibold">{filteredCalculators.length}</strong>{" "}
          interactive calculators
        </span>
        {searchQuery && (
          <span className="italic">
            Filtered by query "{searchQuery}"
          </span>
        )}
      </div>

      {/* Grid of Calculator Cards */}
      {filteredCalculators.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Filter className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-3 text-sm font-bold text-slate-900">No calculators found</h3>
          <p className="mt-1 text-xs text-slate-500">
            No pre-built calculators match your search query. You can generate one immediately with AI!
          </p>
          <div className="mt-6">
            <Link
              href={`/builder?prompt=${encodeURIComponent(searchQuery)}`}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate "{searchQuery || "Custom"}" with AI</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calc) => (
            <div
              key={calc.slug}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-brand-300 hover:shadow-lg transition-all"
            >
              <div>
                {/* Category & Search Volume Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                    {calc.category}
                  </span>
                  <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    <span>{calc.searchVolume}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                  <Link href={`/c/${calc.slug}`}>{calc.title}</Link>
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {calc.summary}
                </p>

                {/* Target Keywords */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {calc.targetKeywords.slice(0, 3).map((kw, i) => (
                    <span
                      key={i}
                      className="rounded bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] text-slate-500 font-mono"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <EmbedButton
                  slug={calc.slug}
                  title={calc.title}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                />

                <Link
                  href={`/c/${calc.slug}`}
                  className="inline-flex items-center space-x-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors group-hover:translate-x-0.5"
                >
                  <span>Use Calc</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
