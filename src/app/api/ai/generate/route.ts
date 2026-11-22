import { NextRequest, NextResponse } from "next/server";
import { generateCalculatorSchema } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, category = "general" } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const schema = await generateCalculatorSchema(prompt.trim(), category);

    return NextResponse.json({
      success: true,
      schema,
    });
  } catch (error) {
    console.error("Error in /api/ai/generate:", error);
    return NextResponse.json(
      { error: "Failed to generate calculator schema" },
      { status: 500 }
    );
  }
}
