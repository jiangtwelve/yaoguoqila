import type { HomeRepository } from '@/services/contracts/homeRepository';
import { CloudHomeRepository } from '@/services/cloud/cloudHomeRepository';
import { MockHomeRepository } from '@/services/mock/mockHomeRepository';

const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

export const homeRepository: HomeRepository = useMock ? new MockHomeRepository() : new CloudHomeRepository();
