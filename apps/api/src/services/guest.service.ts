import { seedGuests } from '@podcast-crm/db';
import type { Guest, GuestLifecycleStage, GuestPriority } from '@podcast-crm/types';

// In-memory store initialized from seed data
// In production, this would be Drizzle ORM queries against the SQLite/Postgres DB
let guestStore: Map<string, Guest> = new Map(seedGuests.map((g) => [g.id, g]));

export interface GuestListOptions {
  workspaceId: string;
  page?: number;
  limit?: number;
  stage?: string;
  priority?: string;
  search?: string;
  topics?: string[];
}

export interface GuestListResult {
  guests: Guest[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateGuestInput {
  workspaceId: string;
  name: string;
  email: string;
  title: string;
  company: string;
  bio?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
  websiteUrl?: string;
  topics?: string[];
  priority?: GuestPriority;
  notes?: string;
}

export interface UpdateGuestInput extends Partial<CreateGuestInput> {
  fitScore?: number;
  stage?: GuestLifecycleStage;
  episodeTitle?: string;
  episodeNumber?: number;
  recordingDate?: string;
  publishedDate?: string;
  podcastUrl?: string;
  nextFollowUpDate?: string;
}

// Valid stage transitions (enforces the lifecycle spine)
const VALID_TRANSITIONS: Record<GuestLifecycleStage, GuestLifecycleStage[]> = {
  discover: ['outreach'],
  outreach: ['scheduled', 'discover'],
  scheduled: ['recorded', 'outreach'],
  recorded: ['published', 'scheduled'],
  published: ['follow_up'],
  follow_up: ['outreach', 'published'],
};

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const guestService = {
  list(options: GuestListOptions): GuestListResult {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;

    let guests = Array.from(guestStore.values()).filter(
      (g) => g.workspaceId === options.workspaceId
    );

    // Apply filters
    if (options.stage) {
      guests = guests.filter((g) => g.stage === options.stage);
    }

    if (options.priority) {
      guests = guests.filter((g) => g.priority === options.priority);
    }

    if (options.search) {
      const search = options.search.toLowerCase();
      guests = guests.filter(
        (g) =>
          g.name.toLowerCase().includes(search) ||
          g.company.toLowerCase().includes(search) ||
          g.title.toLowerCase().includes(search) ||
          g.bio.toLowerCase().includes(search)
      );
    }

    if (options.topics && options.topics.length > 0) {
      guests = guests.filter((g) =>
        options.topics!.some((topic) =>
          g.topics.some((t) => t.toLowerCase().includes(topic.toLowerCase()))
        )
      );
    }

    // Sort by fitScore descending, then by name
    guests.sort((a, b) => {
      if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;
      return a.name.localeCompare(b.name);
    });

    const total = guests.length;
    const offset = (page - 1) * limit;
    const paginated = guests.slice(offset, offset + limit);

    return { guests: paginated, total, page, limit };
  },

  findById(id: string, workspaceId: string): Guest | null {
    const guest = guestStore.get(id);
    if (!guest || guest.workspaceId !== workspaceId) return null;
    return guest;
  },

  create(input: CreateGuestInput): Guest {
    const now = new Date().toISOString();
    const guest: Guest = {
      id: generateId('guest'),
      workspaceId: input.workspaceId,
      name: input.name,
      email: input.email,
      title: input.title,
      company: input.company,
      bio: input.bio ?? '',
      avatarUrl: input.avatarUrl,
      linkedinUrl: input.linkedinUrl,
      twitterHandle: input.twitterHandle,
      websiteUrl: input.websiteUrl,
      topics: input.topics ?? [],
      fitScore: 0, // Will be updated by AI analysis
      stage: 'discover',
      priority: input.priority ?? 'medium',
      notes: input.notes ?? '',
      outreachCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    guestStore.set(guest.id, guest);
    return guest;
  },

  update(id: string, workspaceId: string, input: UpdateGuestInput): Guest | null {
    const guest = guestStore.get(id);
    if (!guest || guest.workspaceId !== workspaceId) return null;

    const updated: Guest = {
      ...guest,
      ...input,
      id: guest.id, // Immutable
      workspaceId: guest.workspaceId, // Immutable
      updatedAt: new Date().toISOString(),
    };

    guestStore.set(id, updated);
    return updated;
  },

  transitionStage(
    id: string,
    workspaceId: string,
    targetStage: GuestLifecycleStage
  ): { guest: Guest; success: boolean; error?: string } {
    const guest = guestStore.get(id);

    if (!guest || guest.workspaceId !== workspaceId) {
      return { guest: {} as Guest, success: false, error: 'Guest not found' };
    }

    const validNext = VALID_TRANSITIONS[guest.stage];
    if (!validNext.includes(targetStage)) {
      return {
        guest,
        success: false,
        error: `Cannot transition from '${guest.stage}' to '${targetStage}'. Valid transitions: ${validNext.join(', ')}`,
      };
    }

    const updated = this.update(id, workspaceId, { stage: targetStage });
    if (!updated) {
      return { guest, success: false, error: 'Update failed' };
    }

    return { guest: updated, success: true };
  },

  delete(id: string, workspaceId: string): boolean {
    const guest = guestStore.get(id);
    if (!guest || guest.workspaceId !== workspaceId) return false;

    // Soft delete — in production this would set deletedAt timestamp
    guestStore.delete(id);
    return true;
  },

  getByStage(workspaceId: string): Record<GuestLifecycleStage, Guest[]> {
    const guests = Array.from(guestStore.values()).filter(
      (g) => g.workspaceId === workspaceId
    );

    return {
      discover: guests.filter((g) => g.stage === 'discover'),
      outreach: guests.filter((g) => g.stage === 'outreach'),
      scheduled: guests.filter((g) => g.stage === 'scheduled'),
      recorded: guests.filter((g) => g.stage === 'recorded'),
      published: guests.filter((g) => g.stage === 'published'),
      follow_up: guests.filter((g) => g.stage === 'follow_up'),
    };
  },

  // Reset store to seed data (for testing)
  reset(): void {
    guestStore = new Map(seedGuests.map((g) => [g.id, g]));
  },
};
