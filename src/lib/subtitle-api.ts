import { SubtitleStylesResponse, SubtitleStyle } from "@/types/subtitle";

const API_BASE = "/api/subtitles";

/**
 * Fetch all preset subtitle styles
 */
export async function fetchSubtitleStyles(
  includeCustom = false,
  userId?: string
): Promise<SubtitleStyle[]> {
  const params = new URLSearchParams();
  if (includeCustom) params.append("includeCustom", "true");
  if (userId) params.append("userId", userId);

  const url = `${API_BASE}/styles?${params.toString()}`;

  const response = await fetch(url);
  const data: SubtitleStylesResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch subtitle styles");
  }

  return data.data;
}
