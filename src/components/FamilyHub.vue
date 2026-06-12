<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { Family, FamilyMemberInfo } from '@/domain/models';
import GlassModal from '@/components/GlassModal.vue';
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
  scrollToFamilyId?: string;
}>();

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'switched'): void;
  (event: 'renamed'): void;
  (event: 'dissolved', payload: DissolvedPayload): void;
  (event: 'create-family'): void;
}>();

type HubView = 'list' | 'manage';
type FamilyListScrollEvent = { detail?: { scrollTop?: number } };
type DissolvedPayload = { familyId: string; wasCurrent: boolean };

const MAX_FAMILY_NAME_LENGTH = 12;

const view = ref<HubView>('list');
const managedFamilyId = ref('');
const renameInput = ref('');
const renameInputFocus = ref(false);
const renaming = ref(false);
const showRename = ref(false);
const members = ref<FamilyMemberInfo[]>([]);
const memberErrorMessage = ref('');
const loadingMembers = ref(false);
const actionLoading = ref(false);
const scrollIntoViewId = ref('');
const familyListRestoreTop = ref(0);
const shouldAutoScrollToCurrent = ref(false);
let familyListScrollTopSnapshot = 0;

/** 当前正在管理的家庭 */
const managedFamily = computed(() =>
  props.families.find((f) => f.id === managedFamilyId.value) ?? null
);

/** 当前用户是否为管理员 */
const isOwner = computed(() => managedFamily.value?.role === 'owner');

/** 重命名确认按钮是否可用 */
const canConfirmRename = computed(() => {
  const name = renameInput.value.trim();
  return Boolean(name) && name.length <= MAX_FAMILY_NAME_LENGTH && !renaming.value;
});

/** 滚动到指定家庭卡片 */
async function queueScrollToFamily(familyId: string) {
  if (!familyId) return;

  scrollIntoViewId.value = '';
  /** 等待列表和 scroll-view 状态稳定后再设置目标节点 */
  await nextTick();
  await nextTick();
  scrollIntoViewId.value = getFamilyCardId(familyId);
}

/** 生成家庭卡片节点 ID，避免原始 ID 与页面其它节点冲突 */
function getFamilyCardId(familyId: string) {
  return `family-card-${familyId}`;
}

watch(
  () => props.scrollToFamilyId,
  (id) => {
    if (props.show && shouldAutoScrollToCurrent.value && id) void queueScrollToFamily(id);
  }
);

watch(
  () => props.currentFamilyId,
  (id) => {
    if (props.show && view.value === 'list' && shouldAutoScrollToCurrent.value) void queueScrollToFamily(id);
  }
);

/** 打开面板时重置视图 */
watch(
  () => props.show,
  (visible) => {
    if (visible) {
      view.value = 'list';
      managedFamilyId.value = '';
      members.value = [];
      memberErrorMessage.value = '';
      familyListScrollTopSnapshot = 0;
      familyListRestoreTop.value = 0;
      shouldAutoScrollToCurrent.value = true;
      void queueScrollToFamily(props.scrollToFamilyId || props.currentFamilyId);
    }
  }
);

/** 只记录原生滚动位置快照，不在滚动过程中触发响应式回写 */
function snapshotFamilyListScroll(event: FamilyListScrollEvent) {
  familyListScrollTopSnapshot = event.detail?.scrollTop ?? familyListScrollTopSnapshot;
}

/** 关闭面板 */
function close() {
  emit('close');
}

/** 切换到管理视图 */
function openManage(familyId: string) {
  managedFamilyId.value = familyId;
  scrollIntoViewId.value = '';
  shouldAutoScrollToCurrent.value = false;
  view.value = 'manage';
  void loadMembers();
}

/** 返回家庭列表 */
async function backToList() {
  view.value = 'list';
  managedFamilyId.value = '';
  members.value = [];
  memberErrorMessage.value = '';
  familyListRestoreTop.value = 0;
  await nextTick();
  familyListRestoreTop.value = familyListScrollTopSnapshot;
}

/** 加载成员列表（初次加载显示骨架屏） */
async function loadMembers() {
  if (!managedFamilyId.value) return;
  loadingMembers.value = true;
  memberErrorMessage.value = '';
  try {
    members.value = await getFamilyMembers(managedFamilyId.value);
  } catch (error) {
    members.value = [];
    memberErrorMessage.value = error instanceof Error ? error.message : '成员加载失败';
  } finally {
    loadingMembers.value = false;
  }
}

