---
status: active
current_task: TASK-012
current_release: v0.1
project_type: ui_product
next_action: wait_for_user_acceptance
blocked: false
blocker: ""
acceptance_status: pending
external_state_status: ready_for_clean_acceptance
updated: 2026-06-11
---

# Handoff

## 当前状态
项目处于 `v0.1 小程序测试版闭环`，TASK-012 家庭切换与家庭管理已实现完成，等待用户验收。

TASK-011 真实联调已验收通过。TASK-012 在 TASK-011 基础上实现了完整的家庭功能：家庭切换、重命名、成员管理（含角色区分）、退出家庭、解散家庭。前端通过 FamilyHub 组件提供统一的底部面板入口，后端新增 6 个云函数 action。2026-06-11 已补充验收体验修复：创建家庭成功后由云函数直接切换到新家庭并返回首页，取消创建弹窗时回到家庭切换弹窗，再次打开家庭弹窗自动滚动到当前家庭；同时修复重命名遮罩冒泡、成员加载失败反馈和历史家庭 owner fallback。

## 当前任务快照
- TASK-012 实现完成，包含：
  - 云函数：`family.switchFamily`、`family.renameFamily`、`family.getMembers`、`family.removeMember`、`family.leaveFamily`、`family.dissolveFamily`
  - 领域模型：`Family.role`、`FamilyMemberInfo`、6 个新 Input 类型
  - 前端服务层：`HomeRepository` 接口和 `CloudHomeRepository`/`MockHomeRepository` 均已扩展
  - UI 组件：`FamilyHub.vue`（底部面板，含家庭列表视图和管理视图）
  - 首页集成：family-button 点击打开 FamilyHub，支持切换、创建、管理
  - 验收体验修复：创建成功后自动切换新家庭并返回首页；取消创建回到家庭切换弹窗；再次打开家庭弹窗滚动到当前家庭；家庭中枢最外层面板整体进入动画；重命名家庭弹窗复用 GlassModal 风格；重命名首次打开延迟 focus；家庭名称限制 12 个字；列表/管理二选一渲染，返回列表时一次性恢复滚动位置；解散家庭后留在切换弹窗并按当前家庭状态刷新
- 构建和测试均通过（19/19 tests pass）
- 等待用户在微信开发者工具中验收

## 最新外部状态
- CloudBase 环境：`cloud1-d8gr12cmd6578bfd0`。
- 云函数：仅保留 `yaoguoqiApi`，需重新上传部署。
- 集合：`users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`。
- `familyMembers` 集合：TASK-012 起 `createFamily` 会写入 owner 记录，已有家庭需要手动补录或依赖 fallback 逻辑。

## 下一步
1. 用户在微信开发者工具验收 TASK-012。
2. 验收前需重新部署云函数 `yaoguoqiApi`。
3. 验收通过后标记 TASK-012 为 done，继续推进 TASK-013/014。

## 阻塞
- 当前无阻塞。

## 关键文件
- `AGENTS.md`
- `CLAUDE.md`
- `docs/handoff.md`
- `docs/tasks.md`
- `docs/releases/v0.1.md`
- `docs/api.md`
- `docs/ui.md`
- `cloudfunctions/yaoguoqiApi/index.js`
- `src/domain/models.ts`
- `src/services/cloud/wechatCloudClient.ts`
- `src/services/cloud/cloudHomeRepository.ts`
- `src/services/contracts/homeRepository.ts`
- `src/services/homeService.ts`
- `src/components/FamilyHub.vue`
- `src/pages/home/index.vue`

## 注意事项
- 接手前先查看 `git status`，不要覆盖其他 agent 的未提交变更。
- 云函数已更新，验收前必须重新上传部署 `yaoguoqiApi`。
- 已有家庭的 `familyMembers` 集合可能为空，`normalizeFamily` 有 fallback（creatorId 匹配即为 owner）。
- 任何用户可见 UI 或交互变化在标记任务完成前都需要用户验收。
- stable API、架构、数据模型、安全/隐私或 release 范围变化需要 owner approval。
- 高影响 CloudBase 操作必须先确认环境和操作范围，操作后记录可观察结果。
- 历史细节查 `docs/dev-log.md`。
- TASK-016 已规划为 post-v0.1：先做 `yaoguoqiApi` 内部模块化，再评估是否按领域拆分物理云函数。
