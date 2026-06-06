<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { FamilyHome, Item } from '@/domain/models';
import { daysUntil } from '@/domain/expiry';
import { getFamilyHome, searchItems } from '@/services/homeService';
import { getNavigationSafeArea } from '@/utils/navigationSafeArea';

const loading = ref(true);
const errorMessage = ref('');
const search = ref('');
const showCreateFamily = ref(false);
const navTopPx = ref(24);
const navHeightPx = ref(40);
const capsuleReservePx = ref(118);
const home = ref<FamilyHome | null>(null);
const visibleItems = ref<Item[]>([]);

const hasFamily = computed(() => Boolean(home.value?.currentFamily));
const needsProfileName = computed(() => Boolean(home.value && !home.value.user.hasSetDisplayName));
const expiredCount = computed(() => visibleItems.value.filter((item) => item.status === 'expired').length);
const expiringCount = computed(() => visibleItems.value.filter((item) => ['expires_today', 'expiring'].includes(item.status)).length);
const attentionCount = computed(() => expiredCount.value + expiringCount.value);
const heroMode = computed(() => (expiredCount.value > 0 ? 'expired' : 'urgent'));
const heroTitle = computed(() => (attentionCount.value > 0 ? '需要处理' : '状态良好'));
const heroNumber = computed(() => attentionCount.value);
const heroCopy = computed(() => (attentionCount.value > 0 ? '件物品需要留意' : '暂无临期或过期物品'));
const shellStyle = computed(() => ({
  paddingTop: `${navTopPx.value + navHeightPx.value + 18}px`
}));
const navStyle = computed(() => ({
  top: `${navTopPx.value}px`,
  minHeight: `${navHeightPx.value}px`,
  paddingRight: `${capsuleReservePx.value}px`
}));

onMounted(() => {
  updateTopSafePadding();
  void loadHome();
});

function updateTopSafePadding() {
  const safeArea = getNavigationSafeArea();

  navTopPx.value = safeArea.navTopPx;
  navHeightPx.value = safeArea.navHeightPx;
  capsuleReservePx.value = safeArea.capsuleReservePx;
}

async function loadHome() {
  loading.value = true;
  errorMessage.value = '';

  try {
    home.value = await getFamilyHome();
    visibleItems.value = home.value.items;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载失败';
  } finally {
    loading.value = false;
  }
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

function goToNewItem() {
  void uni.navigateTo({
    url: '/pages/item-form/index'
  });
}
</script>

<template>
  <view class="page">
    <view class="nav-row" :style="navStyle">
      <view class="nav-title">
          <button v-if="hasFamily" class="family-button">
            <text>{{ home?.currentFamily?.name }}</text>
            <text class="chevron">⌄</text>
          </button>
          <text v-else class="brand">要过期啦</text>
      </view>
    </view>

    <view class="shell" :style="shellStyle">
      <view v-if="loading" class="quiet-state">
        <text class="state-title">正在整理</text>
        <text class="state-copy">稍等一下</text>
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
        <view class="hero" :class="`hero-${heroMode}`">
          <text class="hero-kicker">{{ heroTitle }}</text>
          <text class="hero-number">{{ heroNumber }}</text>
          <text class="hero-copy">{{ heroCopy }}</text>
          <view v-if="attentionCount > 0" class="hero-breakdown">
            <view class="breakdown-item breakdown-expired">
              <text class="breakdown-value">{{ expiredCount }}</text>
              <text class="breakdown-label">已过期</text>
            </view>
            <view class="breakdown-item breakdown-expiring">
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
        </view>

        <view v-if="visibleItems.length === 0" class="quiet-state compact">
          <text class="state-title">没有找到物品</text>
          <text class="state-copy">换个关键词试试</text>
        </view>

        <view v-else class="list">
          <button v-for="item in visibleItems" :key="item.id" class="item-row">
            <view class="item-main">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-meta">{{ getItemMeta(item) }}</text>
            </view>
            <text class="status" :class="getStatusClass(item)">{{ getStatusText(item) }}</text>
          </button>
        </view>
      </view>
    </view>

    <button v-if="hasFamily" class="add-button floating-add" aria-label="新增物品" @click="goToNewItem">＋</button>

    <view v-if="needsProfileName" class="modal-backdrop">
      <view class="modal">
        <text class="modal-title">设置昵称</text>
        <input class="modal-input" placeholder="你的昵称" placeholder-class="search-placeholder" />
        <button class="primary-action modal-action">保存</button>
      </view>
    </view>

    <view v-if="showCreateFamily" class="modal-backdrop">
      <view class="modal">
        <text class="modal-title">创建家庭</text>
        <input class="modal-input" placeholder="家庭名称" placeholder-class="search-placeholder" />
        <view class="modal-actions">
          <button class="secondary-action" @click="showCreateFamily = false">取消</button>
          <button class="primary-action">创建</button>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f4f6f1;
  box-sizing: border-box;
  color: #151713;
}

.shell {
  min-height: 100vh;
  padding: 0 36rpx 56rpx;
  box-sizing: border-box;
}

.nav-row {
  position: fixed;
  left: 36rpx;
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
  color: #151713;
  font-family: "Songti SC", "STSong", serif;
  font-size: 42rpx;
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: 0;
  max-width: 100%;
}

