---
status: draft
design_anchor: "family-home"
requires_user_acceptance: true
acceptance_status: pending
updated: 2026-06-06
---

# Page Map

## Global Navigation
- Entry: 登录/授权后进入首页；若用户未设置昵称，先用首页弹窗补充；若无家庭，在首页展示空家庭状态并引导创建或加入家庭。
- Tabbar / stack: MVP 不使用底部 Tab，以单首页作为主界面；新增、编辑、详情作为从首页进入的子页面。
- Back behavior: 常规页面返回上一页；无上一页时回到首页。
- Family switch: 首页显示当前家庭名称芯片，点击芯片打开家庭中枢面板，支持切换家庭和进入家庭管理。

## MVP Pages

### 登录授权 / auth
- Purpose: 建立用户身份。
- Required features: 微信登录或模拟登录、授权状态展示。
- Primary interactions: 登录、跳过到 mock 体验。
- States: 未登录、登录中、登录失败、已登录。
- Data dependencies: User。
- Entry points: 应用启动。
- Destination links: 首页；若缺昵称，由首页弹窗补齐；若无家庭，展示空家庭状态。
- Design role: Design Extension。

### 家庭首页 / families/:familyId/home
- Purpose: 单页展示当前家庭下所有物品，并按剩余保质期排序，让用户一打开就知道哪些物品最该处理。
- Required features: 家庭名称芯片（可点击打开中枢面板）、家庭切换与管理、搜索、按剩余保质期排序的物品列表、临期/过期状态标识、新增按钮、基础空状态、无家庭空状态、首次昵称设置弹窗、创建家庭弹窗。
- Primary interactions: 输入昵称、点击创建家庭、点击加入家庭/接受邀请入口、输入家庭名称、点击家庭名称切换家庭、搜索物品、点击物品进入详情、点击新增录入物品。
- States: 正常、待设置昵称、无家庭、无物品、搜索无结果、加载中、错误、无权限。
- Data dependencies: User, Family, Items, Item expiry status。
- Entry points: 登录后默认页。
- Destination links: 物品详情、新增物品、家庭切换。
- Design role: Design Anchor。
- Notes: MVP 首页不提供状态筛选，只保留查询和默认剩余保质期升序排序。

### 设置昵称弹窗 / modal/profile-name
- Purpose: 首次进入时让用户设置自己的展示昵称。
- Required features: 单一昵称输入框、确认按钮、校验提示。
- Primary interactions: 输入昵称、确认保存。
- States: 空输入、提交中、校验错误、保存失败。
- Data dependencies: User。
- Entry points: 登录后发现当前用户无昵称。
- Destination links: 首页；若无家庭，展示无家庭空状态。
- Design role: Design Extension。
- Notes: 由于当前小程序无法直接获取用户真实微信昵称，昵称必须由用户手动设置；不单独设置页面。该弹窗使用统一 `GlassModal` 组件，后续类似轻量弹窗沿用同一套视觉和交互。弹窗保持极简结构，通过更显眼的大输入槽和占位文本引导用户填写昵称，不堆叠额外说明文案。

### 无家庭空状态 / empty/no-family
- Purpose: 用户暂无家庭时，在首页引导用户创建家庭或加入/接受他人邀请。
- Required features: 空状态文案、创建家庭按钮、加入家庭/接受邀请入口。
- Primary interactions: 点击创建家庭打开创建家庭弹窗；点击加入家庭/接受邀请进入后续加入流程。
- States: 正常、加入入口不可用、加载中、错误。
- Data dependencies: User, Families。
- Entry points: 登录后用户无家庭。
- Destination links: 创建家庭弹窗、加入家庭/接受邀请流程。
- Design role: Design Extension。
- Notes: 不强制用户立即创建家庭；允许用户等待或接受他人邀请加入家庭。

