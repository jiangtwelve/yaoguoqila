---
name: agent-project-continuity
description: Create and maintain durable project memory, atomic task documents, and cross-agent handoff workflows for long-running software projects. Use when Codex needs to initialize or continue a project that will span sessions, agents, tools, or coding environments; when a user wants standardized agent development records; or when work should proceed through code-as-design frontend prototypes, mock data, API contracts, backend implementation, verification, and handoff documentation.
---

# Agent Project Continuity

Use this skill to make a software project resumable by any capable agent across sessions and tools. Treat repository documents as the durable memory and chat as temporary working context.

This skill is primarily for bootstrapping or repairing a repository's continuity system. After `AGENTS.md` and `docs/*` are established, normal implementation work should follow the repository documents directly. Do not require this skill to be invoked for every development task; the project should be self-resuming from its own documents.

Treat project design and continuity bootstrapping as a single-session setup phase whenever possible. Use the current Codex session's internal planning/progress tools to track this setup work. Do not create extra persistent design-phase progress files by default; the repository documentation system is primarily for the longer development phase where cross-session and cross-agent handoff matters more.

## Core Principle

Keep one source of truth for each concern:

- `AGENTS.md`: project operating rules for all agents.
- `docs/product.md`: product intent, MVP, user flows, and boundaries.
- `docs/architecture.md`: selected technical stack, system shape, integration boundaries, and run/verification commands.
- `docs/page-map.md`: MVP pages, navigation, page purposes, required features, states, data dependencies, and Design Anchor choice.
- `docs/tasks.md`: task index and status board.
- `docs/tasks/TASK-xxx.md`: atomic implementation instructions.
- `docs/dev-log.md`: what actually happened.
- `docs/handoff.md`: latest resume note for the next agent.
- `docs/decisions/`: durable architectural or product decisions.
- `docs/api.md` or `docs/api/`: API contract drafts and stable contracts.
- `docs/ui.md`: lightweight visual and interaction rules when the running frontend is the design source.

If the project does not have these files, create the minimal set needed for the current work. For reusable templates, read `references/project-memory-templates.md`.

The bootstrapped project must support short resume prompts such as "continue development", "继续开发", "continue yesterday's task", or "继续昨天的任务". `AGENTS.md`, `docs/handoff.md`, and `docs/tasks.md` must contain enough structured state for an agent to infer the next action without the user naming a task.

When the repository already has established continuity documents and the user asks to add a new feature, do not rerun the full setup/design flow by default. Use Feature Expansion mode: read the existing project memory, ask only feature-scoped questions, assess impact, update affected documents, create atomic tasks, and update `docs/handoff.md` to the appropriate next task.

## Document Format

Keep project memory files in Markdown unless there is a strong project-specific reason to use another format. Use Markdown as a human-agent shared document format, but do not rely on free-form prose for critical state.

Use YAML frontmatter for machine-readable state in task, handoff, API, UI, and decision documents. Use structured YAML or JSON blocks for API contracts, design tokens, mock examples, and other schema-like data.

Critical state should be explicit and easy to parse, including:

- task id, status, type, dependencies, and owner if relevant
- whether user acceptance is required
- user acceptance status
- current task and next action
- API contract status
- UI contract status and anchor page
- selected technical stack and page map status
- verification status

If prose and structured metadata conflict, treat the structured metadata as the state to resolve, then update the prose or metadata so they match.

## Development Philosophy

Prefer a running frontend over separate high-fidelity design files:

1. Define product intent and page map.
2. Confirm technical choices before implementation work that depends on them.
3. Build static frontend pages directly as the design source of truth.
4. Iterate visual style and interaction in code while viewing the running app.
5. Use preview fixtures for static page data; do not hard-code business data in page markup/templates.
6. Use mock data and mock services to validate page states and user flows.
7. Abstract components and services after page shape stabilizes and user acceptance allows it.
8. Draft API contracts early enough to guide mock shape, but only stabilize them after the mock frontend proves the real data needs.
9. Implement backend services against the stabilized API contract.
10. Replace mock services with real services while preserving page behavior.

Never make page code import mock data directly when backend replacement is expected. Route data access through a service or adapter layer.

