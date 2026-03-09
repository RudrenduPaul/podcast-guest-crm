'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Loader2, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { Guest } from '@podcast-crm/types';

interface InterviewBriefPanelProps {
  guest: Guest;
}

type PanelState = 'idle' | 'generating' | 'done';

interface Brief {
  bioIntro: string;
  questions: Array<{ type: string; question: string }>;
  talkingPoints: string[];
  closingHook: string;
}

function generateMockBrief(guest: Guest): Brief {
  const firstName = guest.name.split(' ')[0];
  const topic0 = guest.topics[0] ?? 'their field';
  const topic1 = guest.topics[1] ?? topic0;

  return {
    bioIntro: guest.bio
      ? `${guest.name} is ${guest.title} at ${guest.company}. ${guest.bio.slice(0, 180)}${guest.bio.length > 180 ? '...' : ''}`
      : `${guest.name} is ${guest.title} at ${guest.company}, known for their expertise in ${guest.topics.slice(0, 2).join(' and ')}.`,
    questions: [
      {
        type: 'Deep Dive',
        question: `Your work on ${topic0} has been gaining attention — what's the one thing most people fundamentally misunderstand about it?`,
      },
      {
        type: 'Career Inflection',
        question: `What was the turning point where you realized ${topic0} was where you needed to focus all of your energy?`,
      },
      {
        type: 'Contrarian Take',
        question: `What's a widely-held belief in your space that you think is actively holding the industry back?`,
      },
      {
        type: 'Forward-Looking',
        question: `In five years, what does the landscape look like for ${topic1}? What should people be building for that world today?`,
      },
      {
        type: 'Philosophy',
        question: `You've built a lot in a short time. What's the one decision-making framework you return to most when things get hard?`,
      },
    ],
    talkingPoints: [
      `${firstName}'s work at ${guest.company} is highly relevant to our ${topic0}-focused audience`,
      `Rare combination of technical depth and business strategy — positions them as a credible authority`,
      `${topic0} and ${topic1} intersection is exactly where our audience is spending mental energy`,
    ],
    closingHook: `End with: "If someone listens to this in five years — what do you want them to remember about how you thought about ${topic0} in 2026?"`,
  };
}

export function InterviewBriefPanel({ guest }: InterviewBriefPanelProps) {
  const [state, setState] = useState<PanelState>('idle');
  const [brief, setBrief] = useState<Brief | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setState('generating');
    setBrief(null);
    await new Promise((r) => setTimeout(r, 1800));
    setBrief(generateMockBrief(guest));
    setState('done');
  };

  const handleCopy = async () => {
    if (!brief) return;
    const text = [
      `Interview Brief: ${guest.name}`,
      '',
      'Bio Intro:',
      brief.bioIntro,
      '',
      'Questions:',
      ...brief.questions.map((q, i) => `${i + 1}. [${q.type}] ${q.question}`),
      '',
      'Talking Points:',
      ...brief.talkingPoints.map((t) => `• ${t}`),
      '',
      'Closing Hook:',
      brief.closingHook,
    ].join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Interview brief copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full gap-4 text-center py-8"
          >
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-50 to-brand-50 border border-violet-100 flex items-center justify-center">
              <FileText className="h-7 w-7 text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Interview Brief</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                5 tailored questions, talking points, and a closing hook for{' '}
                {guest.name.split(' ')[0]}.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleGenerate}
              className="gap-2 border-violet-200 text-violet-700 hover:bg-violet-50"
            >
              <Sparkles className="h-4 w-4" />
              Generate Brief
            </Button>
          </motion.div>
        )}

        {state === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full gap-4"
          >
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-brand-600 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">Preparing brief...</p>
              <p className="text-xs text-slate-400 mt-1">Crafting questions for {guest.name}</p>
            </div>
            <div className="w-full space-y-2 px-2">
              {[100, 80, 90, 70, 85].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded-full bg-slate-100 overflow-hidden"
                  style={{ width: `${w}%` }}
                >
                  <div className="h-full w-full animate-shimmer bg-gradient-to-r from-slate-100 via-violet-100 to-slate-100" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {state === 'done' && brief && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="h-full overflow-y-auto space-y-3 pb-2"
          >
            {/* Bio Intro */}
            <div className="rounded-lg bg-violet-50 border border-violet-100 p-3">
              <p className="text-[10px] font-semibold text-violet-600 uppercase tracking-wide mb-1.5">
                Bio Intro
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">{brief.bioIntro}</p>
            </div>

            {/* Questions */}
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Interview Questions
              </p>
              <div className="space-y-2">
                {brief.questions.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-bold rounded-full bg-brand-100 text-brand-700 px-1.5 py-0.5">
                        {q.type}
                      </span>
                      <span className="text-[10px] text-slate-400">Q{i + 1}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{q.question}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Talking Points */}
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
              <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                Talking Points
              </p>
              <ul className="space-y-1.5">
                {brief.talkingPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <p className="text-xs text-slate-700 leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Closing Hook */}
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
              <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mb-1.5">
                Closing Hook
              </p>
              <p className="text-xs text-slate-700 leading-relaxed italic">{brief.closingHook}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1 sticky bottom-0 bg-white py-2 border-t border-slate-100 -mx-0.5 px-0.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                className="flex-1 gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Regenerate
              </Button>
              <Button
                size="sm"
                onClick={handleCopy}
                variant={copied ? 'secondary' : 'default'}
                className="flex-1 gap-1.5"
              >
                {copied ? (
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? 'Copied!' : 'Copy brief'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
