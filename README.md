# ozb-seller

Seller dashboard for OZB — sellers manage products, orders, finance, shop, marketing, discounts, shipment.
React + Vite + TypeScript. Part of the OZB stack (`ozb-backend`, `ozb-infra`, `ozb-mobile`, `ozb-admin`).

> **How to work in this repo:** read [CLAUDE.md](CLAUDE.md) first (rules + structure, for humans and AI).
> Full standard: `OZB/architecture/standards/web-frontend.md`.

## Quickstart

```bash
cp .env.example .env       # VITE_API_BASE_URL + VITE_ENABLE_MSW
npm install
npm run dev                # http://localhost:5173  (MSW serves mock data, no backend needed)
```

## Scripts

| Command | What |
|---------|------|
| `npm run dev` | Vite dev server (MSW mocks on when `VITE_ENABLE_MSW=true`) |
| `npm run build` | `tsc -b` typecheck + production build |
| `npm run lint` | ESLint (incl. feature-boundary rules) |
| `npm run test` | Vitest |

## Stack

React 19 · Vite 8 · TypeScript 6 (strict) · React Router 7 (lazy routes) · **TanStack Query** (server state) ·
**Zustand** (UI state) · axios · **MSW** (mock layer) · react-i18next (uz/ru/en) · Tailwind v4 (tokens) · Vitest.

## Structure (feature-first)

```
src/
  app/         App · router (lazy) · providers
  features/    products/ … each: api/ components/ hooks/ stores/ types/ index.ts (public API)
  pages/       thin route screens composing features
  components/  ui/ + layout/        lib/ (axios, queryClient)   config/ (env, endpoints)
  i18n/        locales/{uz,ru,en}   styles/ (tokens)   mocks/ (MSW)   utils/ (formatSold, money)   testing/
```

`features/products/` is the reference implementation — clone its shape for new domains. See CLAUDE.md for the rules.

## Git

**Local-only / release-gated.** Deploy target: Cloudflare Pages. Never push or deploy without explicit approval.
# fastfix
