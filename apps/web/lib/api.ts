import type { Guest, GuestLifecycleStage, AnalyticsOverview } from '@podcast-crm/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const MOCK_TOKEN = 'dev-mock-token';

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${MOCK_TOKEN}`,
    ...options.headers,
  };

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch {
    // API server is not running — fall back to mock data
    throw new ApiError('API server unavailable. Running on mock data.', 503);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      (errorBody as { message?: string }).message ?? `HTTP ${response.status}`,
      response.status,
      errorBody
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  guests: {
    async list(params?: {
      page?: number;
      limit?: number;
      stage?: string;
      priority?: string;
      search?: string;
    }) {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.stage) query.set('stage', params.stage);
      if (params?.priority) query.set('priority', params.priority);
      if (params?.search) query.set('search', params.search);

      return apiRequest<{ data: Guest[]; meta: { total: number; page: number; limit: number } }>(
        `/api/v1/guests?${query.toString()}`
      );
    },

    async getById(id: string) {
      return apiRequest<{ data: Guest }>(`/api/v1/guests/${id}`);
    },

    async create(data: Partial<Guest>) {
      return apiRequest<{ data: Guest }>('/api/v1/guests', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id: string, data: Partial<Guest>) {
      return apiRequest<{ data: Guest }>(`/api/v1/guests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async transitionStage(id: string, stage: GuestLifecycleStage, reason?: string) {
      return apiRequest<{ data: Guest }>(`/api/v1/guests/${id}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ stage, reason }),
      });
    },

    async delete(id: string) {
      return apiRequest<void>(`/api/v1/guests/${id}`, { method: 'DELETE' });
    },
  },

  outreach: {
    async draft(guestId: string, options?: { episodeAngle?: string; recentWork?: string }) {
      return apiRequest<{
        data: { subject: string; body: string; confidenceScore: number; reasoning: string };
      }>('/api/v1/outreach/draft', {
        method: 'POST',
        body: JSON.stringify({ guestId, ...options }),
      });
    },

    async send(guestId: string, subject: string, body: string) {
      return apiRequest<{ data: unknown }>('/api/v1/outreach/send', {
        method: 'POST',
        body: JSON.stringify({ guestId, subject, body }),
      });
    },

    async getHistory(guestId: string) {
      return apiRequest<{ data: unknown[] }>(`/api/v1/outreach/${guestId}`);
    },
  },

  ai: {
    async getFitScore(guestId: string) {
      return apiRequest<{ data: unknown }>('/api/v1/ai/fit-score', {
        method: 'POST',
        body: JSON.stringify({ guestId }),
      });
    },

    async getInterviewBrief(guestId: string, hostNotes?: string) {
      return apiRequest<{ data: unknown }>('/api/v1/ai/interview-brief', {
        method: 'POST',
        body: JSON.stringify({ guestId, hostNotes }),
      });
    },

    async getSocialPosts(
      guestId: string,
      keyInsights: string[],
      options?: { episodeTitle?: string; episodeNumber?: number; podcastUrl?: string }
    ) {
      return apiRequest<{ data: unknown }>('/api/v1/ai/social-post', {
        method: 'POST',
        body: JSON.stringify({ guestId, keyInsights, ...options }),
      });
    },
  },

  analytics: {
    async getOverview() {
      return apiRequest<{ data: AnalyticsOverview }>('/api/v1/analytics/overview');
    },

    async getPipeline() {
      return apiRequest<{
        data: { funnel: unknown[]; outreachTimeline: unknown[]; topicsBreakdown: unknown[] };
      }>('/api/v1/analytics/pipeline');
    },
  },
};
