<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';
import FamilyHub from '@/components/FamilyHub.vue';
import GlassModal from '@/components/GlassModal.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import type { FamilyHome, Item } from '@/domain/models';
import { daysUntil } from '@/domain/expiry';
import { deleteItem, getFamilyHome, searchItems, updateProfile, createFamily } from '@/services/homeService';
import { getNavigationSafeArea } from '@/utils/navigationSafeArea';
import { consumeHomeRefreshRequest } from '@/utils/pageRefresh';
import { MOCK_PULL_DOWN_REFRESH_FAILURE, waitForFailedRefreshIndicator, waitForMinimumRefreshIndicator } from '@/utils/pullDownRefresh';

type PullRefreshState = 'idle' | 'refreshing' | 'failed';

const loading = ref(true);
const errorMessage = ref('');
const search = ref('');
const showCreateFamily = ref(false);
const initialSafeArea = getNavigationSafeArea();
const navTopPx = ref(initialSafeArea.navTopPx);
const navHeightPx = ref(initialSafeArea.navHeightPx);
const capsuleReservePx = ref(initialSafeArea.capsuleReservePx);
const home = ref<FamilyHome | null>(null);
const visibleItems = ref<Item[]>([]);
const loadedOnce = ref(false);
const pullRefreshState = ref<PullRefreshState>('idle');
const openSwipeItemId = ref('');
const draggingItemId = ref('');
const touchStartX = ref(0);
const touchStartOffsetPx = ref(0);
const swipeOffsetPx = ref(0);
const deleteWidthPx = ref(76);
const suppressNextTap = ref(false);
const deletingItemId = ref('');
const profileNameInput = ref('');
const savingProfile = ref(false);
const familyNameInput = ref('');
const savingFamily = ref(false);
const showFamilyHub = ref(false);
const createdFromHub = ref(false);
const newFamilyId = ref('');
const profileInputFocus = ref(false);

const hasFamily = computed(() => Boolean(home.value?.currentFamily));
const needsProfileName = computed(() => Boolean(home.value && !home.value.user.hasSetDisplayName));
const inventoryItems = computed(() => home.value?.items ?? []);
const expiredCount = computed(() => inventoryItems.value.filter((item) => item.status === 'expired').length);
const expiringCount = computed(() => inventoryItems.value.filter((item) => ['expires_today', 'expiring'].includes(item.status)).length);
const attentionCount = computed(() => expiredCount.value + expiringCount.value);
const heroMode = computed(() => (expiredCount.value > 0 ? 'expired' : 'urgent'));
const heroTitle = computed(() => (attentionCount.value > 0 ? '今天要看' : '库存清透'));
const heroNumber = computed(() => attentionCount.value);
const heroCopy = computed(() => (attentionCount.value > 0 ? '有物品正在靠近过期时间' : '暂无临期和过期物品'));
const itemCountText = computed(() => `共 ${inventoryItems.value.length} 件物品`);
const shellStyle = computed(() => ({
  paddingTop: `${navTopPx.value + navHeightPx.value + 18}px`
}));
const refreshIndicatorStyle = computed(() => ({
  top: `${navTopPx.value + navHeightPx.value + 10}px`
}));
const pullRefreshText = computed(() => (pullRefreshState.value === 'failed' ? '刷新失败，稍后再试' : '正在刷新'));
const navStyle = computed(() => ({
  top: `${navTopPx.value}px`,
  minHeight: `${navHeightPx.value}px`,
  paddingRight: `${capsuleReservePx.value}px`
}));
const familyHubFamilies = computed(() => home.value?.families ?? []);
const currentFamilyId = computed(() => home.value?.currentFamily?.id ?? '');
const currentUserId = computed(() => home.value?.user.id ?? '');

onMounted(() => {
  updateTopSafePadding();
  updateSwipeMetrics();
});

/** 弹窗渲染稳定后再聚焦输入框，避免键盘与首次渲染布局冲突 */
watch(needsProfileName, (needs) => {
  if (needs) {
    void nextTick().then(() => {
      setTimeout(() => {
        profileInputFocus.value = true;
      }, 120);
    });
  } else {
    profileInputFocus.value = false;
  }
});

