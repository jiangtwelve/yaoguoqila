---
id: TASK-006
title: 实现物品详情与处理操作原型
status: Done
type: design_implementation
dependencies: [TASK-004, TASK-005]
requires_user_acceptance: true
acceptance_status: accepted
updated: 2026-06-07
---

# TASK-006: 实现物品详情与处理操作原型

## Objective
实现物品详情页，帮助用户查看单个物品状态并执行处理动作。

## Scope
- 图片、名称、状态、到期信息、位置、备注。
- 编辑、删除、标记已用完。
- 正常、临期、今天过期、已过期、已处理、加载、错误、无权限状态。

## Non-Scope
- 不实现真实推送日志。
- 不实现复杂操作历史。

## Acceptance Criteria
- 用户确认物品详情信息优先级清楚。
- 用户确认处理动作符合日常使用习惯。

## Implementation Notes
- 新增 `src/pages/item-detail/index.vue`。
- 首页物品列表点击后进入详情页。
- 新增 `src/components/AppNavBar.vue`，新增物品页和详情页共用统一的自定义导航栏：左侧返回、标题居中、右侧预留微信胶囊操作栏。
- service/repository 增加 `getItemDetail`、`consumeItem`、`deleteItem` 原型能力。
- mock repository 支持详情页操作后更新本地 mock 数据。
- cloud adapter 预留对应云函数调用名，稳定 API contract 后再正式实现。
- 用户确认详情页不需要展示提醒信息；到期日修改合并到编辑信息里完成，不在详情页保留单独的延期入口。
- 用户确认「标记已用完」表示从当前库存移出但不等同删除；首页和搜索列表默认不展示已用完物品。
- 编辑信息页支持通过物品 id 回显并保存修改。
- 首页返回时刷新当前库存，避免标记已用完后列表仍显示旧数据。
- 首页统计使用当前库存完整数据，不随搜索结果变化；搜索框提供右侧清空按钮。
- 根据用户反馈重排详情页布局：强化物品图片、状态、到期日和录入方式展示，三个操作降级为底部紧凑工具条。
- 根据用户反馈将详情页改为有图/无图分流布局：有图片时保留大图展示，无图片时使用紧凑物品身份卡，不再预留大块图片占位。

## Verification
- `pnpm typecheck` 通过。
- `pnpm test` 通过。
- `pnpm build:mp-weixin` 通过。
