'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown, ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GuestAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  cn,
  getFitScoreColor,
  getFitScoreBarColor,
  STAGE_CONFIG,
  PRIORITY_CONFIG,
  formatRelativeDate,
} from '@/lib/utils';
import type { Guest, GuestLifecycleStage } from '@podcast-crm/types';

interface GuestTableProps {
  guests: Guest[];
  isLoading?: boolean;
  onStageChange?: (guestId: string, stage: GuestLifecycleStage) => void;
}

type SortKey = 'name' | 'fitScore' | 'stage' | 'lastContactedAt';

export function GuestTable({ guests, isLoading, onStageChange }: GuestTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('fitScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...guests].sort((a, b) => {
    let comparison = 0;
    switch (sortKey) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'fitScore':
        comparison = a.fitScore - b.fitScore;
        break;
      case 'stage': {
        const stageOrder = ['discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up'];
        comparison = stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage);
        break;
      }
      case 'lastContactedAt':
        comparison =
          new Date(a.lastContactedAt ?? '1970-01-01').getTime() -
          new Date(b.lastContactedAt ?? '1970-01-01').getTime();
        break;
    }
    return sortDir === 'asc' ? comparison : -comparison;
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <Skeleton className="h-4 w-48" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    );
  }

  const SortButton = ({ colKey, label }: { colKey: SortKey; label: string }) => (
    <button
      onClick={() => handleSort(colKey)}
      className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
    >
      {label}
      <ArrowUpDown
        className={cn(
          'h-3 w-3',
          sortKey === colKey ? 'text-brand-600' : 'text-slate-400'
        )}
      />
    </button>
  );

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[auto_1fr_140px_100px_120px_100px_48px] items-center gap-4 bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-medium text-slate-500">
        <span className="w-9" />
        <SortButton colKey="name" label="Name / Company" />
        <SortButton colKey="stage" label="Stage" />
        <SortButton colKey="fitScore" label="Fit Score" />
        <span>Topics</span>
        <SortButton colKey="lastContactedAt" label="Last Contact" />
        <span />
      </div>

      {/* Table rows */}
      <div className="divide-y divide-slate-100">
        {sorted.map((guest, i) => {
          const stageConfig = STAGE_CONFIG[guest.stage];
          const priorityConfig = PRIORITY_CONFIG[guest.priority];
          const barColor = getFitScoreBarColor(guest.fitScore);
          const scoreColor = getFitScoreColor(guest.fitScore);

          return (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="grid grid-cols-[auto_1fr_140px_100px_120px_100px_48px] items-center gap-4 px-4 py-3 hover:bg-slate-50/80 transition-colors group"
            >
              {/* Avatar */}
              <GuestAvatar name={guest.name} avatarUrl={guest.avatarUrl} size="sm" />

              {/* Name + company */}
              <div>
                <Link
                  href={`/dashboard/pipeline/${guest.id}`}
                  className="text-sm font-semibold text-slate-900 hover:text-brand-700 transition-colors"
                >
                  {guest.name}
                </Link>
                <p className="text-xs text-slate-500">
                  {guest.title} · {guest.company}
                </p>
                {guest.priority === 'high' && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold',
                      priorityConfig.color
                    )}
                  >
                    High priority
                  </span>
                )}
              </div>

              {/* Stage */}
              <div>
                <Badge variant={guest.stage as GuestLifecycleStage} className="text-[11px]">
                  {stageConfig.label}
                </Badge>
              </div>

              {/* Fit Score */}
              <div className="space-y-1">
                <span className={cn('text-sm font-bold', scoreColor)}>
                  {guest.fitScore > 0 ? guest.fitScore : '—'}
                </span>
                {guest.fitScore > 0 && (
                  <div className="h-1 w-16 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', barColor)}
                      style={{ width: `${guest.fitScore}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1">
                {guest.topics.slice(0, 2).map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 truncate max-w-[80px]"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              {/* Last contact */}
              <div className="text-xs text-slate-500">
                {guest.lastContactedAt ? formatRelativeDate(guest.lastContactedAt) : 'Never'}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/dashboard/pipeline/${guest.id}`}
                  className="text-slate-400 hover:text-brand-600"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
