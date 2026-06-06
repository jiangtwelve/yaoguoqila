---
id: TASK-006
title: 实现物品详情与处理操作原型
status: Ready
type: design_implementation
dependencies: [TASK-004]
requires_user_acceptance: true
acceptance_status: pending
updated: 2026-06-06
---

# TASK-006: 实现物品详情与处理操作原型

## Objective
实现物品详情页，帮助用户查看单个物品状态并执行处理动作。

## Scope
- 图片、名称、状态、到期信息、位置、备注、提醒信息。
- 编辑、删除、标记已用完、延期/更新过期时间。
- 正常、临期、今天过期、已过期、已处理、加载、错误、无权限状态。

## Non-Scope
- 不实现真实推送日志。
- 不实现复杂操作历史。

## Acceptance Criteria
- 用户确认物品详情信息优先级清楚。
- 用户确认处理动作符合日常使用习惯。

## Verification
- `pnpm typecheck`
- `pnpm test`
- `pnpm build:mp-weixin`

