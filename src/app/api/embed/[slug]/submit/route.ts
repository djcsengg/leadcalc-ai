import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await req.json();

    const { email, name = "", phone = "", inputs = {}, result = {} } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const calculator = await prisma.calculator.findUnique({
      where: { slug },
      include: {
        user: true,
      },
    });

    if (!calculator) {
      return NextResponse.json(
        { error: "Calculator not found" },
        { status: 404 }
      );
    }

    // Check free tier 25 leads/month limit
    if (calculator.user.planTier === "free") {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const monthlyLeadsCount = await prisma.leadSubmission.count({
        where: {
          calculatorId: calculator.id,
          createdAt: { gte: firstDayOfMonth },
        },
      });

      if (monthlyLeadsCount >= 25) {
        return NextResponse.json(
          {
            error: "This calculator has reached its free tier monthly lead limit.",
            limitReached: true,
          },
          { status: 429 }
        );
      }
    }

    const lead = await prisma.leadSubmission.create({
      data: {
        calculatorId: calculator.id,
        email: email.trim().toLowerCase(),
        name: name ? name.trim() : null,
        phone: phone ? phone.trim() : null,
        inputsJson: JSON.stringify(inputs),
        resultJson: JSON.stringify(result),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead recorded successfully",
        leadId: lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/embed/[slug]/submit:", error);
    return NextResponse.json(
      { error: "Failed to record lead submission" },
      { status: 500 }
    );
  }
}
