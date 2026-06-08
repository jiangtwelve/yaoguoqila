# Agent Instructions

## Read First
- docs/product.md
- docs/architecture.md
- docs/page-map.md
- docs/ui.md
- docs/api.md
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
- 目标形态：微信小程序、Android、iOS 三端通用；具体技术栈尚未最终确认。

## Default Development Flow
1. 先确认产品方向和 MVP 边界。
2. 再确认技术选型，并记录到 docs/architecture.md 和 docs/decisions/。
3. 在实现 Design Anchor 前确认 docs/page-map.md。
4. 使用运行中的前端作为设计源，而不是单独维护高保真设计稿。
5. 做静态前端页面时优先使用 `frontend-design` skill；若不可用则继续默认前端开发流程，并记录限制。
6. 静态页面使用 preview fixtures；业务数据不要直接硬编码在模板或页面标记里。
7. 页面通过 service/adapter 获取 mock 或真实数据，避免页面直接依赖 mock 文件。
8. API contract 先草拟，待 mock 前端验证后再进入 stable。
9. 后端按照 validated/stable API contract 实现。
10. 每个有意义的任务结束前更新 dev-log、tasks、handoff，必要时更新 decisions。

## Setup Phase Rule
- 当前处于 setup/design 阶段。用户后续说「继续设计」「下一个问题」「继续」时，应继续交互式产品设计流程：先记录上一个答案，再问下一个关键决策问题。
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
- ask_product_question
- fix_verification_failure
- start_next_ready_task
- blocked

## User Confirmation Required
- MVP 范围
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

## UI Acceptance
- 任何用户可见 UI 或交互变化在标记 Done 前都需要用户验收，包括按钮、布局、样式、导航、弹窗、表单、文案、页面状态和交互反馈。
- 内部重构若保持已接受的视觉和交互行为，只需完成验证并记录。
