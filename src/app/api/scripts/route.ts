import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/scripts - List all scripts for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const scripts = await prisma.script.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.script.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ scripts, total });
  } catch (error) {
    console.error('Error fetching scripts:', error);
    return NextResponse.json(
      { error: 'Senaryolar alinamadi' },
      { status: 500 }
    );
  }
}

// POST /api/scripts - Create a new script
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, title, niche, duration, tone, platform } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt gerekli' },
        { status: 400 }
      );
    }

    const script = await prisma.script.create({
      data: {
        userId: session.user.id,
        prompt: prompt.trim(),
        title: title?.trim() || null,
        niche: niche?.trim() || null,
        duration: duration || 15,
        tone: tone || 'profesyonel',
        platform: platform || 'tiktok',
      },
    });

    return NextResponse.json(script, { status: 201 });
  } catch (error) {
    console.error('Error creating script:', error);
    return NextResponse.json(
      { error: 'Senaryo olusturulamadi' },
      { status: 500 }
    );
  }
}