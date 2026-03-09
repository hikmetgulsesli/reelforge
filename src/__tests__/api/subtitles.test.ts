/**
 * @jest-environment node
 */

import { GET } from "@/app/api/subtitles/styles/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    subtitleStyle: {
      findMany: jest.fn(),
    },
  },
}));

describe("GET /api/subtitles/styles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all preset subtitle styles", async () => {
    const mockStyles = [
      {
        id: "1",
        name: "YouTube Classic",
        slug: "youtube-classic",
        presetType: "youtube-classic",
        fontFamily: "Roboto",
        fontSize: 36,
        fontWeight: "500",
        textColor: "#FFFFFF",
        position: "BOTTOM",
        animationEnabled: false,
        karaokeStyle: false,
        shadowEnabled: true,
        emojiEnabled: false,
        isPreset: true,
        isCustom: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "TikTok Modern",
        slug: "tiktok-modern",
        presetType: "tiktok-modern",
        fontFamily: "Montserrat",
        fontSize: 42,
        fontWeight: "800",
        textColor: "#FFFFFF",
        position: "CENTER",
        animationEnabled: true,
        karaokeStyle: false,
        shadowEnabled: true,
        emojiEnabled: false,
        isPreset: true,
        isCustom: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    (prisma.subtitleStyle.findMany as jest.Mock).mockResolvedValue(mockStyles);

    const request = new NextRequest("http://localhost:3000/api/subtitles/styles");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(2);
    expect(data.count).toBe(2);
    expect(prisma.subtitleStyle.findMany).toHaveBeenCalledWith({
      where: { isPreset: true },
      orderBy: [{ isPreset: "desc" }, { name: "asc" }],
    });
  });

  it("should return empty array when no styles exist", async () => {
    (prisma.subtitleStyle.findMany as jest.Mock).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/subtitles/styles");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(0);
    expect(data.count).toBe(0);
  });

  it("should handle errors gracefully", async () => {
    (prisma.subtitleStyle.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));

    const request = new NextRequest("http://localhost:3000/api/subtitles/styles");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to fetch subtitle styles");
  });

  it("should include custom styles when includeCustom is true", async () => {
    const mockStyles = [
      {
        id: "3",
        name: "My Custom Style",
        slug: "my-custom",
        presetType: "custom",
        fontFamily: "Inter",
        fontSize: 36,
        fontWeight: "600",
        textColor: "#FFFFFF",
        position: "BOTTOM",
        animationEnabled: false,
        karaokeStyle: false,
        shadowEnabled: true,
        emojiEnabled: false,
        isPreset: false,
        isCustom: true,
        createdBy: "user-123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    (prisma.subtitleStyle.findMany as jest.Mock).mockResolvedValue(mockStyles);

    const request = new NextRequest(
      "http://localhost:3000/api/subtitles/styles?includeCustom=true&userId=user-123"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
  });
});
