'use client';

import { useState } from 'react';
import { VideoTabType } from '@/types/videos';
import VideosTabs from '@/components/VideosTabs';
import VideosList from '@/components/VideosList';

export default function VideosPage() {
  const [activeTab, setActiveTab] = useState<VideoTabType>('live-upcoming');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Thai VTuber Videos</h1>
        <p className="mt-2 text-gray-600">
          Discover upcoming streams, live content, and trending videos from Thai VTubers
        </p>
      </div>

      {/* Tabs Navigation */}
      <VideosTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <VideosList activeTab={activeTab} />
    </div>
  );
}
