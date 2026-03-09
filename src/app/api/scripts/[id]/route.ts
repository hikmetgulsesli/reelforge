import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/scripts/[id] - Get a specific script
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const script = await prisma.script.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!script) {
      return NextResponse.json({ error: 'Senaryo bulunamadi' }, { status: 404 });
    }

    return NextResponse.json(script);
  } catch (error) {
    console.error('Error fetching script:', error);
    return NextResponse.json(
      { error: 'Senaryo alinamadi' },
      { status: 500 }
    );
  }
}

// PATCH /api/scripts/[id] - Update a script
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { content, title, niche, duration, tone, platform } = body;

    // Verify ownership
    const existingScript = await prisma.script.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingScript) {
      return NextResponse.json({ error: 'Senaryo bulunamadi' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    
    if (content !== undefined) {
      updateData.content = content;
      updateData.wordCount = content.split(/\s+/).filter(Boolean).length;
    }
    if (title !== undefined) updateData.title = title;
    if (niche !== undefined) updateData.niche = niche;
    if (duration !== undefined) updateData.duration = duration;
    if (tone !== undefined) updateData.tone = tone;
    if (platform !== undefined) updateData.platform = platform;

    const script = await prisma.script.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(script);
  } catch (error) {
    console.error('Error updating script:', error);
    return NextResponse.json(
      { error: 'Senaryo guncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE /api/scripts/[id] - Delete a script
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existingScript = await prisma.script.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingScript) {
      return NextResponse.json({ error: 'Senaryo bulunamadi' }, { status: 404 });
    }

    await prisma.script.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting script:', error);
    return NextResponse.json(
      { error: 'Senaryo silinemedi' },
      { status: 500 }
    );
  }
}