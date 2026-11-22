import { describe, it, expect } from "vitest";
import { generateCalculatorSchema, getStarterTemplates } from "../src/lib/gemini";

describe("AI Generator & Templates", () => {
  it("returns starter templates properly", () => {
    const templates = getStarterTemplates();
    expect(templates.length).toBeGreaterThanOrEqual(4);
    for (const t of templates) {
      expect(t.schema.title).toBeTruthy();
      expect(t.schema.inputs.length).toBeGreaterThan(0);
      expect(t.schema.outputs.length).toBeGreaterThan(0);
    }
  });

  it("generates calculator schema for solar prompt", async () => {
    const schema = await generateCalculatorSchema("Solar panel savings for homeowners");
    expect(schema.title).toContain("Solar");
    expect(schema.inputs.length).toBeGreaterThan(0);
    expect(schema.outputs.length).toBeGreaterThan(0);
  });

  it("generates calculator schema for freelance hourly rate", async () => {
    const schema = await generateCalculatorSchema("Freelance hourly rate consultant");
    expect(schema.title).toContain("Freelance");
    expect(schema.inputs.length).toBeGreaterThan(0);
  });

  it("generates custom schema for an arbitrary prompt", async () => {
    const schema = await generateCalculatorSchema("Custom manufacturing defect reduction ROI");
    expect(schema.title).toBeTruthy();
    expect(schema.inputs.length).toBeGreaterThan(0);
    expect(schema.outputs.length).toBeGreaterThan(0);
  });
});
