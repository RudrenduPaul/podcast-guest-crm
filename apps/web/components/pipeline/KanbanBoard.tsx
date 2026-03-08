'use client';

import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { usePipeline } from '@/hooks/usePipeline';
import { Skeleton } from '@/components/ui/skeleton';
import type { GuestLifecycleStage } from '@podcast-crm/types';

const STAGE_ORDER: GuestLifecycleStage[] = [
  'discover',
  'outreach',
  'scheduled',
  'recorded',
  'published',
  'follow_up',
];

export function KanbanBoard() {
  const { guestsByStage, isLoading, handleDragEnd } = usePipeline();

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    handleDragEnd(
      draggableId,
      destination.droppableId as GuestLifecycleStage,
      source.droppableId as GuestLifecycleStage
    );
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGE_ORDER.map((stage) => (
          <div key={stage} className="min-w-[280px]">
            <Skeleton className="h-10 w-full rounded-t-lg" />
            <div className="space-y-2 mt-1 p-2 bg-slate-50 rounded-b-lg border min-h-[600px]">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-6">
        {STAGE_ORDER.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            guests={guestsByStage[stage] ?? []}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
