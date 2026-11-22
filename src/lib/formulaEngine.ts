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

/**
 * Safely evaluates a math formula string using a scope of variables.
 */
export function evaluateFormula(
  formula: string,
  scope: Record<string, any>
): number {
  if (!formula || typeof formula !== "string") {
    return 0;
  }

  // Pre-process formula: normalize multiplication, sanitize
  const cleanFormula = formula
    .trim()
    .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*%/g, "($1 / 100)") // handle var%
    .replace(/(\d+)%/g, "($1 / 100)"); // handle 15%

  try {
    // Merge scope with safe math functions
    const evalScope: Record<string, any> = { ...safeMathScope, ...scope };

    // Convert string numbers in scope to numbers
    for (const key of Object.keys(evalScope)) {
      if (typeof evalScope[key] === "string" && !isNaN(Number(evalScope[key]))) {
        evalScope[key] = Number(evalScope[key]);
      }
    }

    const compiled = math.compile(cleanFormula);
    const result = compiled.evaluate(evalScope);

    if (typeof result !== "number" || isNaN(result) || !isFinite(result)) {
      return 0;
    }

    return result;
  } catch (err) {
    console.warn(`Formula evaluation error for "${formula}":`, err);
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
