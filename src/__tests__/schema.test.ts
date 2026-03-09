import { PrismaClient } from '../generated/prisma/index.js';

// Skip schema tests in CI/test environments without a real database
// These tests require an actual database connection to test Prisma models
const shouldRunSchemaTests = process.env.RUN_INTEGRATION_TESTS === 'true' && 
  process.env.DATABASE_URL && 
  !process.env.DATABASE_URL.includes('your-database');

let prisma: PrismaClient | null = null;

if (shouldRunSchemaTests) {
  try {
    prisma = new PrismaClient();
  } catch {
    // Silently fail if PrismaClient can't be created
  }
}

// Conditional describe - skip all tests if no database
const describeSchema = (shouldRunSchemaTests && prisma) ? describe : describe.skip;

describeSchema('Database Schema', () => {
  afterAll(async () => {
    if (prisma) await prisma.$disconnect();
  });

  describe('RenderJob Model', () => {
    it('should have all required fields', async () => {
      // Test that RenderJob model exists with all fields
      const renderJob = await prisma.renderJob.create({
        data: {
          status: 'PENDING',
          progress: 0,
          user: {
            create: {
              email: 'test-render@example.com',
              name: 'Test User',
            },
          },
          video: {
            create: {
              title: 'Test Video',
              user: {
                create: {
                  email: 'test-video@example.com',
                  name: 'Video User',
                },
              },
            },
          },
        },
      });

      expect(renderJob.id).toBeDefined();
      expect(renderJob.status).toBe('PENDING');
      expect(renderJob.progress).toBe(0);
      expect(renderJob.createdAt).toBeDefined();
      expect(renderJob.updatedAt).toBeDefined();

      // Cleanup
      await prisma.renderJob.delete({ where: { id: renderJob.id } });
    });

    it('should support all RenderStatus enum values', async () => {
      const statuses = ['PENDING', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'];
      
      for (const status of statuses) {
        const user = await prisma.user.create({
          data: {
            email: `test-${status.toLowerCase()}@example.com`,
            name: 'Test User',
          },
        });

        const video = await prisma.video.create({
          data: {
            title: 'Test Video',
            userId: user.id,
          },
        });

        const renderJob = await prisma.renderJob.create({
          data: {
            status: status as 'PENDING' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED',
            progress: 0,
            userId: user.id,
            videoId: video.id,
          },
        });

        expect(renderJob.status).toBe(status);
        
        // Cleanup
        await prisma.renderJob.delete({ where: { id: renderJob.id } });
        await prisma.video.delete({ where: { id: video.id } });
        await prisma.user.delete({ where: { id: user.id } });
      }
    });

    it('should store job data and worker info', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test-jobdata@example.com',
          name: 'Test User',
        },
      });

      const video = await prisma.video.create({
        data: {
          title: 'Test Video',
          userId: user.id,
        },
      });

      const jobData = { resolution: '1080p', fps: 30, codec: 'h264' };
      
      const renderJob = await prisma.renderJob.create({
        data: {
          status: 'PROCESSING',
          progress: 50,
          jobData: jobData,
          workerId: 'worker-123',
          attempts: 1,
          userId: user.id,
          videoId: video.id,
        },
      });

      expect(renderJob.jobData).toEqual(jobData);
      expect(renderJob.workerId).toBe('worker-123');
      expect(renderJob.attempts).toBe(1);

      // Cleanup
      await prisma.renderJob.delete({ where: { id: renderJob.id } });
      await prisma.video.delete({ where: { id: video.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe('Niche Model', () => {
    it('should have all required fields including trend analysis', async () => {
      const niche = await prisma.niche.create({
        data: {
          name: 'Fitness',
          description: 'Health and fitness content',
          trendScore: 85.5,
          competition: 60.0,
          volume: 1000000,
          growth: 15.5,
          category: 'Health',
          tags: ['workout', 'gym', 'health'],
          isActive: true,
        },
      });

      expect(niche.id).toBeDefined();
      expect(niche.name).toBe('Fitness');
      expect(niche.trendScore).toBe(85.5);
      expect(niche.competition).toBe(60.0);
      expect(niche.volume).toBe(1000000);
      expect(niche.growth).toBe(15.5);
      expect(niche.category).toBe('Health');
      expect(niche.tags).toEqual(['workout', 'gym', 'health']);
      expect(niche.isActive).toBe(true);

      // Cleanup
      await prisma.niche.delete({ where: { id: niche.id } });
    });

    it('should enforce unique niche names', async () => {
      const niche = await prisma.niche.create({
        data: {
          name: 'UniqueNiche',
          category: 'Test',
        },
      });

      await expect(
        prisma.niche.create({
          data: {
            name: 'UniqueNiche',
            category: 'Test',
          },
        })
      ).rejects.toThrow();

      // Cleanup
      await prisma.niche.delete({ where: { id: niche.id } });
    });
  });

  describe('ScheduledPost Model', () => {
    it('should have all required fields', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test-scheduled@example.com',
          name: 'Test User',
        },
      });

      const scheduledPost = await prisma.scheduledPost.create({
        data: {
          title: 'My Scheduled Post',
          description: 'Description here',
          scheduledAt: new Date('2025-04-01T12:00:00Z'),
          timezone: 'Europe/Istanbul',
          platforms: ['TIKTOK', 'YOUTUBE_SHORTS'],
          videoUrl: 'https://example.com/video.mp4',
          thumbnailUrl: 'https://example.com/thumb.jpg',
          autoPublish: true,
          notifyOnPost: true,
          userId: user.id,
        },
      });

      expect(scheduledPost.id).toBeDefined();
      expect(scheduledPost.title).toBe('My Scheduled Post');
      expect(scheduledPost.status).toBe('SCHEDULED');
      expect(scheduledPost.platforms).toEqual(['TIKTOK', 'YOUTUBE_SHORTS']);
      expect(scheduledPost.autoPublish).toBe(true);

      // Cleanup
      await prisma.scheduledPost.delete({ where: { id: scheduledPost.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });

    it('should support all ScheduleStatus enum values', async () => {
      const statuses = ['SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED', 'CANCELLED'];
      
      for (const status of statuses) {
        const user = await prisma.user.create({
          data: {
            email: `test-schedule-${status.toLowerCase()}@example.com`,
            name: 'Test User',
          },
        });

        const scheduledPost = await prisma.scheduledPost.create({
          data: {
            title: 'Test Post',
            scheduledAt: new Date(),
            videoUrl: 'https://example.com/video.mp4',
            status: status as 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED' | 'CANCELLED',
            userId: user.id,
          },
        });

        expect(scheduledPost.status).toBe(status);

        // Cleanup
        await prisma.scheduledPost.delete({ where: { id: scheduledPost.id } });
        await prisma.user.delete({ where: { id: user.id } });
      }
    });

    it('should support all Platform enum values', async () => {
      const platforms = ['TIKTOK', 'YOUTUBE_SHORTS', 'INSTAGRAM_REELS'];
      const user = await prisma.user.create({
        data: {
          email: 'test-platforms@example.com',
          name: 'Test User',
        },
      });

      for (const platform of platforms) {
        const scheduledPost = await prisma.scheduledPost.create({
          data: {
            title: `Post for ${platform}`,
            scheduledAt: new Date(),
            videoUrl: 'https://example.com/video.mp4',
            platforms: [platform as 'TIKTOK' | 'YOUTUBE_SHORTS' | 'INSTAGRAM_REELS'],
            userId: user.id,
          },
        });

        expect(scheduledPost.platforms).toContain(platform);

        // Cleanup
        await prisma.scheduledPost.delete({ where: { id: scheduledPost.id } });
      }

      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe('ABTest Model', () => {
    it('should have all required fields', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test-abtest@example.com',
          name: 'Test User',
        },
      });

      const abTest = await prisma.aBTest.create({
        data: {
          name: 'Thumbnail Test',
          description: 'Testing different thumbnails',
          hypothesis: 'Red thumbnails perform better',
          videoId: 'video-123',
          targetMetric: 'CTR',
          userId: user.id,
        },
      });

      expect(abTest.id).toBeDefined();
      expect(abTest.name).toBe('Thumbnail Test');
      expect(abTest.status).toBe('DRAFT');
      expect(abTest.targetMetric).toBe('CTR');

      // Cleanup
      await prisma.aBTest.delete({ where: { id: abTest.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });

    it('should support all ABTestStatus enum values', async () => {
      const statuses = ['DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED'];
      
      for (const status of statuses) {
        const user = await prisma.user.create({
          data: {
            email: `test-ab-${status.toLowerCase()}@example.com`,
            name: 'Test User',
          },
        });

        const abTest = await prisma.aBTest.create({
          data: {
            name: 'Test',
            videoId: 'video-123',
            status: status as 'DRAFT' | 'RUNNING' | 'PAUSED' | 'COMPLETED',
            userId: user.id,
          },
        });

        expect(abTest.status).toBe(status);

        // Cleanup
        await prisma.aBTest.delete({ where: { id: abTest.id } });
        await prisma.user.delete({ where: { id: user.id } });
      }
    });

    it('should support test dates and results', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test-ab-dates@example.com',
          name: 'Test User',
        },
      });

      const startDate = new Date('2025-04-01T00:00:00Z');
      const endDate = new Date('2025-04-07T00:00:00Z');

      const abTest = await prisma.aBTest.create({
        data: {
          name: 'Date Test',
          videoId: 'video-123',
          status: 'RUNNING',
          startDate: startDate,
          endDate: endDate,
          winnerId: 'variation-1',
          confidence: 95.5,
          userId: user.id,
        },
      });

      expect(abTest.startDate).toEqual(startDate);
      expect(abTest.endDate).toEqual(endDate);
      expect(abTest.winnerId).toBe('variation-1');
      expect(abTest.confidence).toBe(95.5);

      // Cleanup
      await prisma.aBTest.delete({ where: { id: abTest.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe('ABTestVariation Model', () => {
    it('should have all required fields', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test-variation@example.com',
          name: 'Test User',
        },
      });

      const abTest = await prisma.aBTest.create({
        data: {
          name: 'Variation Test',
          videoId: 'video-123',
          userId: user.id,
        },
      });

      const variation = await prisma.aBTestVariation.create({
        data: {
          name: 'Variant A',
          thumbnailUrl: 'https://example.com/thumb-a.jpg',
          title: 'Title A',
          description: 'Description A',
          trafficAllocation: 50,
          abTestId: abTest.id,
        },
      });

      expect(variation.id).toBeDefined();
      expect(variation.name).toBe('Variant A');
      expect(variation.thumbnailUrl).toBe('https://example.com/thumb-a.jpg');
      expect(variation.trafficAllocation).toBe(50);
      expect(variation.impressions).toBe(0);
      expect(variation.clicks).toBe(0);
      expect(variation.views).toBe(0);
      expect(variation.engagement).toBe(0);
      expect(variation.ctr).toBe(0);

      // Cleanup
      await prisma.aBTestVariation.delete({ where: { id: variation.id } });
      await prisma.aBTest.delete({ where: { id: abTest.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });

    it('should track performance metrics', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test-metrics@example.com',
          name: 'Test User',
        },
      });

      const abTest = await prisma.aBTest.create({
        data: {
          name: 'Metrics Test',
          videoId: 'video-123',
          userId: user.id,
        },
      });

      const variation = await prisma.aBTestVariation.create({
        data: {
          name: 'Variant B',
          thumbnailUrl: 'https://example.com/thumb-b.jpg',
          trafficAllocation: 50,
          impressions: 10000,
          clicks: 500,
          views: 450,
          engagement: 8.5,
          ctr: 5.0,
          abTestId: abTest.id,
        },
      });

      expect(variation.impressions).toBe(10000);
      expect(variation.clicks).toBe(500);
      expect(variation.views).toBe(450);
      expect(variation.engagement).toBe(8.5);
      expect(variation.ctr).toBe(5.0);

      // Cleanup
      await prisma.aBTestVariation.delete({ where: { id: variation.id } });
      await prisma.aBTest.delete({ where: { id: abTest.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });

    it('should have relationship with ABTest', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test-relation@example.com',
          name: 'Test User',
        },
      });

      const abTest = await prisma.aBTest.create({
        data: {
          name: 'Relation Test',
          videoId: 'video-123',
          userId: user.id,
          variations: {
            create: [
              {
                name: 'Control',
                thumbnailUrl: 'https://example.com/control.jpg',
              },
              {
                name: 'Variant',
                thumbnailUrl: 'https://example.com/variant.jpg',
              },
            ],
          },
        },
        include: {
          variations: true,
        },
      });

      expect(abTest.variations).toHaveLength(2);
      expect(abTest.variations[0].name).toBe('Control');
      expect(abTest.variations[1].name).toBe('Variant');

      // Cleanup
      await prisma.aBTestVariation.deleteMany({ where: { abTestId: abTest.id } });
      await prisma.aBTest.delete({ where: { id: abTest.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe('Model Relations', () => {
    it('should cascade delete RenderJob when Video is deleted', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test-cascade@example.com',
          name: 'Test User',
        },
      });

      const video = await prisma.video.create({
        data: {
          title: 'Cascade Test Video',
          userId: user.id,
        },
      });

      const renderJob = await prisma.renderJob.create({
        data: {
          status: 'PENDING',
          userId: user.id,
          videoId: video.id,
        },
      });

      // Delete video
      await prisma.video.delete({ where: { id: video.id } });

      // RenderJob should be deleted
      const foundRenderJob = await prisma.renderJob.findUnique({
        where: { id: renderJob.id },
      });
      expect(foundRenderJob).toBeNull();

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } });
    });

    it('should cascade delete ABTestVariation when ABTest is deleted', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test-cascade-ab@example.com',
          name: 'Test User',
        },
      });

      const abTest = await prisma.aBTest.create({
        data: {
          name: 'Cascade Test',
          videoId: 'video-123',
          userId: user.id,
        },
      });

      const variation = await prisma.aBTestVariation.create({
        data: {
          name: 'Variant',
          thumbnailUrl: 'https://example.com/thumb.jpg',
          abTestId: abTest.id,
        },
      });

      // Delete ABTest
      await prisma.aBTest.delete({ where: { id: abTest.id } });

      // Variation should be deleted
      const foundVariation = await prisma.aBTestVariation.findUnique({
        where: { id: variation.id },
      });
      expect(foundVariation).toBeNull();

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } });
    });
  });
});
