const HOME_REFRESH_KEY = 'yaoguoqila:home-needs-refresh';
const HOME_SCROLL_TARGET_KEY = 'yaoguoqila:home-scroll-target';
const DETAIL_REFRESH_KEY_PREFIX = 'yaoguoqila:item-detail-needs-refresh:';

export function markHomeNeedsRefresh(targetItemId?: string) {
  uni.setStorageSync(HOME_REFRESH_KEY, '1');

  if (targetItemId) {
    uni.setStorageSync(HOME_SCROLL_TARGET_KEY, targetItemId);
  }
}

export interface HomeRefreshRequest {
  needsRefresh: boolean;
  targetItemId: string | null;
}

export function consumeHomeRefreshRequest(): HomeRefreshRequest {
  const needsRefresh = uni.getStorageSync(HOME_REFRESH_KEY) === '1';
  const targetItemIdValue = uni.getStorageSync(HOME_SCROLL_TARGET_KEY);
  const targetItemId = typeof targetItemIdValue === 'string' && targetItemIdValue ? targetItemIdValue : null;

  if (needsRefresh) {
    uni.removeStorageSync(HOME_REFRESH_KEY);
  }

  if (targetItemId) {
    uni.removeStorageSync(HOME_SCROLL_TARGET_KEY);
  }

  return {
    needsRefresh,
    targetItemId
  };
}

export function markItemDetailNeedsRefresh(itemId: string) {
  uni.setStorageSync(`${DETAIL_REFRESH_KEY_PREFIX}${itemId}`, '1');
}

export function consumeItemDetailNeedsRefresh(itemId: string): boolean {
  const key = `${DETAIL_REFRESH_KEY_PREFIX}${itemId}`;
  const needsRefresh = uni.getStorageSync(key) === '1';

  if (needsRefresh) {
    uni.removeStorageSync(key);
  }

  return needsRefresh;
}
