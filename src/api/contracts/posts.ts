import type { CursorPage, IsoUtcTimestamp, Money, OpaqueId } from './common';
import type { CreatorSummary } from './creators';
import type { ContentAccessDecision } from './entitlements';
import type { MediaAsset } from './media';

export type PostVisibility = 'public' | 'followers' | 'subscribers' | 'ppv';
export type PostPublicationState = 'draft' | 'processing' | 'published' | 'archived';

export interface PostSummary {
  id: OpaqueId;
  creator: CreatorSummary;
  caption: string;
  visibility: PostVisibility;
  publicationState: PostPublicationState;
  media: MediaAsset[];
  access: ContentAccessDecision;
  ppvPrice?: Money;
  likeCount: number;
  commentCount: number;
  viewerLiked: boolean;
  viewerSaved: boolean;
  createdAt: IsoUtcTimestamp;
}

export interface PostDetail extends PostSummary {
  hashtags: string[];
  shareCount: number;
  viewCount: number;
}

export interface CreatePostRequest {
  caption: string;
  visibility: PostVisibility;
  mediaAssetIds: OpaqueId[];
  ppvOfferId?: OpaqueId;
  hashtags: string[];
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> { version: number; }
export interface Like { postId: OpaqueId; liked: boolean; likeCount: number; }
export interface Comment { id: OpaqueId; postId: OpaqueId; body: string; createdAt: IsoUtcTimestamp; }
export interface Save { postId: OpaqueId; saved: boolean; }
export type PostPage = CursorPage<PostSummary>;
