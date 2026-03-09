import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const categories = await prisma.musicTrack.groupBy({
      by: ["category"],
      where: {
        isActive: true,
      },
      _count: {
        category: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    const formattedCategories = categories.map((cat) => ({
      id: cat.category.toLowerCase().replace(/\s+/g, "-"),
      name: cat.category,
      count: cat._count.category,
    }));

    return NextResponse.json({
      data: formattedCategories,
      meta: {
        total: formattedCategories.length,
      },
    });
  } catch (error) {
    console.error("Error fetching music categories:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch music categories",
        },
      },
      { status: 500 }
    );
  }
}
