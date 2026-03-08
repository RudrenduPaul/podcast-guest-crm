import type { OutreachEmail } from '@podcast-crm/types';
import { WORKSPACE_ID } from './guests.seed';

export const seedOutreachEmails: OutreachEmail[] = [
  // Dr. Sarah Chen — outreach stage (2 emails)
  {
    id: 'email_001',
    guestId: 'guest_007',
    workspaceId: WORKSPACE_ID,
    subject: 'Podcast Invite: AI Safety & The Future of Alignment — Your Research Deserves a Wider Audience',
    body: `Hi Dr. Chen,

I've been following your work on constitutional AI at DeepMind for the past year, and I genuinely think your perspective on alignment is one of the clearest and most nuanced in the field.

I host "The Signal & The Noise" — a podcast for builders, researchers, and investors navigating the AI revolution. Our episodes routinely hit 40,000+ downloads, and our audience skews heavily toward technical founders and senior engineers who are actually building with AI.

Your recent paper on scalable oversight really resonated with our community. The framing around human-AI collaborative evaluation is exactly the kind of rigorous thinking our listeners are hungry for.

Would you be open to a 45-minute conversation? No prep required — I promise to make it worth your time.

Best,
Rudrendu Paul
The Signal & The Noise`,
    generatedByAI: true,
    sentAt: '2026-02-15T10:00:00Z',
    openedAt: '2026-02-16T08:32:00Z',
    status: 'opened',
    createdAt: '2026-02-15T09:30:00Z',
  },
  {
    id: 'email_002',
    guestId: 'guest_007',
    workspaceId: WORKSPACE_ID,
    subject: 'Quick follow-up: The Signal & The Noise',
    body: `Hi Dr. Chen,

Circling back on my note from last week. I know your inbox is probably a warzone, so I'll be brief.

I'd love to have you on to talk about the practical implications of your scalable oversight work — specifically, what it means for the developers building AI products today.

30 minutes, async if you prefer, zero prep required.

Would next month work?

Best,
Rudrendu`,
    generatedByAI: true,
    sentAt: '2026-02-22T10:00:00Z',
    status: 'sent',
    createdAt: '2026-02-22T09:30:00Z',
  },

  // David Kim — outreach stage (1 email, replied)
  {
    id: 'email_003',
    guestId: 'guest_008',
    workspaceId: WORKSPACE_ID,
    subject: 'How Stripe Scaled Engineering: A Conversation for 40,000 Builders',
    body: `Hi David,

You joined Stripe as engineer #12. You're now VP of Engineering with 400+ on your team. That arc is genuinely one of the most compelling scaling stories in tech.

I host "The Signal & The Noise" — we do deep technical + leadership conversations for builders. Recent guests include Kelsey Hightower, Diego Hernandez (LangChain), and Andrej Karpathy.

I'd love to explore: What does engineering leadership look like at Stripe's scale? How do you maintain quality while shipping fast? What do you wish you'd known at engineer #12?

45 minutes, recorded remotely. Drops to 40k+ engineers and technical founders.

Up for it?

Best,
Rudrendu Paul`,
    generatedByAI: true,
    sentAt: '2026-02-18T14:30:00Z',
    openedAt: '2026-02-18T16:00:00Z',
    repliedAt: '2026-02-19T09:15:00Z',
    status: 'replied',
    createdAt: '2026-02-18T14:00:00Z',
  },

  // Lena Fischer — outreach stage (1 email sent via Twitter DM)
  {
    id: 'email_004',
    guestId: 'guest_009',
    workspaceId: WORKSPACE_ID,
    subject: "DM: Would love to have you on The Signal & The Noise (Mistral's open-source story)",
    body: `Hi Lena,

Your thread last week on why open-weight models are strategically underrated was the most clearly argued thing I read all month.

I host a tech podcast — The Signal & The Noise — and I think your perspective on open-source AI and European tech sovereignty is exactly what our audience needs to hear. We've had Diego from LangChain, Kelsey Hightower, and similar technical voices.

45 mins, fully async option available. Interested?`,
    generatedByAI: false,
    sentAt: '2026-02-20T11:00:00Z',
    openedAt: '2026-02-20T14:20:00Z',
    status: 'opened',
    createdAt: '2026-02-20T10:45:00Z',
  },

  // Carlos Mendez — 2 emails
  {
    id: 'email_005',
    guestId: 'guest_010',
    workspaceId: WORKSPACE_ID,
    subject: 'Podcast Invite: 200 SaaS Companies, One Growth Framework',
    body: `Hi Carlos,

Your framework on ICP compression is the most practical thing I've read on B2B growth in two years. I've already shared it with three founders.

I host "The Signal & The Noise" — deep conversations on growth, AI, and building. Our audience: 40k technical founders, operators, and growth leads.

I'd love to have you on to talk through your full-funnel playbook and where AI is actually changing the game (vs. where it's just hype).

Up for a conversation?

Best,
Rudrendu`,
    generatedByAI: true,
    sentAt: '2026-02-15T09:00:00Z',
    openedAt: '2026-02-15T11:30:00Z',
    repliedAt: '2026-02-16T08:00:00Z',
    status: 'replied',
    createdAt: '2026-02-14T22:00:00Z',
  },
  {
    id: 'email_006',
    guestId: 'guest_010',
    workspaceId: WORKSPACE_ID,
    subject: 'Re: Podcast — Dates & Details',
    body: `Hey Carlos,

Great to hear back! Here's what the process looks like:

- 45-minute Riverside recording (I'll send a link)
- No prep required, though I'll send 5 questions in advance if you'd like them
- Drops to 40k listeners, always transcribed + distributed via newsletter

For scheduling, I have availability:
- March 4 at 2pm ET
- March 6 at 11am ET
- March 10 at 3pm ET

Let me know what works. Can't wait to dig into the SaaS growth stories.

Best,
Rudrendu`,
    generatedByAI: false,
    sentAt: '2026-02-25T09:00:00Z',
    openedAt: '2026-02-25T10:15:00Z',
    status: 'opened',
    createdAt: '2026-02-25T08:45:00Z',
  },

  // Alex Rivera — 3 emails, last attempt
  {
    id: 'email_007',
    guestId: 'guest_012',
    workspaceId: WORKSPACE_ID,
    subject: 'Remote-First Leadership for 40,000 Builders — Podcast Invite',
    body: `Hi Alex,

$5M ARR in 18 months with a fully distributed team of 40 across 12 countries. That's not a stat — that's a playbook. And one I know our audience of 40k founders would learn from.

I host "The Signal & The Noise." I'd love to do a dedicated episode on how you've built and managed culture across time zones, hiring without seeing anyone in person, and where async breaks down.

Interested?

Best, Rudrendu`,
    generatedByAI: true,
    sentAt: '2026-01-20T09:00:00Z',
    openedAt: '2026-01-20T11:00:00Z',
    status: 'opened',
    createdAt: '2026-01-20T08:45:00Z',
  },
  {
    id: 'email_008',
    guestId: 'guest_012',
    workspaceId: WORKSPACE_ID,
    subject: 'Follow-up: Remote leadership episode',
    body: `Hi Alex,

Quick follow-up on my note from Jan 20. Totally understand if the timing isn't right — would love to find a window that works for you.

Any month work better?

Best, Rudrendu`,
    generatedByAI: false,
    sentAt: '2026-02-03T09:00:00Z',
    status: 'sent',
    createdAt: '2026-02-03T08:45:00Z',
  },
  {
    id: 'email_009',
    guestId: 'guest_012',
    workspaceId: WORKSPACE_ID,
    subject: 'Last note — The Signal & The Noise',
    body: `Hi Alex,

I'll keep this short. I've reached out twice and I don't want to be a nuisance.

If a podcast conversation ever makes sense, I'd love to make it easy for you. My calendar is always open: https://cal.com/rudrendu

Either way, I'll be following RemoteFirst's journey closely.

Best,
Rudrendu`,
    generatedByAI: false,
    sentAt: '2026-03-01T09:00:00Z',
    status: 'sent',
    createdAt: '2026-03-01T08:45:00Z',
  },

  // Nia Johnson — 1 email
  {
    id: 'email_010',
    guestId: 'guest_011',
    workspaceId: WORKSPACE_ID,
    subject: 'Your Not Boring thesis on AI distribution — a conversation for 40k builders?',
    body: `Hi Nia,

Your piece on AI distribution strategies last month was the best framing I've seen on why most AI startups will lose on go-to-market, not product.

I host "The Signal & The Noise" — we do deep dives on technology strategy for builders and investors. 40k listeners. Recent guests include Lenny Rachitsky, Gergely Orosz, and Priya Sharma.

I think you'd give our audience something genuinely different from what they get in the usual VC/founder show. Your media business perspective plus your technology analysis is a rare combo.

Up for a conversation? I can make it effortless on your end.

Best,
Rudrendu Paul`,
    generatedByAI: true,
    sentAt: '2026-02-28T10:00:00Z',
    status: 'sent',
    createdAt: '2026-02-28T09:30:00Z',
  },
];
