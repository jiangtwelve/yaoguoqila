---
updated: 2026-06-12
---

# Dev Log

## Reading Guide
- 恢复开发时先读 `docs/handoff.md`、`docs/tasks.md` 和当前 TASK；只有需要历史原因、验证细节或用户反馈链路时，再读本文件。
- 优先按下面索引读取相关日期段落，不要默认把整份 dev-log 放入上下文。
- 若新增日志超过 5-8 条或出现新的长期主题，应同步更新本索引。

## Index

### 当前连续性与 TASK-013
- `2026-06-12 TASK-013 Image Loading Resume Verification`：恢复会话后复核首页缩略图和详情页 hero 图片 loading/淡入实现，重新运行类型检查、单测和小程序构建通过。
- `2026-06-12 TASK-013 Upload Experience Refinement`：根据用户验收反馈，补充选择大图本地处理提示、保存上传阶段文案，避免保存成功前图片重渲染闪动，并把云存储路径改为按日期和 item/draft scope 分区，便于控制台定位。
- `2026-06-12 TASK-013 Upload Picker Runtime Fix`：修复点击上传图片时报 `undefined is not an object (evaluating 'e.index')`，平台图片封装改用微信小程序原生 `wx.chooseImage` / `wx.previewImage`，重新验证通过。
- `2026-06-12 TASK-013 Implementation`：新增图片存储 service/adapter 边界，cloud 模式保存前上传本地图片到微信云存储，表单和详情页改走 service；类型检查、测试和小程序构建通过，待用户验收。
- `2026-06-12 TASK-012 Accepted / TASK-013 Started`：用户确认 TASK-012 验收完成，任务状态切换为 done；TASK-013 图片云存储 adapter 正式接入切换为 Current。

### 当前连续性与 TASK-012
- `2026-06-11 TASK-016 Planned`：按用户确认，将云函数结构模块化与后续物理云函数拆分评估规划为 post-v0.1 任务，当前不阻塞 TASK-012 验收。
- `2026-06-11 TASK-012 Acceptance UX Refinement`：创建家庭成功后自动切换到新家庭并返回首页，取消创建时回到家庭切换弹窗，再次打开家庭弹窗自动滚动到当前家庭。类型检查、测试和小程序构建通过。
- `2026-06-10 TASK-012 Implementation`：家庭切换与管理功能实现完成，含云函数 6 个新 action、FamilyHub 组件、服务层扩展、首页集成。构建通过，测试 19/19 pass。待用户验收。
- `2026-06-10 TASK-012 Scope Expansion And Design`：家庭功能合并到 TASK-012，设计统一入口和角色权限方案，邀请功能保留给 TASK-014。
- `2026-06-10 TASK-011 Accepted`：微信开发者工具真实主流程联调验收通过，TASK-011 标记完成，当前任务切换到 TASK-012。
- `2026-06-10 TASK-011 Acceptance UX Fixes`：验收期间修复弹窗输入框间距（slot CSS 作用域）、保存 loading（改用原生 `uni.showLoading`）、设置昵称和创建家庭 loading（统一为原生 loading）。
- `2026-06-10 Optimized Continuity Rule Refresh`：按新版 agent-project-continuity 规则同步项目类型路由、owner approval 和验收分层。
- `2026-06-10 Continuity Compacting`：新版 project continuity 规则落地，压缩 handoff 和 TASK-011。
- `2026-06-09 WeChat DevTools Auto Device Debug Config Fix`：自动真机调试 `subPackages` 兼容修复。
- `2026-06-09 Clean Cloud Database For Acceptance`：清空 CloudBase 业务数据，准备干净验收。
- `2026-06-09 TASK-011 Cloud Adapter TDD And wx.cloud Migration`：cloud adapter 测试、`wx.cloud.callFunction` 迁移。
- `2026-06-08 TASK-011 Cloud Environment Reset And Deploy`：清理旧云资源、创建新集合、部署 `yaoguoqiApi`。
- `2026-06-08 TASK-011 Started / CloudBase MCP Prepared`：CloudBase MCP 接入和环境准备。

### UI 基线、弹窗和表单体验
- `2026-06-09 Minimal Modal Input Focus Refinement`：昵称/创建家庭弹窗回到极简大输入槽。
- `2026-06-09 Modal Guidance And Save Loading Refinement`：临期天数高亮、保存全屏 loading。
- `2026-06-09 Item Form Loading Interaction Lock`：表单 loading/saving 期间锁定输入。
- `2026-06-09 Shared Glass Modal And Textarea Tap Shield`：抽取 `GlassModal`，修复保存按钮与 `textarea` 触摸竞争。
- `2026-06-09 Risky Create Custom Glass Modal` 到 `Risky Create Modal Button Length Fix`：新增风险确认弹窗的样式、文案和小程序按钮限制修复。
- `2026-06-09 Unified Page Skeleton Loading`、`Home Modal And Loading Polish`、`Full-Screen Loading Replaces Text Loading State`：页面级 loading 统一和弹窗体验。
- `2026-06-07 Design Direction Refresh`、`2026-06-06 TASK-004 Design Iteration`：首页 Design Anchor 多轮方向变化。

### v0.1 规划与任务队列
- `2026-06-09 Lifecycle And Release Planning`：补充 roadmap、v0.1 release 和 TASK-012 到 TASK-015。
- `2026-06-08 TASK-009 Accepted / TASK-010 Started` 与 `TASK-010 API Contract Validated`：下拉刷新验收和 API contract validated。
- `2026-06-08 TASK-008 Accepted / TASK-009 Implemented`：左滑删除后进入下拉刷新。
- `2026-06-08 TASK-007 Accepted / TASK-008 Implemented`：多图后进入左滑删除。
- `2026-06-07 TASK-006 Accepted / TASK-007 Started`：详情页验收后进入多图。
- `2026-06-07 TASK-005 Accepted / TASK-006 Started`：表单验收后进入详情。

### 产品、架构和早期决策
- `2026-06-08 Product Naming Update`：小程序正式名称改为「要过期」。
- `2026-06-08 Home List Performance Direction`：大数据量列表策略暂缓到后续评估。
- `2026-06-07 Plan Realignment`：任务队列与当前阶段重新对齐。
- `2026-06-06 TASK-003`：项目骨架、domain models、fixtures、mock service 和首页薄页面。
- `2026-06-06` / `Decision Update`：项目初始化、MVP 范围、技术路线、页面地图和后端路线确认。

