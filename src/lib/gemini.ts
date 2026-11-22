import { GoogleGenerativeAI } from "@google/generative-ai";
import { CalculatorSchema } from "@/types/calculator";

const TEMPLATES: Record<string, CalculatorSchema> = {
  solar: {
    title: "Solar Panel ROI & Savings Calculator",
    description: "Calculate your 10-year electricity savings, system payoff period, and net ROI from installing solar panels.",
    inputs: [
      {
        id: "monthlyBill",
        label: "Average Monthly Electricity Bill",
        type: "slider",
        min: 50,
        max: 800,
        step: 10,
        defaultValue: 200,
        prefix: "$",
      },
      {
        id: "sunHours",
        label: "Average Daily Sun Peak Hours",
        type: "slider",
        min: 3,
        max: 8,
        step: 0.5,
        defaultValue: 5,
        unit: "hours",
      },
      {
        id: "systemCost",
        label: "Estimated System Installation Cost",
        type: "number",
        min: 5000,
        max: 40000,
        step: 500,
        defaultValue: 16000,
        prefix: "$",
      },
      {
        id: "taxCreditPercent",
        label: "Federal/State Tax Incentive",
        type: "slider",
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 30,
        unit: "%",
      },
    ],
    outputs: [
      {
        id: "netCost",
        label: "Net System Cost (After Tax Credits)",
        formula: "systemCost * (1 - taxCreditPercent / 100)",
        format: "currency",
        highlight: false,
      },
      {
        id: "annualSavings",
        label: "Annual Energy Savings",
        formula: "monthlyBill * 12 * 0.85",
        format: "currency",
        highlight: false,
      },
      {
        id: "paybackYears",
        label: "Estimated Payback Period",
        formula: "netCost / annualSavings",
        format: "years",
        decimals: 1,
        highlight: false,
      },
      {
        id: "twentyYearNetSavings",
        label: "20-Year Net Lifetime Profit",
        formula: "(annualSavings * 20) - netCost",
        format: "currency",
        highlight: true,
      },
    ],
  },
  freelancer: {
    title: "Freelance Hourly Rate & Target Income Calculator",
    description: "Determine what you must charge per hour to hit your net take-home income goal after taxes, expenses, and non-billable time.",
    inputs: [
      {
        id: "targetIncome",
        label: "Desired Annual Take-Home Income",
        type: "slider",
        min: 30000,
        max: 300000,
        step: 5000,
        defaultValue: 90000,
        prefix: "$",
      },
      {
        id: "billableHoursPerWeek",
        label: "Billable Client Hours Per Week",
        type: "slider",
        min: 10,
        max: 40,
        step: 1,
        defaultValue: 25,
        unit: "hrs/wk",
      },
      {
        id: "weeksOff",
        label: "Vacation & Sick Weeks Per Year",
        type: "slider",
        min: 2,
        max: 10,
        step: 1,
        defaultValue: 4,
        unit: "weeks",
      },
      {
        id: "businessExpenses",
        label: "Annual Software & Overhead Expenses",
        type: "number",
        min: 1000,
        max: 40000,
        step: 500,
        defaultValue: 6000,
        prefix: "$",
      },
      {
        id: "taxRate",
        label: "Estimated Total Tax Bracket",
        type: "slider",
        min: 15,
        max: 45,
        step: 1,
        defaultValue: 28,
        unit: "%",
      },
    ],
    outputs: [
      {
        id: "grossRevenueNeeded",
        label: "Total Gross Revenue Needed",
        formula: "(targetIncome / (1 - taxRate / 100)) + businessExpenses",
        format: "currency",
        highlight: false,
      },
      {
        id: "totalBillableHours",
        label: "Annual Billable Hours",
        formula: "billableHoursPerWeek * (52 - weeksOff)",
        format: "number",
        unit: "hours",
        decimals: 0,
        highlight: false,
      },
      {
        id: "minimumHourlyRate",
        label: "Target Minimum Hourly Rate",
        formula: "grossRevenueNeeded / totalBillableHours",
        format: "currency",
        decimals: 0,
        highlight: true,
      },
      {
        id: "dayRate",
        label: "Recommended Daily Rate (6 hrs)",
        formula: "minimumHourlyRate * 6",
        format: "currency",
        decimals: 0,
        highlight: false,
      },
    ],
  },
  saas: {
    title: "SaaS Churn & Lost Revenue Impact Calculator",
    description: "Quantify the revenue lost to customer churn and calculate the ROI of reducing churn by 1-2%.",
    inputs: [
      {
        id: "mrr",
        label: "Current Monthly Recurring Revenue (MRR)",
        type: "slider",
        min: 5000,
        max: 250000,
        step: 2500,
        defaultValue: 35000,
        prefix: "$",
      },
      {
        id: "monthlyChurnRate",
        label: "Monthly Customer Churn Rate",
        type: "slider",
        min: 1,
        max: 15,
        step: 0.5,
        defaultValue: 4.5,
        unit: "%",
      },
      {
        id: "arpu",
        label: "Average Revenue Per User (ARPU / mo)",
        type: "slider",
        min: 10,
        max: 1000,
        step: 10,
        defaultValue: 120,
        prefix: "$",
      },
    ],
    outputs: [
      {
        id: "monthlyLostRevenue",
        label: "Monthly Lost Revenue to Churn",
        formula: "mrr * (monthlyChurnRate / 100)",
        format: "currency",
        highlight: false,
      },
      {
        id: "annualLostRevenue",
        label: "Annualized Revenue Lost",
        formula: "monthlyLostRevenue * 12",
        format: "currency",
        highlight: true,
      },
      {
        id: "savingsWithOnePercentReduction",
        label: "Annual Gain from 1.5% Churn Reduction",
        formula: "mrr * 0.015 * 12",
        format: "currency",
        highlight: false,
      },
    ],
  },
  marketing: {
    title: "Paid Advertising ROI & Customer Acquisition (CAC) Calculator",
    description: "Estimate customer acquisition cost, break-even conversion rate, and net return on ad spend (ROAS).",
    inputs: [
      {
        id: "adSpend",
        label: "Monthly Ad Budget",
        type: "slider",
        min: 500,
        max: 50000,
        step: 250,
        defaultValue: 3000,
        prefix: "$",
      },
      {
        id: "cpc",
        label: "Average Cost Per Click (CPC)",
        type: "slider",
        min: 0.2,
        max: 10,
        step: 0.1,
        defaultValue: 1.8,
        prefix: "$",
      },
      {
        id: "conversionRate",
        label: "Landing Page Conversion Rate",
        type: "slider",
        min: 0.5,
        max: 10,
        step: 0.1,
        defaultValue: 2.5,
        unit: "%",
      },
      {
        id: "ltv",
        label: "Customer Lifetime Value (LTV)",
        type: "slider",
        min: 50,
        max: 3000,
        step: 25,
        defaultValue: 450,
        prefix: "$",
      },
    ],
    outputs: [
      {
        id: "totalClicks",
        label: "Estimated Traffic / Clicks",
        formula: "adSpend / cpc",
        format: "number",
        decimals: 0,
        highlight: false,
      },
      {
        id: "totalCustomers",
        label: "Acquired Customers",
        formula: "totalClicks * (conversionRate / 100)",
        format: "number",
        decimals: 0,
        highlight: false,
      },
      {
        id: "cac",
        label: "Customer Acquisition Cost (CAC)",
        formula: "adSpend / totalCustomers",
        format: "currency",
        decimals: 0,
        highlight: false,
      },
      {
        id: "netProfit",
        label: "Estimated Net Return (LTV Revenue - Spend)",
        formula: "(totalCustomers * ltv) - adSpend",
        format: "currency",
        decimals: 0,
        highlight: true,
      },
    ],
  },
};

