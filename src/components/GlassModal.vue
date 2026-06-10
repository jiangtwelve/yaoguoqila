<script setup lang="ts">
const props = withDefaults(defineProps<{
  show: boolean;
  symbol?: string;
  symbolTone?: 'default' | 'family';
  kicker?: string;
  title?: string;
  copy?: string;
  copyAlign?: 'left' | 'center';
  primaryText?: string;
  secondaryText?: string;
  primaryDisabled?: boolean;
  closeOnBackdrop?: boolean;
}>(), {
  symbol: '',
  symbolTone: 'default',
  kicker: '',
  title: '',
  copy: '',
  copyAlign: 'left',
  primaryText: '',
  secondaryText: '',
  primaryDisabled: false,
  closeOnBackdrop: false
});

const emit = defineEmits<{
  (event: 'primary'): void;
  (event: 'secondary'): void;
  (event: 'backdrop'): void;
}>();

function handleBackdrop() {
  if (props.closeOnBackdrop) {
    emit('backdrop');
  }
}
</script>

<template>
  <view v-if="show" class="glass-modal-backdrop" @click="handleBackdrop">
    <view class="glass-modal" @click.stop>
      <view v-if="symbol || kicker || title" class="glass-modal-header" :class="{ centered: !symbol }">
        <view v-if="symbol" class="glass-modal-symbol" :class="`tone-${symbolTone}`">
          <text>{{ symbol }}</text>
        </view>
        <view class="glass-modal-title-group">
          <text v-if="kicker" class="glass-modal-kicker">{{ kicker }}</text>
          <text v-if="title" class="glass-modal-title">{{ title }}</text>
        </view>
      </view>

      <text v-if="copy" class="glass-modal-copy" :class="{ centered: copyAlign === 'center' }">{{ copy }}</text>

      <slot />

      <view v-if="primaryText || secondaryText" class="glass-modal-actions" :class="{ single: !secondaryText }">
        <button v-if="secondaryText" class="glass-modal-secondary-action" @click="emit('secondary')">{{ secondaryText }}</button>
        <button v-if="primaryText" class="glass-modal-primary-action" :disabled="primaryDisabled" @click="emit('primary')">{{ primaryText }}</button>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.glass-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  background:
    linear-gradient(155deg, rgba(232, 246, 255, 0.18), rgba(249, 242, 255, 0.16), rgba(241, 250, 244, 0.18)),
    rgba(16, 20, 24, 0.12);
  backdrop-filter: blur(18rpx) saturate(112%);
  -webkit-backdrop-filter: blur(18rpx) saturate(112%);
  box-sizing: border-box;
}

.glass-modal {
  position: relative;
  width: 100%;
  max-width: 600rpx;
  padding: 42rpx 38rpx 36rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.72);
  border-radius: 36rpx;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.38)),
    rgba(255, 255, 255, 0.36);
  box-shadow: 0 34rpx 86rpx rgba(45, 74, 110, 0.18), inset 0 1rpx 0 rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(42rpx) saturate(130%);
  -webkit-backdrop-filter: blur(42rpx) saturate(130%);
  box-sizing: border-box;
  overflow: hidden;
}

.glass-modal::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(120deg, rgba(255, 255, 255, 0.72), transparent 44%, rgba(255, 255, 255, 0.22)),
    radial-gradient(circle at 18% 14%, rgba(79, 127, 120, 0.16), transparent 34%);
  pointer-events: none;
}

.glass-modal-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 22rpx;
}

.glass-modal-header.centered {
  justify-content: center;
  text-align: center;
}

.glass-modal-symbol {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 76rpx;
  height: 76rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.7);
  border-radius: 24rpx;
  background: rgba(79, 127, 120, 0.12);
  color: #4f7f78;
  font-size: 30rpx;
  font-weight: 700;
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.82);
}

.glass-modal-symbol.tone-family {
  background: rgba(255, 149, 0, 0.1);
  color: #b47014;
}

.glass-modal-title-group {
  min-width: 0;
}

.glass-modal-kicker {
  display: block;
  color: rgba(16, 20, 24, 0.44);
  font-size: 22rpx;
  font-weight: 500;
  line-height: 1.2;
}

.glass-modal-title {
  display: block;
  position: relative;
  z-index: 1;
  margin-top: 6rpx;
  color: #101418;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif;
  font-size: 42rpx;
  font-weight: 760;
  line-height: 1.12;
  letter-spacing: 0;
}

.glass-modal-copy {
  display: block;
  position: relative;
  z-index: 1;
  margin-top: 24rpx;
  color: rgba(16, 20, 24, 0.55);
  font-size: 26rpx;
  line-height: 1.5;
}

.glass-modal-copy.centered {
  color: #101418;
  font-size: 30rpx;
  font-weight: 520;
  line-height: 1.58;
  text-align: center;
}

.glass-modal-field {
  position: relative;
  z-index: 1;
  min-height: 112rpx;
  margin-top: 34rpx;
  padding: 0 28rpx;
  border: 2rpx solid rgba(16, 20, 24, 0.16);
  border-radius: 28rpx;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 252, 251, 0.72)),
    rgba(255, 255, 255, 0.76);
  box-shadow: 0 18rpx 44rpx rgba(45, 74, 110, 0.13), inset 0 1rpx 0 rgba(255, 255, 255, 0.92), inset 0 -1rpx 0 rgba(79, 127, 120, 0.12);
  backdrop-filter: blur(24rpx) saturate(128%);
  -webkit-backdrop-filter: blur(24rpx) saturate(128%);
  box-sizing: border-box;
}

.glass-modal-input {
  width: 100%;
  height: 110rpx;
  padding: 0;
  color: #101418;
  font-size: 36rpx;
  font-weight: 650;
  box-sizing: border-box;
}

.glass-modal-placeholder {
  color: rgba(16, 20, 24, 0.32);
  font-size: 34rpx;
  font-weight: 500;
}

.glass-modal-actions {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-top: 36rpx;
}

.glass-modal-actions.single {
  display: block;
}

.glass-modal-primary-action,
.glass-modal-secondary-action {
  min-width: 180rpx;
  height: 76rpx;
  margin: 0;
  padding: 0 34rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  line-height: 76rpx;
}

.glass-modal-primary-action::after,
.glass-modal-secondary-action::after {
  border: 0;
}

.glass-modal-primary-action {
  background: rgba(16, 20, 24, 0.82);
  color: #ffffff;
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}

.glass-modal-primary-action[disabled] {
  color: rgba(255, 255, 255, 0.72);
  background: rgba(16, 20, 24, 0.44);
}

.glass-modal-secondary-action {
  border: 1rpx solid rgba(255, 255, 255, 0.64);
  background: rgba(255, 255, 255, 0.32);
  color: #4f7f78;
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}

.glass-modal-actions.single .glass-modal-primary-action {
  width: 100%;
  height: 84rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  line-height: 84rpx;
}
</style>
