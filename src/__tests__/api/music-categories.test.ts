import { GET } from "@/app/api/music/categories/route";
import { prisma } from "@/lib/db";

// Mock prisma
jest.mock("@/lib/db", () => ({
  prisma: {
    musicTrack: {
      groupBy: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("GET /api/music/categories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all categories with track counts", async () => {
    const mockCategories = [
      { category: "Upbeat", _count: { category: 25 } },
      { category: "Chill", _count: { category: 18 } },
      { category: "Epic", _count: { category: 12 } },
    ];

    mockPrisma.musicTrack.groupBy.mockResolvedValue(mockCategories as never[]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(3);
    expect(data.data[0]).toEqual({
      id: "upbeat",
      name: "Upbeat",
      count: 25,
    });
    expect(data.data[1]).toEqual({
      id: "chill",
      name: "Chill",
      count: 18,
    });
    expect(data.meta.total).toBe(3);
  });

  it("returns empty array when no categories exist", async () => {
    mockPrisma.musicTrack.groupBy.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(0);
    expect(data.meta.total).toBe(0);
  });

  it("handles database errors gracefully", async () => {
    mockPrisma.musicTrack.groupBy.mockRejectedValue(
      new Error("Database error")
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error.code).toBe("INTERNAL_ERROR");
    expect(data.error.message).toBe("Failed to fetch music categories");
  });

  it("only includes active tracks in category counts", async () => {
    mockPrisma.musicTrack.groupBy.mockResolvedValue([]);

    await GET();

    expect(mockPrisma.musicTrack.groupBy).toHaveBeenCalledWith({
      by: ["category"],
      where: { isActive: true },
      _count: { category: true },
      orderBy: { category: "asc" },
    });
  });
});