### 外部状态与 CloudBase
- 最新可行动外部状态以 `docs/handoff.md` 为准。
- 需要追溯 CloudBase 操作历史时，读 `2026-06-09 Clean Cloud Database For Acceptance`、`2026-06-08 TASK-011 Cloud Environment Reset And Deploy`、`2026-06-08 TASK-011 Started / CloudBase MCP Prepared`。

## 2026-06-12 TASK-013 Image Loading Resume Verification
- Goal: 恢复“持续优化上传图片”会话后，继续确认首页缩略图与物品详情页图片加载 loading 效果是否已落地。
- Result: 当前工作区已包含首页缩略图固定占位、shimmer loading、加载完成淡入和失败占位；详情页 hero 轮播已包含图片级固定占位、shimmer loading、加载完成淡入和失败占位。页面仍通过 `imageStorageService` / `itemImages` helper 获取展示资源，未回退到页面直连 cloud client。
- Verification: `pnpm typecheck` 通过；`pnpm test` 35/35 pass；`pnpm build:mp-weixin` 成功（仅 Sass legacy JS API deprecation warning）。
- Next: 仍需用户在微信开发者工具验收首页有图物品缩略图加载前占位、加载后淡入，以及详情页骨架消失后 hero 图片不出现明显空白。

## 2026-06-12 TASK-013 Upload Experience Refinement
- Issue: 用户一次选择 5 张大图后，图片第一时间没有上传云存储符合预期，但本地读取/MD5 处理耗时期间页面缺少反馈；点击保存后全局 loading 文案不区分上传与保存；保存成功前图片从本地路径替换成 `cloud://` fileID 导致整组图片闪动；云存储路径按 `familyId/scopeId` 不够直观，新增物品使用 `draftId` 时用户难以在控制台定位。
- Fix: `src/pages/item-form/index.vue` 先展示本地图片预览；按性能优先方案移除前端图片内容读取、后台 MD5 和保存阶段 MD5 去重/复用，避免 6 张大图后台识别占用小程序交互资源；上传数量限制仍为最多 6 张但不在上传区额外增加说明 UI；`uniImage` 对可识别 `.gif` 路径做 best-effort 过滤，过滤提示沿用现有错误文本区域，不新增上传区格式说明。保存 loading 统一显示 `保存中`，避免上传阶段和物品保存阶段切换过快造成文案割裂；保存成功返回前不再把表单图片从 local 替换为 remote。
- Fix: `src/pages/home/index.vue` 为首页物品缩略图增加固定占位和加载完成淡入；有图卡片在 `thumbnailFileId` / 封面图加载完成前显示同尺寸 shimmer 占位，加载失败时保留占位，避免列表出现后缩略图区域空白或突然跳出。
- Fix: `src/pages/item-detail/index.vue` 为详情页 hero 图片轮播增加图片级占位、加载失败占位和加载完成淡入，避免详情骨架屏消失后图片区域短暂空白。
- Fix: `src/services/cloud/cloudImageStorage.ts` 将云存储路径调整为 `item-images/{familyId}/{yyyy-mm-dd}/{itemId或draftId}/{imageId}` 与 `item-thumbnails/{familyId}/{yyyy-mm-dd}/{itemId或draftId}/{imageId}.jpg`，便于按日期和物品/草稿 scope 在控制台定位。新增物品仍使用 `draftId`，避免先创建空 item 后上传失败产生脏数据。
- Verification: `pnpm typecheck` 通过；`pnpm test` 35/35 pass；`pnpm build:mp-weixin` 成功（仅 Sass legacy JS API deprecation warning）。待用户在微信开发者工具复验大图选择、保存上传和云存储路径。

## 2026-06-12 TASK-013 Upload Picker Runtime Fix
- Issue: 用户在微信开发者工具点击「上传图片」时报 `undefined is not an object (evaluating 'e.index')`。构建产物中 service 层的 `uni.chooseImage` 被编译为 `vendor.index.chooseImage`，在该运行上下文中 `vendor.index` 为 `undefined`。
- Fix: 修改 `src/services/platform/uniImage.ts`，在 service 封装内通过 `globalThis.wx` 获取微信小程序原生 `chooseImage` / `previewImage`；同时取消选择图片时返回空数组，选择失败时只更新页面错误文本，避免再触发页面 catch 中的 `uni.showToast` 编译代理。页面仍然只调用 `imageStorageService`，不直接依赖平台 API 或 cloud client。
- Verification: `pnpm typecheck` 通过；`pnpm test` 33/33 pass；`pnpm build:mp-weixin` 成功（仅 Sass legacy JS API deprecation warning）。构建产物已不再通过 `vendor.index.chooseImage` 调用图片选择，选择图片 catch 分支也不再调用 `vendor.index.showToast`。

## 2026-06-12 TASK-013 Implementation
- Goal: 按 TASK-013 接入图片云存储 adapter，让页面通过 service 处理图片选择、保存前上传和预览，保持 mock/cloud 两种模式可用。
- Changes:
  - 新增 `src/services/contracts/imageStorage.ts`、`src/services/adapters/imageStorage.ts`、`src/services/imageStorageService.ts`，建立图片存储 service/adapter 边界。
  - 新增 `src/services/mock/mockImageStorage.ts`：mock 模式选择图片后保留本地临时路径或静态图片地址，预览走统一 service。
  - 新增 `src/services/cloud/cloudImageStorage.ts`：cloud 模式保存前上传 `wxfile://`、`http://tmp/` 或本地路径图片到微信云存储，跳过已有 `cloud://`、`http(s)` 和 `/static` 稳定地址，并保持图片顺序。
  - 新增 `src/services/platform/uniImage.ts`：集中封装 `uni.chooseImage` 和 `uni.previewImage`，避免页面重复直接调用。
  - 扩展 `src/services/cloud/wechatCloudClient.ts`：新增 `uploadCloudFile`，复用 `wx.cloud.init`，对非微信运行时、缺少 `uploadFile` 或缺少 `fileID` 给出明确错误。
  - 修改 `src/pages/item-form/index.vue`：图片选择和保存前图片准备改走 `imageStorageService`；保存时使用上传后的 `imageUrls` 和首图 `imageUrl`。
  - 修改 `src/pages/item-detail/index.vue`：图片预览改走 `imageStorageService`。
  - 新增/扩展测试：image storage adapter 选择、cloud 图片上传判断、云存储路径生成、`uploadCloudFile` 成功/失败路径。
