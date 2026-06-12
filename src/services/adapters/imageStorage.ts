import type { ImageStorage } from '@/services/contracts/imageStorage';
import { CloudImageStorage } from '@/services/cloud/cloudImageStorage';
import { MockImageStorage } from '@/services/mock/mockImageStorage';

/** 根据环境变量创建图片存储 adapter。 */
export function createImageStorage(useMockEnv: string | undefined): ImageStorage {
  return useMockEnv === 'false' ? new CloudImageStorage() : new MockImageStorage();
}

export const imageStorage: ImageStorage = createImageStorage(import.meta.env.VITE_USE_MOCK);
