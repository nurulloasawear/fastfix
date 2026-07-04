# ozb-seller — working guide (AI + humans)

Seller dashboard (sellers manage products, orders, finance, shop, marketing). React + Vite web.
Full standard: `OZB/architecture/standards/web-frontend.md` (internal workspace).
**Structurally identical to `ozb-admin`** — a dev must move between them with zero friction.

## How to work here

1. **Build to the standard** — feature-first, enforced boundaries. Don't grow a flat `pages/`+`services/` blob.
2. **You own every committed line** — read AI output, run it, handle loading/empty/error/401.
3. **Done =** `npm run build` passes · ran in browser · no `console.log`/leftovers · tests for logic · one styling system.
4. Pin **exact latest-stable** deps — never `"latest"`. Commit the lockfile.

## Stack

React 19 · Vite 8 · TS 6 (strict) · React Router 7 (lazy) · **TanStack Query** (server state) · **Zustand** (UI state) ·
axios (one instance) · **MSW** (mocks) · react-i18next (uz/ru/en) · Tailwind v4 (tokens) · Vitest + Testing Library · `@/` alias.

## Structure

```
src/
  app/         App.tsx · router.tsx (ALL routes lazy) · providers.tsx
  features/    products/ (reference) — api/ (axios + Query hooks) · components/ · hooks/ · stores/ (Zustand) · types/ · index.ts
  pages/       thin route screens (~50 lines) composing features
  components/  ui/ + layout/      lib/ config/(env.ts) i18n/ styles/ mocks/ utils/ testing/
```

## The rules (enforced)

- **Unidirectional deps:** shared → features → pages → app. **Features never import each other** — compose at page level.
- **Intra-feature imports are RELATIVE** (`./api/...`); **cross-feature/shared use `@/`**; import another feature only via `@/features/<name>` (its `index.ts`). ESLint `no-restricted-imports` enforces this.
- **Server state = TanStack Query; client state = Zustand.** No `useEffect`+`useState` data fetching, no fake `setTimeout` loaders.
- **Thin pages, fat features**, ≤150 lines/file. **Lazy-load routes.**
- **One styling system** = Tailwind v4 + `@theme` tokens in `styles/tokens.css`. Brand colors are **tokens** (`bg-brand`), never a hacked palette override.
- **Mocks via MSW** (`src/mocks/`) at the network boundary — never `if(USE_MOCK)` inside services. Mock data must be internally consistent (summary derived from the list).
- **Env read once** in `config/env.ts`; nothing else touches `import.meta.env`.

## Build / run / deploy

```bash
cp .env.example .env && npm install
npm run dev        # MSW mocks on → no backend needed
npm run build      # tsc -b + vite build      npm run lint      npm run test
```

**Local-only / release-gated** (Cloudflare Pages). Never push or deploy without explicit approval.

## Adding a feature

Copy the shape of `features/products/`: `types/` → `api/` (`.api.ts` + `.queries.ts`) → `stores/` → `components/` →
`index.ts` (public API) → thin `pages/<x>/<X>Page.tsx` → MSW handler in `src/mocks/handlers.ts`. Add a Vitest test for any real logic.