- Verification: `pnpm typecheck` 通过；`pnpm test` 30/30 pass；`pnpm build:mp-weixin` 成功（仅 Sass legacy JS API deprecation warning）。
- Next: 需要用户在微信开发者工具验收 TASK-013，重点验证 mock/cloud 模式下新增图片保存、首页封面、详情多图和预览；cloud 模式需确认云存储 fileID 展示稳定。

## 2026-06-12 TASK-012 Accepted / TASK-013 Started
- Goal: 按用户确认将 TASK-012 标记为验收完成，并准备开始 TASK-013 图片云存储 adapter 正式接入。
- Result: TASK-012 状态更新为 `done`，`acceptance_status: accepted`；TASK-013 状态更新为 `current`，继续归属 `v0.1` 且需要用户验收。
- Changes:
  - `docs/tasks.md`：Current 从 TASK-012 切换到 TASK-013，TASK-012 移入 Done。
  - `docs/tasks/TASK-012-family-switch.md`：状态改为 `done`，验收状态改为 `accepted`。
  - `docs/tasks/TASK-013-cloud-storage-adapter.md`：状态改为 `current`。
  - `docs/handoff.md`：更新为 TASK-013 接手状态、下一步、关键文件和注意事项。
- Next: 梳理现有图片选择、保存、展示和预览链路，设计并实现 storage service/adapter 抽象，保持 mock/cloud 两种模式可用。

## 2026-06-11 TASK-012 Acceptance UX Refinement
- Goal: 修复家庭列表较长时，新建家庭创建成功后用户需要手动滚动查找的问题，并补齐创建弹窗取消和当前家庭定位细节。
- Changes:
  - `src/pages/home/index.vue`：创建家庭成功后依赖云函数原子设置当前家庭，关闭创建弹窗和家庭中枢，刷新首页并提示 `已切换到「家庭名」`。
  - `cloudfunctions/yaoguoqiApi/index.js`：`createFamily` 创建成功后直接将 `currentFamilyId` 设置为新家庭，避免前端创建后再切换的两步非原子风险。
  - `src/pages/home/index.vue`：新增 `cancelCreateFamily`，从家庭中枢打开创建弹窗后点击取消，只关闭创建弹窗，保留下方家庭切换弹窗。
  - `src/components/FamilyHub.vue`：家庭列表卡片使用稳定节点 ID，并在打开面板或当前家庭变化时自动滚动到当前家庭卡片。
  - `src/components/FamilyHub.vue`：修复重命名遮罩点击冒泡导致整个 FamilyHub 关闭的问题；成员列表加载失败时显示错误和重试入口。
  - `src/components/FamilyHub.vue`：优化 FamilyHub 动画层级，移除内部 `hub-view` 延迟入场动画，只保留 `hub-backdrop` 和最外层 `hub-panel` 整体进入动画，避免外壳先出现、内容后动画的割裂感。
  - `src/components/FamilyHub.vue`：重命名家庭弹窗改为复用 `GlassModal`，输入框、按钮和弹窗结构与设置昵称/创建家庭保持一致；补充本地 `hub-rename-field` 间距以匹配创建家庭弹窗。
  - `cloudfunctions/yaoguoqiApi/index.js`：`assertFamilyOwner` 兼容历史家庭缺少 `familyMembers` 记录时的创建者 owner fallback。
  - `src/components/FamilyHub.vue`：补充重命名弹窗首次打开延迟 focus，限制家庭名称最多 12 个字；解散家庭后回到切换弹窗，并按是否解散当前家庭决定是否刷新首页。
  - `src/components/FamilyHub.vue`：修正 `v-show` 在小程序/flex/scroll-view 组合下导致列表和管理视图同时占位的问题；恢复列表/管理二选一渲染，并改为非响应式滚动快照 + 返回列表时一次性 `scrollTop` 恢复，避免滚动中响应式回写卡顿。
  - `src/pages/home/index.vue`：创建家庭输入同步限制 12 个字；解散非当前家庭只更新弹窗列表，解散当前家庭刷新首页，若已无家庭则进入无家庭状态。
  - `src/pages/home/index.vue`：首页骨架屏搜索框改为更轻的专用骨架样式，降低搜索框位置的深色块存在感。
  - `cloudfunctions/yaoguoqiApi/index.js`：新增家庭名称长度校验，创建/重命名家庭均限制最多 12 个字。
- Verification: `pnpm typecheck` 通过，`pnpm test` 19/19 pass，`pnpm build:mp-weixin` 成功（仅 Sass legacy JS API deprecation warning）。
- Next: 需要用户在微信开发者工具中重新验收 TASK-012 创建家庭与家庭切换体验；验收前仍需重新部署 `yaoguoqiApi` 云函数。

## 2026-06-10 TASK-012 Implementation
- Goal: 实现家庭切换与家庭管理功能，含后端云函数、前端服务层、UI 组件和首页集成。
- Changes:
  - 云函数 `yaoguoqiApi` 新增 6 个 action：`switchFamily`、`renameFamily`、`getMembers`、`removeMember`、`leaveFamily`、`dissolveFamily`。
  - `createFamily` 修复：同时写入 `familyMembers` 集合（role: owner）。
  - `normalizeFamily` 扩展：返回 `role` 字段，通过 `familyMembers` 集合或 `creatorId` fallback 推导。
  - 领域模型新增：`Family.role`、`FamilyMemberInfo`、`SwitchFamilyInput`、`RenameFamilyInput`、`RemoveMemberInput`、`LeaveFamilyInput`、`DissolveFamilyInput`。
  - `HomeRepository` 接口、`CloudHomeRepository`、`MockHomeRepository` 均实现 6 个新方法。
  - `wechatCloudClient.ts` 的 `CloudFunctionName` 类型扩展 6 个新 action。
  - `homeService.ts` 新增 6 个导出函数。
  - 新建 `FamilyHub.vue` 组件：底部面板设计，含家庭列表视图（切换/管理/创建）和管理视图（成员列表、重命名、移除/退出/解散）。
  - 首页集成：family-button 点击打开 FamilyHub，处理切换刷新和创建跳转。
  - Mock fixtures 更新：`mockFamilies` 添加 `role: 'owner'`。
- Verification: `vue-tsc --noEmit` 通过，`pnpm build:mp-weixin` 成功，`pnpm test` 19/19 pass。
- Note: 验收前需重新部署云函数 `yaoguoqiApi`。已有家庭的 `familyMembers` 集合可能为空，`normalizeFamily` 有 creatorId fallback。

