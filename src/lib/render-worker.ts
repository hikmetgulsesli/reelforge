import { Worker, Job } from "bullmq";
import { prisma } from "./prisma.js";
import {
  RenderJobData,
  PipelineStage,
  calculateOverallProgress,
  publishProgress,
  redisConnection,
  RENDER_QUEUE_NAME,
  RenderJobMetadata,
} from "./queue.js";

// Worker instance
let renderWorker: Worker<RenderJobData> | null = null;

// Stage handlers
const stageHandlers: Record<
  PipelineStage,
  (job: Job<RenderJobData>, video: any, renderJob: any) => Promise<void>
> = {
  [PipelineStage.SCRIPT_GENERATION]: handleScriptGeneration,
  [PipelineStage.IMAGE_GENERATION]: handleImageGeneration,
  [PipelineStage.VOICE_SYNTHESIS]: handleVoiceSynthesis,
  [PipelineStage.SUBTITLE_GENERATION]: handleSubtitleGeneration,
  [PipelineStage.VIDEO_ASSEMBLY]: handleVideoAssembly,
  [PipelineStage.QUALITY_CHECK]: handleQualityCheck,
  [PipelineStage.S3_UPLOAD]: handleS3Upload,
};

// Process job
async function processJob(job: Job<RenderJobData>): Promise<void> {
  const { videoId, jobId, userId } = job.data;

  // Get video and render job
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    throw new Error(`Video not found: ${videoId}`);
  }

  const renderJob = await prisma.renderJob.findUnique({
    where: { id: jobId },
  });

  if (!renderJob) {
    throw new Error(`Render job not found: ${jobId}`);
  }

  // Update job status
  await prisma.renderJob.update({
    where: { id: jobId },
    data: {
      status: "PROCESSING",
      startedAt: new Date(),
      worker_id: process.env.WORKER_ID || "worker-1",
    },
  });

  // Update video status
  await prisma.video.update({
    where: { id: videoId },
    data: {
      status: "processing",
    },
  });

  // Process each stage
  const stages = Object.values(PipelineStage);

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const stageNumber = i + 1;
    const stageProgress = 0;

    // Update job metadata
    const jobData: RenderJobMetadata = {
      stage,
      currentStage: stageNumber,
      totalStages: stages.length,
      stageProgress,
    };

    await prisma.renderJob.update({
      where: { id: jobId },
      data: {
        job_data: jobData as any,
        progress: calculateOverallProgress(stage, 0),
      },
    });

    // Publish progress update
    await publishProgress({
      videoId,
      stage,
      stageNumber,
      totalStages: stages.length,
      stageProgress: 0,
      overallProgress: calculateOverallProgress(stage, 0),
      status: "processing",
      message: `Starting ${stage}...`,
    });

    try {
      // Execute stage handler
      await stageHandlers[stage](job, video, renderJob);

      // Mark stage as complete
      await prisma.renderJob.update({
        where: { id: jobId },
        data: {
          progress: calculateOverallProgress(stage, 100),
          job_data: {
            ...jobData,
            stageProgress: 100,
          } as any,
        },
      });

      await publishProgress({
        videoId,
        stage,
        stageNumber,
        totalStages: stages.length,
        stageProgress: 100,
        overallProgress: calculateOverallProgress(stage, 100),
        status: "completed",
        message: `${stage} completed`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Update job with error
      await prisma.renderJob.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          error: errorMessage,
          completedAt: new Date(),
          attempts: { increment: 1 },
        },
      });

      // Update video with error
      await prisma.video.update({
        where: { id: videoId },
        data: {
          status: "failed",
        },
      });

      // Publish failure
      await publishProgress({
        videoId,
        stage,
        stageNumber,
        totalStages: stages.length,
        stageProgress: 0,
        overallProgress: calculateOverallProgress(stage, 0),
        status: "failed",
        message: `${stage} failed: ${errorMessage}`,
      });

      throw error;
    }
  }

  // Mark job as completed
  await prisma.renderJob.update({
    where: { id: jobId },
    data: {
      status: "COMPLETED",
      progress: 100,
      completedAt: new Date(),
    },
  });

  // Mark video as completed
  await prisma.video.update({
    where: { id: videoId },
    data: {
      status: "completed",
      video_url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/videos/${videoId}/final-video.mp4`,
      thumbnailUrl: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/videos/${videoId}/thumbnail.jpg`,
    },
  });

  // Publish final progress
  await publishProgress({
    videoId,
    stage: PipelineStage.S3_UPLOAD,
    stageNumber: stages.length,
    totalStages: stages.length,
    stageProgress: 100,
    overallProgress: 100,
    status: "completed",
    message: "Video render completed successfully",
  });
}

