'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';
import { GuestAvatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { seedWorkspaceMembers } from '@/lib/mock-data';

const currentUser = seedWorkspaceMembers[0];

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400 w-64 cursor-pointer hover:bg-white hover:border-brand-300 transition-colors">
        <Search className="h-4 w-4" />
        <span>Search guests...</span>
        <kbd className="ml-auto text-[10px] border border-slate-200 rounded px-1 py-0.5">⌘K</kbd>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Demo badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-medium text-amber-700">Demo Mode</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4 text-slate-500" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </Button>

        {/* User */}
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors">
          {currentUser && (
            <GuestAvatar name={currentUser.name} size="sm" />
          )}
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