## 2026-06-10 TASK-012 Scope Expansion And Design
- Goal: 按用户要求将家庭相关功能合并到 TASK-012 统一实现，设计家庭功能统一入口和完整交互流。
- Decision:
  - 家庭切换、家庭管理（重命名、成员列表、角色权限、移除成员、退出/解散）合并到 TASK-012。
  - 邀请码、加入家庭功能保留给 TASK-014 独立实现，不纳入 TASK-012。
  - 成员分管理员（创建者默认）和普通成员，物品权限一致。
  - 管理员可移除成员、解散家庭；普通成员可退出家庭。
  - 管理员退出前需先转移管理员或解散家庭（v0.1 暂不支持转移）。
- Design:
  - 首页家庭名称升级为可点击的家庭芯片，打开家庭中枢面板（GlassModal）。
  - 面板展示家庭列表、切换、创建入口、管理入口。
  - 管理视图在面板内切换，展示重命名、成员列表（含角色标识）、退出/解散操作。
- Changes:
  - 重写 `docs/tasks/TASK-012-family-switch.md`：标题改为「家庭切换与家庭管理」，scope 扩展到角色权限和管理操作。
  - 更新 `docs/page-map.md`：家庭切换页面描述、全局导航和首页 required features。
- Note:
  - 新增 `Frontend Design Skill Rule` 到 AGENTS.md 和 CLAUDE.md：页面改动任务必须调用 frontend-design skill。

## 2026-06-10 TASK-011 Accepted
- Goal: 用户在微信开发者工具 + 干净 CloudBase 数据下完成 TASK-011 真实主流程联调验收。
- Result: 验收通过。首次进入、设置昵称、创建家庭、新增物品（含临期/过期确认）、保存 loading、首页列表与统计、详情、编辑、标记用完和删除主流程均正常。
- Changes:
  - `docs/tasks/TASK-011-wechat-cloud-backend-foundation.md` 标记为 Done，`acceptance_status: accepted`。
  - `docs/tasks.md` 当前任务切换到 TASK-012。
  - `docs/handoff.md` 更新为 TASK-012 状态。
- Verification:
  - 验收期间多次清空 CloudBase 业务数据，最终六个集合计数均为 0。
- Next:
  - 开始 TASK-012 家庭切换功能，先确认交互方案。

## 2026-06-10 TASK-011 Acceptance UX Fixes
- Goal: 按验收反馈修复三个体验问题。
- Root Causes:
  - 弹窗输入框间距：微信小程序中组件 CSS 不级联到父组件传入的 slot 内容，`.glass-modal-field` 的 `margin-top` 定义在 GlassModal.vue 但对 home/index.vue 的 slot 元素无效。
  - 保存 loading 无动画：`cover-view` 不支持 CSS `animation`/`transform`，自定义 spinner 在小程序端无法旋转。
- Changes:
  - `src/pages/home/index.vue`：在 scoped style 中新增 `.glass-modal-field { margin-top: 30rpx }` 为 slot 内容补充间距。
  - `src/pages/item-form/index.vue`：移除自定义 `cover-view` loading 弹窗和相关 CSS，改用 `uni.showLoading({ title: '保存中', mask: true })` 原生 loading，保存完成或失败时调用 `uni.hideLoading()`。
  - `src/pages/home/index.vue`：`saveProfile` 和 `saveFamily` 改为使用 `uni.showLoading` / `uni.hideLoading`，按钮不再显示 loading 状态文本。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（19 个测试）。
  - `pnpm build:mp-weixin` 通过。
  - 构建产物确认 `glass-modal-field` 样式在 home/index.wxss 中生效，`showLoading`/`hideLoading` 调用在 JS 中存在。
  - 用户验收确认三个问题均已修复。

## 2026-06-10 Continuity Compacting
- Goal: 按新版 `agent-project-continuity` 规则压缩项目连续性文档，让接手状态更轻、更稳定。
- Changes:
  - 更新 `AGENTS.md` 和 `CLAUDE.md`：补齐稳定 `next_action` 枚举、`acceptance_status` 规则，并将文档更新规则调整为按影响范围更新。
  - 重写 `docs/handoff.md`：只保留当前 TASK-011、下一步、外部状态、阻塞和关键文件；历史细节继续保留在本文件中。
  - 压缩 `docs/tasks/TASK-011-wechat-cloud-backend-foundation.md`：从长流水账改为当前快照、外部状态、最新验证、剩余工作和风险。
  - 更新 `docs/tasks.md`：保留 TASK-011 为 Current，并把摘要改为当前可执行状态。
  - 新增 dev-log 顶部 Reading Guide 和主题索引，减少后续 agent 为查历史而加载整份日志的上下文压力。
- Verification:
  - `diff -q AGENTS.md CLAUDE.md` 通过，两个 agent 入口保持一致。
  - `git diff --check` 通过。
  - 已确认本轮只修改连续性文档，未触碰业务代码或 CloudBase。
- Gaps:
  - 本次只整理连续性文档，不推进微信开发者工具真实联调，不操作 CloudBase。

## 2026-06-10 Optimized Continuity Rule Refresh
- Goal: 根据新版 `agent-project-continuity` skill 再次优化项目连续性规则，降低后续 agent 误判任务流程或过度验收的风险。
- Changes:
  - 更新 `AGENTS.md` 和 `CLAUDE.md`：补充项目类型路由，明确本项目当前按 `ui_product` 处理，v0.1 主表面是微信小程序，后端/API 是当前 release 支撑能力。
  - 更新 `AGENTS.md` 和 `CLAUDE.md`：新增 `wait_for_owner_approval`，并把验收拆为 scoped user acceptance、owner approval、local verification。
  - 更新 `docs/architecture.md`：新增 `project_type: ui_product`，记录当前 release 主表面和后端/API 的支撑定位。
  - 更新 `docs/handoff.md`：移除旧字段 `acceptance_required`，新增 `project_type: ui_product`，并提示 stable API 升级需按 owner approval 规则确认。
  - 更新 `docs/tasks/TASK-011-wechat-cloud-backend-foundation.md`：在剩余工作和风险中补充 stable API / 架构 / 数据模型等长期变化需要 owner approval。
- Verification:
  - 本次只修改连续性文档，未触碰业务代码、构建产物或 CloudBase。
- Gaps:
  - 未推进微信开发者工具真实主流程联调；TASK-011 的下一步仍以 `docs/handoff.md` 为准。

