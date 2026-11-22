import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const { id } = params;

    const calculator = await prisma.calculator.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        _count: {
          select: { leads: true },
        },
      },
    });

    if (!calculator) {
      return NextResponse.json(
        { error: "Calculator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      calculator: {
        ...calculator,
        leadsCount: calculator._count.leads,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/calculators/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch calculator" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const { id } = params;
    const body = await req.json();

    const existing = await prisma.calculator.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Calculator not found" },
        { status: 404 }
      );
    }

    const {
      title,
      description,
      category,
      schema,
      styling,
      gateConfig,
      isPublished,
    } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (schema !== undefined) {
      updateData.schemaJson = typeof schema === "string" ? schema : JSON.stringify(schema);
    }
    if (styling !== undefined) {
      updateData.stylingJson = styling ? (typeof styling === "string" ? styling : JSON.stringify(styling)) : null;
    }
    if (gateConfig !== undefined) {
      updateData.gateConfigJson = gateConfig ? (typeof gateConfig === "string" ? gateConfig : JSON.stringify(gateConfig)) : null;
    }
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const updated = await prisma.calculator.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      calculator: updated,
    });
  } catch (error) {
    console.error("Error in PATCH /api/calculators/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update calculator" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const { id } = params;

    const existing = await prisma.calculator.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Calculator not found" },
        { status: 404 }
      );
    }

    await prisma.calculator.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Calculator deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/calculators/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete calculator" },
      { status: 500 }
    );
  }
}
