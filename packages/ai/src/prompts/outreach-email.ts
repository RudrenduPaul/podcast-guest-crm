import type { Guest } from '@podcast-crm/types';
import { getClaudeClient } from '../client';

export interface OutreachEmailOutput {
  subject: string;
  body: string;
  confidenceScore: number; // 0-100
  reasoning: string;
}

export const OUTREACH_EMAIL_SYSTEM_PROMPT = `You are an expert podcast booking agent helping a podcast host craft personalized, compelling outreach emails to potential guests.

Your emails must:
1. Be authentic, specific, and not generic — reference the guest's actual recent work
2. Clearly state the show's value proposition and audience (size, demographics)
3. Make the ask simple and low-friction
4. Be concise: 150-250 words for the body
5. Have a subject line that is specific, intriguing, and under 70 characters
6. NOT use buzzwords like "passionate", "synergy", "journey", or "touch base"
7. End with a single clear call-to-action

Tone: Warm, professional, confident without being sycophantic. Sound like a real human, not a template.`;

export interface OutreachEmailInput {
  guest: Pick<Guest, 'name' | 'title' | 'company' | 'bio' | 'topics'>;
  showName: string;
  showDescription: string;
  hostName: string;
  episodeAngle?: string;
  recentWork?: string;
  audienceSize?: string;
  recentGuests?: string[];
}

export async function generateOutreachEmail(input: OutreachEmailInput): Promise<OutreachEmailOutput> {
  const client = getClaudeClient();

  const userMessage = `Please write a personalized outreach email for the following guest:

GUEST DETAILS:
- Name: ${input.guest.name}
- Title: ${input.guest.title} at ${input.guest.company}
- Bio: ${input.guest.bio}
- Topics they're known for: ${input.guest.topics.join(', ')}
${input.recentWork ? `- Recent work to reference: ${input.recentWork}` : ''}

SHOW DETAILS:
- Show Name: ${input.showName}
- Description: ${input.showDescription}
- Host: ${input.hostName}
- Audience: ${input.audienceSize ?? '40,000 technical founders and engineers'}
${input.recentGuests && input.recentGuests.length > 0 ? `- Recent Notable Guests: ${input.recentGuests.join(', ')}` : ''}
${input.episodeAngle ? `- Proposed Episode Angle: ${input.episodeAngle}` : ''}

Respond with a JSON object:
{
  "subject": "the email subject line",
  "body": "the full email body",
  "confidenceScore": 85,
  "reasoning": "Why this angle and approach will resonate with this guest"
}`;

  return client.completeJSON<OutreachEmailOutput>(OUTREACH_EMAIL_SYSTEM_PROMPT, userMessage, {
    maxTokens: 1024,
  });
}

// Streaming version for real-time UI updates
export async function* streamOutreachEmail(
  input: OutreachEmailInput
): AsyncGenerator<{ type: 'text_delta' | 'message_stop'; text?: string }> {
  const client = getClaudeClient();

  const streamingPrompt = `${OUTREACH_EMAIL_SYSTEM_PROMPT}\n\nWrite the email directly (subject line first on its own line prefixed with "Subject: ", then the full body). Do not use JSON format for streaming.`;

  const userMessage = `Write a personalized outreach email for:
Name: ${input.guest.name}, ${input.guest.title} at ${input.guest.company}
Bio: ${input.guest.bio}
Topics: ${input.guest.topics.join(', ')}

Show: ${input.showName} — ${input.showDescription}
Host: ${input.hostName}
Audience: ${input.audienceSize ?? '40,000 technical founders and engineers'}
${input.episodeAngle ? `Episode angle: ${input.episodeAngle}` : ''}`;

  yield* client.stream(streamingPrompt, userMessage, { maxTokens: 800 });
}
