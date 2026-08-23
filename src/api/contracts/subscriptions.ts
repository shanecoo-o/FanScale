import type { IsoUtcTimestamp, Money, OpaqueId } from './common';
import type { EntitlementState } from './entitlements';

export type SubscriptionStatus = 'pending' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'refunded';

export interface SubscriptionPlan {
  id: OpaqueId;
  creatorId: OpaqueId;
  interval: 'monthly' | 'quarterly';
  price: Money;
  version: string;
}

export interface Subscription {
  id: OpaqueId;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  entitlementState: EntitlementState;
  currentPeriodEnd?: IsoUtcTimestamp;
}

export interface CreateSubscriptionCheckoutRequest { planId: OpaqueId; planVersion: string; }
export interface SubscriptionCheckoutResponse { subscription: Subscription; paymentIntentId: OpaqueId; }
export interface CancelSubscriptionRequest { reason?: string; }

export interface PPVOffer { id: OpaqueId; resourceId: OpaqueId; price: Money; version: string; }
export interface PPVUnlockRequest { offerId: OpaqueId; offerVersion: string; }
export interface PPVUnlockResponse { paymentIntentId: OpaqueId; entitlementState: EntitlementState; }
