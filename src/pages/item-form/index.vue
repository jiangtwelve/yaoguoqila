<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { calculateExpiryDate } from '@/domain/expiry';
import type { ExpiryInputMode, ItemFormOptions, ShelfLifeUnit } from '@/domain/models';
import { createItem, getItemFormOptions } from '@/services/homeService';
import { getNavigationSafeArea } from '@/utils/navigationSafeArea';

const loading = ref(true);
const saving = ref(false);
const errorMessage = ref('');
const options = ref<ItemFormOptions | null>(null);

const name = ref('');
const imageUrl = ref<string | null>(null);
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

onMounted(() => {
  updateNavSafeArea();
  void loadOptions();
});

function updateNavSafeArea() {
  const safeArea = getNavigationSafeArea();

  navTopPx.value = safeArea.navTopPx;
  navHeightPx.value = safeArea.navHeightPx;
  capsuleReservePx.value = safeArea.capsuleReservePx;
}

async function loadOptions() {
  loading.value = true;
  errorMessage.value = '';

  try {
    options.value = await getItemFormOptions();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载失败';
  } finally {
    loading.value = false;
  }
}

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (result) => {
      imageUrl.value = result.tempFilePaths[0] ?? null;
    }
  });
}

function removeImage() {
  imageUrl.value = null;
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

  try {
    await createItem(options.value.family.id, {
      name: name.value.trim(),
      imageUrl: imageUrl.value,
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
    });

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
    <view class="nav-row" :style="navStyle">
      <button class="back-button" @click="goBack">‹</button>
      <text class="title">新增物品</text>
    </view>

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
          <button class="photo-picker" @click="chooseImage">
            <image v-if="imageUrl" class="photo-preview" :src="imageUrl" mode="aspectFill" />
            <view v-else class="photo-empty">
              <text class="photo-plus">＋</text>
              <text class="photo-copy">上传图片</text>
            </view>
          </button>
          <button v-if="imageUrl" class="remove-photo" @click="removeImage">移除</button>
        </view>

        <label class="field">
          <text class="label">名称 *</text>
          <input v-model="name" class="input" placeholder="例如 鲜牛奶" placeholder-class="placeholder" />
        </label>

        <view class="date-panel">
          <view class="date-head">
            <text class="label">日期 *</text>
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
            <view class="date-fields">
              <picker mode="date" :value="productionDate" @change="handleProductionDateChange">
                <view class="sub-field">
                  <text class="sub-label">生产日期</text>
                  <view class="sub-value" :class="{ empty: !productionDate }">
                    <text>{{ productionDate || '请选择' }}</text>
                    <text class="picker-arrow">⌄</text>
                  </view>
                </view>
              </picker>

              <view class="sub-field">
                <text class="sub-label">保质期</text>
                <view class="shelf-control">
                  <input v-model="shelfLifeValue" class="shelf-input" type="number" placeholder="填写" placeholder-class="placeholder" />
                  <picker mode="selector" :range="shelfLifeUnits" range-key="label" @change="handleShelfLifeUnitChange">
                    <view class="unit-select">
                      <text>{{ shelfLifeUnitLabel }}</text>
                      <text class="picker-arrow">⌄</text>
                    </view>
                  </picker>
                </view>
              </view>
            </view>
            <text v-if="calculatedExpiresAt" class="calculated">预计到期 {{ calculatedExpiresAt }}</text>
          </view>
        </view>

        <label class="field">
          <text class="label">位置</text>
          <input v-model="locationName" class="input" placeholder="例如 冰箱冷藏" placeholder-class="placeholder" />
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
          <textarea v-model="note" class="textarea" placeholder="可选" placeholder-class="placeholder" />
        </label>

        <text v-if="errorMessage" class="error">{{ errorMessage }}</text>

        <button class="save-button" :class="{ disabled: !canSave || saving }" :disabled="!canSave || saving" @click="saveItem">
          {{ saving ? '保存中' : '保存' }}
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f4f6f1;
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
  gap: 18rpx;
  box-sizing: border-box;
  pointer-events: none;
}

.back-button,
.title {
  pointer-events: auto;
}

.back-button,
.choice,
.date-mode,
.save-button,
.photo-picker,
.remove-photo {
  margin: 0;
}

.back-button::after,
.choice::after,
.date-mode::after,
.save-button::after,
.photo-picker::after,
.remove-photo::after {
  border: 0;
}

.back-button {
  width: 58rpx;
  height: 58rpx;
  padding: 0;
  border: 1rpx solid rgba(21, 23, 19, 0.16);
  border-radius: 50%;
  background: transparent;
  color: #151713;
  font-size: 42rpx;
  line-height: 52rpx;
}

.title,
.state-title {
  font-family: "Songti SC", "STSong", serif;
  font-size: 42rpx;
  font-weight: 600;
  line-height: 1.15;
}

.form {
  margin-top: 28rpx;
}

.photo-field {
  padding: 6rpx 0 34rpx;
  border-bottom: 1rpx solid rgba(21, 23, 19, 0.1);
}

.photo-picker {
  width: 188rpx;
  height: 188rpx;
  padding: 0;
  border: 1rpx solid rgba(21, 23, 19, 0.16);
  border-radius: 8rpx;
  background: transparent;
  overflow: hidden;
}

.photo-preview {
  width: 100%;
  height: 100%;
}

.photo-empty {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8rpx;
  color: #687164;
}

.photo-plus {
  color: #151713;
  font-size: 42rpx;
  line-height: 1;
}

.photo-copy,
.remove-photo {
  font-size: 24rpx;
}

.remove-photo {
  display: block;
  margin-top: 18rpx;
  padding: 0;
  background: transparent;
  color: #8d2c22;
  line-height: 1.2;
}

.field {
  display: block;
  padding: 30rpx 0;
  border-bottom: 1rpx solid rgba(21, 23, 19, 0.1);
}

.label {
  display: block;
  margin-bottom: 18rpx;
  color: #596154;
  font-size: 24rpx;
}

.input,
.textarea {
  width: 100%;
  min-height: 72rpx;
  padding: 0;
  color: #151713;
  font-size: 32rpx;
  line-height: 1.35;
}

.textarea {
  min-height: 132rpx;
}

.placeholder {
  color: #8a9185;
}

.history-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 18rpx;
}