## Intake Workflow

When resuming or starting work:

1. Read `AGENTS.md` if present.
2. Read `docs/product.md`, `docs/architecture.md`, `docs/page-map.md`, `docs/tasks.md`, latest `docs/handoff.md`, and recent `docs/dev-log.md` entries when present.
3. Read the active `docs/tasks/TASK-xxx.md` before coding.
4. Check repository state with `git status`.
5. State the current objective, active task, expected files, and uncertainties before substantial edits.

If the task document conflicts with the current code, trust the current code as reality, then update the task or handoff notes with the discrepancy.

## Short Resume Prompts

When the user asks to continue development without naming a task, use this recovery algorithm:

1. Read `AGENTS.md`.
2. Read `docs/handoff.md` frontmatter and body.
3. Read `docs/tasks.md`.
4. If `handoff.current_task` exists, read that task file first.
5. If no current task is identified, select the first task in `Current`; if none exists, select the first `Ready` task.
6. Follow `handoff.next_action`.
7. If `blocked: true` and the blocker cannot be resolved locally, ask the user only for the missing decision or resource.

Use stable `next_action` values where possible:

- `continue_implementation`: continue coding or documentation work for the current task.
- `wait_for_user_acceptance`: present the manual acceptance checklist; do not continue implementation unless the user asks for changes.
- `ask_product_question`: ask the pending product or workflow question.
- `fix_verification_failure`: inspect and fix the recorded verification failure.
- `start_next_ready_task`: begin the next ready task after reading its task document.
- `blocked`: explain the blocker and the exact input needed.

If `next_action` is missing or ambiguous, infer the safest next action from task status and handoff notes, then update `docs/handoff.md` with a structured `next_action`.

## Product Discovery

During product discussion and early planning, ask the user enough focused questions to confirm product direction before creating detailed implementation tasks. Clarify the target user, core scenario, MVP boundary, page map, priority workflows, data that must be captured, and what should be explicitly out of scope.

Prefer short, concrete questions that reduce downstream ambiguity. Do not over-specify UI, backend, or data models before the product direction is understood.

During the setup/design phase, prefer completing product discovery, technical selection, page map, initial API draft, initial UI constraints, and first task backlog in one continuous session. This preserves coherence across the generated project documents.

## Technical Selection

Before implementation tasks that depend on technology choices, define and confirm the technical direction with the user. Record the current architecture in `docs/architecture.md` and long-lived tradeoffs in `docs/decisions/`.

Clarify the frontend stack, backend approach, database or storage, authentication, deployment or hosting, test strategy, coding language, dependency policy, and platform-specific constraints. For WeChat Mini Program projects, decide whether to use native Mini Program development, Taro, uni-app, cloud development, self-hosted backend services, TypeScript, component libraries, subscription messages, upload/storage, OCR, or scanning only when those choices matter to the project scope.

Do not treat a technology choice as final just because an agent started coding with it. Major choices require user confirmation and a decision record.

## Page Map And Interaction Rules

Before building the Design Anchor or any frontend static prototype, create or update `docs/page-map.md` and ask the user to confirm the page map. The page map should list MVP pages, route/path, purpose, required features, primary interactions, states, data dependencies, navigation relationships, and which page or flow is the Design Anchor.

Do not front-load every minor interaction decision. Confirm global navigation, authentication, data, and workflow rules early when they affect architecture, page structure, data outcomes, or user trust.

For low-risk platform-conventional interactions, choose a sensible default and record it in `docs/ui.md` under interaction rules. For example, a custom back action with no previous page in the stack can navigate to the home page. For interactions that affect product behavior, data results, user trust, or the long-term navigation mental model, ask the user before implementation.

## Task System

Use `docs/tasks.md` as the status board, not as the full development document. Keep detailed instructions in separate atomic task files under `docs/tasks/`.

An atomic task should:

- Fit in one focused session when possible.
- Have clear scope and non-scope.
- Include enough context that a new agent can execute without redesigning the feature.
- Define acceptance criteria and verification.
- Avoid line-by-line code instructions unless the implementation is fragile.

Use task statuses such as `Current`, `Ready`, `Blocked`, and `Done`. Move unfinished discoveries into `Ready` or `Blocked`; do not bury them in chat.

