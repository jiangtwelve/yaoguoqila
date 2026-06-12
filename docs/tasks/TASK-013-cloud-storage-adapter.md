---
id: TASK-013
title: 图片云存储 adapter 正式接入
status: current
type: integration
release: v0.1
release_required: true
dependencies: [TASK-011]
requires_user_acceptance: true
acceptance_status: pending
updated: 2026-06-12
---

# TASK-013: 图片云存储 adapter 正式接入

## Objective
以 service/adapter 边界接入云存储图片能力，避免页面直接依赖 cloud client，并保持 mock 与 cloud 两种模式都可用。

## Scope
- 新增图片存储 service/adapter 抽象。
- mock 模式保留本地临时路径或静态图片。
- cloud 模式上传微信云存储，返回可保存的结构化图片资源。
- 新增 `ItemImage` 图片资源模型，兼容旧 `imageUrl` / `imageUrls` 字段。
- 小程序端选择图片后先保留本地路径，保存时再上传云存储。
- 在当前 item 范围内使用 MD5 做重复图片识别与误删后复用，不跨 item 复用。
- 为首页封面生成缩略图，首页优先展示缩略图，详情和预览继续使用原图。
- 编辑保存成功后清理当前 item 不再引用的旧云存储图片；删除物品成功后清理该物品图片。
- 处理首页封面、详情走马灯、点击预览所需的展示 URL。
- 新增/编辑表单只调用 service，不直接 import cloud client。

## Non-Scope
- 不实现跨端 App 图片上传策略。
- 不实现后台定时清理队列；当前阶段采用主操作成功后直接清理，清理失败只记录日志。

## Acceptance Criteria
- 选择多张大图后先立即展示本地预览，前端不读取图片内容、不计算 MD5，优先保证表单交互流畅。
- 上传数量限制为最多 6 张，格式限制在逻辑层处理，不在上传区额外增加说明 UI。
- 保存阶段使用统一 `保存中` loading，保存成功前图片列表不应整体闪动。
- 云存储路径按家庭、日期、item/draft scope 分区，便于在控制台定位。
- mock 模式选择图片后仍可保存和预览。
- cloud 模式选择图片后只进入本地表单状态，点击保存时再上传云存储。
- 数据库记录包含结构化 `images`，并兼容 `imageUrl` / `imageUrls`。
- v0.1 不做前端内容级图片去重；重复内容图片允许保存，后续如需去重再评估云端图片指纹。
- 首页优先展示第一张图片的 `thumbnailFileId`，并启用懒加载。
- 详情页展示原图并支持预览。
- 编辑保存成功后，当前 item 不再引用的旧云存储图片会被清理。
- 删除物品成功后，该物品的云存储图片会被清理。
- 页面不直接依赖 cloud client。

## Verification
- `pnpm typecheck` ✅
- `pnpm test` ✅（35/35）
- `pnpm build:mp-weixin` ✅（仅 Sass legacy JS API deprecation warning）
- 微信开发者工具手动验收。
