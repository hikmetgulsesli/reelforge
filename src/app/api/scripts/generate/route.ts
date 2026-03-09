import { NextRequest, NextResponse } from 'next/server';

interface GenerateScriptRequest {
  prompt: string;
  duration: number;
  tone: string;
  platform: string;
  niche?: string;
}

interface GeneratedScriptResponse {
  content: string;
  wordCount: number;
  duration: number;
  tone: string;
}

// Mock script generation - in production this would call an AI service
function generateMockScript(params: GenerateScriptRequest): GeneratedScriptResponse {
  const { prompt, duration, tone, platform, niche } = params;
  
  // Calculate approximate word count based on duration
  // Average speaking rate: ~130 words per minute
  const wordsPerSecond = 2.2;
  const targetWords = Math.floor(duration * wordsPerSecond);
  
  const platformName = platform === 'tiktok' ? 'TikTok' 
    : platform === 'youtube-shorts' ? 'YouTube Shorts'
    : platform === 'youtube-long' ? 'YouTube'
    : 'Instagram';
  
  const toneDescription = tone === 'professional' ? 'profesyonel ve guvenilir'
    : tone === 'casual' ? 'samimi ve dostane'
    : tone === 'dramatic' ? 'etkileyici ve sinematik'
    : tone === 'humorous' ? 'eglenceli ve neseli'
    : 'ilham verici ve motive edici';
  
  const nicheText = niche ? ` ${niche} konusunda` : '';
  
  const script = `SAHNE 1: GIRIS

Gorsel: Ekranda dinamik bir giris animasyonu. Marka logosu belirir.
Metin: "${prompt.slice(0, 50)}..."

Seslendirme: Merhaba! Bu videomuzda${nicheText} ${toneDescription} bir sekilde konumuzu isleyecegiz. ${platformName} icin optimize edilmis bu icerik, izleyicilerin dikkatini cekecek.

SAHNE 2: ANA ICERIK

Gorsel: Ana icerik gorselleri ve gecisler.
Metin: One cikan noktalar sirasiyla ekranda belirir.

Seslendirme: Simdi together inceleyelim. Bu konu neden onemli? Cunku gercek fark yaratiyor. Izleyicilerimiz bu tur icerikleri cok seviyor.

SAHNE 3: KAPANIS

Gorsel: Kapanis animasyonu ve cagri butonu.
Metin: "Abone Ol" ve "Paylas" ikonlari.

Seslendirme: Bu videomuzu begendiyseniz, abone olmayi ve paylasmayi unutmayin! Bir sonraki videoda gorusmek uzere.`;

  // Adjust script length to match target word count
  const words = script.trim().split(/\s+/);
  const finalContent = words.slice(0, Math.max(targetWords, 50)).join(' ');
  
  return {
    content: finalContent,
    wordCount: finalContent.split(/\s+/).filter(Boolean).length,
    duration,
    tone,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateScriptRequest;
    
    // Validate required fields
    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt gereklidir' },
        { status: 400 }
      );
    }
    
    if (body.prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt 1000 karakterden uzun olamaz' },
        { status: 400 }
      );
    }
    
    // Validate duration
    const validDurations = [15, 30, 60];
    const duration = validDurations.includes(body.duration) ? body.duration : 15;
    
    // Validate tone
    const validTones = ['professional', 'casual', 'dramatic', 'humorous', 'inspirational'];
    const tone = validTones.includes(body.tone) ? body.tone : 'professional';
    
    // Validate platform
    const validPlatforms = ['tiktok', 'youtube-shorts', 'youtube-long', 'instagram'];
    const platform = validPlatforms.includes(body.platform) ? body.platform : 'tiktok';
    
    // Generate script (mock implementation)
    const result = generateMockScript({
      prompt: body.prompt.trim(),
      duration,
      tone,
      platform,
      niche: body.niche,
    });
    
    return NextResponse.json(result);
    
  } catch {
    return NextResponse.json(
      { error: 'Senaryo olusturulurken bir hata olustu' },
      { status: 500 }
    );
  }
}