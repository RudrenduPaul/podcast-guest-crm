import { describe, it, expect, beforeEach } from 'vitest';
import { guestService } from '../services/guest.service';

const WORKSPACE_ID = 'ws_demo_01';

describe('guestService', () => {
  beforeEach(() => {
    guestService.reset();
  });

  describe('list()', () => {
    it('returns guests for the workspace', () => {
      const result = guestService.list({ workspaceId: WORKSPACE_ID });
      expect(result.guests.length).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
    });

    it('filters by stage', () => {
      const result = guestService.list({ workspaceId: WORKSPACE_ID, stage: 'discover' });
      expect(result.guests.every((g) => g.stage === 'discover')).toBe(true);
    });

    it('filters by priority', () => {
      const result = guestService.list({ workspaceId: WORKSPACE_ID, priority: 'high' });
      expect(result.guests.every((g) => g.priority === 'high')).toBe(true);
    });

    it('searches by name', () => {
      const result = guestService.list({ workspaceId: WORKSPACE_ID, search: 'Sarah Chen' });
      expect(result.guests.some((g) => g.name === 'Dr. Sarah Chen')).toBe(true);
    });

    it('paginates results', () => {
      const page1 = guestService.list({ workspaceId: WORKSPACE_ID, page: 1, limit: 5 });
      const page2 = guestService.list({ workspaceId: WORKSPACE_ID, page: 2, limit: 5 });
      expect(page1.guests.length).toBeLessThanOrEqual(5);
      expect(page2.guests.length).toBeLessThanOrEqual(5);
      // No overlap
      const page1Ids = new Set(page1.guests.map((g) => g.id));
      expect(page2.guests.every((g) => !page1Ids.has(g.id))).toBe(true);
    });

    it('does not return guests from other workspaces', () => {
      const result = guestService.list({ workspaceId: 'other_workspace' });
      expect(result.guests.length).toBe(0);
    });
  });

  describe('findById()', () => {
    it('returns guest by id', () => {
      const guest = guestService.findById('guest_001', WORKSPACE_ID);
      expect(guest).not.toBeNull();
      expect(guest?.name).toBe('James Okafor');
    });

    it('returns null for non-existent guest', () => {
      const guest = guestService.findById('guest_999', WORKSPACE_ID);
      expect(guest).toBeNull();
    });

    it('returns null for wrong workspace', () => {
      const guest = guestService.findById('guest_001', 'other_workspace');
      expect(guest).toBeNull();
    });
  });

  describe('create()', () => {
    it('creates a new guest with defaults', () => {
      const guest = guestService.create({
        workspaceId: WORKSPACE_ID,
        name: 'Test Guest',
        email: 'test@example.com',
        title: 'Engineer',
        company: 'Acme Corp',
      });

      expect(guest.id).toBeDefined();
      expect(guest.name).toBe('Test Guest');
      expect(guest.stage).toBe('discover');
      expect(guest.fitScore).toBe(0);
      expect(guest.outreachCount).toBe(0);
    });
  });

  describe('update()', () => {
    it('updates a guest', () => {
      const updated = guestService.update('guest_001', WORKSPACE_ID, { notes: 'Updated note' });
      expect(updated?.notes).toBe('Updated note');
    });

    it('returns null for non-existent guest', () => {
      const result = guestService.update('guest_999', WORKSPACE_ID, { notes: 'test' });
      expect(result).toBeNull();
    });
  });

  describe('transitionStage()', () => {
    it('allows valid stage transitions', () => {
      const result = guestService.transitionStage('guest_001', WORKSPACE_ID, 'outreach');
      expect(result.success).toBe(true);
      expect(result.guest.stage).toBe('outreach');
    });

    it('rejects invalid stage transitions', () => {
      // guest_001 is in 'discover' — cannot jump to 'published'
      const result = guestService.transitionStage('guest_001', WORKSPACE_ID, 'published');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Cannot transition');
    });

    it('allows outreach -> scheduled', () => {
      const result = guestService.transitionStage('guest_007', WORKSPACE_ID, 'scheduled');
      expect(result.success).toBe(true);
    });

    it('allows scheduled -> recorded', () => {
      const result = guestService.transitionStage('guest_013', WORKSPACE_ID, 'recorded');
      expect(result.success).toBe(true);
    });
  });

  describe('delete()', () => {
    it('soft deletes a guest', () => {
      const deleted = guestService.delete('guest_001', WORKSPACE_ID);
      expect(deleted).toBe(true);

      const found = guestService.findById('guest_001', WORKSPACE_ID);
      expect(found).toBeNull();
    });

    it('returns false for non-existent guest', () => {
      const deleted = guestService.delete('guest_999', WORKSPACE_ID);
      expect(deleted).toBe(false);
    });
  });

  describe('getByStage()', () => {
    it('returns guests grouped by stage', () => {
      const byStage = guestService.getByStage(WORKSPACE_ID);
      expect(byStage.discover).toBeDefined();
      expect(byStage.outreach).toBeDefined();
      expect(byStage.scheduled).toBeDefined();
      expect(byStage.recorded).toBeDefined();
      expect(byStage.published).toBeDefined();
      expect(byStage.follow_up).toBeDefined();

      const allGuests = Object.values(byStage).flat();
      expect(allGuests.length).toBeGreaterThan(0);
    });
  });
});
