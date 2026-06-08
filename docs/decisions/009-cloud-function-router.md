---
id: 009
title: 使用单入口云函数承载 validated service contract
status: accepted
updated: 2026-06-08
---

# Decision 009: 使用单入口云函数承载 validated service contract

## Context
TASK-011 进入真实微信云开发后端实现阶段后，通过 CloudBase MCP 发现当前云环境并非空环境，已经存在 `login`、`familyCreate`、`itemList`、`itemAdd`、`itemUpdate`、`itemDelete` 等历史云函数，以及 `users`、`families`、`items`、`locationHistory` 等集合。

历史云函数使用 camelCase 函数名和旧字段模型，例如 `expireDate`、`photoFileIds`、`location`、`remark`。当前前端已验收的 `docs/api.md` contract 使用逻辑函数名和新字段模型，例如 `item.createItem`、`expiresAt`、`imageUrls`、`locationName`、`note`。

## Decision
新增物理云函数 `yaoguoqiApi` 作为单入口路由函数。前端仍按 `HomeRepository` 调用逻辑动作，例如 `home.getFamilyHome`、`item.createItem`；Cloud adapter 将逻辑动作包装为：

```yaml
name: yaoguoqiApi
data:
  action: item.createItem
  payload: ...
```

`yaoguoqiApi` 内部负责分发动作、统一权限校验、字段映射和返回 `validated` contract 结构。

## Rationale
- 在用户要求清空旧环境后，只保留新的 `yaoguoqiApi`，降低历史实现和新 contract 混用风险。
- 避免 CloudBase 物理函数名与点号逻辑函数名之间的兼容风险。
- 共享用户初始化、家庭成员权限校验、Item 字段 mapper、状态计算等基础逻辑。
- 后续如果需要拆分为多个物理云函数，可以保持前端 `HomeRepository` contract 不变，只调整 cloud adapter 或云端路由。

## Implementation Notes
- 本地函数目录：`cloudfunctions/yaoguoqiApi`。
- 新函数运行时使用 CloudBase 推荐的 `Nodejs18.15`。
- 2026-06-08 用户要求清空旧云资源后再操作；已删除旧函数和旧集合。
- 当前云端只保留新物理云函数 `yaoguoqiApi`。
- 当前云数据库集合为：`users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`。
- TASK-011 MVP 主流程使用 `users`、`families`、`items`、`locations`；`familyMembers`、`notificationLogs` 暂作为后续扩展预留。

## Capability Boundary
- 当前 `yaoguoqiApi` 支持 MVP 主流程：初始化首页、设置昵称、创建家庭、表单选项、列表、详情、新增、编辑、标记用完、删除。
- 不包含真实微信订阅消息推送。
- 不包含完整家庭邀请、审批和权限细分。
- 不包含大数据量分页和虚拟列表后端优化。
