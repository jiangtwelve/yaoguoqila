---
status: active
current_task: TASK-012
current_release: v0.1
project_type: ui_product
next_action: start_next_ready_task
blocked: false
blocker: ""
acceptance_status: not_required
external_state_status: ready_for_clean_acceptance
updated: 2026-06-10
---

# Handoff

## 当前状态
项目处于 `v0.1 小程序测试版闭环`，TASK-011 已验收完成，当前任务切换到 `TASK-012 家庭切换功能`。

项目类型按 `ui_product` 处理；当前 release 主表面是微信小程序，后端/API 是 v0.1 闭环的支撑能力。TASK-011 真实联调已通过：首次进入、设置昵称、创建家庭、新增物品（含临期/过期确认）、保存 loading、首页列表与统计、详情、编辑、标记用完和删除主流程均已在微信开发者工具 + 干净 CloudBase 数据下验收。

## 当前任务快照
- TASK-011 已完成并验收，期间集中修复了弹窗间距（slot CSS 作用域）、保存 loading（改用 `uni.showLoading` 原生 loading）、表单锁定、骨架屏、`GlassModal` 抽取等体验问题。
- `docs/api.md` 仍为 `validated`，真实联调已通过但尚未升级为 `stable`；如后续 TASK 影响 API 行为需先按 owner approval 规则确认。
- TASK-012 家庭切换功能的 scope 和交互设计尚未展开，需要先确认页面地图和交互方案。

## 最新外部状态
- CloudBase 环境：`cloud1-d8gr12cmd6578bfd0`。
- 云函数：仅保留 `yaoguoqiApi`。
- 集合：`users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`。
- 最新一次业务数据清理：2026-06-10 TASK-011 验收后清空，六个业务集合计数均为 0。

## 下一步
1. 读取 `docs/tasks/TASK-012-family-switch.md`（如不存在则创建），确认家庭切换的交互方案。
2. 按 release 计划继续推进 v0.1 闭环，不要跳过版本目标直接做 Backlog。
3. 后续若需清理数据，先复核集合计数。

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
- `src/services/cloud/wechatCloudClient.ts`
- `src/services/cloud/cloudHomeRepository.ts`
- `src/pages/home/index.vue`
- `src/pages/item-form/index.vue`
- `src/pages/item-detail/index.vue`
- `src/components/GlassModal.vue`

## 注意事项
- 接手前先查看 `git status`，不要覆盖其他 agent 的未提交变更。
- 任何用户可见 UI 或交互变化在标记任务完成前都需要用户验收；内部重构只需验证并记录。
- stable API、架构、数据模型、安全/隐私或 release 范围变化需要 owner approval，并记录到对应 source of truth。
- 高影响 CloudBase 操作必须先确认环境和操作范围，操作后记录可观察结果。
- 历史细节查 `docs/dev-log.md`，不要把长历史重新塞回 `docs/handoff.md`。