// Stage 1: Script Generation
async function handleScriptGeneration(
  job: Job<RenderJobData>,
  video: any,
  renderJob: any
): Promise<void> {
  await job.updateProgress({ stage: "script_generation", progress: 10 });

  // Simulate AI script generation
  await simulateWork(1000);
  await job.updateProgress({ stage: "script_generation", progress: 50 });

  // In real implementation, this would call an AI service
  const generatedScript =
    video.script || `Generated script for video: ${video.title}`;

  await simulateWork(1000);
  await job.updateProgress({ stage: "script_generation", progress: 100 });

  // Update video with script
  await prisma.video.update({
    where: { id: video.id },
    data: { script: generatedScript },
  });
}

// Stage 2: Image Generation
async function handleImageGeneration(
  job: Job<RenderJobData>,
  video: any,
  renderJob: any
): Promise<void> {
  const numImages = 5; // Number of images to generate

  for (let i = 0; i < numImages; i++) {
    const progress = Math.round(((i + 1) / numImages) * 100);
    await job.updateProgress({ stage: "image_generation", progress });

    // Simulate image generation
    await simulateWork(500);
  }
}

// Stage 3: Voice Synthesis
async function handleVoiceSynthesis(
  job: Job<RenderJobData>,
  video: any,
  renderJob: any
): Promise<void> {
  await job.updateProgress({ stage: "voice_synthesis", progress: 20 });
  await simulateWork(1000);

  await job.updateProgress({ stage: "voice_synthesis", progress: 60 });
  await simulateWork(1000);

  await job.updateProgress({ stage: "voice_synthesis", progress: 100 });
}

// Stage 4: Subtitle Generation
async function handleSubtitleGeneration(
  job: Job<RenderJobData>,
  video: any,
  renderJob: any
): Promise<void> {
  await job.updateProgress({ stage: "subtitle_generation", progress: 30 });
  await simulateWork(800);

  await job.updateProgress({ stage: "subtitle_generation", progress: 70 });
  await simulateWork(800);

  await job.updateProgress({ stage: "subtitle_generation", progress: 100 });
}

// Stage 5: Video Assembly
async function handleVideoAssembly(
  job: Job<RenderJobData>,
  video: any,
  renderJob: any
): Promise<void> {
  await job.updateProgress({ stage: "video_assembly", progress: 10 });
  await simulateWork(1000);

  await job.updateProgress({ stage: "video_assembly", progress: 40 });
  await simulateWork(1000);

  await job.updateProgress({ stage: "video_assembly", progress: 70 });
  await simulateWork(1000);

  await job.updateProgress({ stage: "video_assembly", progress: 100 });
}

// Stage 6: Quality Check
async function handleQualityCheck(
  job: Job<RenderJobData>,
  video: any,
  renderJob: any
): Promise<void> {
  await job.updateProgress({ stage: "quality_check", progress: 25 });
  await simulateWork(500);

  await job.updateProgress({ stage: "quality_check", progress: 50 });
  await simulateWork(500);

  await job.updateProgress({ stage: "quality_check", progress: 75 });
  await simulateWork(500);

  await job.updateProgress({ stage: "quality_check", progress: 100 });

  // Check quality (in real implementation, verify resolution, bitrate, etc.)
  const qualityPassed = true;

  if (!qualityPassed) {
    throw new Error("Quality check failed: Video does not meet requirements");
  }
}

// Stage 7: S3 Upload
async function handleS3Upload(
  job: Job<RenderJobData>,
  video: any,
  renderJob: any
): Promise<void> {
  await job.updateProgress({ stage: "s3_upload", progress: 30 });
  await simulateWork(800);

  await job.updateProgress({ stage: "s3_upload", progress: 70 });
  await simulateWork(800);

  await job.updateProgress({ stage: "s3_upload", progress: 100 });
}

// Simulate work (for testing/development)
function simulateWork(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Create and start worker
export function createRenderWorker(): Worker<RenderJobData> {
  if (renderWorker) {
    return renderWorker;
  }

  renderWorker = new Worker<RenderJobData>(
    RENDER_QUEUE_NAME,
    async (job) => {
      await processJob(job);
    },
    {
      connection: redisConnection,
      concurrency: 2, // Process 2 jobs concurrently
      stalledInterval: 30000,
      maxStalledCount: 2,
    }
  );

  // Event handlers
  renderWorker.on("completed", (job) => {
    console.log(`Render job ${job.id} completed`);
  });

  renderWorker.on("failed", (job, err) => {
    console.error(`Render job ${job?.id} failed:`, err);
  });

  renderWorker.on("stalled", (jobId) => {
    console.warn(`Render job ${jobId} stalled`);
  });

  return renderWorker;
}

// Stop worker
export async function stopRenderWorker(): Promise<void> {
  if (renderWorker) {
    await renderWorker.close();
    renderWorker = null;
  }
}

// Get worker status
export function getWorkerStatus(): {
  isRunning: boolean;
} {
  return {
    isRunning: renderWorker !== null,
  };
}
