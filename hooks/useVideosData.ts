'use client';

import { useQuery } from '@tanstack/react-query';
import { 
  VideoApiResponse, 
  UpcomingVideo, 
  LiveVideo, 
  RankingVideo, 
  VideoApiEndpoint,
  VideoTabType 
} from '@/types/videos';

// Generic hook for fetching video data
const useVideoData = <T>(endpoint: VideoApiEndpoint, tabType: VideoTabType, enabled: boolean = true) => {
  return useQuery<VideoApiResponse<T>>({
    queryKey: ['videos', endpoint],
    queryFn: async () => {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${tabType} videos`);
      }
      return response.json();
    },
    enabled,
    refetchInterval: enabled ? getRefreshInterval(tabType) : false,
    staleTime: getStaleTime(tabType),
  });
};

// Get refresh interval based on tab type
const getRefreshInterval = (tabType: VideoTabType): number => {
  switch (tabType) {
    case 'live-upcoming':
      return 30000; // 30 seconds for live videos
    default:
      return 600000; // 10 minutes for rankings
  }
};

// Get stale time based on tab type
const getStaleTime = (tabType: VideoTabType): number => {
  switch (tabType) {
    case 'live-upcoming':
      return 15000; // 15 seconds for live videos
    default:
      return 300000; // 5 minutes for rankings
  }
};

// Specific hooks for each video type
export const useUpcomingVideos = (enabled: boolean = true) => {
  return useVideoData<UpcomingVideo>(VideoApiEndpoint.UPCOMING, 'live-upcoming', enabled);
};

export const useLiveVideos = (enabled: boolean = true) => {
  return useVideoData<LiveVideo>(VideoApiEndpoint.LIVE, 'live-upcoming', enabled);
};

export const use24HrRankingVideos = (enabled: boolean = true) => {
  return useVideoData<RankingVideo>(VideoApiEndpoint.RANKING_24HR, '24hr', enabled);
};

export const use3DaysRankingVideos = (enabled: boolean = true) => {
  return useVideoData<RankingVideo>(VideoApiEndpoint.RANKING_3DAYS, '3days', enabled);
};

export const use7DaysRankingVideos = (enabled: boolean = true) => {
  return useVideoData<RankingVideo>(VideoApiEndpoint.RANKING_7DAYS, '7days', enabled);
};
