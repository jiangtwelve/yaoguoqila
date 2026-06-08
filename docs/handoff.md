---
status: active
current_task: TASK-007
next_action: wait_for_user_acceptance
blocked: false
updated: 2026-06-07
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
- TASK-005 已由用户确认验收完成，当前进入 TASK-006。
- TASK-006 已实现第一版原型：新增物品详情页、首页点击物品进入详情、详情页支持标记已用完、删除和编辑入口；详情页不展示提醒，修改到期日归入编辑信息。编辑页已支持物品回显和保存修改，首页返回会刷新当前库存，统计不再受搜索影响，搜索框已增加清空按钮。
- TASK-006 已由用户确认验收完成，当前进入 TASK-007。
- TASK-007 已实现第一版：数据模型新增 `imageUrls`，表单支持多图网格选择/删除，首页和详情页优先展示第一张图片作为封面。
- 用户在 2026-06-07 反馈页面过于克制、不够家用；第一版调为「温暖家用」后，用户又指出仍像旧设计优化；第二版改成「冰箱门便签板」后，用户认为好看但不适合所有人；第三版改为 iOS 普适极简后，用户认为不好看且不够颠覆。当前 Design Anchor 已推倒重做为「流光毛玻璃」，首页使用 glass dashboard、玻璃搜索框和半透明列表；新增表单使用玻璃录入台风格。

## 当前任务
- TASK-007: 支持物品多图上传与首页封面图。

## 下一步
- 等待用户验收 TASK-007 多图上传与首页封面图。
- 验收重点：表单是否能选择多张图片，第一张是否作为首页封面，删除第一张后下一张是否自然成为封面。
- TASK-007 后继续 TASK-008 首页左滑删除与二次确认，最后做 TASK-009 API contract 验证。

## 关键文件
- AGENTS.md
- docs/product.md
- docs/architecture.md
- docs/page-map.md
- docs/api.md
- docs/tasks.md
- docs/tasks/TASK-004-family-home-anchor.md
- docs/tasks/TASK-005-item-form-prototype.md
- docs/tasks/TASK-006-item-detail-prototype.md
- docs/tasks/TASK-007-multi-image-upload.md
- docs/tasks/TASK-008-swipe-delete.md
- docs/tasks/TASK-009-api-contract-validation.md

## 注意事项
- git status 中已有与本任务无关的 `skills/agent-project-continuity/...` 删除记录，不要回滚或改动，除非用户明确要求。
- 任何 UI 原型完成后都需要用户验收，不能由 agent 自行标记 Done。
