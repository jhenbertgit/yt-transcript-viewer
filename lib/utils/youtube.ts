import { YoutubeTranscript } from "youtube-transcript";

// Helper function to extract video ID from YouTube URL
export function extractVideoId(url: string): string | null {
  const regex = /[?&]v=([^&#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function fetchYoutubeTranscript(videoId: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const fullText = transcript.map((entry) => entry.text).join("\n");
    return fullText;
  } catch (error) {
    console.error("Error fetching transcript:", (error as Error).message);
    return `Error: ${(error as Error).message}`;
  }
}