onShow(() => {
  const refreshRequest = consumeHomeRefreshRequest();

  if (!loadedOnce.value || refreshRequest.needsRefresh) {
    void loadHome(refreshRequest.targetItemId);
  }
});

onPullDownRefresh(() => {
  void refreshHome();
});

function updateTopSafePadding() {
  const safeArea = getNavigationSafeArea();

  navTopPx.value = safeArea.navTopPx;
  navHeightPx.value = safeArea.navHeightPx;
  capsuleReservePx.value = safeArea.capsuleReservePx;
}

function updateSwipeMetrics() {
  const systemInfo = uni.getSystemInfoSync();

  deleteWidthPx.value = Math.round((systemInfo.windowWidth || 375) * 152 / 750);
}

async function loadHome(targetItemId: string | null = null): Promise<boolean> {
  loading.value = !loadedOnce.value;
  errorMessage.value = '';

  try {
    home.value = await getFamilyHome();
    if (!home.value.currentFamily) {
      visibleItems.value = [];
      return true;
    }

    if (targetItemId) {
      search.value = '';
    }

    visibleItems.value = search.value.trim() ? await searchItems(home.value.currentFamily.id, search.value) : home.value.items;

    if (targetItemId && visibleItems.value.some((item) => item.id === targetItemId)) {
      await scrollToItem(targetItemId);
    }

    return true;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载失败';
    return false;
  } finally {
    loading.value = false;
    loadedOnce.value = true;
  }
}

async function refreshHome() {
  const startedAt = Date.now();
  let refreshed = false;

  uni.stopPullDownRefresh();
  pullRefreshState.value = 'refreshing';
  openSwipeItemId.value = '';

  try {
    if (MOCK_PULL_DOWN_REFRESH_FAILURE) {
      refreshed = false;
    } else {
      refreshed = await loadHome();
    }
  } catch {
    refreshed = false;
  } finally {
    await waitForMinimumRefreshIndicator(startedAt);

    if (refreshed) {
      pullRefreshState.value = 'idle';
      return;
    }

    pullRefreshState.value = 'failed';
    await waitForFailedRefreshIndicator();
    pullRefreshState.value = 'idle';
  }
}

async function scrollToItem(itemId: string) {
  await nextTick();

  setTimeout(() => {
    void uni.pageScrollTo({
      selector: `#item-${itemId}`,
      offsetTop: navTopPx.value + navHeightPx.value + 12,
      duration: 320
    });
  }, 80);
}

async function handleSearch(value: string) {
  search.value = value;

  if (!home.value?.currentFamily) {
    visibleItems.value = [];
    return;
  }

  visibleItems.value = await searchItems(home.value.currentFamily.id, value);
}

function handleSearchInput(event: InputEvent) {
  const target = event.target as HTMLInputElement | null;

  void handleSearch(target?.value ?? '');
}

function clearSearch() {
  void handleSearch('');
}

function getStatusText(item: Item): string {
  if (item.status === 'expired') return `过期 ${Math.abs(daysUntil(item.expiresAt))} 天`;
  if (item.status === 'expires_today') return '今天到期';
  if (item.status === 'expiring') return `${daysUntil(item.expiresAt)} 天后`;
  if (item.status === 'consumed') return '已用完';

  return `${daysUntil(item.expiresAt)} 天后`;
}

function getStatusClass(item: Item): string {
  return `status-${item.status.replace('_', '-')}`;
}

function getLocationName(item: Item): string {
  if (item.locationName) return item.locationName;
  if (!item.locationId) return '';

  return home.value?.locations.find((location) => location.id === item.locationId)?.name ?? '';
}

function getItemMeta(item: Item): string {
  const locationName = getLocationName(item);
  const expiryText = `到期日 ${item.expiresAt}`;

  return locationName ? `${locationName} · ${expiryText}` : expiryText;
}

function getItemCover(item: Item): string | null {
  return item.imageUrls[0] ?? item.imageUrl ?? null;
}

function getSwipeStyle(item: Item) {
  if (draggingItemId.value === item.id) {
    return {
      transform: `translate3d(${swipeOffsetPx.value}px, 0, 0)`,
      transition: 'none'
    };
  }

  return {
    transform: openSwipeItemId.value === item.id ? `translate3d(${-deleteWidthPx.value}px, 0, 0)` : 'translate3d(0, 0, 0)'
  };
}

