---
status: active
current_task: TASK-011
current_release: v0.1
project_type: ui_product
next_action: continue_implementation
blocked: false
blocker: ""
acceptance_status: not_required
external_state_status: ready_for_clean_acceptance
updated: 2026-06-10
---

# Handoff

## 当前状态
项目处于 `v0.1 小程序测试版闭环`，当前任务是 `TASK-011 搭建微信云开发后端基础能力`。

项目类型按 `ui_product` 处理；当前 release 主表面是微信小程序，后端/API 是 v0.1 闭环的支撑能力。当前目标不是继续扩功能，而是在微信开发者工具中用真实 CloudBase 干净数据完成主流程联调：首次进入、设置昵称、创建家庭、新增物品、临期确认、保存 loading、首页列表、详情、编辑、标记用完和删除。

## 当前任务快照
- 已完成 CloudBase MCP 准备、旧函数/旧集合清理、新集合和索引创建。
- 已部署单入口云函数 `yaoguoqiApi`，前端 cloud adapter 通过 `wx.cloud.callFunction` 调用 `action/payload`。
- 已完成并验证一批 TASK-011 期间的小程序端兼容和体验修复：弹窗绑定、骨架屏、保存按钮状态、临期/过期二次确认、`GlassModal` 抽取、`textarea` 触摸隔离、表单 loading/saving 锁定、自动真机调试 `subPackages` 兼容。
- `docs/ui.md` 已记录当前「流光毛玻璃」已验收 UI 基线，以及弹窗、骨架屏、保存 loading、风险确认等规则。
- `docs/api.md` 仍为 `validated`，待真实云函数和前端集成联调通过后再升级为 `stable`。

## 最新外部状态
- CloudBase 环境：`cloud1-d8gr12cmd6578bfd0`。
- 云函数：仅保留新单入口 `yaoguoqiApi`。
- 集合：`users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`。
- 最新一次业务数据清理：2026-06-09 UI 调整后再次清空，清理后六个业务集合计数均为 0。
- 下一位 agent 若不能确认外部状态仍是干净数据，应先复核集合计数；必要时将 `next_action` 改为 `verify_external_state`。

## 下一步
1. 打开微信开发者工具，确认自动真机调试已经不再因 `subPackages` 缺字段报错。
2. 用干净 CloudBase 数据重新跑 TASK-011 主流程：
   - 首次进入
   - 设置昵称
   - 创建家庭
   - 新增正常/临期/今天到期/已过期物品
   - 风险确认弹窗
   - 保存中 loading
   - 首页列表与统计
   - 详情
   - 编辑
   - 标记用完
   - 删除
3. 若真实联调通过，更新 TASK-011 验证结果；如准备把 `docs/api.md` 从 `validated` 升为 `stable`，先按 owner approval 规则确认长期 API 行为。
4. TASK-011 完成后，按 `docs/releases/v0.1.md` 进入 `TASK-012 家庭切换功能`，不要跳过版本目标直接做 Backlog。

## 阻塞
- 当前无文档层面的阻塞。
- 真实联调依赖微信开发者工具和当前 CloudBase 环境可访问。

## 关键文件
- `AGENTS.md`
- `CLAUDE.md`
- `docs/handoff.md`
- `docs/tasks.md`
- `docs/tasks/TASK-011-wechat-cloud-backend-foundation.md`
- `docs/releases/v0.1.md`
- `docs/api.md`
- `docs/ui.md`
- `cloudfunctions/yaoguoqiApi/index.js`
- `src/services/cloud/wechatCloudClient.ts`
- `src/services/cloud/cloudHomeRepository.ts`
- `src/pages/home/index.vue`
- `src/pages/item-form/index.vue`
- `src/pages/item-detail/index.vue`

## 注意事项
- 接手前先查看 `git status`，不要覆盖其他 agent 的未提交变更。
- 任何用户可见 UI 或交互变化在标记任务完成前都需要用户验收；内部重构只需验证并记录。
- stable API、架构、数据模型、安全/隐私或 release 范围变化需要 owner approval，并记录到对应 source of truth。
- 高影响 CloudBase 操作必须先确认环境和操作范围，操作后记录可观察结果。
- 历史细节查 `docs/dev-log.md`，不要把长历史重新塞回 `docs/handoff.md`。
