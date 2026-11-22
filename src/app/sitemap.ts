import { MetadataRoute } from "next";
import { getAllSeoCalculators } from "@/data/seoCalculators";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leadcalc.ai";
  const now = new Date();

  // 1. Core static marketing & utility pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/calculators`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/builder`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // 2. Programmatic SEO calculator landing pages
  const seoCalculators = getAllSeoCalculators();
  const programmaticRoutes: MetadataRoute.Sitemap = seoCalculators.map((calc) => ({
    url: `${baseUrl}/c/${calc.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 3. User-published calculators from database (excluding duplicates)
  const knownSlugs = new Set(seoCalculators.map((c) => c.slug));
  try {
    const publishedCalcs = await prisma.calculator.findMany({
      where: { isPublished: true },
      select: { slug: true, createdAt: true },
    });

    for (const calc of publishedCalcs) {
      if (!knownSlugs.has(calc.slug)) {
        knownSlugs.add(calc.slug);
        programmaticRoutes.push({
          url: `${baseUrl}/c/${calc.slug}`,
          lastModified: calc.createdAt,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // If DB is offline during build, continue with programmatic routes
  }

  return [...staticRoutes, ...programmaticRoutes];
}
