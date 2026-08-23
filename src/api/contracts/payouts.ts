import type { IsoUtcTimestamp, Money, OpaqueId } from './common';

export type PayoutStatus = 'pending' | 'review' | 'processing' | 'paid' | 'failed' | 'rejected';
export interface PayoutRequest { amount: Money; destinationId: OpaqueId; }
export interface Payout { id: OpaqueId; amount: Money; status: PayoutStatus; requestedAt: IsoUtcTimestamp; }
