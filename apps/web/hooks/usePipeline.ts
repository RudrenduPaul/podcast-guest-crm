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
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['pipeline'] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });

      // Fire confetti when a guest is scheduled!
      if (result.data.stage === 'scheduled') {
        void confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#8b5cf6', '#10b981'],
        });
        toast.success(`${result.data.name} is booked! 🎉`, {
          description: 'Time to prepare the interview brief.',
        });
      }
    },
    onError: (error) => {
      toast.error('Could not move guest', { description: error.message });
    },
  });

  const handleDragEnd = useCallback(
    (guestId: string, newStage: GuestLifecycleStage, oldStage: GuestLifecycleStage) => {
      if (newStage === oldStage) return;

      // Optimistic update for immediate UI feedback
      queryClient.setQueryData<Record<GuestLifecycleStage, Guest[]>>(
        ['pipeline', 'byStage'],
        (current) => {
          if (!current) return current;

          const guest = current[oldStage]?.find((g) => g.id === guestId);
          if (!guest) return current;

          return {
            ...current,
            [oldStage]: current[oldStage].filter((g) => g.id !== guestId),
            [newStage]: [{ ...guest, stage: newStage }, ...(current[newStage] ?? [])],
          };
        }
      );

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
