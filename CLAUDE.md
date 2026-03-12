# vimimin

Firefox WebExtension (Manifest V3) providing Vimperator-like keyboard navigation.

## Conventions

- TypeScript strict mode with `noUncheckedIndexedAccess` — always handle `T | undefined` from indexed access
- `verbatimModuleSyntax` — use `import type` for type-only imports
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, etc. Keep the subject line concise. Example: `feat: add fuzzy bookmark finder`
- After `npm install`, the `prepare` script configures git hooks (`.githooks/`) for commitlint
- `tslib` is a direct devDependency only because `playwright-webextext` uses it at runtime but omits it from its own `dependencies`
