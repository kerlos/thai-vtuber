import { fetchYouTubeFeed } from "@/lib/youtube";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channelId") || "";
  const limit = Number(searchParams.get("limit")) || 10;

  try {
    const youtubeList = await fetchYouTubeFeed(channelId, limit);
    return NextResponse.json(youtubeList);
  } catch (error) {
    console.error("Error in YouTube API:", error);
    return NextResponse.json(
      { error: "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}
