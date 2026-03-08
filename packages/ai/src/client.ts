import Anthropic from '@anthropic-ai/sdk';
import { parseServerEnv } from '@podcast-crm/config';

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface ClaudeResponse {
  text: string;
  usage: TokenUsage;
  model: string;
  stopReason: string | null;
}

export interface ClaudeStreamChunk {
  type: 'text_delta' | 'message_stop';
  text?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof Anthropic.APIError) {
    return error.status === 429 || error.status >= 500;
  }
  return false;
}

export class ClaudeClient {
  private readonly client: Anthropic;
  private readonly model = 'claude-sonnet-4-6';

  constructor() {
    const env = parseServerEnv();
    this.client = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });
  }

  async complete(
    systemPrompt: string,
    userMessage: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<ClaudeResponse> {
    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await this.client.messages.create({
          model: this.model,
          max_tokens: options?.maxTokens ?? 2048,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        });

        const textContent = response.content.find((block) => block.type === 'text');
        const text = textContent?.type === 'text' ? textContent.text : '';

        return {
          text,
          usage: {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
            totalTokens: response.usage.input_tokens + response.usage.output_tokens,
          },
          model: response.model,
          stopReason: response.stop_reason,
        };
      } catch (error) {
        lastError = error;

        if (!isRetryableError(error) || attempt === MAX_RETRIES - 1) {
          throw error;
        }

        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
      }
    }

    throw lastError;
  }

  async *stream(
    systemPrompt: string,
    userMessage: string,
    options?: {
      maxTokens?: number;
    }
  ): AsyncGenerator<ClaudeStreamChunk> {
    const stream = await this.client.messages.stream({
      model: this.model,
      max_tokens: options?.maxTokens ?? 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield { type: 'text_delta', text: event.delta.text };
      } else if (event.type === 'message_stop') {
        yield { type: 'message_stop' };
      }
    }
  }

  async completeJSON<T>(
    systemPrompt: string,
    userMessage: string,
    options?: { maxTokens?: number }
  ): Promise<T> {
    const jsonSystemPrompt = `${systemPrompt}\n\nIMPORTANT: You MUST respond with valid JSON only. No markdown, no explanation, no code blocks. Just the raw JSON object.`;

    const response = await this.complete(jsonSystemPrompt, userMessage, options);

    try {
      // Strip any accidental markdown code blocks
      const cleaned = response.text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
      return JSON.parse(cleaned) as T;
    } catch {
      throw new Error(`Claude returned invalid JSON: ${response.text.substring(0, 200)}`);
    }
  }
}

// Singleton instance for server-side use
let clientInstance: ClaudeClient | null = null;

export function getClaudeClient(): ClaudeClient {
  if (!clientInstance) {
    clientInstance = new ClaudeClient();
  }
  return clientInstance;
}
