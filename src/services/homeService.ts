import type { CreateFamilyInput, FamilyHome, Item, ItemDetail, ItemFormOptions, ItemInput, UpdateProfileInput, User } from '@/domain/models';
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

export async function updateItem(itemId: string, input: ItemInput): Promise<Item> {
  return homeRepository.updateItem(itemId, input);
}

export async function getItemDetail(itemId: string): Promise<ItemDetail> {
  return homeRepository.getItemDetail(itemId);
}

export async function consumeItem(itemId: string): Promise<Item> {
  return homeRepository.consumeItem(itemId);
}

export async function deleteItem(itemId: string): Promise<void> {
  return homeRepository.deleteItem(itemId);
}
