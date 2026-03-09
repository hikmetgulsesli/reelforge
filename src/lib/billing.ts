import { prisma } from "../lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

// Credit calculation: 15s = 1 credit, 30s = 2 credits, 60s = 3 credits
export function calculateCredits(durationSeconds: number): number {
  if (durationSeconds <= 15) return 1;
  if (durationSeconds <= 30) return 2;
  if (durationSeconds <= 60) return 3;
  return Math.ceil(durationSeconds / 20); // For longer videos
}

// Plan credit packages
export const PLAN_CREDITS: Record<string, { credits: number; price: number }> = {
  starter: { credits: 30, price: 1900 }, // $19.00 in cents
  pro: { credits: 80, price: 4900 },
  business: { credits: 200, price: 9900 },
};

// Plan details
export const PLANS = {
  free: { name: "Ücretsiz", credits: 3, price: 0 },
  starter: { name: "Starter", credits: 30, price: 19 },
  pro: { name: "Pro", credits: 80, price: 49 },
  business: { name: "Business", credits: 200, price: 99 },
};

export async function getOrCreateCredit(userId: string) {
  let credit = await prisma.credit.findUnique({
    where: { userId },
  });

  if (!credit) {
    credit = await prisma.credit.create({
      data: { userId, balance: 3 }, // Free tier starts with 3 credits
    });
    
    // Add initial credit history
    await prisma.creditHistory.create({
      data: {
        userId,
        creditId: credit.id,
        amount: 3,
        type: "bonus",
        description: "Hoşgeldin bonusu",
      },
    });
  }

  return credit;
}

export async function getCreditHistory(userId: string, limit = 20, page = 1) {
  const credit = await prisma.credit.findUnique({
    where: { userId },
    include: {
      creditHistory: {
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      },
    },
  });

  return credit?.creditHistory || [];
}

export async function useCredits(userId: string, amount: number, referenceId?: string) {
  const credit = await getOrCreateCredit(userId);
  
  if (credit.balance < amount) {
    throw new Error("Yetersiz kredi");
  }

  const updated = await prisma.credit.update({
    where: { userId },
    data: { balance: { decrement: amount } },
  });

  await prisma.creditHistory.create({
    data: {
      userId,
      creditId: credit.id,
      amount: -amount,
      type: "usage",
      referenceId,
      description: "Video oluşturma",
    },
  });

  return updated;
}

export async function addCredits(userId: string, amount: number, type: string, referenceId?: string, description?: string) {
  const credit = await getOrCreateCredit(userId);
  
  const updated = await prisma.credit.update({
    where: { userId },
    data: { balance: { increment: amount } },
  });

  await prisma.creditHistory.create({
    data: {
      userId,
      creditId: credit.id,
      amount,
      type,
      referenceId,
      description,
    },
  });

  return updated;
}

export async function createCheckoutSession(userId: string, plan: string, successUrl: string, cancelUrl: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Kullanıcı bulunamadı");

  const planCredits = PLAN_CREDITS[plan];
  if (!planCredits) throw new Error("Geçersiz plan");

  // Get or create customer
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  
  let customerId = subscription?.stripeCustomerId;
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId },
    });
    customerId = customer.id;
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `ReelForge ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
          },
          unit_amount: planCredits.price,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      plan,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

export async function createCustomerPortal(userId: string, returnUrl: string) {
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  
  if (!subscription?.stripeCustomerId) {
    throw new Error("Müşteri bulunamadı");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: returnUrl,
  });

  return session;
}

export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, plan } = session.metadata || {};
      
      if (userId && plan) {
        const planCredits = PLAN_CREDITS[plan];
        if (planCredits) {
          // Update or create subscription
          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              plan,
              status: "active",
              creditsIncluded: planCredits.credits,
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            update: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              plan,
              status: "active",
              creditsIncluded: planCredits.credits,
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });

          // Add credits
          await addCredits(userId, planCredits.credits, "purchase", session.subscription as string, `Stripe abonelik - ${plan} plan`);
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      const existing = await prisma.subscription.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (existing) {
        await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            status: subscription.status === "active" ? "active" : 
                    subscription.status === "past_due" ? "past_due" : "canceled",
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      const existing = await prisma.subscription.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (existing) {
        await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            status: "canceled",
            plan: "free",
            creditsIncluded: 0,
          },
        });
      }
      break;
    }
  }
}

export { stripe };
