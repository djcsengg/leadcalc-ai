import { describe, it, expect } from "vitest";
import {
  evaluateFormula,
  formatOutputValue,
  evaluateCalculator,
} from "../src/lib/formulaEngine";
import { CalculatorSchema } from "../src/types/calculator";

describe("Formula Engine", () => {
  it("evaluates basic arithmetic expressions", () => {
    expect(evaluateFormula("a + b", { a: 10, b: 20 })).toBe(30);
    expect(evaluateFormula("a * b - c", { a: 5, b: 4, c: 2 })).toBe(18);
    expect(evaluateFormula("(a + b) / 2", { a: 10, b: 20 })).toBe(15);
  });

  it("handles percentages correctly", () => {
    expect(evaluateFormula("revenue * 20%", { revenue: 1000 })).toBe(200);
    expect(evaluateFormula("revenue * (1 - taxRate / 100)", { revenue: 1000, taxRate: 30 })).toBe(700);
  });

  it("handles math functions safely", () => {
    expect(evaluateFormula("min(a, b)", { a: 10, b: 5 })).toBe(5);
    expect(evaluateFormula("max(a, b)", { a: 10, b: 5 })).toBe(10);
    expect(evaluateFormula("round(a / b)", { a: 10, b: 3 })).toBe(3);
    expect(evaluateFormula("sqrt(a)", { a: 16 })).toBe(4);
  });

  it("safely handles division by zero and invalid formulas without crashing", () => {
    expect(evaluateFormula("a / b", { a: 10, b: 0 })).toBe(0);
    expect(evaluateFormula("invalid syntax !!!", {})).toBe(0);
    expect(evaluateFormula("", {})).toBe(0);
  });

  it("formats outputs correctly across all supported types", () => {
    expect(formatOutputValue(12500, "currency")).toBe("$12,500");
    expect(formatOutputValue(12.5, "percentage")).toBe("12.5%");
    expect(formatOutputValue(3.5, "years")).toBe("3.5 years");
    expect(formatOutputValue(1, "years")).toBe("1 year");
    expect(formatOutputValue(6, "months")).toBe("6 months");
    expect(formatOutputValue(14, "days")).toBe("14 days");
    expect(formatOutputValue(1500, "number")).toBe("1,500");
  });

  it("evaluates a full calculator schema with chained outputs", () => {
    const schema: CalculatorSchema = {
      title: "Test ROI Calculator",
      description: "Test description",
      inputs: [
        { id: "leads", label: "Monthly Leads", type: "slider", defaultValue: 100 },
        { id: "cvr", label: "Conversion Rate %", type: "slider", defaultValue: 5 },
        { id: "acv", label: "Deal Size ($)", type: "number", defaultValue: 2000 },
      ],
      outputs: [
        {
          id: "deals",
          label: "Deals Closed",
          formula: "leads * (cvr / 100)",
          format: "number",
        },
        {
          id: "revenue",
          label: "Monthly Revenue",
          formula: "deals * acv", // chained from "deals"!
          format: "currency",
          highlight: true,
        },
        {
          id: "annualRevenue",
          label: "Annual Revenue",
          formula: "revenue * 12", // chained from "revenue"!
          format: "currency",
        },
      ],
    };

    const results = evaluateCalculator(schema, { leads: 200, cvr: 10, acv: 1500 });

    expect(results).toHaveLength(3);
    expect(results[0].value).toBe(20);
    expect(results[0].formatted).toBe("20");
    expect(results[1].value).toBe(30000);
    expect(results[1].formatted).toBe("$30,000");
    expect(results[2].value).toBe(360000);
    expect(results[2].formatted).toBe("$360,000");
  });

  it("handles custom prefix, units, decimals, and string number inputs in scope", () => {
    expect(
      formatOutputValue(1234.567, "currency", { prefix: "€", decimals: 2 })
    ).toBe("€1,234.57");

    expect(
      formatOutputValue(98.7654, "percentage", { decimals: 1 })
    ).toBe("98.8%");

    expect(
      formatOutputValue(42, "custom", { prefix: "ROI: ", unit: "x" })
    ).toBe("ROI: 42 x");

    // String number in scope should be converted to numeric during evaluation
    expect(evaluateFormula("price * qty", { price: "25.5", qty: "4" })).toBe(102);
  });

  it("sanitizes formulas and blocks code injection and prototype pollution", () => {
    // Blocks constructor / prototype access
    expect(evaluateFormula("constructor.constructor('return 1')()", {})).toBe(0);
    expect(evaluateFormula("__proto__.polluted = 1", {})).toBe(0);
    expect(evaluateFormula("prototype.evil", {})).toBe(0);

    // Blocks JavaScript statements and structures
    expect(evaluateFormula("1 + 1; console.log('hacked')", {})).toBe(0);
    expect(evaluateFormula("[1, 2, 3].reduce((a,b)=>a+b)", {})).toBe(0);
    expect(evaluateFormula("{ a: 10 }.a", {})).toBe(0);

    // Blocks overly long formulas
    const hugeFormula = "1 + " + "1 + ".repeat(200) + "1";
    expect(evaluateFormula(hugeFormula, {})).toBe(0);

    // Valid mathematical expressions continue to work
    expect(evaluateFormula("(a * b) / (c + 1)", { a: 10, b: 5, c: 1 })).toBe(25);
  });
});
