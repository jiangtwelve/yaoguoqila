---
id: TASK-011
title: 搭建微信云开发后端基础能力
status: Current
type: backend_implementation
dependencies: [TASK-010]
requires_user_acceptance: false
acceptance_status: not_required
updated: 2026-06-08
---

# TASK-011: 搭建微信云开发后端基础能力

## Objective
基于已验证 API contract，实现微信云开发后端基础能力，让前端可以从 mock repository 切换到 cloud repository 进行真实联调。

## Scope
- 接入 CloudBase MCP，为后续云函数、数据库和云存储部署做准备。
- 盘点当前 CloudBase 环境，确认已有集合和历史云函数，避免覆盖旧资源。
- 设计并创建云数据库集合：`users`、`families`、`familyMembers`、`items`、`locations`、`notificationLogs`。
- 通过单入口物理云函数 `yaoguoqiApi` 实现以下逻辑动作：
  - `user.updateProfile`
  - `family.createFamily`
  - `home.getFamilyHome`
  - `item.getFormOptions`
  - `item.listItems`
  - `item.getItemDetail`
  - `item.createItem`
  - `item.updateItem`
  - `item.consumeItem`
  - `item.deleteItem`
- 接入微信登录身份，确保用户只能访问自己家庭下的数据。
- 预留云存储图片上传适配层，返回 `imageUrls`。

## Non-Scope
- 不实现完整家庭邀请、审批和权限细分。
- 不实现真实微信订阅消息或 App 推送。
- 不实现大数据量分页和虚拟列表后端优化。
- 不发布上线。

## Acceptance Criteria
- CloudBase MCP 已配置，后续可通过 MCP 登录/选择环境并部署云开发资源。
- 前端切换到 cloud repository 后，首页、详情页、新增/编辑、删除、标记用完等主流程可真实联调。
- 云函数返回结构与 `docs/api.md` 的 `validated` contract 一致。
- 基础权限校验阻止跨家庭访问。

## Implementation Notes
- 已阅读 CloudBase MCP 官方文档，优先选择本地模式：`npx @cloudbase/cloudbase-mcp@latest`。
- 已将 CloudBase MCP 追加到 `~/.codex/config.toml`，server 名称为 `cloudbase`。
- 当前配置不包含密钥；Codex 重启后已通过 CloudBase MCP 自动绑定环境 `cloud1-d8gr12cmd6578bfd0`。
- 已通过授权网络探测解析到 `@cloudbase/cloudbase-mcp@2.21.1`。
- 当前云环境原本不是空环境，存在 `login`、`familyCreate`、`itemList`、`itemAdd`、`itemUpdate`、`itemDelete` 等历史函数，以及 `users`、`families`、`items`、`locationHistory` 等旧集合。
- 用户要求先清空旧函数和旧数据库后再操作；已通过 CloudBase MCP 删除 24 个旧函数和 8 个旧集合，并复查函数数为 0、集合数为 0。
- 已创建新集合：`users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`，并添加基础查询索引。
- 已新增本地云函数目录 `cloudfunctions/yaoguoqiApi`，作为 TASK-011 新后端实现入口。
- 已创建并部署云函数 `yaoguoqiApi`，运行时为 `Nodejs18.15`。
- 已更新前端 `CloudHomeRepository` 底层调用：逻辑函数名作为 `action` 传给 `yaoguoqiApi`。
- CloudBase MCP 能力边界：
  - 适合：环境登录/查询、NoSQL 数据库结构与数据管理、云函数查询/创建/更新/调用、云存储、权限、安全域名、日志等。
  - 本地模式功能最全，可访问本地文件系统，适合部署本项目云函数。
  - 托管模式不依赖本机 Node，但本地文件上传、模板下载等能力受限。
  - 实际操作云资源前仍需要用户提供/登录 CloudBase 环境，并确认高影响操作。

## Verification
- `node --version` 符合要求：v24.15.0。
- `npx @cloudbase/cloudbase-mcp@latest --help` 已可解析安装包。
- 已复查 CloudBase 云函数列表：仅存在 `yaoguoqiApi`。
- 已复查 CloudBase 集合列表：存在 `users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`。
- MCP 管理端调用 `yaoguoqiApi` 返回 `无法获取用户身份`，符合预期；真实 OPENID 需从微信小程序端调用获取。
- `pnpm typecheck` 通过。
- `pnpm test` 通过。
- `pnpm build:mp-weixin` 通过。
- 云函数本地/开发环境调用验证。
- `pnpm typecheck`
- `pnpm test`
- `pnpm build:mp-weixin`
