# Coffee Settlement Calculator — Requirements & Use Cases

## Overview

A single-page web application that helps a group of people manage shared coffee purchases. It tracks which coffee products were bought, who wants which coffee (and how much), and calculates what each participant owes — factoring in coffee cost, freight, and optional markup.

---

## Functional Requirements

### FR-1: Multi-Purchase Management

| ID | Requirement |
|----|-------------|
| FR-1.1 | The system shall support multiple independent purchases (sessions), each with its own data. |
| FR-1.2 | The user shall be able to create a new purchase, which auto-generates a date-based name (e.g., "Purchase 2026-06-24"). |
| FR-1.3 | If multiple purchases are created on the same day, the name shall include an incrementing suffix (e.g., "(2)", "(3)"). |
| FR-1.4 | The user shall be able to switch between purchases via the sidebar; the current purchase is saved before switching. |
| FR-1.5 | The user shall be able to rename a purchase (via browser `prompt()` dialog). |
| FR-1.6 | The user shall be able to delete a purchase, with a confirmation dialog. |
| FR-1.7 | The last remaining purchase cannot be deleted (shows alert). |
| FR-1.8 | When deleting the active purchase, the system shall auto-switch to the first available purchase. |
| FR-1.9 | On first visit (no stored data, no legacy data), a default purchase is created automatically. |
| FR-1.10 | The active purchase ID is persisted so the same purchase is loaded on page reload. |
| FR-1.11 | If the stored active purchase ID no longer exists, the system falls back to the first purchase. |
| FR-1.12 | Each purchase tracks `createdAt` and `updatedAt` timestamps (ISO format). |

### FR-2: Coffee Product Management

| ID | Requirement |
|----|-------------|
| FR-2.1 | The user shall be able to add a coffee product with: name, weight (kg), and price per kg (R$/kg). |
| FR-2.2 | Coffee cost must be greater than 0. |
| FR-2.3 | Coffee weight must be greater than 0 (HTML `min="0.01"`). |
| FR-2.4 | The user shall be able to edit a coffee product's weight and price inline (name is not editable). |
| FR-2.5 | Editing weight below the currently allocated amount shall be rejected with an alert message, and the old weight is restored. |
| FR-2.6 | When coffee price/weight is edited, all related allocation values and fractions shall be recalculated (`value = cost × grams/1000`, `fraction = grams / newTotalGrams`). |
| FR-2.7 | The user shall be able to delete a coffee product; all related allocations are cascade-deleted. |
| FR-2.8 | The coffee list shall display: name, weight, R$/kg, total value (weight × cost), and action buttons (Edit, Delete). |
| FR-2.9 | A footer row shall display totals for weight and value across all coffees. |
| FR-2.10 | The user shall be able to bulk-import coffees from a CSV/spreadsheet format (name, weight, price per line) via a collapsible `<details>` section. |
| FR-2.11 | CSV import supports comma-separated values, one product per line. Decimal commas in weight/price are converted to dots. |
| FR-2.12 | CSV import reports results: count of successfully imported items and up to 3 error messages for failed lines. |
| FR-2.13 | On successful CSV import with no errors, a green success message is shown for 3 seconds then cleared. |
| FR-2.14 | After adding a coffee, the form is reset and focus returns to the name input. |
| FR-2.15 | Coffee edit mode: clicking "Edit" converts weight and cost cells to input fields; "Save" commits, "X" cancels (re-renders list). |

### FR-3: Participant Management

