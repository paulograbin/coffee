# Coffeer

A local coffee group-order calculator, preloaded with the participants and allocations from coffee.json. The example uses R$10 markup per kilogram and reproduces the R$1,260.38 settlement.

## Open the app

Open **dist/coffeer.html** in a modern browser. This standalone build bundles everything and needs no server or network connection.

For development (Node 20.19+ or 22.12+):

    npm install
    npm run dev

Open the localhost URL printed by Vite. Run npm run build to regenerate the regular web build and standalone HTML. Run npm test to check the calculations.

## Workflow

1. Rename the order, or create or duplicate a batch. Duplicating keeps quantities and rules but resets payments.
2. Add coffees, prices per kilogram, and purchased kilograms.
3. Add participants and enter each coffee allocation in whole grams (e.g. 250 for a quarter kilogram).
4. Set freight and markup. Toggle a participant’s freight or markup exemption in the allocation table.
5. Review allocation warnings and the settlement. Record each participant’s total payment in the Paid column.
6. Copy the shareable settlement, export CSV, or export a JSON backup of all orders.

Changes are stored in this browser, on this device. No account, server, sync, or third-party service is used. Keep JSON backups: clearing browser storage removes saved changes. A standalone file and a localhost app use different storage; use JSON export/import to transfer orders. Browser support for persistent storage on local files varies; the app reports storage failures.

## Calculation rules

- Currency is BRL. Money is stored as integer cents, quantities as integer grams, and exact products use BigInt.
- Coffee is calculated from allocated grams and price/kg, rounded once per coffee, then distributed among its recipients.
- Freight defaults to weight-based splitting. An equal split is also available. Only people with positive allocations participate.
- A freight exemption redistributes the full freight cost among eligible people. It does not discount freight or charge the organizer separately. If no one is eligible, freight is shown as unassigned and excluded from the settlement total.
- Markup supports R$/kg, one flat order fee split by allocated weight, or a percentage of coffee cost. Enter zero to disable markup. Percentage markup excludes freight.
- Markup exemptions are independent of freight exemptions. Per-kilogram and percentage markup exclude exempt participants’ weight or coffee cost. A flat fee is shared only among non-exempt participants with coffee; if none qualify, no markup is charged. Exemptions persist in saved orders and JSON backups; older orders default to no markup exemptions.
- Largest-remainder rounding distributes all cents exactly; tied remainders follow participant order.
- Purchased quantities are a reconciliation check. Totals bill allocated coffee only. Unallocated or overallocated purchases generate a warning and must be resolved before collecting a final settlement.
- Payments are cumulative amounts received by the organizer. Balance = total charge − payment. An overpayment is a credit to return. The app does not infer supplier payments or transfers between participants.
- Imports accept the original coffee.json schema and version 1 backups. Legacy markupCost is interpreted as R$/kg, following this order’s agreed rule. Imported orders are added without replacing existing orders.

## Scope

Includes coffee and participant editing/removal, multiple batches, fractional quantities, freight and markup exemptions, markup modes, payment balances, JSON backups, CSV export, and a copyable summary. Names and money fields are editable inline. Invalid number edits are highlighted and discarded on blur.

Possible future additions: supplier/roaster details, order dates and delivery status, payment history with dates, Pix payment details, and shared editing across devices. Shared editing would need a backend and authentication.

## Verification

The calculation tests cover the agreed settlement, all markup modes, freight and markup exemptions, equal splits, zero allocations, all-exempt orders, fractional weights, payment credits, invalid imports, and cent conservation. The production and standalone builds are checked separately. Browser visual and interaction QA could not run in the creation environment because it blocked browser startup and local server ports.
