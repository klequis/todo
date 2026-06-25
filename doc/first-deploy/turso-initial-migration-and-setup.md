# Turso Initial Migration & Setup

## Overview

The app currently uses `better-sqlite3` (synchronous, native binary). This cannot run on Vercel
(Lambda). We replace it with `@libsql/client` (Turso's async client), which works with both
local SQLite files and remote Turso databases — same library everywhere, just different URLs.

**Environments:**

| Environment | DB | URL format |
|---|---|---|
| dev | local SQLite file | `file:./data/dev/todo.db` |
| staging | Turso cloud DB | `libsql://todo-staging-<org>.turso.io` |
| prod | Turso cloud DB | `libsql://todo-prod-<org>.turso.io` |

---

## Step 1 — You: Install Turso CLI and log in

```bash
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
```

Login will open a browser. Sign in with GitHub (klequis@gmail.com).

---

## Step 2 — You: Create the staging database

```bash
turso db create todo-staging
```

Then get the URL and create an auth token:

```bash
turso db show todo-staging --url
// libsql://todo-staging-klequis.aws-us-west-2.turso.io

turso db tokens create todo-staging
// saved to pwd manager
```

Save both values — you'll need them for env vars in Step 4.

---

## Step 3 — Me: Code changes

### 3a. Swap the DB client

Remove `better-sqlite3`, add `@libsql/client`:

```bash
pnpm remove better-sqlite3 @types/better-sqlite3
pnpm add @libsql/client
```

### 3b. Rewrite `src/lib/db.ts`

New `db.ts` creates a single `@libsql/client` instance using env vars:

- **dev** (no env vars set): falls back to `file:./data/dev/todo.db`
- **staging/prod**: reads `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`

Schema creation (currently in `db.ts`) moves to a standalone migration script (Step 3d).

### 3c. Rewrite `src/lib/queries.ts`

`@libsql/client` is async — all query functions must become `async`. Key changes:

- Pre-compiled `db.prepare(...)` statements → inline SQL passed to `client.execute()`
- `stmt.all()` → `(await client.execute(sql)).rows`
- `stmt.get()` → first row of `(await client.execute(sql)).rows`
- `stmt.run()` → `await client.execute({ sql, args })`
- `db.transaction(fn)` → `client.transaction()` with `tx.execute()` / `tx.commit()` / `tx.rollback()`
- `result.lastInsertRowid` → available on the execute result, same name

`queries-actions.ts` already calls async functions so no structural changes needed there.

### 3d. Create `scripts/migrate.ts`

Standalone script that runs the `CREATE TABLE IF NOT EXISTS` statements against whatever DB
the env vars point to. Run once per new database.

```bash
# After env vars are set:
pnpm tsx scripts/migrate.ts
```

---

## Step 4 — You: Set up env vars

Create a `.env.staging` file (git-ignored) with the values from Step 2:

```
TURSO_DATABASE_URL=libsql://todo-staging-<your-org>.turso.io
TURSO_AUTH_TOKEN=<token from Step 2>
```

For dev, no `.env` file is needed — the client defaults to the local SQLite file.

---

## Step 5 — Me: Run the migration against staging

With `.env.staging` in place:

```bash
pnpm tsx --env-file=.env.staging scripts/migrate.ts
```

This creates the schema on the staging Turso database.

---

## Step 6 — You: Verify in Turso dashboard

```bash
turso db shell todo-staging
> .tables
> SELECT * FROM columns_tbl;
```

Should show `backlog` and `today` rows (seeded by the migration script).

---

## Step 7 — Me: Update `.gitignore`

Add:
```
.env
.env.*
!.env.example
```

Create `.env.example` documenting required vars (no real values).

---

## What's NOT covered here (next steps)

- `prod` database setup (same process as staging)
- `dev` database for automated tests (vitest) — currently uses a separate `todo.test.db`
- Vercel env var configuration (done when we wire up the Vercel deployment)
