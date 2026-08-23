import type { IsoUtcTimestamp, OpaqueId } from './common';
import type { CurrentUser } from './users';

export interface RegisterRequest {
  email?: string;
  phone?: string;
  password: string;
  displayName: string;
  username: string;
  requestedAccountType: 'fan' | 'creator';
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface AuthSession {
  id: OpaqueId;
  user: CurrentUser;
  expiresAt: IsoUtcTimestamp;
  assuranceLevel: 'standard' | 'step_up';
}

export interface RefreshSessionRequest { refreshToken?: string; }
export interface VerifyContactRequest { challengeId: OpaqueId; code: string; }
export interface PasswordRecoveryRequest { identifier: string; }
export interface PasswordRecoveryConfirmRequest { challengeId: OpaqueId; code: string; newPassword: string; }

export interface SessionDevice {
  id: OpaqueId;
  label: string;
  current: boolean;
  createdAt: IsoUtcTimestamp;
  lastSeenAt: IsoUtcTimestamp;
}
