# coffeeSettlement

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Knowledge Graph (graphify)

This repo has a navigable knowledge graph in `graphify-out/` (interactive `graph.html`,
raw `graph.json`, and `GRAPH_REPORT.md`). It maps the code (AST) plus the docs/image
(semantic extraction) into communities, hub nodes and cross-document links.

### Update the graph after changes

Incremental — re-extract only new/changed files (fast, recommended):

```sh
graphify . --update
```

Full rebuild (re-extract everything from scratch):

```sh
graphify .
```

If a full rebuild produces fewer nodes than the existing graph (e.g. after deleting
files, or when an older graph holds stale semantic nodes), graphify refuses to shrink
`graph.json`. Force the clean rebuild with:

```sh
graphify . --force
```

Other useful commands:

```sh
graphify query "how does the settlement math work?"   # ask the graph a question
graphify explain "usePurchaseStore"                   # explain a single node
graphify . --no-viz                                   # rebuild report + JSON, skip HTML
```

> Note: `graphify-out/` lives in the working tree — add it to `.gitignore` if you don't
> want it committed.
