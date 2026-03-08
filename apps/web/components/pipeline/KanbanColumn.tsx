'use client';

import { motion } from 'framer-motion';
import { Droppable } from '@hello-pangea/dnd';
import { Users } from 'lucide-react';
import { GuestCard } from '@/components/guests/GuestCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { cn, STAGE_CONFIG } from '@/lib/utils';
import type { Guest, GuestLifecycleStage } from '@podcast-crm/types';

interface KanbanColumnProps {
  stage: GuestLifecycleStage;
  guests: Guest[];
  isOver?: boolean;
}

export function KanbanColumn({ stage, guests, isOver }: KanbanColumnProps) {
  const config = STAGE_CONFIG[stage];

  return (
    <div className="flex flex-col min-w-[280px] max-w-[280px]">
      {/* Column Header */}
      <div
        className={cn(
          'flex items-center justify-between rounded-t-lg px-3 py-2.5 border border-b-0',
          config.bgColor,
          config.borderColor
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn('h-2 w-2 rounded-full', config.dotColor)} />
          <span className={cn('text-sm font-semibold', config.color)}>{config.label}</span>
        </div>
        <span
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold',
            config.bgColor,
            config.color,
            'border',
            config.borderColor
          )}
        >
          {guests.length}
        </span>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 min-h-[600px] rounded-b-lg border p-2 transition-all duration-200',
              config.borderColor,
              snapshot.isDraggingOver
                ? cn(config.bgColor, 'border-dashed shadow-inner')
                : 'bg-slate-50'
            )}
          >
            {guests.length === 0 ? (
              <EmptyState
                icon={Users}
                title={config.emptyMessage}
                description={config.emptySubMessage}
                size="sm"
              />
            ) : (
              <div className="space-y-2">
                {guests.map((guest, index) => (
                  <GuestCard key={guest.id} guest={guest} index={index} />
                ))}
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
