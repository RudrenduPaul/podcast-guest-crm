'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Radio, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('rudrendu@signalnoiseshow.com');
  const [password, setPassword] = useState('demo-password');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate auth delay for the demo
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Set mock session cookie
    document.cookie = 'podcast-crm-session=demo-session; path=/; max-age=86400';

    toast.success('Welcome back, Rudrendu!', {
      description: 'Loading your dashboard...',
    });

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Auth panel */}
      <div className="flex w-full max-w-md flex-col justify-center px-8 py-12 lg:px-12">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-lg">
            <Radio className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Podcast Guest CRM</h1>
            <p className="text-xs text-slate-500">AI-native booking platform</p>
          </div>
        </div>

        {/* Demo banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100 p-4"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-4 w-4 text-brand-600" />
            <span className="text-sm font-semibold text-brand-700">Demo Mode</span>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
              No signup required
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Credentials are pre-filled. Click "Sign in" to explore the full app with 30+ mock guests across all pipeline stages.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in to your workspace</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@show.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
            </Button>
          </form>
        </motion.div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Built by{' '}
          <span className="font-semibold text-slate-600">Rudrendu Paul & Sourav Nandy</span>
          {' '}· Developed with Claude Code
        </p>
      </div>

      {/* Right: Brand panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-slate-900 to-brand-950 p-12 text-white">
        <div />
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-4xl font-bold leading-tight">
              Stop losing guests
              <br />
              to the{' '}
              <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
                follow-up black hole.
              </span>
            </p>
            <p className="text-slate-400 text-lg max-w-md">
              The AI-native CRM for podcast hosts who want to grow their guest list without the spreadsheet chaos.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {[
              { label: '6-stage pipeline', desc: 'From discovery to follow-up' },
              { label: 'AI outreach', desc: 'Claude drafts every email' },
              { label: 'Fit scoring', desc: '0-100 AI guest match score' },
              { label: 'Interview briefs', desc: 'Walk in fully prepared' },
            ].map((feature) => (
              <div key={feature.label} className="rounded-lg bg-white/10 p-3">
                <p className="text-sm font-semibold text-white">{feature.label}</p>
                <p className="text-xs text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600">Podcast Guest CRM · Proprietary Software</p>
      </div>
    </div>
  );
}
