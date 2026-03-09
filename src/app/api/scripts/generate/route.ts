import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { generateScript } from '@/lib/ai';

interface GenerateRequest {
  prompt: string;
  duration?: number;
  tone?: string;
  platform?: string;
  niche?: string;
}

// POST /api/scripts/generate - Generate a script using AI
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: GenerateRequest = await request.json();
    const { prompt, duration = 15, tone = 'profesyonel', platform = 'tiktok', niche } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt gerekli' },
        { status: 400 }
      );
    }

    if (prompt.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Prompt 1000 karakterden uzun olamaz' },
        { status: 400 }
      );
    }

    // Generate script using AI
    const generatedContent = await generateScript({
      prompt: prompt.trim(),
      duration,
      tone,
      platform,
      niche,
    });

    // Create script record with generated content
    const script = await prisma.script.create({
      data: {
        userId: session.user.id,
        prompt: prompt.trim(),
        content: generatedContent,
        title: generateTitle(prompt),
        niche: niche || null,
        duration,
        tone,
        platform,
        isGenerated: true,
        wordCount: generatedContent.split(/\s+/).filter(Boolean).length,
      },
    });

    return NextResponse.json(script, { status: 201 });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Senaryo olusturulamadi' },
      { status: 500 }
    );
  }
}

function generateTitle(prompt: string): string {
  // Generate a title from the prompt (first 50 chars or first sentence)
  const cleaned = prompt.trim().replace(/\s+/g, ' ');
  const firstSentence = cleaned.split(/[.!?]/)[0];
  const title = firstSentence.length > 50 
    ? firstSentence.substring(0, 47) + '...' 
    : firstSentence;
  return title || 'Basliksiz Senaryo';
}