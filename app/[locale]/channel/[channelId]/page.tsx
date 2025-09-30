'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  useChannelDetails,
  useYouTubeChannelVideos,
} from '@/hooks/useYouTubeData';
import ChannelHeader from '@/components/ChannelHeader';
import ChannelTabs, { TabType } from '@/components/ChannelTabs';
import VideoGrid from '@/components/VideoGrid';
import PlaylistSection from '@/components/PlaylistSection';
import ChannelChart from '@/components/ChannelChart';

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Error Component
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {message}
    </div>
  </div>
);

// Main Channel Page Component
export default function ChannelPage() {
  const t = useTranslations();
  const params = useParams();
  const channelId = params.channelId as string;

  const {
    data: channel,
    isLoading: channelLoading,
    error: channelError,
  } = useChannelDetails(channelId);
  const {
    data: videos,
    isLoading: videosLoading,
    error: videosError,
  } = useYouTubeChannelVideos(channelId, 20);

  if (channelLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (channelError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorMessage message={t('Failed to load channel data')} />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorMessage message={t('Channel not found')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ChannelHeader channel={channel} />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Channel Chart Section */}
        <div className="py-8">
          <ChannelChart channelId={channelId} />
        </div>
        
        {/* Videos Section */}
        <div className="py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t('Latest Videos')}
          </h2>
          <VideoGrid
            videos={videos || []}
            isLoading={videosLoading}
            error={videosError}
          />
        </div>
      </div>
    </div>
  );
}
