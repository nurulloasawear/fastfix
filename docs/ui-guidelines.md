# OZB Seller — UI Consistency Guidelines (Zenith)

Every page must be built from the shared kit so the whole portal looks like ONE product.
We took Shopee's *logic/IA*, not its visuals — the look is **our Zenith** design system.

## Design tokens (never raw hex / off-palette)
- Brand `bg-brand` (#2d201c) + `hover:bg-accent` (yellow #fdd400). Text on brand = white.
- Surfaces: page `bg-bg` (#f9fafb), cards `bg-surface` (#fff). Borders `border-border` (cards), `border-border-strong` (inputs/table).
- Text: `text-text` (titles), `text-text-secondary`, `text-muted`. Table header `bg-table-header`.
- Status: `text-success`/`bg-success-bg`, `text-error-text`/`bg-error-bg`, `text-warning`/`bg-warning-bg`.
- Font: Poppins (global). Radius: pills `rounded-full` (buttons/tabs), cards/inputs `rounded-lg`, badges `rounded-md`. Shadow: `shadow-xs` on cards.
- ❌ No raw colors (`bg-[#...]`, `text-gray-500`, `bg-amber-50`…) except inside chart components. Use tokens.

## Shared kit — USE these, do not hand-roll equivalents
`@/components/ui/`: **Page** (page wrapper) · **PageHeader** (title/subtitle/breadcrumb/actions) ·
**Button** (variant primary/secondary/outline/ghost/destructive · size sm/md/lg — full pill) · **Badge** (tone) ·
**Card** · **Tabs** (segmented status/sub-nav, counts) · **Table/Th/Tr/Td** · **Input** · **Select** · **Textarea** ·
**Modal** · **EmptyState** · **StatCard** (KPI) · **Pagination** · **Spinner**.

## Page templates
- **Every page:** `<Page>` → `<PageHeader … />` → content. (Page gives consistent max-width + p-6/md:p-8 + gap-6.)
- **List page:** PageHeader (with primary action) → optional `<Tabs>` (status, counts) → filter/search bar (in a `<Card className="p-4">`, inputs via `<Input>/<Select>`, right-aligned `<Button variant="outline">` Reset / `<Button>` Search) → `<Table>` (or card grid) → `<Pagination>`. Empty → `<EmptyState>`. Loading → `<Spinner>`.
- **Detail page:** PageHeader (breadcrumb back) → 2-col on lg (`grid lg:grid-cols-[1fr_320px]`): main `<Card>`s left, side panel right (timeline / actions).
- **Form / wizard:** sectioned `<Card>`s, fields via `<Input>/<Select>/<Textarea>` (labels `font-semibold text-text-secondary`), grouped in `grid gap-4 md:grid-cols-2`; sticky footer with `<Button variant="outline">Cancel</Button> <Button>Save</Button>`.
- **Dashboard:** PageHeader + date-range → KPI row (`grid gap-3 sm:grid-cols-2 xl:grid-cols-4` of `<StatCard>`) → chart `<Card>`s → ranked `<Table>`s.

## Tables
`<Table><thead><Tr>…<Th>cols</Th></Tr></thead><tbody>{rows.map(r => <Tr><Td>…</Td></Tr>)}</tbody></Table>`.
Primary cell: `font-medium text-text` + `text-xs text-muted` sub-line. Money via `formatUZS`. Status via `<Badge>`.
Row actions: small `<Button variant="ghost" size="sm">` or text-brand links.

## States & details
- Always handle loading (`<Spinner>`), empty (`<EmptyState>`), and error (surface `tError(err.code)`).
- Buttons that mutate show pending (disabled + Spinner). All interactive elements have hover states.
- Responsive: tables scroll on small screens; KPI grids collapse; sidebars stack.
- i18n: every visible string via `t()`, uz/ru/en. Uzbek apostrophe = okina `ʻ` (U+02BB), never ASCII `'`.

## Consistency checklist (per page)
☑ wrapped in `<Page>` + `<PageHeader>` ☑ all buttons are `<Button>` (pill) ☑ all panels are `<Card>` ☑ all status = `<Badge>` ☑ all tables use Table/Th/Tr/Td ☑ all inputs/selects/textareas from the kit ☑ tabs = `<Tabs>` ☑ empty/loading/error states ☑ tokens only (no raw hex outside charts) ☑ money = formatUZS ☑ i18n complete.