| ID | Requirement |
|----|-------------|
| FR-3.1 | The user shall be able to add one or more participants by entering comma-separated names. |
| FR-3.2 | Duplicate participant names (case-insensitive) shall be rejected; a message lists the skipped duplicates. |
| FR-3.3 | Duplicates within the same input batch are also detected and skipped (e.g., entering "John, john" adds only one). |
| FR-3.4 | The user shall be able to edit a participant's name inline (input + Save/Cancel buttons). |
| FR-3.5 | Editing to a duplicate name (case-insensitive) shall be rejected with an alert. |
| FR-3.6 | Editing to an empty name shall be rejected with an alert. |
| FR-3.7 | The user shall be able to delete a participant; all related allocations are cascade-deleted. |
| FR-3.8 | The participant list shall display: ID, name, and action buttons (Edit, Delete). |
| FR-3.9 | A footer row shall display the total participant count. |
| FR-3.10 | After adding participants, the form is reset and focus returns to the name input. |
| FR-3.11 | If no valid names are entered (empty input), an error message is shown. |

### FR-4: Cost Management

| ID | Requirement |
|----|-------------|
| FR-4.1 | The user shall be able to set a total freight cost (R$). |
| FR-4.2 | Freight must be 0 or greater (negative values rejected with error). |
| FR-4.3 | Freight is split equally among all participants. |
| FR-4.4 | The freight summary shall display: total freight, number of participants, and freight per person. |
| FR-4.5 | If no participants exist when freight is set, the summary displays a warning message to add participants. |
| FR-4.6 | The freight input field is pre-populated with the current freight value on render (if > 0). |
| FR-4.7 | The user shall be able to set a markup expressed as R$/kg. |
| FR-4.8 | Markup must be 0 or greater (negative values rejected with error). |
| FR-4.9 | Markup is applied proportionally based on each participant's total allocated weight (kg). |
| FR-4.10 | The markup summary shall display: rate (R$/kg), total allocated weight, and total markup amount. |
| FR-4.11 | The markup input field is pre-populated with the current markup value on render (if > 0). |
| FR-4.12 | If markup value is 0 or not set, the markup summary section is hidden. |
| FR-4.13 | If freight is 0, the freight summary section is hidden. |
| FR-4.14 | The Costs section uses a side-by-side layout: forms on left, summaries on right (stacks vertically on mobile ≤600px). |

### FR-5: Allocation System

| ID | Requirement |
|----|-------------|
| FR-5.1 | The user shall be able to allocate a specific coffee to a specific participant in increments of 500g or 1000g. |
| FR-5.2 | Allocations are created through an Allocation Matrix (coffee × participant grid). |
| FR-5.3 | Each allocation records: coffee ID, participant ID, grams, fraction of total, and monetary value. |
| FR-5.4 | The system shall prevent allocating more than the available weight for a coffee (shows alert "Not enough coffee available"). |
| FR-5.5 | The user shall be able to edit an allocation's amount via dropdown (500g or 1000g options) with Save/Cancel. |
| FR-5.6 | The user shall be able to delete an individual allocation from the allocation list. |
| FR-5.7 | A participant may have multiple allocations of the same coffee (each click of +500g or +1kg creates a new allocation record). |
| FR-5.8 | The allocation list shall display: coffee name, participant name, amount (grams), value (R$), and actions (Edit, Delete). |
| FR-5.9 | Below the allocation list, a "Coffee Allocation Status" table shall show per-coffee progress bars indicating allocated vs. total weight with percentage. |
| FR-5.10 | Progress bars use color coding: green (100% allocated), orange (partially allocated), gray (nothing allocated). |
| FR-5.11 | The matrix shall display "Available" grams per coffee and allocation buttons per participant. |
| FR-5.12 | When a coffee is fully allocated (0g remaining), ALL participant cells in that row show the allocated amount for that participant (or 0g) and a remove button instead of add buttons. |
| FR-5.13 | Matrix buttons (+500g, +1kg) are disabled when insufficient coffee remains for that specific increment. |
| FR-5.14 | Removing an allocation from the matrix removes ALL allocations for that coffee-participant pair (bulk delete). |
| FR-5.15 | The allocation matrix is only rendered when both coffees and participants exist; otherwise an empty-state message is shown. |
| FR-5.16 | The allocation list shows an empty-state message when no allocations exist. |
| FR-5.17 | If a coffee or participant is deleted after allocations were made, the allocation list displays "Unknown" for orphaned references. |
| FR-5.18 | Allocation value is computed as: `coffee.cost × (grams / 1000)`. |

