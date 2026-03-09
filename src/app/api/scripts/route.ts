import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const generateScriptSchema = z.object({
  prompt: z.string().min(10, "Prompt en az 10 karakter olmalıdır").max(1000, "Prompt en fazla 1000 karakter olabilir"),
  niche: z.string().optional(),
  duration: z.number().int().min(15).max(60),
  tone: z.enum(["educational", "motivational", "funny", "professional", "casual", "dramatic", "humorous", "inspirational"]),
  platform: z.enum(["tiktok", "youtube_shorts", "youtube_longform", "instagram_feed", "instagram_reels"]),
});

// Mock AI generation function - in production this would call OpenAI/Claude API
async function generateScriptWithAI(params: {
  prompt: string;
  niche?: string;
  duration: number;
  tone: string;
  platform: string;
}): Promise<{ content: string; wordCount: number }> {
  const { prompt, niche, duration, tone, platform } = params;
  
  // Calculate approximate word count based on duration
  // Average speaking rate: 130-150 words per minute
  const targetWords = Math.floor((duration / 60) * 140);
  
  const nicheText = niche ? ` ${niche} alanında` : "";
  const platformText = platform.replace("_", " ");
  
  const scenes = duration <= 15 ? 2 : duration <= 30 ? 3 : 4;
  
  let content = "";
  
  for (let i = 1; i <= scenes; i++) {
    content += `**SAHNE ${i}**\n\n`;
    
    if (i === 1) {
      content += `Görsel: ${platformText} için dikkat çekici bir açılış görseli.${nicheText}\n\n`;
      content += `Ses: "${prompt.substring(0, 50)}${prompt.length > 50 ? "..." : ""} hakkında konuşacağız."\n\n`;
    } else if (i === scenes) {
      content += `Görsel: Etkili bir kapanış görseli ve CTA (call-to-action).\n\n`;
      content += `Ses: "Videoyu beğenmeyi ve takip etmeyi unutmayın!"\n\n`;
    } else {
      content += `Görsel: Ana içeriği destekleyen görsel.\n\n`;
      content += `Ses: "${tone} bir tonla ana mesajı ilet."\n\n`;
    }
  }
  
  content += `\n**NOT:** Bu script yaklaşık ${targetWords} kelime hedefiyle oluşturulmuştur.`;
  
  const wordCount = content.split(/\s+/).length;
  
  return { content, wordCount };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Giriş yapmanız gerekiyor." } },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const validation = generateScriptSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Geçersiz istek parametreleri",
            details: validation.error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
        },
        { status: 400 }
      );
    }
    
    const { prompt, niche, duration, tone, platform } = validation.data;
    
    // Generate script using AI
    const { content, wordCount } = await generateScriptWithAI({
      prompt,
      niche,
      duration,
      tone,
      platform,
    });
    
    // Save to database
    const script = await prisma.script.create({
      data: {
        userId: session.user.id,
        prompt,
        content,
        niche: niche || null,
        duration,
        tone,
        platform,
        isGenerated: true,
        wordCount,
      },
    });
    
    return NextResponse.json(
      {
        data: {
          id: script.id,
          content: script.content,
          wordCount: script.wordCount,
          duration: script.duration,
          tone: script.tone,
          platform: script.platform,
          createdAt: script.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Script generation error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Script oluşturulurken bir hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Giriş yapmanız gerekiyor." } },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    
    const scripts = await prisma.script.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    
    return NextResponse.json({ data: scripts });
  } catch (error) {
    console.error("Fetch scripts error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Scriptler alınırken bir hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}
