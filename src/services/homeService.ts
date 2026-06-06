import type { CreateFamilyInput, FamilyHome, Item, ItemFormOptions, ItemInput, UpdateProfileInput, User } from '@/domain/models';
import { homeRepository } from './adapters/homeRepository';

export async function getFamilyHome(): Promise<FamilyHome> {
  return homeRepository.getHome();
}

export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  return homeRepository.updateProfile(input);
}

export async function createFamily(input: CreateFamilyInput) {
  return homeRepository.createFamily(input);
}

export async function searchItems(familyId: string, search: string): Promise<Item[]> {
  return homeRepository.listItems(familyId, search);
}

export async function getItemFormOptions(): Promise<ItemFormOptions> {
  return homeRepository.getItemFormOptions();
}

export async function createItem(familyId: string, input: ItemInput): Promise<Item> {
  return homeRepository.createItem(familyId, input);
}
