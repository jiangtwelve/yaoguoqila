---
id: TASK-003
title: 搭建跨端前端项目骨架与 mock service 结构
status: Done
type: implementation
dependencies: [TASK-001, TASK-002]
requires_user_acceptance: false
acceptance_status: not_required
updated: 2026-06-06
---

# TASK-003: 搭建跨端前端项目骨架与 mock service 结构

## Objective
根据已确认技术栈创建可运行的 uni-app 前端项目骨架，并预留 mock service 与微信云开发 service/adapter 层。

## Scope
- 初始化项目结构。
- 配置 TypeScript、lint/build/test 基础命令。
- 创建 domain models、fixtures、services/adapters 的最小结构。
- 创建微信云开发调用适配层的占位结构，页面不得直接操作云数据库或云存储。
- 添加运行和验证说明。

## Non-Scope
- 不实现完整页面视觉。
- 不实现完整云函数业务逻辑。
- 不申请推送权限。

## Acceptance Criteria
- 项目可以启动或构建。
- 页面代码不直接依赖 mock 数据文件，而是通过服务层。
- 页面代码不直接依赖微信云开发 API，而是通过 cloud adapter。
- docs/architecture.md 的运行命令已更新。

## Verification
- `pnpm typecheck` 通过。
- `pnpm test` 通过，1 个测试文件 3 个测试。
- `pnpm build:mp-weixin` 通过，产物位于 `dist/build/mp-weixin`。
