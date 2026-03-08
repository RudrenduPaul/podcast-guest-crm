export type GuestLifecycleStage =
  | 'discover'
  | 'outreach'
  | 'scheduled'
  | 'recorded'
  | 'published'
  | 'follow_up';

export type GuestPriority = 'low' | 'medium' | 'high';

export interface Guest {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  title: string;
  company: string;
  bio: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
  websiteUrl?: string;
  topics: string[];
  fitScore: number; // 0-100, AI-generated
  stage: GuestLifecycleStage;
  priority: GuestPriority;
  notes: string;
  episodeTitle?: string;
  episodeNumber?: number;
  recordingDate?: string; // ISO date string
  publishedDate?: string;
  podcastUrl?: string;
  nextFollowUpDate?: string;
  outreachCount: number;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutreachEmail {
  id: string;
  guestId: string;
  workspaceId: string;
  subject: string;
  body: string;
  generatedByAI: boolean;
  sentAt?: string;
  openedAt?: string;
  repliedAt?: string;
  status: 'draft' | 'sent' | 'opened' | 'replied' | 'bounced';
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'solo' | 'agency';
  ownerId: string;
  showName: string;
  showDescription: string;
  showTopics: string[];
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}

export interface AnalyticsOverview {
  totalGuests: number;
  byStage: Record<GuestLifecycleStage, number>;
  avgFitScore: number;
  outreachReplyRate: number; // 0-1
  bookingConversionRate: number; // 0-1
  topTopics: Array<{ topic: string; count: number }>;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'stage_change' | 'outreach_sent' | 'reply_received' | 'episode_published';
  guestId: string;
  guestName: string;
  description: string;
  timestamp: string;
}
