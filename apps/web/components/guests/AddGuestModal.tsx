'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useCreateGuest } from '@/hooks/useGuests';
import type { GuestLifecycleStage, GuestPriority } from '@podcast-crm/types';

interface AddGuestModalProps {
  open: boolean;
  onClose: () => void;
}

const STAGES: { value: GuestLifecycleStage; label: string }[] = [
  { value: 'discover', label: 'Discover' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'scheduled', label: 'Scheduled' },
];

const PRIORITIES: { value: GuestPriority; label: string; active: string }[] = [
  { value: 'high', label: 'High', active: 'bg-red-500 text-white border-red-500' },
  { value: 'medium', label: 'Medium', active: 'bg-amber-500 text-white border-amber-500' },
  { value: 'low', label: 'Low', active: 'bg-slate-500 text-white border-slate-500' },
];

interface FormState {
  name: string;
  email: string;
  title: string;
  company: string;
  bio: string;
  topics: string;
  linkedinUrl: string;
  twitterHandle: string;
  stage: GuestLifecycleStage;
  priority: GuestPriority;
}

const DEFAULT_FORM: FormState = {
  name: '',
  email: '',
  title: '',
  company: '',
  bio: '',
  topics: '',
  linkedinUrl: '',
  twitterHandle: '',
  stage: 'discover',
  priority: 'medium',
};

export function AddGuestModal({ open, onClose }: AddGuestModalProps) {
  const { mutateAsync: createGuest, isPending } = useCreateGuest();
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  const handleClose = () => {
    onClose();
    setForm(DEFAULT_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    const topics = form.topics
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await createGuest({
        name: form.name.trim(),
        email: form.email.trim(),
        title: form.title.trim(),
        company: form.company.trim(),
        bio: form.bio.trim(),
        topics,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        twitterHandle: form.twitterHandle.replace('@', '').trim() || undefined,
        stage: form.stage,
        priority: form.priority,
        fitScore: 0,
        outreachCount: 0,
        notes: '',
        workspaceId: 'ws_demo_01',
      });
      handleClose();
    } catch {
      // useCreateGuest shows a toast on error
    }
  };

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

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
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Add Guest</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add a potential guest to your booking pipeline
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Name + Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input placeholder="Dr. Sarah Chen" {...field('name')} required />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="sarah@example.com"
                      {...field('email')}
                      required
                    />
                  </div>
                </div>

                {/* Title + Company */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1.5">Title</label>
                    <Input placeholder="CEO, Author, Professor..." {...field('title')} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1.5">
                      Company / Org
                    </label>
                    <Input placeholder="Acme Corp" {...field('company')} />
                  </div>
                </div>

                {/* Topics */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">
                    Topics{' '}
                    <span className="text-slate-400 font-normal">(comma-separated)</span>
                  </label>
                  <Input
                    placeholder="AI, Machine Learning, Product Strategy"
                    {...field('topics')}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">Bio</label>
                  <textarea
                    placeholder="Short bio — Claude uses this to personalize outreach and score fit..."
                    {...field('bio')}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none placeholder:text-slate-400"
                  />
                </div>

                {/* LinkedIn + Twitter */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1.5">
                      LinkedIn URL
                    </label>
                    <Input
                      placeholder="https://linkedin.com/in/..."
                      {...field('linkedinUrl')}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1.5">
                      Twitter Handle
                    </label>
                    <Input placeholder="@handle" {...field('twitterHandle')} />
                  </div>
                </div>

                {/* Stage + Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-2">
                      Start Stage
                    </label>
                    <div className="flex gap-1.5 flex-wrap">
                      {STAGES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, stage: s.value }))}
                          className={cn(
                            'rounded-full px-2.5 py-1 text-xs font-medium border transition-colors',
                            form.stage === s.value
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-700'
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-2">
                      Priority
                    </label>
                    <div className="flex gap-1.5">
                      {PRIORITIES.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, priority: p.value }))}
                          className={cn(
                            'rounded-full px-2.5 py-1 text-xs font-medium border transition-colors',
                            form.priority === p.value
                              ? p.active
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI hint */}
                <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100 px-3 py-2.5">
                  <Sparkles className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Claude will auto-score fit and draft outreach after you add this guest.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !form.name.trim() || !form.email.trim()}
                    className="flex-1 gap-2"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {isPending ? 'Adding...' : 'Add to Pipeline'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
