---
id: TASK-016
title: 云函数结构模块化与领域拆分评估
status: ready
type: refactor
release: post-v0.1
release_required: false
dependencies: [TASK-015]
requires_user_acceptance: false
acceptance_status: not_required
updated: 2026-06-11
---

# TASK-016: 云函数结构模块化与领域拆分评估

## Objective

改善当前 `yaoguoqiApi` 将所有 action 和领域逻辑集中在单个 `index.js` 文件中的可维护性问题，先完成内部模块化，再基于 v0.1 稳定后的业务边界评估是否拆分为多个物理云函数。

## Background

当前 `yaoguoqiApi` 集中了：

- action router
- 用户资料逻辑
- 家庭与成员逻辑
- 物品逻辑
- 位置历史逻辑
- 权限校验
- normalize / validation / date 工具

v0.1 阶段保留统一云函数入口有利于降低部署和验收风险，但继续把所有逻辑放在一个 `index.js` 中会导致维护困难、权限逻辑不一致、测试困难和多人协作冲突。

## Recommended Strategy

第一阶段不改变前端调用和 API contract：

- 保留云函数名：`yaoguoqiApi`
- 保留 action 形态：`family.createFamily`、`item.createItem` 等
- 将单文件拆成内部模块
- 不在 v0.1 验收期扩大为多个云函数

第二阶段在 v0.1 通过后评估物理云函数拆分：

- `familyApi`
- `itemApi`
- `mediaApi`
- `notificationApi`
- `homeApi`

## Scope

- 新增 `cloudfunctions/yaoguoqiApi/src/router.js`，集中处理 action 分发。
- 新增领域模块：
  - `src/domains/user.js`
  - `src/domains/family.js`
  - `src/domains/item.js`
  - `src/domains/location.js`
- 新增权限模块：
  - `src/policies/familyAccess.js`
- 新增工具模块：
  - `src/utils/date.js`
  - `src/utils/normalize.js`
  - `src/utils/validation.js`
- 保持 `index.js` 只负责 CloudBase 初始化和入口转发。
- 为关键纯函数和权限判断补充单元测试。
- 部署后完成一次 v0.1 主流程回归。
- 产出是否拆分多个物理云函数的评估结论。

## Non-Scope

- 不在第一阶段改变前端调用的云函数名。
- 不在第一阶段改变 `docs/api.md` 中已验证的 action contract。
- 不在第一阶段拆成每个 action 一个云函数。
- 不在 TASK-012 验收期执行此重构。

## Acceptance Criteria

- `yaoguoqiApi/index.js` 变薄，仅保留入口初始化和请求转发。
- 家庭、物品、用户、位置、权限和工具逻辑按模块归档。
- 前端调用无需修改，现有 action 名保持兼容。
- `pnpm typecheck`、`pnpm test`、`pnpm build:mp-weixin` 通过。
- 云函数重新部署后，v0.1 核心流程回归通过。
- 文档记录后续是否需要拆分为 `familyApi` / `itemApi` / `mediaApi` / `notificationApi`。

## Notes

物理云函数拆分建议放在 v0.1 稳定后再做，避免当前验收期扩大风险。若后续通知、图片、邀请等能力明显膨胀，再按领域拆分云函数，而不是按单个 action 拆分。
