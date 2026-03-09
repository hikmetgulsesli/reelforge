import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { prisma } from "../lib/prisma";

describe("A/B Testing Module", () => {
  const testUserId = "test-user-ab";
  
  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.aBVariant.deleteMany({
      where: {
        test: {
          userId: testUserId,
        },
      },
    });
    await prisma.abTest.deleteMany({
      where: { userId: testUserId },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.aBVariant.deleteMany({
      where: {
        test: {
          userId: testUserId,
        },
      },
    });
    await prisma.abTest.deleteMany({
      where: { userId: testUserId },
    });
    await prisma.$disconnect();
  });

  describe("ABTest CRUD Operations", () => {
    let testId: string;

    it("should create an A/B test with variants", async () => {
      const test = await prisma.abTest.create({
        data: {
          name: "Thumbnail Test",
          description: "Testing different thumbnail styles",
          status: "DRAFT",
          userId: testUserId,
          videoId: "video-123",
          variants: {
            create: [
              { name: "Control", isControl: true },
              { name: "Variant B", isControl: false },
            ],
          },
        },
        include: {
          variants: true,
        },
      });

      expect(test).toBeDefined();
      expect(test.name).toBe("Thumbnail Test");
      expect(test.description).toBe("Testing different thumbnail styles");
      expect(test.status).toBe("DRAFT");
      expect(test.variants).toHaveLength(2);
      expect(test.variants[0].isControl).toBe(true);
      expect(test.variants[1].isControl).toBe(false);
      
      testId = test.id;
    });

    it("should retrieve an A/B test with variants", async () => {
      const test = await prisma.abTest.findUnique({
        where: { id: testId },
        include: {
          variants: true,
        },
      });

      expect(test).toBeDefined();
      expect(test?.name).toBe("Thumbnail Test");
      expect(test?.variants).toHaveLength(2);
    });

    it("should update an A/B test", async () => {
      const updated = await prisma.abTest.update({
        where: { id: testId },
        data: {
          name: "Updated Thumbnail Test",
          status: "RUNNING",
        },
      });

      expect(updated.name).toBe("Updated Thumbnail Test");
      expect(updated.status).toBe("RUNNING");
    });

    it("should list all A/B tests", async () => {
      const tests = await prisma.abTest.findMany({
        where: { userId: testUserId },
        include: {
          variants: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      expect(tests.length).toBeGreaterThan(0);
      expect(tests[0].name).toBe("Updated Thumbnail Test");
    });

    it("should delete an A/B test (cascades to variants)", async () => {
      // Create test to delete
      const toDelete = await prisma.abTest.create({
        data: {
          name: "Test to Delete",
          userId: testUserId,
          variants: {
            create: [{ name: "Variant" }],
          },
        },
      });

      await prisma.abTest.delete({
        where: { id: toDelete.id },
      });

      const deleted = await prisma.abTest.findUnique({
        where: { id: toDelete.id },
      });

      expect(deleted).toBeNull();
    });
  });

  describe("ABVariant Metrics", () => {
    let testId: string;
    let variantId: string;

    beforeEach(async () => {
      const test = await prisma.abTest.create({
        data: {
          name: "Metrics Test",
          userId: testUserId,
          variants: {
            create: [
              { name: "Control", isControl: true },
              { name: "Variant B", isControl: false },
            ],
          },
        },
        include: {
          variants: true,
        },
      });
      
      testId = test.id;
      variantId = test.variants[0].id;
    });

    afterEach(async () => {
      await prisma.aBVariant.deleteMany({
        where: {
          test: {
            userId: testUserId,
          },
        },
      });
      await prisma.abTest.deleteMany({
        where: { userId: testUserId },
      });
    });

    it("should track impressions", async () => {
      const updated = await prisma.aBVariant.update({
        where: { id: variantId },
        data: {
          impressions: { increment: 100 },
        },
      });

      expect(updated.impressions).toBe(100);
    });

    it("should track views", async () => {
      const updated = await prisma.aBVariant.update({
        where: { id: variantId },
        data: {
          views: { increment: 50 },
        },
      });

      expect(updated.views).toBe(50);
    });

    it("should track clicks", async () => {
      const updated = await prisma.aBVariant.update({
        where: { id: variantId },
        data: {
          clicks: { increment: 10 },
        },
      });

      expect(updated.clicks).toBe(10);
    });

    it("should calculate CTR correctly", async () => {
      // First set impressions and clicks
      await prisma.aBVariant.update({
        where: { id: variantId },
        data: {
          impressions: 1000,
          clicks: 50,
        },
      });

      const variant = await prisma.aBVariant.findUnique({
        where: { id: variantId },
      });

      // CTR = (clicks / impressions) * 100 = (50/1000) * 100 = 5%
      expect(variant?.ctr).toBe(5.0);
    });

    it("should update retention rate", async () => {
      const updated = await prisma.aBVariant.update({
        where: { id: variantId },
        data: {
          retention: 45.5,
        },
      });

      expect(updated.retention).toBe(45.5);
    });
  });

  describe("A/B Test Status Transitions", () => {
    let testId: string;

    beforeEach(async () => {
      const test = await prisma.abTest.create({
        data: {
          name: "Status Test",
          userId: testUserId,
          status: "DRAFT",
          variants: {
            create: [
              { name: "Control" },
              { name: "Variant" },
            ],
          },
        },
      });
      testId = test.id;
    });

    afterEach(async () => {
      await prisma.aBVariant.deleteMany({
        where: {
          test: {
            userId: testUserId,
          },
        },
      });
      await prisma.abTest.deleteMany({
        where: { userId: testUserId },
      });
    });

    it("should transition from DRAFT to RUNNING", async () => {
      const updated = await prisma.abTest.update({
        where: { id: testId },
        data: {
          status: "RUNNING",
          startDate: new Date(),
        },
      });

      expect(updated.status).toBe("RUNNING");
      expect(updated.startDate).toBeDefined();
    });

    it("should transition from RUNNING to PAUSED", async () => {
      await prisma.abTest.update({
        where: { id: testId },
        data: { status: "RUNNING" },
      });

      const updated = await prisma.abTest.update({
        where: { id: testId },
        data: { status: "PAUSED" },
      });

      expect(updated.status).toBe("PAUSED");
    });

    it("should transition from RUNNING to COMPLETED", async () => {
      await prisma.abTest.update({
        where: { id: testId },
        data: { status: "RUNNING" },
      });

      const test = await prisma.abTest.findUnique({
        where: { id: testId },
        include: { variants: true },
      });

      const winnerId = test?.variants[1].id;

      const updated = await prisma.abTest.update({
        where: { id: testId },
        data: {
          status: "COMPLETED",
          endDate: new Date(),
          winnerId,
        },
      });

      expect(updated.status).toBe("COMPLETED");
      expect(updated.endDate).toBeDefined();
      expect(updated.winnerId).toBe(winnerId);
    });
  });

  describe("Statistical Calculations", () => {
    it("should identify winning variant by highest CTR", async () => {
      const test = await prisma.abTest.create({
        data: {
          name: "Statistical Test",
          userId: testUserId,
          variants: {
            create: [
              { name: "Control", impressions: 1000, clicks: 40, ctr: 4.0, isControl: true },
              { name: "Variant B", impressions: 1000, clicks: 60, ctr: 6.0, isControl: false },
            ],
          },
        },
        include: {
          variants: true,
        },
      });

      const variants = test.variants;
      const winner = variants.reduce((best, current) => 
        current.ctr > best.ctr ? current : best
      );

      expect(winner.name).toBe("Variant B");
      expect(winner.ctr).toBe(6.0);

      // Update test with winner
      await prisma.abTest.update({
        where: { id: test.id },
        data: {
          status: "COMPLETED",
          winnerId: winner.id,
        },
      });

      // Clean up
      await prisma.aBVariant.deleteMany({ where: { testId: test.id } });
      await prisma.abTest.delete({ where: { id: test.id } });
    });
  });
});
