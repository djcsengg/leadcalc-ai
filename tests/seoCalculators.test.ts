import { describe, it, expect } from "vitest";
import {
  getAllSeoCalculators,
  getSeoCalculatorBySlug,
  getSeoCategories,
  getAllKeywords,
} from "../src/data/seoCalculators";
import { evaluateCalculator } from "../src/lib/formulaEngine";

describe("SEO Calculators Data & Formulas", () => {
  it("loads all programmatic SEO calculators", () => {
    const calculators = getAllSeoCalculators();
    expect(calculators.length).toBeGreaterThanOrEqual(10);
  });

  it("verifies all SEO categories are populated", () => {
    const categories = getSeoCategories();
    expect(categories.length).toBe(4);
    categories.forEach((cat) => {
      expect(cat.count).toBeGreaterThan(0);
      expect(cat.name).toBeTruthy();
      expect(cat.description).toBeTruthy();
    });
  });

  it("ensures every SEO calculator has metadata, keywords, and longform guide", () => {
    const calculators = getAllSeoCalculators();
    for (const calc of calculators) {
      expect(calc.slug).toBeTruthy();
      expect(calc.title).toBeTruthy();
      expect(calc.metaTitle).toBeTruthy();
      expect(calc.metaDescription).toBeTruthy();
      expect(calc.targetKeywords.length).toBeGreaterThanOrEqual(3);
      expect(calc.searchVolume).toBeTruthy();
      expect(calc.longFormGuide.overview).toBeTruthy();
      expect(calc.longFormGuide.formulaExplanation).toBeTruthy();
      expect(calc.longFormGuide.faqs.length).toBeGreaterThan(0);
      expect(calc.longFormGuide.industryBenchmarks.length).toBeGreaterThan(0);
    }
  });

  it("verifies every calculator formula evaluates cleanly with default inputs", () => {
    const calculators = getAllSeoCalculators();
    for (const calc of calculators) {
      const defaultInputs: Record<string, number | string> = {};
      calc.schema.inputs.forEach((input) => {
        defaultInputs[input.id] = input.defaultValue;
      });

      const results = evaluateCalculator(calc.schema, defaultInputs);
      expect(results.length).toBe(calc.schema.outputs.length);

      results.forEach((output) => {
        expect(output.formatted).toBeTruthy();
        expect(output.formatted).not.toContain("NaN");
        expect(output.formatted).not.toContain("undefined");
      });
    }
  });

  it("retrieves individual calculators by slug", () => {
    const solar = getSeoCalculatorBySlug("solar-roi");
    expect(solar).toBeDefined();
    expect(solar?.title).toBe("Solar Panel ROI & Savings Calculator");

    const churn = getSeoCalculatorBySlug("saas-churn-rate");
    expect(churn).toBeDefined();
    expect(churn?.categorySlug).toBe("saas");
  });

  it("aggregates all target keywords with volumes", () => {
    const keywords = getAllKeywords();
    expect(keywords.length).toBeGreaterThanOrEqual(30);
    expect(keywords[0].keyword).toBeTruthy();
    expect(keywords[0].volume).toBeTruthy();
  });
});
