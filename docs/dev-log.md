---
updated: 2026-06-08
---

# Dev Log

## 2026-06-08 TASK-011 Cloud Environment Reset And Deploy
- 用户要求先清空云环境中的旧函数和旧数据库集合，再继续 TASK-011 后端操作。
- CloudBase Cleanup:
  - 已删除 24 个旧云函数。
  - 已删除 8 个旧集合：`drugNamesCache`、`families`、`items`、`locationHistory`、`medicines`、`notifications`、`pending_drugs`、`users`。
  - 复查后云函数数为 0，集合数为 0。
- CloudBase Setup:
  - 已创建新集合：`users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`。
  - 已为新集合添加基础索引。
  - 已创建并部署云函数 `yaoguoqiApi`，运行时 `Nodejs18.15`。
  - 已将 `yaoguoqiApi` 从旧 `locationHistory` 集合切换为新 `locations` 集合。
- Verification:
  - CloudBase 复查：云函数列表仅剩 `yaoguoqiApi`。
  - CloudBase 复查：集合列表为 `users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`。
  - MCP 管理端调用 `home.getFamilyHome` 返回 `无法获取用户身份`，符合无小程序 OPENID 的预期。
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。

## 2026-06-08 TASK-011 Started / CloudBase MCP Prepared
- 用户要求开始 TASK-011，并安装 CloudBase MCP 以便后续快捷部署云函数。
- Research:
  - CloudBase MCP 支持本地模式和托管模式。
  - 本地模式通过 `npx @cloudbase/cloudbase-mcp@latest` 启动，功能最全，适合本项目后续云函数代码上传和部署。
  - 工具能力覆盖环境登录/查询、NoSQL 数据库、云函数、云存储、权限、安全域名、日志等。
- Changes:
  - `docs/tasks.md` 当前任务切换到 TASK-011。
  - `docs/tasks/TASK-011-wechat-cloud-backend-foundation.md` 标记为 Current，并补充 CloudBase MCP 准备事项。
  - `~/.codex/config.toml` 已追加 `mcp_servers.cloudbase`。
  - 新增 `docs/decisions/008-cloudbase-mcp-for-backend-deployment.md`。
  - 更新 `docs/architecture.md` 与 `docs/handoff.md`。
- Verification:
  - `node --version` 为 v24.15.0，满足 CloudBase MCP 文档要求。
  - 授权网络探测 `npx @cloudbase/cloudbase-mcp@latest --help` 成功解析到 `@cloudbase/cloudbase-mcp@2.21.1`。
- Note:
  - 当前 Codex 会话未热加载新 MCP；通常需要重启 Codex 或开启新会话后才能看到 `cloudbase` 工具。

## 2026-06-08 TASK-009 Accepted / TASK-010 Started
- 用户确认 TASK-009 下拉刷新验收完成。
- Changes:
  - `docs/tasks/TASK-009-pull-to-refresh.md` 标记为 Done，`acceptance_status` 标记为 accepted。
  - 临时刷新失败 mock 开关已关闭，恢复正常刷新路径。
  - `docs/tasks.md` 当前任务切换到 TASK-010。
  - `docs/tasks/TASK-010-api-contract-validation.md` 标记为 Current。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。
- Next:
  - 对齐 `docs/api.md` 与当前前端 service/domain 实际字段，将 API contract 升级为 `validated`。

### TASK-010 API Contract Validated
- Changes:
  - `docs/api.md` frontmatter 从 `draft` 改为 `validated`。
  - 首页 contract 对齐当前 `FamilyHome` 返回结构：`user`、`currentFamily`、`families`、`locations`、`items`。
  - 补齐 `Item.locationName`、`FamilyHome`、`ItemDetail`、`ItemInput` 和多图字段约定。
  - 补齐 `GET /items/{itemId}` / `item.getItemDetail` contract。
  - 云函数 payload/result 对齐 `HomeRepository` 与 `CloudHomeRepository`。
  - 新增 TASK-011，用于后续微信云开发后端基础能力实现。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。

