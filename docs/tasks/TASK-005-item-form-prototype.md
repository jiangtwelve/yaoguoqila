---
id: TASK-005
title: 实现新增/编辑物品表单原型
status: Done
type: design_implementation
dependencies: [TASK-004]
requires_user_acceptance: true
acceptance_status: accepted
updated: 2026-06-07
---

# TASK-005: 实现新增/编辑物品表单原型

## Objective
实现新增/编辑物品表单原型，覆盖物品录入的核心字段和两种过期日期录入方式。

## Scope
- 图片、名称、位置、备注。
- 直接填写过期日期。
- 或填写生产日期 + 保质期自动计算过期日期。
- 位置支持自由输入，并展示历史位置快捷选择。
- 保存、取消、校验错误、保存失败。
- 编辑页回显 `expiryInputMode`。

## Non-Scope
- 不接真实云函数。
- 不做 OCR 或条码识别。
- 不在用户验收表单交互前标记 Done。

## Acceptance Criteria
- 用户确认表单信息结构清楚，不显得臃肿。
- 用户确认「或」分隔的两种日期录入方式容易理解。
- 用户确认表单顺序为图片、名称、日期、位置、备注，且名称和日期为必填。

## Verification
- `pnpm typecheck`
- `pnpm test`
- `pnpm build:mp-weixin`
