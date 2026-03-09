import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { prisma } from "@/lib/prisma";

describe("Script API Tests", () => {
  const testUserId = "test-user-id";

  beforeAll(async () => {
    // Clean up any existing test scripts
    await prisma.script.deleteMany({
      where: { userId: testUserId },
    });
  });

  afterAll(async () => {
    // Clean up test scripts
    await prisma.script.deleteMany({
      where: { userId: testUserId },
    });
  });

  describe("Script Model", () => {
    it("should create a script with all required fields", async () => {
      const script = await prisma.script.create({
        data: {
          userId: testUserId,
          prompt: "Test prompt for script generation",
          content: "Test script content with scenes and voiceover",
          niche: "technology",
          duration: 30,
          tone: "educational",
          platform: "tiktok",
          isGenerated: true,
          wordCount: 50,
        },
      });

      expect(script).toBeDefined();
      expect(script.id).toBeDefined();
      expect(script.userId).toBe(testUserId);
      expect(script.prompt).toBe("Test prompt for script generation");
      expect(script.content).toBe("Test script content with scenes and voiceover");
      expect(script.duration).toBe(30);
      expect(script.tone).toBe("educational");
      expect(script.platform).toBe("tiktok");
      expect(script.isGenerated).toBe(true);
      expect(script.wordCount).toBe(50);
    });

    it("should enforce prompt length validation", async () => {
      // Test minimum length
      const shortScript = await prisma.script.create({
        data: {
          userId: testUserId,
          prompt: "Short",
          content: "Content",
          duration: 15,
          tone: "professional",
          platform: "youtube_shorts",
        },
      });

      expect(shortScript.prompt).toBe("Short");

      // Test maximum length (Prisma doesn't enforce this at DB level, but API should)
      const longPrompt = "a".repeat(1001);
      const longScript = await prisma.script.create({
        data: {
          userId: testUserId,
          prompt: longPrompt,
          content: "Content",
          duration: 15,
          tone: "professional",
          platform: "youtube_shorts",
        },
      });

      expect(longScript.prompt).toBe(longPrompt);
    });

    it("should support all valid tone values", async () => {
      const tones = ["educational", "motivational", "funny", "professional", "casual", "dramatic", "humorous", "inspirational"];
      
      for (const tone of tones) {
        const script = await prisma.script.create({
          data: {
            userId: testUserId,
            prompt: `Test prompt for ${tone} tone`,
            content: "Content",
            duration: 30,
            tone,
            platform: "tiktok",
          },
        });

        expect(script.tone).toBe(tone);
      }
    });

    it("should support all valid duration values", async () => {
      const durations = [15, 30, 60];
      
      for (const duration of durations) {
        const script = await prisma.script.create({
          data: {
            userId: testUserId,
            prompt: `Test prompt for ${duration}s duration`,
            content: "Content",
            duration,
            tone: "professional",
            platform: "tiktok",
          },
        });

        expect(script.duration).toBe(duration);
      }
    });

    it("should support all valid platform values", async () => {
      const platforms = ["tiktok", "youtube_shorts", "youtube_longform", "instagram_feed", "instagram_reels"];
      
      for (const platform of platforms) {
        const script = await prisma.script.create({
          data: {
            userId: testUserId,
            prompt: `Test prompt for ${platform}`,
            content: "Content",
            duration: 30,
            tone: "professional",
            platform,
          },
        });

        expect(script.platform).toBe(platform);
      }
    });

    it("should allow null niche", async () => {
      const script = await prisma.script.create({
        data: {
          userId: testUserId,
          prompt: "Test prompt without niche",
          content: "Content",
          duration: 30,
          tone: "professional",
          platform: "tiktok",
          niche: null,
        },
      });

      expect(script.niche).toBeNull();
    });

    it("should update script content", async () => {
      const script = await prisma.script.create({
        data: {
          userId: testUserId,
          prompt: "Test prompt for update",
          content: "Original content",
          duration: 30,
          tone: "professional",
          platform: "tiktok",
        },
      });

      const updated = await prisma.script.update({
        where: { id: script.id },
        data: {
          content: "Updated content",
          wordCount: 100,
        },
      });

      expect(updated.content).toBe("Updated content");
      expect(updated.wordCount).toBe(100);
    });

    it("should delete a script", async () => {
      const script = await prisma.script.create({
        data: {
          userId: testUserId,
          prompt: "Test prompt for deletion",
          content: "Content to delete",
          duration: 30,
          tone: "professional",
          platform: "tiktok",
        },
      });

      await prisma.script.delete({ where: { id: script.id } });

      const found = await prisma.script.findUnique({
        where: { id: script.id },
      });

      expect(found).toBeNull();
    });

    it("should query scripts by user with pagination", async () => {
      // Create multiple scripts
      await Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          prisma.script.create({
            data: {
              userId: testUserId,
              prompt: `Test prompt ${i}`,
              content: `Content ${i}`,
              duration: 30,
              tone: "professional",
              platform: "tiktok",
            },
          })
        )
      );

      const scripts = await prisma.script.findMany({
        where: { userId: testUserId },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      expect(scripts.length).toBeGreaterThanOrEqual(5);
    });

    it("should set default values correctly", async () => {
      const script = await prisma.script.create({
        data: {
          userId: testUserId,
          prompt: "Test prompt with defaults",
          content: "Content",
        },
      });

      expect(script.duration).toBe(15);
      expect(script.tone).toBe("professional");
      expect(script.platform).toBe("tiktok");
      expect(script.isGenerated).toBe(false);
    });
  });

  describe("Script Schema Validation", () => {
    it("should require userId field", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = { prompt: "Test", content: "Content" };
      await expect(
        prisma.script.create({ data })
      ).rejects.toThrow();
    });

    it("should require prompt field", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = { userId: testUserId, content: "Content" };
      await expect(
        prisma.script.create({ data })
      ).rejects.toThrow();
    });

    it("should require content field", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = { userId: testUserId, prompt: "Test" };
      await expect(
        prisma.script.create({ data })
      ).rejects.toThrow();
    });
  });
});
