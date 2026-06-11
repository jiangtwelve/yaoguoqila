<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Family, FamilyMemberInfo } from '@/domain/models';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import {
  dissolveFamilyGroup,
  getFamilyMembers,
  leaveFamilyGroup,
  removeFamilyMember,
  renameFamily,
  switchFamily
} from '@/services/homeService';

const props = defineProps<{
  show: boolean;
  families: Family[];
  currentFamilyId: string;
  currentUserId: string;
}>();

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'switched'): void;
  (event: 'renamed'): void;
  (event: 'create-family'): void;
}>();

type HubView = 'list' | 'manage';

const view = ref<HubView>('list');
const managedFamilyId = ref('');
const renameInput = ref('');
const renaming = ref(false);
const showRename = ref(false);
const members = ref<FamilyMemberInfo[]>([]);
const loadingMembers = ref(false);
const actionLoading = ref(false);

/** 当前正在管理的家庭 */
const managedFamily = computed(() =>
  props.families.find((f) => f.id === managedFamilyId.value) ?? null
);

/** 当前用户是否为管理员 */
const isOwner = computed(() => managedFamily.value?.role === 'owner');

/** 打开面板时重置视图 */
watch(
  () => props.show,
  (visible) => {
    if (visible) {
      view.value = 'list';
      managedFamilyId.value = '';
      members.value = [];
    }
  }
);

/** 关闭面板 */
function close() {
  emit('close');
}

/** 切换到管理视图 */
function openManage(familyId: string) {
  managedFamilyId.value = familyId;
  view.value = 'manage';
  void loadMembers();
}

/** 返回家庭列表 */
function backToList() {
  view.value = 'list';
  managedFamilyId.value = '';
  members.value = [];
}

/** 加载成员列表（初次加载显示骨架屏） */
async function loadMembers() {
  if (!managedFamilyId.value) return;
  loadingMembers.value = true;
  try {
    members.value = await getFamilyMembers(managedFamilyId.value);
  } catch {
    members.value = [];
  } finally {
    loadingMembers.value = false;
  }
}

/** 刷新成员列表（使用常规 loading 弹窗） */
async function refreshMembers() {
  if (!managedFamilyId.value) return;
  void uni.showLoading({ title: '刷新中', mask: true });
  try {
    members.value = await getFamilyMembers(managedFamilyId.value);
  } catch {
    /* ignore */
  } finally {
    uni.hideLoading();
  }
}

/** 切换家庭 */
async function handleSwitch(familyId: string) {
  if (familyId === props.currentFamilyId || actionLoading.value) return;
  actionLoading.value = true;
  void uni.showLoading({ title: '切换中', mask: true });
  try {
    await switchFamily({ familyId });
    emit('switched');
  } catch (error) {
    uni.hideLoading();
    void uni.showToast({ title: error instanceof Error ? error.message : '切换失败', icon: 'none' });
  } finally {
    actionLoading.value = false;
  }
}

/** 打开重命名弹窗 */
function openRename() {
  renameInput.value = managedFamily.value?.name ?? '';
  showRename.value = true;
}

/** 确认重命名 */
async function confirmRename() {
  const name = renameInput.value.trim();
  if (!name || !managedFamilyId.value || renaming.value) return;

  renaming.value = true;
  void uni.showLoading({ title: '保存中', mask: true });
  try {
    await renameFamily({ familyId: managedFamilyId.value, name });
    uni.hideLoading();
    showRename.value = false;
    void uni.showToast({ title: '已重命名', icon: 'success' });
    emit('renamed');
  } catch (error) {
    uni.hideLoading();
    const message = error instanceof Error ? error.message : '重命名失败';
    void uni.showModal({
      title: '重命名失败',
      content: message,
      showCancel: false,
      confirmText: '知道了'
    });
  } finally {
    renaming.value = false;
  }
}

/** 确认移除成员 */
function confirmRemoveMember(member: FamilyMemberInfo) {
  void uni.showModal({
    title: '移除成员',
    content: `确认将「${member.displayName || '该成员'}」从家庭中移除吗？`,
    confirmText: '移除',
    confirmColor: '#e5483f',
    success: (result) => {
      if (result.confirm) void doRemoveMember(member);
    }
  });
}