function handleItemTouchStart(event: TouchEvent, item: Item) {
  touchStartX.value = event.touches[0]?.clientX ?? 0;
  draggingItemId.value = item.id;
  touchStartOffsetPx.value = openSwipeItemId.value === item.id ? -deleteWidthPx.value : 0;
  swipeOffsetPx.value = touchStartOffsetPx.value;

  if (openSwipeItemId.value && openSwipeItemId.value !== item.id) {
    openSwipeItemId.value = '';
  }
}

function handleItemTouchMove(event: TouchEvent, item: Item) {
  if (draggingItemId.value !== item.id) return;

  const currentX = event.touches[0]?.clientX ?? touchStartX.value;
  const deltaX = currentX - touchStartX.value;
  const nextOffset = touchStartOffsetPx.value + deltaX;

  swipeOffsetPx.value = Math.min(0, Math.max(-deleteWidthPx.value, nextOffset));
}

function handleItemTouchEnd(event: TouchEvent, item: Item) {
  const endX = event.changedTouches[0]?.clientX ?? touchStartX.value;
  const deltaX = endX - touchStartX.value;
  const shouldOpen = swipeOffsetPx.value < -deleteWidthPx.value * 0.38 || deltaX < -36;

  if (Math.abs(deltaX) > 8) {
    suppressNextTap.value = true;
    setTimeout(() => {
      suppressNextTap.value = false;
    }, 120);
  }

  draggingItemId.value = '';

  if (shouldOpen) {
    openSwipeItemId.value = item.id;
    return;
  }

  if (deltaX > 24 || swipeOffsetPx.value > -deleteWidthPx.value * 0.38) {
    openSwipeItemId.value = '';
  }
}

function handleItemTap(item: Item) {
  if (suppressNextTap.value) {
    suppressNextTap.value = false;
    return;
  }

  if (openSwipeItemId.value) {
    openSwipeItemId.value = '';
    return;
  }

  goToItemDetail(item);
}

function confirmDeleteItem(item: Item) {
  void uni.showModal({
    title: '删除物品',
    content: `确认删除「${item.name}」吗？`,
    confirmText: '删除',
    confirmColor: '#e5483f',
    success: (result) => {
      if (result.confirm) {
        void removeItem(item);
      }
    }
  });
}

async function removeItem(item: Item) {
  deletingItemId.value = item.id;

  try {
    await deleteItem(item.id);
    home.value = home.value
      ? {
          ...home.value,
          items: home.value.items.filter((candidate) => candidate.id !== item.id)
        }
      : null;
    visibleItems.value = visibleItems.value.filter((candidate) => candidate.id !== item.id);
    openSwipeItemId.value = '';
    void uni.showToast({ title: '已删除', icon: 'success' });
  } catch (error) {
    void uni.showToast({ title: error instanceof Error ? error.message : '删除失败', icon: 'none' });
  } finally {
    deletingItemId.value = '';
  }
}

function goToNewItem() {
  void uni.navigateTo({
    url: '/pages/item-form/index'
  });
}

function goToItemDetail(item: Item) {
  void uni.navigateTo({
    url: `/pages/item-detail/index?id=${item.id}`
  });
}

async function saveProfile() {
  const name = profileNameInput.value.trim();
  if (!name || savingProfile.value) return;

  savingProfile.value = true;
  void uni.showLoading({ title: '保存中', mask: true });
  try {
    const user = await updateProfile({ displayName: name });
    if (home.value) {
      home.value = { ...home.value, user };
    }
    uni.hideLoading();
    void uni.showToast({ title: '昵称已设置', icon: 'success' });
  } catch (error) {
    uni.hideLoading();
    void uni.showToast({ title: error instanceof Error ? error.message : '设置失败', icon: 'none' });
  } finally {
    savingProfile.value = false;
  }
}

