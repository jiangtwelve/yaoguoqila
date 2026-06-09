---
id: TASK-014
title: 加入家庭与邀请最小流程
status: Ready
type: feature
release: v0.1
release_required: true
dependencies: [TASK-011, TASK-012]
requires_user_acceptance: true
acceptance_status: pending
updated: 2026-06-09
---

# TASK-014: 加入家庭与邀请最小流程

## Objective
实现 v0.1 所需的最小加入家庭能力，让无家庭用户既可以创建家庭，也可以接受邀请加入家庭。

## Scope
- 为家庭生成或刷新可分享的邀请码/邀请 token。
- 无家庭状态的“加入家庭”入口可输入邀请码。
- 云函数校验邀请码有效性并将用户加入家庭。
- 加入成功后设置或刷新当前家庭。

## Non-Scope
- 不实现审批流程。
- 不实现成员角色细分。
- 不实现邀请链接复杂分享页。

## Acceptance Criteria
- 已有家庭用户可获得邀请信息。
- 新用户可通过邀请码加入家庭。
- 加入后首页展示该家庭及物品列表。
- 无效或过期邀请码有明确错误提示。

## Verification
- `pnpm typecheck`
- `pnpm test`
- `pnpm build:mp-weixin`
- 微信开发者工具手动验收。
