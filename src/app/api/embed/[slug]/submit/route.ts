import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrInitCalculator } from "@/lib/calculatorService";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      "Access-Control-Max-Age": "86400",
    },
  });
}

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
        { status: 400, headers: corsHeaders }
      );
    }

    const calculator = await getOrInitCalculator(slug);

    if (!calculator) {
      return NextResponse.json(
        { error: "Calculator not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check free tier 100 leads/month limit
    if (calculator.user.planTier === "free") {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const monthlyLeadsCount = await prisma.leadSubmission.count({
        where: {
          calculatorId: calculator.id,
          createdAt: { gte: firstDayOfMonth },
        },
      });

      if (monthlyLeadsCount >= 100) {
        return NextResponse.json(
          {
            error: "This calculator has reached its free tier monthly lead limit (100 leads). Please upgrade to Pro for unlimited leads.",
            limitReached: true,
          },
          { status: 429, headers: corsHeaders }
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
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in POST /api/embed/[slug]/submit:", error);
    return NextResponse.json(
      { error: "Failed to record lead submission" },
      { status: 500, headers: corsHeaders }
    );
  }
}
