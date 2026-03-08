'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { analyticsOverview, outreachActivityTimeline, pipelineFunnelData, topicsBreakdown } from '@/lib/mock-data';

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      try {
        const result = await api.analytics.getOverview();
        return result.data;
      } catch {
        return analyticsOverview;
      }
    },
    staleTime: 60_000,
  });
}

export function useAnalyticsPipeline() {
  return useQuery({
    queryKey: ['analytics', 'pipeline'],
    queryFn: async () => {
      try {
        const result = await api.analytics.getPipeline();
        return result.data;
      } catch {
        return {
          funnel: pipelineFunnelData,
          outreachTimeline: outreachActivityTimeline,
          topicsBreakdown,
        };
      }
    },
    staleTime: 60_000,
  });
}
