# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is this?

vimimin is a Firefox WebExtension (Manifest V3) providing Vimperator-like keyboard navigation. It injects a content script on all pages and communicates with a background script for tab/state management.

## Commands

```bash
npm run build        # esbuild → dist/ (content.js, background.js, manifest, icons)
npm run dev          # live-reload dev server with web-ext + Firefox
npm run check        # biome check (format + lint)
npm run format       # biome format --write
npm run typecheck    # tsc (src + e2e)
npm run knip         # detect unused exports/imports
npm test             # vitest run (73 unit tests)
npm run test:e2e     # playwright test (25 E2E tests, requires `npm run build` first)
npm run test:watch   # vitest watch mode
```

Run a single test file: `npx vitest run src/core/mode.test.ts`
Run a single E2E spec: `npx playwright test e2e/scroll.spec.ts`

## Architecture

Two entry points bundled by esbuild (IIFE, target firefox115):

- **`src/content/`** — Content script injected on all pages. `controller.ts` is the central dispatcher that reads the current mode and delegates to the appropriate session or action.
- **`src/background/`** — Background script. Handles tab operations, per-tab enabled state (session storage), blacklist checks (local storage), and toolbar icon updates.
- **`src/core/`** — Pure logic with no DOM or browser API dependencies. All unit tests live here alongside their modules.
- **`src/shared/`** — Message types (`ContentMessage`, `BackgroundResponse`) for typed content↔background communication via `browser.runtime.sendMessage`.
- **`src/ui/`** — DOM-creating UI components (hint overlay, search bar, tab finder modal). Z-index is max safe integer.
- **`src/types/webextension.d.ts`** — Hand-written minimal type declarations for the `browser.*` APIs used.

### Key patterns

**Modes:** normal → insert / hint / search / tab-finder. Transitions are deterministic via `nextMode()` in `core/mode.ts` driven by `ModeEvent` values.

**Sessions:** `HintSession`, `SearchSession`, `TabFinderSession` each manage mode-specific state and UI lifecycle with a callback-based cleanup pattern.

**Action registry:** Actions are registered by name in `core/action-registry.ts`. Keybindings in `core/keymap.ts` map to action names, not functions directly.

**Key handler:** Supports multi-key sequences (e.g. `gg`, `;y`) with a 300ms timeout to resolve ambiguity. Special notation: `<C-d>` for Ctrl+D.

## Conventions

- Unit tests are co-located: `foo.test.ts` next to `foo.ts` in `src/core/`
- E2E tests in `e2e/` using Playwright + `playwright-webextext` on real Firefox
- TypeScript strict mode with `noUncheckedIndexedAccess` — always handle `T | undefined` from indexed access
- `verbatimModuleSyntax` — use `import type` for type-only imports
- Biome: spaces for indentation, double quotes for JS/TS
- Build copies `src/manifest.json` and `src/icons/` into `dist/` (not bundled by esbuild)
- Node.js version is pinned in `.nvmrc`
- `tslib` is a direct devDependency only because `playwright-webextext` uses it at runtime but omits it from its own `dependencies`
