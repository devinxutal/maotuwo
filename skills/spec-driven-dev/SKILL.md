---
name: spec-driven-dev
description: |
  MAOTUWO Spec-Driven Development Workflow. Enforces spec-first development with phases: Spec → Design → Code → Docs → Changelog.
  
  Use this skill when:
  - Starting a new feature or checkpoint development
  - Resuming an interrupted task
  - Writing or reviewing a spec document
  - Updating progress or changelog
  - Following the MAOTUWO development methodology
  
  This skill is MANDATORY for all development work. No implementation code may be written until the spec is finalized and approved.
  
  Example triggers: "开始新功能开发", "我们要开始哪个Checkpoint", "创建spec文档", "查看spec模板"
---

# Spec-Driven Development Workflow

> **CRITICAL**: This workflow is MANDATORY for all development work on MAOTUWO apps.
> No implementation code may be written until the corresponding spec is finalized and approved.

## Phase 0: Resume Check

**Before ANYTHING else:**

1. Read `PROGRESS.md` — check for `⏳` (in-progress) tasks
2. If exists, ask: *"上次任务 [TASK] 正在进行中，是否继续？"*
3. If no active task, ask: *"我们要开始哪个 Checkpoint？"*

## Phase 1: Spec First

Produce a finalized spec before writing code.

1. Identify Checkpoint ID (e.g., `CP-1.1`)
2. Check `specs/CP-X.X-<name>.md` — create if not exists
3. Fill spec with: Purpose, Scope, Interface Contract, Acceptance Criteria, Dependencies
4. **Present to user for confirmation — DO NOT proceed until approved**
5. Update `PROGRESS.md`: mark as `⏳ Spec in review`

## Phase 2: Design

Concrete technical design based on approved spec.

1. Read relevant code/docs
2. Outline: module structure, key components, data flow
3. Document in spec's `## Design` section
4. Update `PROGRESS.md`: mark as `⏳ Design complete`

## Phase 3: Implementation

Write code conforming to spec.

1. Implement per design, reference spec at every step
2. Write unit tests
3. Verify against Acceptance Criteria
4. Update `PROGRESS.md`: mark as `⏳ Implementation complete`

## Phase 4: Docs Update

Update documentation after completion.

1. Update app documentation if needed
2. Add `## Implementation Notes` to spec
3. Update `PROGRESS.md`: mark as `✅ Complete`

## Phase 5: Changelog

Record changes for traceability.

1. Update `CHANGELOG.md`
2. Add entry with CP-ID: `feat(CP-X.X): <description>`
3. Commit with CP-ID reference

## State Machine

```
Phase 0: Resume Check → Phase 1: Spec (get approval)
                       ↓
                   Phase 2: Design
                       ↓
                   Phase 3: Implementation
                       ↓
                   Phase 4: Docs Update
                       ↓
                   Phase 5: Changelog
                       ↓
                   [Checkpoint DONE]
```

## File Locations

| Purpose | Path |
|---|---|
| Spec files | `specs/CP-X.X-<name>.md` |
| Spec template | `references/_spec_template.md` |
| Changelog | `CHANGELOG.md` |
| Progress | `PROGRESS.md` |
