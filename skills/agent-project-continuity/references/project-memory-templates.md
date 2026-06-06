# Project Memory Templates

Use these templates when initializing or repairing project continuity documents. Keep them concise and adapt them to the repository.

## Minimal File Set

```text
AGENTS.md
docs/
├── product.md
├── architecture.md
├── page-map.md
├── ui.md
├── api.md
├── tasks.md
├── tasks/
│   └── TASK-001-example.md
├── dev-log.md
├── handoff.md
└── decisions/
    └── 001-example.md
```

## AGENTS.md

```markdown
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

## Default Development Flow
1. Confirm product direction.
2. Confirm technical selection and record it in docs/architecture.md and decisions.
3. Confirm docs/page-map.md before Design Anchor implementation.
4. Use the running frontend as the design source of truth.
5. Prefer the `frontend-design` skill for static frontend pages when available; otherwise continue with default frontend development.
6. Use preview fixtures for static page data; do not hard-code business data in markup/templates.
7. Build frontend pages before backend services unless the task says otherwise.
8. Use mock data through service/adapters, not direct page imports.
9. Draft API contracts early, then stabilize them after mock frontend validation.
10. Implement backend against validated API contracts.
11. Update dev-log, tasks, handoff, and decisions before ending work.

## Setup Phase Rule
Complete project setup/design in one continuous session whenever possible: product direction, technical selection, page map, initial API draft, initial UI constraints, and first task backlog. Use the current agent session's internal plan for setup progress. Do not add extra persistent setup-progress files unless the user explicitly asks for them; repository handoff docs are primarily for the longer development phase.

## Short Resume Prompts
When the user says "continue development", "继续开发", "continue yesterday's task", "继续昨天的任务", or similar:
1. Read docs/handoff.md frontmatter and body.
2. Read docs/tasks.md.
3. If handoff.current_task exists, read that TASK file first.
4. If no current task is identified, select the first task in Current, then Ready.
5. Follow handoff.next_action.
6. If blocked is true and cannot be resolved locally, ask the user only for the missing decision or resource.

Supported next_action values:
- continue_implementation
- wait_for_user_acceptance
- ask_product_question
- fix_verification_failure
- start_next_ready_task
- blocked

## User Confirmation Required
- MVP scope
- Technical selection
- Page map before Design Anchor implementation
- First accepted Design Anchor
- Global UI direction changes
- Stable API contracts when they affect long-term behavior
- Backend technology choices
- Major data model changes
- Release or publishing actions

## Scope Rules
- Follow the active TASK document.
- Record out-of-scope discoveries as new tasks.
- Do not rewrite unrelated code or decisions without user approval.

## Feature Expansion
For an established project, do not rerun full setup when adding a feature. Read existing docs, ask feature-scoped questions, assess impact, update affected docs only, create atomic tasks, and update handoff.

Place new feature tasks by dependency and priority:
- Blocking dependency: insert before or alongside affected tasks and mark blocked tasks.
- Completed-module enhancement: add as Ready near that module without interrupting current work.
- Optional/non-MVP polish: add to Backlog.

## UI Acceptance
Any user-visible UI or interaction change requires user acceptance before Done. This includes buttons, layout, style, navigation, dialogs, forms, visible copy, page states, and interaction feedback. Internal refactors that preserve accepted visual and interaction behavior need verification, not user acceptance.
```

## docs/product.md

```markdown
---
status: draft
updated: YYYY-MM-DD
---

# Product

## Product Direction Questions
- Target user:
- Core scenario:
- MVP goal:
- Main pages:
- Priority workflows:
- Required data:
- Explicitly out of scope:
- Open questions:
```

## docs/architecture.md

```markdown
---
status: draft
frontend_stack: ""
backend_stack: ""
database: ""
auth: ""
deployment: ""
updated: YYYY-MM-DD
---

# Architecture

## Technical Selection
- Frontend:
- Backend:
- Database / storage:
- Authentication:
- Deployment / hosting:
- Test strategy:
- Language:
- Dependency policy:

## Platform Constraints
- 

## Run And Verify
- Dev:
- Build:
- Test:
- Preview:

## Open Questions
- 
```

## docs/page-map.md

```markdown
---
status: draft
design_anchor: ""
requires_user_acceptance: true
acceptance_status: pending
updated: YYYY-MM-DD
---

# Page Map

## Global Navigation
- Entry:
- Tabbar / stack:
- Back behavior:

## MVP Pages

### Page Name / route/path
- Purpose:
- Required features:
- Primary interactions:
- States:
- Data dependencies:
- Entry points:
- Destination links:
- Design role: Design Anchor | Design Extension

## Out Of Scope Pages
- 

## Open Questions
- 
```

## docs/ui.md

```markdown
---
status: draft
design_mode: design-anchor
anchor_page: ""
requires_user_acceptance: true
acceptance_status: pending
updated: YYYY-MM-DD
---

# UI Contract

Status: draft
Design mode: Design Anchor | Design Extension
Anchor page:

## Visual Direction

## Colors
- Primary:
- Warning:
- Danger:
- Background:
- Surface:
- Text primary:
- Text secondary:

## Typography
- Page title:
- Section title:
- Body:
- Caption:
- Emphasis:

## Spacing
- Page padding:
- Section gap:
- Card padding:
- List item gap:

## Components
### Buttons

### Cards

### Lists

### Forms

### Empty / Loading / Error States

## Interaction
- Tap feedback:
- Navigation:
- Back behavior: if a custom back action has no previous page in the stack, navigate to the home page unless the task defines a different rule.
- Dialogs / drawers:
- Form validation:
- Low-risk platform-conventional interactions may use sensible defaults and be recorded here.
- Product behavior, data outcomes, trust-sensitive interactions, and global navigation changes require user confirmation.

## Copy Tone

## Do Not
- Do not introduce a new global visual direction without user confirmation.
```

