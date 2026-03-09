import { NextRequest } from "next/server";
import { GET } from "@/app/api/music/route";
import { prisma } from "@/lib/db";

// Mock prisma
jest.mock("@/lib/db", () => ({
  prisma: {
    musicTrack: {
      findMany: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("GET /api/music", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all active music tracks", async () => {
    const mockTracks = [
      {
        id: "track-1",
        title: "Neon Horizon",
        artist: "Synthwave Collective",
        category: "Upbeat",
        duration: 165,
        url: "https://example.com/track1.mp3",
        coverArt: "https://example.com/cover1.jpg",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "track-2",
        title: "Summer Vibes",
        artist: "DJ Ocean",
        category: "Chill",
        duration: 192,
        url: "https://example.com/track2.mp3",
        coverArt: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockPrisma.musicTrack.findMany.mockResolvedValue(mockTracks);

    const request = new NextRequest("http://localhost:3000/api/music");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(2);
    expect(data.data[0].title).toBe("Neon Horizon");
    expect(data.meta.total).toBe(2);
    expect(mockPrisma.musicTrack.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { title: "asc" }],
    });
  });

  it("filters tracks by category", async () => {
    const mockTracks = [
      {
        id: "track-1",
        title: "Neon Horizon",
        artist: "Synthwave Collective",
        category: "Upbeat",
        duration: 165,
        url: "https://example.com/track1.mp3",
        coverArt: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockPrisma.musicTrack.findMany.mockResolvedValue(mockTracks);

    const request = new NextRequest(
      "http://localhost:3000/api/music?category=Upbeat"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(1);
    expect(mockPrisma.musicTrack.findMany).toHaveBeenCalledWith({
      where: { isActive: true, category: "Upbeat" },
      orderBy: [{ category: "asc" }, { title: "asc" }],
    });
  });

  it("searches tracks by title and artist", async () => {
    const mockTracks = [
      {
        id: "track-1",
        title: "Neon Horizon",
        artist: "Synthwave Collective",
        category: "Upbeat",
        duration: 165,
        url: "https://example.com/track1.mp3",
        coverArt: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockPrisma.musicTrack.findMany.mockResolvedValue(mockTracks);

    const request = new NextRequest(
      "http://localhost:3000/api/music?search=Neon"
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockPrisma.musicTrack.findMany).toHaveBeenCalledWith({
      where: {
        isActive: true,
        OR: [
          { title: { contains: "Neon", mode: "insensitive" } },
          { artist: { contains: "Neon", mode: "insensitive" } },
        ],
      },
      orderBy: [{ category: "asc" }, { title: "asc" }],
    });
  });

  it("returns empty array when no tracks found", async () => {
    mockPrisma.musicTrack.findMany.mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/music");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(0);
    expect(data.meta.total).toBe(0);
  });

  it("handles database errors gracefully", async () => {
    mockPrisma.musicTrack.findMany.mockRejectedValue(
      new Error("Database error")
    );

    const request = new NextRequest("http://localhost:3000/api/music");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error.code).toBe("INTERNAL_ERROR");
    expect(data.error.message).toBe("Failed to fetch music tracks");
  });
});