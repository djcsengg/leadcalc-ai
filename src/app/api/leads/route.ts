import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return "";
  const str = typeof val === "object" ? JSON.stringify(val) : String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const calculatorId = searchParams.get("calculatorId");
    const format = searchParams.get("format");
    const search = searchParams.get("search");

    const userCalculators = await prisma.calculator.findMany({
      where: { userId: user.id },
      select: { id: true, title: true, slug: true },
    });

    const userCalcIds = userCalculators.map((c) => c.id);
    const calcMap = new Map(userCalculators.map((c) => [c.id, c.title]));

    const whereClause: any = {
      calculatorId: calculatorId && userCalcIds.includes(calculatorId) ? calculatorId : { in: userCalcIds },
    };

    if (search) {
      whereClause.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
      ];
    }

    const leads = await prisma.leadSubmission.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Handle CSV export
    if (format === "csv") {
      const headers = ["Lead ID", "Calculator Title", "Email", "Name", "Phone", "Inputs", "Results", "Submitted At"];
      const rows = leads.map((lead) => [
        escapeCsvField(lead.id),
        escapeCsvField(calcMap.get(lead.calculatorId) || "Unknown Calculator"),
        escapeCsvField(lead.email),
        escapeCsvField(lead.name || ""),
        escapeCsvField(lead.phone || ""),
        escapeCsvField(lead.inputsJson),
        escapeCsvField(lead.resultJson),
        escapeCsvField(lead.createdAt.toISOString()),
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="leadcalc-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    const formatted = leads.map((lead) => ({
      id: lead.id,
      calculatorId: lead.calculatorId,
      calculatorTitle: calcMap.get(lead.calculatorId) || "Unknown",
      email: lead.email,
      name: lead.name,
      phone: lead.phone,
      inputs: JSON.parse(lead.inputsJson || "{}"),
      result: JSON.parse(lead.resultJson || "{}"),
      createdAt: lead.createdAt,
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      leads: formatted,
    });
  } catch (error) {
    console.error("Error in GET /api/leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
