import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrInitCalculator } from "@/lib/calculatorService";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const calculator = await getOrInitCalculator(slug);

    if (!calculator || !calculator.isPublished) {
      return NextResponse.json(
        { error: "Calculator not found or unpublished" },
        { status: 404 }
      );
    }

    // Increment view count asynchronously
    await prisma.calculator.update({
      where: { id: calculator.id },
      data: { viewCount: { increment: 1 } },
    });

    const isFreeTier = calculator.user.planTier === "free";
    let styling = calculator.stylingJson ? JSON.parse(calculator.stylingJson) : {};

    // Enforce "Powered by LeadCalc AI" badge for free tier users
    if (isFreeTier) {
      styling = {
        ...styling,
        showBadge: true,
      };
    }

    return NextResponse.json({
      success: true,
      calculator: {
        id: calculator.id,
        slug: calculator.slug,
        title: calculator.title,
        description: calculator.description,
        category: calculator.category,
        schema: JSON.parse(calculator.schemaJson),
        styling,
        gateConfig: calculator.gateConfigJson ? JSON.parse(calculator.gateConfigJson) : null,
        isFreeTier,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/embed/[slug]:", error);
    return NextResponse.json(
      { error: "Failed to fetch embed calculator" },
      { status: 500 }
    );
  }
}