## 2026-06-09 Minimal Modal Input Focus Refinement
- Goal: 按用户反馈回收设置昵称和创建家庭弹窗的信息堆叠，保持极简风格，同时让输入框本身更显眼。
- Changes:
  - 修改 `src/pages/home/index.vue`：移除设置昵称和创建家庭弹窗中的「下一步」提示、字段标签和说明 copy，只保留标题、输入框和操作按钮。
  - 修改 `src/components/GlassModal.vue`：删除未使用的 `glass-modal-task` 与字段标签样式；将 `glass-modal-field` 调整为更高、更亮、更有边界和阴影层次的大输入槽。
  - 更新 `docs/ui.md` 和 `docs/page-map.md`：将弹窗规则从“增加提示文本”修正为“减少文本、突出输入框”。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm build:mp-weixin` 通过，仅有 Sass legacy JS API 警告。
  - 已检查 `dist/build/mp-weixin/pages/home/index.wxml`：弹窗不再包含「下一步」提示和字段标签，仅保留显眼输入槽。

## 2026-06-09 WeChat DevTools Auto Device Debug Config Fix
- Goal: 修复微信开发者工具自动真机调试时报 `TypeError: Cannot read property 'subPackages' of undefined` 的编译异常。
- Root Cause:
  - 当前项目没有分包，`src/pages.json` 未显式声明 `subPackages`；`uni build -p mp-weixin` 生成的 `app.json` 也没有该字段。微信开发者工具 `2.01.2510290` 的自动真机调试链路会读取 `subPackages`，在无字段时触发异常。
- Changes:
  - 修改 `src/pages.json`：新增空分包声明 `"subPackages": []`，让小程序产物 `dist/build/mp-weixin/app.json` 稳定包含该字段。
- Verification:
  - `pnpm build:mp-weixin` 通过，仅有 Sass legacy JS API 警告。
  - 已检查 `dist/build/mp-weixin/app.json` 包含 `"subPackages": []`。
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 19 个测试）。

## 2026-06-09 Modal Guidance And Save Loading Refinement
- Goal: 按用户反馈优化设置昵称、创建家庭、临期提醒和新增/编辑保存 loading，让用户更快识别当前要做什么，并让保存中状态更明显。
- Changes:
  - 修改 `src/components/GlassModal.vue`：补充统一的 `glass-modal-task` 动作提示、字段标签和更明显的输入槽样式，让弹窗说明文案与输入区域有清晰层级。
  - 修改 `src/pages/home/index.vue`：设置昵称弹窗新增「下一步 / 填写你的昵称」提示、昵称字段标签和示例占位；创建家庭弹窗新增「下一步 / 给这个家庭起个名字」提示、家庭名称字段标签和示例占位。
  - 修改 `src/pages/item-form/index.vue`：临期提醒文案缩短为「还有 x 天到期，确认添加吗？」，并将剩余天数用橙色胶囊高亮；今天到期与已过期文案同步缩短。
  - 修改 `src/pages/item-form/index.vue`：保存中从按钮内弱 loading 升级为全屏轻玻璃 `cover-view` loading，展示 spinner、保存标题和同步说明，同时覆盖原生输入层与底部保存按钮。
  - 更新 `docs/ui.md` 和 `docs/page-map.md`：同步弹窗输入层级、风险提醒文案和保存全屏 loading 规则。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm build:mp-weixin` 通过，仅有 Sass legacy JS API 警告。
  - 已检查 `dist/build/mp-weixin/pages/home/index.wxml`：昵称/创建家庭弹窗包含 `glass-modal-task`、字段标签和示例占位。
  - 已检查 `dist/build/mp-weixin/pages/item-form/index.wxml`：保存中包含 `save-loading-backdrop` 全屏 `cover-view`，风险确认包含 `risk-days` 高亮天数。
  - 修改完成后已按用户要求再次清空真实 CloudBase 业务集合；清理前计数为 `users=1`、`families=1`、`items=3`、`locations=2`、`familyMembers=0`、`notificationLogs=0`，清理后六个集合均为 0。
- Next:
  - 在微信开发者工具中重新验收首次昵称、创建家庭、临期确认和保存 loading。

## 2026-06-09 Clean Cloud Database For Acceptance
- Goal: 按用户要求清空真实 CloudBase 数据库，重新开始 TASK-011 微信开发者工具验收测试。
- Changes:
  - 通过 CloudBase CLI 操作环境 `cloud1-d8gr12cmd6578bfd0`，清空业务集合 `users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`。
  - 清理前复核发现 `users` 已重新产生 1 条记录，其余集合为 0；本次清理删除 `users` 1 条记录，其余集合无残留数据。
  - 保留现有云函数与集合结构不变，仅清空业务数据，便于从首次进入、设置昵称、创建家庭开始重新验收。
- Verification:
  - 清理后再次计数确认六个业务集合均为 0。
  - `pnpm build:mp-weixin` 通过，已刷新 `dist/build/mp-weixin`；仅有 Sass legacy JS API 警告。
  - 本次未修改业务代码，云函数 `yaoguoqiApi` 沿用上一轮 TASK-011 验证状态。
- Next:
  - 在微信开发者工具中从干净数据重新验收设置昵称、创建家庭、新增物品、风险确认弹窗、详情、编辑、标记用完和删除主流程。

