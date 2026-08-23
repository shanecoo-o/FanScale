import type { IsoUtcTimestamp, OpaqueId } from './common';
import type { CreatorVerificationState } from './creators';

export interface KycStatus {
  caseId: OpaqueId;
  state: CreatorVerificationState;
  submittedAt?: IsoUtcTimestamp;
  safeReasonCode?: string;
}

export interface KycSubmissionRequest {
  legalName: string;
  dateOfBirth: string;
  documentType: 'national_id' | 'passport' | 'residence_permit';
  documentAssetIds: OpaqueId[];
  selfieAssetId: OpaqueId;
  consentVersion: string;
  consentAccepted: boolean;
}

export interface KycReviewCase {
  caseId: OpaqueId;
  applicantId: OpaqueId;
  state: CreatorVerificationState;
  redactedLegalName: string;
  submittedAt: IsoUtcTimestamp;
  version: number;
}

export interface KycDecisionRequest { decision: 'approve' | 'reject' | 'request_information'; reasonCode: string; expectedVersion: number; }
