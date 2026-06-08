---
id: 008
title: 使用 CloudBase MCP 辅助微信云开发后端部署
status: accepted
updated: 2026-06-08
---

# Decision 008: 使用 CloudBase MCP 辅助微信云开发后端部署

## Context
项目已经完成前端 mock 原型和 `validated` API contract。下一阶段进入微信云开发后端实现，需要创建云数据库集合、实现云函数、配置权限并准备云存储图片上传。

## Decision
在 Codex 中配置 CloudBase MCP，本地模式通过 `npx @cloudbase/cloudbase-mcp@latest` 启动，作为后续云开发资源部署和联调的辅助工具。

## Rationale
- 本地模式功能最完整，支持依赖本地文件系统的能力，更适合上传/更新本项目云函数代码。
- CloudBase MCP 覆盖后端实现阶段需要的关键能力：环境登录/查询、NoSQL 数据库结构与内容管理、云函数查询/创建/更新/调用、云存储、权限和日志。
- 当前不在配置中写入密钥，后续通过 MCP 登录或绑定环境，减少敏感信息落盘风险。

## Capability Boundary
- 可用于：CloudBase 环境登录与绑定、数据库集合与索引管理、云函数部署/调用、云存储文件管理、权限规则、日志查询。
- 不代替：业务代码设计、权限模型审查、真实用户验收、上线发布确认。
- 高影响操作如删除集合、覆盖云函数、修改权限规则、发布上线前仍需明确确认。

## Implementation Notes
- 已在 `~/.codex/config.toml` 添加 `mcp_servers.cloudbase`。
- 已通过授权网络探测解析到 `@cloudbase/cloudbase-mcp@2.21.1`。
- 当前 Codex 会话未热加载新 MCP；通常需要重启 Codex 或开启新会话后生效。
