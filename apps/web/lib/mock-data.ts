// Re-exports seed data for client-side use when API is unavailable
// This enables the app to run in full demo mode without a running backend
import {
  seedGuests,
  seedOutreachEmails,
  analyticsOverview,
  outreachActivityTimeline,
  pipelineFunnelData,
  topicsBreakdown,
  seedWorkspace,
  seedWorkspaceMembers,
} from '@podcast-crm/db';
import type { Guest, GuestLifecycleStage } from '@podcast-crm/types';

export {
  seedGuests,
  seedOutreachEmails,
  analyticsOverview,
  outreachActivityTimeline,
  pipelineFunnelData,
  topicsBreakdown,
  seedWorkspace,
  seedWorkspaceMembers,
};

export function getGuestsByStage(): Record<GuestLifecycleStage, Guest[]> {
  const stages: GuestLifecycleStage[] = [
    'discover',
    'outreach',
    'scheduled',
    'recorded',
    'published',
    'follow_up',
  ];

  return Object.fromEntries(
    stages.map((stage) => [stage, seedGuests.filter((g) => g.stage === stage)])
  ) as Record<GuestLifecycleStage, Guest[]>;
}

export function getGuestById(id: string): Guest | undefined {
  return seedGuests.find((g) => g.id === id);
}

export function searchGuests(query: string): Guest[] {
  const lower = query.toLowerCase();
  return seedGuests.filter(
    (g) =>
      g.name.toLowerCase().includes(lower) ||
      g.company.toLowerCase().includes(lower) ||
      g.title.toLowerCase().includes(lower) ||
      g.bio.toLowerCase().includes(lower) ||
      g.topics.some((t) => t.toLowerCase().includes(lower))
  );
}
