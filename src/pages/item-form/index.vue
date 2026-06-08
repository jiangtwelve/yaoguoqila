<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import AppNavBar from '@/components/AppNavBar.vue';
import { calculateExpiryDate, getItemStatus } from '@/domain/expiry';
import type { ExpiryInputMode, Item, ItemFormOptions, ItemInput, ShelfLifeUnit } from '@/domain/models';
import { createItem, getItemDetail, getItemFormOptions, updateItem } from '@/services/homeService';
import { getNavigationSafeArea } from '@/utils/navigationSafeArea';
import { markHomeNeedsRefresh, markItemDetailNeedsRefresh } from '@/utils/pageRefresh';

const loading = ref(true);
const saving = ref(false);
const errorMessage = ref('');
const options = ref<ItemFormOptions | null>(null);
const itemId = ref('');

const name = ref('');
const imageUrls = ref<string[]>([]);
const note = ref('');
const locationName = ref('');
const expiryInputMode = ref<ExpiryInputMode>('explicit_date');
const expiresAt = ref('');
const productionDate = ref('');
const shelfLifeValue = ref('');
const shelfLifeUnit = ref<ShelfLifeUnit>('month');
const shelfLifeUnits: Array<{ label: string; value: ShelfLifeUnit }> = [
  { label: '天', value: 'day' },
  { label: '月', value: 'month' },
  { label: '年', value: 'year' }
];
const placeholderStyle = 'color: rgba(16, 20, 24, 0.38); font-size: 28rpx; line-height: 1.35;';

const navTopPx = ref(24);
const navHeightPx = ref(40);
const capsuleReservePx = ref(118);

const shellStyle = computed(() => ({
  paddingTop: `${navTopPx.value + navHeightPx.value + 28}px`
}));
const navStyle = computed(() => ({
  top: `${navTopPx.value}px`,
  minHeight: `${navHeightPx.value}px`,
  paddingRight: `${capsuleReservePx.value}px`
}));
const isEditing = computed(() => Boolean(itemId.value));
const pageTitle = computed(() => (isEditing.value ? '编辑物品' : '新增物品'));

const shelfLifeUnitLabel = computed(() => {
  if (shelfLifeUnit.value === 'day') return '天';
  if (shelfLifeUnit.value === 'year') return '年';

  return '月';
});

const canSave = computed(() => {
  if (!name.value.trim()) return false;
  if (expiryInputMode.value === 'explicit_date') return Boolean(expiresAt.value);

  return Boolean(productionDate.value && shelfLifeValue.value && calculatedExpiresAt.value);
});

const calculatedExpiresAt = computed(() => {
  const value = Number(shelfLifeValue.value);

  if (!productionDate.value || !Number.isFinite(value) || value <= 0) return '';

  return calculateExpiryDate(productionDate.value, value, shelfLifeUnit.value);
});
const calculatedStatusClass = computed(() => {
  if (!calculatedExpiresAt.value) return '';

  return `calculated-${getItemStatus(calculatedExpiresAt.value).replace('_', '-')}`;
});

onLoad((query) => {
  itemId.value = typeof query?.id === 'string' ? query.id : '';
});

onMounted(() => {
  updateNavSafeArea();
  void loadForm();
});

function updateNavSafeArea() {
  const safeArea = getNavigationSafeArea();

  navTopPx.value = safeArea.navTopPx;
  navHeightPx.value = safeArea.navHeightPx;
  capsuleReservePx.value = safeArea.capsuleReservePx;
}

