import { NextRequest, NextResponse } from "next/server";
import { generateCalculatorSchema } from "@/lib/gemini";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 requests per minute per IP to protect against token drain/scraping
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, { limit: 10, windowMs: 60000 });

    const headers = {
      "X-RateLimit-Limit": String(rateLimit.limit),
      "X-RateLimit-Remaining": String(rateLimit.remaining),
      "X-RateLimit-Reset": String(Math.ceil(rateLimit.reset / 1000)),
    };

    if (!rateLimit.success) {
      const retryAfter = Math.max(1, Math.ceil((rateLimit.reset - Date.now()) / 1000));
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait before generating more calculators.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

    const body = await req.json();
    const { prompt, category = "general" } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400, headers }
      );
    }

    const schema = await generateCalculatorSchema(prompt.trim(), category);

    return NextResponse.json(
      {
        success: true,
        schema,
      },
      { headers }
    );
  } catch (error) {
    console.error("Error in /api/ai/generate:", error);
    return NextResponse.json(
      { error: "Failed to generate calculator schema" },
      { status: 500 }
    );
  }
}
