'use client';

import { ChannelList } from '@/components/ChannelList';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Pagination } from '@/components/Pagination';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { useVTuberData } from '@/hooks/useVTuberData';
import { Link } from '@/i18n/navigation';
import { SortField, SortOrder } from '@/types/pagination';
import { DashboardFilters, PaginationState } from '@/types/vtuber';
import { calculateDashboardStats, formatNumber, getPaginatedItems, isChannelActive } from '@/utils/vtuberStats';
import { AlertCircle, Github, Loader, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

export default function Dashboard() {
  const t = useTranslations();
  const { data, isLoading, error, refetch } = useVTuberData();
  const [filters, setFilters] = useState<DashboardFilters>({
    search: '',
    showOriginalVtuber: true, // Default to show only original VTubers
    showInactive: false,      // Default to not show inactive channels
  });

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 25,
    totalItems: 0,
  });

  const [sortField, setSortField] = useState<SortField>('subscribers');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredChannels = useMemo(() => {
    if (!data?.result) return [];

    const filtered = data.result.filter((channel) => {
      const matchesSearch = filters.search === '' || 
        channel.title.toLowerCase().includes(filters.search.toLowerCase());
      
      // If showOriginalVtuber is true, only show original channels (is_rebranded = false)
      // If showOriginalVtuber is false, show all channels (regardless of rebranding status)
      const matchesRebranded = !filters.showOriginalVtuber || !channel.is_rebranded;

      const channelIsActive = isChannelActive(channel);
      // If showInactive is false, only show active channels
      // If showInactive is true, show all channels (regardless of activity status)
      const matchesActive = filters.showInactive || channelIsActive;

      return matchesSearch && matchesRebranded && matchesActive;
    });

    // Update pagination total when filters change
    setPagination(prev => ({
      ...prev,
      totalItems: filtered.length,
      currentPage: 1, // Reset to first page when filters change
    }));

    return filtered;
  }, [data?.result, filters]);

  const sortedAndFilteredChannels = useMemo(() => {
    const sorted = [...filteredChannels].sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (sortField === 'published_at' || sortField === 'last_published_video_at') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [filteredChannels, sortField, sortOrder]);

  const paginatedChannels = useMemo(() => {
    return getPaginatedItems(sortedAndFilteredChannels, pagination.currentPage, pagination.pageSize);
  }, [sortedAndFilteredChannels, pagination.currentPage, pagination.pageSize]);

  const stats = useMemo(() => {
    return data?.result ? calculateDashboardStats(data.result) : null;
  }, [data?.result]);

  // Create separate subscriber-based rankings for original and rebranded VTubers
  const subscriberRanks = useMemo(() => {
    if (!data?.result) return { original: new Map<string, number>(), rebranded: new Map<string, number>() };
    
    // Separate original and rebranded channels
    const originalChannels = data.result.filter(channel => !channel.is_rebranded);
    const rebrandedChannels = data.result.filter(channel => channel.is_rebranded);
    
    // Create ranking for original channels
    const sortedOriginal = [...originalChannels]
      .sort((a, b) => b.subscribers - a.subscribers);
    
    const originalRanksMap = new Map<string, number>();
    sortedOriginal.forEach((channel, index) => {
      originalRanksMap.set(channel.channel_id, index + 1);
    });
    
    // Create ranking for rebranded channels
    const sortedRebranded = [...rebrandedChannels]
      .sort((a, b) => b.subscribers - a.subscribers);
    
    const rebrandedRanksMap = new Map<string, number>();
    sortedRebranded.forEach((channel, index) => {
      rebrandedRanksMap.set(channel.channel_id, index + 1);
    });
    
    return { 
      original: originalRanksMap, 
      rebranded: rebrandedRanksMap 
    };
  }, [data?.result]);

  const handleRetry = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination(prev => ({ 
      ...prev, 
      pageSize,
      currentPage: 1 // Reset to first page when page size changes
    }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle between desc and asc for the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field always starts with desc (descending)
      setSortField(field);
      setSortOrder('desc');
    }
    // Reset to first page when sorting changes
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">{t('loadingVTuberData')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('Failed to load data')}</h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : t('An unexpected error occurred')}
          </p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t('Retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('Thai Vtuber Channels')}</h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">
            {t('Browse and explore Thai VTuber channels')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap w-full md:w-auto justify-end">
          <LanguageSwitcher />
          <Link
            href="/register"
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-xs md:text-sm font-medium whitespace-nowrap"
          >
            <span>{t('Submit Channel')}</span>
          </Link>
          <Link
            href="https://github.com/kerlos/thai-vtuber"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-black text-white hover:bg-gray-800 rounded-lg transition-colors text-xs md:text-sm font-medium"
          >
            <Github className="w-4 h-4" />
            <span className="hidden md:inline">{t('Repository')}</span>
          </Link>
        </div>
      </div>
        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{stats.totalChannels}</div>
              <div className="text-sm text-gray-600">{t('Total Channels')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalSubscribers)}</div>
              <div className="text-sm text-gray-600">{t('Total Subscribers')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{stats.activeChannels}</div>
              <div className="text-sm text-gray-600">{t('Active Channels')}</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <SearchAndFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={filteredChannels.length}
        />

        {/* Channel List */}
        {filteredChannels.length === 0 && filters.search.trim() !== '' ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('No channels found')}</h3>
            <p className="text-gray-600 mb-4">
              {t('We couldn\'t find any channels matching your search term')} "{filters.search}".
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>{t('Don\'t see your favorite VTuber?')}</strong>
              </p>
              <p className="text-sm text-blue-700">
                {t('You can submit a channel for inclusion via our')}{' '}
                <Link 
                  href="/register"
                  className="font-semibold text-blue-600 hover:text-blue-800 underline"
                >
                  {t('register page')}
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <ChannelList 
              channels={paginatedChannels} 
              startIndex={(pagination.currentPage - 1) * pagination.pageSize}
              subscriberRanks={subscriberRanks}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
    </div>
  );
}
