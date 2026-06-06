---
id: 006
status: accepted
date: 2026-06-06
decision_type: architecture
---

# Decision 006: 后端技术路线选择微信云开发

## Context
项目首发形态包含微信小程序，同时希望未来扩展到 Android 和 iOS。MVP 需要尽快验证家庭、物品录入、首页排序和应用内提醒，后端需要支持用户身份、家庭数据、物品数据和图片存储。

## Decision
MVP 后端选择微信云开发优先：
- 微信登录。
- 云数据库。
- 云函数。
- 云存储。

## Rationale
- 对微信小程序 MVP 友好，登录、数据库、存储和云函数集成路径短。
- 能降低首版部署和运维成本。
- 适合先验证产品核心体验。

## Consequences
- 前端页面必须通过 service/adapter 访问数据，不能直接耦合云数据库和云存储调用。
- API contract 保留 REST-like 语义，实际 MVP 可映射为云函数调用。
- Android/iOS 端后续需要确认访问微信云开发资源的方式，或在增长后迁移到自建后端。
- TASK-003 应建立 mock service 与 cloud adapter 双层结构，为原型和后续云开发接入同时服务。
