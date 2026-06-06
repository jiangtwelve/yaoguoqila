import type { CreateFamilyInput, Family, FamilyHome, Item, ItemFormOptions, ItemInput, UpdateProfileInput, User } from '@/domain/models';

export interface HomeRepository {
  getHome(): Promise<FamilyHome>;
  updateProfile(input: UpdateProfileInput): Promise<User>;
  createFamily(input: CreateFamilyInput): Promise<Family>;
  getItemFormOptions(): Promise<ItemFormOptions>;
  listItems(familyId: string, search?: string): Promise<Item[]>;
  createItem(familyId: string, input: ItemInput): Promise<Item>;
}
