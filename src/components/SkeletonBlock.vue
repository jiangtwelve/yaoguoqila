<script setup lang="ts">
/** 骨架屏基础块 — 通过 style 或外部 CSS 类控制尺寸和圆角 */
withDefaults(defineProps<{
  width?: string;
  height?: string;
  radius?: string;
}>(), {
  width: '',
  height: '',
  radius: '999rpx'
});
</script>

<template>
  <view class="skeleton-block" :style="{ width: width || undefined, height: height || undefined, borderRadius: radius }" />
</template>

<style scoped lang="scss">
.skeleton-block {
  position: relative;
  overflow: hidden;
  background: rgba(16, 20, 24, 0.08);
}

.skeleton-block::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.52) 48%, transparent 100%);
  transform: translateX(-100%);
  animation: skeleton-shimmer 1.45s ease-in-out infinite;
}
</style>
