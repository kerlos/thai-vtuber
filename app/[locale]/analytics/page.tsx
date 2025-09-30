'use client';

import { useState, useMemo } from 'react';
import { Users, Eye, TrendingUp, Activity, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useVTuberData } from '@/hooks/useVTuberData';
import { calculateDashboardStats, formatNumber } from '@/utils/vtuberStats';
import { StatCard } from '@/components/StatCard';
import { VTuberCharts } from '@/components/VTuberCharts';
import { DashboardFilters } from '@/types/vtuber';

export default function Analytics() {
  const t = useTranslations();
  const { data, isLoading, error, refetch } = useVTuberData();
  const [filters, setFilters] = useState<DashboardFilters>({
    search: '',
    showOriginalVtuber: true, // Default to show only original VTubers
    showInactive: false,      // Default to not show inactive channels
  });

  const filteredChannels = useMemo(() => {
    if (!data?.result) return [];

    return data.result.filter((channel) => {
      // If showOriginalVtuber is true, only show original channels (is_rebranded = false)
      // If showOriginalVtuber is false, show all channels (regardless of rebranding status)
      const matchesRebranded = !filters.showOriginalVtuber || !channel.is_rebranded;
      return matchesRebranded;
    });
  }, [data?.result, filters.showOriginalVtuber]);

  const stats = useMemo(() => {
    return filteredChannels.length > 0 ? calculateDashboardStats(filteredChannels) : null;
  }, [filteredChannels]);

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">{t('loadingAnalyticsData')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('Failed to load analytics')}</h2>
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('Analytics Dashboard')}</h1>
        <p className="mt-2 text-gray-600">
          {t('Comprehensive data visualization and insights for Thai VTuber channels')}
        </p>
        
        {/* Toggle Filter */}
        <div className="mt-4 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-original-vtuber-analytics"
              checked={filters.showOriginalVtuber}
              onChange={(e) => setFilters(prev => ({ ...prev, showOriginalVtuber: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
            <label htmlFor="show-original-vtuber-analytics" className="text-sm font-medium text-gray-700 cursor-pointer">
              {t('Show original VTuber only')}
            </label>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('Key Metrics')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title={t('Total Channels')}
              value={stats.totalChannels}
              icon={<Users className="w-5 h-5" />}
              description={t('Active VTuber channels')}
            />
            <StatCard
              title={t('Total Subscribers')}
              value={formatNumber(stats.totalSubscribers)}
              icon={<Users className="w-5 h-5" />}
              description={t('Across all channels')}
            />
            <StatCard
              title={t('Total Views')}
              value={formatNumber(stats.totalViews)}
              icon={<Eye className="w-5 h-5" />}
              description={t('All-time video views')}
            />
            <StatCard
              title={t('Avg Subscribers')}
              value={formatNumber(stats.averageSubscribers)}
              icon={<TrendingUp className="w-5 h-5" />}
              description={t('Per channel')}
            />
          </div>
        </div>
      )}

      {/* Data Visualization */}
      {filteredChannels.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('Data Visualization')}</h2>
          <VTuberCharts channels={filteredChannels} />
        </div>
      )}
    </div>
  );
}
