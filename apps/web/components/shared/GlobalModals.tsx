'use client';

import { useUIStore } from '@/stores/ui.store';
import { CommandPalette } from './CommandPalette';
import { AddGuestModal } from '../guests/AddGuestModal';

/**
 * GlobalModals renders app-wide overlays (command palette, add-guest modal).
 * Mounted once in the dashboard layout so it's always available,
 * regardless of which page the user is on.
 */
export function GlobalModals() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    addGuestModalOpen,
    setAddGuestModalOpen,
  } = useUIStore();

  return (
    <>
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onAddGuest={() => {
          setCommandPaletteOpen(false);
          setAddGuestModalOpen(true);
        }}
      />
      <AddGuestModal
        open={addGuestModalOpen}
        onClose={() => setAddGuestModalOpen(false)}
      />
    </>
  );
}
