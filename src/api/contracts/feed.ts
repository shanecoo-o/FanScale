import type { CursorPage } from './common';
import type { PostSummary } from './posts';

export type FeedCursor = string;
export type FeedItem = PostSummary;
export type FeedResponse = CursorPage<FeedItem>;
