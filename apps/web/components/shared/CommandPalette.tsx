'use client';

import { useState, useEffect, useRef, useCallback, type ElementType } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  Kanban,
  Mail,
  BarChart3,
  Settings,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
  X,
} from 'lucide-react';
import { seedGuests } from '@/lib/mock-data';
import { STAGE_CONFIG } from '@/lib/utils';
import { GuestAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { GuestLifecycleStage } from '@podcast-crm/types';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onAddGuest?: () => void;
}

const PAGES = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Overview & metrics' },
  { label: 'Guests', href: '/dashboard/guests', icon: Users, description: 'All guests list' },
  { label: 'Pipeline', href: '/dashboard/pipeline', icon: Kanban, description: 'Kanban board' },
  { label: 'AI Outreach', href: '/dashboard/outreach', icon: Mail, description: 'Draft with Claude' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, description: 'Metrics & charts' },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, description: 'Workspace config' },
];

type ResultItem =
  | { kind: 'section'; label: string }
  | {
      kind: 'guest';
      id: string;
      name: string;
      company: string;
      stage: GuestLifecycleStage;
      avatarUrl?: string;
    }
  | { kind: 'page'; label: string; href: string; icon: ElementType; description: string }
  | { kind: 'action'; label: string; description: string; icon: ElementType; action: string };

export function CommandPalette({ open, onClose, onAddGuest }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filteredGuests = seedGuests
    .filter((g) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.company.toLowerCase().includes(q) ||
        g.topics.some((t) => t.toLowerCase().includes(q))
      );
    })
    .slice(0, query ? 6 : 4);

  const filteredPages = PAGES.filter((p) => {
    if (!query) return true;
    return (
      p.label.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  });

  const items: ResultItem[] = [];

  if (filteredGuests.length > 0) {
    items.push({ kind: 'section', label: query ? 'Guests' : 'Recent Guests' });
    filteredGuests.forEach((g) =>
      items.push({
        kind: 'guest',
        id: g.id,
        name: g.name,
        company: g.company,
        stage: g.stage,
        avatarUrl: g.avatarUrl,
      })
    );
  }

  if (filteredPages.length > 0) {
    items.push({ kind: 'section', label: 'Navigation' });
    filteredPages.forEach((p) => items.push({ kind: 'page', ...p }));
  }

  if (!query) {
    items.push({ kind: 'section', label: 'Quick Actions' });
    items.push({
      kind: 'action',
      label: 'Add New Guest',
      description: 'Start the booking pipeline',
      icon: Users,
      action: 'add-guest',
    });
    items.push({
      kind: 'action',
      label: 'Draft AI Outreach',
      description: 'Claude writes it for you',
      icon: Sparkles,
      action: 'outreach',
    });
  }

  const selectableItems = items.filter((i): i is Exclude<ResultItem, { kind: 'section' }> =>
    i.kind !== 'section'
  );

  const clampedIndex = Math.min(selectedIndex, Math.max(0, selectableItems.length - 1));

  const handleSelect = useCallback(
    (item: Exclude<ResultItem, { kind: 'section' }>) => {
      if (item.kind === 'guest') {
        router.push(`/dashboard/pipeline/${item.id}`);
        onClose();
      } else if (item.kind === 'page') {
        router.push(item.href);
        onClose();
      } else if (item.kind === 'action') {
        if (item.action === 'add-guest') {
          onAddGuest?.();
        } else if (item.action === 'outreach') {
          router.push('/dashboard/outreach');
        }
        onClose();
      }
    },
    [router, onClose, onAddGuest]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, selectableItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        const item = selectableItems[clampedIndex];
        if (item) handleSelect(item);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, selectableItems, clampedIndex, handleSelect, onClose]);

  let selectableCount = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="fixed left-1/2 top-[18vh] z-50 w-full max-w-lg -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search guests, navigate pages, trigger actions..."
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                  esc
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {items.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-slate-500">No results for &quot;{query}&quot;</p>
                    <p className="text-xs text-slate-400 mt-1">Try searching by name, company, or topic</p>
                  </div>
                ) : (
                  items.map((item, i) => {
                    if (item.kind === 'section') {
                      return (
                        <div key={`section-${i}`} className="px-2 pb-1 pt-2 first:pt-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {item.label}
                          </p>
                        </div>
                      );
                    }

                    const currentSelectableIndex = selectableCount++;
                    const isSelected = currentSelectableIndex === clampedIndex;

                    if (item.kind === 'guest') {
                      const stageConfig = STAGE_CONFIG[item.stage];
                      return (
                        <button
                          key={`guest-${item.id}`}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(currentSelectableIndex)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                            isSelected ? 'bg-brand-50' : 'hover:bg-slate-50'
                          )}
                        >
                          <GuestAvatar name={item.name} avatarUrl={item.avatarUrl} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                            <p className="text-xs text-slate-500 truncate">{item.company}</p>
                          </div>
                          <Badge
                            variant={item.stage as GuestLifecycleStage}
                            className="text-[9px] px-1.5 py-0 h-4 shrink-0"
                          >
                            {stageConfig.label}
                          </Badge>
                          {isSelected && (
                            <ArrowRight className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                          )}
                        </button>
                      );
                    }

                    if (item.kind === 'page') {
                      const Icon = item.icon;
                      return (
                        <button
                          key={`page-${item.href}`}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(currentSelectableIndex)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                            isSelected ? 'bg-brand-50' : 'hover:bg-slate-50'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
                              isSelected ? 'bg-brand-100' : 'bg-slate-100'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-3.5 w-3.5',
                                isSelected ? 'text-brand-600' : 'text-slate-500'
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.description}</p>
                          </div>
                          {isSelected && (
                            <ArrowRight className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                          )}
                        </button>
                      );
                    }

                    if (item.kind === 'action') {
                      const Icon = item.icon;
                      return (
                        <button
                          key={`action-${item.label}`}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(currentSelectableIndex)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                            isSelected ? 'bg-violet-50' : 'hover:bg-slate-50'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
                              isSelected ? 'bg-violet-100' : 'bg-slate-100'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-3.5 w-3.5',
                                isSelected ? 'text-violet-600' : 'text-slate-500'
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.description}</p>
                          </div>
                          {isSelected && (
                            <ArrowRight className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                          )}
                        </button>
                      );
                    }

                    return null;
                  })
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-slate-200 px-1 py-0.5 font-medium">↑</kbd>
                    <kbd className="rounded border border-slate-200 px-1 py-0.5 font-medium">↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-slate-200 px-1 py-0.5 font-medium">↵</kbd>
                    select
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3.5 w-3.5 rounded-sm bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                    <Sparkles className="h-2 w-2 text-white" />
                  </div>
                  <span className="text-[10px] text-slate-400">Podcast Guest CRM</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
