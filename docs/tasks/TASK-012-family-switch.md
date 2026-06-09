---
id: TASK-012
title: 家庭切换功能
status: Ready
type: feature
release: v0.1
release_required: true
dependencies: [TASK-011]
requires_user_acceptance: true
acceptance_status: pending
updated: 2026-06-09
---

# TASK-012: 家庭切换功能

## Objective
实现首页点击当前家庭名称后切换家庭，让多家庭场景形成可用闭环。

## Scope
- 点击首页家庭名称打开轻量弹窗或底部面板。
- 展示当前用户已加入的家庭列表。
- 选择家庭后调用云端切换动作，持久化 `currentFamilyId`。
- 切换成功后刷新首页物品、位置和统计。
- 保留无家庭状态下的创建/加入入口。

## Non-Scope
- 不实现复杂成员权限。
- 不实现家庭管理页。
- 不实现家庭退出、解散、移除成员。

## Acceptance Criteria
- 用户可看到所有已加入家庭。
- 当前家庭有明确选中状态。
- 切换家庭后首页名称、物品列表、位置和统计同步变化。
- 切换失败时有清晰错误提示。

## Verification
- `pnpm typecheck`
- `pnpm test`
- `pnpm build:mp-weixin`
- 微信开发者工具手动验收。
