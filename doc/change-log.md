# Change Log

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
