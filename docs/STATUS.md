# ozb-seller — Build Status

Last updated 2026-06-17. Seller web portal for OZB live-commerce. **Phases 0–5 wired to the real
`ozb-backend` (deployed to prod); MSW mirrors every wired route so dev runs without a server.** Remaining
domains are still MSW-only (see Built/not-yet below + [api-contract.md](api-contract.md)). build + lint + 3 tests green on `main`.

## Stack
React 19 · Vite 8 · TS 6 (strict) · React Router 7 (lazy routes) · TanStack Query 5 · Zustand 5 ·
axios · MSW 2 · react-i18next (uz/ru/en) · Tailwind v4 (Zenith tokens). 14 features · ~104 pages.

## Design system — Zenith (Untitled UI + OZB brand)
Brand brown `#2d201c`, yellow accent `#fdd400`, Poppins, pill buttons, Untitled-UI grays.
Tokens: `src/styles/tokens.css`. Shared kit: `src/components/ui/` (Page, PageHeader, Button, Badge, Card,
Tabs, Table/Th/Tr/Td, Input, Select, Textarea, Modal, EmptyState, StatCard, Pagination, Spinner).
Consistency rules: [ui-guidelines.md](ui-guidelines.md). Sourced from the Zenith Figma via Figma MCP.

## Information architecture — Shopee Seller Centre (10 sections + Home)
Built from `Data Room/Shopee Seller Centre` (118 screenshots + build docs → `OZB/architecture/FE/seller-portal/`).
Sidebar order: **Home · Order Management · Products · Marketing Centre · Customer Service · Finance ·
Business Insights · Shop · Live & Video · Account Health · Shop Settings.** (Invented prototype domains
channels/growth/content/customers were dropped.)

## Per-section fidelity
| Section | Pages | State |
|---------|-------|-------|
| Order Management | My Orders (tabs) · detail · Mass Ship · Returns(+detail) | full UI |
| Products | hub (status tabs) · create wizard · edit · AI Optimiser (Coming-Soon) | full UI |
| Marketing | overview · ads · creators · discount(+bundle/addon) · flash-deals · vouchers(8-type) · campaigns · review-prize | full UI |
| Customer Service | chat · auto-reply · shortcuts · FAQ(+dashboard) · reviews | full UI |
| Finance | income(+statements) · balance(+transaction) · bank-accounts | full UI |
| Business Insights | overview · product · sales · traffic · services · marketing (inline-SVG charts) | full UI |
| Shop | info(+KYC) · decoration page-builder · appeals · missions | full UI (builder = scaffold, no real DnD) |
| Live & Video | analytics · streaming-price(+create) · create-stream · go-live preview | UI built; **LiveKit stubbed** |
| Account Health | overview · NFR detail · chat-response detail | full UI |
| Shop Settings | account · chat · notifications · payment · product · vacation · partners · addresses · shipping | full UI |

"full UI" = built to the screenshot + Zenith. **Wiring status is per-domain** (see Built/not-yet below): Orders, Products, Shop-info, Finance (balance/ledger), Home/Insights headline, reviews, and Returns are wired to real endpoints; the rest remain MSW-only.

## Conventions in place (backend-ready)
- **Money** = integer UZS via `@/utils/money` `formatUZS`.
- **i18n** = uz/ru/en; backend error codes → `tError(code)` (`@/i18n`); `LangMap`/`pickLang` (`@/lib/lang`) for `{uz,ru,en}` content.
- **Errors** = axios rejects with `ApiError {code,status}` (`@/lib/apiError`).
- **Auth** = OTP login + seller onboarding + `RequireAuth` route guard (`features/auth`); Bearer token in `localStorage`; works vs MSW (dev OTP `123456`) and the real backend.
- **Feature-first** structure, ESLint-enforced import boundaries, per-page lazy chunks.

## Built / not-yet
- ✅ **Auth (Phase 0)** — OTP login + onboarding/approval gate + route guard → real `/auth`, `/me`, `/sellers`.
- ✅ **Products / Orders / Profile (Phases 1–3)** — api layer calls the **real verified backend routes**, DTO-mapped at the boundary (snake→client, `pickLang` titles, integer UZS); **MSW emulates the backend** so dev still works without a server. Products: `/sellers/me/products`, `/catalog` CRUD, `/catalog/categories`, `/media/upload-url`. Orders: `/orders/seller`, ship/deliver/cancel, payment status. Profile: `GET/PUT /me`, `GET /sellers/me`.
- ✅ **Seller dashboard + finance + shop + reviews (Phase 4)** — wired to new backend endpoints:
  - **Orders**: detail now uses `GET /orders/seller/{id}` (the buyer-scoped `/orders/{id}` 404s for sellers — fixed); list consumes `buyer_name`, item preview, server `?status` filter + `summary` for tab counts.
  - **Products**: tab counts from backend `summary{all,active,hidden,sold_out}`; rich fields (sold, brand, compare_at, rating, review_count) mapped; `?status/q/sort/paging`; variant **read** no longer flattens (write still pending).
  - **Shop → Info**: `GET /sellers/me` (description/logo/banner/registered_at) + **`PUT /sellers/me`** update; R2 logo/banner upload.
  - **Finance**: balance + transactions via `/sellers/me/balance` + `/sellers/me/ledger`.
  - **Home + Business Insights**: headline KPIs via `/sellers/me/stats`.
  - **Customer Service + Account Health**: reviews list + per-star summary via `/sellers/me/reviews`.
- ✅ **Returns / refunds / disputes (Phase 5)** — Orders → Returns wired to real `/returns/seller`, `/returns/seller/{id}`, `…/dispute` (list + detail timeline + dispute). Backend `approve` restocks + posts a refund leg to the double-entry ledger; `reject`/`approve` available for when the UI exposes them. Buyer `POST /returns` exists (no buyer UI yet — mobile seller/return flows are future).
- ⏳ **Still MSW-only (no backend endpoint yet):** Marketing, Live, deeper Insights breakdowns, most Settings tabs, Shop decoration/appeals/missions/KYC, mass-ship docs/bulk-arrange/CSV export/order-notes, product boost/brands/size-charts/AI/bulk + variant **write**, finance payouts/bank-accounts, review **replies**, seller-scoped chat. All marked `[PENDING BACKEND]` in the api files — full matrix in [api-contract.md](api-contract.md); P6 build order in the OZB workspace memory.
- ⏳ Deploy (Cloudflare Pages) — local-only / release-gated.

## Run against the real backend
Set `VITE_ENABLE_MSW=false` and `VITE_API_BASE_URL=http://localhost:8080/api/v1`, then in `ozb-backend`: `make up && make run`. Wired slices hit the real API; un-wired pages will 404 their (absent) endpoints until built.

## How to run
`cp .env.example .env && npm install && npm run dev` → http://localhost:5173 (MSW serves mock data).
`npm run build` · `npm run lint` · `npm run test`.
