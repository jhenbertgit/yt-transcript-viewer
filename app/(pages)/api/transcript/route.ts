import { fetchYoutubeTranscript, extractVideoId } from "@/lib/utils/youtube";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const youtubeUrl = searchParams.get("youtubeUrl");

  if (!youtubeUrl) {
    return NextResponse.json(
      { transcript: "YouTube URL is required" },
      { status: 400 }
    );
  }

  const videoId = extractVideoId(youtubeUrl);

  if (!videoId) {
    return NextResponse.json(
      { transcript: "Invalid YouTube URL" },
      { status: 400 }
    );
  }

  try {
    const transcript = await fetchYoutubeTranscript(videoId);
    return NextResponse.json({ transcript: transcript }, { status: 200 });
  } catch (error) {
    console.error("API Error:", (error as Error).message);
    return NextResponse.json(
      { transcript: `Error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
