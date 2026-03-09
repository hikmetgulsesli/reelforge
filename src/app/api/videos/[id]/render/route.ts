import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { renderQueue } from "@/lib/queue";

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

    // Get video from database
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Video not found" } },
        { status: 404 }
      );
    }

    // Check ownership
    if (video.project.user.email !== session.user.email) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Access denied" } },
        { status: 403 }
      );
    }

    // Add render job to queue
    await renderQueue.add("render-video", {
      videoId: id,
      script: video.script,
      style: video.style,
      voiceId: video.voiceId,
      subtitles: video.subtitles,
      music: video.music,
    });

    // Update video status
    await prisma.video.update({
      where: { id },
      data: { status: "RENDERING" },
    });

    return NextResponse.json({
      data: {
        message: "Rendering started",
        videoId: id,
      },
    });
  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to start rendering" } },
      { status: 500 }
    );
  }
}
