# App Router Conventions

This project uses the Next.js App Router. Follow the existing structure and conventions exactly.

## Route structure

- The route root is app/
- Each page is a file named page.tsx inside a route folder
- The route path matches the folder name

Examples:
- app/page.tsx -> /
- app/login/page.tsx -> /login
- app/product/page.tsx -> /product

## Page conventions

- Each page is a React component.
- Each page should use a default export.
- Keep each page focused on its route’s requirement.
- Do not create unnecessary layout nesting unless explicitly required.

## Root layout

- app/layout.tsx is the global wrapper.
- It should remain the central metadata and font configuration point.
- Do not disrupt the existing root layout without a clear reason.

## Server component defaults

- Prefer server components by default.
- Only use client-side features when truly needed.
- Avoid adding interactivity without a valid reason.

## Route safety rules

- Do not rename route folders casually.
- Do not move a page out of the App Router convention.
- Do not add route groups or complex nested layouts unless the task clearly requires them.
- Maintain project clarity and route readability.
