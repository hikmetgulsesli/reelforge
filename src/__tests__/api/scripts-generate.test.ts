/**
 * @jest-environment node
 */
import { POST } from '@/app/api/scripts/generate/route';
import { NextRequest } from 'next/server';

describe('/api/scripts/generate', () => {
  const createRequest = (body: unknown): NextRequest => {
    return new NextRequest('http://localhost/api/scripts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  describe('validation', () => {
    it('returns 400 when prompt is missing', async () => {
      const request = createRequest({});
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Prompt gereklidir');
    });

    it('returns 400 when prompt exceeds 1000 characters', async () => {
      const request = createRequest({
        prompt: 'a'.repeat(1001),
        duration: 15,
        tone: 'professional',
        platform: 'tiktok',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Prompt 1000 karakterden uzun olamaz');
    });
  });

  describe('script generation', () => {
    it('generates script successfully', async () => {
      const request = createRequest({
        prompt: 'Test prompt for a coffee brand',
        duration: 30,
        tone: 'professional',
        platform: 'tiktok',
        niche: 'Teknoloji',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBeDefined();
      expect(data.wordCount).toBeGreaterThan(0);
      expect(data.duration).toBe(30);
      expect(data.tone).toBe('professional');
    });

    it('uses default values for invalid duration', async () => {
      const request = createRequest({
        prompt: 'Test prompt',
        duration: 999,
        tone: 'professional',
        platform: 'tiktok',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.duration).toBe(15);
    });

    it('uses default values for invalid tone', async () => {
      const request = createRequest({
        prompt: 'Test prompt',
        duration: 15,
        tone: 'invalid-tone',
        platform: 'tiktok',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tone).toBe('professional');
    });

    it('uses default values for invalid platform', async () => {
      const request = createRequest({
        prompt: 'Test prompt',
        duration: 15,
        tone: 'professional',
        platform: 'invalid-platform',
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
    });
  });

  describe('word count calculation', () => {
    it('generates appropriate word count for 15s video', async () => {
      const request = createRequest({
        prompt: 'Short video test',
        duration: 15,
        tone: 'professional',
        platform: 'tiktok',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // 15s * 2.2 words/sec = ~33 words
      expect(data.wordCount).toBeLessThanOrEqual(50);
    });

    it('generates appropriate word count for 60s video', async () => {
      const request = createRequest({
        prompt: 'Long video test',
        duration: 60,
        tone: 'professional',
        platform: 'youtube-long',
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
      // 60s * 2.2 words/sec = ~132 words
      expect((await response.json()).wordCount).toBeGreaterThan(30);
    });
  });
});