export type FamilyRole = 'owner' | 'member';
export type ExpiryInputMode = 'explicit_date' | 'production_date_and_shelf_life';
export type ShelfLifeUnit = 'day' | 'month' | 'year';
export type ItemStatus = 'normal' | 'expiring' | 'expires_today' | 'expired' | 'consumed';
export type NotificationChannel = 'wechat_subscription' | 'app_push' | 'in_app';
export type NotificationType = 'before_expiry' | 'expires_today' | 'expired';
export type DeliveryStatus = 'pending' | 'sent' | 'failed';

export interface User {
  id: string;
  displayName: string;
  hasSetDisplayName: boolean;
  avatarUrl: string | null;
  platformIdentities: {
    wechatOpenId: string | null;
    phone: string | null;
  };
}

export interface Family {
  id: string;
  name: string;
  avatarUrl: string | null;
  createdBy: string;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  userId: string;
  role: FamilyRole;
  joinedAt: string;
}

export interface Location {
  id: string;
  familyId: string;
  name: string;
}

export interface Category {
  id: string;
  familyId: string | null;
  name: string;
}

export interface Item {
  id: string;
  familyId: string;
  name: string;
  imageUrl: string | null;
  imageUrls: string[];
  categoryId: string | null;
  locationId: string | null;
  locationName?: string | null;
  expiryInputMode: ExpiryInputMode;
  productionDate: string | null;
  shelfLifeValue: number | null;
  shelfLifeUnit: ShelfLifeUnit | null;
  expiresAt: string;
  reminderDaysBefore: number[];
  note: string | null;
  status: ItemStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationLog {
  id: string;
  familyId: string;
  itemId: string;
  userId: string;
  channel: NotificationChannel;
  type: NotificationType;
  sentAt: string;
  status: DeliveryStatus;
}

export interface FamilyHome {
  user: User;
  currentFamily: Family | null;
  families: Family[];
  locations: Location[];
  items: Item[];
}

export interface ItemFormOptions {
  family: Family | null;
  locations: Location[];
}

export interface ItemDetail {
  item: Item;
  family: Family | null;
  locationName: string | null;
}

export interface CreateFamilyInput {
  name: string;
}

export interface UpdateProfileInput {
  displayName: string;
}

export interface ItemInput {
  name: string;
  imageUrl: string | null;
  imageUrls: string[];
  categoryId: string | null;
  locationId: string | null;
  locationName?: string | null;
  expiryInputMode: ExpiryInputMode;
  productionDate: string | null;
  shelfLifeValue: number | null;
  shelfLifeUnit: ShelfLifeUnit | null;
  expiresAt: string;
  reminderDaysBefore: number[];
  note: string | null;
}
