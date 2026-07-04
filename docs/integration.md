# ozb-seller — Backend Integration Playbook

How to wire the portal to `ozb-backend`, **one domain at a time**, mirroring the proven `ozb-mobile`
integration. Endpoint truth: [api-contract.md](api-contract.md).

## Status — Phases 0–5 done + deployed (2026-06-17)
- ✅ **0 Foundation** · ✅ **1 Products** · ✅ **2 Orders** · ✅ **3 Profile** · ✅ **4 Dashboard/Finance/Shop/Reviews** · ✅ **5 Returns/refunds/disputes** are wired to the real verified routes and **deployed to prod** (full route list: [api-contract.md](api-contract.md)).
- **Phase 4** (migration 0025): seller order detail (`/orders/seller/{id}`), enriched order list, rich product list + summary counts, `PUT /sellers/me` shop update, `/sellers/me/stats|balance|ledger|reviews`.
- **Phase 5** (migration 0026): `/returns/seller`, `/returns/seller/{id}`, `…/approve|reject|dispute`, buyer `POST /returns` — approve restocks + posts a refund leg to the double-entry ledger.
- **Decision (supersedes "turn MSW off per domain" in step 4 below):** MSW is **kept on and updated to serve the real routes with backend-shaped responses.** This means dev runs with no server, and the mock contract mirrors prod (catches DTO drift). To hit a live backend instead, set `VITE_ENABLE_MSW=false` + `VITE_API_BASE_URL` — the same api code paths run unchanged. Un-wired domains stay MSW-only and are marked `[PENDING BACKEND]` in their api files.

## Mirror the mobile pattern (it works against the same backend)

`ozb-mobile` is the reference. Replicate these in the web portal:

1. **One `api()` wrapper** (build `src/lib/api.ts` ≈ mobile `src/api/client.ts`):
   - base = `env.apiBaseUrl` (`…/api/v1`); always `Content-Type: application/json`.
   - `opts.auth` → add `Authorization: Bearer ${token}` (token from `localStorage['ozb_seller_token']`).
   - `opts.lang` → add `Accept-Language` (current i18n lang).
   - non-2xx → `throw new ApiError(body.error ?? 'internal_error', status)` (already have `ApiError` in `@/lib/apiError`).
   - (We currently use an axios instance in `@/lib/axios` that already does Bearer + ApiError — keep it, just add `Accept-Language` and a thin typed wrapper.)
2. **Auth context** (`src/lib/auth.tsx`, like mobile):
   - `POST /auth/request {phone}` → OTP; `POST /auth/verify {phone,code}` → `{token,user_id}` → store token → `GET /me` to load user.
   - `logout()` = remove token + `queryClient.clear()`. On `401`/`invalid_token` → logout.
   - Gate the app on `me.seller.status === 'approved'` (else show pending/registration).
3. **React Query**: default client is fine; conventions — `queryKey: ['<domain>', params]`; mutations `onSuccess → qc.invalidateQueries`. (Already how features are built.)
4. **Conventions already in place**: `formatUZS` (integer UZS), `tError(code)` for errors, `pickLang(field, lang)` for `{uz,ru,en}` titles/descriptions.

## What's wirable NOW vs mock-only

✅ **Real backend route exists** → wire it. 🟡 **No endpoint yet** → keep MSW until backend ships it.

| Domain | ✅ wire now | 🟡 stays mocked |
|--------|-----------|-----------------|
| Auth / Account | `/auth/request`,`/auth/verify`, `GET/PUT /me`, `sellers/register`, `GET sellers/me` | 2FA, security log, partners |
| Products | `GET /sellers/me/products`, `POST/PUT/DELETE /catalog`, `GET /catalog/{id}`, `/catalog/categories`, `/media/upload-url` | status-tab counts, brands, size-charts, variants mgmt, AI optimiser, boost |
| Orders | `GET /orders/seller`, `GET /orders/{id}`, `/orders/{id}/ship`,`/deliver`,`/cancel` | returns/disputes, mass-ship docs, sub-status filters |
| Shop | `GET /sellers/me`, `GET /shops/{id}` (public) | decoration, appeals, missions, KYC |
| Payments | `GET /payments/{provider}/status/{order_id}` | — |
| Finance · Marketing · Insights · Live · Account Health · CS · most Settings | — | **all** (no backend yet) |

(Backend uses `snake_case` + `price_uzs` int + `title` jsonb `{uz,ru,en}` + UUIDv7; map DTO→client model at the api boundary.)

## Recommended order (one slice at a time, build green + commit each)

0. **Foundation** — add `Accept-Language` to axios; build **auth context + OTP login page + seller-registration**; approval gate; `VITE_ENABLE_MSW` stays on for un-wired domains.
1. **Products** (highest value, most real routes): list via `GET /sellers/me/products`; create/edit → `POST/PUT /catalog` (+ `/media/upload-url` for images); delete → `DELETE /catalog/{id}`; categories. Derive status-tab counts client-side for now.
2. **Orders**: `GET /orders/seller` → list; `GET /orders/{id}` → detail; ship/deliver/cancel mutations.
3. **Shop profile** (`GET sellers/me`) + **payment status** polling.
4. Everything else **stays mocked** until its backend endpoint exists — track in [api-contract.md](api-contract.md).

## Per-domain wiring checklist (repeatable)

1. In `features/<d>/api/<d>.api.ts`: replace mock PATHS with the **real route** from api-contract.md; map the backend DTO → the feature's client model (snake→camel; `pickLang` for `{uz,ru,en}`; keep money integer).
2. Keep the TanStack Query hooks; point `queryFn`/`mutationFn` at the real api call. Mutations `invalidateQueries`.
3. Surface failures via `tError(err.code)` (err is `ApiError`). Handle empty/loading with the kit (`EmptyState`/`Spinner`).
4. Turn that domain's **MSW handler off** (remove its entry from `src/mocks/handlers.ts`, or guard behind the flag) so dev hits the real backend.
5. Verify against a local backend: in `ozb-backend` run `make up && make run` (`:8080`), set `VITE_API_BASE_URL=http://localhost:8080/api/v1`, `VITE_ENABLE_MSW=false`. Build + click through.

## Backend prerequisites to unblock the rest (still absent — P6 roadmap)
Built already: finance balance+ledger, returns/disputes, seller stats, shop info, reviews list (Phases 4–5).
Still needed in `ozb-backend` before these pages leave MSW: **finance payouts/withdrawals/bank-accounts/statements**,
marketing (ads/vouchers/flash/campaigns/creators), business-insights aggregates (traffic/conversion/time-series),
shop decoration/top-picks/appeals/missions/KYC, account-health metrics, review **replies**, seller-scoped chat,
mass-ship documents/bulk-arrange/CSV-export/order-notes, product variant **write**/brands/size-charts/boost/bulk,
and the per-tab Settings. Until then those pages remain MSW demos.
