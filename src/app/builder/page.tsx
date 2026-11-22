"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CalculatorRenderer } from "@/components/CalculatorRenderer";
import { EmbedCodeModal } from "@/components/EmbedCodeModal";
import { getStarterTemplates } from "@/lib/gemini";
import {
  CalculatorSchema,
  CalculatorStyling,
  GateConfig,
  CalculatorInput,
  CalculatorOutput,
} from "@/types/calculator";
import {
  Sparkles,
  Save,
  Sliders,
  Calculator,
  Lock,
  Palette,
  Eye,
  Plus,
  Trash2,
  RefreshCw,
  Share2,
} from "lucide-react";

function BuilderContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";

  const templates = getStarterTemplates();
  const [schema, setSchema] = useState<CalculatorSchema>(templates[0].schema);
  const [styling, setStyling] = useState<CalculatorStyling>({
    primaryColor: "#4f46e5",
    accentColor: "#6366f1",
    theme: "light",
    borderRadius: "lg",
    showBadge: true,
    buttonText: "Calculate",
  });
  const [gateConfig, setGateConfig] = useState<GateConfig>({
    enabled: true,
    timing: "before_results",
    headline: "Unlock Your Personalized Full Report",
    subheadline: "Enter your details to reveal complete 10-year calculations.",
    requireName: true,
    requireEmail: true,
    requirePhone: false,
    buttonLabel: "Reveal Instant Results",
    privacyText: "We value your privacy. No spam ever.",
  });

  const [aiPrompt, setAiPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessSlug, setSaveSuccessSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "inputs" | "outputs" | "gate" | "styling">("general");

  useEffect(() => {
    if (initialPrompt) {
      handleGenerateAI(initialPrompt);
    }
  }, [initialPrompt]);

  const handleGenerateAI = async (promptToUse?: string) => {
    const p = promptToUse || aiPrompt;
    if (!p.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p.trim() }),
      });

      if (!res.ok) throw new Error("Failed to generate with AI");
      const data = await res.json();
      if (data.schema) {
        setSchema(data.schema);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/calculators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: schema.title,
          description: schema.description,
          category: "custom",
          schema,
          styling,
          gateConfig,
          isPublished: true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save calculator");
      }

      const data = await res.json();
      setSaveSuccessSlug(data.calculator.slug);
      setIsModalOpen(true);
    } catch (err: any) {
      alert(err.message || "Error saving calculator");
    } finally {
      setIsSaving(false);
    }
  };

  const addInput = () => {
    const id = `input_${Date.now().toString(36).substring(3, 7)}`;
    const newInput: CalculatorInput = {
      id,
      label: "New Parameter",
      type: "slider",
      min: 10,
      max: 500,
      step: 10,
      defaultValue: 100,
      prefix: "$",
    };
    setSchema({ ...schema, inputs: [...schema.inputs, newInput] });
  };

  const removeInput = (index: number) => {
    const updated = [...schema.inputs];
    updated.splice(index, 1);
    setSchema({ ...schema, inputs: updated });
  };

  const updateInput = (index: number, field: string, value: any) => {
    const updated = [...schema.inputs];
    updated[index] = { ...updated[index], [field]: value };
    setSchema({ ...schema, inputs: updated });
  };

  const addOutput = () => {
    const id = `out_${Date.now().toString(36).substring(3, 7)}`;
    const newOutput: CalculatorOutput = {
      id,
      label: "Projected Outcome",
      formula: schema.inputs[0] ? `${schema.inputs[0].id} * 12` : "100",
      format: "currency",
      highlight: false,
    };
    setSchema({ ...schema, outputs: [...schema.outputs, newOutput] });
  };

  const removeOutput = (index: number) => {
    const updated = [...schema.outputs];
    updated.splice(index, 1);
    setSchema({ ...schema, outputs: updated });
  };

  const updateOutput = (index: number, field: string, value: any) => {
    const updated = [...schema.outputs];
    updated[index] = { ...updated[index], [field]: value };
    setSchema({ ...schema, outputs: updated });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Top Action Bar */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          {/* AI Generator Bar */}
          <div className="flex flex-1 items-center space-x-2 min-w-[320px]">
            <div className="relative flex-1">
              <Sparkles className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-brand-600" />
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your formula (e.g., Marketing ROI or HVAC savings)"
                className="w-full rounded-lg border border-slate-300 py-1.5 pl-9 pr-3 text-xs font-medium placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <button
              onClick={() => handleGenerateAI()}
              disabled={isGenerating || !aiPrompt.trim()}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 disabled:opacity-50 transition-colors border border-brand-200"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              <span>{isGenerating ? "Generating..." : "Generate AI"}</span>
            </button>
          </div>

          {/* Save & Publish */}
          <div className="flex items-center space-x-3">
            {saveSuccessSlug && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5 text-brand-600" />
                <span>Embed Code</span>
              </button>
            )}
            <button
              onClick={handleSaveAndPublish}
              disabled={isSaving}
              className="inline-flex items-center space-x-2 rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save & Publish"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio View: Split Screen */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side: Customization Studio Controls */}
        <div className="lg:col-span-5 border-r border-slate-200 bg-white overflow-y-auto max-h-[calc(100vh-8rem)] p-4 sm:p-6">
          {/* Navigation Sub-Tabs */}
          <div className="flex space-x-1 rounded-xl bg-slate-100 p-1 mb-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === "general" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("inputs")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === "inputs" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Inputs ({schema.inputs.length})
            </button>
            <button
              onClick={() => setActiveTab("outputs")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === "outputs" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Outputs ({schema.outputs.length})
            </button>
            <button
              onClick={() => setActiveTab("gate")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === "gate" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Lead Gate
            </button>
            <button
              onClick={() => setActiveTab("styling")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === "styling" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Theme
            </button>
          </div>

          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Calculator Title</label>
                <input
                  type="text"
                  value={schema.title}
                  onChange={(e) => setSchema({ ...schema, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Subhead</label>
                <textarea
                  rows={3}
                  value={schema.description}
                  onChange={(e) => setSchema({ ...schema, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Inputs Tab */}
          {activeTab === "inputs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Input Controls</span>
                <button
                  onClick={addInput}
                  className="inline-flex items-center space-x-1 rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Input</span>
                </button>
              </div>

              <div className="space-y-4">
                {schema.inputs.map((inp, idx) => (
                  <div key={inp.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 relative space-y-3">
                    <button
                      onClick={() => removeInput(idx)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600">ID (Variable Name)</label>
                        <input
                          type="text"
                          value={inp.id}
                          onChange={(e) => updateInput(idx, "id", e.target.value)}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600">Type</label>
                        <select
                          value={inp.type}
                          onChange={(e) => updateInput(idx, "type", e.target.value)}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        >
                          <option value="slider">Slider</option>
                          <option value="number">Number Input</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600">Display Label</label>
                      <input
                        type="text"
                        value={inp.label}
                        onChange={(e) => updateInput(idx, "label", e.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500">Min</label>
                        <input
                          type="number"
                          value={inp.min ?? 0}
                          onChange={(e) => updateInput(idx, "min", Number(e.target.value))}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Max</label>
                        <input
                          type="number"
                          value={inp.max ?? 100}
                          onChange={(e) => updateInput(idx, "max", Number(e.target.value))}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Step</label>
                        <input
                          type="number"
                          value={inp.step ?? 1}
                          onChange={(e) => updateInput(idx, "step", Number(e.target.value))}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Default</label>
                        <input
                          type="number"
                          value={inp.defaultValue}
                          onChange={(e) => updateInput(idx, "defaultValue", Number(e.target.value))}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500">Prefix (e.g. $)</label>
                        <input
                          type="text"
                          value={inp.prefix || ""}
                          onChange={(e) => updateInput(idx, "prefix", e.target.value)}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Unit (e.g. hrs, %)</label>
                        <input
                          type="text"
                          value={inp.unit || ""}
                          onChange={(e) => updateInput(idx, "unit", e.target.value)}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outputs Tab */}
          {activeTab === "outputs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Computed Outputs</span>
                <button
                  onClick={addOutput}
                  className="inline-flex items-center space-x-1 rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Output</span>
                </button>
              </div>

              <div className="space-y-4">
                {schema.outputs.map((out, idx) => (
                  <div key={out.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 relative space-y-3">
                    <button
                      onClick={() => removeOutput(idx)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600">ID</label>
                        <input
                          type="text"
                          value={out.id}
                          onChange={(e) => updateOutput(idx, "id", e.target.value)}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600">Format</label>
                        <select
                          value={out.format}
                          onChange={(e) => updateOutput(idx, "format", e.target.value)}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        >
                          <option value="currency">Currency ($)</option>
                          <option value="number">Number</option>
                          <option value="percentage">Percentage (%)</option>
                          <option value="years">Years</option>
                          <option value="months">Months</option>
                          <option value="days">Days</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600">Label</label>
                      <input
                        type="text"
                        value={out.label}
                        onChange={(e) => updateOutput(idx, "label", e.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600">Math Formula</label>
                      <input
                        type="text"
                        value={out.formula}
                        onChange={(e) => updateOutput(idx, "formula", e.target.value)}
                        placeholder="e.g. monthlyBill * 12 * 0.85"
                        className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-mono bg-white text-brand-700 font-semibold"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Available variables: {schema.inputs.map(i => i.id).join(", ")}</p>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id={`highlight-${out.id}`}
                        checked={out.highlight || false}
                        onChange={(e) => updateOutput(idx, "highlight", e.target.checked)}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <label htmlFor={`highlight-${out.id}`} className="text-xs text-slate-700 font-medium">
                        Highlight as Primary Key Outcome
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lead Gate Tab */}
          {activeTab === "gate" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Lead Capture Gate</span>
                  <span className="text-[11px] text-slate-500">Collect visitor info to unlock calculations</span>
                </div>
                <input
                  type="checkbox"
                  checked={gateConfig.enabled}
                  onChange={(e) => setGateConfig({ ...gateConfig, enabled: e.target.checked })}
                  className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </div>

              {gateConfig.enabled && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gate Timing</label>
                    <select
                      value={gateConfig.timing}
                      onChange={(e) => setGateConfig({ ...gateConfig, timing: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    >
                      <option value="before_results">Before Results (Hard Gate - highest lead conversion)</option>
                      <option value="after_results">After Results (Soft Gate - email full report)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                    <input
                      type="text"
                      value={gateConfig.headline}
                      onChange={(e) => setGateConfig({ ...gateConfig, headline: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subheadline</label>
                    <input
                      type="text"
                      value={gateConfig.subheadline || ""}
                      onChange={(e) => setGateConfig({ ...gateConfig, subheadline: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="req-name"
                        checked={gateConfig.requireName}
                        onChange={(e) => setGateConfig({ ...gateConfig, requireName: e.target.checked })}
                        className="rounded border-slate-300 text-brand-600"
                      />
                      <label htmlFor="req-name" className="text-xs text-slate-700 font-medium">Require Name</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="req-phone"
                        checked={gateConfig.requirePhone}
                        onChange={(e) => setGateConfig({ ...gateConfig, requirePhone: e.target.checked })}
                        className="rounded border-slate-300 text-brand-600"
                      />
                      <label htmlFor="req-phone" className="text-xs text-slate-700 font-medium">Require Phone Number</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Styling Tab */}
          {activeTab === "styling" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Brand Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={styling.primaryColor}
                    onChange={(e) => setStyling({ ...styling, primaryColor: e.target.value })}
                    className="h-9 w-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={styling.primaryColor}
                    onChange={(e) => setStyling({ ...styling, primaryColor: e.target.value })}
                    className="w-32 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">LeadCalc AI Badge</span>
                    <span className="text-[11px] text-slate-500">Toggle "Powered by LeadCalc AI" footer badge (Pro feature)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={styling.showBadge}
                    onChange={(e) => setStyling({ ...styling, showBadge: e.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 text-brand-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Interactive Reactive Preview */}
        <div className="lg:col-span-7 bg-slate-100/70 p-4 sm:p-8 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Eye className="h-4 w-4 text-brand-600" />
                <span>Real-Time Reactive Preview</span>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                Live Engine Active
              </span>
            </div>

            <CalculatorRenderer
              schema={schema}
              styling={styling}
              gateConfig={gateConfig}
            />
          </div>
        </div>
      </div>

      {/* Embed Code Modal */}
      {saveSuccessSlug && (
        <EmbedCodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          slug={saveSuccessSlug}
          title={schema.title}
        />
      )}
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading AI builder studio...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
