---
id: TASK-007
title: 支持物品多图上传与首页封面图
status: Done
type: feature_implementation
dependencies: [TASK-004, TASK-005, TASK-006]
requires_user_acceptance: true
acceptance_status: accepted
updated: 2026-06-08
---

# TASK-007: 支持物品多图上传与首页封面图

## Objective
将物品图片能力从单图扩展为多图，首页默认展示第一张图片作为封面。

## Scope
- 数据模型从单图 `imageUrl` 扩展到多图 `imageUrls`。
- 新增/编辑表单支持选择多张图片。
- 首页列表优先展示 `imageUrls[0]`。
- 无图片时展示统一占位图标。
- mock service、fixtures 和 API contract 同步更新。

## Non-Scope
- 不做云存储真实上传。
- 不做图片拖拽排序。
- 不做 OCR 图片识别。

## Acceptance Criteria
- 用户可以在表单中选择多张图片。
- 首页展示第一张图片作为物品封面。
- 删除第一张图片后，下一张图片自然成为封面。

## Implementation Notes
- 数据模型新增 `imageUrls: string[]`，保留 `imageUrl` 作为兼容/封面冗余字段。
- 新增/编辑表单图片区改为多图网格，最多选择 9 张图片。
- 第一张图片显示「封面」标记。
- 每张图片支持单独删除；删除第一张后，下一张会成为新的 `imageUrls[0]`。
- 首页列表和详情页优先使用 `imageUrls[0]`，兼容旧 `imageUrl`。
- mock fixtures 已迁移到 `imageUrls`，API 草案同步记录多图字段。
- 详情页有多张图片时使用走马灯展示，点击图片调用 `uni.previewImage` 放大预览。
- 首页只在首次进入或收到数据变更标记时刷新，普通从详情页返回时保留滚动位置。
- 新增或编辑物品保存后，首页刷新完成会自动滚动到目标物品卡片位置；刷新时不再用 loading 空状态替换首页内容，避免先回到顶部。

## Verification
- `pnpm typecheck` 通过。
- `pnpm test` 通过。
- `pnpm build:mp-weixin` 通过。
