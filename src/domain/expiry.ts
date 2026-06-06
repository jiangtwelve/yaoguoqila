import type { Item, ItemStatus, ShelfLifeUnit } from './models';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function daysUntil(expiresAt: string, now = new Date()): number {
  const today = startOfDay(now);
  const expiry = startOfDay(new Date(expiresAt));

  return Math.round((expiry.getTime() - today.getTime()) / MS_PER_DAY);
}

export function getItemStatus(expiresAt: string, now = new Date(), expiringWindowDays = 7): ItemStatus {
  const remainingDays = daysUntil(expiresAt, now);

  if (remainingDays < 0) return 'expired';
  if (remainingDays === 0) return 'expires_today';
  if (remainingDays <= expiringWindowDays) return 'expiring';

  return 'normal';
}

export function sortByExpiry(items: Item[], now = new Date()): Item[] {
  return [...items].sort((left, right) => {
    const leftDays = daysUntil(left.expiresAt, now);
    const rightDays = daysUntil(right.expiresAt, now);

    return leftDays - rightDays;
  });
}

export function calculateExpiryDate(productionDate: string, shelfLifeValue: number, shelfLifeUnit: ShelfLifeUnit): string {
  const date = new Date(productionDate);

  if (shelfLifeUnit === 'day') {
    date.setDate(date.getDate() + shelfLifeValue);
  }

  if (shelfLifeUnit === 'month') {
    date.setMonth(date.getMonth() + shelfLifeValue);
  }

  if (shelfLifeUnit === 'year') {
    date.setFullYear(date.getFullYear() + shelfLifeValue);
  }

  return formatDate(date);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}