## 2026-06-08 TASK-008 Accepted / TASK-009 Implemented
- 用户确认 TASK-008 首页左滑删除与二次确认验收通过，并要求继续。
- Changes:
  - `docs/tasks/TASK-008-swipe-delete.md` 标记为 Done，`acceptance_status` 标记为 accepted。
  - `docs/tasks.md` 当前任务切换到 TASK-009。
  - `src/pages.json` 为首页、详情页开启小程序原生下拉刷新；新增/编辑页不启用下拉刷新。
  - 首页接入 `onPullDownRefresh`，刷新当前家庭和物品列表，保留当前搜索词，并收起已打开的左滑删除行。
  - 详情页接入 `onPullDownRefresh`，刷新当前物品详情，不切换到整页空白 loading。
  - 刷新成功后不弹“已刷新”提示，使用原生下拉区域 loading 表达刷新中；失败时才给轻提示。
  - 新增 `finishPullDownRefresh()`，让 mock 数据快速返回时也有可感知的下拉 loading 停留时间。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。
- Acceptance:
  - TASK-009 需要用户验收，暂不标记 Done。

## 2026-06-08 TASK-007 Accepted / TASK-008 Implemented
- 用户确认 TASK-007 多图上传与首页封面图验收完成，并要求开始 TASK-008。
- Changes:
  - `docs/tasks/TASK-007-multi-image-upload.md` 标记为 Done，`acceptance_status` 标记为 accepted。
  - `docs/tasks.md` 当前任务切换到 TASK-008，TASK-009 下拉刷新与 TASK-010 API contract 保持后续顺序。
  - 首页物品列表接入左滑删除交互：左滑露出右侧删除按钮，点击后弹出二次确认。
  - 确认删除后调用 `deleteItem`，同步移除 `home.items` 和 `visibleItems`，让列表与顶部统计立即更新。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。
- Acceptance:
  - TASK-008 需要用户验收，暂不标记 Done。

## 2026-06-08 Home List Performance Direction
- 用户提出首页列表无分页时，大数据量场景下的性能问题。
- Decision:
  - 当前阶段先记录为后续设计任务，不在 TASK-007 中扩张实现范围。
  - 产品方向采用“近期优先”：首页重点展示已过期、今天到期、7 天内、30 天内等更需要处理的物品。
  - 数据量增大后采用分组折叠/懒加载；必要时配合后端游标分页和小程序端虚拟列表。
  - 搜索和排序应逐步下沉到 service/API 层，避免页面直接处理大量数据。
- Changes:
  - `docs/tasks.md` Backlog 新增首页大数据量列表策略设计。

## 2026-06-08 Product Naming Update
- 用户确认小程序正式名称为「要过期」。
- Changes:
  - 同步 AGENTS.md、docs/product.md、docs/decisions/001-project-memory-and-initial-product-direction.md、docs/tasks/TASK-001-product-and-tech-discovery.md 和 docs/dev-log.md 中的旧名称。
  - 同步 `src/manifest.json`、`src/pages.json` 和 `src/pages/home/index.vue` 中的小程序展示名。
  - 将核心介绍中的品类表述收敛为「食物、日用品等物品」，避免出现相关品类关键词。
- Verification:
  - 旧名称全文检索无残留。
  - `pnpm typecheck` 通过。

## 2026-06-08 Pull To Refresh Task Inserted
- 用户希望在所有页面新增下拉刷新能力，并要求该功能开发任务放到首页左滑删除后面，先设计交互供审核。
- Changes:
  - 新增 `docs/tasks/TASK-009-pull-to-refresh.md`，记录全页面下拉刷新交互设计草案。
  - 原 API contract 验证任务顺延为 `docs/tasks/TASK-010-api-contract-validation.md`。
  - 更新 `docs/tasks.md` Ready 队列：TASK-008 左滑删除、TASK-009 下拉刷新、TASK-010 API contract。
  - 更新 `docs/handoff.md` 的后续任务顺序和关键文件列表。
- Review:
  - 用户已确认 TASK-009 交互方向。
  - TASK-009 不提前实现，仍排在 TASK-008 左滑删除后。