/** 执行移除成员 */
async function doRemoveMember(member: FamilyMemberInfo) {
  actionLoading.value = true;
  try {
    await removeFamilyMember({ familyId: managedFamilyId.value, userId: member.userId });
    void uni.showToast({ title: '已移除', icon: 'success' });
    await refreshMembers();
  } catch (error) {
    void uni.showToast({ title: error instanceof Error ? error.message : '操作失败', icon: 'none' });
  } finally {
    actionLoading.value = false;
  }
}

/** 确认退出家庭 */
function confirmLeave() {
  void uni.showModal({
    title: '退出家庭',
    content: '退出后你将无法查看该家庭的物品。确认退出吗？',
    confirmText: '退出',
    confirmColor: '#e5483f',
    success: (result) => {
      if (result.confirm) void doLeave();
    }
  });
}

/** 执行退出家庭 */
async function doLeave() {
  actionLoading.value = true;
  void uni.showLoading({ title: '退出中', mask: true });
  try {
    await leaveFamilyGroup({ familyId: managedFamilyId.value });
    uni.hideLoading();
    void uni.showToast({ title: '已退出', icon: 'success' });
    backToList();
    emit('switched');
  } catch (error) {
    uni.hideLoading();
    void uni.showToast({ title: error instanceof Error ? error.message : '操作失败', icon: 'none' });
  } finally {
    actionLoading.value = false;
  }
}

/** 确认解散家庭 */
function confirmDissolve() {
  void uni.showModal({
    title: '解散家庭',
    content: '解散后所有物品和成员数据将被清除，且无法恢复。确认解散吗？',
    confirmText: '解散',
    confirmColor: '#e5483f',
    success: (result) => {
      if (result.confirm) void doDissolve();
    }
  });
}

/** 执行解散家庭 */
async function doDissolve() {
  actionLoading.value = true;
  void uni.showLoading({ title: '解散中', mask: true });
  try {
    await dissolveFamilyGroup({ familyId: managedFamilyId.value });
    uni.hideLoading();
    void uni.showToast({ title: '已解散', icon: 'success' });
    backToList();
    emit('switched');
  } catch (error) {
    uni.hideLoading();
    void uni.showToast({ title: error instanceof Error ? error.message : '操作失败', icon: 'none' });
  } finally {
    actionLoading.value = false;
  }
}
</script>

<template>
  <view v-if="show" class="hub-backdrop" @click="close">
    <view class="hub-panel" @click.stop>
      <!-- 家庭列表视图 -->
      <view v-if="view === 'list'" class="hub-view">
        <view class="hub-header">
          <text class="hub-title">切换家庭</text>
        </view>

        <scroll-view class="hub-family-list" scroll-y>
          <view
            v-for="family in families"
            :key="family.id"
            class="hub-family-card"
            :class="{ active: family.id === currentFamilyId }"
          >
            <view class="hub-family-info" @click="handleSwitch(family.id)">
              <text class="hub-family-name">{{ family.name }}</text>
              <text v-if="family.id === currentFamilyId" class="hub-current-tag">当前</text>
            </view>
            <button class="hub-manage-btn" @click.stop="openManage(family.id)">管理</button>
          </view>
        </scroll-view>

        <view class="hub-bottom-actions">
          <button class="hub-create-btn" @click="emit('create-family')">＋ 创建新家庭</button>
        </view>
      </view>

      <!-- 管理视图 -->
      <view v-else-if="managedFamily" class="hub-view">
        <view class="hub-header">
          <view class="hub-manage-nav">
            <text class="hub-back-arrow" @click="backToList">‹</text>
            <text class="hub-title hub-manage-title" @click="backToList">{{ managedFamily.name }}</text>
          </view>
        </view>

        <view class="hub-manage-body">
          <!-- 成员列表 -->
          <view class="hub-section">
            <text class="hub-section-title">成员</text>

            <view v-if="loadingMembers" class="hub-member-list hub-member-skeleton">
              <view class="hub-member-row hub-skeleton-row">
                <SkeletonBlock width="64rpx" height="64rpx" radius="50%" />
                <view class="hub-skeleton-lines">
                  <SkeletonBlock width="160rpx" height="28rpx" />
                  <SkeletonBlock width="80rpx" height="24rpx" />
                </view>
              </view>
              <view class="hub-member-row hub-skeleton-row">
                <SkeletonBlock width="64rpx" height="64rpx" radius="50%" />
                <view class="hub-skeleton-lines">
                  <SkeletonBlock width="120rpx" height="28rpx" />
                  <SkeletonBlock width="80rpx" height="24rpx" />
                </view>
              </view>
            </view>

            <view v-else class="hub-member-list">
              <view v-for="member in members" :key="member.userId" class="hub-member-row">
                <view class="hub-member-info">
                  <text class="hub-member-name">{{ member.displayName || '未设置昵称' }}</text>
                  <text class="hub-member-role" :class="`role-${member.role}`">
                    {{ member.role === 'owner' ? '管理员' : '成员' }}
                  </text>
                </view>
                <button
                  v-if="isOwner && member.userId !== props.currentUserId"
                  class="hub-remove-btn"
                  @click="confirmRemoveMember(member)"
                >移除</button>
              </view>
            </view>
          </view>

          <!-- 操作区 -->
          <view class="hub-actions">
            <button v-if="isOwner" class="hub-action-btn secondary" @click="openRename">重命名家庭</button>

            <button
              v-if="isOwner"
              class="hub-action-btn danger"
              @click="confirmDissolve"
            >解散家庭</button>
            <button
              v-else
              class="hub-action-btn danger"
              @click="confirmLeave"
            >退出家庭</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 重命名弹窗（使用外部 GlassModal） -->
    <view v-if="showRename" class="hub-rename-overlay" @click="showRename = false">
      <view class="hub-rename-card" @click.stop>
        <text class="hub-rename-title">重命名家庭</text>
        <input
          class="hub-rename-input"
          :value="renameInput"
          @input="renameInput = ($event.target as HTMLInputElement).value"
          placeholder="新名称"
          :focus="showRename"
        />
        <view class="hub-rename-actions">
          <button class="hub-rename-cancel" @click="showRename = false">取消</button>
          <button
            class="hub-rename-confirm"
            :disabled="!renameInput.trim() || renaming"
            @click="confirmRename"
          >确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.hub-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background:
    linear-gradient(155deg, rgba(232, 246, 255, 0.18), rgba(249, 242, 255, 0.16), rgba(241, 250, 244, 0.18)),
    rgba(16, 20, 24, 0.18);
  backdrop-filter: blur(18rpx) saturate(112%);
  -webkit-backdrop-filter: blur(18rpx) saturate(112%);
  box-sizing: border-box;
}

