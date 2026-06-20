# Implementation Plan

High-level implementation order for the Todo app.

Decision for this project: deploy as a single Node server with persistent storage for the SQLite file.

## Testing Approach

- Use Vitest with a split test strategy:
	- Unit tests for pure logic (card ordering, move rules, markdown transform behavior).
	- DB integration tests for src/lib queries and actions.
- Prefer isolated SQLite databases for test runs (temp file per test run or per test file).
- Keep DB integration tests single-threaded to avoid lock contention.
- Add explicit scripts for unit, integration, and CI test runs.

## Validation Strategy (Zod)

- Use Zod at action/query boundaries to validate all external inputs.
- Centralize schemas in src/lib/schemas.ts and reuse them across actions.
- Validate at least these operations:
	- create card
	- update card
	- delete card
	- move card (card id, target column, target index)
	- optional view-mode persistence payloads
- Keep internal domain objects typed with TypeScript and avoid repeated re-parse of trusted in-memory data.
- Return structured validation errors so the UI can render field-level messages.

Starter schema outline:

```ts
import { z } from "zod";

export const ColumnIdSchema = z.enum(["backlog", "today"]);

export const CardCreateSchema = z.object({
	title: z.string().trim().min(1).max(200),
	notesMarkdown: z.string().max(20000).default(""),
	columnId: ColumnIdSchema.default("backlog"),
	position: z.number().int().min(0).optional(),
});

export const CardUpdateSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().trim().min(1).max(200).optional(),
	notesMarkdown: z.string().max(20000).optional(),
});

export const CardDeleteSchema = z.object({
	id: z.number().int().positive(),
});

export const CardMoveSchema = z.object({
	id: z.number().int().positive(),
	targetColumnId: ColumnIdSchema,
	targetPosition: z.number().int().min(0),
});

export const ViewModeSchema = z.object({
	mode: z.enum(["kanban", "list"]),
});
```

1. Foundation and data contracts
- Confirm folder layout under src/routes, src/components, src/types, src/lib, and src/styles.
- Define base types for Card, Column, BoardViewMode, and query/action payloads.
- Create server data layer skeleton in src/lib (db, queries, queries-actions).

2. SQLite schema and migrations
- Implement better-sqlite3 connection and data path strategy for dev/test/prod.
- Create tables for fixed columns and cards, including ordering fields.
- Add safe migration steps and seed defaults for Backlog and Today.

3. CRUD queries/actions
- Implement query/action wrappers for create, read, update, delete, and move-card operations.
- Implement and apply shared Zod schemas from src/lib/schemas.ts.
- Ensure ordering updates are atomic and persisted.

4. Data-first test suite
- Implement unit tests for domain logic and ordering behavior.
- Implement DB integration tests for all CRUD and move operations.
- Add smoke tests for migrations and seed defaults.

5. Route data wiring
- Implement server query usage in src/routes/index.tsx.
- Wire actions to form submissions and mutation flows.
- Render server-backed board state and column counts.

6. Core UI scaffolding
- Build the board shell and header controls.
- Render Backlog and Today with empty-state messaging.
- Add add-card entry point and edit/delete controls.

7. Card workflows and markdown
- Implement CardForm create/edit flows.
- Implement MarkdownRenderer with sanitization.
- Add validation and error display behavior.

8. Drag and drop behavior
- Add drag-and-drop within and across Backlog/Today.
- Persist new order and column placement through actions.
- Add visual drop affordances and optimistic UI feedback.

9. View modes and styling
- Implement Kanban and List view layouts using the same components.
- Persist view preference (local preference for v1 without auth).
- Apply variables-based styling from src/styles/variables.css and polish responsive behavior.

10. Final validation and release readiness
- Run end-to-end smoke checks across multiple devices against one shared server.
- Verify spec alignment and remove out-of-scope behavior.
- Document known limitations and next-phase items.

## Deployment Compatibility Matrix

| Deployment target | better-sqlite3 support | Multi-device support | Notes |
| --- | --- | --- | --- |
| Single Node server (VPS or one container) with persistent disk | Yes | Yes | Recommended for v1. Keep one shared DB file on durable storage. |
| Multiple Node instances without shared DB | Risky | Partial/No | Each instance can diverge if they do not share one database. |
| Serverless/edge with ephemeral filesystem | No | No | Local filesystem is not durable; SQLite file will not persist reliably. |
| Multiple instances with a shared network filesystem | Possible, not preferred | Yes | Works in some setups, but SQLite file locking and performance can be tricky. |