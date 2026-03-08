import { getClaudeClient } from '../client';

export interface TopicTaggingOutput {
  topics: string[];
  primaryCategory: string;
  confidence: number; // 0-100
}

const TOPIC_TAGGING_SYSTEM_PROMPT = `You are an expert content categorization system for a technology and business podcast.

Your job is to extract the most relevant topic tags from a guest's bio or LinkedIn description.

Topic tags should:
- Be 2-4 words maximum
- Be specific enough to be useful (not "technology" but "AI safety")
- Match vocabulary that podcast listeners would search for
- Include both domain topics (e.g., "machine learning") and role topics (e.g., "startup founder")
- Maximum 8 tags, minimum 3

Always output valid JSON.`;

export interface TopicTaggingInput {
  bioText: string;
  name: string;
  title: string;
  company: string;
}

export async function extractTopicTags(input: TopicTaggingInput): Promise<TopicTaggingOutput> {
  const client = getClaudeClient();

  const userMessage = `Extract topic tags for this podcast guest:

Name: ${input.name}
Title: ${input.title} at ${input.company}
Bio: ${input.bioText}

Return JSON:
{
  "topics": ["array of 3-8 specific topic tags"],
  "primaryCategory": "The single most important category (e.g., 'AI Research', 'VC & Investing')",
  "confidence": number (0-100, how confident you are in these tags)
}`;

  return client.completeJSON<TopicTaggingOutput>(TOPIC_TAGGING_SYSTEM_PROMPT, userMessage, {
    maxTokens: 300,
  });
}
