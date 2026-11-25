import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    const calculators = await prisma.calculator.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { leads: true },
        },
      },
    });

    const formatted = calculators.map((calc) => ({
      ...calc,
      leadsCount: calc._count.leads,
    }));

    return NextResponse.json({
      success: true,
      calculators: formatted,
    });
  } catch (error) {
    console.error("Error in GET /api/calculators:", error);
    return NextResponse.json(
      { error: "Failed to fetch calculators" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      title,
      description = "",
      category = "custom",
      schema,
      styling,
      gateConfig,
      isPublished = true,
    } = body;

    if (!title || !schema) {
      return NextResponse.json(
        { error: "Title and schema are required" },
        { status: 400 }
      );
    }

    // Check plan tier limits: Free tier includes up to 3 calculators
    if (user.planTier === "free") {
      const count = await prisma.calculator.count({
        where: { userId: user.id },
      });
      if (count >= 3) {
        return NextResponse.json(
          {
            error: "Free tier allows up to 3 calculators. Please upgrade to Pro for unlimited calculators.",
            upgradeRequired: true,
          },
          { status: 403 }
        );
      }
    }

    const baseSlug = slugify(title) || "calculator";
    const uniqueSuffix = nanoid(6).toLowerCase();
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const newCalculator = await prisma.calculator.create({
      data: {
        userId: user.id,
        slug,
        title,
        description,
        category,
        schemaJson: typeof schema === "string" ? schema : JSON.stringify(schema),
        stylingJson: styling ? (typeof styling === "string" ? styling : JSON.stringify(styling)) : null,
        gateConfigJson: gateConfig ? (typeof gateConfig === "string" ? gateConfig : JSON.stringify(gateConfig)) : null,
        isPublished,
      },
    });

    return NextResponse.json(
      {
        success: true,
        calculator: newCalculator,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/calculators:", error);
    return NextResponse.json(
      { error: "Failed to create calculator" },
      { status: 500 }
    );
  }
}
