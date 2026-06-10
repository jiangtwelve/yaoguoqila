<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad, onPullDownRefresh, onShow } from '@dcloudio/uni-app';
import AppNavBar from '@/components/AppNavBar.vue';
import type { Item, ItemDetail } from '@/domain/models';
import { daysUntil } from '@/domain/expiry';
import { consumeItem, deleteItem, getItemDetail } from '@/services/homeService';
import { getNavigationSafeArea } from '@/utils/navigationSafeArea';
import { consumeItemDetailNeedsRefresh, markHomeNeedsRefresh } from '@/utils/pageRefresh';
import { MOCK_PULL_DOWN_REFRESH_FAILURE, waitForFailedRefreshIndicator, waitForMinimumRefreshIndicator } from '@/utils/pullDownRefresh';

type PullRefreshState = 'idle' | 'refreshing' | 'failed';

const itemId = ref('');
const loading = ref(true);
const operating = ref(false);
const pullRefreshState = ref<PullRefreshState>('idle');
const errorMessage = ref('');
const detail = ref<ItemDetail | null>(null);
const detailSafeArea = getNavigationSafeArea();
const navTopPx = ref(detailSafeArea.navTopPx);
const navHeightPx = ref(detailSafeArea.navHeightPx);
const capsuleReservePx = ref(detailSafeArea.capsuleReservePx);

const item = computed(() => detail.value?.item ?? null);
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
const statusClass = computed(() => (item.value ? `status-${item.value.status.replace('_', '-')}` : ''));
const statusText = computed(() => (item.value ? getStatusText(item.value) : ''));
const daysText = computed(() => (item.value ? getDaysText(item.value) : ''));
const coverImage = computed(() => (item.value ? item.value.imageUrls[0] ?? item.value.imageUrl ?? null : null));
const itemImages = computed(() => {
  if (!item.value) return [];

  return item.value.imageUrls.length ? item.value.imageUrls : item.value.imageUrl ? [item.value.imageUrl] : [];
});
const dateModeText = computed(() => {
  if (!item.value) return '';
  if (item.value.expiryInputMode === 'production_date_and_shelf_life') {
    return `生产日期 ${item.value.productionDate ?? '未填写'} · 保质期 ${item.value.shelfLifeValue ?? '-'} ${getShelfLifeUnitText(item.value.shelfLifeUnit)}`;
  }

  return '直接填写过期日期';
});

onLoad((query) => {
  updateTopSafePadding();
  itemId.value = typeof query?.id === 'string' ? query.id : '';
  void loadDetail();
});

onShow(() => {
  if (itemId.value && consumeItemDetailNeedsRefresh(itemId.value)) {
    void loadDetail();
  }
});

onPullDownRefresh(() => {
  void refreshDetail();
});

function updateTopSafePadding() {
  const safeArea = getNavigationSafeArea();

  navTopPx.value = safeArea.navTopPx;
  navHeightPx.value = safeArea.navHeightPx;
  capsuleReservePx.value = safeArea.capsuleReservePx;
}

async function loadDetail(): Promise<boolean> {
  if (!itemId.value) {
    errorMessage.value = '缺少物品信息';
    loading.value = false;
    return false;
  }

  loading.value = !detail.value;
  errorMessage.value = '';

  try {
    detail.value = await getItemDetail(itemId.value);
    return true;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载失败';
    return false;
  } finally {
    loading.value = false;
  }
}

