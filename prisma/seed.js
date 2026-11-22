const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const SOLAR_SCHEMA = {
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
      defaultValue: 220,
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
      defaultValue: 18000,
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
};

const FREELANCE_SCHEMA = {
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
      defaultValue: 95000,
      prefix: "$",
    },
    {
      id: "billableHoursPerWeek",
      label: "Billable Client Hours Per Week",
      type: "slider",
      min: 10,
      max: 40,
      step: 1,
      defaultValue: 24,
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
      defaultValue: 7500,
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
};

const DEFAULT_STYLING = {
  primaryColor: "#4f46e5",
  accentColor: "#6366f1",
  theme: "light",
  borderRadius: "lg",
  showBadge: true,
  buttonText: "Calculate & Unlock Full Report",
};

const DEFAULT_GATE = {
  enabled: true,
  timing: "before_results",
  headline: "Get Your Complete Personalized Breakdown",
  subheadline: "Enter your contact details to reveal detailed 10-year calculations and report.",
  requireName: true,
  requireEmail: true,
  requirePhone: false,
  buttonLabel: "Reveal Instant Results",
  privacyText: "We value your privacy. No spam ever.",
};

async function main() {
  console.log("Seeding database...");

  // 1. Create or update Demo User
  const user = await prisma.user.upsert({
    where: { email: "demo@leadcalc.ai" },
    update: {},
    create: {
      email: "demo@leadcalc.ai",
      name: "Alex Rivers",
      planTier: "pro",
    },
  });

  console.log(`User created or verified: ${user.email} (${user.id})`);

  // 2. Create Solar Calculator
  const solarCalc = await prisma.calculator.upsert({
    where: { slug: "solar-roi" },
    update: {},
    create: {
      userId: user.id,
      slug: "solar-roi",
      title: "Solar Panel ROI & Savings Calculator",
      description: "Estimate your 10-year utility bill savings and payoff period.",
      category: "energy",
      schemaJson: JSON.stringify(SOLAR_SCHEMA),
      stylingJson: JSON.stringify(DEFAULT_STYLING),
      gateConfigJson: JSON.stringify(DEFAULT_GATE),
      viewCount: 142,
      isPublished: true,
    },
  });

  // 3. Create Freelance Calculator
  const freelanceCalc = await prisma.calculator.upsert({
    where: { slug: "freelance-hourly-rate" },
    update: {},
    create: {
      userId: user.id,
      slug: "freelance-hourly-rate",
      title: "Freelance Hourly Rate & Target Income Calculator",
      description: "Determine target hourly rate to hit take-home income goals.",
      category: "business",
      schemaJson: JSON.stringify(FREELANCE_SCHEMA),
      stylingJson: JSON.stringify(DEFAULT_STYLING),
      gateConfigJson: JSON.stringify(DEFAULT_GATE),
      viewCount: 88,
      isPublished: true,
    },
  });

  // 4. Create sample leads
  const sampleLeads = [
    {
      calculatorId: solarCalc.id,
      email: "sarah.connor@gmail.com",
      name: "Sarah Connor",
      phone: "+1 (555) 234-5678",
      inputsJson: JSON.stringify({ monthlyBill: 250, sunHours: 5.5, systemCost: 20000, taxCreditPercent: 30 }),
      resultJson: JSON.stringify({ netCost: 14000, annualSavings: 2550, paybackYears: 5.5, twentyYearNetSavings: 37000 }),
    },
    {
      calculatorId: solarCalc.id,
      email: "marcus.vance@techcorp.io",
      name: "Marcus Vance",
      phone: "+1 (555) 876-5432",
      inputsJson: JSON.stringify({ monthlyBill: 340, sunHours: 6, systemCost: 25000, taxCreditPercent: 30 }),
      resultJson: JSON.stringify({ netCost: 17500, annualSavings: 3468, paybackYears: 5.0, twentyYearNetSavings: 51860 }),
    },
    {
      calculatorId: freelanceCalc.id,
      email: "david.ux@designcraft.co",
      name: "David Kim",
      phone: null,
      inputsJson: JSON.stringify({ targetIncome: 120000, billableHoursPerWeek: 25, weeksOff: 4, businessExpenses: 8000, taxRate: 30 }),
      resultJson: JSON.stringify({ grossRevenueNeeded: 179428, totalBillableHours: 1200, minimumHourlyRate: 150, dayRate: 900 }),
    },
  ];

  for (const lead of sampleLeads) {
    const existing = await prisma.leadSubmission.findFirst({
      where: {
        calculatorId: lead.calculatorId,
        email: lead.email,
      },
    });

    if (!existing) {
      await prisma.leadSubmission.create({ data: lead });
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
