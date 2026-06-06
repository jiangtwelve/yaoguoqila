import type { Category, Item, Location } from '@/domain/models';

export const mockLocations: Location[] = [
  { id: 'location-001', familyId: 'family-001', name: '冰箱冷藏' },
  { id: 'location-002', familyId: 'family-001', name: '厨房柜' },
  { id: 'location-003', familyId: 'family-001', name: '药箱' }
];

export const mockCategories: Category[] = [
  { id: 'category-001', familyId: null, name: '食物' },
  { id: 'category-002', familyId: null, name: '药品' },
  { id: 'category-003', familyId: null, name: '日用品' }
];

export const mockItems: Item[] = [
  {
    id: 'item-000',
    familyId: 'family-001',
    name: '酸奶',
    imageUrl: null,
    categoryId: 'category-001',
    locationId: 'location-001',
    expiryInputMode: 'explicit_date',
    productionDate: null,
    shelfLifeValue: null,
    shelfLifeUnit: null,
    expiresAt: '2026-07-12',
    reminderDaysBefore: [1, 3],
    note: '冷藏保存',
    status: 'normal',
    createdBy: 'user-001',
    createdAt: '2026-06-01T08:00:00.000Z',
    updatedAt: '2026-06-01T08:00:00.000Z'
  },
  {
    id: 'item-001',
    familyId: 'family-001',
    name: '鲜牛奶',
    imageUrl: null,
    categoryId: 'category-001',
    locationId: 'location-001',
    expiryInputMode: 'explicit_date',
    productionDate: null,
    shelfLifeValue: null,
    shelfLifeUnit: null,
    expiresAt: '2026-06-28',
    reminderDaysBefore: [1, 3],
    note: '早餐用',
    status: 'normal',
    createdBy: 'user-001',
    createdAt: '2026-06-04T08:00:00.000Z',
    updatedAt: '2026-06-04T08:00:00.000Z'
  },
  {
    id: 'item-002',
    familyId: 'family-001',
    name: '感冒药',
    imageUrl: null,
    categoryId: 'category-002',
    locationId: 'location-003',
    expiryInputMode: 'production_date_and_shelf_life',
    productionDate: '2025-12-01',
    shelfLifeValue: 12,
    shelfLifeUnit: 'month',
    expiresAt: '2026-12-01',
    reminderDaysBefore: [7, 30],
    note: null,
    status: 'normal',
    createdBy: 'user-001',
    createdAt: '2026-06-01T08:00:00.000Z',
    updatedAt: '2026-06-01T08:00:00.000Z'
  }
];
