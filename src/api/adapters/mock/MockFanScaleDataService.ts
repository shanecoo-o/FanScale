import {
  MOCK_CONVERSATIONS,
  MOCK_CREATORS,
  MOCK_POSTS,
  MOCK_WALLET_TRANSACTIONS,
} from '../../../data/mockData';
import type { FanScaleDataService, WalletReadModel } from '../../../services/FanScaleDataService';
import type { Conversation, CreatorProfile, Post } from '../../../types';

const clone = <T,>(value: T): T => structuredClone(value);

export class MockFanScaleDataService implements FanScaleDataService {
  async getFeed(): Promise<Post[]> {
    return clone(MOCK_POSTS);
  }

  async getCreators(): Promise<CreatorProfile[]> {
    return clone(MOCK_CREATORS);
  }

  async getCreatorByUsername(username: string): Promise<CreatorProfile | null> {
    const creator = MOCK_CREATORS.find(
      (item) => item.username.toLowerCase() === username.toLowerCase(),
    );
    return creator ? clone(creator) : null;
  }

  async getConversations(): Promise<Conversation[]> {
    return clone(MOCK_CONVERSATIONS);
  }

  async getWallet(): Promise<WalletReadModel> {
    return {
      balanceMT: 2500,
      transactions: clone(MOCK_WALLET_TRANSACTIONS),
    };
  }
}
