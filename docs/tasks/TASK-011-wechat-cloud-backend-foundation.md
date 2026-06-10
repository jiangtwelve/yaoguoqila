---
id: TASK-011
title: 搭建微信云开发后端基础能力
status: current
type: backend_implementation
release: v0.1
release_required: true
dependencies: [TASK-010]
requires_user_acceptance: false
acceptance_status: not_required
next_action: continue_implementation
updated: 2026-06-10
---

# TASK-011: 搭建微信云开发后端基础能力

## Objective
基于已验证 API contract，实现微信云开发后端基础能力，让前端可以从 mock repository 切换到 cloud repository 进行真实联调。

## Scope
- 接入 CloudBase MCP，为云函数、数据库和后续云存储部署做准备。
- 清理旧 CloudBase 函数和旧集合，避免旧字段模型污染当前 validated contract。
- 创建云数据库集合：`users`、`families`、`familyMembers`、`items`、`locations`、`notificationLogs`。
- 通过单入口物理云函数 `yaoguoqiApi` 实现当前 HomeRepository 所需逻辑动作：
  - `user.updateProfile`
  - `family.createFamily`
  - `home.getFamilyHome`
  - `item.getFormOptions`
  - `item.listItems`
  - `item.getItemDetail`
  - `item.createItem`
  - `item.updateItem`
  - `item.consumeItem`
  - `item.deleteItem`
- 接入微信登录身份，确保用户只能访问自己家庭下的数据。
- 预留云存储图片上传适配层，返回 `imageUrls`。

## Non-Scope
- 不实现完整家庭邀请、审批和权限细分。
- 不实现真实微信订阅消息或 App 推送。
- 不实现大数据量分页和虚拟列表后端优化。
- 不发布上线。

## Acceptance Criteria
- CloudBase MCP 已配置，后续可通过 MCP 登录/选择环境并部署云开发资源。
- 前端切换到 cloud repository 后，首页、详情页、新增/编辑、删除、标记用完等主流程可真实联调。
- 云函数返回结构与 `docs/api.md` 的 `validated` contract 一致。
- 基础权限校验阻止跨家庭访问。
- 微信开发者工具可完成 v0.1 所需主流程验收准备。

## Current Snapshot
- CloudBase MCP 已可用，并绑定环境 `cloud1-d8gr12cmd6578bfd0`。
- 旧云函数和旧集合已按用户要求清理；新集合与基础索引已创建。
- 新云函数 `yaoguoqiApi` 已部署，运行时为 `Nodejs18.15`。
- 前端 cloud adapter 已改为 `wx.cloud.callFunction`，并通过 `action/payload` 调用 `yaoguoqiApi`。
- TASK-011 期间暴露的小程序端体验问题已集中修复：弹窗绑定、页面骨架屏、保存按钮状态、临期/过期确认、`GlassModal`、`textarea` 触摸隔离、表单 loading/saving 锁定、自动真机调试 `subPackages` 兼容。
- 当前 CloudBase 业务数据已清空，准备从首次进入流程重新验收。

## External State
- 环境：`cloud1-d8gr12cmd6578bfd0`。
- 云函数：`yaoguoqiApi`。
- 集合：`users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`。
- 最新记录状态：2026-06-09 再次清空后六个业务集合计数均为 0。
- 如果接手时距离上次清理已产生新测试数据，先复核集合计数，再决定是否需要用户确认清理。

## Verification Snapshot
- CloudBase 云函数列表曾复查：仅存在 `yaoguoqiApi`。
- CloudBase 集合列表曾复查：存在六个目标业务集合。
- MCP 管理端调用 `yaoguoqiApi` 返回 `无法获取用户身份`，符合预期；真实 OPENID 需从微信小程序端调用获取。
- TASK-011 期间多轮修复后，`pnpm typecheck`、`pnpm test`、`pnpm build:mp-weixin` 均通过。
- 最近一次自动真机调试兼容修复后，已检查 `dist/build/mp-weixin/app.json` 包含 `"subPackages": []`。

## Remaining Work
1. 在微信开发者工具中重新联调并确认自动真机调试可进入编译/运行。
2. 用干净 CloudBase 数据跑通首次进入、设置昵称、创建家庭。
3. 跑通新增物品、临期/今天到期/已过期二次确认、保存 loading、首页列表与统计。
4. 跑通详情、编辑、标记用完、删除。
5. 若联调通过，更新 `docs/api.md` 是否可从 `validated` 升为 `stable` 的判断；如升级会固定长期 API 行为，先按 owner approval 规则确认。
6. 完成 TASK-011 文档收尾。

## Risks And Notes
- 当前 `requires_user_acceptance: false`，但如果继续改 UI 或交互，需要按 `docs/ui.md` 和 `AGENTS.md` 进入用户验收。
- stable API、架构、数据模型、安全/隐私或 release 范围变化需要 owner approval。
- CloudBase 高影响操作必须记录环境、资源、操作结果；需要清库时先确认目标环境。
- TASK-011 已经跨越后端、前端适配和小程序体验修复；新发现若不直接阻塞真实联调，应拆到后续 TASK 或 Backlog。
