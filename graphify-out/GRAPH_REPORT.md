# Graph Report - coffee  (2026-11-27)

## Corpus Check
- Corpus is ~17,191 words - fits in a single context window. You may not need a graph.

## Summary
- 265 nodes · 339 edges · 25 communities (14 shown, 11 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Build Notes
- Hybrid build: 225 nodes from AST (code) + 44 from semantic extraction of the 5 docs + 1 image.
- Semantic extraction ran without a Gemini key (host agent as LLM); README.md, REVIEW.md and old/REQUIREMENTS.md were (re)extracted, the other docs + image served from cache.
- Rebuilt with `--force`: an earlier-vintage `graph.json` held semantic nodes absent from this run, so the shrink-guard was intentionally overridden for a clean full rebuild.
- Health check: 5 dangling + ~17 collapsed edges, all inside `.github/workflows/static.yml` (repeated `contains` edges). Cosmetic; graph is usable.

## Community Hubs (Navigation)
- ESLint & Linting Config
- Reactivity & Allocation Logic
- Persistence & Backup
- TypeScript Config
- GitHub Pages Deploy Job
- Settlement Domain Concepts
- Vue Compat Overrides
- CI Workflow Triggers
- App Dependencies & Bootstrap
- NPM Scripts
- Allocation Table Component
- Oxlint Config
- Testing Setup
- Prettier Config
- TS Project References
- storeToRefs Destructuring
- Vue Logo Asset

## God Nodes (most connected - your core abstractions)
1. `overrides` - 14 edges
2. `usePurchaseStore` - 12 edges
3. `scripts` - 11 edges
4. `Settlement Coffee Code Review` - 11 edges
5. `vue` - 10 edges
6. `Coffee Settlement Calculator` - 9 edges
7. `Legacy Single-Page Coffee Settlement App` - 8 edges
8. `steps` - 7 edges
9. `pinia` - 5 edges
10. `vitest` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Legacy Single-Page Coffee Settlement App` --semantically_similar_to--> `Vue App HTML Entry Point`  [INFERRED] [semantically similar]
  old/index.html → index.html
- `localStorage Client-Side Persistence` --semantically_similar_to--> `localStorage Persistence Pattern`  [INFERRED] [semantically similar]
  old/REQUIREMENTS.md → REVIEW.md
- `Cascade Delete Rule` --semantically_similar_to--> `Orphaned Allocations on Delete`  [INFERRED] [semantically similar]
  old/REQUIREMENTS.md → REVIEW.md
- `Settlement Coffee Code Review` --references--> `Coffee Settlement Calculator`  [INFERRED]
  REVIEW.md → old/REQUIREMENTS.md
- `usePurchaseStore` --indirect_call--> `addCoffee()`  [INFERRED]
  src/stores/purchase-store.ts → src/components/CoffeeTable.vue

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Settlement Cost Composition (Coffee + Freight + Markup)** — old_requirements_settlement_calculation, old_requirements_allocation_system, old_requirements_cost_management, old_requirements_reconciliation [EXTRACTED 1.00]
- **Pinia Stores Under Review** — review_coffee_store, review_allocation_store, review_participants_store, src_stores_purchase_store [INFERRED 0.75]
- **Persistence, Migration and Backup Flow** — old_requirements_localstorage_persistence, old_requirements_legacy_migration, old_requirements_base64_export_import, old_requirements_data_persistence_backup [EXTRACTED 1.00]

## Communities (25 total, 11 thin omitted)

### Community 0 - "ESLint & Linting Config"
Cohesion: 0.06
Nodes (49): devDependencies, eslint@^10.0.2, eslint-config-prettier@^10.1.8, eslint-plugin-oxlint@~1.50.0, eslint-plugin-vue@~10.8.0, jiti@^2.6.1, jsdom@^28.1.0, npm-run-all2@^8.0.4 (+41 more)

### Community 1 - "Reactivity & Allocation Logic"
Cohesion: 0.05
Nodes (33): vue@beta, vue, portions, purchaseStore, addCoffee(), canAddCoffee, multipleCoffeeCsv, newCoffeeName (+25 more)

### Community 2 - "Persistence & Backup"
Cohesion: 0.12
Nodes (14): Base64 Export/Import, Data Persistence & Backup, Legacy Single-Purchase Migration, localStorage Client-Side Persistence, coffeeSettlement App, ESLint, Vitest Unit Testing, Vue 3 + Vite Template (+6 more)

### Community 3 - "TypeScript Config"
Cohesion: 0.12
Nodes (15): @vue/tsconfig/tsconfig.dom.json, compilerOptions, noUncheckedIndexedAccess, paths, tsBuildInfoFile, exclude, extends, include (+7 more)

### Community 4 - "GitHub Pages Deploy Job"
Cohesion: 0.12
Nodes (16): environment, runs-on, steps, name, url, jobs, build-and-deploy, id (+8 more)

### Community 5 - "Settlement Domain Concepts"
Cohesion: 0.21
Nodes (13): Legacy Single-Page Coffee Settlement App, Allocation Matrix, Allocation System, Coffee Product Management, Coffee Settlement Calculator, Cost Management (Freight & Markup), Dashboard Summary Cards, Multi-Purchase Management (+5 more)

### Community 6 - "Vue Compat Overrides"
Cohesion: 0.14
Nodes (14): overrides, vue, @vue/compat, @vue/compiler-core, @vue/compiler-dom, @vue/compiler-sfc, @vue/compiler-ssr, @vue/compiler-vapor (+6 more)

### Community 7 - "CI Workflow Triggers"
Cohesion: 0.15
Nodes (12): concurrency, cancel-in-progress, group, name, on, push, workflow_dispatch, permissions (+4 more)

### Community 8 - "App Dependencies & Bootstrap"
Cohesion: 0.23
Nodes (7): dependencies, pinia@^3.0.4, vue-router@^5.0.3, pinia, vue-router, app, router

### Community 9 - "NPM Scripts"
Cohesion: 0.18
Nodes (11): scripts, build, build-only, dev, format, lint, lint:eslint, lint:oxlint (+3 more)

### Community 10 - "Allocation Table Component"
Cohesion: 0.22
Nodes (3): calculatePercentageAllocated(), progressClass(), purchaseStore

### Community 11 - "Oxlint Config"
Cohesion: 0.29
Nodes (6): categories, correctness, env, browser, plugins, $schema

### Community 12 - "Testing Setup"
Cohesion: 0.33
Nodes (4): vitest@^4.0.18, @vue/test-utils@^2.4.6, vitest, @vue/test-utils

### Community 13 - "Prettier Config"
Cohesion: 0.40
Nodes (4): printWidth, $schema, semi, singleQuote

## Knowledge Gaps
- **13 isolated node(s):** `@vue/tsconfig/tsconfig.dom.json`, `Vue App HTML Entry Point`, `Vue.js Logo SVG`, `Vue 3 + Vite Template`, `Vitest Unit Testing` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 141 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vue` connect `Reactivity & Allocation Logic` to `ESLint & Linting Config`, `App Dependencies & Bootstrap`, `Testing Setup`?**
  _High betweenness centrality (0.206) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `usePurchaseStore` (e.g. with `addCoffee()` and `removeCoffee()`) actually correct?**
  _`usePurchaseStore` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@vue/tsconfig/tsconfig.dom.json`, `Vue App HTML Entry Point`, `Vue.js Logo SVG` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ESLint & Linting Config` be split into smaller, more focused modules?**
  _Cohesion score 0.058001397624039136 - nodes in this community are weakly interconnected._
- **Why does `Settlement Coffee Code Review` connect `Persistence & Backup` to `Reactivity & Allocation Logic`, `Allocation Table Component`, `Settlement Domain Concepts`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Settlement Coffee Code Review` (e.g. with `Coffee Settlement Calculator` and `coffeeSettlement App`) actually correct?**
  _`Settlement Coffee Code Review` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Reactivity & Allocation Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.053544494720965306 - nodes in this community are weakly interconnected._