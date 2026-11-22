import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { plan = "pro" } = body; // "pro" or "founder"

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const stripeApiKey = process.env.STRIPE_SECRET_KEY;

    // If Stripe API key is configured, initiate real Stripe Checkout session
    if (stripeApiKey && !stripeApiKey.startsWith("mock_")) {
      const stripe = new Stripe(stripeApiKey, {
        apiVersion: "2024-11-20.acacia" as any,
      });

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      if (plan === "founder") {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "LeadCalc AI - Founder Lifetime Pass",
              description: "Lifetime access to all Pro features, unlimited calculators, and priority support.",
            },
            unit_amount: 4900, // $49.00
          },
          quantity: 1,
        });
      } else {
        // Pro monthly subscription ($19/mo)
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "LeadCalc AI - Pro Subscription",
              description: "Unlimited calculators, unlimited leads, custom branding, and badge removal.",
            },
            unit_amount: 1900, // $19.00
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: plan === "founder" ? "payment" : "subscription",
        line_items: lineItems,
        customer_email: user.email,
        client_reference_id: user.id,
        metadata: {
          userId: user.id,
          plan,
        },
        success_url: `${appUrl}/dashboard?payment=success&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing?payment=cancelled`,
      });

      return NextResponse.json({
        success: true,
        url: session.url,
        sessionId: session.id,
      });
    }

    // Seamless Mock / Sandbox Checkout for test mode or zero-configuration environments
    const mockSessionId = `mock_cs_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Upgrade the user plan directly in database for instant test satisfaction
    await prisma.user.update({
      where: { id: user.id },
      data: {
        planTier: plan === "founder" ? "founder" : "pro",
      },
    });

    const returnUrl = `${appUrl}/dashboard?payment=success&plan=${plan}&session_id=${mockSessionId}&mode=mock`;

    return NextResponse.json({
      success: true,
      url: returnUrl,
      sessionId: mockSessionId,
      mock: true,
    });
  } catch (error) {
    console.error("Error in POST /api/billing/checkout:", error);
    return NextResponse.json(
      { error: "Failed to initiate checkout session" },
      { status: 500 }
    );
  }
}
