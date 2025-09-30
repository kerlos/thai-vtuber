'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export type TabType = 'home' | 'videos' | 'shorts' | 'live' | 'playlists' | 'releases' | 'posts';

interface ChannelTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'home' as const, labelKey: 'Home' },
  { id: 'videos' as const, labelKey: 'Videos' },
  { id: 'shorts' as const, labelKey: 'Shorts' },
  { id: 'live' as const, labelKey: 'Live' },
  { id: 'releases' as const, labelKey: 'Releases' },
  { id: 'playlists' as const, labelKey: 'Playlists' },
  { id: 'posts' as const, labelKey: 'Posts' },
];

export default function ChannelTabs({ activeTab, onTabChange }: ChannelTabsProps) {
  const t = useTranslations();
  
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <nav className="flex space-x-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
