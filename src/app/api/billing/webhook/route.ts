import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe, handleStripeWebhook } from "../../../../lib/billing";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Stripe signature missing" } },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid signature" } },
        { status: 400 }
      );
    }

    await handleStripeWebhook(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Webhook handling failed" } },
      { status: 500 }
    );
  }
}
