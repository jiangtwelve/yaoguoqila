---
updated: 2026-06-06
---

# Dev Log

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
- Goal: 初始化「要过期啦」项目连续性文档，并把用户的产品设想整理为可继续推进的项目记忆。
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
