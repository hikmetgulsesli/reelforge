/**
 * @jest-environment node
 */
import { POST } from '@/app/api/scripts/generate/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/lib/prisma');
jest.mock('@/lib/ai', () => ({
  generateScript: jest.fn().mockResolvedValue('Test generated script content'),
}));

const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
  },
};

describe('POST /api/scripts/generate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.script.create as jest.Mock).mockResolvedValue({
      id: 'test-script-id',
      userId: 'test-user-id',
      prompt: 'Test prompt',
      content: 'Test generated script content',
      title: 'Test prompt',
      niche: 'Teknoloji',
      duration: 15,
      tone: 'profesyonel',
      platform: 'tiktok',
      isGenerated: true,
      wordCount: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('returns 401 when not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    
    const request = new Request('http://localhost/api/scripts/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'Test' }),
    });
    
    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();
    
    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 when prompt is missing', async () => {
    const request = new Request('http://localhost/api/scripts/generate', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    
    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Prompt gerekli');
  });

  it('returns 400 when prompt is empty', async () => {
    const request = new Request('http://localhost/api/scripts/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: '   ' }),
    });
    
    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Prompt gerekli');
  });

  it('returns 400 when prompt exceeds 1000 characters', async () => {
    const longPrompt = 'a'.repeat(1001);
    const request = new Request('http://localhost/api/scripts/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: longPrompt }),
    });
    
    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Prompt 1000 karakterden uzun olamaz');
  });

  it('creates a script with valid input', async () => {
    const request = new Request('http://localhost/api/scripts/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Test video idea',
        duration: 30,
        tone: 'eglenceli',
        platform: 'youtube-shorts',
        niche: 'Teknoloji',
      }),
    });
    
    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.id).toBe('test-script-id');
    expect(prisma.script.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'test-user-id',
        prompt: 'Test video idea',
        duration: 30,
        tone: 'eglenceli',
        platform: 'youtube-shorts',
        niche: 'Teknoloji',
      }),
    });
  });

  it('uses default values when optional fields are missing', async () => {
    const request = new Request('http://localhost/api/scripts/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'Test' }),
    });
    
    const response = await POST(request as unknown as NextRequest);
    
    expect(response.status).toBe(201);
    expect(prisma.script.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'test-user-id',
        prompt: 'Test',
        duration: 15,
        tone: 'profesyonel',
        platform: 'tiktok',
      }),
    });
  });
});