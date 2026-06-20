# Initial Project Review

## What It Is

A single-user kanban todo app with two fixed columns (Backlog, Today). Built with SolidStart (SSR), better-sqlite3 for persistence, and Zod for input validation. Intended to deploy as a single Node server.

## Current State

The data layer is complete and solid:
- SQLite schema with WAL mode, FK constraints, and an `updated_at` trigger
- Ordered card positions with proper shift/compact logic, all atomic via transactions
- Zod schemas covering all four mutations (create, update, delete, move)
- SolidStart `query`/`action` wrappers that validate at the boundary before hitting the DB

The UI layer is a functional but minimal placeholder in `src/routes/index.tsx`:
- Renders both columns and all cards
- Inline edit, delete, Up/Down reorder, and cross-column move buttons work
- No drag-and-drop, no markdown rendering (notes displayed as `<pre>` text), no view toggle, no styling beyond the CSS variable foundation

Test files exist (`queries.test.ts`, `schemas.test.ts`) but appear empty — the test suite is not yet written.

## What Is Missing

Per the spec and implementation plan, steps 4–10 are outstanding:

| Step | Status |
|------|--------|
| Test suite (unit + DB integration) | Not started |
| Drag and drop | Not started |
| MarkdownRenderer component | Not started |
| CardForm modal/inline flow | Not started — edit is inline in the route |
| Kanban/List view toggle | Not started |
| Dedicated components (Card, Column, ColumnHeader) | Not extracted — all in one route file |
| Lucide icons / Kobalte primitives | Not added |
| Responsive / polished styling | Not started |

## Observations

**Strengths:**
- The data layer is well-designed — transactions are correct, position arithmetic handles edge cases, and validation is at the right boundary.
- The spec and plan are clear, which makes the gap to completion straightforward to close.

**Things to address before UI work:**
- `src/lib/queries.test.ts` and `schemas.test.ts` are empty; the plan calls for a data-first test strategy — worth filling these before adding UI complexity.
- Notes are displayed raw in a `<pre>` — a `MarkdownRenderer` with sanitization is needed before markdown input is useful.
- All UI state and rendering lives in one 220-line route file; extracting `<Column>`, `<Card>`, and `<CardForm>` components will be necessary before drag-and-drop can be added cleanly.
- No error display in the UI — action results return `{ ok: false, errors }` but the route never renders them.