.family-button::after,
.add-button::after,
.primary-action::after,
.secondary-action::after,
.item-row::after {
  border: 0;
}

.chevron {
  color: #7c8378;
  font-family: serif;
  font-size: 34rpx;
}

.add-button {
  margin: 0;
  width: 72rpx;
  height: 72rpx;
  padding: 0;
  border: 1rpx solid #1d211b;
  border-radius: 50%;
  background: #151713;
  color: #f8faf4;
  font-size: 38rpx;
  line-height: 68rpx;
}

.floating-add {
  position: fixed;
  right: 36rpx;
  bottom: calc(44rpx + env(safe-area-inset-bottom));
  z-index: 12;
  width: 92rpx;
  height: 92rpx;
  box-shadow: 0 18rpx 42rpx rgba(21, 23, 19, 0.18);
  font-size: 46rpx;
  line-height: 88rpx;
}

.hero {
  margin-top: 28rpx;
  padding-bottom: 46rpx;
  border-bottom: 1rpx solid rgba(21, 23, 19, 0.14);
}

.hero-kicker {
  display: block;
  color: #596154;
  font-size: 24rpx;
}

.hero-number {
  display: block;
  margin-top: 16rpx;
  font-family: "Songti SC", "STSong", serif;
  font-size: 132rpx;
  font-weight: 500;
  line-height: 0.9;
  letter-spacing: 0;
}

.hero-copy {
  display: block;
  margin-top: 22rpx;
  color: #596154;
  font-size: 26rpx;
}

.hero-expired .hero-kicker,
.hero-expired .hero-number {
  color: #8d2c22;
}

.hero-breakdown {
  display: flex;
  gap: 44rpx;
  margin-top: 34rpx;
}

.breakdown-item {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}

.breakdown-value {
  font-family: "Songti SC", "STSong", serif;
  font-size: 42rpx;
  line-height: 1;
}

.breakdown-label {
  font-size: 24rpx;
}

.breakdown-expired {
  color: #8d2c22;
}

.breakdown-expiring {
  color: #8c5d4a;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 18rpx;
  height: 88rpx;
  margin-top: 36rpx;
  border-bottom: 1rpx solid rgba(21, 23, 19, 0.18);
}

.search-mark {
  color: #596154;
  font-size: 34rpx;
}

.search {
  flex: 1;
  height: 88rpx;
  padding: 0;
  color: #151713;
  font-size: 30rpx;
  box-sizing: border-box;
}

.search-placeholder {
  color: #8a9185;
}

.quiet-state {
  display: flex;
  min-height: 520rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 18rpx;
  text-align: center;
  color: #596154;
}

.quiet-state.compact {
  min-height: 320rpx;
}

.state-kicker {
  color: #8c5d4a;
  font-size: 22rpx;
  letter-spacing: 0;
}

.state-title {
  color: #151713;
  font-family: "Songti SC", "STSong", serif;
  font-size: 44rpx;
  font-weight: 600;
  line-height: 1.18;
}

.state-copy {
  max-width: 520rpx;
  color: #687164;
  font-size: 28rpx;
  line-height: 1.55;
}

.state-actions,
.modal-actions {
  display: flex;
  gap: 18rpx;
  margin-top: 30rpx;
}

.error {
  color: #8d2c22;
}

.primary-action,
.secondary-action {
  min-width: 180rpx;
  height: 76rpx;
  margin: 0;
  padding: 0 34rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  line-height: 76rpx;
}

.primary-action {
  background: #151713;
  color: #f8faf4;
}

.secondary-action {
  border: 1rpx solid rgba(21, 23, 19, 0.2);
  background: transparent;
  color: #151713;
}

.list {
  margin-top: 14rpx;
}

.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  width: 100%;
  min-height: 132rpx;
  margin: 0;
  padding: 28rpx 0;
  border: 0;
  border-bottom: 1rpx solid rgba(21, 23, 19, 0.1);
  border-radius: 0;
  background: transparent;
  text-align: left;
  box-sizing: border-box;
}

.item-main {
  min-width: 0;
}

.item-name,
.item-meta {
  display: block;
}

.item-name {
  overflow: hidden;
  color: #151713;
  font-size: 32rpx;
  font-weight: 500;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  margin-top: 12rpx;
  color: #737b70;
  font-size: 24rpx;
}

.status {
  flex: 0 0 auto;
  min-width: 112rpx;
  padding: 10rpx 0;
  border-radius: 999rpx;
  color: #596154;
  font-size: 24rpx;
  text-align: right;
}

.status-expired {
  color: #8d2c22;
}

.status-expires-today,
.status-expiring {
  color: #8c5d4a;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 32rpx;
  background: rgba(21, 23, 19, 0.32);
  box-sizing: border-box;
}

.modal {
  width: 100%;
  padding: 44rpx 36rpx 36rpx;
  border-radius: 8rpx;
  background: #fbfcf7;
  box-sizing: border-box;
}

.modal-title {
  display: block;
  font-family: "Songti SC", "STSong", serif;
  font-size: 40rpx;
  font-weight: 600;
}

.modal-input {
  height: 92rpx;
  margin-top: 28rpx;
  border-bottom: 1rpx solid rgba(21, 23, 19, 0.18);
  color: #151713;
  font-size: 30rpx;
}

.modal-action {
  width: 100%;
  margin-top: 34rpx;
}
</style>
