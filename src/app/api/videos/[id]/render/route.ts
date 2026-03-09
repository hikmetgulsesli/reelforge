import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { renderQueue } from "@/lib/queue";
import { randomUUID } from "crypto";

// POST /api/videos/:id/render - Start video rendering
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: { code: "USER_NOT_FOUND", message: "User not found" } },
        { status: 404 }
      );
    }

    // Get video from database
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Video not found" } },
        { status: 404 }
      );
    }

    // Check ownership
    if (video.userId !== user.id) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Access denied" } },
        { status: 403 }
      );
    }

    // Check if video is already rendering
    if (video.status === "processing" || video.status === "rendering") {
      return NextResponse.json(
        {
          error: {
            code: "ALREADY_RENDERING",
            message: "Video is already being rendered",
          },
        },
        { status: 400 }
      );
    }

    // Create render job record
    const jobId = randomUUID();
    const renderJob = await prisma.renderJob.create({
      data: {
        id: jobId,
        videoId: id,
        userId: user.id,
        status: "PENDING",
        progress: 0,
        attempts: 0,
      },
    });

    // Add render job to queue
    await renderQueue.add("render-video", {
      videoId: id,
      jobId: jobId,
      userId: user.id,
    });

    // Update video status
    await prisma.video.update({
      where: { id },
      data: { status: "rendering" },
    });

    return NextResponse.json({
      data: {
        message: "Rendering started",
        videoId: id,
        jobId: renderJob.id,
        status: "rendering",
      },
    });
  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      {
        error: { code: "INTERNAL_ERROR", message: "Failed to start rendering" },
      },
      { status: 500 }
    );
  }
}