async function loadForm() {
  loading.value = true;
  errorMessage.value = '';

  try {
    options.value = await getItemFormOptions();
    if (itemId.value) {
      const detail = await getItemDetail(itemId.value);
      fillForm(detail.item, detail.locationName);
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载失败';
  } finally {
    loading.value = false;
  }
}

function fillForm(item: Item, fallbackLocationName: string | null) {
  name.value = item.name;
  imageUrls.value = item.imageUrls.length ? [...item.imageUrls] : item.imageUrl ? [item.imageUrl] : [];
  note.value = item.note ?? '';
  locationName.value = item.locationName ?? fallbackLocationName ?? '';
  expiryInputMode.value = item.expiryInputMode;
  expiresAt.value = item.expiresAt;
  productionDate.value = item.productionDate ?? '';
  shelfLifeValue.value = item.shelfLifeValue ? String(item.shelfLifeValue) : '';
  shelfLifeUnit.value = item.shelfLifeUnit ?? 'month';
}

function chooseImage() {
  uni.chooseImage({
    count: Math.max(1, 9 - imageUrls.value.length),
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (result) => {
      imageUrls.value = [...imageUrls.value, ...result.tempFilePaths].slice(0, 9);
    }
  });
}

function removeImage(index: number) {
  imageUrls.value = imageUrls.value.filter((_, currentIndex) => currentIndex !== index);
}

function setExpiryMode(mode: ExpiryInputMode) {
  expiryInputMode.value = mode;
}

function setLocationName(nameValue: string) {
  locationName.value = nameValue;
}

function handleExpiresAtChange(event: { detail: { value: string } }) {
  expiresAt.value = event.detail.value;
}

function handleProductionDateChange(event: { detail: { value: string } }) {
  productionDate.value = event.detail.value;
}

function handleShelfLifeUnitChange(event: { detail: { value: number | string } }) {
  const index = Number(event.detail.value);
  const selected = shelfLifeUnits[index];

  if (selected) {
    shelfLifeUnit.value = selected.value;
  }
}

async function saveItem() {
  if (!options.value?.family || !canSave.value) return;

  saving.value = true;
  errorMessage.value = '';

  const locationText = locationName.value.trim();
  const matchedLocation = options.value.locations.find((location) => location.name === locationText);
  const finalExpiresAt = expiryInputMode.value === 'explicit_date' ? expiresAt.value : calculatedExpiresAt.value;
  const input: ItemInput = {
    name: name.value.trim(),
    imageUrl: imageUrls.value[0] ?? null,
    imageUrls: imageUrls.value,
    categoryId: null,
    locationId: matchedLocation?.id ?? null,
    locationName: locationText || null,
    expiryInputMode: expiryInputMode.value,
    productionDate: expiryInputMode.value === 'production_date_and_shelf_life' ? productionDate.value : null,
    shelfLifeValue: expiryInputMode.value === 'production_date_and_shelf_life' ? Number(shelfLifeValue.value) : null,
    shelfLifeUnit: expiryInputMode.value === 'production_date_and_shelf_life' ? shelfLifeUnit.value : null,
    expiresAt: finalExpiresAt,
    reminderDaysBefore: [1, 3],
    note: note.value.trim() || null
  };

  try {
    let savedItemId: string | undefined;

    if (itemId.value) {
      const updatedItem = await updateItem(itemId.value, input);
      savedItemId = updatedItem.id;
    } else {
      const createdItem = await createItem(options.value.family.id, input);
      savedItemId = createdItem.id;
    }

    markHomeNeedsRefresh(savedItemId);
    if (itemId.value && savedItemId) {
      markItemDetailNeedsRefresh(savedItemId);
    }
    uni.navigateBack();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '保存失败';
  } finally {
    saving.value = false;
  }
}

function goBack() {
  uni.navigateBack();
}
</script>

<template>
  <view class="page">
    <AppNavBar :title="pageTitle" :nav-style="navStyle" show-back @back="goBack" />

    <view class="shell" :style="shellStyle">
      <view v-if="loading" class="quiet-state">
        <text class="state-title">正在准备</text>
        <text class="state-copy">稍等一下</text>
      </view>

      <view v-else-if="!options?.family" class="quiet-state">
        <text class="state-title">还没有家庭</text>
        <text class="state-copy">创建或加入家庭后再录入物品。</text>
      </view>

      <view v-else class="form">
        <view class="photo-field">
          <view class="photo-grid">
            <view v-for="(url, index) in imageUrls" :key="url" class="photo-tile">
              <image class="photo-preview" :src="url" mode="aspectFill" />
              <text v-if="index === 0" class="cover-badge">封面</text>
              <button class="remove-photo" @click="removeImage(index)">×</button>
            </view>
            <button v-if="imageUrls.length < 9" class="photo-picker" @click="chooseImage">
              <text class="photo-plus">＋</text>
              <text class="photo-copy">{{ imageUrls.length ? '继续添加' : '上传图片' }}</text>
            </button>
          </view>
        </view>

        <label class="field">
          <text class="label">名称 <text class="required-mark">*</text></text>
          <input v-model="name" class="input" placeholder="例如 鲜牛奶" :placeholder-style="placeholderStyle" />
        </label>

        <view class="date-panel">
          <view class="date-head">
            <text class="label">日期 <text class="required-mark">*</text></text>
            <text class="hint">任选一种</text>
          </view>

          <view class="date-mode" :class="{ active: expiryInputMode === 'explicit_date' }" @click="setExpiryMode('explicit_date')">
            <text class="mode-title">直接填写过期日期</text>
            <picker mode="date" :value="expiresAt" @change="handleExpiresAtChange">
              <view class="picker-value" :class="{ empty: !expiresAt }">
                <text>{{ expiresAt || '选择过期日期' }}</text>
                <text class="picker-arrow">⌄</text>
              </view>
            </picker>
          </view>

          <view class="or-line">
            <text>或</text>
          </view>

          <view class="date-mode" :class="{ active: expiryInputMode === 'production_date_and_shelf_life' }" @click="setExpiryMode('production_date_and_shelf_life')">
            <text class="mode-title">生产日期 + 保质期</text>
            <view class="formula-grid">
              <picker mode="date" :value="productionDate" @change="handleProductionDateChange">
                <view class="formula-card">
                  <view class="formula-value" :class="{ empty: !productionDate }">
                    <text>{{ productionDate || '请选择' }}</text>
                    <text class="picker-arrow">⌄</text>
                  </view>
                </view>
              </picker>

              <view class="formula-plus">+</view>

              <view class="formula-card">
                <view class="formula-value shelf-control">
                  <input v-model="shelfLifeValue" class="shelf-input" type="number" placeholder="填写" :placeholder-style="placeholderStyle" />
                  <picker mode="selector" :range="shelfLifeUnits" range-key="label" @change="handleShelfLifeUnitChange">
                    <view class="unit-select">
                      <text>{{ shelfLifeUnitLabel }}</text>
                      <text class="picker-arrow">⌄</text>
                    </view>
                  </picker>
                </view>
              </view>
            </view>
            <view v-if="calculatedExpiresAt" class="calculated" :class="calculatedStatusClass">
              <text class="calculated-label">预计到期</text>
              <text class="calculated-date">{{ calculatedExpiresAt }}</text>
            </view>
          </view>
        </view>

        <label class="field">
          <text class="label">位置</text>
          <input v-model="locationName" class="input" placeholder="例如 冰箱冷藏" :placeholder-style="placeholderStyle" />
          <view v-if="options.locations.length" class="history-row">
            <button
              v-for="location in options.locations"
              :key="location.id"
              class="choice"
              :class="{ selected: locationName === location.name }"
              @click="setLocationName(location.name)"
            >
              {{ location.name }}
            </button>
          </view>
        </label>

        <label class="field">
          <text class="label">备注</text>
          <textarea v-model="note" class="textarea" placeholder="可选" :placeholder-style="placeholderStyle" />
        </label>

        <text v-if="errorMessage" class="error">{{ errorMessage }}</text>

        <button class="save-button" :class="{ disabled: !canSave || saving }" :disabled="!canSave || saving" @click="saveItem">
          {{ saving ? '保存中' : isEditing ? '保存修改' : '保存' }}
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background:
    linear-gradient(155deg, rgba(232, 246, 255, 0.98) 0%, rgba(249, 242, 255, 0.96) 44%, rgba(241, 250, 244, 0.98) 100%);
  color: #101418;
  overflow: hidden;
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
  padding: 0 30rpx calc(180rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.choice,
.date-mode,
.save-button,
.photo-picker,
.remove-photo {
  margin: 0;
}

.choice::after,
.date-mode::after,
.save-button::after,
.photo-picker::after,
.remove-photo::after {
  border: 0;
}

.state-title {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif;
  color: #101418;
  font-size: 38rpx;
  font-weight: 760;
  line-height: 1.15;
}

.form {
  margin-top: 24rpx;
  padding-bottom: 24rpx;
}

.photo-field {
  padding: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.62);
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.34);
  box-shadow: 0 26rpx 58rpx rgba(45, 74, 110, 0.11), inset 0 1rpx 0 rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(30rpx);
  -webkit-backdrop-filter: blur(30rpx);
  box-sizing: border-box;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
}

