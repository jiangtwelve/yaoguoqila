import type { Family, FamilyMember, User } from '@/domain/models';

export const mockUser: User = {
  id: 'user-001',
  displayName: '小林',
  hasSetDisplayName: true,
  avatarUrl: null,
  platformIdentities: {
    wechatOpenId: 'mock-openid-001',
    phone: null
  }
};

export const mockFamilies: Family[] = [
  {
    id: 'family-001',
    name: '小林家',
    avatarUrl: null,
    createdBy: 'user-001',
    createdAt: '2026-06-01T08:00:00.000Z',
    role: 'owner'
  }
];

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'member-001',
    familyId: 'family-001',
    userId: 'user-001',
    role: 'owner',
    joinedAt: '2026-06-01T08:00:00.000Z'
  }
];
