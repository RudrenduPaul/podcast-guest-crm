import type { Guest } from '@podcast-crm/types';
import { getClaudeClient } from '../client';

export interface SocialPostOutput {
  linkedin: {
    post: string;
    hashtags: string[];
    characterCount: number;
  };
  twitter: {
    thread: string[]; // Array of tweets for a thread
    singleTweet: string; // Single tweet version
    characterCount: number;
  };
  instagramCaption: string;
  keyQuote: string; // Best pull quote from the episode
}

const SOCIAL_POST_SYSTEM_PROMPT = `You are an expert social media strategist for a top technology podcast.

Your posts must:
- LinkedIn: 150-300 words, story-driven, 3-5 key insights, conversational, end with a question
- Twitter thread: 5-7 tweets, hook in tweet 1, each tweet standalone but part of a narrative
- Twitter single: Under 280 characters, must include a hook and clear value prop
- Instagram caption: 50-100 words, emoji-friendly, 3-5 hashtags
- Key quote: The single most memorable/shareable thing the guest said (or would say)

Never use "excited to share" or "had an amazing conversation". Be specific, not generic.
Reference actual details from the guest and their work.

Always output valid JSON.`;

export interface SocialPostInput {
  guest: Pick<Guest, 'name' | 'title' | 'company' | 'bio' | 'topics' | 'twitterHandle'>;
  episodeTitle: string;
  episodeNumber: number;
  keyInsights: string[];
  podcastUrl?: string;
  showName: string;
}

export async function generateSocialPosts(input: SocialPostInput): Promise<SocialPostOutput> {
  const client = getClaudeClient();

  const userMessage = `Create social media posts for this podcast episode:

GUEST: ${input.guest.name}, ${input.guest.title} at ${input.guest.company}
GUEST TWITTER: ${input.guest.twitterHandle ? `@${input.guest.twitterHandle}` : 'unknown'}
EPISODE: #${input.episodeNumber} — ${input.episodeTitle}
SHOW: ${input.showName}
${input.podcastUrl ? `EPISODE URL: ${input.podcastUrl}` : ''}

KEY INSIGHTS FROM THE EPISODE:
${input.keyInsights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

GUEST TOPICS: ${input.guest.topics.join(', ')}

Return JSON:
{
  "linkedin": {
    "post": "Full LinkedIn post text",
    "hashtags": ["hashtag1", "hashtag2"],
    "characterCount": number
  },
  "twitter": {
    "thread": ["Tweet 1 text", "Tweet 2 text", "...up to 7 tweets"],
    "singleTweet": "Single tweet under 280 chars",
    "characterCount": number (for single tweet)
  },
  "instagramCaption": "Instagram caption with emojis",
  "keyQuote": "The most memorable quote from the episode"
}`;

  return client.completeJSON<SocialPostOutput>(SOCIAL_POST_SYSTEM_PROMPT, userMessage, {
    maxTokens: 1500,
  });
}
