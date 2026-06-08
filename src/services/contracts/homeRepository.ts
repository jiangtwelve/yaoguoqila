import type { CreateFamilyInput, Family, FamilyHome, Item, ItemDetail, ItemFormOptions, ItemInput, UpdateProfileInput, User } from '@/domain/models';

export interface HomeRepository {
  getHome(): Promise<FamilyHome>;
  updateProfile(input: UpdateProfileInput): Promise<User>;
  createFamily(input: CreateFamilyInput): Promise<Family>;
  getItemFormOptions(): Promise<ItemFormOptions>;
  listItems(familyId: string, search?: string): Promise<Item[]>;
  getItemDetail(itemId: string): Promise<ItemDetail>;
  createItem(familyId: string, input: ItemInput): Promise<Item>;
  updateItem(itemId: string, input: ItemInput): Promise<Item>;
  consumeItem(itemId: string): Promise<Item>;
  deleteItem(itemId: string): Promise<void>;
}
