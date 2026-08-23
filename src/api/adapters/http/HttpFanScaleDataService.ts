import { ApiClient } from '../../client/ApiClient';
import { ApiError } from '../../client/ApiError';
import type { FanScaleDataService, WalletReadModel } from '../../../services/FanScaleDataService';
import type { Conversation, CreatorProfile, Post } from '../../../types';

export class HttpFanScaleDataService implements FanScaleDataService {
  constructor(private readonly client: ApiClient) {}

  private unavailable(operation: string): never {
    void this.client;
    throw new ApiError({
      code: 'HTTP_ADAPTER_NOT_IMPLEMENTED',
      message: `HTTP mode is selected, but ${operation} is not connected to a FanScale backend yet.`,
      status: 503,
      retryable: false,
    });
  }

  async getFeed(): Promise<Post[]> { return this.unavailable('feed retrieval'); }
  async getCreators(): Promise<CreatorProfile[]> { return this.unavailable('creator retrieval'); }
  async getCreatorByUsername(_username: string): Promise<CreatorProfile | null> { return this.unavailable('creator profile retrieval'); }
  async getConversations(): Promise<Conversation[]> { return this.unavailable('conversation retrieval'); }
  async getWallet(): Promise<WalletReadModel> { return this.unavailable('wallet retrieval'); }
}
