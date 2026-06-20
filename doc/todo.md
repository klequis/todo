1. Foundation and data contracts - **Done**
- Confirm folder layout under src/routes, src/components, src/types, src/lib, and src/styles.
- Define base types for Card, Column, BoardViewMode, and query/action payloads.
- Create server data layer skeleton in src/lib (db, queries, queries-actions).

2. SQLite schema and migrations - **Done**
- Implement better-sqlite3 connection and data path strategy for dev/test/prod.
- Create tables for fixed columns and cards, including ordering fields.
- Add safe migration steps and seed defaults for Backlog and Today.

3. CRUD queries/actions - **Done**
- Implement query/action wrappers for create, read, update, delete, and move-card operations.
- Implement and apply shared Zod schemas from src/lib/schemas.ts.
- Ensure ordering updates are atomic and persisted.

4. Data-first test suite - **Done**
- Implement unit tests for domain logic and ordering behavior.
- Implement DB integration tests for all CRUD and move operations.
- Add smoke tests for migrations and seed defaults.

5. Route data wiring - **Done**
- Implement server query usage in src/routes/index.tsx.
- Wire actions to form submissions and mutation flows.
- Render server-backed board state and column counts.

6. Core UI scaffolding - **Done**
- Build the board shell and header controls.
- Render Backlog and Today with empty-state messaging.
- Add add-card entry point and edit/delete controls.

7. Implement CardForm create/edit flows. - **Done**

8. Implement MarkdownRenderer with sanitization. - **Done**
- Install `marked` for markdown-to-HTML parsing.
- Create `src/components/MarkdownRenderer.tsx` with a single `source: string` prop.
- Parse with `marked.parse()` using `{ async: false }` to get a synchronous string result.
- Inject the HTML via SolidJS `innerHTML` on a wrapper `<div>`.
- Sanitization approach: configure `marked` with a custom `Renderer` that strips raw `<script>` and `<iframe>` tags, and set `{ mangle: false, headerIds: false }` to avoid generating unsafe id attributes. Full DOMPurify is not needed for a single-user personal app but would be the right addition before any multi-user exposure.
- Replace the `<pre>{card.notesMarkdown}</pre>` fallback in `Card.tsx` with `<MarkdownRenderer source={card.notesMarkdown} />`.
- Add a scoped `.markdown-body` CSS class with basic prose styles (headings, lists, code blocks, links) in `src/styles/variables.css` or a colocated style.

9. Add validation and error display behavior. - **Done**

10. Drag and drop behavior - **Done**
- Add drag-and-drop within and across Backlog/Today.
- Persist new order and column placement through actions.
- Add visual drop affordances and optimistic UI feedback.

11. View modes and styling
- Implement Kanban and List view layouts using the same components.
- Persist view preference (local preference for v1 without auth).
- Apply variables-based styling from src/styles/variables.css and polish responsive behavior.

12.  Final validation and release readiness
- Run end-to-end smoke checks across multiple devices against one shared server.
- Verify spec alignment and remove out-of-scope behavior.
- Document known limitations and next-phase items.