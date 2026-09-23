# Validation and Review Workflow

Before finishing a task, verify the smallest relevant project check.

## Required validation

Run:
- npm run lint
- npm run build

If the task is route-specific, also manually confirm the relevant page loads correctly and does not show runtime errors.

## What to verify

- the code compiles
- the route still renders
- no linting issue was introduced
- no unrelated files were changed
- the work matches the existing project pattern

## Completion standard

A task is not complete until:
- the relevant validation command passes, or the reason for not running it is clearly documented
- the change is scoped to the requested issue
- the final output is consistent with the project’s minimal App Router structure
