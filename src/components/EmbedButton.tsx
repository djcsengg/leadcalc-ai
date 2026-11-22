"use client";

import React, { useState } from "react";
import { Code2 } from "lucide-react";
import { EmbedCodeModal } from "./EmbedCodeModal";

interface EmbedButtonProps {
  slug: string;
  title: string;
  className?: string;
}

export function EmbedButton({ slug, title, className }: EmbedButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ||
          "inline-flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
        }
      >
        <Code2 className="h-3.5 w-3.5 text-brand-600" />
        <span>Embed on Website</span>
      </button>

      <EmbedCodeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        slug={slug}
        title={title}
      />
    </>
  );
}
