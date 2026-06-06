---
id: TASK-004
title: 实现家庭首页 Design Anchor 静态/Mock 原型
status: Done
type: design_implementation
dependencies: [TASK-003]
requires_user_acceptance: true
acceptance_status: accepted
updated: 2026-06-06
---

# TASK-004: 实现家庭首页 Design Anchor 静态/Mock 原型

## Objective
实现家庭首页作为首个 Design Anchor，建立产品的视觉和交互方向。

## Scope
- 当前家庭名称和家庭切换入口。
- 首次昵称设置弹窗。
- 无家庭空状态，包含创建家庭和加入/接受邀请入口。
- 无物品空状态。
- 查询框。
- 按剩余保质期升序排序的全部物品列表。
- 临期/过期状态标识。
- 新增入口。
- 覆盖正常、空状态、加载、错误、无权限等必要状态。

## Non-Scope
- 不接真实 API。
- 不实现完整家庭设置。
- 不标记 Done，直到用户亲自验收视觉和交互。

## Acceptance Criteria
- 用户确认视觉方向适合产品。已确认：用户反馈“当前首页的效果很不错”。
- 用户确认核心首页交互符合预期。已确认继续进入新增表单。
- docs/ui.md 更新为已接受的视觉系统。

## Verification
- `pnpm typecheck`
- `pnpm test`
- `pnpm build:mp-weixin`
- 本地预览并检查移动端布局、文本溢出、状态切换和交互反馈。
