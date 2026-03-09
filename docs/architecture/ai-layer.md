# AI Layer Architecture

## Overview

The AI layer (`packages/ai`) wraps the Anthropic Claude API and exposes six specialized prompt modules. All AI features use `claude-sonnet-4-6` — the most capable Claude model available.

## Client Design

`packages/ai/src/client.ts` provides two calling modes:

1. **`complete()`**: Standard request/response for JSON-structured outputs
2. **`stream()`**: Streaming for real-time typewriter UI effects
3. **`completeJSON<T>()`**: Typed JSON output with automatic markdown stripping and parse error handling

### Retry Logic
- Retries on 429 (rate limit) and 5xx errors
- Exponential backoff: 1s, 2s, 4s
- Maximum 3 attempts before surfacing error to caller

## Prompt Modules

### 1. Outreach Email (`prompts/outreach-email.ts`)
- **Mode**: JSON + Streaming
- **Input**: Guest profile, show details, episode angle
- **Output**: `{ subject, body, confidenceScore, reasoning }`
- **Token budget**: 800-1024 output tokens
- **Streaming version**: For real-time typewriter effect in UI

### 2. Guest Research (`prompts/guest-research.ts`)
- **Mode**: JSON only
- **Input**: Guest name, title, company, bio, show context
- **Output**: Fit score (0-100), top topics, interview questions, red flags, episode angle
- **Token budget**: 1500 output tokens

### 3. Interview Brief (`prompts/interview-brief.ts`)
- **Mode**: JSON only
- **Input**: Full guest profile + host notes
- **Output**: Bio summary, 5 typed questions with follow-ups, controversy flags, closing hook
- **Token budget**: 2000 output tokens

### 4. Topic Tagging (`prompts/topic-tagging.ts`)
- **Mode**: JSON only
- **Input**: Guest bio text
- **Output**: Array of 3-8 topic tags, primary category, confidence score
- **Token budget**: 300 output tokens

### 5. Follow-up Sequence (`prompts/follow-up-sequence.ts`)
- **Mode**: JSON only
- **Input**: Guest profile, show info, original email context
- **Output**: 3-email sequence (friendly bump → firm follow-up → final attempt)
- **Token budget**: 2000 output tokens

### 6. Social Posts (`prompts/social-post.ts`)
- **Mode**: JSON only
- **Input**: Guest, episode details, key insights
- **Output**: LinkedIn post, Twitter thread (5-7 tweets), Instagram caption, key quote
- **Token budget**: 1500 output tokens

## Structured Output Strategy

claude-sonnet-4-6 is instructed to return raw JSON (no markdown blocks) via an explicit system prompt instruction. The `completeJSON<T>()` method:
1. Appends JSON-only instruction to system prompt
2. Strips any accidental markdown code fences
3. Parses and returns as typed `T`
4. Throws descriptive error on parse failure

## Streaming

The streaming outreach email uses Server-Sent Events via the `@anthropic-ai/sdk` stream API. The frontend `AIAssistPanel` simulates streaming for the JSON-mode responses using a typewriter `useState + setTimeout` pattern for UX consistency.

## Evaluation Approach (Production Roadmap)

- Log all prompts, responses, and token usage to analytics
- A/B test prompt variants for outreach email quality
- Human review queue for fit scores below 60 or above 95
- Reply rate as the ultimate ground truth for outreach quality
