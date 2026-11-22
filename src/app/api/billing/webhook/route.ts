import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const stripeApiKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    if (stripeApiKey && webhookSecret) {
      const stripe = new Stripe(stripeApiKey, {
        apiVersion: "2024-11-20.acacia" as any,
      });

      const body = await req.text();
      const signature = req.headers.get("stripe-signature");

      if (!signature) {
        return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
      }

      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      // In development or test environments, parse JSON directly
      const body = await req.json();
      event = body as Stripe.Event;
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.userId;
        const plan = session.metadata?.plan || "pro";

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              planTier: plan === "founder" ? "founder" : "pro",
              stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
            },
          });

          if (session.subscription) {
            const subId = typeof session.subscription === "string" ? session.subscription : (session.subscription as any).id;
            await prisma.subscription.upsert({
              where: { stripeSubscriptionId: subId },
              update: {
                status: "active",
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
              create: {
                userId,
                stripeSubscriptionId: subId,
                stripePriceId: "pro_monthly",
                status: "active",
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const sub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: "canceled" },
          });

          await prisma.user.update({
            where: { id: sub.userId },
            data: { planTier: "free" },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error in POST /api/billing/webhook:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
