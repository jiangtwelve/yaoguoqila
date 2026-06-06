---
status: active
current_task: TASK-005
next_action: wait_for_user_acceptance
blocked: false
updated: 2026-06-06
---

# Handoff

## 当前状态
项目处于 setup/design 阶段。已根据用户初始设想建立项目连续性文档，产品方向为「家庭单位下的物品保质期管理和临期/过期提醒」，目标形态为微信小程序、Android、iOS 三端通用。

## 已完成
- 创建 AGENTS.md，支持后续短提示继续设计/开发。
- 草拟产品文档、架构文档、页面地图、UI 规则、API contract 和任务队列。
- 用户确认 MVP 采用「个人家庭轻协作」：首版保留家庭作为物品组织单位，但不实现完整多人邀请、审批和权限管理。
- 用户确认前端技术路线采用 `uni-app + Vue 3 + TypeScript`，优先服务微信小程序、Android、iOS 三端通用目标。
- 用户确认首版提醒采用「应用内提醒优先」：先做过期状态、首页提醒、列表提醒和模拟通知；真实微信订阅消息和 App 推送后续接入。
- 用户提出并确认 MVP 不需要三页面/底部 Tab：一个首页即可，首页展示当前家庭全部物品，按剩余保质期排序，支持查询、新增，点击家庭名称切换家庭。
- 用户确认首页不做状态筛选，只保留查询和默认剩余保质期升序排序。
- 用户确认新增/编辑物品同时支持两种日期录入方式：直接填写过期日期，或填写生产日期 + 保质期自动计算；表单用「或」分隔两种方式。
- 用户确认后端技术路线选择微信云开发优先：云函数、云数据库、云存储和微信登录，用于更快完成微信小程序 MVP；三端扩展通过 service/adapter 边界预留。
- 用户补充首次进入需要手动设置昵称，因为小程序无法直接获取真实微信昵称；设置昵称用单输入框弹窗完成，不单独设置页面。
- 用户修正无家庭流程：无家庭时首页展示空家庭状态，引导用户创建家庭或接受他人邀请加入家庭；不直接弹出创建家庭弹窗。创建家庭由用户主动点击后打开单输入框弹窗。
- TASK-003 已完成：已创建 uni-app/Vue/TypeScript 项目骨架、domain models、fixtures、mock service、微信云开发 cloud adapter、首页薄页面和基础验证。
- TASK-005 已实现：新增 `src/pages/item-form/index.vue`，首页新增按钮可进入表单，service contract 增加 `item.getFormOptions`，表单通过 service 获取家庭、位置、分类。
- TASK-005 已按用户反馈调整：标题安全区与首页统一；表单顺序为图片、名称、日期、位置、备注；位置自由输入加历史快捷选择；分类和提醒字段从表单移除；图片选择使用 `uni.chooseImage`；日期使用 picker；保质期单位使用轻量下拉选择器；「生产日期 + 保质期」区域已统一字号、颜色和行式布局。

## 当前任务
- TASK-005: 实现新增/编辑物品表单原型。

## 下一步
等待用户验收 TASK-005：
- 检查新增表单整体是否延续首页极简高级风格。
- 检查图片、名称、日期、位置、备注是否清楚。
- 检查两种过期日期录入方式和「或」分隔是否容易理解。
- 检查位置自由输入和历史位置快捷选择是否符合预期。
- 用户确认前不能标记 TASK-005 Done。

## 关键文件
- AGENTS.md
- docs/product.md
- docs/architecture.md
- docs/page-map.md
- docs/api.md
- docs/tasks.md
- docs/tasks/TASK-005-item-form-prototype.md

## 注意事项
- git status 中已有与本任务无关的 `skills/agent-project-continuity/...` 删除记录，不要回滚或改动，除非用户明确要求。
- 任何 UI 原型完成后都需要用户验收，不能由 agent 自行标记 Done。