### FR-6: Settlement Calculation

| ID | Requirement |
|----|-------------|
| FR-6.1 | The system shall calculate each participant's total owed as: `coffee cost + freight share + markup`. |
| FR-6.2 | Coffee cost per participant = sum of their allocation values. |
| FR-6.3 | Freight per participant = total freight ÷ number of participants (split equally, rounded to 2 decimals). |
| FR-6.4 | Markup per participant = markup rate (R$/kg) × participant's total allocated kg (rounded to 2 decimals). |
| FR-6.5 | The settlement table shall display per-participant: Coffee, Freight, Markup, and Total Owed columns. |
| FR-6.6 | A footer row shall display column totals. |
| FR-6.7 | The participant with the highest total owed is highlighted as "top contributor" (yellow background) — only when there are 2+ participants. |
| FR-6.8 | A mini-bar visualization (proportional to max owed) shall appear inline next to each participant's total. |
| FR-6.9 | A "Contribution Breakdown" stacked horizontal bar chart visualizes each participant's cost composition with 3 segments: coffee (brown), freight (blue), markup (purple). |
| FR-6.10 | The contribution chart includes a color legend. |
| FR-6.11 | Each chart bar shows the participant's total amount on the right side. |
| FR-6.12 | A "Reconciliation" section shall verify that the sum of participant totals equals the expected total (allocations + freight + markup). |
| FR-6.13 | Rounding differences < R$0.01 are treated as matching ("✓ Totals match!"). |
| FR-6.14 | If there is a mismatch, the difference is displayed in red with explanation "(rounding)". |
| FR-6.15 | The settlement section shows an empty-state message if no participants exist. |
| FR-6.16 | The settlement section shows a different empty-state message if participants exist but no allocations exist. |

### FR-7: Dashboard

| ID | Requirement |
|----|-------------|
| FR-7.1 | A dashboard at the top shall display summary cards: Coffee Value, Freight, Markup, Grand Total, and Participants count. |
| FR-7.2 | The Grand Total card shall be visually highlighted (dark gradient background, white text). |
| FR-7.3 | The dashboard updates in real-time as data changes. |
| FR-7.4 | Dashboard values are shown rounded to whole numbers (`.toFixed(0)`). |
| FR-7.5 | "Coffee Value" shows the total value of ALL coffees (weight × cost), regardless of allocation status. |
| FR-7.6 | "Grand Total" = allocated coffee value + freight + markup (not total coffee value). |
| FR-7.7 | Dashboard uses responsive grid: `repeat(auto-fit, minmax(140px, 1fr))`. |

### FR-8: Data Persistence & Backup

