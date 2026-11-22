import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CalculatorRenderer } from "@/components/CalculatorRenderer";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export default async function EmbedPage({ params }: Props) {
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
