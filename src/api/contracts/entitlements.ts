import type { IsoUtcTimestamp, OpaqueId } from './common';
import type { MediaAccess } from './media';

export type EntitlementState = 'not_entitled' | 'pending' | 'active' | 'expired' | 'revoked';

export interface ContentAccessDecision {
  resourceId: OpaqueId;
  allowed: boolean;
  entitlementState: EntitlementState;
  reasonCode: string;
  expiresAt?: IsoUtcTimestamp;
}

export interface MediaAccessResponse {
  decision: ContentAccessDecision;
  media: MediaAccess | null;
}
