import type { Guest } from '@podcast-crm/types';
import { getClaudeClient } from '../client';

export interface FollowUpEmail {
  subject: string;
  body: string;
  sendAfterDays: number;
  tone: 'friendly_bump' | 'firm_follow_up' | 'final_attempt';
  reasoning: string;
}

export interface FollowUpSequenceOutput {
  emails: [FollowUpEmail, FollowUpEmail, FollowUpEmail]; // Always 3 emails
  sequenceStrategy: string;
}

const FOLLOW_UP_SYSTEM_PROMPT = `You are an expert podcast booking agent writing follow-up sequences for guests who haven't replied.

The sequence must:
1. Email 1 (Friendly Bump): Warm, adds value, assumes positive intent — send 5 days after initial
2. Email 2 (Firm Follow-up): Direct, slightly more assertive, includes social proof — send 12 days after initial
3. Email 3 (Final Attempt): Brief, respectful, closes the loop gracefully — send 20 days after initial

Rules:
- Never guilt-trip or pressure
- Each email must be shorter than the previous
- Reference the original pitch (don't re-explain everything)
- Email 3 should make it easy to re-engage in future even if declining now
- Never use "just following up" as an opener

Always output valid JSON.`;

export interface FollowUpSequenceInput {
  guest: Pick<Guest, 'name' | 'title' | 'company' | 'bio' | 'topics'>;
  showName: string;
  hostName: string;
  originalEmailDate: string;
  originalSubject: string;
}

export async function generateFollowUpSequence(
  input: FollowUpSequenceInput
): Promise<FollowUpSequenceOutput> {
  const client = getClaudeClient();

  const userMessage = `Generate a 3-email follow-up sequence for a guest who hasn't replied to our podcast outreach:

GUEST: ${input.guest.name}, ${input.guest.title} at ${input.guest.company}
SHOW: ${input.showName}
HOST: ${input.hostName}
ORIGINAL EMAIL SENT: ${input.originalEmailDate}
ORIGINAL SUBJECT: ${input.originalSubject}
GUEST'S EXPERTISE: ${input.guest.topics.join(', ')}

Return JSON:
{
  "emails": [
    {
      "subject": "string",
      "body": "string",
      "sendAfterDays": 5,
      "tone": "friendly_bump",
      "reasoning": "Why this approach"
    },
    {
      "subject": "string",
      "body": "string",
      "sendAfterDays": 12,
      "tone": "firm_follow_up",
      "reasoning": "Why this approach"
    },
    {
      "subject": "string",
      "body": "string",
      "sendAfterDays": 20,
      "tone": "final_attempt",
      "reasoning": "Why this approach"
    }
  ],
  "sequenceStrategy": "Overall rationale for the sequence approach"
}`;

  return client.completeJSON<FollowUpSequenceOutput>(FOLLOW_UP_SYSTEM_PROMPT, userMessage, {
    maxTokens: 2000,
  });
}
