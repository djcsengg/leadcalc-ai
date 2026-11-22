import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CalculatorRenderer } from "@/components/CalculatorRenderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const calculator = await prisma.calculator.findUnique({
    where: { slug: params.slug },
  });

  if (!calculator) {
    return { title: "Calculator Not Found - LeadCalc AI" };
  }

  return {
    title: `${calculator.title} - LeadCalc AI`,
    description: calculator.description || "Interactive ROI & savings calculator.",
  };
}

export default async function CalculatorPublicPage({ params }: Props) {
  const calculator = await prisma.calculator.findUnique({
    where: { slug: params.slug },
    include: {
      user: {
        select: { planTier: true },
      },
    },
  });

  if (!calculator || !calculator.isPublished) {
    notFound();
  }

  // Increment view count
  await prisma.calculator.update({
    where: { id: calculator.id },
    data: { viewCount: { increment: 1 } },
  });

  const schema = JSON.parse(calculator.schemaJson);
  const styling = calculator.stylingJson ? JSON.parse(calculator.stylingJson) : {};
  const gateConfig = calculator.gateConfigJson ? JSON.parse(calculator.gateConfigJson) : {};

  // Free tier badge enforcement
  if (calculator.user.planTier === "free") {
    styling.showBadge = true;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <CalculatorRenderer
          schema={schema}
          styling={styling}
          gateConfig={gateConfig}
          slug={calculator.slug}
        />
      </div>
    </div>
  );
}