.choice {
  height: 58rpx;
  padding: 0 22rpx;
  border: 1rpx solid rgba(21, 23, 19, 0.16);
  border-radius: 8rpx;
  background: transparent;
  color: #596154;
  font-size: 24rpx;
  line-height: 56rpx;
}

.selected,
.active {
  border-color: #151713;
  color: #151713;
}

.date-panel {
  padding: 34rpx 0;
  border-bottom: 1rpx solid rgba(21, 23, 19, 0.1);
}

.date-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.hint {
  color: #8a9185;
  font-size: 22rpx;
}

.date-mode {
  width: 100%;
  padding: 26rpx 24rpx;
  border: 1rpx solid rgba(21, 23, 19, 0.14);
  border-radius: 8rpx;
  background: transparent;
  text-align: left;
  box-sizing: border-box;
}

.mode-title {
  display: block;
  margin-bottom: 12rpx;
  color: #151713;
  font-size: 28rpx;
}

.picker-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 58rpx;
  color: #151713;
  font-size: 28rpx;
}

.picker-value.empty {
  color: #8a9185;
}

.picker-arrow {
  color: #8a9185;
  font-size: 26rpx;
}

.or-line {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 62rpx;
  color: #8a9185;
  font-size: 24rpx;
}

.date-fields {
  display: grid;
  gap: 18rpx;
  margin-top: 4rpx;
}

.sub-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  min-height: 72rpx;
  border-bottom: 1rpx solid rgba(21, 23, 19, 0.1);
}

.sub-field:last-child {
  border-bottom: 0;
}

.sub-label {
  flex: 0 0 auto;
  color: #596154;
  font-size: 26rpx;
}

.sub-value,
.shelf-control {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 12rpx;
  color: #151713;
  font-size: 30rpx;
}

.sub-value.empty {
  color: #8a9185;
}

.shelf-input {
  width: 160rpx;
  min-width: 0;
  min-height: 68rpx;
  padding: 0;
  color: #151713;
  font-size: 30rpx;
  line-height: 1.35;
  text-align: right;
}

.unit-select {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6rpx;
  flex: 0 0 auto;
  min-width: 62rpx;
  height: 68rpx;
  padding: 0;
  border: 0;
  background: transparent;
  color: #151713;
  font-size: 30rpx;
  line-height: 68rpx;
}

.calculated {
  display: block;
  margin-top: 16rpx;
  color: #8c5d4a;
  font-size: 24rpx;
}

.save-button {
  width: 100%;
  height: 88rpx;
  margin-top: 42rpx;
  border-radius: 8rpx;
  background: #151713;
  color: #f8faf4;
  font-size: 30rpx;
  line-height: 88rpx;
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
  color: #687164;
  font-size: 28rpx;
}

.error {
  display: block;
  margin-top: 24rpx;
  color: #8d2c22;
}
</style>
