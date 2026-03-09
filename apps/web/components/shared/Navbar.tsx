'use client';

import { useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { GuestAvatar } from '@/components/ui/avatar';
import { NotificationDropdown } from './NotificationDropdown';
import { useUIStore } from '@/stores/ui.store';
import { seedWorkspaceMembers } from '@/lib/mock-data';

const currentUser = seedWorkspaceMembers[0];

export function Navbar() {
  const { setCommandPaletteOpen, setAddGuestModalOpen } = useUIStore();

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // ⌘N / Ctrl+N → Add guest
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setAddGuestModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setCommandPaletteOpen, setAddGuestModalOpen]);

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Search — opens command palette */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400 w-72 hover:bg-white hover:border-brand-300 transition-colors"
        aria-label="Open command palette"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search guests...</span>
        <kbd className="ml-auto text-[10px] border border-slate-200 rounded px-1 py-0.5 font-medium">
          ⌘K
        </kbd>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Demo badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-medium text-amber-700">Demo Mode</span>
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User menu */}
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors">
          {currentUser && <GuestAvatar name={currentUser.name} size="sm" />}
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-slate-900">{currentUser?.name ?? 'User'}</span>
            <span className="text-xs text-slate-500 capitalize">{currentUser?.role ?? 'member'}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
