# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (port 8080)
npm run build        # Production build
npm run build:dev    # Development mode build
npm run lint         # ESLint check
npm run test         # Run tests once (vitest run)
npm run test:watch   # Run tests in watch mode (vitest)
```

To run a single test file:
```bash
npx vitest run src/test/example.test.ts
```

Tests use Vitest with jsdom environment and `@testing-library/react`. Test files go in `src/` with `*.test.ts` or `*.spec.ts` extensions. Global test APIs (describe, it, expect) are available without imports. Setup file at `src/test/setup.ts` provides `@testing-library/jest-dom` matchers and polyfills `window.matchMedia`.

## Architecture

**React SPA** built with Vite + TypeScript + Tailwind CSS + shadcn/ui, using Supabase as the backend.

### Provider Stack (App.tsx)

`QueryClientProvider` > `AuthProvider` > `TooltipProvider` > `BrowserRouter`

All routes except `/auth` are wrapped in `ProtectedRoute`, which redirects unauthenticated users to `/auth`.

### Key Layers

- **Pages** (`src/pages/`): Smart components that own data fetching and mutations. Routes: `/` (dashboard), `/recipes`, `/search`, `/meal-plan`, `/shopping`, `/ingredients`, `/auth`.
- **Components** (`src/components/`): Presentational components (RecipeCard, RecipeDetail, ShoppingItem, Navbar, NavLink).
- **UI primitives** (`src/components/ui/`): shadcn/ui library built on Radix UI. Auto-generated via shadcn CLI — edit with caution.
- **Hooks** (`src/hooks/`): `useAuth` (Supabase auth context), `use-toast` (toast notifications), `use-mobile` (responsive breakpoint detection).

### Data Layer

- **Supabase client**: Initialized in `src/integrations/supabase/client.ts`. Import as `import { supabase } from "@/integrations/supabase/client"`.
- **Database types**: Auto-generated in `src/integrations/supabase/types.ts` — do not edit manually.
- **Server state**: TanStack React Query manages all async data. Mutations use `invalidateQueries` for cache updates.
- **Auth**: Google OAuth via `@lovable.dev/cloud-auth-js`, session persisted in localStorage with auto-refresh.

### Database Tables

`recipes`, `recipe_ingredients`, `meal_plan`, `shopping_list`, `ingredient_bank`, `stores` — all scoped to `user_id`.

### Supabase Edge Functions

Deno-based serverless functions in `supabase/functions/`:
- `search-recipes`: AI-powered recipe search using Gemini via Lovable AI Gateway.
- `analyze-nutrition`: Vision-based nutrition label reader.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json and vite.config.ts).

### TypeScript Config

Strict mode is relaxed: `noImplicitAny: false`, `strictNullChecks: false`, `noUnusedLocals: false`, `noUnusedParameters: false`. The ESLint rule `@typescript-eslint/no-unused-vars` is also off.
