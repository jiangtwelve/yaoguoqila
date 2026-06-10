# Agent Instructions

> 此文件与同目录下的 agent 指令文件内容同步。当其中一个文件发生变化时，必须同步更新另一个文件。

## Sync Rule
- CLAUDE.md 和 AGENTS.md 内容必须保持一致。
- 修改其中一个文件后，必须立即将变更同步到另一个文件。

## Read First
- docs/product.md
- docs/architecture.md
- docs/page-map.md
- docs/ui.md
- docs/api.md
- docs/roadmap.md
- active docs/releases/*.md
- docs/tasks.md
- active docs/tasks/TASK-xxx.md
- docs/handoff.md
- docs/dev-log.md

## Documentation Language
- 面向人的项目文档使用中文。
- YAML keys、稳定枚举值、文件路径、代码标识符和 API 字段名优先使用英文，便于跨工具解析。

## Project Context
- 项目正式名称为「要过期」。
- 产品方向：以家庭为单位管理食物、日用品等物品的保质期、过期时间、图片、位置、备注，并在即将过期或已经过期时提醒用户。
- 目标形态：微信小程序、Android、iOS 三端通用；当前技术路线为 `uni-app + Vue 3 + TypeScript`，后端优先使用微信云开发。

## Default Development Flow
1. 先确认产品方向和 MVP 边界。
2. 明确项目类型和当前 release 主表面；本项目当前按 `ui_product` 处理，v0.1 主表面是微信小程序，后端/API 为当前阶段的支撑能力。
3. 再确认技术选型，并记录到 docs/architecture.md 和 docs/decisions/。
4. UI 产品任务在实现 Design Anchor 前确认 docs/page-map.md 和页面风格方向。
5. 使用运行中的前端作为设计源，而不是单独维护高保真设计稿。
6. 做静态前端页面时优先使用 `frontend-design` skill；若不可用则继续默认前端开发流程，并记录限制。
7. 静态页面使用 preview fixtures；业务数据不要直接硬编码在模板或页面标记里。
8. 页面通过 service/adapter 获取 mock 或真实数据，避免页面直接依赖 mock 文件。
9. API contract 先草拟，待 mock 前端和真实集成验证后再进入 stable；影响长期行为的 stable API 变更需要 owner approval。
10. 后端按照 validated/stable API contract 实现。
11. 每个有意义的任务结束前更新 dev-log、tasks、handoff，必要时更新 decisions。

## Lifecycle And Release Planning
- 当前 active release 为 `v0.1 小程序测试版闭环`，详见 docs/roadmap.md 和 docs/releases/v0.1.md。
- 每个 TASK 必须声明所属 `release` 或 `phase`，并说明是否为该 release 必需。
- 每个有意义任务结束时，都要对照 active release 的 exit criteria；如果 release 目标已满足，应主动提醒用户进入版本级验收。
- 新需求先判断归属：当前 release 必需、后续 release、或 Backlog；不要静默扩大当前 release。

## Setup And Discovery Rule
- 当前阶段以 docs/roadmap.md、docs/releases/*.md 和 docs/handoff.md 的结构化状态为准；不要凭旧对话把项目误判回 setup/design。
- 只有当文档明确处于 setup/design，或用户明确要求回到产品设计/发现阶段时，才继续交互式产品设计流程：先记录上一个答案，再问下一个关键决策问题。
- 产品发现阶段一次只问一个关键问题；优先给 2-3 个具体选项，并标注推荐默认项，同时允许用户自由回答。
- 不要在用户确认前把长期技术选型、MVP 范围、页面地图、稳定 API、首个 Design Anchor 视为最终结论。

## Short Resume Prompts
当用户说 "continue development"、"继续开发"、"continue yesterday's task"、"继续昨天的任务" 或类似短提示：
1. 读取 docs/handoff.md frontmatter 和正文。
2. 读取 docs/tasks.md。
3. 若 handoff.current_task 存在，先读取对应 TASK 文件。
4. 若没有 current_task，选择 Current 中第一个任务；若无 Current，选择 Ready 中第一个任务。
5. 按 handoff.next_action 执行。
6. 若 blocked 为 true 且无法本地解决，只问用户缺失的那一个决策或资源。

Supported next_action values:
- continue_implementation
- wait_for_user_acceptance
- wait_for_owner_approval
- wait_for_release_acceptance
- ask_product_question
- fix_verification_failure
- start_next_ready_task
- verify_external_state
- blocked

## User Confirmation Required
- MVP 范围
- 生命周期 / release 计划和当前 release 完成线
- 项目类型或当前 release 主表面发生变化
- 技术选型
- Design Anchor 实现前的页面地图
- 首个已接受的 Design Anchor
- 全局 UI 方向变更
- 影响长期行为的 stable API contract
- 后端技术路线
- 重大数据模型变更
- 发布、上架、推送配置等外部动作

## Scope Rules
- 按 active TASK 文档执行。
- 超出范围的发现记录为新任务，不在当前任务里悄悄扩张。
- 不回滚或覆盖与当前任务无关的已有变更。

## Component Extraction Rule
- 当同类 UI、交互流程、状态处理或样式结构在 2 处及以上出现，且后续需要统一微调、已确认使用同一视觉语言，或用户连续要求保持一致时，agent 应主动提取共享组件、组合函数或样式抽象，不要等用户明确要求。
- 即使当前正在修 bug，也要检查问题是否来自重复实现；若重复实现已经影响维护或一致性，应优先做小范围抽象后再继续修复。
- 若暂时不抽象，必须在 `docs/dev-log.md` 或 `docs/handoff.md` 记录原因、风险和后续触发条件。

## Frontend Design Skill Rule
- 只要任务涉及页面改动、页面设计、页面结构重组、视觉方向调整或新页面创建等场景，都必须先调用 `frontend-design` skill 来指导设计方向和实现。
- 如果当前环境未安装 `frontend-design` skill，则使用默认前端开发流程，并在 `docs/dev-log.md` 记录 skill 不可用的情况。

## Documentation Update Rule
项目文档是长期记忆，但不要把所有历史都塞进交接文件。按影响范围更新：

1. **状态查询 / 恢复回答**
   - 不更新文档，除非发现文档之间互相矛盾，或与当前代码状态明显不一致。
2. **小 bug、小 UI 微调、本地验证记录**
   - 更新 `docs/dev-log.md`。
   - 仅当下一步、阻塞项、验收状态、任务范围或可交接状态变化时，更新 `docs/handoff.md` 或当前 TASK。
3. **任务完成**
   - 更新 `docs/tasks.md`、当前 active `docs/tasks/TASK-xxx.md`、`docs/dev-log.md` 和 `docs/handoff.md`。
4. **版本 / 产品 / 架构 / API / 页面 / UI 合同变化**
   - 更新对应 source of truth：`docs/roadmap.md`、`docs/releases/*.md`、`docs/product.md`、`docs/architecture.md`、`docs/page-map.md`、`docs/ui.md`、`docs/api.md` 或 `docs/decisions/`。
5. **无需记录到项目开发文档的情况**
   - 与产品行为、业务代码、构建/测试/部署流程和任务状态无关的本地工具缓存、编辑器配置、临时文件清理。
   - 纯格式化、拼写或注释微调，且不会影响可交接状态。

Structured metadata 使用稳定值：
- task status: `ready | current | blocked | done`
- acceptance_status: `not_required | pending | accepted | failed`
- next_action: `continue_implementation | wait_for_user_acceptance | wait_for_owner_approval | wait_for_release_acceptance | ask_product_question | fix_verification_failure | start_next_ready_task | verify_external_state | blocked`

`docs/handoff.md` 只保留下一位 agent 接手所需的当前状态、下一步、阻塞、最新外部状态和关键文件；历史细节放入 `docs/dev-log.md`。

## Acceptance And Approval
- 用户可见 UI、交互、工作流、release 行为或外部可见集成行为，在标记 Done 前需要 scoped user acceptance。
- 长期产品方向、stable API、架构、数据模型、安全/隐私、release 范围变化，需要 owner approval，并记录到对应 source of truth；长期决策还要写入 docs/decisions/。
- 内部重构、测试、工具链、文档瘦身和保持已接受行为不变的实现调整，只需 local verification 并记录。
- 模糊回复如“继续”“下一步”“看起来不错”“looks good”不算明确验收；若正在等待验收或 approval，应先给出对应清单。
