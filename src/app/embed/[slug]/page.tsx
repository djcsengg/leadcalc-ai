import { notFound } from "next/navigation";
import { CalculatorRenderer } from "@/components/CalculatorRenderer";
import { getOrInitCalculator } from "@/lib/calculatorService";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export default async function EmbedPage({ params }: Props) {
  const { slug } = params;
  const calculator = await getOrInitCalculator(slug);

  if (!calculator || !calculator.isPublished) {
    notFound();
  }

  // Increment view count
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.calculator.update({
      where: { id: calculator.id },
      data: { viewCount: { increment: 1 } },
    });
  } catch (err) {
    console.error("Failed to increment view count:", err);
  }

  const schema = JSON.parse(calculator.schemaJson);
  const styling = calculator.stylingJson ? JSON.parse(calculator.stylingJson) : {};
  const gateConfig = calculator.gateConfigJson ? JSON.parse(calculator.gateConfigJson) : {};

  if (calculator.user.planTier === "free") {
    styling.showBadge = true;
  }

  return (
    <div className="p-2 sm:p-4 bg-transparent">
      <CalculatorRenderer
        schema={schema}
        styling={styling}
        gateConfig={gateConfig}
        slug={calculator.slug}
        isEmbed={true}
      />
    </div>
  );
}
