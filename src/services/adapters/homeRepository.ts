import type { HomeRepository } from '@/services/contracts/homeRepository';
import { CloudHomeRepository } from '@/services/cloud/cloudHomeRepository';
import { MockHomeRepository } from '@/services/mock/mockHomeRepository';

export function createHomeRepository(useMockEnv: string | undefined): HomeRepository {
  return useMockEnv === 'false' ? new CloudHomeRepository() : new MockHomeRepository();
}

export const homeRepository: HomeRepository = createHomeRepository(import.meta.env.VITE_USE_MOCK);
