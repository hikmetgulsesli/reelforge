import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateABTestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED']).optional(),
  winnerId: z.string().optional(),
});

// GET /api/ab-tests/:id - Get single A/B test with variants
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const test = await prisma.abTest.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });

    if (!test) {
      return NextResponse.json({
        error: {
          code: 'NOT_FOUND',
          message: `A/B test with id ${id} not found`,
        },
      }, { status: 404 });
    }

    return NextResponse.json({ data: test });
  } catch (error) {
    console.error('Error fetching A/B test:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch A/B test',
      },
    }, { status: 500 });
  }
}

// PATCH /api/ab-tests/:id - Update A/B test
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateABTestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: validation.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
      }, { status: 400 });
    }

    const existing = await prisma.abTest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({
        error: {
          code: 'NOT_FOUND',
          message: `A/B test with id ${id} not found`,
        },
      }, { status: 404 });
    }

    const test = await prisma.abTest.update({
      where: { id },
      data: validation.data,
      include: {
        variants: true,
      },
    });

    return NextResponse.json({ data: test });
  } catch (error) {
    console.error('Error updating A/B test:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update A/B test',
      },
    }, { status: 500 });
  }
}

// DELETE /api/ab-tests/:id - Delete A/B test
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.abTest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({
        error: {
          code: 'NOT_FOUND',
          message: `A/B test with id ${id} not found`,
        },
      }, { status: 404 });
    }

    await prisma.abTest.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting A/B test:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete A/B test',
      },
    }, { status: 500 });
  }
}
