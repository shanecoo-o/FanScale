import type { Conversation, CreatorProfile, Post, WalletTransaction } from '../types';

export interface WalletReadModel {
  balanceMT: number;
  transactions: WalletTransaction[];
}

export interface FanScaleDataService {
  getFeed(): Promise<Post[]>;
  getCreators(): Promise<CreatorProfile[]>;
  getCreatorByUsername(username: string): Promise<CreatorProfile | null>;
  getConversations(): Promise<Conversation[]>;
  getWallet(): Promise<WalletReadModel>;
}