| ID | Requirement |
|----|-------------|
| FR-8.1 | All data shall be persisted to browser localStorage. |
| FR-8.2 | Data shall auto-save on every change (no explicit "save" button). |
| FR-8.3 | The system shall migrate legacy single-purchase localStorage data (individual keys like `coffee_settlement_coffees`) to the new multi-purchase format, creating a "Migrated Purchase" and cleaning up old keys. |
| FR-8.4 | Migration only runs if old data exists AND the purchases list is empty. |
| FR-8.5 | The user shall be able to export the current purchase as a base64-encoded string copied to the clipboard (uses `navigator.clipboard.writeText`). |
| FR-8.6 | If clipboard API fails, the system falls back to a browser `prompt()` dialog displaying the base64 string. |
| FR-8.7 | Export includes metadata: version, original name, and `exportedAt` timestamp. |
| FR-8.8 | The user shall be able to import a purchase from a base64-encoded string via a modal dialog. |
| FR-8.9 | Imported purchases are added with the suffix " (imported)" appended to the name. |
| FR-8.10 | Import validates: version must equal 1, and data field must exist; otherwise shows error. |
| FR-8.11 | Invalid import data (bad base64, malformed JSON, wrong version) shall display an inline error message in the modal. |
| FR-8.12 | Empty import input shows "Please paste a backup string" error. |
| FR-8.13 | After successful import, a confirmation alert is shown with the imported purchase name. |
| FR-8.14 | The export encodes UTF-8 strings correctly via `btoa(unescape(encodeURIComponent(json)))` and decodes via `decodeURIComponent(escape(atob(input)))`. |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | The application runs entirely client-side (no server/backend). |
| NFR-2 | Responsive layout: 2-column grid on desktop (`1fr 1fr`), 1-column below 900px. |
| NFR-3 | Collapsible sidebar with state preserved across page reloads (localStorage key `window_sidebar_status`). |
| NFR-4 | On mobile (≤600px), the app layout switches from horizontal to vertical; sidebar becomes full-width top bar. |
| NFR-5 | All user-provided text is HTML-escaped via DOM textContent to prevent XSS. |
| NFR-6 | Input validation with inline error messages for all forms (red text below fields). |
| NFR-7 | Destructive actions (delete purchase, delete coffee) require `confirm()` dialog; participant deletion does NOT require confirmation. |
| NFR-8 | Financial calculations use `Math.round(value * 100) / 100` for 2-decimal rounding. |
| NFR-9 | Currency displayed in BRL (R$). |
| NFR-10 | Single HTML file — no external dependencies, no build tools, no frameworks. |
| NFR-11 | System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`. |
| NFR-12 | Color theme: brown/earth tones (#4a2c2a primary, #6b4423 secondary, #d4a574 accent). |
| NFR-13 | Cards with box-shadow for visual depth, rounded corners (8px). |
| NFR-14 | Sidebar width: 250px on desktop, 200px on tablet (≤900px), full-width on mobile (≤600px). |
| NFR-15 | Maximum page width: 1400px, centered. |
| NFR-16 | Empty states display italic gray messages guiding the user on next steps. |
| NFR-17 | Transitions/animations: sidebar collapse (width 0.3s), progress bar fill (width 0.3s), matrix cell hover (background 0.2s). |

---

## UI Structure & Layout

The application has a horizontal `app-layout` with two main regions:

### Sidebar (left)
- Toggle button (☰) to collapse/expand
- **Purchases section**: list of all purchases with active item highlighted, rename (✎) and delete (×) buttons, "+ New Purchase" button
- **Backup section**: "Export Current" and "Import" buttons

### Main Content (right)
1. **Dashboard** — top-level summary cards (auto-fit responsive grid)
2. **Two-column grid** (responsive):
   - **Left column:**
     - Participants card (inline form + table)
     - Costs card (freight form + markup form, side-by-side with summaries)
   - **Right column:**
     - Coffee Products card (add form + CSV import collapsible + table)
     - Allocations card (allocation table + coffee status progress bars)
3. **Full-width: Allocation Matrix** — interactive grid (special yellow/amber styling)
4. **Full-width: Settlement Summary** — table + contribution chart + reconciliation (special green styling)

### Modal
- Import modal (overlay with backdrop, textarea input, Import/Cancel buttons)

---

## Use Cases

### UC-1: Set Up a New Group Coffee Purchase

**Actor:** Organizer  
**Precondition:** Application is loaded in browser.  
**Flow:**
1. User clicks "+ New Purchase" in the sidebar.
2. System creates a purchase with auto-generated name and switches to it.
3. User adds participants (e.g., "John, Maria, Pedro").
4. User adds coffee products (name, weight, price/kg).
5. User sets freight cost.
6. User optionally sets markup per kg.

**Postcondition:** Purchase is set up and ready for allocations.

---

### UC-2: Allocate Coffee to Participants

**Actor:** Organizer  
**Precondition:** At least one coffee and one participant exist.  
**Flow:**
1. User views the Allocation Matrix.
2. For each participant, user clicks "+500g" or "+1kg" for the desired coffee.
3. System validates availability and creates the allocation.
4. Progress bars and settlement update in real-time.

**Alternative Flow:**
- If coffee is fully allocated, buttons are replaced with the allocated amount and a remove button.
- If insufficient coffee remains, buttons are disabled.

**Postcondition:** Each participant has their desired coffee allocated; settlement totals reflect the changes.

---

### UC-3: View Settlement (Who Owes What)

**Actor:** Organizer or Participant  
**Precondition:** At least one allocation exists.  
**Flow:**
1. User scrolls to the "Settlement Summary" section.
2. System displays per-participant breakdown: coffee cost + freight share + markup = total owed.
3. User verifies the reconciliation check (totals should match).
4. User can view the contribution chart for a visual comparison.

**Postcondition:** All participants know how much they owe.

---

### UC-4: Edit a Coffee Product After Allocation

**Actor:** Organizer  
**Precondition:** A coffee product exists with allocations.  
**Flow:**
1. User clicks "Edit" on the coffee row.
2. User modifies weight and/or price.
3. User clicks "Save".
4. System validates: if new weight < already-allocated grams, reject the change.
5. System recalculates all allocation values for that coffee.

**Postcondition:** Coffee and related allocations are updated; settlement recalculated.

---

### UC-5: Remove a Participant

**Actor:** Organizer  
**Precondition:** A participant exists.  
**Flow:**
1. User clicks "Delete" on the participant row.
2. System removes the participant and all their allocations.
3. Freight is redistributed equally among remaining participants.
4. Settlement recalculates.

**Postcondition:** Participant is removed; costs redistributed.

---

### UC-6: Export and Import a Purchase (Backup/Restore)

**Actor:** Organizer  
**Precondition:** An active purchase exists with data.  

**Export Flow:**
1. User clicks "Export Current" in the sidebar.
2. System encodes purchase data as base64 and copies to clipboard.
3. User saves the string externally (e.g., email, note).

**Import Flow:**
1. User clicks "Import" in the sidebar.
2. Modal dialog appears.
3. User pastes the base64 string.
4. User clicks "Import".
5. System decodes, validates, and creates a new purchase with the imported data.
6. System switches to the imported purchase.

**Postcondition:** Purchase is backed up or restored.

---

### UC-7: Manage Multiple Purchases

**Actor:** Organizer  
**Precondition:** One or more purchases exist.  
**Flow:**
1. User clicks on a different purchase in the sidebar to switch.
2. User can rename purchases via the ✎ button.
3. User can delete non-active purchases via the × button.

**Postcondition:** User can manage history of coffee purchases.

---

### UC-8: Bulk Import Coffee Products

**Actor:** Organizer  
**Precondition:** None.  
**Flow:**
1. User expands "Import from CSV/Spreadsheet" in the Coffee Products section.
2. User pastes data in format: `Name, Weight(kg), Price/kg` (one per line).
3. User clicks "Import".
4. System parses each line, validates data, and adds valid coffees.
5. System reports how many were imported and any errors.

**Postcondition:** Coffee products are added in bulk.

---

### UC-9: Adjust Allocation Amounts

**Actor:** Organizer  
**Precondition:** An allocation exists.  
**Flow:**
1. In the Allocations list, user clicks "Edit" on an allocation.
2. A dropdown appears with 500g and 1000g options.
3. User selects the new amount and clicks "Save".
4. System validates availability (excluding current allocation).
5. Allocation is updated; settlement recalculated.

**Alternative Flow:**
- If new amount exceeds available coffee, system rejects with error.

---

## Data Model

### localStorage Keys

| Key | Content |
|-----|---------|
| `coffee_settlement_purchases` | JSON array of all Purchase objects |
| `coffee_settlement_active` | ID (string) of the currently active purchase |
| `window_sidebar_status` | `"true"` or `"false"` — whether sidebar is open |

### Purchase Object

```
Purchase
├── id: string (Date.now().toString() — millisecond timestamp)
├── name: string
├── createdAt: ISO 8601 date string
├── updatedAt: ISO 8601 date string
└── data: object | null (null for newly created, unpopulated purchases)
    ├── coffees: [{id: number, name: string, weight: number (kg), cost: number (R$/kg)}]
    ├── nextCoffeeId: number (auto-increment counter)
    ├── participants: [{id: number, name: string}]
    ├── nextParticipantId: number (auto-increment counter)
    ├── allocations: [{id: number, coffeeId: number, participantId: number, grams: number, fraction: number, value: number}]
    ├── nextAllocationId: number (auto-increment counter)
    ├── freightTotal: number (R$)
    └── markup: {type: string|null, value: number (R$/kg)}
