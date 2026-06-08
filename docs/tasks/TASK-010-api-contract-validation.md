---
id: TASK-010
title: 基于已验证前端更新 API contract
status: Done
type: api_design
dependencies: [TASK-004, TASK-005, TASK-006, TASK-007, TASK-008, TASK-009]
requires_user_acceptance: false
acceptance_status: not_required
updated: 2026-06-08
---

# TASK-010: 基于已验证前端更新 API contract

## Objective
在首页、物品表单、物品详情、多图上传和删除交互验证后，更新 API contract，使其贴合真实页面和 service 数据需求。

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

## Implementation Notes
- `docs/api.md` 已从 `draft` 升级为 `validated`。
- `Item` 补齐 `locationName` 字段，匹配位置自由输入和首页/详情展示需求。
- 补齐 `FamilyHome`、`ItemDetail` 模型，匹配当前 `HomeRepository` 返回值。
- 首页 contract 从旧的统计摘要结构改为当前前端实际使用的 `FamilyHome`：`user`、`currentFamily`、`families`、`locations`、`items`。
- 补齐 `item.getItemDetail` / `GET /items/{itemId}` contract。
- `ItemInput` 记录多图字段 `imageUrls`、封面兼容字段 `imageUrl`、日期录入字段和位置自由输入字段。
- 云函数 payload/result 已按 `CloudHomeRepository` 和 `HomeRepository` 对齐。
- 明确当前 contract 为 `validated`，不是 `stable`；真实云函数、数据库集合和云存储联调完成后再升级。

## Verification
- 文档自查：页面 service 需要的字段都在 contract 中。
- `pnpm typecheck` 通过。
- `pnpm test` 通过。
