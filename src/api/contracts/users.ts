import type { IsoUtcTimestamp, OpaqueId } from './common';

export type UserRole = 'fan' | 'creator' | 'admin';

export interface UserSummary {
  id: OpaqueId;
  displayName: string;
  username: string;
  avatarUrl: string | null;
}

export interface PublicProfile extends UserSummary {
  bio: string | null;
  location: string | null;
}

export interface CurrentUser extends PublicProfile {
  roles: UserRole[];
  contactVerified: boolean;
  accountStatus: 'active' | 'restricted' | 'suspended';
  createdAt: IsoUtcTimestamp;
}

export interface UserSettings {
  locale: string;
  timezone: string;
  reducedData: boolean;
}
