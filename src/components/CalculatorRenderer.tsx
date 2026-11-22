"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CalculatorSchema,
  CalculatorStyling,
  GateConfig,
  EvaluatedOutput,
} from "@/types/calculator";
import { evaluateCalculator } from "@/lib/formulaEngine";
import { Sparkles, CheckCircle2, Lock, ArrowRight, Mail, User, Phone, ExternalLink } from "lucide-react";

interface CalculatorRendererProps {
  schema: CalculatorSchema;
  styling?: Partial<CalculatorStyling>;
  gateConfig?: Partial<GateConfig>;
  slug?: string;
  isEmbed?: boolean;
  onLeadSubmit?: (lead: { email: string; name?: string; phone?: string }) => void;
}

export function CalculatorRenderer({
  schema,
  styling = {},
  gateConfig = {},
  slug,
  isEmbed = false,
  onLeadSubmit,
}: CalculatorRendererProps) {
  // Initialize input state with default values
  const [inputs, setInputs] = useState<Record<string, number | string>>(() => {
    const initial: Record<string, number | string> = {};
    if (schema?.inputs) {
      for (const input of schema.inputs) {
        initial[input.id] = input.defaultValue;
      }
    }
    return initial;
  });

  // Lead capture form state
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isUnlocked, setIsUnlocked] = useState(!gateConfig?.enabled || gateConfig?.timing !== "before_results");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Auto-resize communication for embedded iframes
  useEffect(() => {
    if (!isEmbed || typeof window === "undefined" || !slug) return;

    const notifyHeight = () => {
      const height = document.documentElement.scrollHeight || document.body.scrollHeight;
      window.parent.postMessage(
        {
          type: "leadcalc-resize",
          slug,
          height,
        },
        "*"
      );
    };

    notifyHeight();
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            notifyHeight();
          })
        : null;

    if (observer) {
      observer.observe(document.body);
    }

    window.addEventListener("resize", notifyHeight);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", notifyHeight);
    };
  }, [isEmbed, slug, inputs, isUnlocked, submittedSuccess]);

  const handleInputChange = (id: string, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [id]: typeof value === "string" && !isNaN(Number(value)) && value.trim() !== "" ? Number(value) : value,
    }));
  };

  // Live evaluated outputs
  const evaluatedOutputs: EvaluatedOutput[] = useMemo(() => {
    if (!schema?.outputs || schema.outputs.length === 0) return [];
    return evaluateCalculator(schema, inputs);
  }, [schema, inputs]);

  const primaryColor = styling.primaryColor || "#4f46e5";
  const showBadge = styling.showBadge !== false;
  const isGateBefore = gateConfig?.enabled && gateConfig?.timing === "before_results" && !isUnlocked;

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.email || !leadForm.email.includes("@")) {
      setSubmitError("Please provide a valid email address.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      if (slug) {
        const res = await fetch(`/api/embed/${slug}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: leadForm.email,
            name: leadForm.name,
            phone: leadForm.phone,
            inputs,
            result: evaluatedOutputs.reduce((acc, o) => ({ ...acc, [o.id]: o.value }), {}),
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to submit lead");
        }
      }

      if (onLeadSubmit) {
        onLeadSubmit(leadForm);
      }

      setIsUnlocked(true);
      setSubmittedSuccess(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
      {/* Header */}
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {schema.title || "Interactive Calculator"}
        </h2>
        {schema.description && (
          <p className="mt-2 text-sm text-slate-600 sm:text-base leading-relaxed">
            {schema.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Adjust Parameters
          </h3>

          <div className="space-y-6">
            {schema.inputs.map((input) => {
              const val = inputs[input.id] !== undefined ? inputs[input.id] : input.defaultValue;

              return (
                <div key={input.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={input.id} className="text-sm font-medium text-slate-800">
                      {input.label}
                    </label>
                    <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-sm font-bold text-slate-900 shadow-sm border border-slate-200">
                      {input.prefix || ""}
                      {typeof val === "number" ? val.toLocaleString() : val}
                      {input.unit ? ` ${input.unit}` : ""}
                    </span>
                  </div>

                  {input.type === "slider" ? (
                    <div className="space-y-1.5 pt-1">
                      <input
                        id={input.id}
                        type="range"
                        min={input.min ?? 0}
                        max={input.max ?? 100}
                        step={input.step ?? 1}
                        value={Number(val)}
                        onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200"
                        style={{ accentColor: primaryColor }}
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{input.prefix || ""}{input.min ?? 0}{input.unit ? ` ${input.unit}` : ""}</span>
                        <span>{input.prefix || ""}{input.max ?? 100}{input.unit ? ` ${input.unit}` : ""}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative mt-1 rounded-md shadow-sm">
                      {input.prefix && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-slate-500 text-sm">{input.prefix}</span>
                        </div>
                      )}
                      <input
                        id={input.id}
                        type="number"
                        min={input.min}
                        max={input.max}
                        step={input.step ?? 1}
                        value={val}
                        onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                        className={`block w-full rounded-lg border border-slate-300 py-2 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm font-medium ${
                          input.prefix ? "pl-7" : "pl-3"
                        } ${input.unit ? "pr-12" : "pr-3"}`}
                      />
                      {input.unit && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-slate-500 text-xs font-semibold">{input.unit}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {input.description && (
                    <p className="mt-1.5 text-xs text-slate-500">{input.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Outputs & Lead Capture */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Calculated Projection
            </h3>

            {isGateBefore ? (
              /* Gated Pre-results view */
              <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 mb-4">
                  <Lock className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  {gateConfig.headline || "Unlock Your Full Calculation"}
                </h4>
                <p className="mt-1 text-xs text-slate-600 mb-6">
                  {gateConfig.subheadline || "Enter your email to instantly reveal detailed ROI and projection metrics."}
                </p>

                <form onSubmit={handleLeadSubmit} className="space-y-3 text-left">
                  {gateConfig.requireName && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <User className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={leadForm.name}
                          onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                          placeholder="Jane Doe"
                          className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        placeholder="you@company.com"
                        className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  {gateConfig.requirePhone && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Phone className="h-4 w-4" />
                        </div>
                        <input
                          type="tel"
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <p className="text-xs font-medium text-red-600">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center space-x-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-700 transition-colors disabled:opacity-50 mt-2"
                  >
                    <span>{isSubmitting ? "Unlocking..." : (gateConfig.buttonLabel || "Reveal Instant Results")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    {gateConfig.privacyText || "100% private. No spam ever."}
                  </p>
                </form>
              </div>
            ) : (
              /* Unlocked Results View */
              <div className="space-y-4">
                {evaluatedOutputs.map((output) => {
                  const isHighlighted = output.highlight;

                  return (
                    <div
                      key={output.id}
                      className={`rounded-xl p-5 transition-all ${
                        isHighlighted
                          ? "bg-gradient-to-br from-brand-600 to-indigo-700 text-white shadow-lg shadow-brand-500/25"
                          : "border border-slate-200 bg-slate-50/50 text-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isHighlighted ? "text-indigo-100" : "text-slate-500"}`}>
                          {output.label}
                        </span>
                        {isHighlighted && (
                          <span className="flex items-center space-x-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                            <Sparkles className="h-3 w-3" />
                            <span>Primary Outcome</span>
                          </span>
                        )}
                      </div>

                      <div className={`mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl ${isHighlighted ? "text-white" : "text-slate-900"}`}>
                        {output.formatted}
                      </div>

                      {output.description && (
                        <p className={`mt-2 text-xs leading-relaxed ${isHighlighted ? "text-indigo-100" : "text-slate-500"}`}>
                          {output.description}
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* Post-results lead capture if configured */}
                {gateConfig?.enabled && gateConfig.timing === "after_results" && !submittedSuccess && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 mt-4">
                    <h4 className="text-sm font-bold text-slate-800">
                      {gateConfig.headline || "Want a copy of this calculation?"}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 mb-3">
                      {gateConfig.subheadline || "We'll email you this full personalized report with recommendations."}
                    </p>

                    <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          required
                          value={leadForm.email}
                          onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                          placeholder="Enter your email..."
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
                        >
                          {isSubmitting ? "Sending..." : (gateConfig.buttonLabel || "Send Report")}
                        </button>
                      </div>
                      {submitError && <p className="text-xs text-red-600">{submitError}</p>}
                    </form>
                  </div>
                )}

                {submittedSuccess && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 flex items-center space-x-2 text-xs font-semibold">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span>Report delivered to {leadForm.email}! Check your inbox.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Viral Footer Badge */}
          {showBadge && (
            <div className="mt-8 border-t border-slate-100 pt-4 text-center">
              <a
                href={process.env.NEXT_PUBLIC_APP_URL || "https://leadcalc.ai"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors"
              >
                <span>Powered by</span>
                <span className="font-bold text-slate-700 hover:text-brand-600">LeadCalc AI</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
