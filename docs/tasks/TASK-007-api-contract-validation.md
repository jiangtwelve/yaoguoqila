---
id: TASK-007
title: 基于已验证前端更新 API contract
status: Ready
type: api_design
dependencies: [TASK-004, TASK-005, TASK-006]
requires_user_acceptance: false
acceptance_status: not_required
updated: 2026-06-06
---

# TASK-007: 基于已验证前端更新 API contract

## Objective
在首页、物品表单和物品详情原型验证后，更新 API contract，使其贴合真实页面和 service 数据需求。

## Scope
- 对齐 `docs/api.md` 的模型、字段、云函数映射和 mock 示例。
- 标注 contract status 为 `validated`。
- 记录后续微信云函数实现任务。

## Non-Scope
- 不把 API 标记为 `stable`。
- 不实现真实云函数。

## Acceptance Criteria
- API contract 与已验证前端字段一致。
- 后续后端任务可以直接按 contract 实现。

## Verification
- 文档自查：页面 service 需要的字段都在 contract 中。
- `pnpm typecheck`
- `pnpm test`
