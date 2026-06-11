import { getItemStatus, sortByExpiry } from '@/domain/expiry';
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
import { mockFamilies, mockUser } from '@/fixtures/families';
import { mockItems, mockLocations } from '@/fixtures/items';
import type { HomeRepository } from '@/services/contracts/homeRepository';

let user: User = { ...mockUser };
let families: Family[] = [...mockFamilies];
let items: Item[] = mockItems.map((item) => ({
  ...item,
  imageUrls: item.imageUrls.length ? item.imageUrls : item.imageUrl ? [item.imageUrl] : [],
  imageUrl: item.imageUrls[0] ?? item.imageUrl ?? null,
  status: getItemStatus(item.expiresAt)
}));

export class MockHomeRepository implements HomeRepository {
  async getHome(): Promise<FamilyHome> {
    const currentFamily = families[0] ?? null;

    return {
      user,
      currentFamily,
      families,
      locations: currentFamily ? mockLocations.filter((location) => location.familyId === currentFamily.id) : [],
      items: currentFamily ? sortByExpiry(items.filter((item) => item.familyId === currentFamily.id && item.status !== 'consumed')) : []
    };
  }

  async updateProfile(input: UpdateProfileInput): Promise<User> {
    user = {
      ...user,
      displayName: input.displayName,
      hasSetDisplayName: input.displayName.trim().length > 0
    };

    return user;
  }

  async createFamily(input: CreateFamilyInput): Promise<Family> {
    const family: Family = {
      id: `family-${Date.now()}`,
      name: input.name,
      avatarUrl: null,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      role: 'owner'
    };

    families = [family, ...families];

    return family;
  }

  async switchFamily(input: SwitchFamilyInput): Promise<{ familyId: string }> {
    return { familyId: input.familyId };
  }

  async renameFamily(input: RenameFamilyInput): Promise<Family> {
    const updated = families.map((f) =>
      f.id === input.familyId ? { ...f, name: input.name } : f
    );
    families = updated;
    return families.find((f) => f.id === input.familyId)!;
  }

  async getMembers(_familyId: string): Promise<FamilyMemberInfo[]> {
    return [
      { userId: user.id, displayName: user.displayName || '我', role: 'owner', joinedAt: new Date().toISOString() }
    ];
  }

  async removeMember(input: RemoveMemberInput): Promise<{ familyId: string; userId: string }> {
    return { familyId: input.familyId, userId: input.userId };
  }

  async leaveFamily(input: LeaveFamilyInput): Promise<{ familyId: string; dissolved: boolean }> {
    families = families.filter((f) => f.id !== input.familyId);
    return { familyId: input.familyId, dissolved: false };
  }

  async dissolveFamily(input: DissolveFamilyInput): Promise<{ familyId: string }> {
    families = families.filter((f) => f.id !== input.familyId);
    return { familyId: input.familyId };
  }

  async getItemFormOptions(): Promise<ItemFormOptions> {
    const family = families[0] ?? null;

    return {
      family,
      locations: family ? mockLocations.filter((location) => location.familyId === family.id) : []
    };
  }

  async listItems(familyId: string, search = ''): Promise<Item[]> {
    const keyword = search.trim().toLowerCase();
    const result = items
      .filter((item) => item.familyId === familyId)
      .filter((item) => item.status !== 'consumed')
      .filter((item) => item.name.toLowerCase().includes(keyword));

    return sortByExpiry(result);
  }

  async getItemDetail(itemId: string): Promise<ItemDetail> {
    const item = items.find((candidate) => candidate.id === itemId);

    if (!item) {
      throw new Error('物品不存在');
    }

    const family = families.find((candidate) => candidate.id === item.familyId) ?? null;
    const locationName = item.locationName ?? mockLocations.find((location) => location.id === item.locationId)?.name ?? null;

    return {
      item: {
        ...item,
        status: item.status === 'consumed' ? 'consumed' : getItemStatus(item.expiresAt)
      },
      family,
      locationName
    };
  }

  async createItem(familyId: string, input: ItemInput): Promise<Item> {
    const now = new Date().toISOString();
    const item: Item = {
      ...input,
      imageUrl: input.imageUrls[0] ?? input.imageUrl ?? null,
      imageUrls: input.imageUrls,
      id: `item-${Date.now()}`,
      familyId,
      status: getItemStatus(input.expiresAt),
      createdBy: user.id,
      createdAt: now,
      updatedAt: now
    };

    items = [item, ...items];

    return item;
  }

  async updateItem(itemId: string, input: ItemInput): Promise<Item> {
    const item = this.findItem(itemId);
    const updatedItem: Item = {
      ...item,
      ...input,
      imageUrl: input.imageUrls[0] ?? input.imageUrl ?? null,
      imageUrls: input.imageUrls,
      status: item.status === 'consumed' ? 'consumed' : getItemStatus(input.expiresAt),
      updatedAt: new Date().toISOString()
    };

    items = items.map((candidate) => (candidate.id === itemId ? updatedItem : candidate));

    return updatedItem;
  }

  async consumeItem(itemId: string): Promise<Item> {
    const item = this.findItem(itemId);
    const updatedItem: Item = {
      ...item,
      status: 'consumed',
      updatedAt: new Date().toISOString()
    };

    items = items.map((candidate) => (candidate.id === itemId ? updatedItem : candidate));

    return updatedItem;
  }

  async deleteItem(itemId: string): Promise<void> {
    const exists = items.some((item) => item.id === itemId);

    if (!exists) {
      throw new Error('物品不存在');
    }

    items = items.filter((item) => item.id !== itemId);
  }

  private findItem(itemId: string): Item {
    const item = items.find((candidate) => candidate.id === itemId);

    if (!item) {
      throw new Error('物品不存在');
    }

    return item;
  }
}
