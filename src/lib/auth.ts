import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  // In our single-tenant/micro-SaaS MVP, we retrieve or create the primary user
  const user = await prisma.user.upsert({
    where: { email: "demo@leadcalc.ai" },
    update: {},
    create: {
      email: "demo@leadcalc.ai",
      name: "Alex Rivers",
      planTier: "pro",
    },
  });

  return user;
}
