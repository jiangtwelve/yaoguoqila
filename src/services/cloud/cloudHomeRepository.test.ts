import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ItemInput } from '@/domain/models';
import { CloudHomeRepository } from './cloudHomeRepository';
import { callCloudFunction } from './wechatCloudClient';

vi.mock('./wechatCloudClient', () => ({
  callCloudFunction: vi.fn()
}));

const callCloudFunctionMock = vi.mocked(callCloudFunction);

const itemInput: ItemInput = {
  name: '牛奶',
  imageUrl: null,
  imageUrls: [],
  categoryId: null,
  locationId: null,
  locationName: '冰箱',
  expiryInputMode: 'explicit_date',
  productionDate: null,
  shelfLifeValue: null,
  shelfLifeUnit: null,
  expiresAt: '2026-06-12',
  reminderDaysBefore: [1, 3],
  note: null
};

describe('CloudHomeRepository', () => {
  beforeEach(() => {
    callCloudFunctionMock.mockReset();
    callCloudFunctionMock.mockResolvedValue(undefined as never);
  });

  it('maps getHome to home.getFamilyHome', async () => {
    const repository = new CloudHomeRepository();

    await repository.getHome();

    expect(callCloudFunctionMock).toHaveBeenCalledWith({
      name: 'home.getFamilyHome',
      payload: {}
    });
  });

  it('maps updateProfile to user.updateProfile', async () => {
    const repository = new CloudHomeRepository();

    await repository.updateProfile({ displayName: '江' });

    expect(callCloudFunctionMock).toHaveBeenCalledWith({
      name: 'user.updateProfile',
      payload: { displayName: '江' }
    });
  });

  it('maps createFamily to family.createFamily', async () => {
    const repository = new CloudHomeRepository();

    await repository.createFamily({ name: '家' });

    expect(callCloudFunctionMock).toHaveBeenCalledWith({
      name: 'family.createFamily',
      payload: { name: '家' }
    });
  });

  it('maps createItem to item.createItem with family id and input', async () => {
    const repository = new CloudHomeRepository();

    await repository.createItem('family-1', itemInput);

    expect(callCloudFunctionMock).toHaveBeenCalledWith({
      name: 'item.createItem',
      payload: { familyId: 'family-1', input: itemInput }
    });
  });

  it('maps updateItem to item.updateItem with item id and input', async () => {
    const repository = new CloudHomeRepository();

    await repository.updateItem('item-1', itemInput);

    expect(callCloudFunctionMock).toHaveBeenCalledWith({
      name: 'item.updateItem',
      payload: { itemId: 'item-1', input: itemInput }
    });
  });

  it('maps consumeItem to item.consumeItem', async () => {
    const repository = new CloudHomeRepository();

    await repository.consumeItem('item-1');

    expect(callCloudFunctionMock).toHaveBeenCalledWith({
      name: 'item.consumeItem',
      payload: { itemId: 'item-1' }
    });
  });

  it('maps deleteItem to item.deleteItem', async () => {
    const repository = new CloudHomeRepository();

    await repository.deleteItem('item-1');

    expect(callCloudFunctionMock).toHaveBeenCalledWith({
      name: 'item.deleteItem',
      payload: { itemId: 'item-1' }
    });
  });
});
