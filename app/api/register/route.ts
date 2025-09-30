import { submitChannel } from '@/lib/chuysan';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { channelId, channelType } = await req.json();

  if (!channelId || !channelType) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    await submitChannel(channelId, channelType);
  } catch (error: unknown) {
    console.error('Error submitting channel:', error);
    return NextResponse.json(
      {
        error: 'Failed to submit channel',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: 'Channel submitted successfully' });
}
