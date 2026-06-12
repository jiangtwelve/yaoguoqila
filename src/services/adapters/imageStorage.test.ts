import { describe, expect, it } from 'vitest';
import { CloudImageStorage } from '../cloud/cloudImageStorage';
import { MockImageStorage } from '../mock/mockImageStorage';
import { createImageStorage } from './imageStorage';

describe('image storage adapter', () => {
  it('creates cloud image storage when VITE_USE_MOCK is false', () => {
    expect(createImageStorage('false')).toBeInstanceOf(CloudImageStorage);
  });

  it('creates mock image storage by default', () => {
    expect(createImageStorage(undefined)).toBeInstanceOf(MockImageStorage);
    expect(createImageStorage('true')).toBeInstanceOf(MockImageStorage);
  });
});
