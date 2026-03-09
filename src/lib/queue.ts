import { Queue } from "bullmq";
import Redis from "ioredis";

// Redis connection
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Create Redis connection
export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Render queue configuration
export const RENDER_QUEUE_NAME = "video-render";

// Render job data interface
export interface RenderJobData {
  videoId: string;
  jobId: string;
  userId: string;
}

// Progress update interface
export interface ProgressUpdate {
  videoId: string;
  stage: PipelineStage;
  stageNumber: number;
  totalStages: number;
  stageProgress: number;
  overallProgress: number;
  status: "processing" | "completed" | "failed";
  message?: string;
}

// Pipeline stages
export enum PipelineStage {
  SCRIPT_GENERATION = "script_generation",
  IMAGE_GENERATION = "image_generation",
  VOICE_SYNTHESIS = "voice_synthesis",
  SUBTITLE_GENERATION = "subtitle_generation",
  VIDEO_ASSEMBLY = "video_assembly",
  QUALITY_CHECK = "quality_check",
  S3_UPLOAD = "s3_upload",
}

// Stage configuration
export const STAGE_CONFIG: Record<
  PipelineStage,
  { name: string; weight: number }
> = {
  [PipelineStage.SCRIPT_GENERATION]: { name: "Script Generation", weight: 10 },
  [PipelineStage.IMAGE_GENERATION]: { name: "Image Generation", weight: 25 },
  [PipelineStage.VOICE_SYNTHESIS]: { name: "Voice Synthesis", weight: 15 },
  [PipelineStage.SUBTITLE_GENERATION]: {
    name: "Subtitle Generation",
    weight: 10,
  },
  [PipelineStage.VIDEO_ASSEMBLY]: { name: "Video Assembly", weight: 25 },
  [PipelineStage.QUALITY_CHECK]: { name: "Quality Check", weight: 10 },
  [PipelineStage.S3_UPLOAD]: { name: "S3 Upload", weight: 5 },
};

// Calculate overall progress
export function calculateOverallProgress(
  currentStage: PipelineStage,
  stageProgress: number
): number {
  const stages = Object.values(PipelineStage);
  const currentStageIndex = stages.indexOf(currentStage);
  const completedStages = currentStageIndex;

  let completedWeight = 0;
  for (let i = 0; i < completedStages; i++) {
    completedWeight += STAGE_CONFIG[stages[i]].weight;
  }

  const currentStageWeight = STAGE_CONFIG[currentStage].weight;
  const currentStageContribution = (stageProgress / 100) * currentStageWeight;

  return Math.round(completedWeight + currentStageContribution);
}

// Create render queue
export const renderQueue = new Queue<RenderJobData>(RENDER_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep for 24 hours
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep for 7 days
    },
  },
});

// Progress update channel
export const PROGRESS_CHANNEL = "video:progress";

// Publish progress update
export async function publishProgress(update: ProgressUpdate): Promise<void> {
  await redisConnection.publish(PROGRESS_CHANNEL, JSON.stringify(update));
}

// Close connections gracefully
export async function closeQueueConnections(): Promise<void> {
  await renderQueue.close();
  await redisConnection.quit();
}

// Type for job data stored in Json field
export interface RenderJobMetadata {
  stage?: PipelineStage;
  currentStage?: number;
  totalStages?: number;
  stageProgress?: number;
}