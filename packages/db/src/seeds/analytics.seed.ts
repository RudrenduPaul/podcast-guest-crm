import type { AnalyticsOverview, ActivityItem } from '@podcast-crm/types';

export const recentActivity: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'stage_change',
    guestId: 'guest_021',
    guestName: 'Nathan Brooks',
    description: 'Nathan Brooks moved from Scheduled → Recorded after recording on March 7',
    timestamp: '2026-03-07T17:00:00Z',
  },
  {
    id: 'act_002',
    type: 'outreach_sent',
    guestId: 'guest_011',
    guestName: 'Nia Johnson',
    description: 'Outreach email sent to Nia Johnson at Not Boring',
    timestamp: '2026-03-01T10:00:00Z',
  },
  {
    id: 'act_003',
    type: 'stage_change',
    guestId: 'guest_020',
    guestName: 'Isabelle Dupont',
    description: 'Isabelle Dupont moved from Scheduled → Recorded after recording on March 5',
    timestamp: '2026-03-05T18:00:00Z',
  },
  {
    id: 'act_004',
    type: 'reply_received',
    guestId: 'guest_008',
    guestName: 'David Kim',
    description: "David Kim replied: 'Sounds interesting, send more details'",
    timestamp: '2026-02-19T09:15:00Z',
  },
  {
    id: 'act_005',
    type: 'episode_published',
    guestId: 'guest_027',
    guestName: 'Monica Singh',
    description: 'Ep 47 published: Voice Cloning and the Future of Audio AI',
    timestamp: '2026-02-17T09:00:00Z',
  },
  {
    id: 'act_006',
    type: 'stage_change',
    guestId: 'guest_019',
    guestName: 'Raj Mehta',
    description: 'Raj Mehta moved from Scheduled → Recorded after recording on March 3',
    timestamp: '2026-03-03T15:30:00Z',
  },
  {
    id: 'act_007',
    type: 'outreach_sent',
    guestId: 'guest_007',
    guestName: 'Dr. Sarah Chen',
    description: 'Follow-up email sent to Dr. Sarah Chen at DeepMind',
    timestamp: '2026-02-22T10:00:00Z',
  },
  {
    id: 'act_008',
    type: 'reply_received',
    guestId: 'guest_010',
    guestName: 'Carlos Mendez',
    description: "Carlos Mendez replied: 'Would love to join, let's find a time'",
    timestamp: '2026-02-16T08:00:00Z',
  },
  {
    id: 'act_009',
    type: 'episode_published',
    guestId: 'guest_026',
    guestName: 'Diego Hernandez',
    description: 'Ep 46 published: 80,000 Stars: How LangChain Became the Foundation of the AI Stack',
    timestamp: '2026-02-05T09:00:00Z',
  },
  {
    id: 'act_010',
    type: 'stage_change',
    guestId: 'guest_016',
    guestName: 'Jordan West',
    description: 'Jordan West moved from Outreach → Scheduled, recording set for March 28',
    timestamp: '2026-03-06T11:00:00Z',
  },
];

export const analyticsOverview: AnalyticsOverview = {
  totalGuests: 34,
  byStage: {
    discover: 6,
    outreach: 6,
    scheduled: 5,
    recorded: 4,
    published: 8,
    follow_up: 5,
  },
  avgFitScore: 89.2,
  outreachReplyRate: 0.47,
  bookingConversionRate: 0.38,
  topTopics: [
    { topic: 'AI safety', count: 5 },
    { topic: 'open source AI', count: 4 },
    { topic: 'developer tools', count: 4 },
    { topic: 'startup scaling', count: 3 },
    { topic: 'venture capital', count: 3 },
    { topic: 'machine learning', count: 3 },
    { topic: 'product management', count: 3 },
    { topic: 'engineering leadership', count: 2 },
    { topic: 'future of work', count: 2 },
    { topic: 'podcasting', count: 2 },
  ],
  recentActivity,
};

// Weekly outreach activity for line chart (last 12 weeks)
export const outreachActivityTimeline = [
  { week: '2025-12-16', sent: 2, opened: 2, replied: 1 },
  { week: '2025-12-23', sent: 0, opened: 0, replied: 0 },
  { week: '2025-12-30', sent: 1, opened: 1, replied: 0 },
  { week: '2026-01-06', sent: 3, opened: 2, replied: 1 },
  { week: '2026-01-13', sent: 4, opened: 3, replied: 2 },
  { week: '2026-01-20', sent: 2, opened: 2, replied: 1 },
  { week: '2026-01-27', sent: 5, opened: 4, replied: 2 },
  { week: '2026-02-03', sent: 3, opened: 2, replied: 1 },
  { week: '2026-02-10', sent: 4, opened: 3, replied: 2 },
  { week: '2026-02-17', sent: 6, opened: 4, replied: 3 },
  { week: '2026-02-24', sent: 4, opened: 3, replied: 1 },
  { week: '2026-03-03', sent: 3, opened: 2, replied: 1 },
];

// Stage conversion funnel data
export const pipelineFunnelData = [
  { stage: 'discover', label: 'Discover', count: 6, conversionRate: 1.0 },
  { stage: 'outreach', label: 'Outreach', count: 6, conversionRate: 0.82 },
  { stage: 'scheduled', label: 'Scheduled', count: 5, conversionRate: 0.47 },
  { stage: 'recorded', label: 'Recorded', count: 4, conversionRate: 0.38 },
  { stage: 'published', label: 'Published', count: 8, conversionRate: 0.32 },
  { stage: 'follow_up', label: 'Follow-up', count: 5, conversionRate: 0.28 },
];

// Topics breakdown for donut chart
export const topicsBreakdown = [
  { topic: 'AI & Machine Learning', count: 14, percentage: 41 },
  { topic: 'Developer Tools', count: 7, percentage: 21 },
  { topic: 'Growth & Marketing', count: 4, percentage: 12 },
  { topic: 'Venture Capital', count: 3, percentage: 9 },
  { topic: 'Future of Work', count: 3, percentage: 9 },
  { topic: 'Media & Content', count: 3, percentage: 9 },
];
