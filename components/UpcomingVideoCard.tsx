'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';
import { UpcomingVideo } from '@/types/videos';
import { formatDistanceToNow, format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Calendar, Clock, Users } from 'lucide-react';

interface UpcomingVideoCardProps {
  video: UpcomingVideo;
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

// Format scheduled time
const formatScheduledTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24 && diffInHours > 0) {
      return `in ${formatDistanceToNow(date, { locale: enUS })}`;
    } else if (diffInHours < 0) {
      return `${formatDistanceToNow(date, { addSuffix: true, locale: enUS })}`;
    } else {
      return format(date, 'MMM dd, yyyy HH:mm', { locale: enUS });
    }
  } catch {
    return 'Unknown';
  }
};

export default function UpcomingVideoCard({ video }: UpcomingVideoCardProps) {
  const [channelImageError, setChannelImageError] = useState(false);
  
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
        {/* Upcoming badge */}
        <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-90 text-white px-2 py-1 rounded text-xs font-semibold">
          UPCOMING
        </div>
        {/* Schedule time overlay */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatScheduledTime(video.live_schedule)}
        </div>
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
            {video.live_concurrent_viewer_count > 0 ? (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{formatNumber(video.live_concurrent_viewer_count)} waiting</span>
              </div>
            ) : (
              <div>{format(new Date(video.live_schedule), 'MMM dd, HH:mm')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
