import type { IsoUtcTimestamp, Money, OpaqueId } from './common';
import type { KycReviewCase } from './kyc';
import type { ModerationCase } from './moderation';
import type { PayoutStatus } from './payouts';

export interface AdminUserSummary { id: OpaqueId; displayName: string; accountStatus: string; roles: string[]; }
export interface AdminCreatorReview { creatorId: OpaqueId; publicName: string; verificationState: string; }
export type AdminKycCase = KycReviewCase;
export type AdminReportCase = ModerationCase;
export interface AdminPayoutCase { payoutId: OpaqueId; creatorId: OpaqueId; amount: Money; status: PayoutStatus; }
export interface AdminTransactionSummary { transactionId: OpaqueId; amount: Money; status: string; }
export interface AuditLogEntry { id: OpaqueId; actorId: OpaqueId; action: string; resourceType: string; resourceId: OpaqueId; correlationId: string; occurredAt: IsoUtcTimestamp; }
