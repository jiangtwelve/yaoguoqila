import { describe, expect, it } from 'vitest';
import { CloudHomeRepository } from '../cloud/cloudHomeRepository';
import { MockHomeRepository } from '../mock/mockHomeRepository';
import { createHomeRepository } from './homeRepository';

describe('home repository adapter', () => {
  it('creates cloud repository when VITE_USE_MOCK is false', () => {
    expect(createHomeRepository('false')).toBeInstanceOf(CloudHomeRepository);
  });

  it('creates mock repository by default', () => {
    expect(createHomeRepository(undefined)).toBeInstanceOf(MockHomeRepository);
    expect(createHomeRepository('true')).toBeInstanceOf(MockHomeRepository);
  });
});
