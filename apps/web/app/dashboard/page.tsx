'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  Users,
  Kanban,
  Mail,
  TrendingUp,
  ArrowRight,
  Clock,
  Star,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalyticsOverview } from '@/hooks/useAnalytics';
import { useGuests } from '@/hooks/useGuests';
import { formatRelativeDate, STAGE_CONFIG, getDaysInStage } from '@/lib/utils';
import { seedWorkspace } from '@/lib/mock-data';
import type { GuestLifecycleStage } from '@podcast-crm/types';

const STAGE_ORDER: GuestLifecycleStage[] = [
  'discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up'
];

export default function DashboardPage() {
  const { data: analytics, isLoading } = useAnalyticsOverview();
  const { data: guestsData } = useGuests({ stage: 'outreach', limit: 100 });

  // Smart follow-up nudge: guests in outreach >7 days with no reply
  useEffect(() => {
    if (!guestsData?.data) return;
    const staleGuests = guestsData.data.filter((g) => {
      if (g.stage !== 'outreach') return false;
      const daysInStage = getDaysInStage(g.updatedAt);
      return daysInStage > 7;
    });
    if (staleGuests.length > 0) {
      const names = staleGuests
        .slice(0, 2)
        .map((g) => g.name.split(' ')[0])
        .join(', ');
      const extra = staleGuests.length > 2 ? ` +${staleGuests.length - 2} more` : '';
      toast(`Follow-up nudge: ${names}${extra} haven't replied in 7+ days`, {
        description: 'Consider sending a follow-up to keep the conversation warm.',
        duration: 8000,
        icon: '💌',
      });
    }
    // Only fire once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestsData?.data?.length]);

  const stats = [
    {
      label: 'Total Guests',
      value: analytics?.totalGuests ?? 0,
      icon: Users,
      color: 'text-brand-600',
      bg: 'bg-brand-50',
      link: '/dashboard/guests',
    },
    {
      label: 'Avg Fit Score',
      value: analytics ? `${analytics.avgFitScore}/100` : '—',
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      link: '/dashboard/guests',
    },
    {
      label: 'Reply Rate',
      value: analytics ? `${Math.round(analytics.outreachReplyRate * 100)}%` : '—',
      icon: Mail,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      link: '/dashboard/outreach',
    },
    {
      label: 'Booking Rate',
      value: analytics ? `${Math.round(analytics.bookingConversionRate * 100)}%` : '—',
      icon: TrendingUp,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      link: '/dashboard/analytics',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Good morning, Rudrendu 👋
        </h1>
        <p className="text-slate-500 mt-0.5">
          {seedWorkspace.showName} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={stat.link}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-7 w-16 mb-1" />
                    ) : (
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pipeline snapshot */}
        <motion.div
          className="col-span-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Pipeline Overview</CardTitle>
                <Link href="/dashboard/pipeline">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <Kanban className="h-3.5 w-3.5" />
                    Open Pipeline
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {STAGE_ORDER.map((stage) => {
                  const config = STAGE_CONFIG[stage];
                  const count = analytics?.byStage[stage] ?? 0;
                  return (
                    <div
                      key={stage}
                      className={`rounded-lg p-3 border ${config.bgColor} ${config.borderColor}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
                        <span className={`text-[11px] font-semibold ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      {isLoading ? (
                        <Skeleton className="h-6 w-8" />
                      ) : (
                        <p className="text-2xl font-bold text-slate-900">{count}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/guests" className="block">
                <button className="w-full flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50 transition-colors group">
                  <div className="h-8 w-8 rounded-lg bg-brand-50 flex items-center justify-center">
                    <Users className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Add Guest</p>
                    <p className="text-xs text-slate-500">Start the pipeline</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-500 ml-auto transition-colors" />
                </button>
              </Link>
              <Link href="/dashboard/outreach" className="block">
                <button className="w-full flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50 transition-colors group">
                  <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Draft Outreach</p>
                    <p className="text-xs text-slate-500">AI writes it for you</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-violet-500 ml-auto transition-colors" />
                </button>
              </Link>
              <Link href="/dashboard/pipeline" className="block">
                <button className="w-full flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50 transition-colors group">
                  <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Kanban className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">View Pipeline</p>
                    <p className="text-xs text-slate-500">Drag & drop kanban</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 ml-auto transition-colors" />
                </button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {analytics?.recentActivity.slice(0, 6).map((activity) => {
                  const activityTypeConfig = {
                    stage_change: { badge: 'Stage', color: 'secondary' as const, icon: Kanban },
                    outreach_sent: { badge: 'Outreach', color: 'outline' as const, icon: Mail },
                    reply_received: { badge: 'Reply', color: 'default' as const, icon: Mail },
                    episode_published: { badge: 'Published', color: 'published' as const, icon: TrendingUp },
                  }[activity.type];

                  const Icon = activityTypeConfig.icon;

                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span className="text-xs text-slate-400">
                            {formatRelativeDate(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                      <Badge variant={activityTypeConfig.color} className="text-[10px] shrink-0">
                        {activityTypeConfig.badge}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
