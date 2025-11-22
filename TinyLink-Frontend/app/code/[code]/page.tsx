'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Copy, Calendar, MousePointerClick, TrendingUp, Monitor, Smartphone, Tablet, Clock } from 'lucide-react';
import { format, subDays, eachDayOfInterval, parseISO } from 'date-fns';
import { useLinkStore } from '@/store/useLinkStore';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Alert } from '@/components/ui/Alert';
import { Loader2 } from 'lucide-react';
import { SkeletonCard, SkeletonChart, Skeleton } from '@/components/ui/Skeleton';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#a855f7', '#ec4899', '#8b5cf6', '#f472b6', '#c084fc', '#f59e0b'];

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const { currentLink, loading, error, fetchLinkByCode } = useLinkStore();

  useEffect(() => {
    if (code) {
      fetchLinkByCode(code);
    }
  }, [code, fetchLinkByCode]);

  // Process analytics data for charts
  const chartData = useMemo(() => {
    if (!currentLink?.analytics || currentLink.analytics.length === 0) {
      return {
        dailyClicks: [],
        deviceData: [],
        browserData: [],
        osData: [],
      };
    }

    // Daily clicks data (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const dailyClicksMap: Record<string, number> = {};
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: new Date() });
    days.forEach((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      dailyClicksMap[dateKey] = 0;
    });

    currentLink.analytics.forEach((analytics) => {
      const dateKey = format(parseISO(analytics.clickedAt), 'yyyy-MM-dd');
      if (dailyClicksMap.hasOwnProperty(dateKey)) {
        dailyClicksMap[dateKey]++;
      }
    });

    const dailyClicks = Object.entries(dailyClicksMap)
      .map(([date, count]) => ({
        date: format(parseISO(date), 'MMM dd'),
        clicks: count,
        fullDate: date,
      }))
      .slice(-30);

    // Device type distribution
    const deviceMap: Record<string, number> = {};
    currentLink.analytics.forEach((a) => {
      const device = a.deviceType || 'Unknown';
      deviceMap[device] = (deviceMap[device] || 0) + 1;
    });
    const deviceData = Object.entries(deviceMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Browser distribution
    const browserMap: Record<string, number> = {};
    currentLink.analytics.forEach((a) => {
      const browser = a.browser || 'Unknown';
      browserMap[browser] = (browserMap[browser] || 0) + 1;
    });
    const browserData = Object.entries(browserMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // OS distribution
    const osMap: Record<string, number> = {};
    currentLink.analytics.forEach((a) => {
      const os = a.os || 'Unknown';
      osMap[os] = (osMap[os] || 0) + 1;
    });
    const osData = Object.entries(osMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return { dailyClicks, deviceData, browserData, osData };
  }, [currentLink]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm mb-1">{label}</p>
          <p className="text-primary-400 font-semibold">
            {payload[0].value} {payload[0].name}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      // Get the value - could be data.value or data.payload.value
      const value = data.value || data.payload?.value || 0;
      const name = data.name || data.payload?.name || 'Unknown';
      
      // Calculate total for percentage
      const total = chartData.deviceData.reduce((sum, item) => sum + item.value, 0);
      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
      
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white text-sm font-semibold mb-1">{name}</p>
          <p className="text-primary-400 font-semibold">
            {value} clicks ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton variant="rectangular" width="48px" height="48px" className="rounded-lg" />
          <div className="space-y-2">
            <Skeleton variant="rectangular" width="200px" height="32px" />
            <Skeleton variant="rectangular" width="300px" height="20px" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Link Info Skeleton */}
        <SkeletonCard />

        {/* Charts Skeleton */}
        <SkeletonChart />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <SkeletonChart />
      </div>
    );
  }

  if (error || !currentLink) {
    return (
      <div className="space-y-4">
        {error && <Alert type="error" message={error} />}
        <div className="card text-center py-12">
          <p className="text-gray-400 mb-4">Link not found</p>
          <Button onClick={() => router.push('/')} variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 animate-in slide-down">
        <Button
          variant="secondary"
          onClick={() => router.push('/')}
          className="!p-2 hover-lift transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-white animate-in slide-up">Link Analytics</h2>
          <p className="text-gray-400 mt-1 animate-in fade-in">Detailed insights for your shortened link</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card gradient-glow hover-lift animate-in slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Clicks</p>
              <p className="text-3xl font-bold text-white">{currentLink.clicks}</p>
            </div>
            <div className="p-3 bg-primary-600/20 rounded-lg">
              <MousePointerClick className="w-8 h-8 text-primary-400" />
            </div>
          </div>
        </div>
        <div className="card gradient-glow hover-lift animate-in slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Created</p>
              <p className="text-lg font-semibold text-white">
                {format(new Date(currentLink.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
            <div className="p-3 bg-primary-600/20 rounded-lg">
              <Calendar className="w-8 h-8 text-primary-400" />
            </div>
          </div>
        </div>
        <div className="card gradient-glow hover-lift animate-in slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <p className="text-lg font-semibold">
                {(() => {
                  const isExpired = currentLink.expiresAt && new Date(currentLink.expiresAt) < new Date();
                  const isInactive = !currentLink.isActive || isExpired;
                  return (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-smooth ${
                        isInactive
                          ? 'bg-red-900/30 text-red-300 border border-red-700'
                          : 'bg-green-900/30 text-green-300 border border-green-700'
                      }`}
                    >
                      {isExpired ? 'Expired' : currentLink.isActive ? 'Active' : 'Inactive'}
                    </span>
                  );
                })()}
              </p>
            </div>
            <div className="p-3 bg-primary-600/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Link Info Card */}
      <div className="card animate-in slide-up">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">Short Code</label>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-lg font-semibold text-primary-400">
                {currentLink.shortCode}
              </span>
              <CopyButton text={currentLink.shortUrl} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">Short URL</label>
            <div className="mt-1 flex items-center gap-2">
              <a
                href={currentLink.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                {currentLink.shortUrl}
                <ExternalLink className="w-4 h-4" />
              </a>
              <CopyButton text={currentLink.shortUrl} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">Original URL</label>
            <div className="mt-1">
              <a
                href={currentLink.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 break-all flex items-center gap-1"
                title={currentLink.originalUrl}
              >
                {currentLink.originalUrl}
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
              </a>
            </div>
          </div>

          {currentLink.title && (
            <div>
              <label className="text-sm font-medium text-gray-400">Title</label>
              <p className="mt-1 text-white">{currentLink.title}</p>
            </div>
          )}

          {currentLink.description && (
            <div>
              <label className="text-sm font-medium text-gray-400">Description</label>
              <p className="mt-1 text-gray-300">{currentLink.description}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-400">Expiration</label>
            <div className="mt-1 flex items-center gap-2">
              {currentLink.expiresAt ? (
                <>
                  <Clock
                    className={`w-4 h-4 ${
                      new Date(currentLink.expiresAt) < new Date()
                        ? 'text-red-400'
                        : 'text-yellow-400'
                    }`}
                  />
                  <span
                    className={
                      new Date(currentLink.expiresAt) < new Date()
                        ? 'text-red-400'
                        : 'text-yellow-400'
                    }
                  >
                    {new Date(currentLink.expiresAt) < new Date()
                      ? `Expired on ${format(new Date(currentLink.expiresAt), 'MMM d, yyyy HH:mm')}`
                      : `Expires on ${format(new Date(currentLink.expiresAt), 'MMM d, yyyy HH:mm')}`}
                  </span>
                </>
              ) : (
                <span className="text-gray-500">Never expires</span>
              )}
            </div>
          </div>
              </div>
            </div>

      {/* Charts Section */}
      {currentLink.analytics && currentLink.analytics.length > 0 ? (
        <>
          {/* Daily Clicks Chart */}
          <div className="card animate-in slide-up">
            <h3 className="text-xl font-semibold text-white mb-6">Clicks Over Time (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.dailyClicks}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#a855f7"
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                />
              </AreaChart>
            </ResponsiveContainer>
              </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Type Pie Chart */}
            <div className="card animate-in slide-up">
              <h3 className="text-xl font-semibold text-white mb-6">Device Types</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                      if (!midAngle || !cx || !cy || !innerRadius || !outerRadius) return null;
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#ffffff"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          fontSize={12}
                          fontWeight={500}
                        >
                          {`${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                        </text>
                      );
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<PieTooltip />}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    itemStyle={{
                      color: '#ffffff',
                    }}
                    labelStyle={{
                      color: '#ffffff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              </div>

            {/* Browser Bar Chart */}
            <div className="card animate-in slide-up">
              <h3 className="text-xl font-semibold text-white mb-6">Top Browsers</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.browserData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#a855f7" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
        </div>
      </div>

          {/* OS Chart */}
          <div className="card animate-in slide-up">
            <h3 className="text-xl font-semibold text-white mb-6">Operating Systems</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.osData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

      {/* Analytics Table */}
          <div className="card animate-in slide-up">
            <h3 className="text-lg font-semibold text-white mb-4">
            Recent Clicks ({currentLink.analytics.length})
          </h3>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-700/50 border-b border-gray-700">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Date & Time
                  </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Device
                  </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Browser
                  </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    OS
                  </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    IP Address
                  </th>
                </tr>
              </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentLink.analytics.slice(0, 20).map((analytics) => (
                    <tr key={analytics.id} className="hover:bg-gray-700/30 transition-smooth">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                      {format(new Date(analytics.clickedAt), 'MMM d, yyyy HH:mm:ss')}
                    </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {analytics.deviceType || 'Unknown'}
                    </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {analytics.browser || 'Unknown'}
                    </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {analytics.os || 'Unknown'}
                    </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">
                      {analytics.ipAddress || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
              {currentLink.analytics.slice(0, 10).map((analytics) => (
              <div
                key={analytics.id}
                  className="p-4 bg-gray-700/30 rounded-lg border border-gray-700 hover-lift transition-smooth"
              >
                  <div className="text-sm font-medium text-white mb-2">
                  {format(new Date(analytics.clickedAt), 'MMM d, yyyy HH:mm:ss')}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                      <span className="text-gray-400">Device:</span>{' '}
                      <span className="text-white">{analytics.deviceType || 'Unknown'}</span>
                  </div>
                  <div>
                      <span className="text-gray-400">Browser:</span>{' '}
                      <span className="text-white">{analytics.browser || 'Unknown'}</span>
                  </div>
                  <div>
                      <span className="text-gray-400">OS:</span>{' '}
                      <span className="text-white">{analytics.os || 'Unknown'}</span>
                  </div>
                  <div>
                      <span className="text-gray-400">IP:</span>{' '}
                      <span className="text-white font-mono text-xs">
                      {analytics.ipAddress || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
      ) : (
        <div className="card text-center py-12">
          <MousePointerClick className="w-12 h-12 mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400">No clicks recorded yet</p>
        </div>
      )}
    </div>
  );
}
