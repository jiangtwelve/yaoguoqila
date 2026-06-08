---
id: TASK-008
title: 支持首页物品左滑删除与二次确认
status: Ready
type: feature_implementation
dependencies: [TASK-004, TASK-005, TASK-007]
requires_user_acceptance: true
acceptance_status: pending
updated: 2026-06-07
---

# TASK-008: 支持首页物品左滑删除与二次确认

## Objective
在首页物品列表中提供符合移动端习惯的删除能力。

## Scope
- 首页物品行支持左滑露出删除按钮。
- 点击删除后弹出二次确认。
- 确认删除后从列表移除，并更新顶部统计。
- mock service 增加删除接口能力。

## Non-Scope
- 不做批量删除。
- 不做撤销删除。
- 不接真实云函数。

## Acceptance Criteria
- 用户能通过左滑找到删除入口。
- 删除前有确认提示，避免误删。
- 删除后首页列表和临期/过期统计同步更新。

## Verification
- `pnpm typecheck`
- `pnpm test`
- `pnpm build:mp-weixin`
