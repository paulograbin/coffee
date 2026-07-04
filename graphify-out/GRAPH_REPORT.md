# Graph Report - .  (2026-07-04)

## Corpus Check
- Corpus is ~16,537 words - fits in a single context window. You may not need a graph.

## Summary
- 166 nodes · 147 edges · 37 communities (29 shown, 8 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_Legacy Requirements|Legacy Requirements]]
- [[_COMMUNITY_Vue Package Overrides|Vue Package Overrides]]
- [[_COMMUNITY_Code Review Findings|Code Review Findings]]
- [[_COMMUNITY_Core Package Config|Core Package Config]]
- [[_COMMUNITY_NPM Scripts|NPM Scripts]]
- [[_COMMUNITY_App TypeScript Config|App TypeScript Config]]
- [[_COMMUNITY_Vitest TypeScript Config|Vitest TypeScript Config]]
- [[_COMMUNITY_OxLint Config|OxLint Config]]
- [[_COMMUNITY_Purchase Store|Purchase Store]]
- [[_COMMUNITY_Project Entry & Deploy|Project Entry & Deploy]]
- [[_COMMUNITY_App Router & Main|App Router & Main]]
- [[_COMMUNITY_Prettier Config|Prettier Config]]
- [[_COMMUNITY_Participants Store|Participants Store]]
- [[_COMMUNITY_Root TSConfig|Root TSConfig]]
- [[_COMMUNITY_Allocation Store|Allocation Store]]
- [[_COMMUNITY_Counter Store|Counter Store]]
- [[_COMMUNITY_Dead Code Review|Dead Code Review]]
- [[_COMMUNITY_Responsive Design Review|Responsive Design Review]]
- [[_COMMUNITY_Template Refs Review|Template Refs Review]]

