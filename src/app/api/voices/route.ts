import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VoiceCategory, VoiceProvider } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filter parameters
    const category = searchParams.get("category") as VoiceCategory | null;
    const provider = searchParams.get("provider") as VoiceProvider | null;
    const language = searchParams.get("language");
    const isPremium = searchParams.get("isPremium");
    const search = searchParams.get("search");
    
    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };
    
    if (category && Object.values(VoiceCategory).includes(category)) {
      where.category = category;
    }
    
    if (provider && Object.values(VoiceProvider).includes(provider)) {
      where.provider = provider;
    }
    
    if (language) {
      where.language = language;
    }
    
    if (isPremium !== null) {
      where.isPremium = isPremium === "true";
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { accent: { contains: search, mode: "insensitive" } },
      ];
    }
    
    const voices = await prisma.voice.findMany({
      where,
      orderBy: [
        { isPremium: "asc" },
        { name: "asc" },
      ],
    });
    
    return NextResponse.json({
      data: voices,
      meta: {
        total: voices.length,
        filters: {
          category,
          provider,
          language,
          isPremium,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching voices:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch voices",
        },
      },
      { status: 500 }
    );
  }
}
