'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { seedGuests } from '@/lib/mock-data';
import type { Guest, GuestLifecycleStage } from '@podcast-crm/types';

// Query keys
export const guestKeys = {
  all: ['guests'] as const,
  lists: () => [...guestKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...guestKeys.lists(), filters] as const,
  details: () => [...guestKeys.all, 'detail'] as const,
  detail: (id: string) => [...guestKeys.details(), id] as const,
};

// Fallback to mock data when API is unavailable
function getMockGuests(filters?: { stage?: string; priority?: string; search?: string }) {
  let guests = [...seedGuests];
  if (filters?.stage) guests = guests.filter((g) => g.stage === filters.stage);
  if (filters?.priority) guests = guests.filter((g) => g.priority === filters.priority);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    guests = guests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.company.toLowerCase().includes(q) ||
        g.title.toLowerCase().includes(q)
    );
  }
  return { data: guests, meta: { total: guests.length, page: 1, limit: guests.length } };
}

export function useGuests(filters?: {
  page?: number;
  limit?: number;
  stage?: string;
  priority?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: guestKeys.list(filters ?? {}),
    queryFn: async () => {
      try {
        return await api.guests.list(filters);
      } catch {
        // Graceful fallback to seed data for demo
        return getMockGuests(filters);
      }
    },
    staleTime: 30_000,
  });
}

export function useGuest(id: string) {
  return useQuery({
    queryKey: guestKeys.detail(id),
    queryFn: async () => {
      try {
        const result = await api.guests.getById(id);
        return result.data;
      } catch {
        return seedGuests.find((g) => g.id === id) ?? null;
      }
    },
    enabled: !!id,
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Guest>) => {
      try {
        return await api.guests.create(data);
      } catch {
        // Graceful demo fallback — return a synthetic guest when the API is unavailable
        const mockGuest: Guest = {
          id: `guest_${Date.now()}`,
          workspaceId: data.workspaceId ?? 'ws_demo_01',
          name: data.name ?? '',
          email: data.email ?? '',
          title: data.title ?? '',
          company: data.company ?? '',
          bio: data.bio ?? '',
          avatarUrl: data.avatarUrl,
          linkedinUrl: data.linkedinUrl,
          twitterHandle: data.twitterHandle,
          websiteUrl: data.websiteUrl,
          topics: data.topics ?? [],
          fitScore: 0,
          stage: data.stage ?? 'discover',
          priority: data.priority ?? 'medium',
          notes: data.notes ?? '',
          outreachCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { data: mockGuest };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: guestKeys.lists() });
      toast.success(`${result.data.name} added to your pipeline!`, {
        description: 'Claude will score their fit in the background.',
      });
    },
    onError: (error) => {
      toast.error('Failed to create guest', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Guest> }) =>
      api.guests.update(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: guestKeys.detail(result.data.id) });
      queryClient.invalidateQueries({ queryKey: guestKeys.lists() });
      toast.success('Guest updated');
    },
    onError: (error) => {
      toast.error('Failed to update guest', { description: error.message });
    },
  });
}

export function useTransitionStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      stage,
      reason,
    }: {
      id: string;
      stage: GuestLifecycleStage;
      reason?: string;
    }) => api.guests.transitionStage(id, stage, reason),
    onMutate: async ({ id, stage }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: guestKeys.detail(id) });
      const previous = queryClient.getQueryData<Guest>(guestKeys.detail(id));

      if (previous) {
        queryClient.setQueryData(guestKeys.detail(id), { ...previous, stage });
      }

      return { previous };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: guestKeys.lists() });
      queryClient.invalidateQueries({ queryKey: guestKeys.detail(result.data.id) });
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(guestKeys.detail(_variables.id), context.previous);
      }
      toast.error('Stage transition failed', { description: error.message });
    },
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.guests.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guestKeys.lists() });
      toast.success('Guest removed from pipeline');
    },
    onError: (error) => {
      toast.error('Failed to delete guest', { description: error.message });
    },
  });
}
