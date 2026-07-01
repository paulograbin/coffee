# Code Review — Settlement Coffee

## Bugs


### 2. `coffee-store.ts` — Watcher missing `{ deep: true }`

**File:** `src/stores/coffee-store.ts:24`

The `watch` on `coffees` doesn't have `{ deep: true }`. Since items are pushed via `.push()` (mutations on the array elements), the watcher won't trigger on nested changes. The `participants.ts` store works because it always replaces the whole array (`participants.value = [...]`), but `coffee-store` uses `.push()`.

**Fix:** Add `{ deep: true }` to the watcher.

### 3. `allocation-store.ts` — Same `nextId` bug

**File:** `src/stores/allocation-store.ts:18`

Same issue as coffee-store — `nextId` starts at 1, causing ID collisions after reload.

### 4. `allocation-store.ts` — Exported names don't match domain

**File:** `src/stores/allocation-store.ts:42`

The store exports `addCoffee` and `removeCoffee` but these are allocation operations. This is confusing and likely a copy-paste error.

**Fix:**
```ts
return { allocations, registerNewAllocation, removeAllocation }
```

### 5. `CostsTable.vue` — Division by zero

**File:** `src/components/CostsTable.vue:59`

`freightCost / participantStore.participants.length` will produce `Infinity` when there are no participants.

**Fix:** Guard with a check or use a computed:
```ts
const freightPerPerson = computed(() =>
  participantStore.participants.length > 0
    ? freightCost.value / participantStore.participants.length
    : 0
)
```

### 6. `CostsTable.vue` — Markup summary shows wrong values

**File:** `src/components/CostsTable.vue:63-64`

"Total Weight" displays `markupCost` (should be total coffee weight), and "Total Markup" multiplies markup by participant count (should be markup × total weight).

### 7. `HomeView.vue` — Dashboard totals are not reactive

**File:** `src/views/HomeView.vue:15-21`

`totalCoffeeCost` and `totalCost` are plain `const` values computed once at setup time. They won't update when coffees or purchase data changes.

**Fix:** Use `computed()`:
```ts
const totalCoffeeCost = computed(() =>
  coffeeStore.coffees.reduce((acc, coffee) => acc + coffee.itemTotal, 0)
)

const totalCost = computed(() =>
  (purchaseStore.purchase?.freightCost ?? 0) +
  (purchaseStore.purchase?.markupCost ?? 0) +
  totalCoffeeCost.value
)
```

### 8. `CoffeeTable.vue` — `itemTotal` calculation is inconsistent

**File:** `src/stores/coffee-store.ts:39-40`

The store computes `price = priceInCents / 100` and `itemTotal = priceInCents * weight`. But the template at line 128 shows `c.weight * c.price` (which equals `weight * priceInCents / 100`). The footer uses `coffee.itemTotal / 100` (line 41 of CoffeeTable). This is confusing — `itemTotal` is in cents but is never clearly labeled.

**Suggestion:** Decide whether the domain model works in cents or reais and be consistent. If the input is R$/kg (as the label says), then `priceInCents` is a misleading field name.

---

## Idiom & TypeScript Issues

### 9. Unsafe `JSON.parse` without validation

**Files:** All stores

`JSON.parse(localStorage.getItem(...))` is cast directly to the expected type. Corrupted or outdated localStorage data will silently produce runtime errors.

**Suggestion:** Add a minimal shape check or wrap in try/catch:
```ts
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
```

### 10. `console.log` scattered in production code

**Files:** `coffee-store.ts`, `allocation-store.ts`, `participants.ts`

Debug logs left in store code. Remove or guard behind a dev flag.

### 11. `participants.ts` — Watcher missing `{ deep: true }`

**File:** `src/stores/participants.ts:19`

The watcher works today because the store always replaces the entire array (line 27: `participants.value = [...participants.value, ...]`). But `removeParticipant` also replaces — so it's fine by coincidence. Adding `{ deep: true }` makes intent explicit and prevents future bugs if someone adds a mutation.

### 12. CoffeeTable `addCoffee` doesn't clear inputs after success

**File:** `src/components/CoffeeTable.vue:12-18`

After adding a coffee, the name/weight/price fields keep their values.

### 13. `AllocationTable.vue` — Doesn't use the allocation store at all

**File:** `src/components/AllocationTable.vue`

Imports `useCoffeeStore` but never uses `useAllocationStore`. The table just re-renders coffee data with allocation-themed headers. This is placeholder code that will confuse future readers.

---

## Improvements

### 14. Move computed totals to the coffee store

The reduce functions in `CoffeeTable.vue` (lines 24-43) — `getTotalWeight`, `getTotalPriceInCents`, `getTotalPrice`, `getTotalAmount` — are better as `computed` getters exported from the store. They'd be reusable (the HomeView dashboard also needs them) and reactive.

### 15. Add `overflow-wrap: break-word` or `word-break` to table cells

With `table-layout: fixed`, long coffee names will overflow their cell. Add:
```css
td { overflow-wrap: break-word; }
```