## 2026-06-07 TASK-006 Accepted / TASK-007 Started
- 用户确认 TASK-006 物品详情与处理操作原型可以标记为验收完成。
- Changes:
  - `docs/tasks/TASK-006-item-detail-prototype.md` 标记为 Done，`acceptance_status` 标记为 accepted。
  - `docs/tasks.md` 当前任务切换到 TASK-007。
  - `docs/tasks/TASK-007-multi-image-upload.md` 标记为 Current，并补充依赖 TASK-006。
  - `docs/handoff.md` 更新为继续实现物品多图上传与首页封面图。
- Next:
  - 扩展数据模型为多图，表单支持多图选择，首页使用第一张图片作为封面。

### TASK-007 Multi Image Prototype Implemented
- Changes:
  - `Item` 和 `ItemInput` 新增 `imageUrls: string[]`，保留 `imageUrl` 作为兼容/封面冗余。
  - 新增/编辑表单图片区改为多图网格，最多选择 9 张图片。
  - 第一张图片显示「封面」标记，每张图片可单独删除。
  - 首页列表和详情页优先使用 `imageUrls[0]`，兼容旧 `imageUrl`。
  - 根据用户反馈，详情页多图改为走马灯展示，并支持点击图片放大预览。
  - 根据用户反馈，首页普通从详情页返回时不再强制刷新，保留滚动位置；新增、编辑、用完、删除后通过刷新标记更新首页。
  - 根据用户反馈，新增或编辑物品保存后刷新首页并自动滚动到目标物品卡片位置；刷新时不再用 loading 空状态替换首页内容，避免先回到顶部。
  - mock fixtures 和 mock repository 已同步多图字段。
  - `docs/api.md` 草案同步记录多图字段，待 TASK-009 再稳定 API contract。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。
- Acceptance:
  - TASK-007 需要用户验收，暂不标记 Done。

## 2026-06-07 TASK-005 Accepted / TASK-006 Started
- 用户确认 TASK-005 新增/编辑物品表单原型可以标记为验收完成。
- Changes:
  - `docs/tasks/TASK-005-item-form-prototype.md` 标记为 Done，`acceptance_status` 标记为 accepted。
  - `docs/tasks.md` 当前任务切换到 TASK-006。
  - `docs/tasks/TASK-006-item-detail-prototype.md` 标记为 Current，并补充依赖 TASK-005。
  - `docs/handoff.md` 更新为继续实现物品详情与处理操作原型。
- Next:
  - 实现物品详情页，覆盖状态信息、处理动作、编辑入口和 mock/service 边界。

### TASK-006 Detail Prototype Implemented
- Changes:
  - 新增 `src/pages/item-detail/index.vue`，延续「流光毛玻璃 + 石墨青主色」方向。
  - 首页物品卡片点击进入详情页。
  - 详情页展示家庭、图片/占位图、名称、状态、到期日、位置和备注。
  - 支持标记已用完、删除物品和编辑入口。
  - 扩展 domain/service/repository：新增 `ItemDetail`、`getItemDetail`、`consumeItem`、`deleteItem`。
  - mock repository 支持详情操作更新本地 mock 数据；cloud adapter 预留云函数调用。
  - 根据用户反馈移除详情页提醒信息，并取消单独的延期/更新到期日动作；到期日修改归入编辑信息。
  - 根据用户反馈抽出 `src/components/AppNavBar.vue`，新增页和详情页统一为左侧返回、标题绝对居中、右侧预留微信胶囊操作栏。
  - 根据 TASK-006 验收反馈补齐编辑页回显和保存修改能力。
  - 首页改为 `onShow` 刷新，修复标记已用完后返回首页列表未刷新的问题。
  - 首页统计改用完整当前库存，不再随搜索结果变化；搜索框增加清空按钮。
  - 根据用户反馈重排详情页：物品图片和到期信息成为主体，位置/备注/录入方式补充信息密度，处理动作改为紧凑工具条。
  - 根据用户反馈优化无图详情页：有图物品保留大图展示，无图物品改为紧凑身份卡，避免大面积空占位。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。
