import type { CursorPage, IsoUtcTimestamp, Money, OpaqueId } from './common';
import type { ContentAccessDecision } from './entitlements';
import type { MediaAsset } from './media';
import type { UserSummary } from './users';

export interface MessageAttachment {
  media: MediaAsset;
  access: ContentAccessDecision;
  ppvPrice?: Money;
}

export interface Message {
  id: OpaqueId;
  conversationId: OpaqueId;
  sender: UserSummary;
  sequence: number;
  body?: string;
  attachment?: MessageAttachment;
  sentAt: IsoUtcTimestamp;
}

export interface ConversationSummary {
  id: OpaqueId;
  participant: UserSummary;
  latestMessage?: Message;
  unreadCount: number;
}

export interface Conversation extends ConversationSummary { messages: CursorPage<Message>; }
export interface SendMessageRequest { body?: string; mediaAssetId?: OpaqueId; ppvOfferId?: OpaqueId; }
