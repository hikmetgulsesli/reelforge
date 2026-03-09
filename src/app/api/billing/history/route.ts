import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { getCreditHistory } from "../../../../lib/billing";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const history = await getCreditHistory(user.id, limit, page);

    return NextResponse.json({
      data: history,
      meta: {
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching credit history:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Sunucu hatası" } },
      { status: 500 }
    );
  }
}