async function saveFamily() {
  const name = familyNameInput.value.trim();
  if (!name || savingFamily.value) return;

  savingFamily.value = true;
  void uni.showLoading({ title: '保存中', mask: true });
  try {
    const family = await createFamily({ name });
    showCreateFamily.value = false;
    familyNameInput.value = '';
    search.value = '';
    await loadHome();
    uni.hideLoading();
    void uni.showToast({ title: '家庭已创建', icon: 'success' });
    /** 从 Hub 创建时，等 DOM 渲染后再滚动到新家庭卡片 */
    if (createdFromHub.value) {
      await nextTick();
      newFamilyId.value = family.id;
    }
  } catch (error) {
    uni.hideLoading();
    const rawMessage = error instanceof Error ? error.message : '';
    const message = rawMessage.includes('同名') ? '家庭名称重复' : (rawMessage || '创建失败');
    void uni.showToast({ title: message, icon: 'none' });
  } finally {
    savingFamily.value = false;
    createdFromHub.value = false;
  }
}

/** 家庭切换或管理操作后刷新首页数据 */
async function handleFamilySwitched() {
  showFamilyHub.value = false;
  search.value = '';
  await loadHome();
  uni.hideLoading();
}

/** 重命名后静默刷新首页数据（不关闭 FamilyHub） */
async function handleFamilyRenamed() {
  await loadHome();
}

/** 从 FamilyHub 跳转到创建家庭弹窗（不关闭 Hub，创建弹窗覆盖在上面） */
function handleCreateFromHub() {
  createdFromHub.value = true;
  showCreateFamily.value = true;
  familyNameInput.value = '';
}
</script>

