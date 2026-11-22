import { prisma } from "@/lib/prisma";
import { getSeoCalculatorBySlug } from "@/data/seoCalculators";

export async function getOrInitCalculator(slug: string) {
  try {
    let calculator = await prisma.calculator.findUnique({
      where: { slug },
      include: {
        user: {
          select: { planTier: true, id: true, email: true },
        },
      },
    });

    if (calculator) {
      return calculator;
    }

    // Check if it's one of our programmatic SEO calculators
    const seoCalc = getSeoCalculatorBySlug(slug);
    if (!seoCalc) {
      return null;
    }

    // Ensure demo/official user exists
    const user = await prisma.user.upsert({
      where: { email: "demo@leadcalc.ai" },
      update: {},
      create: {
        email: "demo@leadcalc.ai",
        name: "LeadCalc AI Official",
        planTier: "pro",
      },
    });

    // Create the calculator in database so view tracking, leads, and embeds function
    calculator = await prisma.calculator.create({
      data: {
        userId: user.id,
        slug: seoCalc.slug,
        title: seoCalc.title,
        description: seoCalc.summary,
        category: seoCalc.categorySlug,
        schemaJson: JSON.stringify(seoCalc.schema),
        stylingJson: JSON.stringify(seoCalc.styling),
        gateConfigJson: JSON.stringify(seoCalc.gateConfig),
        viewCount: 1,
        isPublished: true,
      },
      include: {
        user: {
          select: { planTier: true, id: true, email: true },
        },
      },
    });

    return calculator;
  } catch (error) {
    console.error(`Error in getOrInitCalculator for slug "${slug}":`, error);
    return null;
  }
}
