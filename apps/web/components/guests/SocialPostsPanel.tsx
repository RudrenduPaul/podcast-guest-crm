'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type ElementType } from 'react';
import { Share2, Sparkles, Loader2, Copy, CheckCircle, Linkedin, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Guest } from '@podcast-crm/types';

interface SocialPostsPanelProps {
  guest: Guest;
}

type PanelState = 'idle' | 'generating' | 'done';
type Platform = 'linkedin' | 'twitter' | 'instagram';

interface SocialPosts {
  linkedin: string;
  twitter: string[];
  instagram: string;
}

function generateMockPosts(guest: Guest): SocialPosts {
  const firstName = guest.name.split(' ')[0];
  const topic0 = guest.topics[0] ?? 'technology';
  const topic1 = guest.topics[1] ?? topic0;
  const hashtag0 = topic0.replace(/\s+/g, '');
  const hashtag1 = topic1.replace(/\s+/g, '');

  return {
    linkedin: `🎙️ New episode just dropped — featuring ${guest.name}, ${guest.title} at ${guest.company}.\n\nWe went deep on ${topic0} and ${topic1} in a way I haven't heard framed quite this way before.\n\nThe insight that hit hardest: the people who shape ${topic0} long-term aren't the ones optimizing for right now — they're the ones building with an honest model of where things are actually heading.\n\n${firstName} has that model. This conversation reflects it.\n\nLink in the comments.\n\n#Podcast #${hashtag0} #${hashtag1} #Founders`,

    twitter: [
      `New episode is live. 🎙️\n\n${guest.name} — ${guest.title} at ${guest.company} — on ${topic0}, ${topic1}, and the question most people in the space are still getting wrong.`,
      `The thing ${firstName} said that I keep coming back to:\n\n"Most people optimize for the outcome they can see. The real work is building conviction about the outcome that isn't obvious yet."\n\nHard to argue with that.`,
      `We covered:\n→ Why ${topic0} is harder than it looks from the outside\n→ What ${guest.company} got right that most others missed\n→ Where ${topic1} is heading — and why timing actually matters here`,
      `${firstName}'s framework for making bets in uncertain environments is one of the clearer mental models I've come across. Genuinely useful if you're building in a fast-moving space.`,
      `Full episode → link in bio.\n\nIf you care about ${topic0} or ${topic1}, this one's worth the hour.`,
    ],

    instagram: `New episode with ${guest.name} 🎙️\n\n${guest.title} at ${guest.company} — talking about ${topic0}, ${topic1}, and what it actually takes to build something that lasts.\n\nLink in bio 🔗\n\n#podcast #${hashtag0.toLowerCase()} #${hashtag1.toLowerCase()} #founder #creator`,
  };
}

const PLATFORMS: Array<{ key: Platform; label: string; icon: ElementType }> = [
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'twitter', label: 'X / Twitter', icon: Twitter },
  { key: 'instagram', label: 'Instagram', icon: Share2 },
];

export function SocialPostsPanel({ guest }: SocialPostsPanelProps) {
  const [state, setState] = useState<PanelState>('idle');
  const [posts, setPosts] = useState<SocialPosts | null>(null);
  const [activePlatform, setActivePlatform] = useState<Platform>('linkedin');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setState('generating');
    setPosts(null);
    await new Promise((r) => setTimeout(r, 1600));
    setPosts(generateMockPosts(guest));
    setState('done');
  };

  const handleCopy = async () => {
    if (!posts) return;
    const text =
      activePlatform === 'linkedin'
        ? posts.linkedin
        : activePlatform === 'twitter'
        ? posts.twitter.join('\n\n—\n\n')
        : posts.instagram;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    const label = PLATFORMS.find((p) => p.key === activePlatform)?.label ?? 'Post';
    toast.success(`${label} post copied!`);
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
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center">
              <Share2 className="h-7 w-7 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Social Posts</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                LinkedIn post, Twitter/X thread, and Instagram caption — ready to publish.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleGenerate}
              className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Sparkles className="h-4 w-4" />
              Generate Posts
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
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">Writing posts...</p>
              <p className="text-xs text-slate-400 mt-1">LinkedIn + Twitter + Instagram, one shot</p>
            </div>
            <div className="w-full space-y-2 px-2">
              {[100, 75, 85, 60, 90].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded-full bg-slate-100 overflow-hidden"
                  style={{ width: `${w}%` }}
                >
                  <div className="h-full w-full animate-shimmer bg-gradient-to-r from-slate-100 via-emerald-100 to-slate-100" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {state === 'done' && posts && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col"
          >
            {/* Platform tabs */}
            <div className="flex gap-1 mb-3">
              {PLATFORMS.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.key}
                    onClick={() => { setActivePlatform(p.key); setCopied(false); }}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium transition-colors border',
                      activePlatform === p.key
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Post content */}
            <div className="flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 min-h-0">
              {activePlatform === 'linkedin' && (
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {posts.linkedin}
                </p>
              )}

              {activePlatform === 'twitter' && (
                <div className="space-y-2">
                  {posts.twitter.map((tweet, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="rounded-lg bg-white border border-slate-200 p-2.5"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                          Tweet {i + 1}/{posts.twitter.length}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {tweet.length} chars
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{tweet}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {activePlatform === 'instagram' && (
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {posts.instagram}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
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
                {copied ? 'Copied!' : 'Copy post'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
