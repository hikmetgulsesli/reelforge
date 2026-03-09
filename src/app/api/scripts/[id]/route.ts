import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateScriptSchema = z.object({
  content: z.string().min(1, "İçerik boş olamaz").max(5000, "İçerik en fazla 5000 karakter olabilir").optional(),
  title: z.string().max(200, "Başlık en fazla 200 karakter olabilir").optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Giriş yapmanız gerekiyor." } },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    const script = await prisma.script.findFirst({
      where: { id, userId: session.user.id },
    });
    
    if (!script) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Script bulunamadı." } },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: script });
  } catch (error) {
    console.error("Fetch script error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Script alınırken bir hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Giriş yapmanız gerekiyor." } },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const body = await request.json();
    
    const validation = updateScriptSchema.safeParse(body);
    
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
    
    const existingScript = await prisma.script.findFirst({
      where: { id, userId: session.user.id },
    });
    
    if (!existingScript) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Script bulunamadı." } },
        { status: 404 }
      );
    }
    
    const updatedScript = await prisma.script.update({
      where: { id },
      data: {
        ...validation.data,
        wordCount: validation.data.content 
          ? validation.data.content.split(/\s+/).length 
          : existingScript.wordCount,
      },
    });
    
    return NextResponse.json({ data: updatedScript });
  } catch (error) {
    console.error("Update script error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Script güncellenirken bir hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Giriş yapmanız gerekiyor." } },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    const existingScript = await prisma.script.findFirst({
      where: { id, userId: session.user.id },
    });
    
    if (!existingScript) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Script bulunamadı." } },
        { status: 404 }
      );
    }
    
    await prisma.script.delete({ where: { id } });
    
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("Delete script error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Script silinirken bir hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}