## God Nodes (most connected - your core abstractions)
1. `overrides` - 14 edges
2. `Legacy Single-Page Coffee Settlement App` - 13 edges
3. `scripts` - 11 edges
4. `Coffee Settlement Calculator Requirements` - 10 edges
5. `Settlement Coffee Code Review` - 5 edges
6. `compilerOptions` - 4 edges
7. `compilerOptions` - 4 edges
8. `Vue App HTML Entry Point` - 4 edges
9. `LocalStorage Persistence Pattern Issues` - 4 edges
10. `Computed vs Functions for Reactivity` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Legacy Single-Page Coffee Settlement App` --semantically_similar_to--> `Vue App HTML Entry Point`  [INFERRED] [semantically similar]
  old/index.html → index.html
- `Vue.js Logo SVG` --conceptually_related_to--> `Coffee Settlement Vue 3 + Vite Project`  [INFERRED]
  src/assets/logo.svg → README.md
- `Deploy Static Content to GitHub Pages` --references--> `Vue App HTML Entry Point`  [INFERRED]
  .github/workflows/static.yml → index.html
- `Vue App HTML Entry Point` --conceptually_related_to--> `npm run build-only Step`  [INFERRED]
  index.html → .github/workflows/static.yml
- `Coffee Settlement Vue 3 + Vite Project` --references--> `Vue App HTML Entry Point`  [INFERRED]
  README.md → index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CI/CD Build and Deploy Pipeline** — workflows_static_deploy_workflow, workflows_static_npm_build, workflows_static_github_pages_deployment, settlementcoffee_index_vue_app_entry [INFERRED 0.85]
- **Coffee Settlement Core Domain Model** — old_requirements_coffee_product_management, old_requirements_participant_management, old_requirements_allocation_system, old_requirements_settlement_calculation, old_requirements_cost_management [EXTRACTED 1.00]
- **Legacy to Vue 3 App Migration** — old_index_legacy_single_page_app, old_requirements_coffee_settlement_calculator, settlementcoffee_index_vue_app_entry, readme_coffee_settlement_project [INFERRED 0.75]
- **Vue Reactivity and State Management Issues** — review_deep_watcher_pattern, review_computed_reactivity, review_localstorage_persistence, review_item_total_inconsistency [EXTRACTED 1.00]
- **Data Integrity and Consistency Concerns** — review_cascading_delete, review_id_collision_bug, review_type_safety_validation [EXTRACTED 1.00]
- **Pinia Store Architecture Anti-Patterns** — review_misnamed_store_exports, review_deep_watcher_pattern, review_localstorage_persistence, review_id_collision_bug [INFERRED 0.85]

## Communities (37 total, 8 thin omitted)

### Community 0 - "Dev Dependencies"
Cohesion: 0.08
Nodes (24): devDependencies, eslint, eslint-config-prettier, eslint-plugin-oxlint, eslint-plugin-vue, jiti, jsdom, npm-run-all2 (+16 more)

### Community 1 - "Legacy Requirements"
Cohesion: 0.24
Nodes (14): Legacy Single-Page Coffee Settlement App, Allocation System (FR-5), Business Rules for Coffee Settlement, Client-Side Only Architecture (NFR-1), Coffee Product Management (FR-2), Coffee Settlement Calculator Requirements, Cost Management - Freight and Markup (FR-4), Dashboard (FR-7) (+6 more)

### Community 2 - "Vue Package Overrides"
Cohesion: 0.14
Nodes (14): overrides, vue, @vue/compat, @vue/compiler-core, @vue/compiler-dom, @vue/compiler-sfc, @vue/compiler-ssr, @vue/compiler-vapor (+6 more)

### Community 3 - "Code Review Findings"
Cohesion: 0.21
Nodes (12): Cascading Delete for Data Integrity, Computed vs Functions for Reactivity, No User Feedback on CSV Import Errors, Deep Watcher Missing Bug, CostsTable Division By Zero, NextId Collision After Reload, ItemTotal Calculation Inconsistency, LocalStorage Persistence Pattern Issues (+4 more)

### Community 4 - "Core Package Config"
Cohesion: 0.18
Nodes (10): dependencies, pinia, vue, vue-router, engines, node, name, private (+2 more)

### Community 5 - "NPM Scripts"
Cohesion: 0.18
Nodes (11): scripts, build, build-only, dev, format, lint, lint:eslint, lint:oxlint (+3 more)

### Community 6 - "App TypeScript Config"
Cohesion: 0.22
Nodes (8): compilerOptions, noUncheckedIndexedAccess, paths, tsBuildInfoFile, exclude, extends, include, @/*

### Community 7 - "Vitest TypeScript Config"
Cohesion: 0.25
Nodes (7): compilerOptions, lib, tsBuildInfoFile, types, exclude, extends, include

### Community 8 - "OxLint Config"
Cohesion: 0.29
Nodes (6): categories, correctness, env, browser, plugins, $schema

### Community 9 - "Purchase Store"
Cohesion: 0.29
Nodes (6): Allocation, AllocationCalculated, Coffee, Participant, Purchase, usePurchaseStore

### Community 10 - "Project Entry & Deploy"
Cohesion: 0.40
Nodes (6): Vue.js Logo SVG, Coffee Settlement Vue 3 + Vite Project, Vue App HTML Entry Point, Deploy Static Content to GitHub Pages, GitHub Pages Deployment Target, npm run build-only Step

### Community 12 - "Prettier Config"
Cohesion: 0.40
Nodes (4): printWidth, $schema, semi, singleQuote

## Knowledge Gaps
- **90 isolated node(s):** `$schema`, `plugins`, `browser`, `correctness`, `$schema` (+85 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies` to `Core Package Config`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `overrides` connect `Vue Package Overrides` to `Core Package Config`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `scripts` connect `NPM Scripts` to `Core Package Config`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `Legacy Single-Page Coffee Settlement App` (e.g. with `Allocation System (FR-5)` and `Coffee Product Management (FR-2)`) actually correct?**
  _`Legacy Single-Page Coffee Settlement App` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `plugins`, `browser` to the rest of the system?**
  _100 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Vue Package Overrides` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._