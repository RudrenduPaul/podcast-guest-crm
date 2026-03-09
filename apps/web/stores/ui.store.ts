import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GuestLifecycleStage, GuestPriority } from '@podcast-crm/types';

export interface GuestFilters {
  stage: GuestLifecycleStage | '';
  priority: GuestPriority | '';
  search: string;
  topics: string[];
}

interface UIStore {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Selected guest
  selectedGuestId: string | null;
  setSelectedGuestId: (id: string | null) => void;

  // Guest filters (persisted)
  guestFilters: GuestFilters;
  setGuestFilters: (filters: Partial<GuestFilters>) => void;
  resetGuestFilters: () => void;

  // Active workspace
  workspaceId: string;
  setWorkspaceId: (id: string) => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Pipeline view mode
  pipelineView: 'kanban' | 'list';
  setPipelineView: (view: 'kanban' | 'list') => void;

  // AI panel
  aiPanelOpen: boolean;
  setAiPanelOpen: (open: boolean) => void;

  // Guest detail drawer
  guestDrawerOpen: boolean;
  setGuestDrawerOpen: (open: boolean) => void;

  // Command palette (⌘K)
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Add Guest modal
  addGuestModalOpen: boolean;
  setAddGuestModalOpen: (open: boolean) => void;
}

const defaultFilters: GuestFilters = {
  stage: '',
  priority: '',
  search: '',
  topics: [],
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Selected guest
      selectedGuestId: null,
      setSelectedGuestId: (id) => set({ selectedGuestId: id }),

      // Guest filters
      guestFilters: defaultFilters,
      setGuestFilters: (filters) =>
        set((state) => ({ guestFilters: { ...state.guestFilters, ...filters } })),
      resetGuestFilters: () => set({ guestFilters: defaultFilters }),

      // Workspace
      workspaceId: 'ws_demo_01',
      setWorkspaceId: (id) => set({ workspaceId: id }),

      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Pipeline view
      pipelineView: 'kanban',
      setPipelineView: (view) => set({ pipelineView: view }),

      // AI panel
      aiPanelOpen: false,
      setAiPanelOpen: (open) => set({ aiPanelOpen: open }),

      // Guest detail drawer
      guestDrawerOpen: false,
      setGuestDrawerOpen: (open) => set({ guestDrawerOpen: open }),

      // Command palette
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      // Add Guest modal
      addGuestModalOpen: false,
      setAddGuestModalOpen: (open) => set({ addGuestModalOpen: open }),
    }),
    {
      name: 'podcast-crm-ui',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        guestFilters: state.guestFilters,
        workspaceId: state.workspaceId,
        theme: state.theme,
        pipelineView: state.pipelineView,
      }),
    }
  )
);
