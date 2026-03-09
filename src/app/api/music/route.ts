import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/music - Return music tracks with optional category filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where = {
      isActive: true,
      ...(category && { category: category.toLowerCase() }),
    };

    const [tracks, total] = await Promise.all([
      prisma.musicTrack.findMany({
        where,
        orderBy: { playCount: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.musicTrack.count({ where }),
    ]);

    // Transform to match API response format
    const data = tracks.map((track) => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      category: track.category,
      duration: track.duration,
      audioUrl: track.audioUrl,
      thumbnailUrl: track.thumbnailUrl,
      isAiRecommended: track.isAiRecommended,
      playCount: track.playCount,
    }));

    return NextResponse.json({
      data,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + tracks.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching music tracks:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch music tracks" } },
      { status: 500 }
    );
  }
}