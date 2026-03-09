import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { getOrCreateCredit } from "../../../../lib/billing";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Giriş yapmalısınız" } },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Kullanıcı bulunamadı" } },
        { status: 404 }
      );
    }

    const credit = await getOrCreateCredit(user.id);

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      data: {
        balance: credit.balance,
        plan: subscription?.plan || "free",
        creditsIncluded: subscription?.creditsIncluded || 3,
        subscriptionStatus: subscription?.status || "active",
      },
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Sunucu hatası" } },
      { status: 500 }
    );
  }
}
