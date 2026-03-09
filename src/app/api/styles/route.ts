import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PREDEFINED_STYLES, StyleOption } from "@/types/style";

/**
 * GET /api/styles
 * Returns all predefined styles and optionally custom styles for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const includeCustom = searchParams.get("includeCustom") === "true";

    // Get predefined styles from database
    const dbStyles = await prisma.style.findMany({
      where: { isCustom: false },
      orderBy: { createdAt: "asc" },
    });

    // If no predefined styles in DB, return static ones
    let styles: StyleOption[];
    
    if (dbStyles.length === 0) {
      styles = PREDEFINED_STYLES;
    } else {
      styles = dbStyles.map((style) => ({
        value: style.slug,
        label: style.name,
        description: style.description,
        previewGradient: style.previewGradient,
        colors: {
          primary: style.primaryColor,
          secondary: style.secondaryColor,
          accent: style.accentColor,
        },
        fonts: {
          heading: style.fontPair.split(" + ")[0] || "Space Grotesk",
          body: style.fontPair.split(" + ")[1] || "DM Sans",
        },
      }));
    }

    // Include custom styles if requested
    if (includeCustom && userId) {
      const customStyles = await prisma.customStyle.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      const mappedCustomStyles: StyleOption[] = customStyles.map((style) => ({
        value: `custom-${style.id}`,
        label: style.name,
        description: style.description || "Özel stil",
        previewGradient: `linear-gradient(135deg, ${style.primaryColor} 0%, ${style.secondaryColor} 100%)`,
        colors: {
          primary: style.primaryColor,
          secondary: style.secondaryColor,
          accent: style.accentColor,
        },
        fonts: {
          heading: style.fontHeading,
          body: style.fontBody,
        },
      }));

      styles = [...styles, ...mappedCustomStyles];
    }

    return NextResponse.json({
      success: true,
      data: styles,
      count: styles.length,
    });
  } catch (error) {
    console.error("Error fetching styles:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Stiller alınırken bir hata oluştu",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
