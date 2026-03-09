import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: {
      isActive: boolean;
      category?: string;
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        artist?: { contains: string; mode: "insensitive" };
      }>;
    } = {
      isActive: true,
    };

    if (category && category !== "all") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { artist: { contains: search, mode: "insensitive" } },
      ];
    }

    const tracks = await prisma.musicTrack.findMany({
      where,
      orderBy: [
        { category: "asc" },
        { title: "asc" },
      ],
    });

    return NextResponse.json({
      data: tracks,
      meta: {
        total: tracks.length,
      },
    });
  } catch (error) {
    console.error("Error fetching music tracks:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch music tracks",
        },
      },
      { status: 500 }
    );
  }
}