## 2026-06-09 Item Form Loading Interaction Lock
- Goal: 按用户反馈，在表单 loading/saving 期间禁用其他页面操作，避免新增物品保存中继续修改表单。
- Changes:
  - 修改 `src/pages/item-form/index.vue`：新增 `formLocked` 状态，表单加载中或保存中锁定图片上传/删除、名称、日期 picker、保质期输入、位置、历史位置和备注输入。
  - 修改 `src/pages/item-form/index.vue`：相关事件处理函数在锁定时早退，避免只靠视觉 disabled。
  - 修改 `src/pages/item-form/index.vue`：保存中增加透明 `cover-view` 触摸屏蔽层，拦截小程序原生 `textarea` 等组件的触摸穿透；保存按钮保持保存中状态显示。
  - 更新 `docs/ui.md` 和 `docs/page-map.md`：记录表单 loading/saving 期间必须锁定其他表单操作。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm build:mp-weixin` 通过，仅有 Sass legacy API 警告。
  - 已检查 `dist/build/mp-weixin/pages/item-form/index.wxml`：input、textarea、picker、button 均有 `disabled` 绑定，保存中触摸屏蔽层编译为 `cover-view` + `catchtap` / `catchtouchmove`。
  - `git diff --check` 通过；`AGENTS.md` 与 `CLAUDE.md` 内容一致。

## 2026-06-09 Component Extraction Rule Recorded
- Goal: 按用户反馈，将“同类 UI 明显重复时应主动抽组件”的规则记录到项目长期规范中。
- Changes:
  - 更新 `AGENTS.md` 和 `CLAUDE.md`：新增 Component Extraction Rule，要求同类 UI、交互流程、状态处理或样式结构在 2 处及以上出现，且需要统一微调或保持同一视觉语言时，agent 应主动抽取共享组件、组合函数或样式抽象。
  - 更新 `docs/ui.md`：补充 UI 层面的组件抽取判断标准，并要求暂缓抽取时记录原因和后续触发条件。
  - 更新 TASK-011 相关任务与交接文档：记录该规则已补充，后续类似弹窗和重复 UI 应主动组件化。
- Verification:
  - `diff -q AGENTS.md CLAUDE.md` 通过，两个 agent 指令文件内容一致。
  - `git diff --check` 通过。

## 2026-06-09 Shared Glass Modal And Textarea Tap Shield
- Goal: 按用户反馈，将设置昵称、创建家庭和新增风险提醒弹窗统一为一套组件，并修复保存按钮覆盖备注 `textarea` 时可能同时触发键盘的问题。
- Changes:
  - 新增 `src/components/GlassModal.vue`：抽取共享毛玻璃弹窗组件，支持主题标识、标题、说明文案、正文居中、主/次按钮、禁用态和遮罩点击关闭。
  - 修改 `src/pages/home/index.vue`：设置昵称和创建家庭弹窗改用 `GlassModal`，移除旧 `.modal-*` 页面样式。
  - 修改 `src/pages/item-form/index.vue`：新增风险确认改用 `GlassModal`，显示标题「提醒」，正文居中，按钮保持 `取消` / `确认`；弹窗遮罩改薄，避免过度遮挡背后页面。
  - 修改 `src/pages/item-form/index.vue`：固定保存按钮改为 `cover-view` + `catchtap` 产物，保存入口主动 `hideKeyboard()`，风险确认打开时隐藏保存覆盖层，避免与原生 `textarea` 触摸/焦点竞争。
  - 更新 `docs/ui.md` 和 `docs/page-map.md`：记录后续类似弹窗统一使用 `GlassModal`，以及保存按钮与原生 textarea 的小程序交互约束。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm build:mp-weixin` 通过，仅有 Sass legacy API 警告。
  - 已检查 `dist/build/mp-weixin/pages/item-form/index.wxml`：保存按钮编译为 `cover-view` + `catchtap`，风险确认打开时由 `wx:if` 隐藏。
  - 已检查 `dist/build/mp-weixin/pages/item-form/index.js`：保存入口包含 `hideKeyboard()`，新增风险确认路径不再调用 `showModal`。
  - `git diff --check` 通过；`AGENTS.md` 与 `CLAUDE.md` 内容一致。

## 2026-06-09 Risky Create Custom Glass Modal
- Goal: 按用户反馈，将新增临期/已过期物品确认弹窗设计为与首页设置昵称弹窗一致的毛玻璃样式。
- Changes:
  - 修改 `src/pages/item-form/index.vue`：移除新增风险确认对 `uni.showModal` 的依赖，改为页面内自定义居中毛玻璃弹窗。
  - 自定义弹窗复用设置昵称弹窗的遮罩、玻璃卡片、圆角、阴影和 `取消` / `确认` 双按钮视觉语言；保留无标题、只展示提示文本和功能按钮的交互。
  - 更新 `docs/ui.md` 和 `docs/page-map.md`：记录新增风险确认使用自定义玻璃弹窗。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm build:mp-weixin` 通过，仅有 Sass legacy API 警告。
  - 已检查 `dist/build/mp-weixin/pages/item-form/index.js` 和 `.wxml`：风险确认链路不再调用 `showModal`，构建产物包含 `modal-backdrop`、玻璃弹窗结构和 `取消` / `确认` 按钮。

## 2026-06-09 Risky Create Modal Copy Refinement
- Goal: 按用户反馈优化新增临期/已过期物品二次确认弹窗，让提示文本更直观。
- Changes:
  - 修改 `src/pages/item-form/index.vue`：新增风险确认弹窗不再传标题，只展示提示文本和操作按钮。
  - 临期文案改为「该物品还有 x 天就要过期了，确定添加吗？」；今天到期文案为「该物品今天就要过期了，确定添加吗？」；已过期文案为「该物品已过期，确定添加吗？」。
  - 弹窗按钮改为 `取消` / `确认`，同时保持小程序 `showModal` 按钮文案不超过 4 个字符。
  - 更新 `docs/ui.md`：同步新增风险确认弹窗文案、无标题和按钮规则。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm build:mp-weixin` 通过，仅有 Sass legacy API 警告。
  - 已检查 `dist/build/mp-weixin/pages/item-form/index.js`：确认弹窗不传 `title`，按钮为 `取消` / `确认`，内容使用新的临期/今天到期/已过期提示文案。

## 2026-06-09 Risky Create Modal Button Length Fix
- Goal: 彻底检查新增临期物品保存确认链路，修复点击保存后提示“确认弹窗打开失败，请重试”的问题。
- Root Cause:
  - 微信小程序 `showModal` 的 `cancelText` / `confirmText` 按钮文案最多 4 个字符；此前 `cancelText: '再检查一下'` 为 5 个字符，导致 `uni.showModal` 在小程序端直接进入 `fail`。