async function refreshDetail() {
  const startedAt = Date.now();
  let refreshed = false;

  uni.stopPullDownRefresh();
  pullRefreshState.value = 'refreshing';

  try {
    if (MOCK_PULL_DOWN_REFRESH_FAILURE) {
      refreshed = false;
    } else {
      refreshed = await loadDetail();
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

function goBack() {
  void uni.navigateBack();
}

function goEdit() {
  if (!item.value) return;

  void uni.navigateTo({
    url: `/pages/item-form/index?id=${item.value.id}`
  });
}

async function handleConsume() {
  if (!item.value || operating.value || item.value.status === 'consumed') return;

  operating.value = true;
  try {
    await consumeItem(item.value.id);
    markHomeNeedsRefresh();
    await loadDetail();
    void uni.showToast({ title: '已标记用完', icon: 'success' });
  } catch (error) {
    void uni.showToast({ title: error instanceof Error ? error.message : '操作失败', icon: 'none' });
  } finally {
    operating.value = false;
  }
}

function confirmDelete() {
  if (!item.value || operating.value) return;

  void uni.showModal({
    title: '删除物品',
    content: `确认删除「${item.value.name}」吗？`,
    confirmText: '删除',
    confirmColor: '#e5483f',
    success: (result) => {
      if (result.confirm) {
        void handleDelete();
      }
    }
  });
}

async function handleDelete() {
  if (!item.value) return;

  operating.value = true;
  try {
    await deleteItem(item.value.id);
    markHomeNeedsRefresh();
    void uni.showToast({ title: '已删除', icon: 'success' });
    setTimeout(() => {
      void uni.navigateBack();
    }, 350);
  } catch (error) {
    void uni.showToast({ title: error instanceof Error ? error.message : '删除失败', icon: 'none' });
  } finally {
    operating.value = false;
  }
}

function getStatusText(target: Item): string {
  if (target.status === 'expired') return '已经过期';
  if (target.status === 'expires_today') return '今天到期';
  if (target.status === 'expiring') return '即将到期';
  if (target.status === 'consumed') return '已用完';

  return '状态正常';
}

function getDaysText(target: Item): string {
  if (target.status === 'consumed') return '这个物品已经处理完成';

  const days = daysUntil(target.expiresAt);
  if (days < 0) return `已过期 ${Math.abs(days)} 天`;
  if (days === 0) return '今天是最后一天';

  return `还剩 ${days} 天`;
}

function getShelfLifeUnitText(unit: Item['shelfLifeUnit']): string {
  if (unit === 'day') return '天';
  if (unit === 'year') return '年';

  return '月';
}

function previewImage(index: number) {
  if (!itemImages.value.length) return;

  void uni.previewImage({
    urls: itemImages.value,
    current: itemImages.value[index]
  });
}
</script>

<template>
  <view class="page">
    <AppNavBar title="物品详情" :nav-style="navStyle" show-back @back="goBack" />

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
      <view v-if="loading" class="detail-skeleton" aria-label="加载中">
        <view class="skeleton-hero skeleton-surface">
          <view class="skeleton-photo"></view>
          <view class="skeleton-line tiny"></view>
          <view class="skeleton-line title"></view>
          <view class="skeleton-line medium"></view>
        </view>

        <view class="skeleton-panel skeleton-surface">
          <view class="skeleton-line tiny"></view>
          <view class="skeleton-line date"></view>
          <view class="skeleton-line medium"></view>
        </view>

        <view class="skeleton-panel skeleton-surface">
          <view class="skeleton-line tiny"></view>
          <view class="skeleton-row"></view>
          <view class="skeleton-row short"></view>
        </view>
      </view>

      <view v-else-if="errorMessage" class="quiet-state error">
        <text class="state-title">加载失败</text>
        <text class="state-copy">{{ errorMessage }}</text>
      </view>

      <view v-else-if="item" class="detail-stack">
        <view class="hero-card" :class="[statusClass, coverImage ? 'hero-with-image' : 'hero-no-image']">
          <view v-if="coverImage" class="hero-image-wrap">
            <swiper class="hero-swiper" indicator-dots circular indicator-color="rgba(255, 255, 255, 0.46)" indicator-active-color="#ffffff">
              <swiper-item v-for="(url, index) in itemImages" :key="url">
                <image class="hero-image" :src="url" mode="aspectFill" @click="previewImage(index)" />
              </swiper-item>
            </swiper>
            <text v-if="itemImages.length > 1" class="image-count">{{ itemImages.length }} 张</text>
            <text class="status-pill">{{ statusText }}</text>
          </view>

          <view v-else class="hero-image-wrap">
            <view class="empty-photo">
              <view class="empty-photo-mark">
                <view class="empty-photo-corner"></view>
                <view class="empty-photo-sun"></view>
                <view class="empty-photo-line empty-photo-line-long"></view>
                <view class="empty-photo-line empty-photo-line-short"></view>
              </view>
              <text class="empty-photo-text">暂无图片</text>
            </view>
            <text class="status-pill">{{ statusText }}</text>
          </view>

          <view class="hero-copy">
            <text class="family-name">{{ detail?.family?.name ?? '当前家庭' }}</text>
            <text class="item-name">{{ item.name }}</text>
            <text class="days-text">{{ daysText }}</text>
          </view>
        </view>

        <view class="date-panel" :class="statusClass">
          <text class="date-label">到期日</text>
          <text class="date-value">{{ item.expiresAt }}</text>
          <text class="date-desc">{{ dateModeText }}</text>
        </view>

        <view class="info-panel">
          <text class="section-title">物品信息</text>
          <view class="info-row">
            <text class="info-label">位置</text>
            <text class="info-value">{{ detail?.locationName || '未填写' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">备注</text>
            <text class="info-value">{{ item.note || '未填写' }}</text>
          </view>
        </view>

        <view class="action-panel">
          <button class="action-button primary-action" :disabled="operating || item.status === 'consumed'" @click="handleConsume">
            <text class="action-icon">✓</text>
            <text>用完</text>
          </button>
          <button class="action-button secondary-action" :disabled="operating" @click="goEdit">
            <text class="action-icon">✎</text>
            <text>编辑</text>
          </button>
          <button class="action-button danger-action" :disabled="operating" @click="confirmDelete">
            <text class="action-icon">×</text>
            <text>删除</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
button {
  padding: 0;
  border: 0;
  background: transparent;
  line-height: normal;
}

button::after {
  border: 0;
}

.page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 8%, rgba(255, 255, 255, 0.82), transparent 28%),
    linear-gradient(150deg, #eef4f1 0%, #f8f5ee 48%, #edf1ef 100%);
  color: #101418;
}

.shell {
  position: relative;
  padding-right: 28rpx;
  padding-bottom: calc(154rpx + env(safe-area-inset-bottom));
  padding-left: 28rpx;
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

.quiet-state {
  display: flex;
  min-height: 520rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  text-align: center;
}

.state-title {
  font-size: 34rpx;
  font-weight: 650;
}

.state-copy {
  color: rgba(16, 20, 24, 0.48);
  font-size: 26rpx;
}

.error .state-title {
  color: #e5483f;
}

.detail-skeleton {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.skeleton-surface {
  border: 1rpx solid rgba(255, 255, 255, 0.68);
  background: rgba(255, 255, 255, 0.46);
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.76),
    0 18rpx 46rpx rgba(51, 86, 81, 0.09);
  backdrop-filter: blur(22rpx);
  -webkit-backdrop-filter: blur(22rpx);
  box-sizing: border-box;
}

.skeleton-hero {
  padding: 22rpx;
  border-radius: 32rpx;
}

.skeleton-panel {
  padding: 24rpx 28rpx;
  border-radius: 32rpx;
}

.skeleton-photo,
.skeleton-line,
.skeleton-row {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.58);
}

.skeleton-photo::after,
.skeleton-line::after,
.skeleton-row::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.74) 48%, transparent 100%);
  transform: translateX(-100%);
  animation: skeleton-shimmer 1.45s ease-in-out infinite;
}

.skeleton-photo {
  width: 100%;
  height: 356rpx;
  border-radius: 26rpx;
}

.skeleton-line {
  border-radius: 999rpx;
}

.skeleton-line.tiny {
  width: 156rpx;
  height: 24rpx;
  margin-top: 24rpx;
}

.skeleton-line.title {
  width: 300rpx;
  height: 54rpx;
  margin-top: 16rpx;
  border-radius: 18rpx;
}

.skeleton-line.medium {
  width: 380rpx;
  height: 28rpx;
  margin-top: 16rpx;
}

.skeleton-line.date {
  width: 220rpx;
  height: 40rpx;
  margin-top: 14rpx;
  border-radius: 14rpx;
}

.skeleton-row {
  height: 32rpx;
  margin-top: 24rpx;
  border-radius: 12rpx;
}

.skeleton-row.short {
  width: 68%;
}

@keyframes skeleton-shimmer {
  to {
    transform: translateX(100%);
  }
}

.detail-stack {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.hero-card,
.date-panel,
.info-panel,
.action-panel {
  border: 1rpx solid rgba(255, 255, 255, 0.68);
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.46);
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.76),
    0 18rpx 46rpx rgba(51, 86, 81, 0.09);
  backdrop-filter: blur(22rpx);
}

