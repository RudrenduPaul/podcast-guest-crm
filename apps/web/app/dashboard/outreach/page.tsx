'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AIAssistPanel } from '@/components/outreach/AIAssistPanel';
import { seedGuests } from '@/lib/mock-data';
import { STAGE_CONFIG } from '@/lib/utils';
import type { Guest, GuestLifecycleStage } from '@podcast-crm/types';

export default function OutreachPage() {
  const [search, setSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const filteredGuests = search
    ? seedGuests.filter(
        (g) =>
          g.name.toLowerCase().includes(search.toLowerCase()) ||
          g.company.toLowerCase().includes(search.toLowerCase())
      )
    : seedGuests.filter((g) => g.stage === 'outreach' || g.stage === 'discover');

  const handleEmailGenerated = (generatedSubject: string, generatedBody: string) => {
    setSubject(generatedSubject);
    setBody(generatedBody);
  };

  const handleSend = async () => {
    if (!selectedGuest || !subject || !body) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSending(false);
    toast.success(`Email sent to ${selectedGuest.name}!`, {
      description: `"${subject.substring(0, 50)}..."`,
    });
    setSubject('');
    setBody('');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Outreach</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Select a guest, let Claude draft the email, review and send.
        </p>
      </div>

      <div className="grid grid-cols-[280px_1fr_320px] gap-5 h-[calc(100vh-200px)]">
        {/* Guest selector */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-2 shrink-0">
            <CardTitle className="text-sm">Select Guest</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {filteredGuests.map((guest) => {
                const stageConfig = STAGE_CONFIG[guest.stage];
                return (
                  <button
                    key={guest.id}
                    onClick={() => setSelectedGuest(guest)}
                    className={`w-full flex items-center gap-2.5 rounded-lg p-2.5 text-left transition-all ${
                      selectedGuest?.id === guest.id
                        ? 'bg-brand-50 border border-brand-200'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <GuestAvatar name={guest.name} avatarUrl={guest.avatarUrl} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{guest.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{guest.company}</p>
                    </div>
                    <Badge
                      variant={guest.stage as GuestLifecycleStage}
                      className="text-[9px] px-1.5 py-0 h-4 shrink-0"
                    >
                      {stageConfig.label}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Email composer */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-3 shrink-0 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                {selectedGuest ? `To: ${selectedGuest.name}` : 'Email Composer'}
              </CardTitle>
              {selectedGuest && (
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={!subject || !body || isSending}
                  className="gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isSending ? 'Sending...' : 'Send'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
            {!selectedGuest ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Sparkles className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">Select a guest to start</p>
                <p className="text-xs text-slate-400 mt-1">
                  Pick a guest from the left panel, then Claude will draft a personalized email.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">Subject</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email subject line..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">Body</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your email here, or use Claude to generate it..."
                    className="w-full h-full min-h-[300px] px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* AI Assistant panel */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-0 shrink-0">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <CardTitle className="text-sm">Claude AI</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden pt-4">
            {selectedGuest ? (
              <AIAssistPanel
                guest={selectedGuest}
                onEmailGenerated={handleEmailGenerated}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Sparkles className="h-8 w-8 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">Select a guest to activate AI</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
