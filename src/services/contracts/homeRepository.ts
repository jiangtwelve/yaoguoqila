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

export interface HomeRepository {
  getHome(): Promise<FamilyHome>;
  updateProfile(input: UpdateProfileInput): Promise<User>;
  createFamily(input: CreateFamilyInput): Promise<Family>;
  switchFamily(input: SwitchFamilyInput): Promise<{ familyId: string }>;
  renameFamily(input: RenameFamilyInput): Promise<Family>;
  getMembers(familyId: string): Promise<FamilyMemberInfo[]>;
  removeMember(input: RemoveMemberInput): Promise<{ familyId: string; userId: string }>;
  leaveFamily(input: LeaveFamilyInput): Promise<{ familyId: string; dissolved: boolean }>;
  dissolveFamily(input: DissolveFamilyInput): Promise<{ familyId: string }>;
  getItemFormOptions(): Promise<ItemFormOptions>;
  listItems(familyId: string, search?: string): Promise<Item[]>;
  getItemDetail(itemId: string): Promise<ItemDetail>;
  createItem(familyId: string, input: ItemInput): Promise<Item>;
  updateItem(itemId: string, input: ItemInput): Promise<Item>;
  consumeItem(itemId: string): Promise<Item>;
  deleteItem(itemId: string): Promise<void>;
}