.photo-tile,
.photo-picker {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  border-radius: 22rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.58);
  background: rgba(255, 255, 255, 0.34);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  overflow: hidden;
}

.photo-preview {
  width: 100%;
  height: 100%;
}

.photo-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8rpx;
  color: rgba(16, 20, 24, 0.48);
}

.photo-plus {
  color: #4f7f78;
  font-size: 42rpx;
  line-height: 1;
}

.photo-copy,
.remove-photo {
  font-size: 24rpx;
}

.cover-badge {
  position: absolute;
  left: 10rpx;
  bottom: 10rpx;
  height: 34rpx;
  padding: 0 12rpx;
  border-radius: 99rpx;
  background: rgba(16, 20, 24, 0.52);
  color: #fff;
  font-size: 20rpx;
  line-height: 34rpx;
  backdrop-filter: blur(14rpx);
  -webkit-backdrop-filter: blur(14rpx);
}

.remove-photo {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36rpx;
  height: 36rpx;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background: rgba(16, 20, 24, 0.48);
  color: #fff;
  font-size: 28rpx;
  line-height: 36rpx;
  backdrop-filter: blur(14rpx);
  -webkit-backdrop-filter: blur(14rpx);
}

.field {
  display: block;
  margin-top: 18rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.62);
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.34);
  box-shadow: 0 20rpx 46rpx rgba(45, 74, 110, 0.09), inset 0 1rpx 0 rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(28rpx);
  -webkit-backdrop-filter: blur(28rpx);
  box-sizing: border-box;
}

