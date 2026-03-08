'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import type { Guest } from '@podcast-crm/types';

interface AIAssistPanelProps {
  guest: Guest;
  onEmailGenerated?: (subject: string, body: string) => void;
}

type PanelState = 'idle' | 'generating' | 'done' | 'error';

export function AIAssistPanel({ guest, onEmailGenerated }: AIAssistPanelProps) {
  const [state, setState] = useState<PanelState>('idle');
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [displayedBody, setDisplayedBody] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [copied, setCopied] = useState(false);
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter effect
  useEffect(() => {
    if (state !== 'done' || !generatedBody) return;

    setDisplayedBody('');
    let i = 0;
    const chars = generatedBody.split('');

    const tick = () => {
      if (i < chars.length) {
        setDisplayedBody(generatedBody.slice(0, i + 1));
        i++;
        typewriterRef.current = setTimeout(tick, 8);
      }
    };

    typewriterRef.current = setTimeout(tick, 100);
    return () => {
      if (typewriterRef.current) clearTimeout(typewriterRef.current);
    };
  }, [state, generatedBody]);

  const handleGenerate = async () => {
    setState('generating');
    setGeneratedSubject('');
    setGeneratedBody('');
    setDisplayedBody('');

    try {
      const result = await api.outreach.draft(guest.id);
      const { subject, body, confidenceScore: score } = result.data;

      setGeneratedSubject(subject);
      setGeneratedBody(body);
      setConfidenceScore(score);
      setState('done');
      onEmailGenerated?.(subject, body);
    } catch {
      // Fallback to a mock response for demo purposes
      const mockSubject = `Podcast Invite: ${guest.name} — ${guest.topics[0] ?? 'Tech Innovation'} for 40,000 Builders`;
      const mockBody = `Hi ${guest.name.split(' ')[0]},

Your work at ${guest.company} — specifically your perspective on ${guest.topics[0] ?? 'the industry'} — is exactly what our audience of 40,000 technical founders and engineers needs to hear.

I host "The Signal & The Noise", where we go deep on the ideas shaping AI and technology. Past guests include Andrej Karpathy, Sam Altman, and Kelsey Hightower.

I'd love to have a 45-minute conversation about ${guest.topics[1] ?? guest.topics[0] ?? 'your work'}. No prep required — I promise it'll be worth your time.

Would next month work?

Best,
Rudrendu Paul`;

      setGeneratedSubject(mockSubject);
      setGeneratedBody(mockBody);
      setConfidenceScore(82);
      setState('done');
      onEmailGenerated?.(mockSubject, mockBody);
    }
  };

  const handleCopy = async () => {
    const text = `Subject: ${generatedSubject}\n\n${generatedBody}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Claude AI</h3>
            <p className="text-[10px] text-slate-500">claude-sonnet-4-6</p>
          </div>
        </div>
        {state === 'done' && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-700">
              {confidenceScore}% confidence
            </span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-4 text-center py-8"
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Ready to draft</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[180px]">
                  Claude will write a personalized email for {guest.name.split(' ')[0]} based on their profile.
                </p>
              </div>
              <Button variant="ai" onClick={handleGenerate} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate with Claude
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
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">Claude is thinking...</p>
                <p className="text-xs text-slate-400 mt-1">Analyzing {guest.name}'s profile</p>
              </div>
              {/* Shimmer bars */}
              <div className="w-full space-y-2 px-2">
                {[100, 85, 70, 90, 60].map((w, i) => (
                  <div key={i} className="h-3 rounded-full bg-slate-100 overflow-hidden" style={{ width: `${w}%` }}>
                    <div className="h-full w-full animate-shimmer bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {(state === 'done' || state === 'error') && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-y-auto space-y-3"
            >
              {/* Subject */}
              {generatedSubject && (
                <div className="rounded-lg bg-brand-50 border border-brand-100 p-3">
                  <p className="text-[10px] font-semibold text-brand-600 uppercase tracking-wide mb-1">
                    Subject Line
                  </p>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {generatedSubject}
                  </p>
                </div>
              )}

              {/* Body with typewriter effect */}
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Email Body
                </p>
                <p
                  className={cn(
                    'text-xs text-slate-700 leading-relaxed whitespace-pre-wrap',
                    displayedBody.length < generatedBody.length && 'typewriter-cursor'
                  )}
                >
                  {displayedBody}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      {state === 'done' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mt-4 pt-4 border-t border-slate-100"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            className="flex-1 gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </Button>
          <Button
            size="sm"
            onClick={handleCopy}
            className="flex-1 gap-1.5"
            variant={copied ? 'secondary' : 'default'}
          >
            {copied ? (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? 'Copied!' : 'Copy email'}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
