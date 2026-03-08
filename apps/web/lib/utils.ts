import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import type { GuestLifecycleStage, GuestPriority } from '@podcast-crm/types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return 'Unknown date';
  }
}

export function formatDate(dateString: string, formatStr = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), formatStr);
  } catch {
    return 'Invalid date';
  }
}

export function getDaysInStage(updatedAt: string): number {
  const updated = new Date(updatedAt);
  const now = new Date();
  return Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
}

export const STAGE_CONFIG: Record<
  GuestLifecycleStage,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    dotColor: string;
    emptyMessage: string;
    emptySubMessage: string;
  }
> = {
  discover: {
    label: 'Discover',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
    dotColor: 'bg-slate-500',
    emptyMessage: 'Your discovery list is empty',
    emptySubMessage: 'Add potential guests to start building your pipeline.',
  },
  outreach: {
    label: 'Outreach',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
    emptyMessage: 'No active outreach',
    emptySubMessage: "Move guests from Discover and let Claude draft your first email.",
  },
  scheduled: {
    label: 'Scheduled',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    dotColor: 'bg-blue-500',
    emptyMessage: 'Nothing on the calendar',
    emptySubMessage: "Your first confirmed guest will appear here. Keep reaching out.",
  },
  recorded: {
    label: 'Recorded',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    dotColor: 'bg-violet-500',
    emptyMessage: 'In the editing queue',
    emptySubMessage: "Recorded episodes will queue here while in post-production.",
  },
  published: {
    label: 'Published',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    emptyMessage: 'No published episodes yet',
    emptySubMessage: "Your first published episode will be celebrated here.",
  },
  follow_up: {
    label: 'Follow-up',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    dotColor: 'bg-pink-500',
    emptyMessage: 'No follow-up needed',
    emptySubMessage: "Past guests who deserve a second conversation will appear here.",
  },
};

export const PRIORITY_CONFIG: Record<
  GuestPriority,
  { label: string; color: string; bgColor: string }
> = {
  high: { label: 'High', color: 'text-red-700', bgColor: 'bg-red-100' },
  medium: { label: 'Medium', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  low: { label: 'Low', color: 'text-slate-600', bgColor: 'bg-slate-100' },
};

export function getFitScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-slate-500';
}

export function getFitScoreBarColor(score: number): string {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 75) return 'bg-blue-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-slate-400';
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
