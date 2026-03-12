# Development Guide

## Commands

```bash
npm run build        # esbuild → dist/ (content.js, background.js, manifest, icons)
npm run dev          # live-reload dev server with web-ext + Firefox
npm run check        # biome check (format + lint)
npm run format       # biome check --write (format + lint + autofix)
npm run lint         # biome lint only
npm run typecheck    # tsc (src + e2e)
npm run knip         # detect unused exports/imports
npm test             # vitest run
npm run test:e2e     # playwright test (builds with E2E flag automatically)
npm run test:watch   # vitest watch mode
```

Run a single test file: `npx vitest run src/core/mode.test.ts`
Run a single E2E spec: `npx playwright test e2e/scroll.spec.ts`

## Architecture

Three entry points bundled by esbuild (IIFE, target firefox115):

- **`src/content/`** — Content script injected on all pages. `controller.ts` is the central dispatcher that reads the current mode and delegates to the appropriate session or action.
- **`src/background/`** — Background script. Handles tab operations, per-tab enabled state (session storage), blacklist checks (local storage), and toolbar icon updates.
- **`src/core/`** — Pure logic with no DOM or browser API dependencies. All unit tests live here alongside their modules.
- **`src/shared/`** — Message types (`ContentMessage`, `BackgroundResponse`) for typed content↔background communication via `browser.runtime.sendMessage`.
- **`src/ui/`** — DOM-creating UI components (hint overlay, search bar, tab finder modal). Z-index is max safe integer.
- **`src/options/`** — Extension options page (blacklist configuration UI).
- **`src/types/webextension.d.ts`** — Hand-written minimal type declarations for the `browser.*` APIs used.

### Key patterns

**Modes:** normal → insert / hint / search. Transitions are deterministic via `nextMode()` in `core/mode.ts` driven by `ModeEvent` values. Tab-finder, bookmark-finder, and history-finder are Sessions that reuse the search mode.

**Sessions:** `HintSession`, `SearchSession`, `TabFinderSession`, `BookmarkFinderSession`, `HistoryFinderSession` each manage mode-specific state and UI lifecycle with a callback-based cleanup pattern.

**Action registry:** Actions are registered by name in `core/action-registry.ts`. Keybindings in `core/keymap.ts` map to action names, not functions directly.

**Key handler:** Supports multi-key sequences (e.g. `gg`, `;y`) with a 300ms timeout to resolve ambiguity. Special notation: `<C-d>` for Ctrl+D.

## Conventions

- Unit tests are co-located: `foo.test.ts` next to `foo.ts` in `src/`
- E2E tests in `e2e/` using Playwright + `playwright-webextext` on real Firefox
- Biome: spaces for indentation, double quotes for JS/TS
- Build copies `src/manifest.json` and `src/icons/` into `dist/` (not bundled by esbuild)
- Node.js version is pinned in `.nvmrc`
