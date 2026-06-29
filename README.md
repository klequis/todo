# Todo / Agenda

SolidStart app for managing tasks (board view) and appointments (agenda view).

## Environments

| Environment | DB |
|---|---|
| Local dev | `data/dev/todo.db` (SQLite file) |
| Preview | `libsql://todo-preview-klequis.aws-us-west-2.turso.io` |
| Production | `libsql://todo-production-klequis.aws-us-west-2.turso.io` |

Local dev runs at `http://localhost:3000` by default.  
Deployed app URL: see Vercel dashboard.

## Commands

### Development

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server (local SQLite) |
| `pnpm dev:preview` | Start dev server connected to preview Turso DB |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm preview` | Preview production build |

### Database

| Command | Description |
|---|---|
| `pnpm migrate` | Run migrations against local dev DB |
| `pnpm migrate:preview` | Run migrations against preview Turso DB |
| `pnpm migrate:production` | Run migrations against production Turso DB |

### Testing

| Command | Description |
|---|---|
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |

## Environment files

| File | Used by |
|---|---|
| `.env` | Local dev |
| `.env.preview` | `dev:preview`, `migrate:preview` |
| `.env.production` | `migrate:production` |

## Vercel / Turso mapping

| Vercel | Project | Turso DB | pnpm commands |
|---|---|---|---|
| Production | production | `todo-production` | `pnpm migrate:production` |
| Preview | preview | `todo-preview` | `pnpm dev:preview`, `pnpm migrate:preview` |
| Development | local | local SQLite | `pnpm dev`, `pnpm migrate` |
