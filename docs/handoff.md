---
status: active
current_task: TASK-013
current_release: v0.1
project_type: ui_product
next_action: wait_for_user_acceptance
blocked: false
blocker: ""
acceptance_status: pending
external_state_status: ready_for_task_013_acceptance
updated: 2026-06-12
---

# Handoff

## 当前状态
项目处于 `v0.1 小程序测试版闭环`。TASK-012 家庭切换与家庭管理已由用户验收通过并标记完成；TASK-013 图片云存储 adapter 正式接入已完成本地实现和验证，等待用户在微信开发者工具中验收。

TASK-013 已新增图片存储 service/adapter 边界：mock 模式保留本地临时路径，cloud 模式保存前上传本地图片到微信云存储并返回 fileID；物品表单和详情页已改为调用 `imageStorageService`，页面不直接依赖 CloudBase client。验收反馈中发现大图本地处理阻塞预览、保存成功前图片闪动、云存储路径不易定位、首页和详情图片加载慢，本轮已按性能优先方案移除前端图片内容读取、后台 MD5 和保存阶段内容级去重，选择后先展示本地预览，首页缩略图和详情 hero 图片增加固定占位与加载淡入，上传数量在逻辑层限制为最多 6 张但不额外增加上传区说明 UI，并将云存储路径改为按日期和 item/draft scope 分区。恢复会话后已复核首页缩略图与详情页 hero 图片 loading/淡入实现，并重新通过本地验证。

## 当前任务快照
- TASK-012 已完成并验收通过，包含家庭切换、创建、重命名、成员管理、退出/解散家庭及多轮验收体验修复。
- TASK-013 已完成本地实现，包含：
  - 新增 `ImageStorage` contract、adapter 选择器和 `imageStorageService`。
  - mock adapter：选择图片后立即返回本地预览资源，保存时原样保留图片地址，不做前端 MD5。
  - cloud adapter：选择图片后立即返回本地预览资源，保存前直接上传本地临时图片，跳过已有 `cloud://` / `http(s)` / `/static` 稳定地址、保持图片顺序。
  - `wechatCloudClient` 扩展 `uploadCloudFile`，复用 `wx.cloud.init`，缺少运行时或 fileID 时抛出明确错误。
  - `item-form` 不再直接调用 `uni.chooseImage`，保存前调用 service 准备 `imageUrls`。
  - `item-detail` 不再直接调用 `uni.previewImage`，改走 service 预览。
  - 补充 image storage adapter、cloud storage 转换、cloud upload client 测试。
- 本地验证已通过：`pnpm typecheck`、`pnpm test`（35/35）、`pnpm build:mp-weixin`（仅 Sass legacy JS API deprecation warning）。

## 最新外部状态
- CloudBase 环境：`cloud1-d8gr12cmd6578bfd0`。
- 云函数：当前仅保留 `yaoguoqiApi`，后续 TASK-016 再评估内部模块化和物理拆分。
- 集合：`users`、`families`、`items`、`locations`、`familyMembers`、`notificationLogs`。
- TASK-013 涉及 CloudBase 云存储；开始实现前需确认现有图片字段、表单上传链路和当前 repository/service 边界。

## 下一步
1. 用户在微信开发者工具验收 TASK-013。
2. 重点验收 mock/cloud 模式下新增物品选择图片、保存、首页封面、详情多图和图片预览。
3. 重点复验一次选择多张大图后，本地预览会快速出现，不再等待完整 MD5 识别完成。
4. 重点复验首页物品列表中，有图物品缩略图加载前会显示稳定占位，加载完成后淡入，不应出现明显空白或突兀跳图。
5. 重点复验详情页进入后，hero 图片加载前会显示稳定占位，加载完成后淡入，不应在骨架屏消失后出现明显图片空白。
6. 重点复验上传数量最多只能保留 6 张，上传区不应出现额外数量/格式说明 UI。
7. 重点复验可识别 `.gif` 路径的动图会被忽略并出现提示；微信临时路径无法暴露后缀时，后续再评估文件头识别。
8. cloud 模式需确认点击保存后 loading 统一显示“保存中”；v0.1 不做内容级图片去重，重复内容图片允许保存以保证前端性能。
9. cloud 模式需确认本地临时图片会上传到微信云存储，已有稳定图片不重复上传。
10. 云存储路径现在按 `item-images/{familyId}/{yyyy-mm-dd}/{itemId或draftId}/...` 与 `item-thumbnails/{familyId}/{yyyy-mm-dd}/{itemId或draftId}/...` 分区；新增物品保存前还没有最终 itemId，因此使用 `draft_...` scope。
11. 验收通过后标记 TASK-013 为 done，继续推进 TASK-014。

## 阻塞
- 当前无阻塞。

## 关键文件
- `AGENTS.md`
- `CLAUDE.md`
- `docs/handoff.md`
- `docs/tasks.md`
- `docs/tasks/TASK-013-cloud-storage-adapter.md`
- `docs/releases/v0.1.md`
- `docs/api.md`
- `docs/ui.md`
- `src/services/contracts/imageStorage.ts`
- `src/services/adapters/imageStorage.ts`
- `src/services/imageStorageService.ts`
- `src/services/mock/mockImageStorage.ts`
- `src/services/cloud/cloudImageStorage.ts`
- `src/services/platform/uniImage.ts`
- `src/services/cloud/wechatCloudClient.ts`
- `src/pages/item-form/index.vue`
- `src/pages/item-detail/index.vue`
- `src/pages/home/index.vue`

## 注意事项
- 接手前先查看 `git status`，不要覆盖其他 agent 的未提交变更。
- TASK-013 涉及用户可见图片上传/展示/预览行为，标记 Done 前需要用户验收。
- 页面已通过 `imageStorageService` 处理图片选择、保存前上传和预览；后续不要在页面中直接 import cloud client。
- 本轮已修复点击上传图片时报 `undefined is not an object (evaluating 'e.index')` 的运行时问题：`src/services/platform/uniImage.ts` 通过 `globalThis.wx` 获取微信小程序原生 `chooseImage` / `previewImage`，避免 service 层 `uni.chooseImage` 编译到不可用的 `vendor.index`；选择失败时只更新页面错误文本，避免 catch 分支继续调用 `uni.showToast`。
- cloud 模式当前保存 `wx.cloud.uploadFile` 返回的 `fileID`；若验收发现 `<image>` 或 `wx.previewImage` 对 fileID 展示不稳定，应在 cloud image adapter 中集中转换展示 URL，不要回退到页面内处理。
- 高影响 CloudBase 操作必须先确认环境和操作范围，操作后记录可观察结果。
- stable API、架构、数据模型、安全/隐私或 release 范围变化需要 owner approval。
- 历史细节查 `docs/dev-log.md`。
