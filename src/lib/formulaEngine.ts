import { create, all } from "mathjs";
import {
  CalculatorSchema,
  EvaluatedOutput,
  OutputFormat,
} from "@/types/calculator";

// Initialize a sandboxed mathjs instance with math functions
const math = create(all, {});

// Limit functions to safe mathematical operations
const safeMathScope = {
  min: Math.min,
  max: Math.max,
  abs: Math.abs,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
  sqrt: Math.sqrt,
  pow: Math.pow,
  log: Math.log,
};

// Disallowed tokens to prevent prototype pollution or code execution
const FORBIDDEN_TOKENS = /\b(constructor|__proto__|prototype|import|eval|window|document|process|global|require|Function|Reflect|Proxy)\b/i;

/**
 * Validates and sanitizes a math formula string before compilation.
 * Returns null if the formula violates safety policies.
 */
export function sanitizeFormula(formula: string): string | null {
  if (!formula || typeof formula !== "string") {
    return null;
  }

  const trimmed = formula.trim();

  // Reject excessively long formulas to prevent ReDoS / CPU exhaustion
  if (trimmed.length > 500) {
    return null;
  }

  // Reject forbidden keywords and prototype access
  if (FORBIDDEN_TOKENS.test(trimmed)) {
    return null;
  }

  // Reject JavaScript code structures: brackets, braces, semicolons, backticks, quotes
  if (/[[\]{};`"'\\$]/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * Safely evaluates a math formula string using a scope of variables.
 */
export function evaluateFormula(
  formula: string,
  scope: Record<string, any>
): number {
  const sanitized = sanitizeFormula(formula);
  if (!sanitized) {
    return 0;
  }

  // Pre-process formula: normalize percentages (e.g., "rate%" -> "(rate / 100)")
  const cleanFormula = sanitized
    .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*%/g, "($1 / 100)")
    .replace(/(\d+)%/g, "($1 / 100)");

  try {
    // Merge scope with safe math functions
    const evalScope: Record<string, any> = { ...safeMathScope };

    // Convert string numbers in scope to numbers and exclude forbidden keys
    for (const key of Object.keys(scope || {})) {
      if (FORBIDDEN_TOKENS.test(key)) continue;
      const val = scope[key];
      if (typeof val === "string" && !isNaN(Number(val))) {
        evalScope[key] = Number(val);
      } else if (typeof val === "number" && isFinite(val)) {
        evalScope[key] = val;
      }
    }

    const compiled = math.compile(cleanFormula);
    const result = compiled.evaluate(evalScope);

    if (typeof result !== "number" || isNaN(result) || !isFinite(result)) {
      return 0;
    }

    return result;
  } catch {
    // Gracefully handle math syntax errors, division by zero, or undefined symbols
    return 0;
  }
}

/**
 * Formats a numeric output according to its format specification.
 */
export function formatOutputValue(
  value: number,
  format: OutputFormat,
  options: {
    prefix?: string;
    unit?: string;
    decimals?: number;
  } = {}
): string {
  const { prefix = "", unit = "", decimals } = options;

  if (isNaN(value) || !isFinite(value)) {
    return "0";
  }

  const maxDecimals = decimals !== undefined ? decimals : 2;
  const minDecimals = decimals !== undefined ? decimals : 0;

  switch (format) {
    case "currency": {
      const p = prefix || "$";
      const formattedNum = value.toLocaleString("en-US", {
        minimumFractionDigits: decimals !== undefined ? decimals : value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: maxDecimals,
      });
      return `${p}${formattedNum}${unit ? ` ${unit}` : ""}`;
    }

    case "percentage": {
      const formattedNum = value.toLocaleString("en-US", {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals,
      });
      return `${prefix}${formattedNum}%${unit ? ` ${unit}` : ""}`;
    }

    case "years": {
      const formattedNum = value.toLocaleString("en-US", {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals,
      });
      const u = unit || (value === 1 ? "year" : "years");
      return `${prefix}${formattedNum} ${u}`.trim();
    }

    case "months": {
      const formattedNum = value.toLocaleString("en-US", {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals,
      });
      const u = unit || (value === 1 ? "month" : "months");
      return `${prefix}${formattedNum} ${u}`.trim();
    }

    case "days": {
      const formattedNum = value.toLocaleString("en-US", {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals,
      });
      const u = unit || (value === 1 ? "day" : "days");
      return `${prefix}${formattedNum} ${u}`.trim();
    }

    case "number":
    case "custom":
    default: {
      const formattedNum = value.toLocaleString("en-US", {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals,
      });
      return `${prefix}${formattedNum}${unit ? ` ${unit}` : ""}`.trim();
    }
  }
}

/**
 * Evaluates all outputs for a given calculator schema and input values.
 * Allows downstream outputs to reference earlier outputs.
 */
export function evaluateCalculator(
  schema: CalculatorSchema,
  inputs: Record<string, number | string>
): EvaluatedOutput[] {
  const scope: Record<string, any> = { ...inputs };
  const evaluatedOutputs: EvaluatedOutput[] = [];

  for (const output of schema.outputs) {
    const rawVal = evaluateFormula(output.formula, scope);

    // Save into scope so subsequent formulas can reference this output by ID
    scope[output.id] = rawVal;

    const formatted = formatOutputValue(rawVal, output.format, {
      prefix: output.prefix,
      unit: output.unit,
      decimals: output.decimals,
    });

    evaluatedOutputs.push({
      id: output.id,
      label: output.label,
      value: rawVal,
      formatted,
      highlight: output.highlight,
      description: output.description,
    });
  }

  return evaluatedOutputs;
}
