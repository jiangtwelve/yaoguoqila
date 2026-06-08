import type { CreateFamilyInput, Family, FamilyHome, Item, ItemDetail, ItemFormOptions, ItemInput, UpdateProfileInput, User } from '@/domain/models';
import type { HomeRepository } from '@/services/contracts/homeRepository';
import { callCloudFunction } from './wechatCloudClient';

export class CloudHomeRepository implements HomeRepository {
  async getHome(): Promise<FamilyHome> {
    return callCloudFunction<Record<string, never>, FamilyHome>({
      name: 'home.getFamilyHome',
      payload: {}
    });
  }

  async updateProfile(input: UpdateProfileInput): Promise<User> {
    return callCloudFunction<UpdateProfileInput, User>({
      name: 'user.updateProfile',
      payload: input
    });
  }

  async createFamily(input: CreateFamilyInput): Promise<Family> {
    return callCloudFunction<CreateFamilyInput, Family>({
      name: 'family.createFamily',
      payload: input
    });
  }

  async getItemFormOptions(): Promise<ItemFormOptions> {
    return callCloudFunction<Record<string, never>, ItemFormOptions>({
      name: 'item.getFormOptions',
      payload: {}
    });
  }

  async listItems(familyId: string, search = ''): Promise<Item[]> {
    return callCloudFunction<{ familyId: string; search: string }, Item[]>({
      name: 'item.listItems',
      payload: { familyId, search }
    });
  }

  async getItemDetail(itemId: string): Promise<ItemDetail> {
    return callCloudFunction<{ itemId: string }, ItemDetail>({
      name: 'item.getItemDetail',
      payload: { itemId }
    });
  }

  async createItem(familyId: string, input: ItemInput): Promise<Item> {
    return callCloudFunction<{ familyId: string; input: ItemInput }, Item>({
      name: 'item.createItem',
      payload: { familyId, input }
    });
  }

  async updateItem(itemId: string, input: ItemInput): Promise<Item> {
    return callCloudFunction<{ itemId: string; input: ItemInput }, Item>({
      name: 'item.updateItem',
      payload: { itemId, input }
    });
  }

  async consumeItem(itemId: string): Promise<Item> {
    return callCloudFunction<{ itemId: string }, Item>({
      name: 'item.consumeItem',
      payload: { itemId }
    });
  }

  async deleteItem(itemId: string): Promise<void> {
    return callCloudFunction<{ itemId: string }, void>({
      name: 'item.deleteItem',
      payload: { itemId }
    });
  }
}
