# ozb-seller ↔ ozb-backend — API Contract

Verified against `ozb-backend` Go routes on **2026-06-17** (Phases 0–5 wired + deployed to prod). Base: `…/api/v1`.
Auth: `Authorization: Bearer <JWT>` (HS256, 30-day). Errors: body `{ "error": "<stable_code>" }` → surface via `tError(code)`.
Money = `int64` UZS. Content (`title`/`description`) = jsonb `{uz,ru,en}` → `pickLang`. IDs = UUIDv7.
Backend truth: [`OZB/architecture/BE/api-endpoints.md`]. Wiring status per domain: [STATUS.md](STATUS.md). Wiring plan: [integration.md](integration.md).

## ✅ Endpoints that EXIST (wired)

### Auth (public)
- `POST /auth/request` — `{phone}` → `{sent, expires_in}`
- `POST /auth/verify` — `{phone, code}` → `{token, user_id}`  · dev OTP `123456`

### Me / Seller profile (auth)
- `GET /me` → `{id, phone, full_name, username, avatar_url, language, is_admin, modes[], seller:{id, shop_name, status}|null, created_at}`
- `PUT /me` — `{full_name?, username?, language?, avatar_url?}` → `{updated}`
- `POST /sellers/register` — `{shop_name}` → `{id, shop_name, status:"pending"}`
- `GET /sellers/me` → `{id, shop_name, status, description{uz,ru,en}, logo_url, banner_url, vat_percent, product_count, registered_at, created_at}`
- `PUT /sellers/me` — `{shop_name?, description?{uz,ru,en}, logo_url?, banner_url?}` → `{updated}` (logo/banner must be under R2 base → else `invalid_media_url`)

### Seller dashboard / finance (auth)
- `GET /sellers/me/stats` → `{orders_total, orders_by_status{pending,paid,shipped,delivered,cancelled}, revenue_uzs (collected), gross_sales_uzs, units_sold, product_count, active_products, recent_orders[]}`
- `GET /sellers/me/balance` → `{available_uzs, lifetime_earned_uzs, lifetime_refunded_uzs, currency}` (from the double-entry ledger)
- `GET /sellers/me/ledger?limit&offset` → `{transactions:[{id, txn_id, direction, amount_uzs, signed_amount_uzs, order_id, memo, created_at}]}`
- `GET /sellers/me/reviews?limit&offset` → `{reviews:[{product_id, product_title{}, author_name, rating, comment, created_at}], summary:{count, avg_rating, by_star{1..5}}}`

### Catalog / Products
- `GET /catalog?limit&offset|cursor&seller_id&category&q&sort` (public) → `{products[], next_cursor}` (sort: newest|popular|rating|price_asc|price_desc)
- `GET /catalog/categories` · `GET /catalog/search?q&limit` · `GET /catalog/{id}` (full PDP + `variants[]`) · `GET /catalog/{id}/reviews` · `GET /catalog/{id}/similar` (all public)
- `GET /sellers/me/products?status&q&sort&limit&offset` (auth) → `{products:[{id, title{}, price_uzs, compare_at_uzs, stock, status, category, brand, rating, review_count, sold, has_variants, image_urls, created_at, updated_at}], total, summary{all,active,hidden,sold_out}}` — **seller's own products**; status: active|hidden|sold_out
- `POST /catalog` (auth, seller approved) — `{title{}, description{}?, price_uzs>0, compare_at_uzs?, stock, category?, brand?, image_urls[], video_url?}` → `{id}`
- `PUT /catalog/{id}` (auth) — partial; `status?: active|hidden` → `{id, updated}`  · `DELETE /catalog/{id}` — soft-hide → `{id, status:"hidden"}`