- Acceptance:
  - TASK-006 需要用户验收，暂不标记 Done。

## 2026-06-07 Plan Realignment
- 用户指出此前要求回到页面设计阶段，但任务状态仍停留在 TASK-005，容易打乱总开发节奏。
- Decision:
  - 当前阶段回退到 TASK-004，重新验收家庭首页 Design Anchor。
  - TASK-005 暂停为 Ready，等 TASK-004 视觉方向确认后再恢复表单验收。
  - 将新讨论功能插入总计划，不立即打乱当前节奏。
- Changes:
  - 更新 `docs/tasks.md`：current_task 改为 TASK-004。
  - 重新打开 `docs/tasks/TASK-004-family-home-anchor.md`，状态改为 Current，验收改为 pending。
  - 将 `docs/tasks/TASK-005-item-form-prototype.md` 改为 Ready。
  - 新增前端功能任务，并在后续讨论后正式重编号为 TASK-007 多图上传、TASK-008 左滑删除、TASK-009 API contract 验证。

### TASK-004 Accepted Again
- 用户在总计划校准后要求“开始下一步”。
- 已将 TASK-004 从 Current 标记回 Done，acceptance_status 标记为 accepted。
- 当前任务推进到 TASK-005：恢复新增/编辑物品表单原型验收。

### Task Queue Renumbering
- 用户指出仅调整顺序但保留编号会造成困惑，并且 API contract 验证应在会影响接口的前端功能之后。
- 已正式重编号并修正 Ready 队列：
  - TASK-006: 物品详情与处理操作原型。
  - TASK-007: 多图上传与首页封面图。
  - TASK-008: 首页左滑删除与二次确认。
  - TASK-009: API contract 验证。
- TASK-009 dependencies 已更新为 `[TASK-004, TASK-005, TASK-006, TASK-007, TASK-008]`。

### TASK-005 Form Date Refinement
- 用户提出 TASK-005 验收反馈：
  - 必填项星号需要使用红色。
  - 使用「生产日期 + 保质期」时，预计到期若临期或已过期，应使用对应状态色；正常日期才使用主色。
  - 「生产日期 + 保质期」区域排版需要推倒重做，但保留可回退空间。
- Changes:
  - `src/pages/item-form/index.vue` 中必填星号拆为 `.required-mark`，使用红色。
  - 增加 `calculatedStatusClass`，预计到期结果按 `normal`、`expiring/expires_today`、`expired` 分别使用主色、橙色、红色。
  - 将「生产日期 + 保质期」改为公式式玻璃卡片布局，保留原字段能力和数据逻辑不变。
- Follow-up:
  - 用户反馈左右布局和 `+` 分割直观，但卡片内标题在无边框表单里显乱。
  - 已移除「生产日期」「保质期」卡片内标题，并将输入内容垂直居中。
  - 统一该区域提示和值字号，使其和其他表单输入更一致。


## 2026-06-07 Design Direction Refresh
- 用户反馈当前页面风格太克制，不够家用，希望回到页面设计阶段重新设计。
- Design decision:
  - 第一版从「极简高级」调整为「温暖家用」，但用户认为仍是在旧设计基础上优化，不够颠覆。
  - 第二版改为「冰箱门便签板」：贴纸提醒、磁贴统计、双列物品便签、粗描边和多色家用配色。
  - 第三版根据用户反馈改为「iOS 式普适极简」：适合绝大多数用户，弱化强风格表达，强调系统感、清晰层级和长期使用舒适度。
  - 第四版根据用户明确要求推倒重做为「流光毛玻璃」：半透明层叠、背景模糊、内高光、漂浮摘要和玻璃表单。
- Changes:
  - 更新 `src/pages/home/index.vue`：首页改为毛玻璃 dashboard、玻璃搜索框和半透明列表。
  - 更新 `src/pages/item-form/index.vue`：新增表单改为玻璃录入台，上传、字段、日期和保存按钮统一使用毛玻璃材质。
  - 更新 `docs/ui.md`，记录新的待验收 Design Anchor。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。

