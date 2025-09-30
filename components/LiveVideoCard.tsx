'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';
import { LiveVideo } from '@/types/videos';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Users, Radio } from 'lucide-react';

interface LiveVideoCardProps {
  video: LiveVideo;
}

// Format numbers for display
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Format date to relative time
const formatDate = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: enUS,
    });
  } catch {
    return 'Unknown';
  }
};

export default function LiveVideoCard({ video }: LiveVideoCardProps) {
  const [channelImageError, setChannelImageError] = useState(false);
  const isLive = video.live_status === 1;
  
  return (
    <div className="group cursor-pointer">
      {/* Video Thumbnail */}
      <Link
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-3"
        prefetch={false}
      >
        <Image
          src={video.thumbnail_image_url}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes('i.ytimg.com')) {
              target.src = target.src.replace('maxresdefault', 'hqdefault');
            }
          }}
        />
        {/* Live badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
          isLive 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-800 bg-opacity-90 text-white'
        }`}>
          {isLive ? (
            <>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </>
          ) : (
            'ENDED'
          )}
        </div>
        
        {/* Viewer count overlay */}
        {video.live_concurrent_viewer_count > 0 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-medium">
            {formatNumber(video.live_concurrent_viewer_count)} watching
          </div>
        )}
      </Link>

      {/* Video Info */}
      <div className="flex gap-3">
        {/* Channel Avatar */}
        <Link
          href={`/channel/${video.channel_id}`}
          className="flex-shrink-0"
          prefetch={false}
          onClick={() => sendGAEvent('event', 'channel_click', {
            channelId: video.channel_id
          })}
        >
          {!channelImageError && (
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={video.channel_thumbnail_image_url}
                alt={video.channel_title}
                fill
                className="object-cover"
                onError={() => setChannelImageError(true)}
              />
            </div>
          )}
        </Link>

        {/* Video details */}
        <div className="flex-1 min-w-0">
          <Link
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
          >
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
              {video.title}
            </h3>
          </Link>

          <Link
            href={`/channel/${video.channel_id}`}
            className="text-sm text-gray-600 hover:text-gray-900 block mb-1"
            prefetch={false}
            onClick={() => sendGAEvent('event', 'channel_click', {
              channelId: video.channel_id
            })}
          >
            {video.channel_title}
          </Link>

          <div className="text-xs text-gray-600">
            {video.live_concurrent_viewer_count > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{formatNumber(video.live_concurrent_viewer_count)} {isLive ? 'watching' : 'watched'}</span>
              </div>
            )}
            {video.live_start && !video.live_concurrent_viewer_count && (
              <div>Started {formatDate(video.live_start)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
