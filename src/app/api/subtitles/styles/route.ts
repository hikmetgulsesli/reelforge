import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/subtitles/styles
 * Returns all preset subtitle styles
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCustom = searchParams.get("includeCustom") === "true";
    const userId = searchParams.get("userId");

    const whereClause: {
      isPreset: boolean;
      isCustom?: boolean;
      createdBy?: string;
    } = {
      isPreset: true,
    };

    // If includeCustom is true and userId is provided, also fetch user's custom styles
    if (includeCustom && userId) {
      delete (whereClause as { isPreset?: boolean }).isPreset;
      whereClause.isCustom = true;
      whereClause.createdBy = userId;
    }

    const styles = await prisma.subtitleStyle.findMany({
      where: whereClause,
      orderBy: [
        { isPreset: "desc" }, // Presets first
        { name: "asc" },
      ],
    });

    return NextResponse.json({
      success: true,
      data: styles,
      count: styles.length,
    });
  } catch (error) {
    console.error("Error fetching subtitle styles:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch subtitle styles",
      },
      { status: 500 }
    );
  }
}
