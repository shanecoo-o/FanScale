import type { IsoUtcTimestamp, Money, OpaqueId } from './common';

export type PaymentStatus = 'requires_action' | 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
export type PaymentProvider = 'mpesa' | 'emola' | 'mkesh' | 'card';
export type PaymentPurpose = 'wallet_deposit' | 'subscription' | 'ppv' | 'tip';

export interface PaymentIntent {
  id: OpaqueId;
  amount: Money;
  purpose: PaymentPurpose;
  status: PaymentStatus;
  provider: PaymentProvider;
  clientAction?: { type: 'redirect' | 'provider_prompt'; url?: string };
  expiresAt: IsoUtcTimestamp;
}

export interface Payment {
  id: OpaqueId;
  intentId: OpaqueId;
  amount: Money;
  status: PaymentStatus;
  provider: PaymentProvider;
  createdAt: IsoUtcTimestamp;
}

export interface CreatePaymentIntentRequest {
  purpose: PaymentPurpose;
  resourceId?: OpaqueId;
  offerId?: OpaqueId;
  provider: PaymentProvider;
}

export interface TipIntent { creatorId: OpaqueId; amount: Money; message?: string; }
export interface TipTransaction { id: OpaqueId; paymentIntentId: OpaqueId; status: PaymentStatus; amount: Money; }