<template>
  <view class="page">
    <view class="nav-row" :style="navStyle">
      <view class="nav-title">
          <button v-if="hasFamily" class="family-button" @click="showFamilyHub = true">
            <text>{{ home?.currentFamily?.name }}</text>
            <text class="chevron">⌄</text>
          </button>
          <text v-else class="brand">要过期</text>
      </view>
    </view>

    <view
      v-if="pullRefreshState !== 'idle'"
      class="pull-refresh-indicator"
      :class="{ failed: pullRefreshState === 'failed' }"
      :style="refreshIndicatorStyle"
    >
      <view v-if="pullRefreshState === 'refreshing'" class="refresh-spinner"></view>
      <text>{{ pullRefreshText }}</text>
    </view>

    <view class="shell" :style="shellStyle">
      <view v-if="loading && !needsProfileName" class="home-skeleton" aria-label="加载中">
        <view class="skeleton-dashboard skeleton-surface">
          <view class="skeleton-copy">
            <SkeletonBlock width="128rpx" height="24rpx" />
            <SkeletonBlock width="246rpx" height="58rpx" radius="20rpx" />
            <SkeletonBlock width="320rpx" height="28rpx" />
          </view>
          <SkeletonBlock width="116rpx" height="108rpx" radius="28rpx" class="skeleton-meter-abs" />
          <view class="skeleton-metrics">
            <SkeletonBlock height="78rpx" radius="28rpx" />
            <SkeletonBlock height="78rpx" radius="28rpx" />
          </view>
        </view>

        <SkeletonBlock height="88rpx" radius="28rpx" class="skeleton-surface" />

        <view class="skeleton-list skeleton-surface">
          <view v-for="index in 5" :key="index" class="skeleton-item">
            <SkeletonBlock width="76rpx" height="76rpx" radius="18rpx" />
            <view class="skeleton-item-copy">
              <SkeletonBlock width="220rpx" height="30rpx" radius="12rpx" />
              <SkeletonBlock width="320rpx" height="24rpx" radius="12rpx" />
            </view>
            <SkeletonBlock width="104rpx" height="44rpx" />
          </view>
        </view>
      </view>

      <view v-else-if="errorMessage" class="quiet-state error">
        <text class="state-title">加载失败</text>
        <text class="state-copy">{{ errorMessage }}</text>
      </view>

      <view v-else-if="!hasFamily" class="quiet-state no-family">
        <text class="state-kicker">还没有家庭</text>
        <text class="state-title">先等一个归属</text>
        <text class="state-copy">你可以创建自己的家庭，也可以接受邀请后加入。</text>
        <view class="state-actions">
          <button class="primary-action" @click="showCreateFamily = true">创建家庭</button>
          <button class="secondary-action">加入家庭</button>
        </view>
      </view>

      <view v-else>
        <view class="glass-dashboard" :class="`hero-${heroMode}`">
          <view class="glass-header">
            <view class="summary-copy">
              <text class="hero-kicker">{{ itemCountText }}</text>
              <text class="hero-title">{{ heroTitle }}</text>
              <text class="hero-copy">{{ heroCopy }}</text>
            </view>
            <view class="hero-meter">
              <text class="hero-number">{{ heroNumber }}</text>
              <text class="hero-unit">件</text>
            </view>
          </view>

          <view class="glass-metrics">
            <view class="metric-card breakdown-expired">
              <text class="breakdown-value">{{ expiredCount }}</text>
              <text class="breakdown-label">已过期</text>
            </view>
            <view class="metric-card breakdown-expiring">
              <text class="breakdown-value">{{ expiringCount }}</text>
              <text class="breakdown-label">临期</text>
            </view>
          </view>
        </view>

        <view class="search-wrap">
          <text class="search-mark">⌕</text>
          <input
            class="search"
            :value="search"
            placeholder="查询物品"
            placeholder-class="search-placeholder"
            @input="handleSearchInput"
          />
          <button v-if="search" class="search-clear" aria-label="清空查询" @click="clearSearch">×</button>
        </view>

        <view v-if="visibleItems.length === 0" class="quiet-state compact">
          <text class="state-title">没有找到物品</text>
          <text class="state-copy">换个关键词试试</text>
        </view>

        <view v-else class="list">
          <view
            v-for="item in visibleItems"
            :id="`item-${item.id}`"
            :key="item.id"
            class="swipe-row"
            :class="{ 'swipe-row-open': openSwipeItemId === item.id }"
          >
            <button class="swipe-delete" :disabled="deletingItemId === item.id" @click="confirmDeleteItem(item)">
              {{ deletingItemId === item.id ? '删除中' : '删除' }}
            </button>
            <button
              class="item-card"
              :style="getSwipeStyle(item)"
              hover-class="none"
              @click="handleItemTap(item)"
              @touchstart="handleItemTouchStart($event, item)"
              @touchmove="handleItemTouchMove($event, item)"
              @touchend="handleItemTouchEnd($event, item)"
            >
              <image v-if="getItemCover(item)" class="item-thumb" :src="getItemCover(item)!" mode="aspectFill" />
              <view v-else class="item-thumb item-thumb-fallback">
                <view class="placeholder-mark">
                  <view class="placeholder-dot"></view>
                  <view class="placeholder-stroke placeholder-stroke-left"></view>
                  <view class="placeholder-stroke placeholder-stroke-right"></view>
                </view>
              </view>
              <view class="item-main">
                <text class="item-name">{{ item.name }}</text>
                <text class="item-meta">{{ getItemMeta(item) }}</text>
              </view>
              <text class="status" :class="getStatusClass(item)">{{ getStatusText(item) }}</text>
            </button>
          </view>
        </view>
      </view>
    </view>

    <button v-if="hasFamily" class="add-button floating-add" aria-label="新增物品" @click="goToNewItem">＋</button>

    <GlassModal
      :show="needsProfileName"
      symbol="你"
      kicker="第一次见面"
      title="设置昵称"
      primary-text="保存昵称"
      :primary-disabled="!profileNameInput.trim()"
      @primary="saveProfile"
    >
      <view class="glass-modal-field">
        <input class="glass-modal-input" v-model="profileNameInput" placeholder="你的昵称" placeholder-class="glass-modal-placeholder" :focus="profileInputFocus" />
      </view>
    </GlassModal>

    <GlassModal
      :show="showCreateFamily"
      symbol="家"
      symbol-tone="family"
      kicker="新的收纳空间"
      title="创建家庭"
      secondary-text="取消"
      primary-text="创建"
      :primary-disabled="!familyNameInput.trim()"
      @secondary="showCreateFamily = false"
      @primary="saveFamily"
    >
      <view class="glass-modal-field">
        <input class="glass-modal-input" v-model="familyNameInput" placeholder="家庭名称" placeholder-class="glass-modal-placeholder" />
      </view>
    </GlassModal>

    <FamilyHub
      :show="showFamilyHub"
      :families="familyHubFamilies"
      :current-family-id="currentFamilyId"
      :current-user-id="currentUserId"
      :scroll-to-family-id="newFamilyId"
      @close="showFamilyHub = false"
      @switched="handleFamilySwitched"
      @renamed="handleFamilyRenamed"
      @create-family="handleCreateFromHub"
    />
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background:
    linear-gradient(155deg, rgba(232, 246, 255, 0.98) 0%, rgba(249, 242, 255, 0.96) 44%, rgba(241, 250, 244, 0.98) 100%);
  box-sizing: border-box;
  color: #101418;
  position: relative;
}

