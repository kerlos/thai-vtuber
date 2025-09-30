'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useChannelChartData, ChartDataPoint } from '@/hooks/useYouTubeData';
import { format, parseISO } from 'date-fns';

interface ChannelChartProps {
  channelId: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload as any; // Using any since it includes our formatted fields
    if (data) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm mb-1">
            {data.fullDate}
          </p>
          <div className="space-y-1">
            <p className="text-blue-600 font-medium">
              {data.subscribersLabel}: {data.subscribers.toLocaleString()}
            </p>
            <p className="text-green-600 font-medium">
              {data.viewsLabel}: {data.views.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
  }
  return null;
};

// Format number for Y-axis
const formatYAxisNumber = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export default function ChannelChart({ channelId }: ChannelChartProps) {
  const t = useTranslations();
  const { data: chartData, isLoading, error } = useChannelChartData(channelId);

  // Group data by month and format for the chart
  const formatChartData = (data: ChartDataPoint[]) => {
    if (!Array.isArray(data)) {
      console.warn('Chart data is not an array:', data);
      return [];
    }
    
    // Group data by month-year
    const monthlyData = data.reduce((acc, point) => {
      const date = parseISO(point.date);
      const monthKey = format(date, 'yyyy-MM'); // "2021-04" format for grouping
      
      // Keep the latest entry for each month (or you could average them)
      if (!acc[monthKey] || parseISO(point.date) > parseISO(acc[monthKey].date)) {
        acc[monthKey] = point;
      }
      
      return acc;
    }, {} as Record<string, ChartDataPoint>);
    
    // Convert back to array and sort by date
    return Object.values(monthlyData)
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
      .map((point) => ({
        ...point,
        displayDate: format(parseISO(point.date), 'MMM yyyy'),
        fullDate: format(parseISO(point.date), 'MMM dd, yyyy'),
        subscribersLabel: t('Subscribers'),
        viewsLabel: t('Views'),
      }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg font-medium mb-2">{t('Chart data unavailable')}</p>
            <p className="text-sm">{t('Unable to load chart data for this channel')}</p>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg font-medium mb-2">{t('No chart data available')}</p>
            <p className="text-sm">{t("This channel doesn't have historical data yet")}</p>
          </div>
        </div>
      </div>
    );
  }

  const formattedData = formatChartData(chartData);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {t('Channel Growth')}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {t('Subscribers and views over time')}
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="displayDate"
              stroke="#666"
              fontSize={11}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
              interval="preserveStartEnd"
            />
            {/* Left Y-axis for Subscribers */}
            <YAxis
              yAxisId="subscribers"
              stroke="#3b82f6"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxisNumber}
              orientation="left"
            />
            {/* Right Y-axis for Views */}
            <YAxis
              yAxisId="views"
              stroke="#10b981"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxisNumber}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Always show both subscribers and views */}
            <Line
              type="monotone"
              dataKey="subscribers"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 1, r: 1 }}
              activeDot={{ r: 4 }}
              name={t('Subscribers')}
              yAxisId="subscribers"
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 1, r: 1 }}
              activeDot={{ r: 4 }}
              name={t('Views')}
              yAxisId="views"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
