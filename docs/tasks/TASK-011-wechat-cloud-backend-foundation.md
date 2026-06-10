---
id: TASK-011
title: 搭建微信云开发后端基础能力
status: Current
type: backend_implementation
release: v0.1
release_required: true
dependencies: [TASK-010]
requires_user_acceptance: false
acceptance_status: not_required
updated: 2026-06-09
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
- 首页设置昵称、创建家庭弹窗已接入真实 service 调用，并按当前流光毛玻璃风格重新设计。
- 所有页面初始加载已统一为骨架屏，避免空白页中间单独 spinner 或 loading 文案的体验。
- 已按用户确认将 `docs/ui.md` 的 UI 基线更新为已验收，并记录后续样式微调必须同步更新 UI 文档。
- 已审查 TASK-011 未提交改动并修复新增/编辑页表单加载与保存按钮状态问题：表单选项加载前显示骨架屏，保存按钮禁用和保存中状态保持清晰可见。
- 已按用户反馈继续微调：新增模式进入表单不显示骨架屏，编辑模式保留骨架屏；禁用保存按钮改为去饱和灰玻璃，明确表达不可点击。
- 已按用户反馈新增：新增物品若会直接成为临期、今天到期或已过期状态，保存前二次确认；保质期数值输入占位文本改为稳定文本层，修复首次打开偏移。
- 已修复微信开发者工具反馈：新增临期物品点击保存时 `a.getItemStatus` 未定义。表单页新增确认和预计到期状态改为页面内稳定计算，避免小程序运行时依赖 `@/domain/expiry` 导出对象。
- 已修复微信开发者工具反馈：新增临期物品点击保存后无任何反应。保存按钮只有保存中才原生禁用；表单未准备或字段缺失时会提示原因，满足条件时继续进入临期/过期二次确认。
- 已彻查新增临期确认链路最终根因：微信小程序 `showModal` 按钮文案最多 4 个字符，原取消文案 `再检查一下` 超限导致弹窗 fail；已改为 `再检查` / `仍保存`，并在 UI 文档记录约束。
- 已按用户反馈优化新增风险确认弹窗：显示标题「提醒」，提示文本居中，按钮为 `取消` / `确认`；临期显示剩余天数，已过期直接提示已过期，今天到期单独提示今天就要过期。
- 已按用户反馈将设置昵称、创建家庭和新增风险确认统一提取为 `GlassModal` 组件；后续类似轻量弹窗统一沿用这一套视觉和交互。当前弹窗遮罩已减薄，避免看不清蒙版后的页面。
- 已修复保存按钮覆盖备注 `textarea` 时可能同时触发保存和键盘的问题：新增/编辑页固定保存按钮使用 `cover-view` 覆盖原生输入层，保存入口主动收起键盘，风险确认打开时隐藏保存覆盖层。
- 已按用户反馈补充项目级组件抽取规则：同类 UI、交互流程、状态处理或样式结构在 2 处及以上出现，且需要统一微调或保持同一视觉语言时，agent 应主动抽取共享组件、组合函数或样式抽象；若暂缓抽取，必须记录原因和后续触发条件。
- 已按用户反馈补充新增/编辑物品表单 loading/saving 锁定：表单加载中或保存中禁用图片、输入框、picker、历史位置和备注操作；保存中增加 `cover-view` 触摸屏蔽层，避免小程序原生输入组件继续响应。
- 已按用户要求清空真实 CloudBase 业务数据，用于重新进行一轮干净数据验收测试：环境 `cloud1-d8gr12cmd6578bfd0` 中 `users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs` 均已清空。
- 已按用户反馈优化本轮验收 UI：设置昵称和创建家庭弹窗回到极简结构，移除堆叠提示文本和字段标签，通过更显眼的大输入槽突出输入动作；临期确认缩短文案并高亮剩余天数；新增/编辑保存中升级为全屏轻玻璃 `cover-view` loading。
- 已修复微信开发者工具自动真机调试异常：`src/pages.json` 显式声明空 `subPackages`，避免 DevTools `2.01.2510290` 在无分包项目上读取分包字段时报 `Cannot read property 'subPackages' of undefined`。
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
- 2026-06-09 首页弹窗和 loading UI 调整后，`pnpm test`、`pnpm typecheck`、`pnpm build:mp-weixin` 均通过。
- 2026-06-09 全页面骨架屏 loading 调整后，`pnpm test`、`pnpm typecheck`、`pnpm build:mp-weixin` 均通过。
- 2026-06-09 UI 验收状态与保存按钮状态调整后，`pnpm test`、`pnpm typecheck`、`pnpm build:mp-weixin` 均通过。
- 2026-06-09 新增表单 loading 与禁用按钮微调后，`pnpm test`、`pnpm typecheck`、`pnpm build:mp-weixin` 均通过。
- 2026-06-09 新增临期/过期确认与保质期占位修复后，`pnpm test`、`pnpm typecheck`、`pnpm build:mp-weixin` 均通过。
- 2026-06-09 H5 预览核验：新增页“填写”占位文本首次打开和刷新后位置稳定；已过期日期保存前会弹出二次确认。
- 2026-06-09 新增临期确认运行时修复后，`pnpm typecheck`、`pnpm test`、`pnpm build:mp-weixin` 均通过；已检查 `dist/build/mp-weixin/pages/item-form/index.js` 不再引用 `../../domain/expiry.js`。
- 2026-06-09 保存点击无反馈修复后，`pnpm typecheck`、`pnpm test`、`pnpm build:mp-weixin` 均通过；已检查 `dist/build/mp-weixin/pages/item-form/index.wxml` 中保存按钮原生 `disabled` 仅绑定保存中状态。
- 2026-06-09 确认弹窗文案超限修复后，`pnpm typecheck`、`pnpm test`、`pnpm build:mp-weixin` 均通过；已检查 `dist/build/mp-weixin/pages/item-form/index.js` 使用 `再检查` / `仍保存`，旧文案不再存在。
- 2026-06-09 风险确认弹窗文案优化后，`pnpm typecheck`、`pnpm test`、`pnpm build:mp-weixin` 均通过；已检查 `dist/build/mp-weixin/pages/item-form/index.js` 中确认弹窗不传 `title`，按钮为 `取消` / `确认`。
- 2026-06-09 自定义风险确认玻璃弹窗调整后，`pnpm typecheck`、`pnpm test`、`pnpm build:mp-weixin` 均通过；已检查 `dist/build/mp-weixin/pages/item-form/index.js` 和 `.wxml` 中风险确认不再调用 `showModal`，产物包含自定义玻璃弹窗结构。
- 2026-06-09 统一 `GlassModal` 与备注 `textarea` 触摸冲突修复后，`pnpm typecheck`、`pnpm test`、`pnpm build:mp-weixin` 均通过；已检查 `dist/build/mp-weixin/pages/item-form/index.wxml` 中保存按钮编译为 `cover-view` + `catchtap`，风险确认打开时由 `wx:if` 隐藏；`index.js` 中保存入口包含 `hideKeyboard()` 且风险确认路径不再调用 `showModal`。
- 2026-06-09 组件抽取规则补录后，`diff -q AGENTS.md CLAUDE.md` 和 `git diff --check` 均通过。
- 2026-06-09 新增/编辑物品表单 loading/saving 锁定后，`pnpm typecheck`、`pnpm test`、`pnpm build:mp-weixin` 均通过；已检查 `dist/build/mp-weixin/pages/item-form/index.wxml` 中 input、textarea、picker、button 均有 `disabled` 绑定，保存中触摸屏蔽层编译为 `cover-view` + `catchtap` / `catchtouchmove`。
- 2026-06-09 清空数据库验收准备：清理前复核 `users` 为 1，`families`、`items`、`locations`、`familyMembers`、`notificationLogs` 均为 0；执行清空后再次计数，六个集合均为 0；`pnpm build:mp-weixin` 通过并已刷新 `dist/build/mp-weixin`，仅有 Sass legacy JS API 警告。
- 2026-06-09 弹窗输入焦点、临期天数高亮和保存全屏 loading 调整后，`pnpm typecheck`、`pnpm test`、`pnpm build:mp-weixin` 均通过；已检查 `dist/build/mp-weixin/pages/home/index.wxml` 不再包含「下一步」提示和字段标签，仅保留显眼输入槽，`dist/build/mp-weixin/pages/item-form/index.wxml` 包含 `save-loading-backdrop` 全屏 `cover-view` 和 `risk-days` 高亮天数。
- 2026-06-09 UI 调整完成后再次清空数据库：清理前计数为 `users=1`、`families=1`、`items=3`、`locations=2`、`familyMembers=0`、`notificationLogs=0`；执行清空后再次计数，六个集合均为 0。
- 2026-06-09 自动真机调试 `subPackages` 兼容修复后，`pnpm build:mp-weixin`、`pnpm typecheck`、`pnpm test` 均通过；已检查 `dist/build/mp-weixin/app.json` 包含 `"subPackages": []`。
- 云函数本地/开发环境调用验证。
- `pnpm typecheck`
- `pnpm test`
- `pnpm build:mp-weixin`
