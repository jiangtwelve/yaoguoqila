---
id: TASK-015
title: v0.1 测试版验收与体验修复
status: Ready
type: release_acceptance
release: v0.1
release_required: true
dependencies: [TASK-011, TASK-012, TASK-013, TASK-014]
requires_user_acceptance: true
acceptance_status: pending
updated: 2026-06-09
---

# TASK-015: v0.1 测试版验收与体验修复

## Objective
对照 `docs/releases/v0.1.md` 完成测试版级别的端到端验收，并修复阻塞测试体验的问题。

## Scope
- 按 v0.1 release acceptance 表逐项验收。
- 修复阻塞测试版闭环的体验、数据、交互或云函数问题。
- 更新 `docs/api.md` 的状态判断；若真实联调通过，可准备从 `validated` 升级到 `stable`，但需要用户确认。
- 更新 `docs/releases/v0.1.md` exit criteria。

## Non-Scope
- 不新增 v0.1 退出标准之外的新功能。
- 不接真实订阅消息。
- 不做正式发布上架。

## Acceptance Criteria
- v0.1 release acceptance 表全部通过。
- 用户明确确认 v0.1 可作为测试版体验。
- 后续非阻塞问题进入 v0.2 或 Backlog。

## Verification
- `pnpm typecheck`
- `pnpm test`
- `pnpm build:mp-weixin`
- 微信开发者工具完整手动验收。
