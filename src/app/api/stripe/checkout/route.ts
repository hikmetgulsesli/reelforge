import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

const PRICE_IDS: Record<string, string> = {
  price_starter_monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || "",
  price_starter_yearly: process.env.STRIPE_PRICE_STARTER_YEARLY || "",
  price_pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
  price_pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || "",
  price_business_monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || "",
  price_business_yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || "",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    const actualPriceId = PRICE_IDS[priceId];
    if (!actualPriceId) {
      return NextResponse.json(
        { error: "Invalid price ID" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing`,
      metadata: {
        plan: priceId.replace("price_", "").replace(/_(monthly|yearly)$/, ""),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}