.hub-panel {
  width: 100%;
  max-height: 85vh;
  padding: 0 30rpx calc(44rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid rgba(255, 255, 255, 0.72);
  border-radius: 42rpx 42rpx 0 0;
  background:
    linear-gradient(175deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.48)),
    rgba(255, 255, 255, 0.42);
  box-shadow: 0 -20rpx 60rpx rgba(45, 74, 110, 0.12), inset 0 1rpx 0 rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(42rpx) saturate(130%);
  -webkit-backdrop-filter: blur(42rpx) saturate(130%);
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.hub-view {
  display: flex;
  flex-direction: column;
  max-height: 85vh;
}

.hub-header {
  padding: 38rpx 0 24rpx;
}

.hub-kicker {
  display: block;
  color: rgba(16, 20, 24, 0.44);
  font-size: 22rpx;
  font-weight: 500;
}

.hub-title {
  display: block;
  margin-top: 14rpx;
  color: #101418;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif;
  font-size: 42rpx;
  font-weight: 760;
  line-height: 1.12;
}

.hub-back-row {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-bottom: 8rpx;
}

.hub-back-arrow {
  color: #4f7f78;
  font-size: 42rpx;
  font-weight: 300;
  line-height: 1;
  padding: 0 8rpx;
}

.hub-back-text {
  color: #4f7f78;
  font-size: 26rpx;
  font-weight: 500;
}

.hub-manage-nav {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.hub-manage-title {
  margin-top: 0;
}

/* 家庭列表 */
.hub-family-list {
  flex: 1;
  max-height: 520rpx;
}

.hub-family-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 12rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.6);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.32);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  box-sizing: border-box;
}

.hub-family-card.active {
  border-color: rgba(79, 127, 120, 0.35);
  background: rgba(79, 127, 120, 0.08);
}

.hub-family-info {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.hub-family-name {
  color: #101418;
  font-size: 32rpx;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hub-current-tag {
  flex: 0 0 auto;
  padding: 4rpx 14rpx;
  border-radius: 999rpx;
  background: rgba(79, 127, 120, 0.14);
  color: #4f7f78;
  font-size: 22rpx;
  font-weight: 600;
}

.hub-manage-btn {
  flex: 0 0 auto;
  min-width: 0;
  height: 60rpx;
  margin: 0;
  padding: 0 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.54);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.36);
  color: #4f7f78;
  font-size: 24rpx;
  font-weight: 500;
  line-height: 58rpx;
}