const SYSTEM_INSTRUCTION = `
You are LeadCalc AI, an expert software architect that generates structured JSON schemas for interactive website calculators.
Given a user's prompt or business description, generate a complete interactive calculator definition with:
- title: catchy, professional title
- description: clear 1-2 sentence description explaining what the calculator computes
- inputs: 2-5 user inputs (prefer "slider" or "number" types) with reasonable min, max, step, defaultValue, prefix (e.g. "$"), or unit (e.g. "%", "hrs", "lbs")
- outputs: 2-4 computed outputs with clear labels, a valid mathematical formula using only input IDs and numbers (arithmetic operators +, -, *, /, parenthesis), output format ("currency", "number", "percentage", "years", "months", "days"), and mark the most important output with highlight: true.

Rules:
1. Formulas must ONLY use defined input IDs and numbers. Example: "monthlyBill * 12 * 10 * 0.75".
2. Always return strict valid JSON matching the schema, with no markdown wrapping or code fences.
`;

export async function generateCalculatorSchema(
  prompt: string,
  category: string = "general"
): Promise<CalculatorSchema> {
  const normalizedPrompt = prompt.toLowerCase();

  // 1. Try Gemini API if key is present
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-3.8-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API call timed out after 3.5s")), 3500)
      );

      const generatePromise = model.generateContent(
        `Create an interactive calculator schema for: "${prompt}" (Category: ${category})`
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      const responseText = response.response.text();
      const parsed = JSON.parse(responseText) as CalculatorSchema;

      if (
        parsed &&
        parsed.title &&
        Array.isArray(parsed.inputs) &&
        Array.isArray(parsed.outputs) &&
        parsed.inputs.length > 0 &&
        parsed.outputs.length > 0
      ) {
        return parsed;
      }
    } catch (err) {
      console.warn("Gemini API call failed or timed out, falling back to smart template:", err);
    }
  }

  // 2. Intelligent template matching fallback
  if (normalizedPrompt.includes("solar") || normalizedPrompt.includes("energy") || normalizedPrompt.includes("electric")) {
    return TEMPLATES.solar;
  }
  if (normalizedPrompt.includes("freelance") || normalizedPrompt.includes("hourly") || normalizedPrompt.includes("consultant") || normalizedPrompt.includes("rate")) {
    return TEMPLATES.freelancer;
  }
  if (normalizedPrompt.includes("saas") || normalizedPrompt.includes("churn") || normalizedPrompt.includes("mrr") || normalizedPrompt.includes("subscription")) {
    return TEMPLATES.saas;
  }
  if (normalizedPrompt.includes("ad") || normalizedPrompt.includes("marketing") || normalizedPrompt.includes("cpc") || normalizedPrompt.includes("cac") || normalizedPrompt.includes("roas")) {
    return TEMPLATES.marketing;
  }

  // 3. Dynamic custom template adapted to user prompt
  return {
    title: `${prompt.trim().charAt(0).toUpperCase() + prompt.trim().slice(1)} ROI & Value Calculator`,
    description: `Estimate the projected return on investment, operational savings, and financial impact for ${prompt.trim()}.`,
    inputs: [
      {
        id: "primaryVolume",
        label: "Estimated Monthly Volume / Clients",
        type: "slider",
        min: 10,
        max: 1000,
        step: 10,
        defaultValue: 100,
        unit: "units",
      },
      {
        id: "unitValue",
        label: "Average Transaction / Unit Value",
        type: "slider",
        min: 20,
        max: 2000,
        step: 10,
        defaultValue: 150,
        prefix: "$",
      },
      {
        id: "efficiencyGain",
        label: "Projected Efficiency / Lift Percentage",
        type: "slider",
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 20,
        unit: "%",
      },
    ],
    outputs: [
      {
        id: "currentGross",
        label: "Baseline Monthly Volume Value",
        formula: "primaryVolume * unitValue",
        format: "currency",
        highlight: false,
      },
      {
        id: "monthlyValueLift",
        label: "Projected Monthly Value Lift",
        formula: "currentGross * (efficiencyGain / 100)",
        format: "currency",
        highlight: true,
      },
      {
        id: "annualizedReturn",
        label: "Annualized Net Additional Value",
        formula: "monthlyValueLift * 12",
        format: "currency",
        highlight: false,
      },
    ],
  };
}

export function getStarterTemplates(): { id: string; name: string; description: string; schema: CalculatorSchema }[] {
  return [
    {
      id: "solar",
      name: "Solar Energy ROI Calculator",
      description: "Estimate 10-year electricity savings and solar panel payback period.",
      schema: TEMPLATES.solar,
    },
    {
      id: "freelancer",
      name: "Freelancer Hourly Rate Calculator",
      description: "Determine target hourly rate to hit take-home income goals.",
      schema: TEMPLATES.freelancer,
    },
    {
      id: "saas",
      name: "SaaS Churn & Lost MRR Calculator",
      description: "Analyze lost revenue from customer churn and recovery gains.",
      schema: TEMPLATES.saas,
    },
    {
      id: "marketing",
      name: "Ad Spend ROI & CAC Calculator",
      description: "Calculate customer acquisition cost and net return on ad spend.",
      schema: TEMPLATES.marketing,
    },
  ];
}
