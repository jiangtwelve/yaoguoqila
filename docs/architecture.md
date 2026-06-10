---
status: draft
project_type: ui_product
frontend_stack: "uni-app + Vue 3 + TypeScript"
backend_stack: "WeChat Cloud Development"
database: "WeChat Cloud Database"
auth: "WeChat Login"
deployment: "WeChat Mini Program Cloud Development"
updated: 2026-06-10
---

# Architecture

## 技术方向候选

### Option A: uni-app + TypeScript + 云开发/自建后端
- 优点：更贴近「微信小程序、Android、iOS 三端通用」目标；同一套 Vue 生态代码可多端编译。
- 风险：三端组件和推送能力仍有差异，需要较早设计平台适配层。
- 适合：希望尽快验证三端通用产品。

### Option B: Taro + TypeScript + React 生态 + 自建后端
- 优点：React 生态成熟，适合组件化和复杂前端状态；可编译到小程序和移动端方案。
- 风险：App 端体验和原生能力仍需额外适配；团队需熟悉 React/Taro。
- 适合：未来 Web/React 生态复用较多的团队。

### Option C: 微信小程序原生优先 + 后续独立 Android/iOS
- 优点：最快打磨微信小程序体验，订阅消息和微信登录路径清晰。
- 风险：三端通用目标会推迟，后续可能重复开发。
- 适合：首批用户主要来自微信生态。

## 已确认技术方向
- Project type: `ui_product`。当前 v0.1 release 主表面是微信小程序；后端/API、CloudBase 和云存储是支撑小程序测试版闭环的能力。
- Frontend: `uni-app + Vue 3 + TypeScript`。原因是三端通用优先级较高，需要同一套代码覆盖微信小程序、Android 和 iOS。
- Backend: 微信云开发优先，包括云函数、云数据库、云存储。
- Backend tooling: 使用 CloudBase MCP 辅助部署和联调微信云开发资源；本地模式通过 `npx @cloudbase/cloudbase-mcp@latest` 启动。
- Cloud Function shape: TASK-011 采用单入口物理云函数 `yaoguoqiApi` 承载 `docs/api.md` 中的逻辑 service contract。前端调用 `yaoguoqiApi`，并在 payload 中传 `action`，例如 `item.createItem`；云函数内部统一分发、校验权限和映射字段。
- Database: 微信云数据库，集合设计围绕 `users`、`families`、`familyMembers`、`items`、`locations`、`categories`、`notificationLogs`。
- Auth: MVP 使用微信登录获取用户身份；App 端登录方式作为后续跨端扩展问题。
- Storage: 微信云存储用于物品图片，前端通过上传适配层调用，避免页面直接依赖平台 API。
- Notification: MVP 先实现应用内提醒和模拟通知；微信订阅消息 + App 系统通知作为后续 Notification Adapter 接入。
- Language: TypeScript 优先。
- Test strategy: 前端组件/服务单测 + 核心过期计算单测 + 端到端关键流程验证。

## 初步系统形态
- Client App: 跨端前端，包含页面、状态管理、平台适配层、服务调用层。
- Cloud Functions / Service Adapter: 管理家庭、成员、物品、提醒设置、图片元数据。前端页面只调用 service/adapter，不直接操作云数据库。
- Reminder Logic: MVP 前端/服务层先负责过期状态计算和应用内提醒展示。
- Scheduler/Reminder Service: 后续真实推送需要定期扫描或任务队列触发临期/过期提醒。
- Storage: 微信云存储负责物品图片上传与访问控制。
- Notification Adapters: 微信订阅消息、Android/iOS 推送的适配层。

## 关键领域模型
- User: 用户账号和平台身份。
- Family: 家庭单位。
- FamilyMember: 用户在家庭中的成员身份。
- Item: 家庭下的物品。
- Location: 家庭内位置。
- Category: 物品分类。
- ReminderRule: 物品或家庭默认提醒规则。
- NotificationLog: 提醒发送记录。

## Platform Constraints
- 微信云开发最适合微信小程序首发，Android/iOS 端后续需要确认是否通过统一 HTTPS 云函数/API 访问，或迁移到自建后端。
- 微信小程序订阅消息通常需要用户授权，不能无限制主动推送。
- Android/iOS 推送需要系统通知权限和推送服务配置。
- 三端图片选择、压缩、上传、权限提示存在平台差异。
- 后台提醒不应依赖客户端常驻，应由服务端定时任务处理。
- MVP 不接真实推送时，仍要把通知相关逻辑封装为 adapter/service，避免页面代码和未来平台推送耦合。

## Run And Verify
- Install: `pnpm install`
- Dev H5: `pnpm dev:h5`
- Dev WeChat Mini Program: `pnpm dev:mp-weixin`
- Build H5: `pnpm build:h5`
- Build WeChat Mini Program: `pnpm build:mp-weixin`
- Typecheck: `pnpm typecheck`
- Test: `pnpm test`
- Preview: 微信小程序构建后，用微信开发者工具导入 `dist/build/mp-weixin`。

## Confirmed Decisions
- 2026-06-06: 前端技术路线选择 `uni-app + Vue 3 + TypeScript`。
- 2026-06-06: MVP 提醒能力选择应用内提醒优先，真实推送后续接入。
- 2026-06-06: 后端技术路线选择微信云开发优先，包括云函数、云数据库、云存储和微信登录。
- 2026-06-08: TASK-011 后端实现阶段使用 CloudBase MCP 辅助云函数、数据库、云存储和权限部署；当前配置已写入 Codex，全局 MCP 可能需要重启后生效。
- 2026-06-08: TASK-011 使用单入口物理云函数 `yaoguoqiApi` 承载 validated service contract；按用户要求已清空旧云函数和旧集合后重新创建新后端资源。
