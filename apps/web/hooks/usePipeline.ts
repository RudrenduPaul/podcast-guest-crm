'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getGuestsByStage } from '@/lib/mock-data';
import type { Guest, GuestLifecycleStage } from '@podcast-crm/types';

export function usePipeline() {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);

  const { data: guestsByStage, isLoading } = useQuery({
    queryKey: ['pipeline', 'byStage'],
    queryFn: async () => {
      try {
        // Fetch all guests and group by stage
        const result = await api.guests.list({ limit: 100 });
        const guests = result.data;

        const stages: GuestLifecycleStage[] = [
          'discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up'
        ];

        return Object.fromEntries(
          stages.map((stage) => [stage, guests.filter((g) => g.stage === stage)])
        ) as Record<GuestLifecycleStage, Guest[]>;
      } catch {
        return getGuestsByStage();
      }
    },
    staleTime: 30_000,
  });

  const stageTransitionMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: GuestLifecycleStage }) =>
      api.guests.transitionStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline'] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      // Confetti and toast are fired optimistically in handleDragEnd for immediate feedback
    },
    onError: (error) => {
      // Roll back the optimistic update
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'byStage'] });
      toast.error('Could not move guest', { description: error.message });
    },
  });

  const handleDragEnd = useCallback(
    (guestId: string, newStage: GuestLifecycleStage, oldStage: GuestLifecycleStage) => {
      if (newStage === oldStage) return;

      // Optimistic update for immediate UI feedback
      let guestName = '';
      queryClient.setQueryData<Record<GuestLifecycleStage, Guest[]>>(
        ['pipeline', 'byStage'],
        (current) => {
          if (!current) return current;

          const guest = current[oldStage]?.find((g) => g.id === guestId);
          if (!guest) return current;
          guestName = guest.name;

          return {
            ...current,
            [oldStage]: current[oldStage].filter((g) => g.id !== guestId),
            [newStage]: [{ ...guest, stage: newStage }, ...(current[newStage] ?? [])],
          };
        }
      );

      // Fire confetti immediately on optimistic update when moving to scheduled
      if (newStage === 'scheduled') {
        void confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'],
        });
        toast.success(`${guestName || 'Guest'} is booked! 🎉`, {
          description: 'Time to prepare the interview brief.',
        });
      }

      stageTransitionMutation.mutate({ id: guestId, stage: newStage });
    },
    [queryClient, stageTransitionMutation]
  );

  return {
    guestsByStage: guestsByStage ?? getGuestsByStage(),
    isLoading,
    isDragging,
    setIsDragging,
    handleDragEnd,
    isTransitioning: stageTransitionMutation.isPending,
  };
}
