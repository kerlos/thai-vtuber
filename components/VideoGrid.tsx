'use client';

import Image from 'next/image';
import Link from 'next/link';
import { YouTubeFeedItem } from '@/types/youtube';
import { formatDistanceToNow } from 'date-fns';
import { enUS, th } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';

interface VideoGridProps {
  videos: YouTubeFeedItem[];
  isLoading?: boolean;
  error?: Error | null;
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
const formatDate = (dateString: string, locale: string, unknownText: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: locale === 'th' ? th : enUS,
    });
  } catch {
    return unknownText;
  }
};

// Loading skeleton component
const VideoSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export default function VideoGrid({ videos, isLoading, error }: VideoGridProps) {
  const t = useTranslations();
  const locale = useLocale();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
          <h3 className="font-semibold mb-1">{t('An error occurred')}</h3>
          <p className="text-sm">{t('Unable to load videos at this time')}</p>
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('No videos found')}</h3>
        <p className="text-gray-500">{t('This channel has no videos available')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="group">
          <Link
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            prefetch={false}
          >
             <div className="relative aspect-video mb-3 overflow-hidden rounded-lg bg-gray-100">
               <Image
                unoptimized={true}
                 src={video.thumbnail}
                 alt={video.title}
                 fill
                 className="object-cover transition-transform duration-200 group-hover:scale-103 z-0"
                 onError={(e) => {
                   const target = e.target as HTMLImageElement;
                   if (target.src.includes('i.ytimg.com')) {
                     target.src = target.src.replace('maxresdefault', 'hqdefault');
                   }
                 }}
               />
               
               {/* Play icon overlay on hover */}
               <div className="absolute inset-0 bg-transparent transition-all duration-200 flex items-center justify-center z-10 pointer-events-none group-hover:pointer-events-auto">
                 <div className="bg-red-600 bg-opacity-80 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                   <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M8 5v14l11-7z"/>
                   </svg>
                 </div>
               </div>
               
             </div>
            
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm leading-tight">
                {video.title}
              </h3>
              
              <p className="text-sm text-gray-600 hover:text-gray-700 transition-colors">
                {video.author}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{formatNumber(video.views)} {t('views')}</span>
                <span>•</span>
                <span>{formatDate(video.published, locale, t('Unknown'))}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
