'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Mic2, X, CheckCircle2 } from 'lucide-react';
import { seedGuests } from '@/lib/mock-data';
import { getDaysInStage } from '@/lib/utils';
import { GuestAvatar } from '@/components/ui/avatar';

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  const staleOutreach = seedGuests
    .filter((g) => g.stage === 'outreach' && getDaysInStage(g.updatedAt) > 7)
    .slice(0, 4);

  const scheduledGuests = seedGuests
    .filter((g) => g.stage === 'scheduled')
    .slice(0, 3);

  const totalCount = staleOutreach.length + scheduledGuests.length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {totalCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl z-40 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-3.5 w-3.5 text-slate-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                  {totalCount > 0 && (
                    <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">
                      {totalCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                {/* Follow-up nudges */}
                {staleOutreach.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 bg-amber-50 border-b border-amber-100 px-4 py-2">
                      <Clock className="h-3 w-3 text-amber-600" />
                      <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                        Follow-up Needed ({staleOutreach.length})
                      </p>
                    </div>
                    {staleOutreach.map((guest) => {
                      const days = getDaysInStage(guest.updatedAt);
                      return (
                        <Link
                          key={guest.id}
                          href={`/dashboard/pipeline/${guest.id}`}
                          onClick={() => setOpen(false)}
                        >
                          <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                            <GuestAvatar name={guest.name} avatarUrl={guest.avatarUrl} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-900 truncate">
                                {guest.name}
                              </p>
                              <p className="text-[11px] text-amber-600">
                                {days} days without a reply
                              </p>
                            </div>
                            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5 shrink-0">
                              Nudge
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Upcoming recordings */}
                {scheduledGuests.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 bg-blue-50 border-b border-blue-100 px-4 py-2">
                      <Mic2 className="h-3 w-3 text-blue-600" />
                      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700">
                        Scheduled ({scheduledGuests.length})
                      </p>
                    </div>
                    {scheduledGuests.map((guest) => (
                      <Link
                        key={guest.id}
                        href={`/dashboard/pipeline/${guest.id}`}
                        onClick={() => setOpen(false)}
                      >
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                          <GuestAvatar name={guest.name} avatarUrl={guest.avatarUrl} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-900 truncate">
                              {guest.name}
                            </p>
                            <p className="text-[11px] text-blue-600">
                              {guest.recordingDate
                                ? `Recording: ${guest.recordingDate}`
                                : 'Awaiting date confirmation'}
                            </p>
                          </div>
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-1.5 py-0.5 shrink-0">
                            Ready
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* All clear state */}
                {totalCount === 0 && (
                  <div className="py-10 text-center">
                    <div className="mx-auto h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">All caught up!</p>
                    <p className="text-xs text-slate-400 mt-0.5">No action items right now.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 px-4 py-2.5">
                <Link
                  href="/dashboard/pipeline"
                  onClick={() => setOpen(false)}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  View all in Pipeline →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
