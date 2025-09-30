'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import { VTuberChannel, CustomTooltipProps, TooltipPayloadEntry } from '@/types/vtuber';
import { formatNumber, isChannelActive } from '@/utils/vtuberStats';

interface VTuberChartsProps {
  channels: VTuberChannel[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export const VTuberCharts = ({ channels }: VTuberChartsProps) => {
  const t = useTranslations();
  
  const chartData = useMemo(() => {
    // Top 10 channels by subscribers
    const topChannels = [...channels]
      .sort((a, b) => b.subscribers - a.subscribers)
      .slice(0, 10)
      .map(channel => ({
        name: channel.title.length > 15 ? channel.title.slice(0, 15) + '...' : channel.title,
        fullName: channel.title,
        subscribers: channel.subscribers,
        views: channel.views,
      }));

    // Activity Status Distribution
    const activeChannels = channels.filter(c => isChannelActive(c)).length;
    const inactiveChannels = channels.length - activeChannels;
    const activityData = [
      {
        name: t('Active (90 days)'),
        value: activeChannels,
        percentage: Math.round((activeChannels / channels.length) * 100),
      },
      {
        name: t('Inactive (90+ days)'),
        value: inactiveChannels,
        percentage: Math.round((inactiveChannels / channels.length) * 100),
      },
    ];

    // Subscribers vs Views scatter data
    const scatterData = channels
      .filter(channel => channel.subscribers > 0 && channel.views > 0)
      .map(channel => ({
        name: channel.title,
        subscribers: channel.subscribers,
        views: channel.views,
        ratio: channel.views / channel.subscribers,
      }))
      .slice(0, 50); // Limit to 50 points for better performance

    // Activity by year
    const yearlyActivityData = channels.reduce((acc, channel) => {
      const year = new Date(channel.published_at).getFullYear();
      if (year >= 2018) {
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    const yearlyActivity = Object.entries(yearlyActivityData)
      .map(([year, count]) => ({ year: parseInt(year), channels: count }))
      .sort((a, b) => a.year - b.year);

    // Engagement Rate Distribution (Views per Subscriber)
    const engagementRanges = [
      { range: '0-50', min: 0, max: 50, count: 0 },
      { range: '51-100', min: 51, max: 100, count: 0 },
      { range: '101-200', min: 101, max: 200, count: 0 },
      { range: '201-500', min: 201, max: 500, count: 0 },
      { range: '501-1000', min: 501, max: 1000, count: 0 },
      { range: '1000+', min: 1001, max: Infinity, count: 0 },
    ];

    channels.forEach(channel => {
      if (channel.subscribers > 0) {
        const ratio = channel.views / channel.subscribers;
        const range = engagementRanges.find(r => ratio >= r.min && ratio <= r.max);
        if (range) range.count++;
      }
    });

    const engagementData = engagementRanges.map(r => ({
      range: r.range,
      channels: r.count,
      percentage: Math.round((r.count / channels.length) * 100),
    }));

    // Channel Size Categories
    const sizeCategories = [
      { name: t('Micro (0-10K)'), min: 0, max: 10000, count: 0, color: '#8884d8' },
      { name: t('Small (10K-100K)'), min: 10000, max: 100000, count: 0, color: '#82ca9d' },
      { name: t('Medium (100K-500K)'), min: 100000, max: 500000, count: 0, color: '#ffc658' },
      { name: t('Large (500K-1M)'), min: 500000, max: 1000000, count: 0, color: '#ff7300' },
      { name: t('Mega (1M+)'), min: 1000000, max: Infinity, count: 0, color: '#0088FE' },
    ];

    channels.forEach(channel => {
      const category = sizeCategories.find(c => channel.subscribers >= c.min && channel.subscribers < c.max);
      if (category) category.count++;
    });

    const channelSizeData = sizeCategories
      .filter(c => c.count > 0)
      .map(c => ({
        name: c.name,
        value: c.count,
        percentage: Math.round((c.count / channels.length) * 100),
      }));

    // Growth Potential Analysis (High engagement, lower subscribers)
    const growthPotentialChannels = channels
      .filter(channel => channel.subscribers > 1000 && channel.subscribers < 100000)
      .map(channel => ({
        name: channel.title.length > 20 ? channel.title.slice(0, 20) + '...' : channel.title,
        fullName: channel.title,
        subscribers: channel.subscribers,
        engagementRate: channel.views / channel.subscribers,
        views: channel.views,
      }))
      .filter(channel => channel.engagementRate > 100)
      .sort((a, b) => b.engagementRate - a.engagementRate)
      .slice(0, 10);

    // Content Freshness Timeline
    const now = new Date();
    const freshnessRanges = [
      { range: t('0-7 days'), days: 7, count: 0 },
      { range: t('8-30 days'), days: 30, count: 0 },
      { range: t('31-90 days'), days: 90, count: 0 },
      { range: t('91-180 days'), days: 180, count: 0 },
      { range: t('181-365 days'), days: 365, count: 0 },
      { range: t('1+ years'), days: Infinity, count: 0 },
    ];

    channels.forEach(channel => {
      if (channel.last_published_video_at) {
        const lastVideo = new Date(channel.last_published_video_at);
        const daysSince = Math.floor((now.getTime() - lastVideo.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSince <= 7) freshnessRanges[0].count++;
        else if (daysSince <= 30) freshnessRanges[1].count++;
        else if (daysSince <= 90) freshnessRanges[2].count++;
        else if (daysSince <= 180) freshnessRanges[3].count++;
        else if (daysSince <= 365) freshnessRanges[4].count++;
        else freshnessRanges[5].count++;
      }
    });

    const contentFreshnessData = freshnessRanges.map(r => ({
      range: r.range,
      channels: r.count,
      percentage: Math.round((r.count / channels.length) * 100),
    }));

    return { 
      topChannels, 
      activityData, 
      scatterData, 
      yearlyActivity,
      engagementData,
      channelSizeData,
      growthPotentialChannels,
      contentFreshnessData
    };
  }, [channels, t]);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="text-sm font-medium text-black">{payload[0]?.payload?.fullName || label}</p>
          {payload.map((entry: TooltipPayloadEntry, index: number) => (
            <p key={index} className="text-sm text-black">
              <span style={{ color: entry.color }}>●</span> {`${entry.dataKey}: ${formatNumber(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
      {/* Top Channels Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('Top 10 Channels by Subscribers')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.topChannels} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="subscribers" fill="#0088FE" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Status Distribution Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('Channel Activity Status')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.activityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.activityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value} ${t('channels')}`,
                name
              ]}
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', color: 'black' }}
              labelStyle={{ color: 'black' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Subscribers vs Views Scatter Plot */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('Subscribers vs Views Correlation')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={chartData.scatterData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="subscribers"
              type="number"
              tickFormatter={formatNumber}
              name={t('Subscribers')}
            />
            <YAxis
              dataKey="views"
              type="number"
              tickFormatter={formatNumber}
              name={t('Views')}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={(props: CustomTooltipProps) => {
                const { active, payload } = props;
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="text-sm font-medium text-black">{data.name}</p>
              <p className="text-sm text-black">{t('Subscribers')}: {formatNumber(data.subscribers || 0)}</p>
              <p className="text-sm text-black">{t('Views')}: {formatNumber(data.views || 0)}</p>
              <p className="text-sm text-black">{t('Ratio')}: {(data.ratio || 0).toFixed(1)} {t('viewsPerSubscriber')}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter fill="#00C49F" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Channel Creation Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('Channel Creation Timeline')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.yearlyActivity} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', color: 'black' }}
              labelStyle={{ color: 'black' }}
            />
            <Bar dataKey="channels" fill="#FF8042" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement Rate Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('Engagement Rate Distribution')}</h3>
        <p className="text-sm text-gray-600 mb-3">{t('Views per subscriber ratio')}</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData.engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis             />
            <Tooltip 
              formatter={(value: number) => [`${value} ${t('channels')}`, t('channels')]}
              labelFormatter={(label) => `${t('Engagement Range')}: ${label}`}
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', color: 'black' }}
              labelStyle={{ color: 'black' }}
            />
            <Area
              type="monotone" 
              dataKey="channels" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Channel Size Categories */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('Channel Size Distribution')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.channelSizeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.channelSizeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value} ${t('channels')}`,
                name
              ]}
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', color: 'black' }}
              labelStyle={{ color: 'black' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Growth Potential Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('Growth Potential Channels')}</h3>
        <p className="text-sm text-gray-600 mb-3">{t('High engagement, under 100K subscribers')}</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.growthPotentialChannels} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip
              content={(props: CustomTooltipProps) => {
                const { active, payload } = props;
                if (active && payload && payload.length) {
                  const data = payload[0].payload as any;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="text-sm font-medium text-black">{data.fullName}</p>
                      <p className="text-sm text-black">{t('Subscribers')}: {formatNumber(data.subscribers || 0)}</p>
                      <p className="text-sm text-black">{t('Engagement Rate')}: {(data.engagementRate || 0).toFixed(1)} {t('viewsPerSub')}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="engagementRate" fill="#00C49F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Content Freshness Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('Content Freshness Timeline')}</h3>
        <p className="text-sm text-gray-600 mb-3">{t('When channels last published content')}</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.contentFreshnessData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`${value} ${t('channels')}`, t('channels')]}
              labelFormatter={(label) => `${t('Last Published')}: ${label}`}
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', color: 'black' }}
              labelStyle={{ color: 'black' }}
            />
            <Line 
              type="monotone" 
              dataKey="channels" 
              stroke="#ff7300" 
              strokeWidth={3}
              dot={{ fill: '#ff7300', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

