'use client';

import { useTranslations } from 'next-intl';
import { VideoTabType } from '@/types/videos';

interface VideosTabsProps {
  activeTab: VideoTabType;
  onTabChange: (tab: VideoTabType) => void;
}

export default function VideosTabs({ activeTab, onTabChange }: VideosTabsProps) {
  const t = useTranslations();
  
  const tabs = [
    { id: 'live-upcoming' as const, label: t('Live & Upcoming') },
    { id: '24hr' as const, label: t('24 Hours') },
    { id: '3days' as const, label: t('3 Days') },
    { id: '7days' as const, label: t('7 Days') },
  ];
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer
              ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm transform scale-[0.98]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-[0.97]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
