import { fetchYouTubePlaylist } from "@/lib/youtube";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const playlistId = searchParams.get("playlistId");
  const limit = Number(searchParams.get("limit")) || 10;

  if (!playlistId) {
    return NextResponse.json(
      { error: "playlistId is required" },
      { status: 400 }
    );
  }

  try {
    const playlistItems = await fetchYouTubePlaylist(playlistId, limit);
    return NextResponse.json(playlistItems);
  } catch (error) {
    console.error("Error in YouTube Playlist API:", error);
    return NextResponse.json(
      { error: "Failed to fetch YouTube playlist data" },
      { status: 500 }
    );
  }
}
