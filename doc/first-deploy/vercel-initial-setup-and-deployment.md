# Vercel Initial Setup and Deployment

Stack: SolidStart 2.0.0-alpha.2 · Turso (SQLite) · Vercel (serverless)

Legend: **[YOU]** = you do this in a browser/terminal · **[CLAUDE]** = I make code changes

---

## Phase 1 — Vercel account ✅

**[YOU]** Create a Vercel account at https://vercel.com/signup (sign in with GitHub).

---

## Phase 2 — Prod Turso database ✅

**[YOU]** Created `todo-prod` database, got URL and token, created `.env.production`.

**[CLAUDE]** ✅ Ran `pnpm migrate:prod` — schema applied to Turso prod.

---

## Phase 3 — Code changes for Vercel ✅

**[CLAUDE]** ✅ `vite.config.ts` — Nitro uses `vercel` preset when `VERCEL=1` env var is set (Vercel sets this automatically during build):
```ts
const nitroConfig = process.env.VERCEL ? { preset: "vercel" } : {};
nitro(nitroConfig)
```

**[CLAUDE]** ✅ `package.json` — removed stale `better-sqlite3` from `onlyBuiltDependencies`; added `migrate:staging` and `migrate:prod` scripts.

---

## Phase 4 — Push to GitHub and import to Vercel

**[YOU]** Make sure all changes are committed and pushed to GitHub.

**[YOU]** Go to https://vercel.com/new, click "Continue with GitHub", find the `managing-life` (or `todo`) repository, and click "Import".

**[YOU]** On the configuration screen, add the two environment variables before clicking Deploy:

| Name | Value |
|---|---|
| `TURSO_DATABASE_URL` | the `libsql://...` URL from `.env.production` |
| `TURSO_AUTH_TOKEN` | the token from `.env.production` |

**[YOU]** Click "Deploy". Vercel will build and deploy automatically.

---

## Phase 5 — Verify

**[YOU]** Open the production URL Vercel gives you. Confirm:
- The board loads (data comes from Turso prod)
- Creating, moving, and deleting cards works
- No console errors

---

## Notes

- `pnpm dev` still uses local SQLite (`data/dev/todo.db`) — unchanged.
- `pnpm dev:staging` still uses Turso staging — unchanged.
- The Vercel deployment uses only `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` from the Vercel dashboard, never from local `.env.*` files.
- For subsequent deploys: just push to GitHub — Vercel auto-deploys on every push to `main`.
- If you want preview deployments (non-main branches) to use the staging Turso DB, add those env vars under the `preview` environment in the Vercel dashboard.
