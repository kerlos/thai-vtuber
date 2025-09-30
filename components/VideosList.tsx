'use client';

import { VideoTabType, UpcomingVideo, LiveVideo, RankingVideo } from '@/types/videos';
import { 
  useUpcomingVideos, 
  useLiveVideos, 
  use24HrRankingVideos, 
  use3DaysRankingVideos, 
  use7DaysRankingVideos 
} from '@/hooks/useVideosData';
import UpcomingVideoCard from './UpcomingVideoCard';
import LiveVideoCard from './LiveVideoCard';
import RankingVideoCard from './RankingVideoCard';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface VideosListProps {
  activeTab: VideoTabType;
}

// Loading skeleton component
const VideoSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-video bg-gray-200 rounded-xl mb-3"></div>
    <div className="flex gap-3">
      <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export default function VideosList({ activeTab }: VideosListProps) {
  // Only fetch data for the active tab to optimize performance
  const liveQuery = useLiveVideos(activeTab === 'live-upcoming');
  const upcomingQuery = useUpcomingVideos(activeTab === 'live-upcoming');
  const ranking24hrQuery = use24HrRankingVideos(activeTab === '24hr');
  const ranking3daysQuery = use3DaysRankingVideos(activeTab === '3days');
  const ranking7daysQuery = use7DaysRankingVideos(activeTab === '7days');

  // Select appropriate data based on active tab
  const getQueryResult = () => {
    if (activeTab === 'live-upcoming') {
      return {
        data: null, // We'll handle this separately
        isLoading: liveQuery.isLoading || upcomingQuery.isLoading,
        error: liveQuery.error || upcomingQuery.error,
        isError: liveQuery.isError || upcomingQuery.isError,
        refetch: () => {
          liveQuery.refetch();
          upcomingQuery.refetch();
        },
        isFetching: liveQuery.isFetching || upcomingQuery.isFetching,
      };
    } else if (activeTab === '24hr') {
      return ranking24hrQuery;
    } else if (activeTab === '3days') {
      return ranking3daysQuery;
    } else if (activeTab === '7days') {
      return ranking7daysQuery;
    } else {
      // Fallback
      return liveQuery;
    }
  };

  const { data, isLoading, error, isError, refetch, isFetching } = getQueryResult();
  const videos = data?.result || [];
  
  // For combined tab, get both live and upcoming videos
  const liveVideos = activeTab === 'live-upcoming' ? (liveQuery.data?.result || []) : [];
  const upcomingVideos = activeTab === 'live-upcoming' ? (upcomingQuery.data?.result || []) : [];

  // Get tab display info
  const getTabInfo = () => {
    switch (activeTab) {
      case 'live-upcoming':
        return { title: 'Live & Upcoming Videos', description: 'Currently live streams and scheduled premieres' };
      case '24hr':
        return { title: '24 Hour Rankings', description: 'Most viewed videos in the last 24 hours' };
      case '3days':
        return { title: '3 Day Rankings', description: 'Most viewed videos in the last 3 days' };
      case '7days':
        return { title: '7 Day Rankings', description: 'Most viewed videos in the last 7 days' };
      default:
        return { title: 'Videos', description: '' };
    }
  };

  const { title, description } = getTabInfo();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading header */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        
        {/* Loading videos grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-lg max-w-md mx-auto">
          <WifiOff className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="font-semibold mb-2">Failed to load videos</h3>
          <p className="text-sm mb-4">
            {error?.message || 'Unable to fetch videos at this time'}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check for empty state
  const isEmpty = activeTab === 'live-upcoming' 
    ? (liveVideos.length === 0 && upcomingVideos.length === 0)
    : (!videos || videos.length === 0);

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No {activeTab === 'live-upcoming' ? 'live or upcoming' : activeTab} videos found</h3>
        <p className="text-gray-500">Check back later for updates</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {isFetching && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </div>
            )}
          </div>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>

      </div>

      {/* Videos Grid */}
      {activeTab === 'live-upcoming' ? (
        <div className="space-y-8">
          {/* Live Videos Section */}
          {liveVideos.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">Live Now</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-600 font-medium">LIVE</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {liveVideos.map((video) => (
                  <LiveVideoCard key={video.id} video={video as LiveVideo} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Videos Section */}
          {upcomingVideos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {upcomingVideos.map((video) => (
                  <UpcomingVideoCard key={video.id} video={video as UpcomingVideo} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {videos.map((video, index) => {
            switch (activeTab) {
              case '24hr':
              case '3days':
              case '7days':
                return <RankingVideoCard key={video.id} video={video as RankingVideo} rank={index + 1} />;
              default:
                return <UpcomingVideoCard key={video.id} video={video as UpcomingVideo} />;
            }
          })}
        </div>
      )}
    </div>
  );
}
