export { ClaudeClient, getClaudeClient } from './client';
export type { ClaudeResponse, TokenUsage, ClaudeStreamChunk } from './client';

export { generateOutreachEmail, streamOutreachEmail } from './prompts/outreach-email';
export type { OutreachEmailInput, OutreachEmailOutput } from './prompts/outreach-email';

export { researchGuest } from './prompts/guest-research';
export type { GuestResearchInput, GuestResearchOutput } from './prompts/guest-research';

export { generateInterviewBrief } from './prompts/interview-brief';
export type { InterviewBriefInput, InterviewBriefOutput } from './prompts/interview-brief';

export { extractTopicTags } from './prompts/topic-tagging';
export type { TopicTaggingInput, TopicTaggingOutput } from './prompts/topic-tagging';

export { generateFollowUpSequence } from './prompts/follow-up-sequence';
export type { FollowUpSequenceInput, FollowUpSequenceOutput } from './prompts/follow-up-sequence';

export { generateSocialPosts } from './prompts/social-post';
export type { SocialPostInput, SocialPostOutput } from './prompts/social-post';
