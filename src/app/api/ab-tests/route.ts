import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createABTestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  videoId: z.string().optional(),
  variants: z.array(z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    isControl: z.boolean().optional(),
  })).min(2).max(10),
});

const updateABTestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED']).optional(),
  winnerId: z.string().optional(),
});

// GET /api/ab-tests - List all A/B tests
export async function GET(request: NextRequest) {
  try {
    const tests = await prisma.abTest.findMany({
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      data: tests,
      meta: {
        total: tests.length,
      },
    });
  } catch (error) {
    console.error('Error fetching A/B tests:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch A/B tests',
      },
    }, { status: 500 });
  }
}

// POST /api/ab-tests - Create new A/B test
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createABTestSchema.safeParse(body);

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

    const { name, description, videoId, variants } = validation.data;

    // For now, use a default user ID - in production this would come from auth
    const userId = 'default-user';

    const test = await prisma.abTest.create({
      data: {
        name,
        description,
        videoId,
        userId,
        variants: {
          create: variants.map((variant, index) => ({
            name: variant.name,
            description: variant.description,
            isControl: variant.isControl ?? index === 0, // First variant is control by default
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json({ data: test }, { status: 201 });
  } catch (error) {
    console.error('Error creating A/B test:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create A/B test',
      },
    }, { status: 500 });
  }
}
