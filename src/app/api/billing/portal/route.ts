import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { createCustomerPortal } from "../../../../lib/billing";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Giriş yapmalısınız" } },
        { status: 401 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const returnUrl = `${baseUrl}/dashboard`;

    const portalSession = await createCustomerPortal(
      session.user.email,
      returnUrl
    );

    return NextResponse.json({
      data: {
        url: portalSession.url,
      },
    });
  } catch (error) {
    console.error("Error creating customer portal:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Müşteri portalı oluşturulamadı" } },
      { status: 500 }
    );
  }
}
