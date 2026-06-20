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

## Deployment Compatibility Matrix

| Deployment target | better-sqlite3 support | Multi-device support | Notes |
| --- | --- | --- | --- |
| Single Node server (VPS or one container) with persistent disk | Yes | Yes | Recommended for v1. Keep one shared DB file on durable storage. |
| Multiple Node instances without shared DB | Risky | Partial/No | Each instance can diverge if they do not share one database. |
| Serverless/edge with ephemeral filesystem | No | No | Local filesystem is not durable; SQLite file will not persist reliably. |
| Multiple instances with a shared network filesystem | Possible, not preferred | Yes | Works in some setups, but SQLite file locking and performance can be tricky. |