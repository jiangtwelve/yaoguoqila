---
id: TASK-008
title: 支持首页物品左滑删除与二次确认
status: Done
type: feature_implementation
dependencies: [TASK-004, TASK-005, TASK-007]
requires_user_acceptance: true
acceptance_status: accepted
updated: 2026-06-08
---

# TASK-008: 支持首页物品左滑删除与二次确认

## Objective
在首页物品列表中提供符合移动端习惯的删除能力。

## Scope
- 首页物品行支持左滑露出删除按钮。
- 点击删除后弹出二次确认。
- 确认删除后从列表移除，并更新顶部统计。
- mock service 增加删除接口能力。

## Non-Scope
- 不做批量删除。
- 不做撤销删除。
- 不接真实云函数。

## Acceptance Criteria
- 用户能通过左滑找到删除入口。
- 删除前有确认提示，避免误删。
- 删除后首页列表和临期/过期统计同步更新。

## Implementation Notes
- 首页物品行改为 `swipe-row` 容器，左滑后将物品卡片横向平移，露出右侧删除按钮。
- 删除按钮点击后通过 `uni.showModal` 二次确认。
- 确认后调用 `deleteItem(item.id)`，并同步更新 `home.items` 与 `visibleItems`，让列表和顶部统计立即刷新。
- mock repository 已有 `deleteItem` 能力，本任务接入首页交互层。
- 修复首版问题：删除层默认渲染在右侧且被透明物品行透出。现在删除层默认隐藏、不可点击，只有当前行左滑打开时才显示。
- 优化滑动动画：从“松手后切换位移”改为手指移动时前景行跟随滑动；删除层保持稳定底层，不再做淡入，减少白色闪动。

## Verification
- `pnpm typecheck` 通过。
- `pnpm test` 通过。
- `pnpm build:mp-weixin` 通过。
