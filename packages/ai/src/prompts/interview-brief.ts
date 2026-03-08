import type { Guest } from '@podcast-crm/types';
import { getClaudeClient } from '../client';

export interface InterviewBriefOutput {
  bioSummary: string; // 2-3 sentence intro for the host to read
  episodeAngle: string; // The core narrative thread
  questions: Array<{
    question: string;
    followUps: string[];
    expectedInsight: string;
    type: 'opener' | 'core' | 'pivot' | 'closer';
  }>;
  keyTalkingPoints: string[];
  thingsToAvoid: string[];
  controversyFlags: string[];
  closingHook: string; // A suggested memorable closing question
  estimatedDuration: string;
}

const INTERVIEW_BRIEF_SYSTEM_PROMPT = `You are a world-class podcast producer preparing a comprehensive pre-recording brief for a host.

Your briefs are used by top podcast hosts to walk into recordings fully prepared. They are:
- Specific to the guest's actual work (not generic)
- Opinionated about the best angle to take
- Honest about controversial or difficult territory
- Structured to flow naturally across a 45-60 minute conversation

The best podcast episodes have a narrative arc: opening hook → core insight → personal moment → forward-looking thesis → memorable close.

Always output valid JSON.`;

export interface InterviewBriefInput {
  guest: Pick<Guest, 'name' | 'title' | 'company' | 'bio' | 'topics' | 'episodeTitle'>;
  showName: string;
  hostName: string;
  audienceDescription: string;
  hostNotes?: string;
}

export async function generateInterviewBrief(input: InterviewBriefInput): Promise<InterviewBriefOutput> {
  const client = getClaudeClient();

  const userMessage = `Create a comprehensive pre-recording interview brief for:

GUEST: ${input.guest.name}
TITLE: ${input.guest.title} at ${input.guest.company}
BIO: ${input.guest.bio}
TOPICS: ${input.guest.topics.join(', ')}
EPISODE WORKING TITLE: ${input.guest.episodeTitle ?? 'TBD'}

SHOW: ${input.showName}
HOST: ${input.hostName}
AUDIENCE: ${input.audienceDescription}
${input.hostNotes ? `HOST NOTES: ${input.hostNotes}` : ''}

Return a JSON object:
{
  "bioSummary": "2-3 sentence intro for host to read on air",
  "episodeAngle": "The specific narrative angle that will make this episode memorable",
  "questions": [
    {
      "question": "The main question text",
      "followUps": ["Follow-up 1", "Follow-up 2"],
      "expectedInsight": "What great answer this question should unlock",
      "type": "opener|core|pivot|closer"
    }
  ],
  "keyTalkingPoints": ["5 points the conversation should hit"],
  "thingsToAvoid": ["Topics or framings to avoid with this guest"],
  "controversyFlags": ["Potentially sensitive areas to navigate carefully"],
  "closingHook": "A memorable closing question unique to this guest",
  "estimatedDuration": "e.g., 45-55 minutes"
}`;

  return client.completeJSON<InterviewBriefOutput>(INTERVIEW_BRIEF_SYSTEM_PROMPT, userMessage, {
    maxTokens: 2000,
  });
}
