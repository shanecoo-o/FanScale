import type { CursorPage, IsoUtcTimestamp, OpaqueId } from './common';

export type NotificationType = 'subscription' | 'like' | 'comment' | 'follow' | 'tip' | 'payout' | 'ppv_purchase' | 'system';

export interface Notification {
  id: OpaqueId;
  type: NotificationType;
  actorId?: OpaqueId;
  resourceId?: OpaqueId;
  message: string;
  readAt: IsoUtcTimestamp | null;
  createdAt: IsoUtcTimestamp;
}

export interface NotificationPreferences {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

export type NotificationPage = CursorPage<Notification>;
