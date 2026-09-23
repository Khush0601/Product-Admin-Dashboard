# Coding Standards

These standards apply to all AI-generated and human-generated code in this project.

## General rules

- Prefer simple and direct solutions.
- Keep code readable and easy to follow.
- Avoid abstraction for abstraction’s sake.
- Match the existing style of the project before inventing new conventions.
- Keep changes scoped to the task.

## TypeScript expectations

- Use TypeScript consistently.
- Prefer clear, explicit naming for variables and functions.
- Avoid unnecessary type complexity.
- Use proper return types only when they clarify the code.

## Component conventions

- Use function components.
- Prefer default export for page components.
- Keep components small and focused.
- Do not add unnecessary wrappers or helper components unless they clearly improve clarity.

## Naming

- Use PascalCase for component names.
- Use camelCase for variables and functions.
- Use lowercase folder names for route segments.
- Keep file names descriptive and aligned with route purpose.

## File conventions

- Keep route files under app/<route>/page.tsx.
- Keep global style rules in app/globals.css.
- Avoid creating extra config files or project-level structure unless the task demands them.
- Preserve the current minimal structure.

## Implementation principles

- Favor the same coding style shown in the existing pages.
- Do not over-engineer.
- Do not add hidden complexity or “future-proofing” patterns that are not used in the repo.
- Keep the project maintainable and consistent for future contributors.