### 创建家庭弹窗 / modal/create-family
- Purpose: 用户主动创建家庭。
- Required features: 单一家庭名称输入框、确认按钮、校验提示。
- Primary interactions: 输入家庭名称、确认创建。
- States: 空输入、提交中、校验错误、创建失败。
- Data dependencies: Family, FamilyMember。
- Entry points: 无家庭空状态点击创建家庭；家庭切换中点击创建新家庭。
- Destination links: 首页。
- Design role: Design Extension。
- Notes: MVP 不为创建家庭单独设置页面。该弹窗使用统一 `GlassModal` 组件，和昵称设置、提醒确认保持同一套遮罩、玻璃卡片和按钮结构。弹窗保持极简结构，通过更显眼的大输入槽和占位文本引导用户填写家庭名称，不堆叠额外说明文案。

### 新增/编辑物品 / families/:familyId/items/new 或 items/:itemId/edit
- Purpose: 录入或维护物品信息。
- Required features: 名称、图片、位置、分类、直接填写过期日期、或填写生产日期 + 保质期自动计算过期日期、提醒提前天数、备注。
- Primary interactions: 选择图片、选择直接过期日期，或填写生产日期和保质期后自动生成过期日期，填写表单、保存、取消；新增物品若会直接成为临期、今天到期或已过期状态，保存前需要通过统一 `GlassModal` 二次确认，弹窗标题为「提醒」，正文居中，按钮为 `取消` / `确认`，临期剩余天数需要高亮展示。
- States: 新增、编辑、临期/过期新增确认、提交中、校验错误、保存失败；表单加载中或提交中需要锁定其他表单操作。
- Data dependencies: Item, Locations, Categories, ReminderRule。
- Entry points: 首页新增按钮、详情编辑。
- Destination links: 物品详情或首页。
- Design role: Design Extension。
- Notes: 两种日期录入方式应在视觉上用「或」分隔；最终都保存为统一 `expiresAt`。小程序端固定保存按钮使用 `cover-view` 隔离原生 `textarea` 触摸层，避免备注输入框和保存逻辑同时触发；保存中使用表单锁定和全屏轻玻璃 `cover-view` loading，防止用户继续改动表单并明确提示正在同步。

### 物品详情 / families/:familyId/items/:itemId
- Purpose: 查看单个物品状态并处理。
- Required features: 图片、名称、状态、过期信息、位置、备注、提醒信息、操作记录占位。
- Primary interactions: 编辑、删除、标记已用完、延期/更新过期时间。
- States: 正常、已过期、已处理、加载中、错误、无权限。
- Data dependencies: Item, NotificationLog。
- Entry points: 首页、提醒消息落地页。
- Destination links: 编辑物品、首页。
- Design role: Design Extension。

### 家庭切换 / families/switch
- Purpose: 从首页切换当前家庭，管理家庭成员。
- Required features: 家庭芯片入口、家庭中枢面板、家庭列表、当前家庭标识、切换家庭、创建新家庭入口、家庭管理视图（重命名、成员列表、角色标识、移除成员、退出家庭、解散家庭）。
- Primary interactions: 点击家庭芯片打开中枢面板、选择家庭切换、管理 › 进入管理视图、重命名家庭、移除成员（管理员）、退出家庭（普通成员）、解散家庭（管理员）、创建新家庭、返回首页。
- States: 多家庭（可切换）、单家庭（仅管理）、无家庭（首页空状态引导）、管理中、操作中、操作确认（解散/退出）、加载中、错误。
- Data dependencies: Families, FamilyMembers, User。
- Entry points: 点击首页家庭名称芯片。
- Destination links: 首页、创建家庭弹窗。
- Design role: Design Extension。
- Notes: 成员分管理员（创建者）和普通成员，物品权限一致。邀请码和加入家庭功能归入 TASK-014 独立实现。

## Out Of Scope Pages
- 条码/OCR 识别页。
- AI 推荐页。
- 复杂成员权限管理页。
- 正式邀请审批工作流页。
- 独立「我的」页。
- 独立「物品列表」Tab。
- 底部 Tab 导航。
- 独立创建家庭页。
- 独立设置昵称页。
- 强制创建家庭弹窗。

## Open Questions
- 暂无。
