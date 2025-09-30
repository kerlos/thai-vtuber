import { fetchChannelId } from '@/lib/youtube';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { channelUrl } = await req.json();

  if (!channelUrl) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const channelId = await fetchChannelId(channelUrl);
  if (!channelId) {
    return NextResponse.json(
      { error: 'Failed to fetch channel ID' },
      { status: 400 }
    );
  }

  return NextResponse.json({ channelId });
}
