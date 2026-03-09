import { NextRequest, NextResponse } from "next/server";

// GET /api/music/categories - Return music categories
export async function GET(request: NextRequest) {
  // This is a mock implementation - in production, this would query the database
  const categories = [
    { id: "upbeat", name: "Upbeat", icon: "music_note", description: "Energetic and positive tracks", trackCount: 25 },
    { id: "chill", name: "Chill", icon: "waves", description: "Relaxed and mellow vibes", trackCount: 18 },
    { id: "epic", name: "Epic", icon: "military_tech", description: "Cinematic and powerful", trackCount: 15 },
    { id: "corporate", name: "Corporate", icon: "business", description: "Professional and inspiring", trackCount: 20 },
    { id: "funny", name: "Funny", icon: "sentiment_very_satisfied", description: "Playful and humorous", trackCount: 12 },
    { id: "emotional", name: "Emotional", icon: "favorite", description: "Moving and heartfelt", trackCount: 14 },
    { id: "dramatic", name: "Dramatic", icon: "theater_comedy", description: "Intense and suspenseful", trackCount: 10 },
    { id: "lofi", name: "Lo-fi", icon: "headphones", description: "Chill beats and ambient", trackCount: 22 },
  ];

  return NextResponse.json({
    data: categories,
  });
}