.label {
  display: block;
  margin-bottom: 18rpx;
  color: rgba(16, 20, 24, 0.46);
  font-size: 24rpx;
  font-weight: 500;
}

.required-mark {
  color: #e5483f;
  font-weight: 700;
}

.input,
.textarea {
  width: 100%;
  min-height: 72rpx;
  padding: 0;
  color: #101418;
  font-size: 32rpx;
  line-height: 1.35;
}

.textarea {
  min-height: 132rpx;
}

.history-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 20rpx;
}

.choice {
  height: 58rpx;
  padding: 0 22rpx;
  border: 0;
  border-radius: 999rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.58);
  background: rgba(255, 255, 255, 0.34);
  color: rgba(16, 20, 24, 0.58);
  font-size: 24rpx;
  line-height: 58rpx;
}

.selected,
.active {
  background: rgba(229, 241, 255, 0.68);
  color: #4f7f78;
}

.date-panel {
  margin-top: 18rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.62);
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.34);
  box-shadow: 0 20rpx 46rpx rgba(45, 74, 110, 0.09), inset 0 1rpx 0 rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(28rpx);
  -webkit-backdrop-filter: blur(28rpx);
  box-sizing: border-box;
}

.date-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.hint {
  color: rgba(16, 20, 24, 0.38);
  font-size: 22rpx;
}

.date-mode {
  width: 100%;
  padding: 24rpx;
  border: 0;
  border-radius: 18rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.56);
  background: rgba(255, 255, 255, 0.28);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  text-align: left;
  box-sizing: border-box;
}

.mode-title {
  display: block;
  margin-bottom: 12rpx;
  color: #101418;
  font-size: 28rpx;
  font-weight: 600;
}

.picker-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 58rpx;
  color: #101418;
  font-size: 28rpx;
}

.picker-value.empty {
  color: rgba(16, 20, 24, 0.38);
}

.picker-arrow {
  color: rgba(16, 20, 24, 0.38);
  font-size: 26rpx;
}

.or-line {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 62rpx;
  color: rgba(16, 20, 24, 0.38);
  font-size: 24rpx;
}

.formula-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 42rpx minmax(0, 1fr);
  align-items: stretch;
  gap: 12rpx;
  margin-top: 14rpx;
}

.formula-card {
  display: flex;
  min-height: 112rpx;
  padding: 20rpx;
  align-items: center;
  border: 1rpx solid rgba(255, 255, 255, 0.58);
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.24);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.7);
  box-sizing: border-box;
}

.formula-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  width: 100%;
  min-width: 0;
  min-height: 64rpx;
  color: #101418;
  font-size: 32rpx;
  line-height: 1.35;
}

.formula-value.empty {
  color: rgba(16, 20, 24, 0.38);
  font-size: 28rpx;
}

.formula-plus {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(16, 20, 24, 0.42);
  font-size: 34rpx;
  font-weight: 500;
}

.shelf-control {
  justify-content: flex-end;
}

.shelf-input {
  width: 104rpx;
  min-width: 0;
  min-height: 68rpx;
  padding: 0;
  color: #101418;
  font-size: 32rpx;
  line-height: 1.35;
  text-align: right;
}

.unit-select {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6rpx;
  flex: 0 0 auto;
  min-width: 70rpx;
  height: 54rpx;
  padding: 0 12rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.56);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.28);
  color: #101418;
  font-size: 28rpx;
  line-height: 54rpx;
  box-sizing: border-box;
}

.calculated {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  min-height: 66rpx;
  margin-top: 18rpx;
  padding: 0 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.58);
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.24);
  box-sizing: border-box;
  color: #4f7f78;
  font-size: 24rpx;
}

.calculated-label {
  color: rgba(16, 20, 24, 0.48);
}

.calculated-date {
  font-size: 28rpx;
  font-weight: 700;
}

.calculated-normal {
  color: #4f7f78;
}

.calculated-expiring,
.calculated-expires-today {
  color: #ff9500;
}

.calculated-expired {
  color: #e5483f;
}

.save-button {
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: calc(24rpx + env(safe-area-inset-bottom));
  z-index: 30;
  width: auto;
  height: 88rpx;
  margin-top: 0;
  border-radius: 999rpx;
  background: rgba(16, 20, 24, 0.82);
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 88rpx;
  box-shadow: 0 20rpx 46rpx rgba(30, 70, 110, 0.24);
  backdrop-filter: blur(24rpx);
  -webkit-backdrop-filter: blur(24rpx);
}

.disabled {
  opacity: 0.42;
}

.quiet-state {
  display: flex;
  min-height: 520rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 18rpx;
  text-align: center;
}

.state-copy,
.error {
  color: rgba(16, 20, 24, 0.58);
  font-size: 28rpx;
}

.error {
  display: block;
  margin-top: 24rpx;
  color: #e5483f;
}
</style>
