import type { Money, OpaqueId } from './common';
import type { PublicProfile } from './users';

export type CreatorVerificationState = 'not_started' | 'pending' | 'approved' | 'rejected';

export interface CreatorPricing {
  monthlySubscription: Money;
  quarterlySubscription: Money;
  offerVersion: string;
}

export interface CreatorSummary extends PublicProfile {
  category: string;
  verified: boolean;
  followersCount: number;
  subscriberCount: number;
  viewerFollows: boolean;
  viewerSubscribes: boolean;
}

export interface CreatorPublicProfile extends CreatorSummary {
  coverUrl: string | null;
  postCount: number;
  pricing: CreatorPricing;
  ratingAverage: number | null;
  ratingCount: number;
}

export interface CreatorPrivateProfile {
  creatorId: OpaqueId;
  verificationState: CreatorVerificationState;
  payoutEligible: boolean;
  editableCategory: string;
}

export interface CreatorAnalyticsSummary {
  creatorId: OpaqueId;
  views: number;
  followers: number;
  subscribers: number;
  grossRevenue: Money;
}
