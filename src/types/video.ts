// Video types matching Prisma schema
export type VideoStatus =
  | "draft"
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type JobStatus =
  | "PENDING"
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type PipelineStage =
  | "script_generation"
  | "image_generation"
  | "voice_synthesis"
  | "subtitle_generation"
  | "video_assembly"
  | "quality_check"
  | "s3_upload";

// Video model
export interface Video {
  id: string;
  title: string;
  description: string | null;
  script: string | null;
  status: VideoStatus;
  style: string | null;
  voice_type: string | null;
  music_track: string | null;
  thumbnailUrl: string | null;
  video_url: string | null;
  duration: number | null;
  creditsUsed: number;
  userId: string;
  series_id: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  createdAt: string;
  updatedAt: string;
}

// Render job model
export interface RenderJob {
  id: string;
  status: JobStatus;
  progress: number;
  output_url: string | null;
  error: string | null;
  job_data: {
    stage?: PipelineStage;
    currentStage?: number;
    totalStages?: number;
    stageProgress?: number;
  } | null;
  worker_id: string | null;
  attempts: number;
  videoId: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

// Progress update
export interface VideoProgress {
  videoId: string;
  status: VideoStatus;
  progress: number;
  stage: PipelineStage | null;
  currentStage: number | null;
  totalStages: number;
  stageProgress: number;
  jobStatus: JobStatus | null;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  s3Url: string | null;
  thumbnailUrl: string | null;
}

// Render request
export interface RenderRequest {
  videoId: string;
}

// Render response
export interface RenderResponse {
  videoId: string;
  jobId: string;
  queueJobId: string;
  status: "QUEUED";
  message: string;
}

// Create video request
export interface CreateVideoRequest {
  title: string;
  description?: string;
  script?: string;
  style?: string;
  voice_type?: string;
  music_track?: string;
}

// List videos response
export interface ListVideosResponse {
  data: Video[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