.page::before {
  content: "";
  position: fixed;
  inset: -18% -10% auto;
  height: 58vh;
  background:
    linear-gradient(125deg, rgba(79, 127, 120, 0.24), transparent 42%),
    linear-gradient(245deg, rgba(125, 164, 157, 0.18), transparent 48%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.78), transparent 70%);
  filter: blur(18rpx);
  pointer-events: none;
}

.shell {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  padding: 0 30rpx 82rpx;
  box-sizing: border-box;
}

.pull-refresh-indicator {
  position: fixed;
  left: 50%;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 56rpx;
  padding: 0 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.62);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.66);
  box-shadow: 0 14rpx 34rpx rgba(45, 74, 110, 0.1), inset 0 1rpx 0 rgba(255, 255, 255, 0.82);
  color: rgba(16, 20, 24, 0.52);
  font-size: 24rpx;
  transform: translateX(-50%);
  backdrop-filter: blur(22rpx);
  -webkit-backdrop-filter: blur(22rpx);
}

.pull-refresh-indicator.failed {
  border-color: rgba(229, 72, 63, 0.18);
  background: rgba(255, 247, 246, 0.82);
  color: #e5483f;
}

.refresh-spinner {
  width: 26rpx;
  height: 26rpx;
  border: 3rpx solid rgba(79, 127, 120, 0.18);
  border-top-color: #4f7f78;
  border-radius: 50%;
  animation: refresh-spin 820ms linear infinite;
  box-sizing: border-box;
}

@keyframes refresh-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.nav-row {
  position: fixed;
  left: 30rpx;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  pointer-events: none;
}

.nav-title {
  min-width: 0;
  pointer-events: auto;
}

.brand,
.family-button {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #101418;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif;
  font-size: 38rpx;
  font-weight: 760;
  line-height: 1.12;
  letter-spacing: 0;
  max-width: 100%;
}

.family-button::after,
.add-button::after,
.primary-action::after,
.secondary-action::after,
.item-card::after {
  border: 0;
}

.chevron {
  color: rgba(16, 20, 24, 0.45);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
  font-size: 30rpx;
}

.add-button {
  margin: 0;
  width: 72rpx;
  height: 72rpx;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(16, 20, 24, 0.82);
  color: #ffffff;
  font-size: 42rpx;
  line-height: 70rpx;
}

.floating-add {
  position: fixed;
  right: 36rpx;
  bottom: calc(44rpx + env(safe-area-inset-bottom));
  z-index: 12;
  width: 92rpx;
  height: 92rpx;
  box-shadow: 0 20rpx 46rpx rgba(30, 70, 110, 0.28);
  backdrop-filter: blur(24rpx);
  -webkit-backdrop-filter: blur(24rpx);
  font-size: 46rpx;
  line-height: 88rpx;
}

.glass-dashboard {
  position: relative;
  margin-top: 18rpx;
  padding: 34rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.62);
  border-radius: 38rpx;
  background: rgba(255, 255, 255, 0.34);
  box-shadow: 0 30rpx 70rpx rgba(45, 74, 110, 0.14), inset 0 1rpx 0 rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(34rpx);
  -webkit-backdrop-filter: blur(34rpx);
  box-sizing: border-box;
  overflow: hidden;
}

.glass-dashboard::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.62), transparent 46%, rgba(255, 255, 255, 0.28));
  pointer-events: none;
}

.glass-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.summary-copy {
  min-width: 0;
}

.hero-kicker {
  display: block;
  color: rgba(16, 20, 24, 0.46);
  font-size: 24rpx;
  font-weight: 500;
}

.hero-title {
  display: block;
  margin-top: 12rpx;
  color: #101418;
  font-size: 54rpx;
  font-weight: 780;
  line-height: 1.12;
}

.hero-number {
  color: #101418;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
  font-size: 78rpx;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
}

