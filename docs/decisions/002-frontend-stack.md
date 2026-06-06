---
id: 002
status: accepted
date: 2026-06-06
decision_type: architecture
---

# Decision 002: 前端技术路线

## Context
项目目标是微信小程序、Android、iOS 三端通用。首版需要尽快验证家庭、物品录入、过期状态和提醒流程，因此前端技术路线会直接影响页面实现、平台适配和后续发布方式。

## Decision
选择 `uni-app + Vue 3 + TypeScript` 作为前端技术路线。

## Rationale
- 更贴近三端通用目标，可用同一套 Vue/TypeScript 代码覆盖微信小程序和 App 端。
- 适合先用 mock service 做跨端页面原型，再逐步接入真实后端和平台能力。
- TypeScript 有利于沉淀家庭、物品、提醒等领域模型。

## Consequences
- 后续 TASK-003 应按 uni-app 项目骨架推进。
- 需要设计平台适配层，隔离微信订阅消息、App 通知、图片选择、上传等能力差异。
- App 端真实推送和小程序订阅消息仍需要在后续提醒能力决策中确认。
