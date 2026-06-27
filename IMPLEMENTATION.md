# Implementation Summary

## What was built (19 files, 96KB JS + 11KB CSS)

### Stores (business logic + persistence)

| Store | Implements |
|-------|-----------|
| `stores/participants.ts` | FR-3: batch add, duplicate detection (case-insensitive), rename, delete, localStorage |
| `stores/coffee-store.ts` | FR-2: add/edit/delete/CSV import, computed totals, localStorage |
| `stores/allocations.ts` | FR-5: add/edit/delete, matrix bulk ops, cascade deletes, recalculation |
| `stores/costs.ts` | FR-4: freight + markup, per-person calculations |
| `stores/purchases.ts` | FR-1 + FR-8: multi-purchase, sidebar state, export/import |

### Composable

| File | Purpose |
|------|---------|
| `composables/useSettlement.ts` | FR-6 + FR-7: derived settlement calculations, dashboard data |

### Components

| Component | Covers |
|-----------|--------|
| `components/ParticipantTable.vue` | FR-3: add (comma-sep), inline edit, delete, error messages |
| `components/CoffeeTable.vue` | FR-2: add form with validation, delete, totals footer |
| `components/CostsCard.vue` | FR-4: freight + markup forms, summaries, side-by-side layout |
| `components/AllocationMatrix.vue` | FR-5: coffee×participant grid, +500g/+1kg, disable/remove logic |
| `components/AllocationList.vue` | FR-5: allocation table, progress bars with color coding |
| `components/SettlementSummary.vue` | FR-6: settlement table, contribution chart, reconciliation |
| `components/DashboardCards.vue` | FR-7: 5 summary cards with highlighted grand total |
| `components/AppSidebar.vue` | FR-1/FR-8: purchase list, create/rename/delete, export/import modal |

### App Shell

| File | Purpose |
|------|---------|
| `App.vue` | Layout: sidebar + main content (2-column grid, responsive) |
| `main.ts` | Bootstrap: createApp + Pinia (no router) |
| `assets/base.css` | Reset, body styles, font stack |
| `assets/main.css` | Global card, button, input, table styles (coffee brown theme) |

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Remove vue-router | App is single-page, no routes needed. Simplifies bundle. |
| Stores use immutable patterns | `[...array, newItem]` and `.map()` — no `deep: true` needed on `watch`, simpler change detection. |
| Settlement is computed (not stored) | It's fully derived data — storing it would create sync issues. |
| Multi-purchase added last | It wraps everything else; building core first meant less rework. |
| Cost stored as R$/kg (not cents) | Matches the domain language. Rounding via `Math.round(val * 100) / 100` at calculation boundaries. |
| Cascade deletes in allocations store | `removeByCoffee()` and `removeByParticipant()` — called by the component when deleting a coffee or participant. |
| Each store persists independently | Simpler than a single mega-store. Each `watch` writes its own localStorage key. |
| `nextId` derived from stored data | `reduce((max, item) => Math.max(max, item.id), 0) + 1` — prevents duplicate IDs after reload. |

---

## Business Rules Implemented

| # | Rule | Where |
|---|------|-------|
| BR-1 | Freight split equally among all participants | `costs.ts` → `freightPerPerson` computed |
| BR-2 | Markup proportional to weight | `costs.ts` → `getParticipantMarkup()` |
| BR-3 | Allocation value = cost/kg × kg | `allocations.ts` → `addAllocation()` |
| BR-4 | Allocations in fixed increments (500g/1000g) | `AllocationMatrix.vue` buttons |
| BR-5 | Multiple allocations per coffee-participant pair | `addAllocation()` always creates new record |
| BR-6 | Cascade delete on coffee/participant removal | `allocations.ts` → `removeByCoffee()`/`removeByParticipant()` |
| BR-7 | Can't reduce coffee weight below allocated | Caller must check `getAllocatedGrams()` before `updateCoffee()` |
| BR-8 | Unique participant names (case-insensitive) | `participants.ts` → `addParticipants()` duplicate check |
| BR-9 | Markup on allocated weight only | `costs.ts` uses `allocationsStore.totalAllocatedGrams` |
| BR-10 | Grand Total uses allocated values | `useSettlement.ts` → `dashboard.grandTotal` |
| BR-11 | Coffee edit recalculates allocations | `allocations.ts` → `recalculateForCoffee()` |
| BR-15 | Matrix remove deletes all for coffee-participant | `allocations.ts` → `removeMatrixAllocation()` |

---

## File Structure

```
src/
├── App.vue
├── main.ts
├── assets/
│   ├── base.css
│   ├── logo.svg
│   └── main.css
├── components/
│   ├── AllocationList.vue
│   ├── AllocationMatrix.vue
│   ├── AppSidebar.vue
│   ├── CoffeeTable.vue
│   ├── CostsCard.vue
│   ├── DashboardCards.vue
│   ├── ParticipantTable.vue
│   └── SettlementSummary.vue
├── composables/
│   └── useSettlement.ts
└── stores/
    ├── allocations.ts
    ├── coffee-store.ts
    ├── costs.ts
    ├── participants.ts
    └── purchases.ts
```

---

## Build & Run

```bash
npm run dev          # dev server at localhost:5173
npm run build        # production build → dist/
npm run build-only   # skip type-check, just bundle
npm run preview      # serve dist/ locally
```

---

## What's NOT yet implemented (remaining from REQUIREMENTS.md)

- FR-2.4/2.5/2.15: Inline coffee editing (weight/price with allocation guard) — store supports it, UI not wired
- FR-2.10–2.13: CSV import UI (store has `importCoffees()`, no `<details>` section in component yet)
- FR-8.3–8.4: Legacy data migration (old localStorage keys → new format)
- NFR-3: Sidebar collapse state not yet syncing with purchases store on page load
- Multi-purchase data isolation: switching purchases doesn't yet reload/save individual store data (purchases store has `saveActivePurchaseData` but stores don't coordinate through it yet)
- Full responsive testing at 600px/900px breakpoints
