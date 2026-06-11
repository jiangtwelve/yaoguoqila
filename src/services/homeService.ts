import type {
  CreateFamilyInput,
  DissolveFamilyInput,
  Family,
  FamilyHome,
  FamilyMemberInfo,
  Item,
  ItemDetail,
  ItemFormOptions,
  ItemInput,
  LeaveFamilyInput,
  RemoveMemberInput,
  RenameFamilyInput,
  SwitchFamilyInput,
  UpdateProfileInput,
  User
} from '@/domain/models';
import { homeRepository } from './adapters/homeRepository';

export async function getFamilyHome(): Promise<FamilyHome> {
  return homeRepository.getHome();
}

export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  return homeRepository.updateProfile(input);
}

export async function createFamily(input: CreateFamilyInput): Promise<Family> {
  return homeRepository.createFamily(input);
}

export async function switchFamily(input: SwitchFamilyInput): Promise<{ familyId: string }> {
  return homeRepository.switchFamily(input);
}

export async function renameFamily(input: RenameFamilyInput): Promise<Family> {
  return homeRepository.renameFamily(input);
}

export async function getFamilyMembers(familyId: string): Promise<FamilyMemberInfo[]> {
  return homeRepository.getMembers(familyId);
}

export async function removeFamilyMember(input: RemoveMemberInput): Promise<{ familyId: string; userId: string }> {
  return homeRepository.removeMember(input);
}

export async function leaveFamilyGroup(input: LeaveFamilyInput): Promise<{ familyId: string; dissolved: boolean }> {
  return homeRepository.leaveFamily(input);
}

export async function dissolveFamilyGroup(input: DissolveFamilyInput): Promise<{ familyId: string }> {
  return homeRepository.dissolveFamily(input);
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