- Changes:
  - 修改 `src/pages/item-form/index.vue`：新增确认弹窗按钮文案改为 `再检查` / `仍保存`，并集中到 `riskyCreateModalActions`，旁注小程序按钮文案长度限制。
  - 更新 `docs/ui.md`：记录小程序原生确认弹窗按钮文案必须控制在 4 个字符以内。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm build:mp-weixin` 通过，仅有 Sass legacy API 警告。
  - 已检查 `dist/build/mp-weixin/pages/item-form/index.js`：旧文案 `再检查一下` / `仍然保存` 已不存在，构建产物使用 `再检查` / `仍保存`。
  - 已全局检查 `src/pages` 中 `showModal` 的按钮文案，除新增确认外仅有删除确认 `删除`。

## 2026-06-09 Item Form Save Tap Feedback Fix
- Goal: 修复新增临期物品点击保存后无任何反应的问题，避免保存入口被按钮原生禁用或早退逻辑静默吞掉。
- Changes:
  - 修改 `src/pages/item-form/index.vue`：保存按钮只有在保存中才使用原生 `disabled`，表单未准备、无家庭、缺名称、缺日期或保质期无效时，点击会给出 toast 和表单错误提示。
  - 修改 `src/pages/item-form/index.vue`：满足保存条件时仍进入新增临期/今天到期/已过期二次确认；若确认弹窗打开失败，会提示用户重试，而不是静默取消。
  - 更新 `docs/ui.md`：记录保存按钮不可保存状态必须给出明确反馈，不能静默无响应。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm build:mp-weixin` 通过，仅有 Sass legacy API 警告。
  - 已检查 `dist/build/mp-weixin/pages/item-form/index.wxml`：保存按钮原生 `disabled` 仅绑定保存中状态，点击事件仍保留。

## 2026-06-09 Mini Program Risky Create Confirmation Runtime Fix
- Goal: 修复微信开发者工具中新增临期物品点击保存时报 `undefined is not an object (evaluating 'a.getItemStatus')` 的问题。
- Changes:
  - 修改 `src/pages/item-form/index.vue`：新增/编辑表单页不再在运行时依赖 `@/domain/expiry` 的导出函数，改为页面内稳定计算预计到期日期和临期/今天到期/已过期状态。
  - 保持新增临期、今天到期、已过期物品保存前二次确认的交互和文案不变。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm build:mp-weixin` 通过，仅有 Sass legacy API 警告。
  - 已检查 `dist/build/mp-weixin/pages/item-form/index.js`：表单页构建产物不再引用 `../../domain/expiry.js`，保存确认路径不再出现 `getItemStatus` 外部调用。

## 2026-06-09 Expiring Item Create Confirmation And Shelf Placeholder Fix
- Goal: 按用户反馈，新增临期/今天到期/已过期物品时增加二次确认，并修复「生产日期 + 保质期」中“填写”占位文本首次打开时向右偏移的问题。
- Changes:
  - 修改 `src/pages/item-form/index.vue`：新增物品保存前计算最终 `expiresAt` 的状态，若为 `expiring`、`expires_today` 或 `expired`，先弹出确认框；用户取消时不进入保存中状态，也不调用 `createItem`。
  - 修改 `src/pages/item-form/index.vue`：保质期数值输入不再使用原生 input placeholder，而是使用稳定的 `.shelf-placeholder` 文本层，避免原生输入框在首次布局时重排偏移。
  - 更新 `docs/ui.md` 和 `docs/page-map.md`：记录新增临期/过期二次确认和保质期占位文本布局规则。
- Verification:
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm typecheck` 通过。
  - `pnpm build:mp-weixin` 通过。
  - H5 预览核验：新增页首次打开和刷新后，“填写”占位文本位置稳定；填写已过期日期 `2020-01-01` 后点击保存，会出现“这个物品已过期”二次确认，未直接创建。

## 2026-06-09 New Item Form Loading And Disabled Button Refinement
- Goal: 按用户反馈优化新增/编辑页保存按钮禁用态，并取消新增表单进入时的骨架屏。
- Changes:
  - 修改 `src/pages/item-form/index.vue`：新增模式不再显示表单骨架屏，直接展示空白录入表单；编辑模式仍保留骨架屏用于等待已有物品回显。
  - 修改 `src/pages/item-form/index.vue`：保存按钮禁用态改为去饱和灰玻璃、弱阴影和灰色文字，避免看起来像可点击的浅色主按钮。
  - 更新 `docs/ui.md`：同步记录新增表单不显示骨架屏，以及禁用保存按钮的视觉规则。
- Verification:
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm typecheck` 通过。
  - `pnpm build:mp-weixin` 通过。

## 2026-06-09 UI Acceptance And Save Button State Review
- Goal: 按用户确认更新 UI 验收状态，审查 Claude Code 今日 TASK-011 未提交改动，并优化新增/编辑页保存按钮禁用和保存中状态。
- Review:
  - 已检查 TASK-011 未提交代码、测试、配置和文档改动。
  - 发现 `src/pages/item-form/index.vue` 曾让新增页在 `getItemFormOptions()` 完成前渲染表单，导致用户可能看到可填写但无法保存的页面；已修复为加载期间展示表单骨架屏。
  - `.env.production`、`.mcp.json`、`.claude/settings.local.json` 和 `.agents` 未发现密钥；`.agents` 是约 1MB 的 CloudBase skill 文档包，提交前需确认是否作为项目工具资产入库。
- Changes:
  - 更新 `docs/ui.md`：将 UI 基线标记为已验收，并记录后续样式微调必须同步更新 UI 文档。
  - 修改 `src/pages/item-form/index.vue`：新增页和编辑页都在表单选项加载期间展示骨架屏。
  - 修改 `src/pages/item-form/index.vue`：保存按钮区分可用、禁用、保存中三种状态；禁用态保持可见，保存中使用更明确的石墨青玻璃底和轻微流光反馈。
- Verification:
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm typecheck` 通过。
  - `pnpm build:mp-weixin` 通过。
- Remaining Risks:
  - TASK-011 真实微信开发者工具联调尚未完成。

## 2026-06-09 Unified Page Skeleton Loading
- Goal: 按用户反馈统一所有页面 loading 效果，避免空白页中间单独 loading 图标。
- Changes:
  - 修改 `src/pages/home/index.vue`：将首页初始加载从全屏蒙版 loading 改为 dashboard/search/list 结构骨架屏。
  - 修改 `src/pages/item-detail/index.vue`：将详情页「正在查看」文字 loading 改为图片、标题、到期日、信息面板骨架屏。
  - 修改 `src/pages/item-form/index.vue`：将新增/编辑页「正在准备」文字 loading 改为图片区、输入字段、日期模块和位置字段骨架屏。
  - 更新 `docs/ui.md`：明确页面级初始加载统一使用贴近真实结构的骨架屏，短操作反馈才使用 toast、顶部轻浮层或按钮状态。
