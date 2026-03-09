'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GuestTable } from '@/components/guests/GuestTable';
import { useGuests } from '@/hooks/useGuests';
import { useUIStore } from '@/stores/ui.store';
import { cn } from '@/lib/utils';
import type { GuestLifecycleStage } from '@podcast-crm/types';

const STAGE_FILTERS: { value: GuestLifecycleStage | ''; label: string }[] = [
  { value: '', label: 'All Stages' },
  { value: 'discover', label: 'Discover' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'recorded', label: 'Recorded' },
  { value: 'published', label: 'Published' },
  { value: 'follow_up', label: 'Follow-up' },
];

export default function GuestsPage() {
  const { guestFilters, setGuestFilters, setAddGuestModalOpen } = useUIStore();
  const [search, setSearch] = useState(guestFilters.search);

  const { data, isLoading } = useGuests({
    stage: guestFilters.stage || undefined,
    priority: guestFilters.priority || undefined,
    search: guestFilters.search || undefined,
    limit: 100,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setGuestFilters({ search: value });
  };

  const handleStageFilter = (stage: GuestLifecycleStage | '') => {
    setGuestFilters({ stage });
  };

  const guests = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guests</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {total} guest{total !== 1 ? 's' : ''} in your pipeline
          </p>
        </div>
        <Button className="gap-2" onClick={() => setAddGuestModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Guest
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search guests..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Stage filter chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STAGE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleStageFilter(filter.value)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors border',
                guestFilters.stage === filter.value
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-700'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-1.5">
          {(['', 'high', 'medium', 'low'] as const).slice(1).map((priority) => (
            <button
              key={priority}
              onClick={() =>
                setGuestFilters({ priority: guestFilters.priority === priority ? '' : priority })
              }
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium transition-colors border',
                guestFilters.priority === priority
                  ? priority === 'high'
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : priority === 'medium'
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              )}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          ))}
        </div>

        {/* Active filters indicator */}
        {(guestFilters.stage || guestFilters.priority || guestFilters.search) && (
          <button
            onClick={() => {
              setGuestFilters({ stage: '', priority: '', search: '' });
              setSearch('');
            }}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GuestTable guests={guests} isLoading={isLoading} />
      </motion.div>
    </div>
  );
}
