import { renderQueue, redisConnection, PipelineStage, calculateOverallProgress } from "../lib/queue.js";
import { prisma } from "../lib/prisma.js";

describe("Render Pipeline", () => {
  // Test user and video
  let testUser: any;
  let testVideo: any;

  beforeAll(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: "test-render-pipeline@example.com",
        name: "Test Render Pipeline User",
        password: "hashedpassword123",
        credits: 100,
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    if (testVideo) {
      await prisma.renderJob.deleteMany({
        where: { videoId: testVideo.id },
      });
      await prisma.video.deleteMany({
        where: { id: testVideo.id },
      });
    }
    if (testUser) {
      await prisma.user.deleteMany({
        where: { id: testUser.id },
      });
    }
    await renderQueue.close();
    await redisConnection.quit();
  });

  describe("Queue Configuration", () => {
    it("should have Redis connection configured", () => {
      expect(redisConnection).toBeDefined();
      expect(process.env.REDIS_URL).toBeDefined();
    });

    it("should have render queue initialized", () => {
      expect(renderQueue).toBeDefined();
      expect(renderQueue.name).toBe("video-render");
    });
  });

  describe("Progress Calculation", () => {
    it("should calculate correct overall progress for first stage", () => {
      const progress = calculateOverallProgress(PipelineStage.SCRIPT_GENERATION, 0);
      expect(progress).toBe(0);
    });

    it("should calculate correct overall progress for halfway through first stage", () => {
      const progress = calculateOverallProgress(PipelineStage.SCRIPT_GENERATION, 50);
      expect(progress).toBe(5); // 10 * 0.5 = 5
    });

    it("should calculate correct overall progress for completed first stage", () => {
      const progress = calculateOverallProgress(PipelineStage.SCRIPT_GENERATION, 100);
      expect(progress).toBe(10);
    });

    it("should calculate correct overall progress for second stage", () => {
      const progress = calculateOverallProgress(PipelineStage.IMAGE_GENERATION, 0);
      expect(progress).toBe(10); // First stage complete
    });

    it("should calculate correct overall progress for halfway through second stage", () => {
      const progress = calculateOverallProgress(PipelineStage.IMAGE_GENERATION, 50);
      expect(progress).toBe(22); // 10 + (25 * 0.5) = 22.5 ≈ 22
    });

    it("should reach 100% progress at final stage", () => {
      const progress = calculateOverallProgress(PipelineStage.S3_UPLOAD, 100);
      expect(progress).toBe(100);
    });
  });

  describe("Video Creation", () => {
    it("should create a video with draft status", async () => {
      testVideo = await prisma.video.create({
        data: {
          userId: testUser.id,
          title: "Test Render Video",
          description: "A test video for render pipeline",
          script: "This is a test script for the video.",
          style: "cinematic",
          voice_type: "turkish-female-1",
          music_track: "upbeat-pop",
          status: "draft",
          creditsUsed: 0,
        },
      });

      expect(testVideo).toBeDefined();
      expect(testVideo.id).toBeDefined();
      expect(testVideo.status).toBe("draft");
      expect(testVideo.title).toBe("Test Render Video");
    });

    it("should store all video fields correctly", async () => {
      const video = await prisma.video.findUnique({
        where: { id: testVideo.id },
      });

      expect(video?.script).toBe("This is a test script for the video.");
      expect(video?.style).toBe("cinematic");
      expect(video?.voice_type).toBe("turkish-female-1");
      expect(video?.music_track).toBe("upbeat-pop");
    });
  });

  describe("Render Job Creation", () => {
    it("should create a render job for video", async () => {
      const renderJob = await prisma.renderJob.create({
        data: {
          videoId: testVideo.id,
          user_id: testUser.id,
          status: "PENDING",
          progress: 0,
          attempts: 0,
          job_data: {
            stage: "script_generation",
            currentStage: 1,
            totalStages: 7,
            stageProgress: 0,
          },
        },
      });

      expect(renderJob).toBeDefined();
      expect(renderJob.id).toBeDefined();
      expect(renderJob.videoId).toBe(testVideo.id);
      expect(renderJob.user_id).toBe(testUser.id);
      expect(renderJob.status).toBe("PENDING");
      expect(renderJob.attempts).toBe(0);
    });

    it("should retrieve render jobs for a video", async () => {
      const jobs = await prisma.renderJob.findMany({
        where: { videoId: testVideo.id },
      });

      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0].videoId).toBe(testVideo.id);
    });
  });

  describe("Pipeline Stages Enum", () => {
    it("should have all 7 pipeline stages defined", () => {
      const stages = Object.values(PipelineStage);
      expect(stages).toHaveLength(7);
      expect(stages).toContain("script_generation");
      expect(stages).toContain("image_generation");
      expect(stages).toContain("voice_synthesis");
      expect(stages).toContain("subtitle_generation");
      expect(stages).toContain("video_assembly");
      expect(stages).toContain("quality_check");
      expect(stages).toContain("s3_upload");
    });
  });
});
