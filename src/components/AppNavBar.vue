<script setup lang="ts">
defineProps<{
  title: string;
  navStyle: Record<string, string>;
  showBack?: boolean;
}>();

const emit = defineEmits<{
  back: [];
}>();
</script>

<template>
  <view class="app-nav-bar" :style="navStyle">
    <button v-if="showBack" class="nav-back" aria-label="返回" @click="emit('back')">
      <view class="nav-back-icon"></view>
    </button>
    <text class="nav-title">{{ title }}</text>
  </view>
</template>

<style scoped lang="scss">
.app-nav-bar {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 30rpx;
  box-sizing: border-box;
  pointer-events: none;
}

.nav-back {
  position: absolute;
  left: 30rpx;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  transform: translateY(-50%);
  box-sizing: border-box;
  pointer-events: auto;
}

.nav-back::after {
  border: 0;
}

.nav-back-icon {
  width: 21rpx;
  height: 21rpx;
  border-left: 5rpx solid #4f7f78;
  border-bottom: 5rpx solid #4f7f78;
  transform: translateX(5rpx) rotate(45deg);
  box-sizing: border-box;
}

.nav-title {
  position: absolute;
  left: 50%;
  max-width: 44vw;
  overflow: hidden;
  color: #101418;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif;
  font-size: 38rpx;
  font-weight: 760;
  line-height: 1.15;
  text-align: center;
  text-overflow: ellipsis;
  transform: translateX(-50%);
  white-space: nowrap;
  pointer-events: auto;
}
</style>
