import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const workspaces = sqliteTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  plan: text('plan', { enum: ['solo', 'agency'] }).notNull().default('solo'),
  ownerId: text('owner_id').notNull(),
  showName: text('show_name').notNull(),
  showDescription: text('show_description').notNull().default(''),
  showTopics: text('show_topics').notNull().default('[]'), // JSON array
  createdAt: text('created_at').notNull(),
});

export const workspaceMembers = sqliteTable('workspace_members', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role', { enum: ['owner', 'editor', 'viewer'] }).notNull().default('viewer'),
  joinedAt: text('joined_at').notNull(),
});

export const guests = sqliteTable('guests', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  bio: text('bio').notNull().default(''),
  avatarUrl: text('avatar_url'),
  linkedinUrl: text('linkedin_url'),
  twitterHandle: text('twitter_handle'),
  websiteUrl: text('website_url'),
  topics: text('topics').notNull().default('[]'), // JSON array
  fitScore: integer('fit_score').notNull().default(0),
  stage: text('stage', {
    enum: ['discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up'],
  })
    .notNull()
    .default('discover'),
  priority: text('priority', { enum: ['low', 'medium', 'high'] }).notNull().default('medium'),
  notes: text('notes').notNull().default(''),
  episodeTitle: text('episode_title'),
  episodeNumber: integer('episode_number'),
  recordingDate: text('recording_date'),
  publishedDate: text('published_date'),
  podcastUrl: text('podcast_url'),
  nextFollowUpDate: text('next_follow_up_date'),
  outreachCount: integer('outreach_count').notNull().default(0),
  lastContactedAt: text('last_contacted_at'),
  deletedAt: text('deleted_at'), // soft delete
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const outreachEmails = sqliteTable('outreach_emails', {
  id: text('id').primaryKey(),
  guestId: text('guest_id')
    .notNull()
    .references(() => guests.id, { onDelete: 'cascade' }),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  generatedByAI: integer('generated_by_ai', { mode: 'boolean' }).notNull().default(false),
  sentAt: text('sent_at'),
  openedAt: text('opened_at'),
  repliedAt: text('replied_at'),
  status: text('status', { enum: ['draft', 'sent', 'opened', 'replied', 'bounced'] })
    .notNull()
    .default('draft'),
  createdAt: text('created_at').notNull(),
});

export const activityLog = sqliteTable('activity_log', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  guestId: text('guest_id').notNull(),
  guestName: text('guest_name').notNull(),
  type: text('type', {
    enum: ['stage_change', 'outreach_sent', 'reply_received', 'episode_published'],
  }).notNull(),
  description: text('description').notNull(),
  metadata: text('metadata').default('{}'), // JSON
  timestamp: text('timestamp').notNull(),
});

export const analyticsSnapshots = sqliteTable('analytics_snapshots', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // YYYY-MM-DD
  totalGuests: integer('total_guests').notNull().default(0),
  outreachSent: integer('outreach_sent').notNull().default(0),
  outreachReplied: integer('outreach_replied').notNull().default(0),
  episodesPublished: integer('episodes_published').notNull().default(0),
  avgFitScore: real('avg_fit_score').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
export type OutreachEmail = typeof outreachEmails.$inferSelect;
export type NewOutreachEmail = typeof outreachEmails.$inferInsert;
export type ActivityLog = typeof activityLog.$inferSelect;
export type NewActivityLog = typeof activityLog.$inferInsert;
export type AnalyticsSnapshot = typeof analyticsSnapshots.$inferSelect;
export type NewAnalyticsSnapshot = typeof analyticsSnapshots.$inferInsert;
