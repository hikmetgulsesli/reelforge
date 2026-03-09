import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Oturum açmanız gerekiyor" } },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user credits
    const userCredits = await prisma.userCredits.findUnique({
      where: { userId },
    });

    // Get videos created this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const videosThisMonth = await prisma.video.count({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
    });

    // Get total videos
    const totalVideos = await prisma.video.count({
      where: { userId },
    });

    // Get recent videos (last 5)
    const recentVideos = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        status: true,
        createdAt: true,
        duration: true,
        platform: true,
      },
    });

    // Get recent series (last 5)
    const recentSeries = await prisma.series.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        description: true,
        videoCount: true,
        isActive: true,
        createdAt: true,
        niche: true,
      },
    });

    // Get active render jobs
    const activeJobs = await prisma.renderJob.findMany({
      where: {
        userId,
        status: "processing",
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        videoId: true,
        status: true,
        progress: true,
        stage: true,
        createdAt: true,
        video: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: {
        credits: {
          total: userCredits?.totalCredits ?? 0,
          used: userCredits?.usedCredits ?? 0,
          remaining: (userCredits?.totalCredits ?? 0) - (userCredits?.usedCredits ?? 0),
          plan: userCredits?.plan ?? "free",
        },
        stats: {
          videosThisMonth,
          totalVideos,
        },
        recentVideos,
        recentSeries,
        activeJobs,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Sunucu hatası" } },
      { status: 500 }
    );
  }
}