```

### Export Format

```json
{
  "version": 1,
  "name": "Purchase 2026-06-24",
  "exportedAt": "2026-06-24T10:30:00.000Z",
  "data": { /* same as Purchase.data */ }
}
```

---

## Business Rules

| # | Rule |
|---|------|
| BR-1 | Freight is always split equally regardless of how much coffee a participant takes. |
| BR-2 | Markup is proportional to weight — a participant taking 2kg pays double the markup of someone taking 1kg. |
| BR-3 | Allocation value = coffee price/kg × allocated kg (`coffee.cost * (grams / 1000)`). |
| BR-4 | Allocations are in fixed increments (500g or 1000g) — no arbitrary gram amounts. |
| BR-5 | A participant can accumulate multiple allocations of the same coffee (each is a separate record with its own ID). |
| BR-6 | Deleting a coffee or participant cascades to delete their allocations. |
| BR-7 | Editing coffee weight below already-allocated grams is forbidden. |
| BR-8 | Participant names must be unique (case-insensitive) within a purchase. |
| BR-9 | Markup is calculated on **allocated** weight only, not total coffee weight in the purchase. |
| BR-10 | The Grand Total in the dashboard uses allocated values (not total coffee values). A coffee that is registered but not yet allocated to anyone does not contribute to freight or markup. |
| BR-11 | When coffee weight is edited, existing allocations keep their gram amounts but their `fraction` and `value` are recalculated against the new total weight and cost. |
| BR-12 | Purchase IDs are generated from `Date.now()` — monotonically increasing, guaranteed unique within a session. |
| BR-13 | When a coffee is fully allocated (remaining = 0), the matrix shows remove buttons for ALL participants in that row — even participants who have 0g allocated for that coffee (they see "0g" with a remove button that effectively does nothing). |
| BR-14 | The matrix uses `allocations.find()` (first match only) when displaying grams — so it shows the first allocation record's grams, not the cumulative total for that coffee-participant pair. |
| BR-15 | `removeMatrixAllocation` removes ALL allocation records for a given coffee-participant pair at once (filter by both coffeeId AND participantId). |

---

## Known Behavioral Quirks / Technical Debt

| # | Description |
|---|-------------|
| Q-1 | The matrix only shows the `grams` from the FIRST matching allocation for a coffee-participant pair (via `.find()`), not the accumulated total. This may mislead users who clicked +500g twice. |
| Q-2 | When a coffee has remaining = 0, participants with 0g still see a "-" remove button which does nothing (no allocations to remove). |
| Q-3 | The allocation edit dropdown only offers 500g and 1000g options — if a legacy/migrated allocation has a different gram value, it cannot be restored. |
| Q-4 | Participant deletion does NOT require a `confirm()` dialog (unlike coffee and purchase deletion). |
| Q-5 | Coffee deletion does NOT require a `confirm()` dialog either — it's immediate. |
| Q-6 | The coffee add form only validates cost (> 0) but not weight explicitly in JS — it relies on the HTML `min="0.01"` attribute for weight validation. |
| Q-7 | Empty-state logic in the allocation list displays "Unknown" for orphaned allocations (if coffee/participant was deleted but allocation somehow remains) — this is a defensive guard. |
