// NOTE: schema.ts (drizzle-orm) is intentionally NOT re-exported here.
// It is only used server-side (API). Client bundles import seed data only.
// To use the database schema, import directly: import { guests } from '@podcast-crm/db/src/schema'
export { seedGuests, WORKSPACE_ID } from './seeds/guests.seed';
export { seedOutreachEmails } from './seeds/outreach.seed';
export { analyticsOverview, outreachActivityTimeline, pipelineFunnelData, topicsBreakdown, recentActivity } from './seeds/analytics.seed';
export { seedWorkspace, seedWorkspaceMembers } from './seeds/workspace.seed';
