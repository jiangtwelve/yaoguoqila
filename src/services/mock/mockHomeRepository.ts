import { getItemStatus, sortByExpiry } from '@/domain/expiry';
import type { CreateFamilyInput, Family, FamilyHome, Item, ItemFormOptions, ItemInput, UpdateProfileInput, User } from '@/domain/models';
import { mockFamilies, mockUser } from '@/fixtures/families';
import { mockItems, mockLocations } from '@/fixtures/items';
import type { HomeRepository } from '@/services/contracts/homeRepository';

let user: User = { ...mockUser };
let families: Family[] = [...mockFamilies];
let items: Item[] = mockItems.map((item) => ({
  ...item,
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
      items: currentFamily ? sortByExpiry(items.filter((item) => item.familyId === currentFamily.id)) : []
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
      createdAt: new Date().toISOString()
    };

    families = [family, ...families];

    return family;
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
      .filter((item) => item.name.toLowerCase().includes(keyword));

    return sortByExpiry(result);
  }

  async createItem(familyId: string, input: ItemInput): Promise<Item> {
    const now = new Date().toISOString();
    const item: Item = {
      ...input,
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
}