.hero-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 22rpx;
}

.family-name {
  overflow: hidden;
  color: rgba(16, 20, 24, 0.48);
  font-size: 24rpx;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-pill {
  position: absolute;
  top: 18rpx;
  right: 18rpx;
  height: 48rpx;
  padding: 0 20rpx;
  border-radius: 99rpx;
  background: rgba(255, 255, 255, 0.72);
  color: #4f7f78;
  font-size: 24rpx;
  font-weight: 650;
  line-height: 48rpx;
  box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16rpx);
}

.status-expired .status-pill {
  background: rgba(255, 238, 236, 0.82);
  color: #e5483f;
}

.status-expiring .status-pill,
.status-expires-today .status-pill {
  background: rgba(255, 247, 230, 0.86);
  color: #b86b00;
}

.status-consumed .status-pill {
  background: rgba(16, 20, 24, 0.08);
  color: rgba(16, 20, 24, 0.5);
}

.hero-image-wrap {
  position: relative;
  width: 100%;
}

.hero-swiper,
.hero-image {
  width: 100%;
  height: 356rpx;
  border-radius: 26rpx;
  overflow: hidden;
}

.hero-swiper {
  background: rgba(255, 255, 255, 0.68);
  box-shadow: inset 0 0 0 1rpx rgba(16, 20, 24, 0.04);
}

.hero-image {
  display: block;
}

.image-count {
  position: absolute;
  left: 18rpx;
  bottom: 18rpx;
  height: 42rpx;
  padding: 0 16rpx;
  border-radius: 99rpx;
  background: rgba(16, 20, 24, 0.36);
  color: #fff;
  font-size: 22rpx;
  line-height: 42rpx;
  backdrop-filter: blur(14rpx);
  -webkit-backdrop-filter: blur(14rpx);
}

