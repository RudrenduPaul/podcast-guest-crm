'use client';

import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  Sparkles,
  FileText,
  Share2,
  Calendar,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GuestAvatar } from '@/components/ui/avatar';
import { AIAssistPanel } from '@/components/outreach/AIAssistPanel';
import { InterviewBriefPanel } from '@/components/guests/InterviewBriefPanel';
import { SocialPostsPanel } from '@/components/guests/SocialPostsPanel';
import { useGuest } from '@/hooks/useGuests';
import {
  STAGE_CONFIG,
  PRIORITY_CONFIG,
  getFitScoreColor,
  getFitScoreBarColor,
  formatDate,
  formatRelativeDate,
} from '@/lib/utils';
import type { GuestLifecycleStage } from '@podcast-crm/types';

interface GuestDetailPageProps {
  params: Promise<{ id: string }>;
}

const STAGE_ORDER: GuestLifecycleStage[] = [
  'discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up'
];

export default function GuestDetailPage({ params }: GuestDetailPageProps) {
  const { id } = use(params);
  const { data: guest, isLoading } = useGuest(id);
  const [aiAction, setAiAction] = useState<'outreach' | 'brief' | 'social' | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="w-80 h-96" />
        </div>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Guest not found.</p>
        <Link href="/dashboard/pipeline">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pipeline
          </Button>
        </Link>
      </div>
    );
  }

  const stageConfig = STAGE_CONFIG[guest.stage];
  const priorityConfig = PRIORITY_CONFIG[guest.priority];
  const scoreColor = getFitScoreColor(guest.fitScore);
  const barColor = getFitScoreBarColor(guest.fitScore);

  const currentStageIndex = STAGE_ORDER.indexOf(guest.stage);

  return (
    <div className="p-6 space-y-6">
      {/* Back navigation */}
      <Link href="/dashboard/pipeline">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-slate-500">
          <ArrowLeft className="h-4 w-4" />
          Pipeline
        </Button>
      </Link>

      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-5 min-w-0">
          {/* Guest header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-5">
                  <GuestAvatar
                    name={guest.name}
                    avatarUrl={guest.avatarUrl}
                    size="xl"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl font-bold text-slate-900">{guest.name}</h1>
                      <Badge variant={guest.stage as GuestLifecycleStage}>
                        {stageConfig.label}
                      </Badge>
                      <Badge variant={guest.priority}>
                        {priorityConfig.label} Priority
                      </Badge>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      {guest.title} · {guest.company}
                    </p>

                    {/* Contact links */}
                    <div className="flex items-center gap-2 mt-3">
                      {guest.email && (
                        <a href={`mailto:${guest.email}`} className="text-slate-400 hover:text-brand-600">
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {guest.linkedinUrl && (
                        <a href={guest.linkedinUrl} target="_blank" rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-600">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {guest.twitterHandle && (
                        <a href={`https://twitter.com/${guest.twitterHandle}`} target="_blank" rel="noopener noreferrer"
                          className="text-slate-400 hover:text-sky-500">
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {guest.websiteUrl && (
                        <a href={guest.websiteUrl} target="_blank" rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-600">
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      {guest.podcastUrl && (
                        <a href={guest.podcastUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Listen to episode
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Fit score */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-100 bg-white">
                      <span className={`text-xl font-bold ${scoreColor}`}>
                        {guest.fitScore > 0 ? guest.fitScore : '—'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">Fit Score</p>
                    {guest.fitScore > 0 && (
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${guest.fitScore}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${barColor}`}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {guest.bio && (
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {guest.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Stage timeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Lifecycle Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {STAGE_ORDER.map((stage, i) => {
                    const config = STAGE_CONFIG[stage];
                    const isCompleted = i < currentStageIndex;
                    const isCurrent = i === currentStageIndex;

                    return (
                      <div key={stage} className="flex items-center flex-1">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`h-3 w-3 rounded-full border-2 transition-all ${
                              isCurrent
                                ? `${config.dotColor} border-current ring-2 ring-offset-1`
                                : isCompleted
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'bg-slate-200 border-slate-200'
                            }`}
                          />
                          <span className={`text-[9px] font-medium ${
                            isCurrent ? config.color : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                          }`}>
                            {config.label}
                          </span>
                        </div>
                        {i < STAGE_ORDER.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 ${
                            i < currentStageIndex ? 'bg-emerald-400' : 'bg-slate-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Topics + Episode info */}
          <div className="grid grid-cols-2 gap-5">
            {/* Topics */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {guest.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-brand-50 border border-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Episode info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Episode Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {guest.episodeTitle ? (
                    <>
                      <div>
                        <p className="text-xs text-slate-500">Episode Title</p>
                        <p className="text-sm font-medium text-slate-900 mt-0.5">{guest.episodeTitle}</p>
                      </div>
                      {guest.episodeNumber && (
                        <div className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-sm text-slate-700">Episode #{guest.episodeNumber}</span>
                        </div>
                      )}
                      {guest.recordingDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-700">
                            {formatDate(guest.recordingDate, 'MMM d, yyyy')}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-slate-400">No episode scheduled yet.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Notes */}
          {guest.notes && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 leading-relaxed">{guest.notes}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* AI Actions sidebar */}
        <div className="w-80 shrink-0 space-y-4">
          {/* AI Actions */}
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-600" />
                <CardTitle className="text-base">AI Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => setAiAction(aiAction === 'outreach' ? null : 'outreach')}
                className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                  aiAction === 'outreach'
                    ? 'border-brand-300 bg-brand-50'
                    : 'border-slate-200 hover:border-brand-200 hover:bg-slate-50'
                }`}
              >
                <Mail className="h-4 w-4 text-brand-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Draft Outreach Email</p>
                  <p className="text-xs text-slate-500">Personalized with Claude AI</p>
                </div>
              </button>
              <button
                onClick={() => setAiAction(aiAction === 'brief' ? null : 'brief')}
                className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                  aiAction === 'brief'
                    ? 'border-brand-300 bg-brand-50'
                    : 'border-slate-200 hover:border-brand-200 hover:bg-slate-50'
                }`}
              >
                <FileText className="h-4 w-4 text-violet-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Interview Brief</p>
                  <p className="text-xs text-slate-500">Questions + talking points</p>
                </div>
              </button>
              <button
                onClick={() => setAiAction(aiAction === 'social' ? null : 'social')}
                className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                  aiAction === 'social'
                    ? 'border-brand-300 bg-brand-50'
                    : 'border-slate-200 hover:border-brand-200 hover:bg-slate-50'
                }`}
              >
                <Share2 className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Social Posts</p>
                  <p className="text-xs text-slate-500">LinkedIn + Twitter thread</p>
                </div>
              </button>
            </CardContent>
          </Card>

          {/* AI Panels */}
          {aiAction && (
            <motion.div
              key={aiAction}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="pt-5 h-[500px] flex flex-col">
                  {aiAction === 'outreach' && <AIAssistPanel guest={guest} />}
                  {aiAction === 'brief' && <InterviewBriefPanel guest={guest} />}
                  {aiAction === 'social' && <SocialPostsPanel guest={guest} />}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Outreach stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Outreach Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Emails sent</span>
                <span className="font-medium">{guest.outreachCount}</span>
              </div>
              {guest.lastContactedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last contacted</span>
                  <span className="font-medium text-slate-700">
                    {formatRelativeDate(guest.lastContactedAt)}
                  </span>
                </div>
              )}
              {guest.nextFollowUpDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Next follow-up</span>
                  <span className="font-medium text-amber-600">
                    {formatDate(guest.nextFollowUpDate)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
