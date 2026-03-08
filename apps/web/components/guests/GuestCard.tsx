'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Star } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { GuestAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, getFitScoreColor, getFitScoreBarColor, getDaysInStage, truncate } from '@/lib/utils';
import type { Guest, GuestLifecycleStage } from '@podcast-crm/types';

interface GuestCardProps {
  guest: Guest;
  index: number;
  isDragDisabled?: boolean;
}

export function GuestCard({ guest, index, isDragDisabled = false }: GuestCardProps) {
  const daysInStage = getDaysInStage(guest.updatedAt);
  const scoreColor = getFitScoreColor(guest.fitScore);
  const barColor = getFitScoreBarColor(guest.fitScore);

  return (
    <Draggable draggableId={guest.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'group rounded-lg border border-slate-200 bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing',
              'hover:border-brand-300 hover:shadow-md transition-all duration-150',
              snapshot.isDragging && 'shadow-2xl border-brand-400 rotate-1 opacity-90'
            )}
          >
            <Link
              href={`/dashboard/pipeline/${guest.id}`}
              onClick={(e) => {
                if (snapshot.isDragging) e.preventDefault();
              }}
              className="block"
            >
              {/* Header */}
              <div className="flex items-start gap-2.5 mb-2">
                <GuestAvatar name={guest.name} avatarUrl={guest.avatarUrl} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-brand-700 transition-colors">
                    {guest.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{guest.title}</p>
                  <p className="text-xs text-slate-400 truncate">{guest.company}</p>
                </div>

                {/* Priority indicator */}
                {guest.priority === 'high' && (
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                )}
              </div>

              {/* Fit Score */}
              {guest.fitScore > 0 && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400 font-medium">Fit Score</span>
                    <span className={cn('text-[11px] font-bold', scoreColor)}>
                      {guest.fitScore}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${guest.fitScore}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={cn('h-full rounded-full', barColor)}
                    />
                  </div>
                </div>
              )}

              {/* Topics */}
              {guest.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {guest.topics.slice(0, 2).map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600"
                    >
                      {truncate(topic, 20)}
                    </span>
                  ))}
                  {guest.topics.length > 2 && (
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400">
                      +{guest.topics.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>{daysInStage}d in stage</span>
                </div>
                {guest.stage === 'outreach' && (
                  <Badge
                    variant="outreach"
                    className="text-[10px] px-1.5 py-0 h-4"
                  >
                    {guest.outreachCount} sent
                  </Badge>
                )}
                {guest.stage === 'scheduled' && guest.recordingDate && (
                  <Badge variant="scheduled" className="text-[10px] px-1.5 py-0 h-4">
                    Recording set
                  </Badge>
                )}
                {guest.episodeNumber && (
                  <Badge variant="published" className="text-[10px] px-1.5 py-0 h-4">
                    Ep. {guest.episodeNumber}
                  </Badge>
                )}
              </div>
            </Link>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
