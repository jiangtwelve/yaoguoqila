---
status: active
current_task: TASK-011
current_release: v0.1
next_action: continue_implementation
blocked: false
updated: 2026-06-09
---

# Handoff

## 当前状态
项目处于 `v0.1 小程序测试版闭环` 阶段。当前目标不是无限扩功能，而是完成微信小程序内部测试版体验闭环：真实云联调、家庭切换、图片云存储 adapter、加入家庭最小流程和版本级验收。

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
- 用户确认小程序正式名称为「要过期」，项目文档已同步；对外介绍不使用相关品类关键词。
- TASK-003 已完成：已创建 uni-app/Vue/TypeScript 项目骨架、domain models、fixtures、mock service、微信云开发 cloud adapter、首页薄页面和基础验证。
- TASK-005 已实现：新增 `src/pages/item-form/index.vue`，首页新增按钮可进入表单，service contract 增加 `item.getFormOptions`，表单通过 service 获取家庭、位置、分类。
- TASK-005 已按用户反馈调整：标题安全区与首页统一；表单顺序为图片、名称、日期、位置、备注；位置自由输入加历史快捷选择；分类和提醒字段从表单移除；图片选择使用 `uni.chooseImage`；日期使用 picker；保质期单位使用轻量下拉选择器；「生产日期 + 保质期」区域已统一字号、颜色和行式布局。
- TASK-005 已由用户确认验收完成，当前进入 TASK-006。
- TASK-006 已实现第一版原型：新增物品详情页、首页点击物品进入详情、详情页支持标记已用完、删除和编辑入口；详情页不展示提醒，修改到期日归入编辑信息。编辑页已支持物品回显和保存修改，首页返回会刷新当前库存，统计不再受搜索影响，搜索框已增加清空按钮。
- TASK-006 已由用户确认验收完成，当前进入 TASK-007。
- TASK-007 已由用户确认验收完成：数据模型新增 `imageUrls`，表单支持多图网格选择/删除，首页和详情页优先展示第一张图片作为封面；详情页多图使用走马灯并支持点击放大预览；首页普通从详情页返回时保留滚动位置，数据变更后再刷新。
- TASK-008 已由用户确认验收完成：首页物品行支持左滑露出删除按钮，删除前二次确认，确认后调用 service 删除并同步刷新列表与顶部统计；滑动动画已优化为跟手移动。
- TASK-009 已由用户确认验收完成：首页、物品详情页支持下拉刷新；新增/编辑页不启用下拉刷新；下拉触发后原生下拉区域立即收回，由顶部小浮层显示“正在刷新”，失败时同一浮层显示失败提示。临时失败 mock 已关闭。
- TASK-010 已完成：`docs/api.md` 从 `draft` 升级为 `validated`，已对齐当前前端 domain models、repository contract、云函数 payload/result、多图、位置自由输入、详情、删除和标记用完需求。
- TASK-011 已开始：已阅读 CloudBase MCP 文档，确认本地模式适合后续云函数/数据库/云存储部署；已将 `cloudbase` MCP server 写入 `~/.codex/config.toml`，并通过授权网络探测解析到 `@cloudbase/cloudbase-mcp@2.21.1`。Codex 重启后 MCP 已可用，并自动绑定环境 `cloud1-d8gr12cmd6578bfd0`。
- 已通过 CloudBase MCP 盘点云环境：原本已有 `login`、`familyCreate`、`itemList`、`itemAdd`、`itemUpdate`、`itemDelete` 等历史函数，以及 `users`、`families`、`items`、`locationHistory` 等集合。旧字段模型和当前 validated contract 不一致，读接口存在权限校验缺口。
- 用户要求先清空旧函数和旧数据库后再操作；已删除 24 个旧函数和 8 个旧集合，并复查函数数为 0、集合数为 0。
- 已创建新集合 `users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`，并添加基础索引。
- 已新增并部署云函数 `yaoguoqiApi`，使用单入口路由承载 `home.getFamilyHome`、`item.createItem` 等逻辑动作；前端 cloud adapter 已改为调用物理函数 `yaoguoqiApi` 并传入 `action/payload`。
- 已根据更新后的 agent-project-continuity lifecycle 规则补充 `docs/roadmap.md`、`docs/releases/v0.1.md`，并创建 TASK-012 到 TASK-015 作为 v0.1 必需任务。
- 用户在 2026-06-07 反馈页面过于克制、不够家用；第一版调为「温暖家用」后，用户又指出仍像旧设计优化；第二版改成「冰箱门便签板」后，用户认为好看但不适合所有人；第三版改为 iOS 普适极简后，用户认为不好看且不够颠覆。当前 Design Anchor 已推倒重做为「流光毛玻璃」，首页使用 glass dashboard、玻璃搜索框和半透明列表；新增表单使用玻璃录入台风格。

## 当前任务
- TASK-011: 搭建微信云开发后端基础能力。`release: v0.1`

## 下一步
- 继续 TASK-011：切换前端环境到 cloud repository，在微信开发者工具中从小程序端真实调用 `yaoguoqiApi`，验证 OPENID、首页初始化、设置昵称、创建家庭、新增物品、列表、详情、编辑、标记用完和删除。
- MCP 管理端调用没有小程序 OPENID，因此 `home.getFamilyHome` 返回 `无法获取用户身份` 是预期结果，不代表小程序端不可用。
- TASK-011 完成后按 `docs/releases/v0.1.md` 继续 TASK-012 家庭切换，不要跳过版本目标直接做 Backlog。

## 关键文件
- AGENTS.md
- docs/product.md
- docs/architecture.md
- docs/page-map.md
- docs/roadmap.md
- docs/releases/v0.1.md
- docs/api.md
- docs/tasks.md
- docs/tasks/TASK-004-family-home-anchor.md
- docs/tasks/TASK-005-item-form-prototype.md
- docs/tasks/TASK-006-item-detail-prototype.md
- docs/tasks/TASK-007-multi-image-upload.md
- docs/tasks/TASK-008-swipe-delete.md
- docs/tasks/TASK-009-pull-to-refresh.md
- docs/tasks/TASK-010-api-contract-validation.md
- docs/tasks/TASK-011-wechat-cloud-backend-foundation.md
- docs/tasks/TASK-012-family-switch.md
- docs/tasks/TASK-013-cloud-storage-adapter.md
- docs/tasks/TASK-014-family-invite-join.md
- docs/tasks/TASK-015-v0-1-acceptance.md
- docs/decisions/008-cloudbase-mcp-for-backend-deployment.md
- docs/decisions/009-cloud-function-router.md
- cloudfunctions/yaoguoqiApi/index.js

## 注意事项
- 当前存在未提交的生命周期/版本规划文档补充；接手前先查看 `git status`，确认没有误触业务代码。
- 任何 UI 原型完成后都需要用户验收，不能由 agent 自行标记 Done。
