# Project Overview

This repository is a small Next.js dashboard application built with the App Router. It is a lightweight product admin panel with minimal route structure and intentionally simple implementation patterns.

## Current stack

- Next.js 16.3.6
- React 19
- TypeScript 5
- Tailwind CSS v4
- ESLint 9

## Current app structure

- app/page.tsx — landing page
- app/login/page.tsx — login page
- app/product/page.tsx — product page
- app/layout.tsx — root layout and global metadata
- app/globals.css — global styling and Tailwind setup

## Product expectations

This project should remain:
- simple
- maintainable
- easy to read
- aligned with the existing App Router conventions
- free of unnecessary complexity

## Design intent

The app is a minimal dashboard shell rather than a complex enterprise product architecture. New code should reflect that lightweight design philosophy.

## Non-goals

- Do not introduce unnecessary state management
- Do not add a large component library
- Do not create elaborate page abstraction layers
- Do not restructure the project for the sake of style alone
