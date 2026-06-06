---
id: 003
status: accepted
date: 2026-06-06
decision_type: product
---

# Decision 003: MVP 提醒能力边界

## Context
项目核心价值是提醒用户处理临期或已过期物品。真实推送涉及微信订阅消息、Android/iOS 系统通知、用户授权、服务端调度和防打扰策略，复杂度较高。

## Decision
MVP 首版选择「应用内提醒优先」。

## Rationale
- 能最快验证核心体验：用户是否能清楚看到哪些物品即将过期或已经过期。
- 可先实现首页提醒、列表状态、详情提醒信息和模拟通知。
- 避免在产品页面和数据需求尚未验证时过早绑定具体推送平台。

## Consequences
- 真实微信订阅消息和 Android/iOS 系统推送放入后续任务。
- 前端和 mock service 仍需要保留通知 adapter/service 边界，避免未来接入真实推送时重写页面。
- 后续接入真实推送时，需要补充后端调度、通知授权、防打扰和发送日志策略。