## docs/tasks.md

```markdown
# Tasks

## Current
- [ ] TASK-001 Create running frontend prototype

## Pending User Acceptance
- [ ] TASK-004 Review accepted visual and interaction checklist

## Ready
- [ ] TASK-002 Add mock service layer

## Blocked
- [ ] TASK-003 Implement backend reminders
  - Blocked by: reminder strategy not validated

## Backlog
- [ ] TASK-009 Optional polish task

## Done
- [x] TASK-000 Initialize project memory docs
```

## docs/tasks/TASK-xxx.md

```markdown
---
id: TASK-001
title: Create running frontend prototype
status: current
type: frontend-prototype
module: home
priority: high
design_mode: design-anchor
page_map_status: accepted
depends_on: []
blocked_by: []
blocks: []
requires_user_acceptance: true
acceptance_status: pending
verification_status: pending
updated: YYYY-MM-DD
---

# TASK-001 Create running frontend prototype

Status: Current

## Goal
Build the first runnable frontend page as the design source of truth.

## Scope
- Page layout
- Representative static content
- Key UI states
- Basic navigation or interaction needed to judge the design

## Out Of Scope
- Backend integration
- Persistent storage
- Final API stabilization

## Context
- Product basis: docs/product.md
- Technical basis: docs/architecture.md
- Page map: docs/page-map.md
- UI rules: docs/ui.md
- API draft: docs/api.md

## Design Continuity
- Mode: Design Anchor | Design Extension
- Anchor page:
- Shared components to inspect:
- Existing UI patterns to reuse:
- New UI patterns introduced:

## Implementation Steps
1. Inspect the existing frontend structure.
2. Read docs/architecture.md and docs/page-map.md.
3. Read docs/ui.md and inspect the anchor page when this is a Design Extension.
4. Create or update the target page.
5. Add representative preview fixtures for static page data; keep them separate from markup/templates.
6. Render normal, empty, and edge states when relevant.
7. Adjust spacing, hierarchy, copy, and interaction in code.
8. Record low-risk default interactions in docs/ui.md; ask the user about high-impact interactions.
9. Update docs/ui.md if this task establishes or extends reusable UI patterns.
10. Verify the page in the available local preview environment.

## Acceptance Criteria
- Page runs in the project environment.
- Page is usable as the current visual reference.
- Preview fixtures or mock data cover the required states.
- Business data is not hard-coded directly in page markup/templates.
- No direct page dependency on raw mock files when a service layer is expected.
- Design Extension pages follow docs/ui.md and the accepted anchor page.
- Existing shared components are reused where appropriate, or the exception is documented.
- Base components extracted after user acceptance preserve the accepted page appearance.
- Frontend task is not marked Done until user acceptance is complete.
- Any user-visible UI or interaction change has a scoped user acceptance checklist.

## Manual User Acceptance Checklist
- [ ] User confirms the visual layout and style.
- [ ] User confirms the page is consistent with the accepted UI direction.
- [ ] User confirms primary navigation works.
- [ ] User confirms scoped dialogs, forms, tabs, filters, or other interactions work.
- [ ] User confirms normal, empty, and edge states are acceptable.
- [ ] User confirms this task's visible changes did not introduce obvious regressions.

## Verification
- Command or tool:
- Result:
- Not verified:
- User acceptance: pending

## Documentation Updates
- docs/tasks.md:
- docs/dev-log.md:
- docs/handoff.md:
- docs/ui.md, docs/api.md, or docs/decisions/ if changed:

## After User Acceptance
- Extract base components when repeated patterns are clear and extraction is in scope.
- Otherwise create a follow-up component extraction task.
- Mark the task Done only after implementation, verification, documentation updates, and user acceptance are complete.

## Notes
```

## docs/dev-log.md

```markdown
# Development Log

## YYYY-MM-DD

Goal:

Changes:
- 

Verification:
- 

Decisions:
- 

Gaps / Next:
- 
```

## docs/handoff.md

```markdown
---
updated: YYYY-MM-DD
current_task: TASK-001
next_action: wait_for_user_acceptance
blocked: false
blocker: ""
---

# Handoff

Updated: YYYY-MM-DD

## Current State

## Next Step

## Pending User Input
- 

## Key Files
- 

## Cautions
- 

## Verification Status
- 

## Resume Rule
If `next_action` is `wait_for_user_acceptance`, present the current task's manual acceptance checklist and do not continue implementation unless the user asks for changes.
```

## docs/api.md

````markdown
---
status: draft
version: "0.1"
updated: YYYY-MM-DD
---

# API Contract

Status: draft

## Status Rules
- draft: initial resource and response shape before or during frontend prototype work.
- validated: mock frontend is usable and fields have been exercised by real page flows.
- stable: backend implementation and frontend integration have passed verification.
- deprecated: no longer preferred, but temporarily retained for compatibility.

## Resource: Item

```json
{
  "id": "item_001",
  "name": "Milk",
  "expireDate": "2026-06-20",
  "quantity": 1,
  "unit": "box",
  "createdAt": "2026-06-06T10:00:00+08:00",
  "updatedAt": "2026-06-06T10:00:00+08:00"
}
```

## GET /items

Purpose:

Request:

Response:

Open questions:
- 
````

## docs/decisions/001-example.md

```markdown
---
id: 001
status: accepted
date: YYYY-MM-DD
---

# 001 Example Decision

Date: YYYY-MM-DD

## Context

## Decision

## Alternatives Considered

## Consequences
```
