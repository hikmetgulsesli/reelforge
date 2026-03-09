import { NextRequest, NextResponse } from "next/server";

// Mock music tracks for development
const MOCK_TRACKS = [
  { id: "track-1", title: "Neon Horizon", artist: "Synthwave Collective", category: "upbeat", duration: 165, audioUrl: "/audio/neon-horizon.mp3", thumbnailUrl: null, isAiRecommended: true, playCount: 1250 },
  { id: "track-2", title: "Summer Vibes", artist: "DJ Ocean", category: "upbeat", duration: 192, audioUrl: "/audio/summer-vibes.mp3", thumbnailUrl: null, isAiRecommended: false, playCount: 980 },
  { id: "track-3", title: "City Lights", artist: "Urban Beat", category: "chill", duration: 118, audioUrl: "/audio/city-lights.mp3", thumbnailUrl: null, isAiRecommended: true, playCount: 856 },
  { id: "track-4", title: "Morning Run", artist: "Active Life", category: "upbeat", duration: 140, audioUrl: "/audio/morning-run.mp3", thumbnailUrl: null, isAiRecommended: false, playCount: 723 },
  { id: "track-5", title: "Epic Journey", artist: "Cinematic Orchestra", category: "epic", duration: 210, audioUrl: "/audio/epic-journey.mp3", thumbnailUrl: null, isAiRecommended: true, playCount: 1456 },
  { id: "track-6", title: "Coffee Shop", artist: "Chill Cafe", category: "lofi", duration: 178, audioUrl: "/audio/coffee-shop.mp3", thumbnailUrl: null, isAiRecommended: true, playCount: 1890 },
  { id: "track-7", title: "Corporate Tech", artist: "Business Beats", category: "corporate", duration: 155, audioUrl: "/audio/corporate-tech.mp3", thumbnailUrl: null, isAiRecommended: false, playCount: 567 },
  { id: "track-8", title: "Funny Moments", artist: "Comedy Crew", category: "funny", duration: 95, audioUrl: "/audio/funny-moments.mp3", thumbnailUrl: null, isAiRecommended: false, playCount: 432 },
  { id: "track-9", title: "Emotional Story", artist: "Heart Strings", category: "emotional", duration: 225, audioUrl: "/audio/emotional-story.mp3", thumbnailUrl: null, isAiRecommended: true, playCount: 1123 },
  { id: "track-10", title: "Dramatic Build", artist: "Suspense Studios", category: "dramatic", duration: 188, audioUrl: "/audio/dramatic-build.mp3", thumbnailUrl: null, isAiRecommended: false, playCount: 678 },
];

// GET /api/music - Return music tracks with optional category filter
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  let filteredTracks = MOCK_TRACKS;
  
  if (category) {
    filteredTracks = MOCK_TRACKS.filter(
      (track) => track.category.toLowerCase() === category.toLowerCase()
    );
  }

  const paginatedTracks = filteredTracks.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedTracks,
    meta: {
      total: filteredTracks.length,
      limit,
      offset,
      hasMore: offset + paginatedTracks.length < filteredTracks.length,
    },
  });
}