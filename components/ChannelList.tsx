'use client';

import { useState } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { VTuberChannel } from '@/types/vtuber';
import { formatNumber, formatDate, isChannelActive } from '@/utils/vtuberStats';
import { ExternalLink, Users, Eye, Calendar, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { SortField, SortOrder } from '@/types/pagination';

interface ChannelListProps {
  channels: VTuberChannel[];
  startIndex?: number;
  subscriberRanks?: {
    original: Map<string, number>;
    rebranded: Map<string, number>;
  };
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export const ChannelList = ({ channels, startIndex = 0, subscriberRanks, sortField, sortOrder, onSort }: ChannelListProps) => {
  const t = useTranslations();
  const router = useRouter();
  
  // Helper function to get the appropriate rank for a channel
  const getChannelRank = (channel: VTuberChannel, index: number): number => {
    if (!subscriberRanks) return startIndex + index + 1;
    
    const rankMap = channel.is_rebranded ? subscriberRanks.rebranded : subscriberRanks.original;
    return rankMap.get(channel.channel_id) || (startIndex + index + 1);
  };
  
  // Navigate to channel page
  const handleChannelClick = (channelId: string) => {
    // Send GTM event for channel click tracking
    sendGAEvent('event', 'channel_click', {
      channelId: channelId
    });
    
    router.push(`/channel/${channelId}`);
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
    >
      {children}
      {sortField === field && (
        <span className="text-xs">
          {sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );

  return (
    <div className="overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{t('VTuber Channels')}</h3>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {channels.map((channel, index) => (
          <div 
            key={channel.channel_id} 
            className="border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all duration-200 ease-in-out transform"
            onClick={() => handleChannelClick(channel.channel_id)}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Image
                    src={channel.thumbnail_icon_url}
                    alt={`${channel.title} thumbnail`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src.includes('yt3.ggpht.com')) {
                        target.src = target.src.replace('yt3.ggpht.com', 'yt3.googleusercontent.com');
                      }
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate pr-2 hover:text-blue-700 transition-all duration-200 transform-gpu">
                      {channel.title}
                    </h4>
                    <span className="text-xs text-gray-700 flex-shrink-0">
                      #{getChannelRank(channel, index)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-2">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {formatNumber(channel.subscribers)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(channel.views)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isChannelActive(channel) ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          <CheckCircle className="w-2 h-2" />
                          {t('Active')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          <XCircle className="w-2 h-2" />
                          {t('Inactive')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('Rank')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t('Channel')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <SortButton field="subscribers">{t('Subscribers')}</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <SortButton field="views">{t('Views')}</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <SortButton field="published_at">{t('Created')}</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <SortButton field="last_published_video_at">{t('Last Video')}</SortButton>
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {channels.map((channel, index) => (
              <tr 
                key={channel.channel_id} 
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-lg cursor-pointer"
                onClick={() => handleChannelClick(channel.channel_id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  #{getChannelRank(channel, index)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center group">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image
                        src={channel.thumbnail_icon_url}
                        alt={`${channel.title} thumbnail`}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover group-hover:ring-2 group-hover:ring-blue-300 group-hover:ring-offset-2 group-hover:scale-110 transition-all duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src.includes('yt3.ggpht.com')) {
                            target.src = target.src.replace('yt3.ggpht.com', 'yt3.googleusercontent.com');
                          }
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate group-hover:text-blue-700 group-hover:scale-105 transition-all duration-200 transform-gpu">
                        {channel.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-1 group">
                    <Users className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                    <span className="group-hover:font-semibold transition-all">{formatNumber(channel.subscribers)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-1 group">
                    <Eye className="w-4 h-4 text-gray-500 group-hover:text-purple-500 transition-colors" />
                    <span className="group-hover:font-semibold transition-all">{formatNumber(channel.views)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {formatDate(channel.published_at)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {channel.last_published_video_at ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {formatDate(channel.last_published_video_at)}
                    </div>
                  ) : (
                    <span className="text-gray-500">{t('No videos')}</span>
                  )}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-between">
                    <div>
                      {isChannelActive(channel) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

