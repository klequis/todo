# Change Log

## 2026-06-25 14:15 — Fix Nitro preset not activating on Vercel

`vite.config.ts`: changed preset detection from `process.env.VERCEL` to `process.env.NITRO_PRESET`.

`@solidjs/vite-plugin-nitro-2` hardcodes `preset: "node-server"` in its internal config and
then spreads user config on top. This means an explicit `{ preset: "vercel" }` in user config
does override it — but only if the condition fires. `VERCEL=1` is a Vercel system env var that
is not automatically exposed to the build process, so the check was always falsy.

`NITRO_PRESET=vercel` is a custom env var added to the Vercel project (Production environment).
Custom env vars ARE available during builds. Reading it via `process.env.NITRO_PRESET` and
passing `{ preset: process.env.NITRO_PRESET }` to the plugin correctly overrides the hardcoded
`node-server` preset.

---

## 2026-06-25 13:30 — Vercel deployment prep

| File | Change |
|---|---|
| `vite.config.ts` | Nitro uses `preset: "vercel"` when `VERCEL=1` env var is present (set automatically by Vercel during build); falls back to `node-server` locally |
| `package.json` | Added `migrate:staging` and `migrate:prod` scripts; removed stale `better-sqlite3` from `pnpm.onlyBuiltDependencies` |
| `doc/first-deploy/vercel-initial-setup-and-deployment.md` | New — step-by-step deployment guide with [YOU]/[CLAUDE] ownership labels |

`migrate:staging` and `migrate:prod` use `node_modules/tsx/dist/cli.mjs` rather than
`node_modules/.bin/**tsx**` for the same reason as `vite.js` — the `.bin/` entry is a bash
shell script that Node cannot execute directly.

Turso prod database (`todo-prod`) created and migration applied via `pnpm migrate:prod`.

---

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
