# Project Overview

A personal kanban-style todo app. Two fixed columns — Today and Backlog — with cards that have a title and optional markdown notes. Cards can be dragged between columns and reordered. The board supports both a kanban (horizontal) and list (vertical) layout.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | SolidStart 2.0.0-alpha.2 |
| UI | SolidJS, lucide-solid icons, CSS Modules |
| Rendering | SSR via Nitro (SolidStart's server layer) |
| Database | Turso (libSQL) — local SQLite file in dev, Turso cloud in staging/prod |
| Validation | Zod |
| Markdown | `marked` (synchronous parse, custom renderer strips `<script>`/`<iframe>`) |
| Testing | Vitest |
| Deployment | Vercel (serverless) |

---

## Dev Environment Setup

**Prerequisites:** Node >= 22, pnpm

```bash
pnpm install
```

No `.env` file is needed for local development — the DB client defaults to a local SQLite file at `data/dev/todo.db`.

```bash
pnpm dev           # local SQLite, no env vars needed
pnpm dev:staging   # Turso staging DB (requires .env.staging)
pnpm test          # Vitest watch mode
pnpm test:run      # Vitest single run
pnpm build         # production build
```

`pnpm dev` uses `vite dev` directly. `pnpm dev:staging` uses `node --env-file=.env.staging node_modules/vite/bin/vite.js dev` — the `.bin/vite` entry is a bash script Node cannot execute directly, so the JS entry point is used explicitly. The same pattern applies to `migrate:staging` and `migrate:prod` with tsx.

---

## Database Environments

| Environment | Database | How it's activated |
|---|---|---|
| dev | Local SQLite (`data/dev/todo.db`) | No env vars set — client falls back to file URL |
| test | Local SQLite (`data/test/todo.test.db`) | Set by `vitest.config.ts` via `TURSO_DATABASE_URL` |
| staging | Turso cloud (`todo-staging-klequis`) | `.env.staging` with `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` |
| prod | Turso cloud (`todo-prod-klequis`) | Vercel dashboard env vars |

**Env file layout** (all git-ignored except `.env.example`):

```
.env.staging       # TURSO_DATABASE_URL + TURSO_AUTH_TOKEN for staging
.env.production    # TURSO_DATABASE_URL + TURSO_AUTH_TOKEN for prod
```

**Running migrations:**

```bash
pnpm migrate                # runs against local dev DB
pnpm migrate:staging        # requires .env.staging
pnpm migrate:prod           # requires .env.production
```

Migration is idempotent (`CREATE TABLE IF NOT EXISTS`). Safe to re-run.

---

## Data Layer

### `src/lib/db.ts`

Creates a single `@libsql/client` instance. Reads `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` from env; falls back to `file:./data/dev/todo.db` when neither is set. Enables `PRAGMA foreign_keys = ON`.

### `src/lib/schemas.ts`

Zod schemas used at all action/query boundaries:

| Schema | Validates |
|---|---|
| `ColumnIdSchema` | `"backlog" \| "today"` |
| `CardCreateSchema` | title (1–200 chars), notesMarkdown (max 20k), columnId, optional position |
| `CardUpdateSchema` | id + optional title/notesMarkdown |
| `CardDeleteSchema` | id |
| `CardMoveSchema` | id, targetColumnId, targetPosition |
| `ViewModeSchema` | `"kanban" \| "list"` |

All schemas export inferred TypeScript types (`CardCreateInput`, etc.).

### `src/lib/queries.ts`

Domain types and all DB operations. All functions are `async` (required by `@libsql/client`).

**Domain types:**
- `TodoCard` — `{ id, title, notesMarkdown, columnId, position }`
- `TodoColumn` — `{ id, name, position, cards: TodoCard[] }`

**Functions:**

| Function | Description |
|---|---|
| `getBoard()` | Fetches all columns and cards in a single parallel query pair; assembles the nested structure |
| `createCard(input)` | Inserts at the requested position; shifts other cards atomically in a transaction |
| `updateCard(input)` | Patches title and/or notes; uses a transaction to read-then-write |
| `deleteCard(id)` | Removes the card and closes the position gap in its column |
| `moveCard(input)` | Handles same-column reorder and cross-column move; all position updates are atomic |

Move logic: within a column, shifts the range between old and new position before updating the card. Across columns, closes the gap in the source column and opens one in the target column.

### `src/lib/queries-actions.ts`

SolidStart server actions that wrap the query functions. Validates input with Zod before passing to queries. This is the layer called by the UI.

### `src/lib/migrate.ts`

Shared `runMigration()` function with `CREATE TABLE IF NOT EXISTS` DDL and default seed rows for the two columns. Called by `scripts/migrate.ts`.

---

## Deployment

Deployed on Vercel as a serverless Node function.

**How the Nitro preset is activated:** `vite.config.ts` reads `process.env.NITRO_PRESET`. On Vercel, the project has `NITRO_PRESET=vercel` set as a custom env var in the dashboard. Without this, Nitro defaults to `node-server` and the build does not produce Vercel-compatible output.

`VERCEL=1` was tried first but does not work — it is a Vercel system variable that is not exposed to the build process.

**Subsequent deploys:** push to `main` — Vercel auto-deploys on every push.

---

## Feature Status

All core features are implemented:

- Card CRUD with markdown notes
- Drag-and-drop within and across columns (with optimistic UI)
- Kanban and list view with toggle (preference stored locally)
- Validation and field-level error display
- CSS Modules with a green palette and responsive layout

**Planned (not yet implemented):**

- Remove the nav bar (currently serves no purpose)
- Remove the "Todo Board" title and subtitle from the header
- Add a "Pending" column between Today and Backlog
- On mobile, new-card form should be a full-screen modal
