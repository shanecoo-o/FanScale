import type { IsoUtcTimestamp, OpaqueId } from './common';

export type MediaProcessingState = 'uploading' | 'processing' | 'ready' | 'failed';
export type MediaAccessClass = 'public' | 'followers' | 'subscriber' | 'ppv' | 'private' | 'kyc';

export interface MediaVariant {
  id: OpaqueId;
  kind: 'thumbnail' | 'preview' | 'image' | 'video' | 'audio';
  url: string;
  expiresAt?: IsoUtcTimestamp;
  width?: number;
  height?: number;
  mimeType: string;
}

export interface MediaPreview {
  variant: MediaVariant;
  blurred: boolean;
}

export interface MediaAsset {
  id: OpaqueId;
  kind: 'image' | 'video' | 'audio' | 'document';
  processingState: MediaProcessingState;
  accessClass: MediaAccessClass;
  width?: number;
  height?: number;
  durationSeconds?: number;
  altText?: string;
  preview?: MediaPreview;
}

export interface MediaAccess {
  assetId: OpaqueId;
  granted: boolean;
  variants: MediaVariant[];
  expiresAt?: IsoUtcTimestamp;
  denialCode?: string;
}
