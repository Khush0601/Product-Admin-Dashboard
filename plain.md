# Product Admin Dashboard Plan

## 1. Project Goal

Build a simple product administration dashboard where authenticated users can:

- Sign in and sign out.
- View products in a responsive table or card layout.
- Search, filter, sort, and paginate products.
- Add, edit, and delete products.
- See clear loading, empty, error, and not-found states.
- Deploy the application to Vercel.

The project should stay lightweight, readable, and easy to maintain.

## 2. Technology Plan

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Axios for API requests
- Lucide React for icons
- DummyJSON as the default product API
- Local browser storage for authentication and local product overrides
- Vercel for deployment

## 3. Application Structure

- `app/` contains routes, layouts, global styles, and route-level states.
- `components/` contains reusable UI components.
- `context/` contains authentication state.
- `hooks/` contains reusable React hooks.
- `lib/` contains API, authentication, and local product logic.
- `public/` contains static assets.

## 4. Implementation Phases

### Phase 1: Application Shell

- Configure the root layout and metadata.
- Define the visual theme and responsive page structure.
- Add shared loading, error, empty, and not-found experiences.

### Phase 2: Authentication

- Build the login page.
- Store the authenticated user and token in browser storage.
- Protect product routes with `AuthGuard`.
- Handle expired or invalid sessions.

### Phase 3: Product Catalog

- Load products and categories from the API.
- Add search, category filtering, sorting, and pagination.
- Keep query state in the URL so catalog views can be refreshed and shared.
- Provide responsive table and card presentations.

### Phase 4: Product Management

- Add a reusable product form.
- Create add-product and edit-product routes.
- Validate required fields and numeric values.
- Confirm destructive delete actions.
- Preserve local product changes when the remote API does not persist them.

### Phase 5: Quality and Accessibility

- Keep controls keyboard accessible.
- Use semantic headings, labels, buttons, and status regions.
- Verify mobile and desktop layouts.
- Test loading, error, empty, authentication, filtering, and pagination states.
- Run lint and production builds before merging changes.

### Phase 6: Deployment

- Push the project to GitHub.
- Import the repository into Vercel.
- Configure `NEXT_PUBLIC_API_BASE_URL` when using a custom API.
- Run a production smoke test after deployment.
- Confirm login, catalog loading, product forms, pagination, and error states in the deployed app.

## 5. Development Workflow

1. Define the user-facing behavior.
2. Find the smallest existing component or route responsible for it.
3. Make a focused change that follows the current project patterns.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Manually verify the affected route in the browser.
7. Commit only the related changes.

## 6. Success Criteria

The project is ready when:

- Users can complete the main product workflows without errors.
- URL-based catalog state survives refresh and browser navigation.
- Every async workflow has a useful loading and error state.
- The interface remains readable on mobile and desktop.
- No new lint or TypeScript build errors are introduced.
- The application deploys successfully on Vercel.
