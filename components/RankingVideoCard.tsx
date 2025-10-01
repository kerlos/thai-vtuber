'use client';

import Image from 'next/image';
import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';
import { RankingVideo } from '@/types/videos';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Eye } from 'lucide-react';

interface RankingVideoCardProps {
  video: RankingVideo;
  rank: number;
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

// Get rank styling
const getRankStyling = (rank: number) => {
  if (rank === 1) return 'bg-yellow-500 text-white'; // Gold
  if (rank === 2) return 'bg-gray-400 text-white'; // Silver
  if (rank === 3) return 'bg-orange-600 text-white'; // Bronze
  if (rank <= 10) return 'bg-blue-500 text-white';
  return 'bg-gray-200 text-gray-700';
};

export default function RankingVideoCard({ video, rank }: RankingVideoCardProps) {
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
          unoptimized={true}
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
        {/* Rank badge */}
        <div className={`absolute top-2 left-2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-lg ${getRankStyling(rank)}`}>
          {rank}
        </div>
      </Link>

      {/* Video Info */}
      <div className="flex gap-3">
        {/* Rank indicator (alternative display) */}
        <div className="flex-shrink-0 pt-1">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyling(rank)}`}>
            {rank}
          </div>
        </div>

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
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {video.view_count && (
                <>
                  <span>{formatNumber(video.view_count)} views</span>
                  <span>•</span>
                </>
              )}
              {video.published_at && (
                <>
                  <span>{formatDate(video.published_at)}</span>
                  <span>•</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
