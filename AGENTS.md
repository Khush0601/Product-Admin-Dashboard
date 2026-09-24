# Agent Documentation

This file is the main entry point for AI assistants working in this repository.
Before making any code, UI, or configuration change, read the project guidance in [agent-docs](agent-docs/).

## Required workflow for every task

Follow this order before and during implementation:

1. Read [AGENTS.md](AGENTS.md) and treat it as the root instruction file.
2. Review [agent-docs/project-overview.md](agent-docs/project-overview.md) to understand the project goals and stack.
3. Follow [agent-docs/coding-standards.md](agent-docs/coding-standards.md) for implementation style and conventions.
4. Apply the App Router rules in [agent-docs/app-router.md](agent-docs/app-router.md).
5. Check [agent-docs/ui-and-accessibility.md](agent-docs/ui-and-accessibility.md) for UI and accessibility expectations.
6. Follow the purple + blue glassmorphism theme in [agent-docs/glassmorphism-theme.md](agent-docs/glassmorphism-theme.md) for all visual work.
7. Validate with the project checks in [agent-docs/validation.md](agent-docs/validation.md).

## Included project guidance

- [agent-docs/project-overview.md](agent-docs/project-overview.md) — repository purpose, stack, and project intent
- [agent-docs/coding-standards.md](agent-docs/coding-standards.md) — coding conventions and code quality rules
- [agent-docs/app-router.md](agent-docs/app-router.md) — Next.js App Router route structure and conventions
- [agent-docs/ui-and-accessibility.md](agent-docs/ui-and-accessibility.md) — UI and accessibility expectations
- [agent-docs/glassmorphism-theme.md](agent-docs/glassmorphism-theme.md) — required purple + blue glassmorphism visual system
- [agent-docs/validation.md](agent-docs/validation.md) — required validation workflow before completion

## Working principle

All changes must be small, readable, and consistent with the current codebase. Do not introduce patterns that are not already used here unless the task clearly demands it. When an AI assistant is asked to perform any task in this repository, it must consult this file and the linked documentation before editing code. Any UI change must follow the purple + blue glass plate theme described in [agent-docs/glassmorphism-theme.md](agent-docs/glassmorphism-theme.md).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