### 16. CardComponent could accept a `prefix` prop

Several cards use `R$ ${value}` in the template string from HomeView. A `prefix` prop (or `format` prop) would keep formatting logic in the component.

---

## Vue / Pinia Framework Misuse

### 17. Functions in template instead of `computed`

**File:** `src/components/CoffeeTable.vue:138-141`

The footer calls `getTotalWeight()`, `getTotalPriceInCents()`, etc. directly in the template. These are plain functions — Vue re-executes them on **every render**, even if the data hasn't changed. Use `computed()` for derived values:

```ts
const totalWeight = computed(() => store.coffees.reduce((acc, c) => acc + c.weight, 0))
const totalPrice = computed(() => store.coffees.reduce((acc, c) => acc + c.price, 0))
```

`computed` caches the result and only recalculates when its dependencies change.

### 18. HomeView dashboard values are not reactive (`const` instead of `computed`)

**File:** `src/views/HomeView.vue:15-21`

```ts
const totalCoffeeCost = coffeeStore.coffees.reduce(...)
const totalCost = ...
```

This calculates once during setup and never updates. In Vue 3 + Composition API, derived state must use `computed()` to stay reactive. The dashboard cards will show stale numbers until a page refresh.

### 19. Store logic executed at import time (not inside `setup`)

**Files:** All stores

```ts
const storedString = localStorage.getItem('purchase')
const stored = storedString ? JSON.parse(storedString) : null
```

This runs inside `defineStore`'s setup function, which is correct for Pinia's composition-style stores. However, `console.log` side effects and `let nextId = 1` assignments at module scope make the stores harder to test (no way to reset state without clearing localStorage and re-importing).

**Better pattern:** Use Pinia's `$reset()` or encapsulate initialization.

### 20. Mutating store state directly via `.push()` without deep watcher

**File:** `src/stores/coffee-store.ts:43`

```ts
coffees.value.push(newCoffee)
```

Pinia's `ref` with a watcher requires `{ deep: true }` to detect mutations on array items. Without it, the localStorage persistence silently stops working after the first add. The participants store avoids this by always reassigning the array (`participants.value = [...participants.value, item]`), which is the safer pattern.

**Recommendation:** Either always reassign (immutable pattern):
```ts
coffees.value = [...coffees.value, newCoffee]
```
Or ensure `{ deep: true }` on the watcher.

### 21. `v-model` on number inputs without `.number` modifier

**File:** `src/components/CoffeeTable.vue:88-89`

```html
<input v-model="newCoffeeWeight" placeholder="0.00" type="number" />
```

`v-model` on `<input type="number">` returns a **string** in Vue 3. Use `v-model.number` to get an actual number, or you'll need `parseFloat()` every time you use the value:

```html
<input v-model.number="newCoffeeWeight" placeholder="0.00" type="number" />
```

Same applies to `CostsTable.vue` freight/markup inputs.

### 22. Pinia store returns misnamed actions (violation of composable convention)

**File:** `src/stores/allocation-store.ts:42`

```ts
return { allocations, addCoffee: registerNewAllocation, removeCoffee: removeAllocation }
```

Renaming store methods on export to unrelated domain names (`addCoffee` for an allocation) breaks Vue DevTools inspection and confuses consumers. Export with their real names.

### 23. Using `document.querySelector` instead of template refs

**File:** `src/components/ParticipantTable.vue:22`

```ts
const input = document.querySelector('.edit-inline') as HTMLInputElement
```

This is a vanilla JS escape hatch that bypasses Vue's reactivity and scoping. If multiple rows are being edited (or the class appears elsewhere), it grabs the wrong element. Use a template ref:

```vue
<input ref="editInput" ... />
```
```ts
const editInput = ref<HTMLInputElement | null>(null)
nextTick(() => editInput.value?.focus())
```

### 24. No use of Pinia's `storeToRefs` for destructuring

When you need only reactive state (not actions) from a store, `storeToRefs()` preserves reactivity during destructuring. Currently not an issue since stores are used as `store.coffees`, but if someone later destructures `const { coffees } = useCoffeeStore()`, it loses reactivity silently.

---

## Accessibility

### 25. Buttons without meaningful labels for screen readers

**Files:** `CoffeeTable.vue:130`, `AllocationTable.vue:29`

The "Edit" buttons have no `aria-label` and perform no action. Screen readers announce "button, Edit" with no context about *which* item. Either remove them or add `aria-label`:
```html
<button aria-label="Edit Alpendre coffee">Edit</button>
```

### 26. Dynamic content has no `aria-live` announcements

When coffees or participants are added/removed, there's no feedback for assistive technology. Wrap the count or add an `aria-live="polite"` region:
```html
<p aria-live="polite">{{ store.coffees.length }} coffees loaded</p>
```

### 27. Color contrast on brown theme

The `#6b4423` button background with white text passes WCAG AA, but `#999` on white (used for `.empty` placeholder text) has a contrast ratio of ~2.8:1 — fails AA. Use `#666` or darker.

