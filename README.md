# vimimin

Vimperator-like keyboard navigation for Firefox. Manifest V3 WebExtension.

## Features

- Vim-style scrolling and navigation
- Hit-a-hint link following (click, new tab, copy URL/text/markdown)
- Incremental in-page search
- Fuzzy tab finder
- Per-tab enable/disable with toolbar icon feedback
- URL pattern blacklist

## Key Bindings

### Scrolling

| Key | Action |
|-----|--------|
| `j` / `k` | Scroll down / up |
| `h` / `l` | Scroll left / right |
| `gg` / `G` | Top / bottom of page |
| `Ctrl+d` / `Ctrl+u` | Half page down / up |
| `Ctrl+f` / `Ctrl+b` | Full page down / up |

### Hints

| Key | Action |
|-----|--------|
| `f` | Click link |
| `F` | Open in new tab |
| `;y` | Copy link URL |
| `;Y` | Copy link text |
| `;m` | Copy as markdown link |

### Yank

| Key | Action |
|-----|--------|
| `y` | Copy current URL |
| `Y` | Copy as markdown link |

### Search

| Key | Action |
|-----|--------|
| `/` | Start search |
| `n` / `N` | Next / previous match |

### Tabs

| Key | Action |
|-----|--------|
| `gt` / `gT` | Next / previous tab |
| `g0` / `g$` | First / last tab |
| `d` | Close tab |
| `u` | Restore closed tab |
| `b` | Fuzzy tab finder |

### Other

| Key | Action |
|-----|--------|
| `r` | Reload page |
| `Shift+Escape` | Toggle extension on/off |
| `Escape` | Return to normal mode |

## Development

```bash
nvm use           # Node.js version is pinned in .nvmrc
npm install
npm run build     # Build to dist/
npm run dev       # Run in Firefox with live reload
npm test          # Run unit tests (vitest)
npm run test:e2e  # Run E2E tests (Playwright + Firefox, requires build first)
npm run check     # Lint and format check (Biome)
npm run typecheck # Type check (src + e2e)
```

## Requirements

- Firefox 115+
- Node.js (version pinned in `.nvmrc`)

## Notes

- `tslib` is listed as a devDependency because `playwright-webextext` depends on it at runtime but does not declare it in its own `dependencies`.
