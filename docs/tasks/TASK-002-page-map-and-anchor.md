---
id: TASK-002
title: 确认 MVP 页面地图与首个 Design Anchor
status: Done
type: design
dependencies: [TASK-001]
requires_user_acceptance: true
acceptance_status: accepted
updated: 2026-06-06
---

# TASK-002: 确认 MVP 页面地图与首个 Design Anchor

## Objective
确认 MVP 页面、导航关系和首个用于建立视觉方向的 Design Anchor。

## Scope
- 审阅并调整 docs/page-map.md。
- 确认单首页主界面、入口弹窗和家庭切换方式。
- 确认首个 Design Anchor 为家庭首页，且首页同时承担物品列表。
- 明确每页必须覆盖的状态。

## Non-Scope
- 不实现页面代码。
- 不做最终 UI 验收。

## Acceptance Criteria
- 用户确认页面地图可以用于开始原型开发。已确认：2026-06-06 用户回复“确认”。
- 已确认方向：MVP 不使用底部 Tab，首页展示当前家庭所有物品。
- 用户确认首页列表控制。已确认：首页只保留查询，不做状态筛选，默认按剩余保质期升序排序。
- 用户确认新增物品日期规则。已确认：同时支持直接填写过期日期，以及生产日期 + 保质期自动计算，表单用「或」分隔。
- 用户确认首次昵称设置使用单输入框弹窗，不单独设置页面。
- 用户确认无家庭时展示首页空状态，不强制弹出创建家庭弹窗；创建家庭由用户主动点击后用单输入框弹窗完成。
- 用户确认 Design Anchor 页面为家庭首页。
- docs/page-map.md 和 docs/handoff.md 更新为已确认状态。

## Verification
- 文档自查页面、路由、数据依赖、导航关系完整。
- `docs/page-map.md` 已覆盖首页、首次昵称弹窗、无家庭空状态、创建家庭弹窗、家庭切换、新增/编辑物品和物品详情。
