import {
  generateOutreachEmail,
  generateInterviewBrief,
  generateSocialPosts,
  researchGuest,
  generateFollowUpSequence,
  streamOutreachEmail,
} from '@podcast-crm/ai';
import type { Guest } from '@podcast-crm/types';

export { streamOutreachEmail };

export const aiService = {
  async draftOutreachEmail(
    guest: Guest,
    options: {
      showName: string;
      showDescription: string;
      hostName: string;
      episodeAngle?: string;
      recentWork?: string;
      audienceSize?: string;
      recentGuests?: string[];
    }
  ) {
    return generateOutreachEmail({
      guest,
      ...options,
    });
  },

  async generateInterviewBrief(
    guest: Guest,
    options: {
      showName: string;
      hostName: string;
      audienceDescription: string;
      hostNotes?: string;
    }
  ) {
    return generateInterviewBrief({
      guest,
      ...options,
    });
  },

  async generateSocialPosts(
    guest: Guest,
    options: {
      episodeTitle: string;
      episodeNumber: number;
      keyInsights: string[];
      podcastUrl?: string;
      showName: string;
    }
  ) {
    return generateSocialPosts({
      guest,
      ...options,
    });
  },

  async scoreFit(
    guest: Pick<Guest, 'name' | 'title' | 'company' | 'bio' | 'linkedinUrl' | 'websiteUrl'>,
    showContext: { topics: string[]; audienceDescription: string }
  ) {
    return researchGuest({
      name: guest.name,
      title: guest.title,
      company: guest.company,
      bio: guest.bio,
      linkedinUrl: guest.linkedinUrl,
      websiteUrl: guest.websiteUrl,
      showTopics: showContext.topics,
      audienceDescription: showContext.audienceDescription,
    });
  },

  async generateFollowUpSequence(
    guest: Guest,
    options: {
      showName: string;
      hostName: string;
      originalEmailDate: string;
      originalSubject: string;
    }
  ) {
    return generateFollowUpSequence({
      guest,
      ...options,
    });
  },
};
