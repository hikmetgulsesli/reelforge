import { prisma } from "../lib/prisma.js";
import { GET as getProgress } from "../app/api/videos/[id]/progress/route.js";
import { POST as startRender } from "../app/api/videos/[id]/render/route.js";
import { GET as listVideos, POST as createVideo } from "../app/api/videos/route.js";

// Mock next-auth
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from "next-auth/next";

describe("Video API Endpoints", () => {
  let testUser: any;
  let testVideo: any;
  const mockedGetServerSession = getServerSession as jest.MockedFunction<
    typeof getServerSession
  >;

  beforeAll(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: "test-api@example.com",
        name: "Test API User",
        password: "hashedpassword123",
        credits: 100,
      },
    });
  });

  afterAll(async () => {
    // Clean up
    if (testVideo) {
      await prisma.renderJob.deleteMany({ where: { videoId: testVideo.id } });
      await prisma.video.deleteMany({ where: { id: testVideo.id } });
    }
    if (testUser) {
      await prisma.user.deleteMany({ where: { id: testUser.id } });
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/videos", () => {
    it("should create a video with valid data", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { email: testUser.email },
      });

      const request = new Request("http://localhost:3000/api/videos", {
        method: "POST",
        body: JSON.stringify({
          title: "Test Video",
          description: "Test Description",
          script: "Test Script",
          style: "cinematic",
        }),
      });

      const response = await createVideo(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data.title).toBe("Test Video");
      expect(data.data.status).toBe("draft");
      expect(data.data.id).toBeDefined();

      testVideo = data.data;
    });

    it("should return 401 when not authenticated", async () => {
      mockedGetServerSession.mockResolvedValue(null);

      const request = new Request("http://localhost:3000/api/videos", {
        method: "POST",
        body: JSON.stringify({ title: "Test" }),
      });

      const response = await createVideo(request);

      expect(response.status).toBe(401);
    });

    it("should return 400 for missing title", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { email: testUser.email },
      });

      const request = new Request("http://localhost:3000/api/videos", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await createVideo(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /api/videos", () => {
    it("should list user's videos", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { email: testUser.email },
      });

      const request = new Request("http://localhost:3000/api/videos");

      const response = await listVideos(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.meta).toBeDefined();
      expect(data.meta.total).toBeGreaterThanOrEqual(1);
    });

    it("should support pagination", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { email: testUser.email },
      });

      const request = new Request(
        "http://localhost:3000/api/videos?page=1&limit=10"
      );

      const response = await listVideos(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.meta.page).toBe(1);
      expect(data.meta.limit).toBe(10);
    });

    it("should filter by status", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { email: testUser.email },
      });

      const request = new Request(
        "http://localhost:3000/api/videos?status=draft"
      );

      const response = await listVideos(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.every((v: any) => v.status === "draft")).toBe(true);
    });
  });

  describe("GET /api/videos/:id/progress", () => {
    it("should return video progress", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { email: testUser.email },
      });

      const request = new Request(
        `http://localhost:3000/api/videos/${testVideo.id}/progress`
      );

      const response = await getProgress(request, {
        params: Promise.resolve({ id: testVideo.id }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.videoId).toBe(testVideo.id);
      expect(data.data.status).toBeDefined();
      expect(data.data.progress).toBeDefined();
    });

    it("should return 404 for non-existent video", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { email: testUser.email },
      });

      const request = new Request(
        "http://localhost:3000/api/videos/nonexistent/progress"
      );

      const response = await getProgress(request, {
        params: Promise.resolve({ id: "nonexistent" }),
      });

      expect(response.status).toBe(404);
    });

    it("should return 403 for unauthorized access", async () => {
      const otherUser = await prisma.user.create({
        data: {
          email: "other@example.com",
          name: "Other User",
          password: "hashed",
          credits: 0,
        },
      });

      mockedGetServerSession.mockResolvedValue({
        user: { email: otherUser.email },
      });

      const request = new Request(
        `http://localhost:3000/api/videos/${testVideo.id}/progress`
      );

      const response = await getProgress(request, {
        params: Promise.resolve({ id: testVideo.id }),
      });

      expect(response.status).toBe(403);

      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("POST /api/videos/:id/render", () => {
    it("should queue video for rendering", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { email: testUser.email },
      });

      const request = new Request(
        `http://localhost:3000/api/videos/${testVideo.id}/render`,
        { method: "POST" }
      );

      const response = await startRender(request, {
        params: Promise.resolve({ id: testVideo.id }),
      });
      const data = await response.json();

      expect(response.status).toBe(202);
      expect(data.data.status).toBe("QUEUED");
      expect(data.data.jobId).toBeDefined();
      expect(data.data.queueJobId).toBeDefined();
    });

    it("should return 409 if video is already processing", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { email: testUser.email },
      });

      const request = new Request(
        `http://localhost:3000/api/videos/${testVideo.id}/render`,
        { method: "POST" }
      );

      const response = await startRender(request, {
        params: Promise.resolve({ id: testVideo.id }),
      });

      expect(response.status).toBe(409);
    });

    it("should return 401 when not authenticated", async () => {
      mockedGetServerSession.mockResolvedValue(null);

      const request = new Request(
        `http://localhost:3000/api/videos/${testVideo.id}/render`,
        { method: "POST" }
      );

      const response = await startRender(request, {
        params: Promise.resolve({ id: testVideo.id }),
      });

      expect(response.status).toBe(401);
    });
  });
});
