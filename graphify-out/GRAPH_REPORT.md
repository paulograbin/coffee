# Graph Report - .  (2026-06-25)

## Corpus Check
- Corpus is ~12,856 words - fits in a single context window. You may not need a graph.

## Summary
- 142 nodes · 128 edges · 29 communities (24 shown, 5 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Dev Dependencies & Linting|Dev Dependencies & Linting]]
- [[_COMMUNITY_Legacy App & Requirements|Legacy App & Requirements]]
- [[_COMMUNITY_Vue Beta Overrides|Vue Beta Overrides]]
- [[_COMMUNITY_Core Dependencies|Core Dependencies]]
- [[_COMMUNITY_Build Scripts|Build Scripts]]
- [[_COMMUNITY_App TypeScript Config|App TypeScript Config]]
- [[_COMMUNITY_Vitest Config|Vitest Config]]
- [[_COMMUNITY_Oxlint Config|Oxlint Config]]
- [[_COMMUNITY_Project Entry & CICD|Project Entry & CI/CD]]
- [[_COMMUNITY_App Router & Bootstrap|App Router & Bootstrap]]
- [[_COMMUNITY_Prettier Config|Prettier Config]]
- [[_COMMUNITY_Coffee Store|Coffee Store]]
- [[_COMMUNITY_Participants Store|Participants Store]]
- [[_COMMUNITY_Root TypeScript Config|Root TypeScript Config]]
- [[_COMMUNITY_Counter Store|Counter Store]]

## God Nodes (most connected - your core abstractions)
1. `overrides` - 14 edges
2. `Legacy Single-Page Coffee Settlement App` - 13 edges
3. `scripts` - 11 edges
4. `Coffee Settlement Calculator Requirements` - 10 edges
5. `compilerOptions` - 4 edges
6. `compilerOptions` - 4 edges
7. `Vue App HTML Entry Point` - 4 edges
8. `Deploy Static Content to GitHub Pages` - 3 edges
9. `Data Persistence and Backup (FR-8)` - 3 edges
10. `env` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Legacy Single-Page Coffee Settlement App` --semantically_similar_to--> `Vue App HTML Entry Point`  [INFERRED] [semantically similar]
  old/index.html → index.html
- `Vue.js Logo SVG` --conceptually_related_to--> `Coffee Settlement Vue 3 + Vite Project`  [INFERRED]
  src/assets/logo.svg → README.md
- `Deploy Static Content to GitHub Pages` --references--> `Vue App HTML Entry Point`  [INFERRED]
  .github/workflows/static.yml → index.html
- `Coffee Settlement Vue 3 + Vite Project` --references--> `Vue App HTML Entry Point`  [INFERRED]
  README.md → index.html
- `Vue App HTML Entry Point` --conceptually_related_to--> `npm run build-only Step`  [INFERRED]
  index.html → .github/workflows/static.yml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Coffee Settlement Core Domain Model** — old_requirements_coffee_product_management, old_requirements_participant_management, old_requirements_allocation_system, old_requirements_settlement_calculation, old_requirements_cost_management [EXTRACTED 1.00]
- **CI/CD Build and Deploy Pipeline** — workflows_static_deploy_workflow, workflows_static_npm_build, workflows_static_github_pages_deployment, settlementcoffee_index_vue_app_entry [INFERRED 0.85]
- **Legacy to Vue 3 App Migration** — old_index_legacy_single_page_app, old_requirements_coffee_settlement_calculator, settlementcoffee_index_vue_app_entry, readme_coffee_settlement_project [INFERRED 0.75]

## Communities (29 total, 5 thin omitted)

### Community 0 - "Dev Dependencies & Linting"
Cohesion: 0.08
Nodes (24): devDependencies, eslint, eslint-config-prettier, eslint-plugin-oxlint, eslint-plugin-vue, jiti, jsdom, npm-run-all2 (+16 more)

### Community 1 - "Legacy App & Requirements"
Cohesion: 0.24
Nodes (14): Legacy Single-Page Coffee Settlement App, Allocation System (FR-5), Business Rules for Coffee Settlement, Client-Side Only Architecture (NFR-1), Coffee Product Management (FR-2), Coffee Settlement Calculator Requirements, Cost Management - Freight and Markup (FR-4), Dashboard (FR-7) (+6 more)

### Community 2 - "Vue Beta Overrides"
Cohesion: 0.14
Nodes (14): overrides, vue, @vue/compat, @vue/compiler-core, @vue/compiler-dom, @vue/compiler-sfc, @vue/compiler-ssr, @vue/compiler-vapor (+6 more)

### Community 3 - "Core Dependencies"
Cohesion: 0.18
Nodes (10): dependencies, pinia, vue, vue-router, engines, node, name, private (+2 more)

### Community 4 - "Build Scripts"
Cohesion: 0.18
Nodes (11): scripts, build, build-only, dev, format, lint, lint:eslint, lint:oxlint (+3 more)

### Community 5 - "App TypeScript Config"
Cohesion: 0.22
Nodes (8): compilerOptions, noUncheckedIndexedAccess, paths, tsBuildInfoFile, exclude, extends, include, @/*

### Community 6 - "Vitest Config"
Cohesion: 0.25
Nodes (7): compilerOptions, lib, tsBuildInfoFile, types, exclude, extends, include

### Community 7 - "Oxlint Config"
Cohesion: 0.29
Nodes (6): categories, correctness, env, browser, plugins, $schema

### Community 8 - "Project Entry & CI/CD"
Cohesion: 0.40
Nodes (6): Vue.js Logo SVG, Coffee Settlement Vue 3 + Vite Project, Vue App HTML Entry Point, Deploy Static Content to GitHub Pages, GitHub Pages Deployment Target, npm run build-only Step

### Community 10 - "Prettier Config"
Cohesion: 0.40
Nodes (4): printWidth, $schema, semi, singleQuote

## Knowledge Gaps
- **85 isolated node(s):** `$schema`, `plugins`, `browser`, `correctness`, `$schema` (+80 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies & Linting` to `Core Dependencies`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `overrides` connect `Vue Beta Overrides` to `Core Dependencies`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `scripts` connect `Build Scripts` to `Core Dependencies`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `Legacy Single-Page Coffee Settlement App` (e.g. with `Allocation System (FR-5)` and `Coffee Product Management (FR-2)`) actually correct?**
  _`Legacy Single-Page Coffee Settlement App` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `plugins`, `browser` to the rest of the system?**
  _87 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dev Dependencies & Linting` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Vue Beta Overrides` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._