"use client";

import React, { useState } from "react";
import { Copy, Check, X, Code2, Share2, Layers } from "lucide-react";

interface EmbedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  title: string;
}

export function EmbedCodeModal({
  isOpen,
  onClose,
  slug,
  title,
}: EmbedCodeModalProps) {
  const [activeTab, setActiveTab] = useState<"script" | "iframe" | "link">("script");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://leadcalc.ai";
  const shareUrl = `${appUrl}/c/${slug}`;
  const iframeUrl = `${appUrl}/embed/${slug}`;

  const scriptSnippet = `<div id="leadcalc-embed" data-calc="${slug}">\n  <a href="${appUrl}/?utm_source=embed_snippet&utm_medium=referral&utm_campaign=viral_loop&ref=${slug}" target="_blank" rel="noopener" style="font-family:sans-serif;font-size:12px;color:#64748b;text-decoration:none;">⚡ Powered by LeadCalc AI</a>\n</div>\n<script src="${appUrl}/embed.js" async></script>`;
  const iframeSnippet = `<iframe\n  src="${iframeUrl}"\n  width="100%"\n  height="650"\n  frameborder="0"\n  sandbox="allow-scripts allow-forms allow-same-origin allow-popups"\n  loading="lazy"\n  style="border:none; border-radius: 12px; overflow: hidden;"\n  title="${title}"\n></iframe>\n<p style="text-align:center; margin-top:4px; font-family:sans-serif; font-size:11px; color:#64748b;">\n  <a href="${appUrl}/?utm_source=iframe_snippet&utm_medium=referral&utm_campaign=viral_loop&ref=${slug}" target="_blank" rel="noopener" style="color:#64748b; text-decoration:none;">⚡ Powered by LeadCalc AI</a>\n</p>`;

  const currentSnippet =
    activeTab === "script"
      ? scriptSnippet
      : activeTab === "iframe"
      ? iframeSnippet
      : shareUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Embed & Share Calculator</h3>
            <p className="text-xs text-slate-500">"{title}"</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex space-x-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("script")}
            className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "script"
                ? "bg-brand-50 text-brand-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>Script Tag (Recommended)</span>
          </button>
          <button
            onClick={() => setActiveTab("iframe")}
            className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "iframe"
                ? "bg-brand-50 text-brand-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>iFrame</span>
          </button>
          <button
            onClick={() => setActiveTab("link")}
            className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "link"
                ? "bg-brand-50 text-brand-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Direct Link</span>
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="relative mt-4">
          <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200">
            {currentSnippet}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute right-3 top-3 inline-flex items-center space-x-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/20 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
          {activeTab === "script"
            ? "Paste this HTML snippet into Webflow, WordPress, Framer, Shopify, or any custom website."
            : activeTab === "iframe"
            ? "Use this iframe snippet for Notion pages, website builders, or environments that restrict scripts."
            : "Share this link directly on social media (LinkedIn, Twitter/X, email newsletters)."}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