.hero-copy {
  display: block;
  margin-top: 12rpx;
  color: rgba(16, 20, 24, 0.58);
  font-size: 26rpx;
  line-height: 1.45;
}

.hero-meter {
  display: flex;
  flex: 0 0 auto;
  align-items: baseline;
  gap: 6rpx;
  padding: 16rpx 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.64);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.34);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(22rpx);
  -webkit-backdrop-filter: blur(22rpx);
}

.hero-unit {
  color: rgba(16, 20, 24, 0.46);
  font-size: 24rpx;
}

.hero-expired .hero-number {
  color: #e5483f;
}

.hero-expired .hero-meter {
  background: rgba(255, 238, 236, 0.68);
}

.glass-metrics {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 16rpx;
  margin-top: 30rpx;
}

.metric-card {
  display: block;
  flex: 1;
  height: 78rpx;
  line-height: 78rpx;
  text-align: center;
  border: 1rpx solid rgba(255, 255, 255, 0.54);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.28);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}

.breakdown-value {
  display: inline-block;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
  font-size: 34rpx;
  font-weight: 700;
  line-height: 78rpx;
  vertical-align: middle;
}

.breakdown-label {
  display: inline-block;
  margin-left: 10rpx;
  color: rgba(16, 20, 24, 0.52);
  font-size: 24rpx;
  line-height: 78rpx;
  vertical-align: middle;
}

.breakdown-expired {
  color: #ff3b30;
}

.breakdown-expiring {
  color: #ff9500;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 18rpx;
  height: 88rpx;
  margin-top: 28rpx;
  padding: 0 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.6);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.32);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(24rpx);
  -webkit-backdrop-filter: blur(24rpx);
  box-sizing: border-box;
}

.search-mark {
  color: rgba(16, 20, 24, 0.38);
  font-size: 30rpx;
}

.search {
  flex: 1;
  height: 88rpx;
  padding: 0;
  color: #101418;
  font-size: 30rpx;
  box-sizing: border-box;
}

.search-clear {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 42rpx;
  height: 42rpx;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(16, 20, 24, 0.08);
  color: rgba(16, 20, 24, 0.46);
  font-size: 30rpx;
  font-weight: 400;
  line-height: 42rpx;
}

.search-clear::after {
  border: 0;
}

.search-placeholder {
  color: rgba(16, 20, 24, 0.38);
}

.quiet-state {
  display: flex;
  min-height: 520rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 18rpx;
  text-align: center;
  color: rgba(16, 20, 24, 0.48);
}

.quiet-state.compact {
  min-height: 320rpx;
}

.state-kicker {
  color: #4f7f78;
  font-size: 22rpx;
  letter-spacing: 0;
}

.state-title {
  color: #101418;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif;
  font-size: 44rpx;
  font-weight: 600;
  line-height: 1.18;
}

.state-copy {
  max-width: 520rpx;
  color: rgba(16, 20, 24, 0.58);
  font-size: 28rpx;
  line-height: 1.55;
}

.state-actions {
  display: flex;
  gap: 18rpx;
  margin-top: 30rpx;
}

.error {
  color: #ff3b30;
}

.primary-action,
.secondary-action {
  min-width: 180rpx;
  height: 76rpx;
  margin: 0;
  padding: 0 34rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  line-height: 76rpx;
}

.primary-action {
  background: rgba(16, 20, 24, 0.82);
  color: #ffffff;
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}

.secondary-action {
  border: 1rpx solid rgba(255, 255, 255, 0.64);
  background: rgba(255, 255, 255, 0.32);
  color: #4f7f78;
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}

.list {
  display: block;
  margin-top: 28rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.58);
  border-radius: 34rpx;
  background: rgba(255, 255, 255, 0.34);
  overflow: hidden;
  box-shadow: 0 26rpx 58rpx rgba(45, 74, 110, 0.1), inset 0 1rpx 0 rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(30rpx);
  -webkit-backdrop-filter: blur(30rpx);
}

.swipe-row {
  position: relative;
  overflow: hidden;
  background: rgba(229, 72, 63, 0.92);
}

.swipe-delete {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 152rpx;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: rgba(229, 72, 63, 0.92);
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 650;
  line-height: 1;
  opacity: 1;
  pointer-events: none;
}