## 2026-06-06 TASK-003
- Goal: 搭建 `uni-app + Vue 3 + TypeScript` 项目骨架，并建立 mock service 与微信云开发 adapter 边界。
- Changes:
  - 新增 `package.json`、`vite.config.ts`、`tsconfig.json`、`vitest.config.ts`、`.npmrc`、`.gitignore`。
  - 新增 uni-app 入口：`src/main.ts`、`src/App.vue`、`src/pages.json`、`src/manifest.json`。
  - 新增领域模型、过期状态计算和单测：`src/domain/*`。
  - 新增 mock fixtures：`src/fixtures/*`。
  - 新增 service contract、mock repository、微信云开发 cloud adapter 和业务 service：`src/services/*`。
  - 新增首页薄页面 `src/pages/home/index.vue`，页面只调用 service，不直接依赖 mock 数据或云开发 API。
  - 更新 docs/architecture.md 的运行与验证命令。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过，1 个测试文件 3 个测试。
  - `pnpm build:mp-weixin` 通过，产物位于 `dist/build/mp-weixin`。
- Gaps:
  - 首页仍是骨架级薄页面，未完成 Design Anchor 视觉和完整交互。
  - 微信云函数业务逻辑尚未实现。
  - 后续 Android/iOS 如何访问微信云开发资源仍是长期开放问题。

## 2026-06-06 TASK-005
- Goal: 实现新增/编辑物品表单原型，延续首页极简高级视觉方向。
- Changes:
  - 新增 `src/pages/item-form/index.vue`。
  - 更新 `src/pages.json`，注册新增物品页面。
  - 首页右下角新增按钮连接到新增物品页面。
  - 扩展 domain/service contract：新增 `ItemFormOptions` 和 `getItemFormOptions()`。
  - mock repository 通过 service 返回当前家庭、位置和分类，表单页不直接读取 mock fixtures。
  - cloud adapter 预留 `item.getFormOptions` 云函数。
  - API contract 增加 `GET /items/form-options` 语义映射。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。
- Gaps:
  - 仍需用户验收表单视觉和交互，TASK-005 不能标记 Done。
  - 图片选择/上传尚未接入真实能力。
  - 编辑已有物品的回显和保存路径仍需后续补强。

### TASK-005 User Feedback Update
- 用户提出新增表单 7 项调整：
  - 页面标题高度需要和首页家庭名称统一，并避开胶囊操作栏。
  - 位置应为自由输入框，历史位置仅作为快捷选择。
  - 暂时不需要分类。
  - 天/月/年选择方式太占空间。
  - 询问提醒字段的用途。
  - 需要支持上传物品图片。
  - 表单顺序调整为图片、名称、日期、位置、备注，名称和日期必填。
- Changes:
  - 新增 `src/utils/navigationSafeArea.ts`，首页和新增页共用导航安全区计算。
  - 重写 `src/pages/item-form/index.vue` 表单顺序和视觉结构。
  - 图片上传使用 `uni.chooseImage`，先保存本地临时路径用于原型预览。
  - 位置改为自由输入，历史位置作为快捷按钮。
  - 移除分类字段。
  - 移除提醒字段，保存时暂用默认 `reminderDaysBefore: [1, 3]`；提醒作为系统临期/过期提示策略，不在 MVP 表单里暴露配置。
  - 保质期单位改为单按钮循环切换，减少横向空间占用。
  - 更新 `docs/ui.md`、`docs/api.md`、TASK-005 文档。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。

### TASK-005 Picker Update
- 用户要求天/月/年使用下拉框形式，日期不要自由输入，应使用日期选择器。
- 已更新 `src/pages/item-form/index.vue`：
  - 直接过期日期改为 `picker mode="date"`。
  - 生产日期改为 `picker mode="date"`。
  - 保质期单位改为 `picker mode="selector"`，选项为天、月、年。
  - 移除日期自由输入。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。