/** 刷新成员列表（使用常规 loading 弹窗） */
async function refreshMembers() {
  if (!managedFamilyId.value) return;
  void uni.showLoading({ title: '刷新中', mask: true });
  try {
    memberErrorMessage.value = '';
    members.value = await getFamilyMembers(managedFamilyId.value);
  } catch (error) {
    memberErrorMessage.value = error instanceof Error ? error.message : '成员加载失败';
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
  renameInputFocus.value = false;
  showRename.value = true;
  void nextTick().then(() => {
    setTimeout(() => {
      renameInputFocus.value = true;
    }, 160);
  });
}

/** 关闭重命名弹窗 */
function closeRename() {
  showRename.value = false;
  renameInputFocus.value = false;
}

/** 确认重命名 */
async function confirmRename() {
  const name = renameInput.value.trim();
  if (!name || !managedFamilyId.value || renaming.value) return;
  if (name.length > MAX_FAMILY_NAME_LENGTH) {
    void uni.showToast({ title: `家庭名称最多 ${MAX_FAMILY_NAME_LENGTH} 个字`, icon: 'none' });
    return;
  }

  renaming.value = true;
  void uni.showLoading({ title: '保存中', mask: true });
  try {
    await renameFamily({ familyId: managedFamilyId.value, name });
    uni.hideLoading();
    closeRename();
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
    const familyId = managedFamilyId.value;
    const wasCurrent = familyId === props.currentFamilyId;
    await dissolveFamilyGroup({ familyId });
    uni.hideLoading();
    void uni.showToast({ title: '已解散', icon: 'success' });
    backToList();
    emit('dissolved', { familyId, wasCurrent });
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

        <scroll-view
          class="hub-family-list"
          scroll-y
          :scroll-top="familyListRestoreTop"
          :scroll-into-view="scrollIntoViewId"
          @scroll="snapshotFamilyListScroll"
        >
          <view
            v-for="family in families"
            :key="family.id"
            :id="getFamilyCardId(family.id)"
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
      <view v-if="view === 'manage' && managedFamily" class="hub-view">
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

            <view v-else-if="memberErrorMessage" class="hub-member-error">
              <text class="hub-member-error-title">成员加载失败</text>
              <text class="hub-member-error-copy">{{ memberErrorMessage }}</text>
              <button class="hub-member-retry" @click="loadMembers">重试</button>
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

    <!-- 重命名弹窗：复用通用输入弹窗风格 -->
    <GlassModal
      :show="showRename"
      symbol="家"
      symbol-tone="family"
      kicker="家庭资料"
      title="重命名家庭"
      secondary-text="取消"
      primary-text="确认"
      :primary-disabled="!canConfirmRename"
      @secondary="closeRename"
      @primary="confirmRename"
    >
      <view class="glass-modal-field hub-rename-field">
        <input
          class="glass-modal-input"
          :value="renameInput"
          @input="renameInput = ($event.target as HTMLInputElement).value"
          placeholder="新名称"
          placeholder-class="glass-modal-placeholder"
          :maxlength="MAX_FAMILY_NAME_LENGTH"
          :focus="renameInputFocus"
        />
      </view>
    </GlassModal>
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
  animation: hub-backdrop-in 220ms ease-out both;
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
  transform-origin: bottom center;
  will-change: transform, opacity;
  animation: hub-panel-in 280ms cubic-bezier(0.16, 1, 0.3, 1) both;
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

.hub-member-error {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 28rpx 24rpx;
  border: 1rpx solid rgba(229, 72, 63, 0.14);
  border-radius: 24rpx;
  background: rgba(255, 247, 246, 0.72);
  box-sizing: border-box;
}

.hub-member-error-title {
  color: #e5483f;
  font-size: 28rpx;
  font-weight: 650;
}

.hub-member-error-copy {
  color: rgba(16, 20, 24, 0.54);
  font-size: 24rpx;
  line-height: 1.45;
}

.hub-member-retry {
  align-self: flex-start;
  height: 56rpx;
  margin: 4rpx 0 0;
  padding: 0 24rpx;
  border: 0;
  border-radius: 999rpx;
  background: rgba(229, 72, 63, 0.1);
  color: #e5483f;
  font-size: 24rpx;
  font-weight: 600;
  line-height: 56rpx;
}

.hub-member-retry::after {
  border: 0;
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

.hub-rename-field {
  margin-top: 34rpx;
}

@keyframes hub-backdrop-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes hub-panel-in {
  from {
    opacity: 0;
    transform: translate3d(0, 44rpx, 0) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}
</style>
