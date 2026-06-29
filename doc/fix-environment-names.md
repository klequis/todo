## Old Table

| Vercel         | Project | Turso DB       | pnpm commands                              |
| -------------- | ------- | -------------- | ------------------------------------------ |
| Production     | prod    | `todo-prod`    | `pnpm migrate:prod`                        |
| Preview        | staging | `todo-staging` | `pnpm dev:staging`, `pnpm migrate:staging` |
| Pre-production | —       | `todo-staging` | `pnpm dev:staging`, `pnpm migrate:staging` |
| Development    | local   | local SQLite   | `pnpm dev`, `pnpm migrate`                 |

## New Table

| Vercel      | Project     | Turso DB          | pnpm commands                              | Active |
| ----------- | ----------- | ----------------- | ------------------------------------------ | ------ |
| Production  | production  | `todo-production` | `pnpm migrate:production`                  | yes    |
| Preview     | preview     | `todo-preview`    | `pnpm dev:preview`, `pnpm migrate:preview` | yes    |
| Development | development | local SQLite      | `pnpm dev`, `pnpm migrate`                 | yes    |

Notes:
- Pre-production dropped
- Turso development DB deferred — local SQLite used until further notice
- Deployed app URL kept out of git (app not yet protected)

## Changes made

- `.env.staging` → `.env.preview` (URL updated to `todo-preview`)
- `.env.production` URL updated to `todo-production`
- `package.json`: `dev:staging` → `dev:preview`, `migrate:staging` → `migrate:preview`, `migrate:prod` → `migrate:production`
- `.claude/settings.local.json`: updated allowed commands
- `README.md`: updated all tables and URLs

## Still needed (manual — you)

- Turso: rename `todo-prod` → `todo-production`
- Turso: rename `todo-staging` → `todo-preview`
- Vercel Production env var: update `TURSO_DATABASE_URL` to `todo-production` URL
- Vercel Preview env var: update `TURSO_DATABASE_URL` to `todo-preview` URL
