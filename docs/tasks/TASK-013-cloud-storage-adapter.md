---
id: TASK-013
title: 图片云存储 adapter 正式接入
status: Ready
type: integration
release: v0.1
release_required: true
dependencies: [TASK-011]
requires_user_acceptance: true
acceptance_status: pending
updated: 2026-06-09
---

# TASK-013: 图片云存储 adapter 正式接入

## Objective
以 service/adapter 边界接入云存储图片能力，避免页面直接依赖 cloud client，并保持 mock 与 cloud 两种模式都可用。

## Scope
- 新增图片存储 service/adapter 抽象。
- mock 模式保留本地临时路径或静态图片。
- cloud 模式上传微信云存储，返回可保存的 `imageUrls`。
- 处理首页封面、详情走马灯、点击预览所需的展示 URL。
- 新增/编辑表单只调用 service，不直接 import cloud client。

## Non-Scope
- 不实现图片压缩策略细化。
- 不实现云存储垃圾清理。
- 不实现跨端 App 图片上传策略。

## Acceptance Criteria
- mock 模式选择图片后仍可保存和预览。
- cloud 模式选择图片后上传成功，保存到物品记录。
- 首页展示第一张图片作为封面。
- 详情页展示多图并支持预览。
- 页面不直接依赖 cloud client。

## Verification
- `pnpm typecheck`
- `pnpm test`
- `pnpm build:mp-weixin`
- 微信开发者工具手动验收。
