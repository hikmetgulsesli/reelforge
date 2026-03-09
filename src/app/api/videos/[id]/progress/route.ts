import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { PipelineStage } from "@/lib/queue";

// GET /api/videos/:id/progress - Get video render progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        },
        { status: 401 }
      );
    }

    const { id: videoId } = await params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: "USER_NOT_FOUND",
            message: "User not found",
          },
        },
        { status: 404 }
      );
    }

    // Get video with render jobs
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        renderJobs: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!video) {
      return NextResponse.json(
        {
          error: {
            code: "VIDEO_NOT_FOUND",
            message: "Video not found",
          },
        },
        { status: 404 }
      );
    }

    // Check ownership
    if (video.userId !== user.id) {
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to view this video",
          },
        },
        { status: 403 }
      );
    }

    const renderJob = video.renderJobs[0];
    const jobData = (renderJob?.job_data || {}) as {
      stage?: PipelineStage;
      currentStage?: number;
      totalStages?: number;
      stageProgress?: number;
    };

    return NextResponse.json({
      data: {
        videoId: video.id,
        status: video.status,
        progress: renderJob?.progress || video.status === "completed" ? 100 : 0,
        stage: jobData.stage || null,
        currentStage: jobData.currentStage || null,
        totalStages: jobData.totalStages || 7,
        stageProgress: jobData.stageProgress || 0,
        jobStatus: renderJob?.status || null,
        errorMessage: renderJob?.error || null,
        startedAt: renderJob?.startedAt?.toISOString() || null,
        completedAt: renderJob?.completedAt?.toISOString() || null,
        s3Url: video.video_url,
        thumbnailUrl: video.thumbnailUrl,
      },
    });
  } catch (error) {
    console.error("Error getting progress:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to get video progress",
        },
      },
      { status: 500 }
    );
  }
}
