import { describe, expect, it } from 'vitest';
import { calculateExpiryDate, daysUntil, getItemStatus } from './expiry';

describe('expiry helpers', () => {
  it('calculates days until expiry by calendar day', () => {
    expect(daysUntil('2026-06-09', new Date('2026-06-06T12:00:00'))).toBe(3);
  });

  it('marks expired, today, expiring, and normal statuses', () => {
    const now = new Date('2026-06-06T12:00:00');

    expect(getItemStatus('2026-06-05', now)).toBe('expired');
    expect(getItemStatus('2026-06-06', now)).toBe('expires_today');
    expect(getItemStatus('2026-06-10', now)).toBe('expiring');
    expect(getItemStatus('2026-06-30', now)).toBe('normal');
  });

  it('calculates expiry date from production date and shelf life', () => {
    expect(calculateExpiryDate('2026-06-01', 6, 'month')).toBe('2026-12-01');
  });
});