### 28. No focus management after inline edit

**File:** `ParticipantTable.vue`

After saving or canceling an edit, focus is lost (returns to `<body>`). Move focus back to the name span or the next logical element.

---

## Error Handling & Edge Cases

### 29. No user feedback on CSV import errors

**File:** `CoffeeTable.vue:45-70`

Invalid lines are silently skipped. The user has no idea if 3 out of 5 lines failed. Show a count or highlight the bad lines:
```ts
let imported = 0, skipped = 0
// ... in the loop:
imported++
// ... on invalid:
skipped++
// after:
if (skipped > 0) alert(`Imported ${imported}, skipped ${skipped} invalid lines`)
```

### 30. localStorage might be unavailable or full

**Files:** All stores

In private browsing (Safari) or when quota is exceeded, `localStorage.setItem()` throws. Wrap writes in try/catch:
```ts
try {
  localStorage.setItem(key, JSON.stringify(val))
} catch (e) {
  console.warn('Failed to persist to localStorage:', e)
}
```

### 31. No confirmation before destructive actions

**Files:** `CoffeeTable.vue:20`, `ParticipantTable.vue:72`

Deleting a coffee or participant is instant and irreversible (no undo, no "Are you sure?"). At minimum, add a `confirm()` dialog.

---

## Responsiveness

### 32. Two-column grid has no mobile breakpoint

**File:** `src/views/HomeView.vue`

On screens below ~768px, both columns are squeezed side-by-side. Add:
```css
@media (max-width: 768px) {
  .two-columns {
    grid-template-columns: 1fr;
  }
}
```

### 33. Table with 6 columns on narrow viewports

**File:** `CoffeeTable.vue`

`table-layout: fixed` with 6 columns at ~50% viewport width leaves each cell ≈80px. Names and prices get truncated or overlap. Consider hiding less-important columns on mobile or switching to a card layout.

---

## Data Integrity

### 34. Deleting a participant doesn't remove their allocations

**Files:** `participants.ts`, `allocation-store.ts`

If a participant is deleted, their allocations remain orphaned in the allocation store. Add a cascading delete:
```ts
function removeParticipant(id: number) {
  participants.value = participants.value.filter(p => p.id !== id)
  allocationStore.removeByParticipant(id)
}
```

### 35. Deleting a coffee doesn't remove its allocations

Same as above — orphaned allocation records pointing to a deleted coffee.

### 36. No data export/import for full state backup

There's no way to export the current state as JSON or import it back. Useful for sharing setups between sessions or devices.

---

## Performance

### 37. localStorage writes on every single mutation

**Files:** All store watchers

Every keystroke that changes a reactive array triggers a full `JSON.stringify` + write. For large lists this causes UI jank. Debounce the write:
```ts
import { watchDebounced } from '@vueuse/core'
// or manual:
let timeout: ReturnType<typeof setTimeout>
watch(coffees, (val) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => localStorage.setItem('coffees', JSON.stringify(val)), 300)
}, { deep: true })
```

### 38. No `v-for` key optimization or virtual scrolling

Not a problem at current scale, but if the coffee list grows to hundreds of items, rendering all rows in the DOM will degrade performance. Consider `vue-virtual-scroller` at that point.

---

## Dead Code & Scaffolding

### 39. Unused boilerplate components

These are leftover from `create-vue` and should be removed:
- `src/components/HelloWorld.vue`
- `src/components/TheWelcome.vue`
- `src/components/WelcomeItem.vue`
- `src/components/icons/` (all 5 icon components)
- `src/components/__tests__/HelloWorld.spec.ts`
- `src/stores/counter.ts`
- `src/views/AboutView.vue`

### 40. Unused CSS classes

**File:** `CostsTable.vue`

`.add-form`, `.add-form input` are defined in the scoped style but never used in the template.

---

## Testing

### 41. No tests for store logic

The only test is for the unused `HelloWorld.vue`. Critical paths that should have unit tests:
- ID generation after reload
- CSV parsing (valid, invalid, edge cases)
- Store persistence round-trip
- Computed totals

### 42. No integration/E2E tests

No Cypress/Playwright tests to verify the full flow: add coffee → set costs → allocate → verify totals.

---

## Type Safety

### 43. `JSON.parse` results are unvalidated

**Files:** All stores

Data from `localStorage` is trusted blindly. If the schema changes (e.g. a new field is added to `Coffee`), old stored data will have missing fields, causing runtime errors. Validate with Zod or a manual check:
```ts
import { z } from 'zod'
const CoffeeSchema = z.object({ id: z.number(), name: z.string(), ... })
const parsed = CoffeeSchema.array().safeParse(JSON.parse(raw))
```

### 44. `Coffee.itemTotal` is derived but stored — can drift

**File:** `src/stores/coffee-store.ts:39-40`

`itemTotal` is computed at creation time (`priceInCents * weight`) and stored as a field. If an edit feature is added and only `weight` is updated, `itemTotal` will be stale. Use a getter or compute it on access instead of storing it.
