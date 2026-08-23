import { HttpFanScaleDataService } from '../api/adapters/http/HttpFanScaleDataService';
import { MockFanScaleDataService } from '../api/adapters/mock/MockFanScaleDataService';
import { ApiClient } from '../api/client/ApiClient';
import { apiConfig } from '../api/client/apiConfig';
import type { FanScaleDataService } from './FanScaleDataService';

const createDataService = (): FanScaleDataService => {
  if (apiConfig.mode === 'mock') return new MockFanScaleDataService();
  return new HttpFanScaleDataService(new ApiClient({ baseUrl: apiConfig.baseUrl }));
};

export const fanScaleDataService = createDataService();
export type { FanScaleDataService, WalletReadModel } from './FanScaleDataService';
