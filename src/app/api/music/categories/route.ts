import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/music/categories - Return music categories
export async function GET() {
  try {
    const categories = await prisma.musicCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // Transform to match API response format
    const data = categories.map((cat) => ({
      id: cat.slug,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
      trackCount: cat.trackCount,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching music categories:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch music categories" } },
      { status: 500 }
    );
  }
}