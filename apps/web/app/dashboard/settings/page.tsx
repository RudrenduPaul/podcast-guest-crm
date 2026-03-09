'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Radio, Sparkles, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GuestAvatar } from '@/components/ui/avatar';
import { seedWorkspace, seedWorkspaceMembers } from '@/lib/mock-data';

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-0.5">Workspace configuration</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1.5">
          <Lock className="h-3 w-3" />
          Read-only in Demo
        </Badge>
      </div>

      {/* Workspace info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-base">Workspace</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500">Show Name</label>
                <p className="text-sm font-semibold text-slate-900 mt-1">{seedWorkspace.showName}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Plan</label>
                <p className="mt-1">
                  <Badge variant="default" className="capitalize">{seedWorkspace.plan}</Badge>
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-500">Description</label>
                <p className="text-sm text-slate-700 mt-1">{seedWorkspace.showDescription}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-500">Show Topics</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {seedWorkspace.showTopics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-brand-50 border border-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team members */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-base">Team Members</CardTitle>
            </div>
            <CardDescription>{seedWorkspaceMembers.length} members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {seedWorkspaceMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <GuestAvatar name={member.name} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={member.role === 'owner' ? 'default' : member.role === 'editor' ? 'secondary' : 'outline'}
                    className="capitalize"
                  >
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Configuration */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-base">AI Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-900">AI Model</p>
                <p className="text-xs text-slate-500">claude-sonnet-4-6 by Anthropic</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-900">Outreach AI</p>
                <p className="text-xs text-slate-500">Auto-draft personalized outreach emails</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-900">Fit Scoring</p>
                <p className="text-xs text-slate-500">AI-powered guest match scoring</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-medium text-slate-900">Interview Briefs</p>
                <p className="text-xs text-slate-500">Pre-recording AI preparation</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Enabled</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-base">Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Authentication', desc: 'Supabase JWT (mocked in dev)', status: 'Active' },
              { label: 'Rate Limiting', desc: '100 requests/min per IP', status: 'Active' },
              { label: 'Input Validation', desc: 'Zod schema validation on all inputs', status: 'Active' },
              { label: 'CSP Headers', desc: 'Content Security Policy enabled', status: 'Active' },
              { label: 'Row Level Security', desc: 'Workspace-scoped data isolation', status: 'Ready' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Badge
                  variant={item.status === 'Active' ? undefined : 'secondary'}
                  className={item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : ''}
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