.swipe-delete::after {
  border: 0;
}

.swipe-row-open .swipe-delete {
  pointer-events: auto;
}

.swipe-delete[disabled] {
  color: rgba(255, 255, 255, 0.72);
  background: rgba(229, 72, 63, 0.62);
}

.item-card {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
  width: 100%;
  min-height: 142rpx;
  margin: 0;
  padding: 22rpx 24rpx;
  border: 0;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.54);
  border-radius: 0;
  background: rgba(250, 252, 255, 0.96);
  text-align: left;
  transform: translate3d(0, 0, 0);
  transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
  box-sizing: border-box;
  backface-visibility: hidden;
}

.swipe-row:last-child .item-card {
  border-bottom: 0;
}

.item-thumb {
  flex: 0 0 auto;
  width: 76rpx;
  height: 76rpx;
  border-radius: 18rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.68);
  box-shadow: inset 0 0 0 1rpx rgba(16, 20, 24, 0.04);
}

.item-thumb-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.64);
}

.placeholder-mark {
  position: relative;
  width: 36rpx;
  height: 32rpx;
  border: 2rpx solid rgba(16, 20, 24, 0.42);
  border-radius: 8rpx;
  background: transparent;
  box-sizing: border-box;
}

.placeholder-dot {
  position: absolute;
  top: 7rpx;
  right: 7rpx;
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(16, 20, 24, 0.42);
  background: transparent;
  box-sizing: border-box;
}

.placeholder-stroke {
  position: absolute;
  height: 2rpx;
  border-radius: 99rpx;
  background: rgba(16, 20, 24, 0.42);
  transform-origin: left center;
}

.placeholder-stroke-left {
  left: 7rpx;
  bottom: 9rpx;
  width: 14rpx;
  transform: rotate(-43deg);
}

.placeholder-stroke-right {
  left: 17rpx;
  bottom: 16rpx;
  width: 13rpx;
  opacity: 0.72;
  transform: rotate(39deg);
}

.item-main {
  flex: 1;
  min-width: 0;
}

.item-name,
.item-meta {
  display: block;
}

.item-name {
  overflow: hidden;
  color: #101418;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  margin-top: 12rpx;
  color: rgba(16, 20, 24, 0.48);
  font-size: 24rpx;
  line-height: 1.35;
  white-space: normal;
}

.status {
  flex: 0 0 auto;
  min-width: 104rpx;
  padding: 9rpx 14rpx;
  border-radius: 999rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.58);
  background: rgba(255, 255, 255, 0.38);
  color: rgba(16, 20, 24, 0.58);
  font-size: 24rpx;
  font-weight: 500;
  text-align: center;
}

.status-expired {
  background: rgba(255, 238, 236, 0.66);
  color: #e5483f;
}

.status-expires-today,
.status-expiring {
  background: rgba(255, 247, 230, 0.72);
  color: #ff9500;
}

.home-skeleton {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  margin-top: 18rpx;
}

.skeleton-surface {
  border: 1rpx solid rgba(255, 255, 255, 0.62);
  background: rgba(255, 255, 255, 0.34);
  box-shadow: 0 26rpx 58rpx rgba(45, 74, 110, 0.09), inset 0 1rpx 0 rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(28rpx);
  -webkit-backdrop-filter: blur(28rpx);
  box-sizing: border-box;
}

.skeleton-dashboard {
  position: relative;
  min-height: 314rpx;
  padding: 34rpx;
  border-radius: 38rpx;
  overflow: hidden;
}

.skeleton-copy {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 64%;
}

.skeleton-meter-abs {
  position: absolute;
  top: 34rpx;
  right: 34rpx;
}

.skeleton-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-top: 54rpx;
}

.skeleton-list {
  border-radius: 34rpx;
  overflow: hidden;
}

.skeleton-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  min-height: 142rpx;
  padding: 22rpx 24rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.54);
  background: rgba(250, 252, 255, 0.58);
  box-sizing: border-box;
}

.skeleton-item:last-child {
  border-bottom: 0;
}

.skeleton-item-copy {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  flex: 1;
  min-width: 0;
}

.glass-modal-field {
  margin-top: 30rpx;
}
</style>
