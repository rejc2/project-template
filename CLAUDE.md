# Project Guide

## Repo layout

Yarn v4 workspaces monorepo.

| Path                              | Package                                    | Purpose                   |
| --------------------------------- | ------------------------------------------ | ------------------------- |
| `apps/web/`                       | `@rejc2/project-template-web`              | React SPA (the main app)  |
| `packages/eslint-config/`         | `@rejc2/project-template-eslint-config`    | Shared ESLint flat config |
| `test-packages/playwright-tests/` | `@rejc2/project-template-playwright-tests` | E2E tests                 |
| `package.json`                    | `@rejc2/project-template-monorepo`         | Root — workspace scripts  |
| `prettier.config.js`              | —                                          | Shared Prettier config    |

## Web app — `apps/web`

**Stack:** Vite 7 · React 19 · MUI v7 (Material UI + Emotion) · React Router v7 · TanStack React Query v5 · Zustand v5 · Zod v4 · Temporal polyfill

**Path alias:** `@` → `apps/web/src/`

### `src/` structure

| Path             | Purpose                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------- |
| `App.tsx`        | Root — mounts all providers (QueryClient, ThemeProvider, ErrorBoundary, RouterProvider) |
| `routes.tsx`     | Route definitions (see Routes below)                                                    |
| `theme.ts`       | MUI theme customisation                                                                 |
| `polyfills.ts`   | Temporal polyfill initialisation                                                        |
| `testRoutes.tsx` | Dev-only routes (e.g. `/test-error`)                                                    |
| `api/`           | API clients + React Query hooks                                                         |
| `components/`    | Shared/layout components                                                                |
| `pages/`         | Route-level page components                                                             |
| `state/`         | Zustand stores                                                                          |
| `mocks/`         | MSW setup (browser service worker + Node server for tests)                              |

### Routes

| Path          | Component        | Notes                                     |
| ------------- | ---------------- | ----------------------------------------- |
| `/`           | `pages/HomePage` | No layout wrapper                         |
| `/test-error` | —                | Dev only, throws to test error boundaries |

New routes are added to `src/routes.tsx`. Pages for the routes are created in src/pages, with a component name ending in `Page`, either as a single file named after the component name, or a folder named after the component with an `index.tsx` file.

### API layer pattern

Each API domain lives in `src/api/<name>/` and follows this structure:

- `<name>-api.ts` — raw `fetch` functions + exported query key factory
- `<name>-api-hooks.ts` — TanStack Query hooks wrapping the fetch functions
- `<name>-api-schemas.ts` / `<name>-api-types.ts` — Zod schemas and inferred types
- `testing/` — MSW request handlers + mock data (used in Vitest tests only)

One API domain currently exists, as an example:

- `api/books-example/` — example internal API pattern, fully mocked with MSW

### State — `src/state/`

- `SavedKeysExample.ts` — Zustand store (persisted to `localStorage` key `saved-keys-example`); tracks saved keys, as an example store.

### Mocks — `src/mocks/`

MSW v2. `handlers.ts` aggregates all domain handlers. `setup.ts` is the Vitest setup file (configured in `vite.config.ts`). Unhandled requests **error** in tests.

## Common commands

Run from repo root (runs across all workspaces) or from `apps/web/`:

```bash
# Dev
yarn workspace @rejc2/project-template-web dev     # start dev server :5173

# Quality
yarn test          # vitest run (all workspaces)
yarn typecheck     # tsc --noEmit (all workspaces)
yarn lint          # eslint (all workspaces)
yarn lint:strict   # eslint --max-warnings 0
yarn format        # prettier --write

# E2E (from test-packages/playwright-tests/)
yarn playwright            # headless
yarn playwright:headed     # headed
yarn playwright:ui         # Playwright UI mode
```

Playwright auto-starts the Vite dev server; targets Chromium + mobile Chrome (Pixel 7).
