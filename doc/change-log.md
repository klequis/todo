# Change Log

## 2026-06-25 12:09 — Add dev:staging script

Added `dev:staging` script to `package.json` to run the dev server against the Turso staging
database. `pnpm dev` has no env vars set and falls back to local SQLite; `dev:staging` loads
`.env.staging` (Turso URL + auth token) before starting Vite.

Uses `node --env-file=.env.staging node_modules/vite/bin/vite.js dev` rather than
`node ... node_modules/.bin/vite` because the `.bin/` entry is a bash shell script that
Node cannot execute directly — the actual JS entry point is `node_modules/vite/bin/vite.js`.

Also added `tsx` as a dev dependency (required to run `scripts/migrate.ts`) and a `migrate`
script to `package.json`.

---

## 2026-06-25 11:20 — Turso / @libsql/client migration

| File | Change |
|---|---|
| `src/lib/db.ts` | Replaced `better-sqlite3` with `@libsql/client`; defaults to local file when no env vars set |
| `src/lib/migrate.ts` | New — shared `runMigration()` function (DDL + seed) |
| `src/lib/queries.ts` | All functions now `async`; uses `client.transaction()` for multi-step ops |
| `src/lib/queries-actions.ts` | Added `await` to 4 query calls |
| `src/lib/queries.test.ts` | All tests and `clean()` now async |
| `src/lib/test-setup.ts` | New — runs migration against test DB before tests |
| `vitest.config.ts` | Replaced `TODO_DB_PATH` env var with `TURSO_DATABASE_URL`, added `setupFiles` |
| `scripts/migrate.ts` | New — CLI script to run migration against any environment |
| `.gitignore` | `.env.*` now ignored, `.env.example` explicitly allowed |
| `.env.example` | New — documents required vars |
