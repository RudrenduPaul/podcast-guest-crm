import { getClaudeClient } from '../client';

export interface GuestResearchOutput {
  fitScore: number; // 0-100
  fitRationale: string;
  topTopics: string[];
  suggestedQuestions: Array<{ question: string; rationale: string }>;
  idealEpisodeAngle: string;
  keyTalkingPoints: string[];
  redFlags: string[];
  audienceResonanceScore: number; // 0-100, how well they'll resonate with a tech-focused audience
  estimatedBookingDifficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  competingShows: string[]; // Shows they've appeared on
}

const GUEST_RESEARCH_SYSTEM_PROMPT = `You are an expert podcast producer and researcher specializing in AI, technology, and startup podcasts.

Your job is to analyze a potential guest and provide a structured research brief that helps a podcast host:
1. Decide whether to pursue this guest (fit score)
2. Understand the best angle for the episode
3. Prepare specific, insightful questions
4. Anticipate challenges

Be realistic — not every guest is a 90+ fit score. Consider:
- Audience relevance (technical founders, engineers, investors)
- Guest's communication style and public speaking experience
- Uniqueness of their perspective vs. what's already available
- Booking difficulty (A-listers are harder to get)

Always output valid JSON matching the specified schema exactly.`;

export interface GuestResearchInput {
  name: string;
  title: string;
  company: string;
  bio?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  showTopics: string[];
  audienceDescription: string;
}

export async function researchGuest(input: GuestResearchInput): Promise<GuestResearchOutput> {
  const client = getClaudeClient();

  const userMessage = `Research and evaluate this potential podcast guest:

GUEST:
Name: ${input.name}
Title: ${input.title} at ${input.company}
${input.bio ? `Bio: ${input.bio}` : ''}
${input.linkedinUrl ? `LinkedIn: ${input.linkedinUrl}` : ''}
${input.websiteUrl ? `Website: ${input.websiteUrl}` : ''}

SHOW CONTEXT:
Topics: ${input.showTopics.join(', ')}
Audience: ${input.audienceDescription}

Return a JSON object with this exact schema:
{
  "fitScore": number (0-100),
  "fitRationale": "1-2 sentences explaining the score",
  "topTopics": ["array of 3-5 topics this guest covers best"],
  "suggestedQuestions": [
    {
      "question": "The actual question text",
      "rationale": "Why this question will yield a great answer"
    }
  ],
  "idealEpisodeAngle": "The specific angle that will make this episode stand out",
  "keyTalkingPoints": ["3-5 key points the guest should cover"],
  "redFlags": ["Any concerns — PR-speak tendency, controversial statements, booking difficulty, etc."],
  "audienceResonanceScore": number (0-100),
  "estimatedBookingDifficulty": "easy|medium|hard|very_hard",
  "competingShows": ["Shows this guest has likely appeared on"]
}`;

  return client.completeJSON<GuestResearchOutput>(GUEST_RESEARCH_SYSTEM_PROMPT, userMessage, {
    maxTokens: 1500,
  });
}
