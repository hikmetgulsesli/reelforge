import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ScriptGenerationParams {
  prompt: string;
  duration: number;
  tone: string;
  platform: string;
  niche?: string;
}

export async function generateScript(params: ScriptGenerationParams): Promise<string> {
  const { prompt, duration, tone, platform, niche } = params;
  
  const targetWordCount = Math.floor(duration * 2.5);
  const systemPrompt = buildSystemPrompt(duration, tone, platform, niche, targetWordCount);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to template-based generation
    return generateFallbackScript(prompt, duration);
  }
}

function buildSystemPrompt(
  duration: number,
  tone: string,
  platform: string,
  niche: string | undefined,
  targetWordCount: number
): string {
  const platformGuide = getPlatformGuide(platform);
  const toneGuide = getToneGuide(tone);

  return `You are an expert video script writer specializing in short-form content.
Create a compelling ${duration}-second video script with approximately ${targetWordCount} words.

TONE: ${toneGuide}
PLATFORM: ${platformGuide}
${niche ? `NICHE: ${niche}` : ''}

Format the script with:
- Clear scene markers (SCENE 1, SCENE 2, etc.)
- Visual descriptions
- Voiceover/narration text
- Text overlays where appropriate

Keep it engaging, concise, and optimized for viewer retention.`;
}

function getPlatformGuide(platform: string): string {
  const guides: Record<string, string> = {
    tiktok: 'TikTok/Reels (9:16 vertical format, fast-paced, attention-grabbing first 3 seconds)',
    'youtube-shorts': 'YouTube Shorts (9:16 vertical, hook within 1 second, clear call-to-action)',
    'youtube-long': 'YouTube Longform (16:9 horizontal, structured with intro/body/outro, more detailed)',
    instagram: 'Instagram Feed (4:5 aspect ratio, visually appealing, concise messaging)',
  };
  return guides[platform] || guides.tiktok;
}

function getToneGuide(tone: string): string {
  const guides: Record<string, string> = {
    egitici: 'Egitici - Bilgi verici, net ve anlasilir dille konuyu anlat',
    motivasyonel: 'Motivasyonel - Ilham verici, enerji dolu, hedefe yonlendirici',
    eglenceli: 'Eglenceli - Eglenceli, samimi, izleyiciyle dostane bir ton',
    profesyonel: 'Profesyonel - Ciddi, guvenilir, is odakli dil',
    professional: 'Polished, authoritative, business-appropriate language',
    casual: 'Friendly, conversational, relatable everyday language',
    dramatic: 'Cinematic, emotional, high-impact storytelling',
    humorous: 'Light-hearted, witty, entertaining with natural humor',
    inspirational: 'Uplifting, motivational, encouraging positive action',
  };
  return guides[tone] || guides.professional;
}

function generateFallbackScript(prompt: string, duration: number): string {
  const sceneCount = Math.max(2, Math.ceil(duration / 10));
  const scenes: string[] = [];
  
  for (let i = 1; i <= sceneCount; i++) {
    const sceneType = i === 1 ? 'GIRIS' : i === sceneCount ? 'KAPANIS' : 'GELISME';
    scenes.push(`
**SAHNE ${i}: ${sceneType}**

Gorsel: [${prompt.substring(0, 50)}... ile ilgili dinamik gorsel icerik]

Seslendirme: "${i === 1 
      ? 'Dikkat cekici bir giris yapin ve izleyiciyi hemen baglayin.' 
      : i === sceneCount 
        ? 'Gucc bir cagri ile bitirin ve etkileşim isteyin.'
        : 'Hikayeyi ilgi cekici iceriklerle gelistirin.'}"

Metin Katmani: ${i === 1 ? '"Bunu izle..."' : i === sceneCount ? '"Daha fazlasi icin takip et!"' : '"Bunu biliyor muydun?"'}
`);
  }

  return scenes.join('\n');
}