.empty-photo {
  position: relative;
  display: flex;
  width: 100%;
  height: 356rpx;
  overflow: hidden;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 18rpx;
  border-radius: 26rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 0 0 1rpx rgba(16, 20, 24, 0.04);
}

.empty-photo-mark {
  position: relative;
  width: 112rpx;
  height: 86rpx;
  border: 3rpx solid rgba(79, 127, 120, 0.28);
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.26);
  box-sizing: border-box;
}

.empty-photo-corner {
  position: absolute;
  top: -3rpx;
  right: -3rpx;
  width: 28rpx;
  height: 28rpx;
  border-top: 3rpx solid rgba(79, 127, 120, 0.22);
  border-right: 3rpx solid rgba(79, 127, 120, 0.22);
  border-radius: 0 22rpx 0 0;
}

.empty-photo-sun {
  position: absolute;
  top: 20rpx;
  right: 24rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: rgba(79, 127, 120, 0.26);
}

.empty-photo-line {
  position: absolute;
  left: 26rpx;
  height: 4rpx;
  border-radius: 99rpx;
  background: rgba(79, 127, 120, 0.2);
}

.empty-photo-line-long {
  right: 24rpx;
  bottom: 30rpx;
}

.empty-photo-line-short {
  width: 36rpx;
  bottom: 20rpx;
}

.empty-photo-text {
  position: relative;
  color: rgba(16, 20, 24, 0.36);
  font-size: 24rpx;
}

.hero-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 8rpx;
  padding: 0 4rpx 4rpx;
}

.item-name {
  overflow: hidden;
  font-size: 52rpx;
  font-weight: 720;
  line-height: 1.12;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.days-text {
  color: #4f7f78;
  font-size: 30rpx;
  font-weight: 650;
}

.status-expired .days-text {
  color: #e5483f;
}

.status-expiring .days-text,
.status-expires-today .days-text {
  color: #b86b00;
}

.status-consumed .days-text {
  color: rgba(16, 20, 24, 0.48);
}

.expiry-text {
  color: rgba(16, 20, 24, 0.45);
  font-size: 25rpx;
}

.date-panel {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx 28rpx;
  box-sizing: border-box;
}

.date-panel {
  background: rgba(79, 127, 120, 0.08);
}

.status-expired.date-panel {
  background: rgba(229, 72, 63, 0.08);
}

.status-expiring.date-panel,
.status-expires-today.date-panel {
  background: rgba(255, 149, 0, 0.09);
}

.date-label {
  color: rgba(16, 20, 24, 0.42);
  font-size: 23rpx;
}

.date-value {
  color: #4f7f78;
  font-size: 38rpx;
  font-weight: 720;
  line-height: 1.15;
}

.status-expired .date-value {
  color: #e5483f;
}

.status-expiring .date-value,
.status-expires-today .date-value {
  color: #b86b00;
}

.date-desc {
  margin-top: 2rpx;
  color: rgba(16, 20, 24, 0.42);
  font-size: 23rpx;
  line-height: 1.35;
}

.info-panel {
  padding: 22rpx 28rpx 4rpx;
}

.section-title {
  display: block;
  margin-bottom: 6rpx;
  color: rgba(16, 20, 24, 0.42);
  font-size: 23rpx;
  font-weight: 650;
}

.info-row {
  display: flex;
  gap: 26rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.58);
}

.info-row:last-child {
  border-bottom: 0;
}

.info-label {
  flex: 0 0 76rpx;
  color: rgba(16, 20, 24, 0.42);
  font-size: 25rpx;
}

.info-value {
  flex: 1;
  color: rgba(16, 20, 24, 0.78);
  font-size: 28rpx;
  line-height: 1.45;
}

.action-panel {
  position: fixed;
  left: 28rpx;
  right: 28rpx;
  bottom: calc(24rpx + env(safe-area-inset-bottom));
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  padding: 14rpx;
}

.action-button {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 92rpx;
  gap: 6rpx;
  border-radius: 22rpx;
  font-size: 23rpx;
  font-weight: 650;
  box-sizing: border-box;
}

.action-icon {
  font-size: 28rpx;
  line-height: 1;
}

.primary-action {
  background: rgba(79, 127, 120, 0.12);
  color: #4f7f78;
}

.secondary-action {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(238, 245, 243, 0.74));
  color: #335d58;
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.92),
    0 8rpx 18rpx rgba(51, 86, 81, 0.06);
}

.danger-action {
  background: rgba(229, 72, 63, 0.09);
  color: #e5483f;
}

.primary-action[disabled],
.secondary-action[disabled],
.danger-action[disabled] {
  opacity: 0.48;
}
</style>