### TASK-005 Date Block Visual Refinement
- 用户反馈「生产日期」和「保质期」文本大小、颜色不一致，且保质期选择器样式突兀。
- 已更新 `src/pages/item-form/index.vue`：
  - 将「生产日期 + 保质期」重构为统一的行式字段组。
  - 生产日期和保质期使用一致的标签字号、颜色、字段高度和分隔线。
  - 保质期单位下拉改为内联文字选择器，去掉突兀按钮感。
  - 保留日期选择器和天/月/年下拉选择器能力。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。

## 2026-06-06 TASK-004 Design Iteration
- Goal: 根据用户反馈“当前页面风格太丑，需要极简高级感”重做家庭首页视觉方向。
- Changes:
  - 使用 `frontend-design` skill 指导设计方向。
  - 重写 `src/pages/home/index.vue` 的首页结构和样式。
  - 建立极简高级风格：大留白、宋体标题、细线分隔、克制状态色、下划线搜索、圆形新增按钮。
  - 增加无家庭空状态、昵称弹窗、创建家庭弹窗的视觉结构。
  - 更新 `docs/ui.md` 记录待验收视觉方向。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过，1 个测试文件 3 个测试。
  - `pnpm build:mp-weixin` 通过。
  - `curl -I http://localhost:5173/` 返回 HTTP 200。
- Gaps:
  - 当前仍需用户视觉和交互验收，TASK-004 不能标记 Done。
  - 本轮未能使用截图工具做视觉截图核验；本地 H5 服务已启动，可由用户打开查看。

### Safe Area Update
- 用户指出微信小程序右上角胶囊操作栏会遮挡新增按钮，且不同刘海屏顶部高度不同。
- 已更新 `src/pages/home/index.vue`：
  - 使用 `uni.getSystemInfoSync()` 和微信 `getMenuButtonBoundingClientRect()` 计算顶部安全留白。
  - 首页内容从胶囊按钮下方开始布局，新增按钮不再占用胶囊区域。
  - 非微信环境使用保守 fallback 顶部距离。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。

### Capsule Row Refinement
- 用户指出不应把胶囊操作栏所在整行都空出来，应合理利用左侧空间，只避开右侧胶囊区域。
- 已更新 `src/pages/home/index.vue`：
  - 导航标题固定在胶囊同行左侧，并通过 `paddingRight` 为右侧胶囊预留空间。
  - 主内容从导航行下方开始，不再叠加一整行胶囊高度的空白。
  - 新增按钮移动到导航行下方的内容操作区，避免与微信胶囊冲突。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。

### Floating Add Button
- 用户建议新增按钮放在页面右下角，脱离文档流。
- 已更新 `src/pages/home/index.vue`：
  - 删除顶部内容区的新增按钮占位。
  - 新增按钮改为右下角 fixed 浮动按钮。
  - 使用 `env(safe-area-inset-bottom)` 适配底部安全区。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。

### Reminder Summary Refinement
- 用户指出首页同时存在过期和临期物品时，只放大过期数量不合理。
- 已更新 `src/pages/home/index.vue`：
  - 顶部主数字改为「需要处理」总数，包含已过期和临期。
  - 下方增加轻量拆分：已过期数量、临期数量。
  - 已过期使用深红色，临期使用陶土色，保持极简表达。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过。
  - `pnpm build:mp-weixin` 通过。

## 2026-06-06
- Goal: 初始化「要过期」项目连续性文档，并把用户的产品设想整理为可继续推进的项目记忆。
- Changes:
  - 新增 AGENTS.md，定义后续 agent 协作、短提示恢复、确认规则和 UI 验收规则。
  - 新增 docs/product.md，整理产品方向、MVP 建议、核心流程、家庭/物品/提醒模型。
  - 新增 docs/architecture.md，记录三端通用技术路线候选和当前推荐草案。
  - 新增 docs/page-map.md，草拟 MVP 页面地图和 Design Anchor。
  - 新增 docs/ui.md，记录初步 UI 目标和交互规则。
  - 新增 docs/api.md，草拟核心资源模型和 API。
  - 新增 docs/tasks.md 与首批 TASK 文档。