.hub-manage-btn::after {
  border: 0;
}

/* 底部操作 */
.hub-bottom-actions {
  padding: 20rpx 0 0;
}

.hub-create-btn {
  width: 100%;
  height: 84rpx;
  margin: 0;
  border: 0;
  border-radius: 999rpx;
  background: rgba(16, 20, 24, 0.82);
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 84rpx;
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}

.hub-create-btn::after {
  border: 0;
}

/* 管理视图 */
.hub-manage-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20rpx;
}

.hub-section {
  margin-bottom: 32rpx;
}

.hub-section-title {
  display: block;
  margin-bottom: 16rpx;
  color: rgba(16, 20, 24, 0.48);
  font-size: 24rpx;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2rpx;
}

.hub-member-skeleton {
  background: rgba(255, 255, 255, 0.52);
}

.hub-skeleton-row {
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.42);
}

.hub-skeleton-row:last-child {
  border-bottom: 0;
}

.hub-skeleton-lines {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.hub-member-list {
  border: 1rpx solid rgba(255, 255, 255, 0.64);
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.52);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.72);
  overflow: hidden;
}

.hub-member-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 22rpx 20rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.42);
}

.hub-member-row:last-child {
  border-bottom: 0;
}

.hub-member-info {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.hub-member-name {
  color: #101418;
  font-size: 30rpx;
  font-weight: 550;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hub-member-role {
  flex: 0 0 auto;
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
  font-weight: 600;
}

.hub-member-role.role-owner {
  background: rgba(255, 149, 0, 0.12);
  color: #b47014;
}

.hub-member-role.role-member {
  background: rgba(79, 127, 120, 0.1);
  color: #4f7f78;
}

.hub-remove-btn {
  flex: 0 0 auto;
  min-width: 0;
  height: 52rpx;
  margin: 0;
  padding: 0 20rpx;
  border: 0;
  border-radius: 999rpx;
  background: rgba(229, 72, 63, 0.1);
  color: #e5483f;
  font-size: 22rpx;
  font-weight: 500;
  line-height: 52rpx;
}

.hub-remove-btn::after {
  border: 0;
}

/* 操作区 */
.hub-actions {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 20rpx;
}

.hub-action-btn {
  width: 100%;
  height: 84rpx;
  margin: 0;
  border-radius: 999rpx;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 84rpx;
}

.hub-action-btn::after {
  border: 0;
}

.hub-action-btn.secondary {
  border: 1rpx solid rgba(255, 255, 255, 0.64);
  background: rgba(255, 255, 255, 0.36);
  color: #4f7f78;
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}

.hub-action-btn.danger {
  border: 0;
  background: rgba(229, 72, 63, 0.1);
  color: #e5483f;
}

/* 重命名弹窗 */
.hub-rename-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  background: rgba(16, 20, 24, 0.12);
  backdrop-filter: blur(12rpx);
  -webkit-backdrop-filter: blur(12rpx);
  box-sizing: border-box;
}

.hub-rename-card {
  width: 100%;
  max-width: 580rpx;
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
}

.hub-rename-title {
  display: block;
  margin-bottom: 28rpx;
  color: #101418;
  font-size: 38rpx;
  font-weight: 720;
}

.hub-rename-input {
  width: 100%;
  height: 110rpx;
  padding: 0 28rpx;
  border: 2rpx solid rgba(16, 20, 24, 0.16);
  border-radius: 28rpx;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 252, 251, 0.72)),
    rgba(255, 255, 255, 0.76);
  color: #101418;
  font-size: 36rpx;
  font-weight: 650;
  box-sizing: border-box;
}

.hub-rename-actions {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-top: 36rpx;
}

.hub-rename-cancel,
.hub-rename-confirm {
  min-width: 180rpx;
  height: 76rpx;
  margin: 0;
  padding: 0 34rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  line-height: 76rpx;
}

.hub-rename-cancel::after,
.hub-rename-confirm::after {
  border: 0;
}

.hub-rename-cancel {
  border: 1rpx solid rgba(255, 255, 255, 0.64);
  background: rgba(255, 255, 255, 0.32);
  color: #4f7f78;
}

.hub-rename-confirm {
  background: rgba(16, 20, 24, 0.82);
  color: #ffffff;
}

.hub-rename-confirm[disabled] {
  background: rgba(16, 20, 24, 0.44);
  color: rgba(255, 255, 255, 0.72);
}
</style>
