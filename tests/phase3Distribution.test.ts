import { describe, it, expect } from "vitest";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";
import fs from "fs";
import path from "path";

describe("Phase 3: Launch, SEO & Traffic Distribution", () => {
  it("generates a valid sitemap with static and programmatic routes", async () => {
    const entries = await sitemap();
    expect(entries.length).toBeGreaterThanOrEqual(15);

    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/calculators"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/builder"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/pricing"))).toBe(true);
    expect(urls.some((u) => u.includes("/c/solar-roi"))).toBe(true);
    expect(urls.some((u) => u.includes("/c/saas-churn-rate"))).toBe(true);
  });

  it("configures robots.txt properly for search crawlers and AI bots", () => {
    const config = robots();
    expect(config.rules).toBeDefined();
    expect(config.sitemap).toContain("/sitemap.xml");

    // General crawler rules
    const generalRule = (config.rules as any[]).find((r) => r.userAgent === "*");
    expect(generalRule).toBeDefined();
    expect(generalRule.allow).toContain("/calculators");
    expect(generalRule.disallow).toContain("/dashboard");
    expect(generalRule.disallow).toContain("/embed/*");
  });

  it("verifies production deployment and launch package documents exist", () => {
    const deploymentDoc = path.resolve(__dirname, "../docs/PRODUCTION_DEPLOYMENT.md");
    expect(fs.existsSync(deploymentDoc)).toBe(true);
    const deployContent = fs.readFileSync(deploymentDoc, "utf-8");
    expect(deployContent).toContain("DATABASE_URL");
    expect(deployContent).toContain("GEMINI_API_KEY");
    expect(deployContent).toContain("STRIPE_SECRET_KEY");
    expect(deployContent).toContain("NEXT_PUBLIC_APP_URL");

    const launchDoc = path.resolve(__dirname, "../docs/LAUNCH_PACKAGE.md");
    expect(fs.existsSync(launchDoc)).toBe(true);
    const launchContent = fs.readFileSync(launchDoc, "utf-8");
    expect(launchContent).toContain("Product Hunt Launch Kit");
    expect(launchContent).toContain("Hacker News Show HN");
    expect(launchContent).toContain("Indie Hackers");
    expect(launchContent).toContain("r/SaaS");
    expect(launchContent).toContain("Twitter / X Launch Thread");
  });

  it("verifies vercel.json deployment configuration is present with embed headers", () => {
    const vercelFile = path.resolve(__dirname, "../vercel.json");
    expect(fs.existsSync(vercelFile)).toBe(true);
    const vercelConfig = JSON.parse(fs.readFileSync(vercelFile, "utf-8"));
    expect(vercelConfig.framework).toBe("nextjs");
    expect(vercelConfig.headers.length).toBeGreaterThan(0);
    const embedHeader = vercelConfig.headers.find((h: any) => h.source.includes("embed"));
    expect(embedHeader).toBeDefined();
  });
});