Use these status rules:

- `Ready`: the task has enough product, design, API, and context to start.
- `Current`: the task is actively being implemented.
- `Blocked`: the task cannot continue without user input, missing dependencies, or an external tool/state change; record the blocker and next unblock action.
- `Done`: implementation, verification, documentation updates, and required user acceptance are complete.

Do not mark a frontend prototype, Design Anchor, or Design Extension task as `Done` until the user has personally accepted the scoped visual and interaction checklist. If implementation is complete but acceptance is pending, leave the task as `Current` or mark it explicitly as `Pending user acceptance`.

Place new feature tasks by dependency and product priority, not by creation time:

- If the feature blocks current work or changes a dependency for current/future tasks, insert it before or alongside the affected task and mark blocked tasks with `blocked_by`.
- If it belongs to an already completed module but does not block current work, place it as a `Ready` task near that module's task group without interrupting the current task.
- If it is non-MVP, low priority, or optional polish, place it in `Backlog`.

Before inserting a new feature, assess whether it affects current work, later page design, UI contract, API contract, backend behavior, data model, navigation, or already accepted user flows.

## Code-As-Design Frontend Flow

For product UI work, follow this order unless the user explicitly chooses another:

1. Product direction.
2. Technical selection.
3. Confirmed page map.
4. Static frontend prototype implemented in the real frontend stack.
5. Preview fixtures for static page data, kept separate from page markup/templates.
6. Visual and interaction iteration in code.
7. Mock data and mock service layer covering normal, empty, loading, error, edge, and permission states where relevant.
8. Component extraction only after repeated patterns are clear and user acceptance allows it.
9. API contract revision based on what the validated frontend actually uses.
10. Backend implementation.
11. Frontend service replacement and integration verification.

For WeChat Mini Program projects, account for small screens, scroll behavior, safe areas, native component constraints, and WeChat Developer Tools verification when available.

When building or refining static frontend pages, prefer using the `frontend-design` skill if it is installed and available. Use it for page aesthetics, layout quality, component polish, and avoiding generic frontend output. If `frontend-design` is not installed or cannot be loaded, continue with the default frontend development flow instead of blocking the task. Record the fallback in `docs/dev-log.md` or `docs/handoff.md` when it affects design quality or verification.

Frontend prototype acceptance must include both visual quality and interaction behavior. Interactions include navigation, dialogs, drawers, forms, tabs, filters, empty states, loading states, error states, and any tap/click-driven state changes included in the task scope.

A frontend prototype is not accepted until the user personally confirms it. Automated checks, screenshots, local previews, and agent review can prepare the prototype for review, but they cannot mark frontend acceptance as passed. Before asking for user acceptance, provide a concise manual acceptance checklist covering the visible UI and scoped interactions.

Any user-visible UI or interaction change requires user acceptance before the task can be marked `Done`. This includes new buttons, changed layout, style adjustments, navigation changes, dialogs, form behavior, visible copy changes, empty/loading/error states, and interaction feedback.

Internal refactors that preserve accepted visual and interaction behavior do not require user acceptance, but they must be verified. Batch related UI changes into one acceptance checklist per task. Acceptance should cover the changed scope and obvious regressions, not require re-accepting the entire app unless the change is global.

## Design Continuity

For multi-page frontend work, split prototype development into two modes:

- `Design Anchor`: the first core page or flow that explores and establishes the product's visual direction.
- `Design Extension`: later pages or flows that extend the accepted visual direction instead of redesigning it.

After the user accepts a Design Anchor, update `docs/ui.md` with the accepted visual system and record the anchor page path. Include colors, typography, spacing, component patterns, list density, form patterns, interaction behavior, copy tone, and explicit "do not" rules where useful.

For every Design Extension task:

1. Read `docs/ui.md`.
2. Inspect the accepted anchor page source.
3. Inspect existing shared components.
4. Reuse existing base components before creating new ones.
5. Extend local UI patterns only when the new page genuinely needs them.
6. Update `docs/ui.md` when a reusable local pattern is added.