- Verification:
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm typecheck` 通过。
  - `pnpm build:mp-weixin` 通过。
- Remaining Risks:
  - 该 UI 调整需要用户在微信开发者工具中视觉验收。

## 2026-06-09 Home Modal And Loading Polish
- Goal: 按用户反馈重新设计首页设置昵称、创建家庭弹窗，并将空白页 loading 改为全屏蒙版弹窗 loading。
- Changes:
  - 修改 `src/pages/home/index.vue`：设置昵称弹窗增加标题组、主题标识、说明文案、玻璃输入框和更明确的主按钮文案，使其与当前流光毛玻璃首页风格一致。
  - 修改 `src/pages/home/index.vue`：创建家庭弹窗同步使用同一套玻璃弹窗结构，保留取消/创建操作。
  - 修改 `src/pages/home/index.vue`：将 `full-screen-loader` 改为 `loading-backdrop` + `loading-card`，使用全屏蒙版、居中玻璃加载卡片、spinner 和加载说明，避免空白页中间单独 loading 图标的体验。
- Verification:
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm typecheck` 通过。
  - `pnpm build:mp-weixin` 通过。
- Remaining Risks:
  - 该 UI 调整需要用户在微信开发者工具中视觉验收。
- Superseded:
  - 页面级 loading 已在后续 `Unified Page Skeleton Loading` 中统一改为骨架屏；不再采用全屏蒙版 spinner 作为页面初始加载。

## 2026-06-09 Full-Screen Loading Replaces Text Loading State
- Goal: 将首页"正在整理"文字加载状态替换为全屏 spinner loading，提升加载体验。
- Changes:
  - 修改 `src/pages/home/index.vue`：将 `v-if="loading && !needsProfileName"` 区域从 `quiet-state loading-state` + 点状动画 + "正在整理"文字，改为 `full-screen-loader` + `loader-ring` spinner。
  - 样式：全屏覆盖页面，居中旋转 ring，背景继承首页渐变色；ring 使用项目主色 `#4f7f78`。
  - 移除 `.loading-state`、`.loading-dots`、`.dot` 和 `@keyframes dot-bounce` 样式。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（19 个测试）。
  - `VITE_USE_MOCK=false pnpm build:mp-weixin` 通过。
- Note: UI 变更需用户验收。

## 2026-06-09 wx Runtime Safety And Documentation Update Rule
- Goal: 修复 wx 运行时判断风险，补充项目文档更新规则。
- Changes:
  - 修改 `src/services/cloud/wechatCloudClient.ts`：将 `!wx` 直接引用改为 `typeof wx === 'undefined'` 安全判断，避免非微信运行时 ReferenceError；`ensureCloudInit` 同步添加 `typeof wx === 'undefined' || !wx.cloud` 防护。
  - 修改 `src/services/cloud/wechatCloudClient.test.ts`：新增 3 个测试验证 wx 不可用、wx.cloud 缺失、wx.cloud.callFunction 缺失时抛出预期错误；重写测试文件结构修复插入位置问题。测试从 4 个增至 7 个。
  - 修改 `AGENTS.md` 和 `CLAUDE.md`：新增 `Documentation Update Rule` 章节，明确每次任务完成后必须更新的文档清单和按影响范围追加更新的规则。两个文件内容保持一致。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 19 个测试）。
  - `pnpm build:mp-weixin` 通过。
- Remaining Risks:
  - TASK-011 真实联调尚未完成，需用户在微信开发者工具中验收主流程。

## 2026-06-09 TASK-011 Cloud Adapter TDD And wx.cloud Migration
- Goal: 为 cloud adapter 增加 Vitest 测试，修复 uni-app CLI 项目无法使用 uniCloud 的问题，并改善首页弹窗交互。
- Changes:
  - 新增 `src/services/cloud/wechatCloudClient.test.ts`（4 个测试）：验证 wx.cloud.callFunction 调用、初始化、错误处理和 null 返回。
  - 新增 `src/services/cloud/cloudHomeRepository.test.ts`（7 个测试）：验证 action/payload 映射。
  - 新增 `src/services/adapters/homeRepository.test.ts`（2 个测试）：验证 VITE_USE_MOCK=false 切换分支。
  - 修改 `src/services/cloud/wechatCloudClient.ts`：从 `uniCloud.callFunction` 改为 `wx.cloud.callFunction`，添加 `declare const wx` 类型声明、自动 `wx.cloud.init()` 和 `resetCloudInit()` 导出。
  - 修改 `src/services/adapters/homeRepository.ts`：提取 `createHomeRepository(useMockEnv)` 工厂函数。
  - 修改 `vitest.config.ts`：改用 `fileURLToPath` 修复中文路径 alias 解析。
  - 修改 `src/manifest.json`：写入小程序 appid `wx494b5e7688cd2848`。
  - 修改 `src/pages/home/index.vue`：
    - 设置昵称弹窗添加 `v-model="profileNameInput"` 和 `@click="saveProfile"` 事件处理。
    - 创建家庭弹窗添加 `v-model="familyNameInput"` 和 `@click="saveFamily"` 事件处理。
    - 弹窗从底部改为居中显示（`align-items: center` + `max-width: 540rpx`）。
    - 首次加载空状态改为点状动画，且 `needsProfileName` 为 true 时不再显示空白加载态。
  - 更新 `docs/handoff.md`、`docs/tasks.md` 和 `docs/dev-log.md`。
- Verification:
  - `pnpm typecheck` 通过。
  - `pnpm test` 通过（4 个文件 16 个测试）。
  - `VITE_USE_MOCK=false pnpm build:mp-weixin` 通过。
- Known Issues:
  - 微信开发者工具真实联调尚未完成，需用户在开发者工具中验收主流程。
  - 弹窗居中和交互修复属于 UI 变更，需用户验收。

## 2026-06-09 Lifecycle And Release Planning
- Goal: 根据用户更新后的 `agent-project-continuity` lifecycle/version control 规则，补齐项目版本目标和 release 级文档。
- Changes:
  - 新增 `docs/roadmap.md`，定义 v0.1、v0.2、v0.3、v1.0 生命周期方向。
  - 新增 `docs/releases/v0.1.md`，定义“小程序测试版闭环”的 included scope、excluded scope、exit criteria 和 release acceptance。
  - 更新 `docs/tasks.md`，将 TASK-011 到 TASK-015 挂到 `release: v0.1`。
  - 新增 TASK-012 家庭切换、TASK-013 图片云存储 adapter、TASK-014 加入家庭与邀请最小流程、TASK-015 v0.1 测试版验收与体验修复。
  - 更新 `AGENTS.md` 和 `CLAUDE.md` 的 Read First 与 lifecycle 规则。
  - 更新 `docs/handoff.md`，记录当前 active release 为 v0.1。
- Verification:
  - 文档结构检查完成；本次未改业务代码，未运行构建。

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
