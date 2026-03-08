import type { Workspace, WorkspaceMember } from '@podcast-crm/types';

export const seedWorkspace: Workspace = {
  id: 'ws_demo_01',
  name: 'The Signal & The Noise',
  slug: 'signal-and-noise',
  plan: 'agency',
  ownerId: 'user_rudrendu_01',
  showName: 'The Signal & The Noise',
  showDescription:
    'Conversations with the builders, researchers, and investors shaping the future of AI and technology. 40,000 listeners per episode.',
  showTopics: ['AI', 'machine learning', 'startups', 'engineering', 'venture capital'],
  createdAt: '2025-06-01T00:00:00Z',
};

export const seedWorkspaceMembers: WorkspaceMember[] = [
  {
    id: 'member_001',
    workspaceId: 'ws_demo_01',
    userId: 'user_rudrendu_01',
    name: 'Rudrendu Paul',
    email: 'rudrendu@signalnoiseshow.com',
    role: 'owner',
    joinedAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 'member_002',
    workspaceId: 'ws_demo_01',
    userId: 'user_sourav_01',
    name: 'Sourav Nandy',
    email: 'sourav@signalnoiseshow.com',
    role: 'editor',
    joinedAt: '2025-06-15T00:00:00Z',
  },
  {
    id: 'member_003',
    workspaceId: 'ws_demo_01',
    userId: 'user_producer_01',
    name: 'Ananya Krishnan',
    email: 'ananya@signalnoiseshow.com',
    role: 'editor',
    joinedAt: '2025-07-01T00:00:00Z',
  },
  {
    id: 'member_004',
    workspaceId: 'ws_demo_01',
    userId: 'user_researcher_01',
    name: 'Kyle Thompson',
    email: 'kyle@signalnoiseshow.com',
    role: 'viewer',
    joinedAt: '2025-08-15T00:00:00Z',
  },
];
