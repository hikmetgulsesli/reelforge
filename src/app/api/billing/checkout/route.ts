import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { createCheckoutSession, PLAN_CREDITS } from "../../../../lib/billing";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Giriş yapmalısınız" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !PLAN_CREDITS[plan]) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Geçersiz plan seçimi" } },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/dashboard?payment=success`;
    const cancelUrl = `${baseUrl}/dashboard?payment=cancelled`;

    const checkoutSession = await createCheckoutSession(
      session.user.email,
      plan,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({
      data: {
        url: checkoutSession.url,
        sessionId: checkoutSession.id,
      },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Ödeme oturumu oluşturulamadı" } },
      { status: 500 }
    );
  }
}
