import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { GET as healthGet } from "../src/app/api/health/route";
import { POST as aiGeneratePost } from "../src/app/api/ai/generate/route";
import { GET as calculatorsGet, POST as calculatorsPost } from "../src/app/api/calculators/route";
import { GET as embedGet } from "../src/app/api/embed/[slug]/route";
import { POST as embedSubmitPost } from "../src/app/api/embed/[slug]/submit/route";
import { GET as leadsGet } from "../src/app/api/leads/route";
import { POST as checkoutPost } from "../src/app/api/billing/checkout/route";
import { POST as webhookPost } from "../src/app/api/billing/webhook/route";
import { prisma } from "../src/lib/prisma";

describe("API Route Integration Tests", () => {
  let createdSlug = "";
  let createdCalcId = "";

  beforeAll(async () => {
    // Ensure test user exists
    await prisma.user.upsert({
      where: { email: "demo@leadcalc.ai" },
      update: { planTier: "pro" },
      create: {
        email: "demo@leadcalc.ai",
        name: "Alex Rivers",
        planTier: "pro",
      },
    });
  });

  it("GET /api/health returns service status ok", async () => {
    const res = await healthGet();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(data.service).toBe("leadcalc-ai");
  });

  it("POST /api/ai/generate rejects empty prompt with 400", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "" }),
    });
    const res = await aiGeneratePost(req);
    expect(res.status).toBe(400);
  });

  it("POST /api/ai/generate returns generated schema", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "Freelance hourly rate consultant" }),
    });
    const res = await aiGeneratePost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.schema.title).toBeTruthy();
    expect(data.schema.inputs.length).toBeGreaterThan(0);
  });

  it("POST /api/calculators creates a new calculator", async () => {
    const testSchema = {
      title: "Integration Test Calculator",
      description: "Testing API calculator creation",
      inputs: [
        { id: "hours", label: "Hours Worked", type: "number", defaultValue: 40 },
        { id: "rate", label: "Hourly Rate", type: "slider", defaultValue: 75 },
      ],
      outputs: [
        { id: "total", label: "Gross Pay", formula: "hours * rate", format: "currency" },
      ],
    };

    const req = new NextRequest("http://localhost:3000/api/calculators", {
      method: "POST",
      body: JSON.stringify({
        title: "Integration Test Calculator",
        description: "Created via automated test",
        category: "business",
        schema: testSchema,
        styling: { primaryColor: "#4f46e5", theme: "light" },
        gateConfig: { enabled: true, requireEmail: true },
      }),
    });

    const res = await calculatorsPost(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.calculator.id).toBeTruthy();
    expect(data.calculator.slug).toContain("integration-test-calculator");

    createdCalcId = data.calculator.id;
    createdSlug = data.calculator.slug;
  });

  it("GET /api/calculators lists user calculators", async () => {
    const res = await calculatorsGet();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.calculators.length).toBeGreaterThanOrEqual(1);
  });

  it("GET /api/embed/[slug] delivers public calculator configuration", async () => {
    const req = new NextRequest(`http://localhost:3000/api/embed/${createdSlug}`);
    const res = await embedGet(req, { params: { slug: createdSlug } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.calculator.title).toBe("Integration Test Calculator");
    expect(data.calculator.schema.inputs.length).toBe(2);
  });

  it("POST /api/embed/[slug]/submit captures lead data", async () => {
    const req = new NextRequest(`http://localhost:3000/api/embed/${createdSlug}/submit`, {
      method: "POST",
      body: JSON.stringify({
        email: "lead.tester@example.com",
        name: "Jordan Smith",
        phone: "+1 555-0192",
        inputs: { hours: 40, rate: 100 },
        result: { total: 4000 },
      }),
    });

    const res = await embedSubmitPost(req, { params: { slug: createdSlug } });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.leadId).toBeTruthy();
  });

  it("GET /api/leads retrieves captured leads", async () => {
    const req = new NextRequest("http://localhost:3000/api/leads");
    const res = await leadsGet(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.count).toBeGreaterThan(0);
    const found = data.leads.find((l: any) => l.email === "lead.tester@example.com");
    expect(found).toBeTruthy();
    expect(found.name).toBe("Jordan Smith");
  });

  it("GET /api/leads?format=csv exports leads as CSV", async () => {
    const req = new NextRequest("http://localhost:3000/api/leads?format=csv");
    const res = await leadsGet(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/csv");
    const csvText = await res.text();
    expect(csvText).toContain("Lead ID,Calculator Title,Email,Name");
    expect(csvText).toContain("lead.tester@example.com");
  });

  it("POST /api/billing/checkout generates checkout URL", async () => {
    const req = new NextRequest("http://localhost:3000/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ plan: "founder" }),
    });
    const res = await checkoutPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.url).toContain("dashboard?payment=success");
  });

  it("POST /api/billing/webhook processes checkout.session.completed", async () => {
    const user = await prisma.user.findUnique({ where: { email: "demo@leadcalc.ai" } });

    const fakeWebhookPayload = {
      id: "evt_test_123",
      type: "checkout.session.completed",
      data: {
        object: {
          client_reference_id: user?.id,
          customer: "cus_test_123",
          subscription: "sub_test_123",
          metadata: {
            userId: user?.id,
            plan: "founder",
          },
        },
      },
    };

    const req = new NextRequest("http://localhost:3000/api/billing/webhook", {
      method: "POST",
      body: JSON.stringify(fakeWebhookPayload),
    });

    const res = await webhookPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);

    const updatedUser = await prisma.user.findUnique({ where: { email: "demo@leadcalc.ai" } });
    expect(updatedUser?.planTier).toBe("founder");
  });
});