Do not introduce a new global visual direction, color palette, typography system, card/list/button/form style, or motion language in a Design Extension without user confirmation. If a later page reveals that the anchor system is insufficient, propose a focused UI contract update and ask the user to confirm the global change.

## API Contract Rules

Create an API contract draft before mock-driven frontend work when backend integration is expected. Keep it light at first:

- Resource models and field names.
- Example request and response shapes.
- Mock examples.
- Known open questions.
- Contract status: `draft`, `validated`, `stable`, or `deprecated`.

After the mock frontend is usable, update the contract to match the actual page and service needs. Backend work should use the validated or stable contract, not an earlier guess.

Use these contract statuses:

- `draft`: initial resource and response shape before or during frontend prototype work.
- `validated`: mock frontend is usable and the fields have been exercised by real page flows.
- `stable`: backend implementation and frontend integration have both passed verification.
- `deprecated`: no longer preferred, but temporarily retained for compatibility.

Before moving an API contract to `stable`, ask the user to confirm if the API affects long-lived product behavior, backend architecture, or future task planning. After `stable`, changes require a recorded decision or API change note.

## Mock And Service Rules

Static frontend prototypes may use lightweight preview fixtures to make the page look real before a full mock service exists. Preview fixtures serve visual design and state demonstration; mock services simulate future backend behavior and user operations.

Do not place business data directly inside WXML, JSX, HTML, or template markup except for trivial labels or static UI copy. Keep representative item/user/domain data in fixtures, constants, or service adapters so states can be changed without rewriting markup.

Mock data should be deterministic unless the task explicitly needs randomized data. Cover representative normal, empty, loading, error, edge, and permission states where relevant.

Keep pages dependent on service functions or adapters, not raw mock files. Prefer a structure where page code calls a stable service API and the service delegates to either mock or real adapters. Backend integration should primarily replace or reconfigure the adapter, not rewrite page behavior.

## Component Extraction

Do not extract a general component library before the frontend direction is accepted. After the user confirms a frontend prototype or Design Anchor, extract base components that preserve the accepted visual style.

Extract when:

- The same UI pattern appears in two or more places.
- A base control is needed for design continuity, such as buttons, cards, badges, empty states, page headers, list rows, form fields, or dialogs.
- Backend integration or future pages would otherwise duplicate visual behavior.

Component extraction must not change the accepted page appearance unless the user approves the visual change. Record new reusable UI patterns in `docs/ui.md`.

If component extraction is not part of the accepted frontend task scope, create a follow-up task for it instead of expanding the current task silently.

## Execution Rules

During implementation:

- Read existing patterns before adding new structures.
- Keep changes inside the active task scope.
- Prefer small, verifiable increments.
- Add abstractions only after real repetition or replacement needs appear.
- Record important decisions in `docs/decisions/`, not only in `dev-log.md`.
- If scope expands, create or update a task instead of silently doing unrelated work.

Ask for user confirmation before decisions that affect long-term direction, including MVP scope, the first accepted Design Anchor, global UI direction changes, stable API contracts, backend technology choices, major data model changes, and release or publishing actions.

## Documentation Maintenance

Keep documentation useful, not ceremonial:

- Update `docs/tasks.md`, `docs/dev-log.md`, and `docs/handoff.md` at the end of every meaningful task.
- Update `docs/product.md`, `docs/ui.md`, `docs/api.md`, and `docs/decisions/` only when their source of truth changes.
- Keep `docs/handoff.md` focused on the latest resume state; put historical detail in `docs/dev-log.md`.
- Mark finished tasks in `docs/tasks.md`; archive or summarize old task files when they stop helping active development.

## Verification And Handoff

Before ending a task:

1. Run the relevant build, test, lint, preview, or manual verification available in the project.
2. Update `docs/dev-log.md` with goal, changes, verification, and gaps.
3. Update `docs/tasks.md` and the active task file status.
4. Update `docs/handoff.md` with current state, next step, key files, and cautions.
5. Add or update decision records when a long-lived product, architecture, API, or workflow choice was made.

If verification cannot be completed, record exactly what was not verified and why.

End each handoff with a clear next action: continue implementation, wait for user acceptance, ask a product question, fix verification failure, or start the next ready task.
