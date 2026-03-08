'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalyticsOverview, useAnalyticsPipeline } from '@/hooks/useAnalytics';
import { STAGE_CONFIG } from '@/lib/utils';
import type { GuestLifecycleStage } from '@podcast-crm/types';

const STAGE_COLORS: Record<GuestLifecycleStage, string> = {
  discover: '#64748b',
  outreach: '#f59e0b',
  scheduled: '#3b82f6',
  recorded: '#8b5cf6',
  published: '#10b981',
  follow_up: '#ec4899',
};

const TOPIC_COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'];

const STAGE_ORDER: GuestLifecycleStage[] = [
  'discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up'
];

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview();
  const { data: pipeline, isLoading: pipelineLoading } = useAnalyticsPipeline();

  const isLoading = overviewLoading || pipelineLoading;

  const stageChartData = STAGE_ORDER.map((stage) => ({
    stage: STAGE_CONFIG[stage].label,
    count: overview?.byStage[stage] ?? 0,
    color: STAGE_COLORS[stage],
  }));

  const topicChartData = (pipeline?.topicsBreakdown as Array<{topic: string; count: number; percentage: number}> ?? []).map((t, i) => ({
    ...t,
    fill: TOPIC_COLORS[i % TOPIC_COLORS.length],
  }));

  const stats = [
    { label: 'Total Guests', value: overview?.totalGuests ?? 0, suffix: '' },
    { label: 'Avg Fit Score', value: overview?.avgFitScore ?? 0, suffix: '/100' },
    { label: 'Reply Rate', value: Math.round((overview?.outreachReplyRate ?? 0) * 100), suffix: '%' },
    { label: 'Booking Rate', value: Math.round((overview?.bookingConversionRate ?? 0) * 100), suffix: '%' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Pipeline performance and outreach metrics
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="pt-5">
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mb-1" />
                ) : (
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}{stat.suffix}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Guests by stage bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Guests by Stage</CardTitle>
              <CardDescription>Current pipeline distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stageChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="stage"
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {stageChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Topics donut chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Topics Breakdown</CardTitle>
              <CardDescription>Most common guest topics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={180}>
                    <PieChart>
                      <Pie
                        data={topicChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        dataKey="count"
                        stroke="none"
                      >
                        {topicChartData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-1.5">
                    {topicChartData.slice(0, 5).map((topic) => (
                      <div key={topic.topic} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: topic.fill }} />
                        <span className="text-xs text-slate-600 truncate flex-1">{topic.topic}</span>
                        <span className="text-xs font-semibold text-slate-900">{topic.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Outreach activity line chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Outreach Activity (Last 12 Weeks)</CardTitle>
            <CardDescription>Emails sent, opened, and replied by week</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={pipeline?.outreachTimeline as Array<{week: string; sent: number; opened: number; replied: number}> ?? []}
                  margin={{ top: 0, right: 16, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val: string) => val.slice(5)} // Show MM-DD only
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="opened"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="replied"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
