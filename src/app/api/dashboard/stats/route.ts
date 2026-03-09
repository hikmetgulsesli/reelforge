import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get or create user credits
    let userCredits = await prisma.userCredits.findUnique({
      where: { userId },
    });

    if (!userCredits) {
      // Create default credits for new user (Free plan: 3 videos)
      userCredits = await prisma.userCredits.create({
        data: {
          userId,
          totalCredits: 3,
          usedCredits: 0,
          plan: "free",
        },
      });
    }

    // Get total videos count
    const totalVideos = await prisma.video.count({
      where: { userId },
    });

    // Get videos this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const videosThisMonth = await prisma.video.count({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
    });

    // Get weekly renders
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyRenders = await prisma.renderJob.count({
      where: {
        userId,
        createdAt: { gte: startOfWeek },
      },
    });

    // Get favorite style
    const styleCounts = await prisma.video.groupBy({
      by: ["style"],
      where: {
        userId,
        style: { not: null },
      },
      _count: { style: true },
      orderBy: { _count: { style: "desc" } },
      take: 1,
    });

    const favoriteStyle = styleCounts[0]?.style || null;

    // Get recent videos
    const recentVideos = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        status: true,
        createdAt: true,
      },
    });

    // Get recent series
    const recentSeries = await prisma.series.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        description: true,
        videoCount: true,
        createdAt: true,
      },
    });

    // Get active render job
    const activeJob = await prisma.renderJob.findFirst({
      where: {
        userId,
        status: "processing",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        progress: true,
        stage: true,
        startedAt: true,
        video: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      credits: {
        total: userCredits.totalCredits,
        used: userCredits.usedCredits,
        remaining: userCredits.totalCredits - userCredits.usedCredits,
        plan: userCredits.plan,
      },
      stats: {
        totalVideos,
        videosThisMonth,
        weeklyRenders,
        favoriteStyle,
      },
      recentVideos: recentVideos.map((v) => ({
        id: v.id,
        title: v.title,
        thumbnailUrl: v.thumbnailUrl,
        status: v.status,
        createdAt: v.createdAt.toISOString(),
      })),
      recentSeries: recentSeries.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        videoCount: s.videoCount,
        createdAt: s.createdAt.toISOString(),
      })),
      activeJob: activeJob
        ? {
            id: activeJob.id,
            videoId: activeJob.video.id,
            videoTitle: activeJob.video.title,
            progress: activeJob.progress,
            stage: activeJob.stage,
            startedAt: activeJob.startedAt?.toISOString() || null,
          }
        : null,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}