### Orders
- `GET /orders/seller?status&limit&offset` (auth) → `{orders:[{id, user_id, buyer_name, status, total_uzs, payment_method, payment_status, created_at, item_count, units, items:[{title{}, quantity, image_url}]}], summary{all,pending,paid,shipped,delivered,cancelled}}`
- `GET /orders/seller/{id}` (auth) → **seller-scoped** detail `{…, buyer_name, buyer_phone, shipping_address, items:[{product_id, title{}, quantity, unit_price_uzs, image_urls, variant_label}]}`  · NB `GET /orders/{id}` is **buyer-scoped** (404s for sellers — don't use it in the portal)
- `POST /orders/{id}/ship|deliver|cancel` (auth) → `{id, status}` · statuses: pending·paid·shipped·delivered·cancelled · payment: unpaid·paid·refunded

### Returns / refunds / disputes (auth)
- `POST /returns` (buyer) — `{order_id, type, reason_code, reason_text, items:[{order_item_id, quantity}]}` → `{id, status:"requested", refund_uzs}` (order must be shipped/delivered)
- `GET /returns` (buyer) → my returns · `GET /returns/seller?status&limit&offset` → `{requests:[{id, order_id, buyer_name, type, reason_code, reason_text, status, refund_uzs, quantity, product_title{}, created_at}], total, summary{all,requested,approved,refunded,rejected,disputed,closed}}`
- `GET /returns/seller/{id}` → detail `{…, buyer_phone, dispute_text, items[], events:[{type, actor, note, created_at}]}`
- `POST /returns/seller/{id}/approve` → restock + **ledger refund leg** + `{id, status:"refunded"}` · `POST …/reject` `{note}` · `POST …/dispute` `{dispute_text, evidence_urls}`
- status: requested→`under_review`, approved→`returning`, refunded·rejected·disputed map through

### Payments / Media / Shops
- `GET /payments/{provider}/status/{order_id}` (auth) → `{status, state?}` (click|payme|atmos|uzum_nasiya)
- `POST /media/upload-url` (auth) — `{content_type, kind: avatar|product|video}` → `{key, upload_url, public_url}` then `PUT upload_url` (binary)
- `GET /shops` · `GET /shops/{id}` (public)

## 🟡 PENDING — no backend endpoint yet (keep MSW until built)
- **Products:** variant **write** (POST/PUT `/catalog` ignore `variants[]`), brands, size-charts, AI optimiser, boost/copy, bulk actions, real `under_review`/`violation`/`draft` statuses.
- **Finance:** payouts/withdrawals, bank accounts, settlement statements, fee breakdown. (balance/ledger ✅)
- **Marketing:** ads, vouchers, flash/bundle/add-on deals, campaigns, creators, review-prize.
- **Business Insights:** traffic/conversion/time-series & per-product analytics. (headline KPIs via `/sellers/me/stats` ✅)
- **Shop:** decoration page-builder, top-picks, appeals, seller missions, KYC. (info read+update ✅)
- **Account Health:** performance metrics/penalty points. (shop rating via `/sellers/me/reviews` ✅)
- **Customer Service:** seller-scoped chat, auto-reply, FAQ, **review replies**. (review list ✅)
- **Orders:** mass-ship documents, bulk-arrange, CSV export, order notes. (returns/disputes ✅)
- **Settings:** notifications, security/2FA, password, api-key, chat, payment, vacation, partners tabs. (account via `/me` ✅)

## Stable error codes (subset)
`invalid_code`·`code_expired`·`invalid_token` (auth) · `not_a_seller`·`seller_not_approved`·`not_your_product`·`not_your_order`·`admin_only` (403) ·
`invalid_product_input`·`invalid_price`·`invalid_media_url`·`cart_empty`·`insufficient_stock`·`order_not_shippable`·`order_not_cancellable` ·
returns: `invalid_return_input`·`invalid_return_item`·`order_not_returnable`·`return_not_found`·`return_not_actionable` · `rate_limited` · `internal_error`.

## Mapping rule
Backend is `snake_case`; map to the feature's client model at the `api/*.api.ts` boundary (snake→camel, `pickLang` for content, keep money integer). MSW serves the SAME real routes with backend-shaped responses so dev mirrors prod. Don't leak raw DTOs past the api file.