- Verification:
  - 尚未进行代码级验证；本次为文档初始化。
- Gaps:
  - 需要用户确认首个 MVP 的协作深度、技术路线和提醒能力边界。

### Decision Update
- 用户选择 MVP 协作深度为「个人家庭轻协作」。
- 已更新 docs/product.md、docs/tasks/TASK-001-product-and-tech-discovery.md、docs/handoff.md 和决策记录。
- 用户选择前端技术路线为 `uni-app + Vue 3 + TypeScript`。
- 已更新 docs/architecture.md、docs/product.md、docs/tasks/TASK-001-product-and-tech-discovery.md 和 docs/handoff.md。
- 用户选择首版提醒能力为「应用内提醒优先」。
- 已更新 docs/product.md、docs/architecture.md、docs/api.md、docs/tasks.md、TASK-001 和 docs/handoff.md。
- TASK-001 已完成，下一步进入 TASK-002 页面地图与 Design Anchor 确认。
- 用户调整 MVP 页面结构：不需要底部 Tab 和三个主页面，一个首页展示当前家庭所有物品，按剩余保质期排序，支持查询、新增，点击家庭名称切换家庭。
- 已更新 docs/page-map.md、docs/product.md、TASK-002 和 docs/handoff.md。
- 用户确认首页不做状态筛选，只保留查询和默认剩余保质期升序排序。
- 用户确认新增/编辑物品同时支持两种日期录入方式：直接填写过期日期，或填写生产日期 + 保质期自动计算；表单用「或」分隔。
- 已更新 docs/product.md、docs/page-map.md、docs/api.md、TASK-002 和 docs/handoff.md。
- 用户确认后端技术路线选择微信云开发优先。
- 已更新 docs/architecture.md、docs/api.md、docs/product.md、TASK-003 和 docs/handoff.md。
- 用户补充首次进入需要手动设置昵称，且设置昵称和创建家庭都应使用单输入框弹窗，不单独设置页面。
- 已更新 docs/page-map.md、docs/product.md、docs/api.md、TASK-002 和 docs/handoff.md。
- 用户修正无家庭流程：无家庭时首页展示空家庭状态，允许创建家庭或接受邀请加入家庭，不直接弹出创建家庭弹窗。
- 已更新 docs/page-map.md、docs/product.md、TASK-002 和 docs/handoff.md。
## 2026-06-08 TASK-011 CloudBase Backend Foundation
- Goal: Codex 重启后继续搭建微信云开发后端基础能力。
- CloudBase MCP:
  - MCP 已可用，并自动绑定环境 `cloud1-d8gr12cmd6578bfd0`。
  - 已只读盘点云函数和集合；当前云环境不是空环境。
- Findings:
  - 已有历史函数：`login`、`familyCreate`、`familyList`、`userSwitchFamily`、`locationHistory`、`itemList`、`itemAdd`、`itemDetail`、`itemUpdate`、`itemDelete` 等。
  - 已有集合：`users`、`families`、`items`、`locationHistory` 等。
  - 历史函数字段模型使用 `expireDate`、`photoFileIds`、`location`、`remark` 等，和当前 `docs/api.md` 的 `expiresAt`、`imageUrls`、`locationName`、`note` 不完全一致。
  - `itemList`、`locationHistory` 等读接口缺少家庭成员权限校验。
- Changes:
  - 新增决策 `docs/decisions/009-cloud-function-router.md`，确认使用单入口物理云函数 `yaoguoqiApi` 承载 validated service contract。
  - 新增本地云函数 `cloudfunctions/yaoguoqiApi`，实现首页、昵称、创建家庭、表单选项、物品列表、详情、新增、编辑、标记用完和删除的路由分发、字段映射和权限校验。
  - 更新 `src/services/cloud/wechatCloudClient.ts`，前端逻辑动作通过 `yaoguoqiApi` 的 `action/payload` 调用。
  - 更新 architecture、api、TASK-011 和 handoff 文档。
- Verification:
  - `pnpm typecheck` 通过。
