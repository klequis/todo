# Todo

Brief spec for a simple kanban-style todo app.

## Goal

Manage work items visually with a board that feels like GitHub Issues kanban, but smaller in scope and easier to use.

## Core Concepts

- A todo item is a card with a title and optional notes.
- Default columns are fixed to Backlog and Today.
- Cards can move between columns by drag and drop.
- Application is fully responsive using mobile-first design.

## Must Have

- Create, edit, and delete cards.
- Move cards between columns.
- Show the number of cards in each column.
- Persist data locally.
- Keep the UI fast and minimal.

## Nice To Have

- Tags or labels.
- Simple search.
- Filter by column.
- Due date or priority.

## Out Of Scope For The First Version

- Multi-user collaboration.
- Comments, assignees, and full issue tracking.
- Complex workflows or custom board rules.

## Decisions

1. Board has two fixed columns: Backlog and Today.
2. Cards should support full markdown notes.
3. Keyboard-only reordering is not required for the first version.
4. Kanban is the primary mode, and list view should also stay available.

## Technical Notes

- Build this as a SolidStart project.
- Use lucide-solid for icons.
- @kobalte/core is allowed for interactive UI primitives.

## Styling

- Global styles live in `src/app.css`.
- Design tokens and palette live in `src/styles/variables.css`.
- Use semantic variables for all colors (no hard-coded component colors).
- Support both views via layout classes:
  - `.view-kanban` for horizontal columns.
  - `.view-list` for vertical stacked columns.

### Starter Palette

- Background: `--color-bg: #f6f3ee`
- Surface: `--color-surface: #fffdf9`
- Elevated card: `--color-surface-elevated: #ffffff`
- Border: `--color-border: #d9d2c7`
- Text: `--color-text: #1f2933`
- Text muted: `--color-text-muted: #52606d`
- Primary action: `--color-primary: #0f766e`
- Primary hover: `--color-primary-hover: #0b5f59`
- Backlog accent: `--color-column-backlog: #7c8aa0`
- Today accent: `--color-column-today: #d97706`
- Success: `--color-success: #2f855a`
- Danger: `--color-danger: #c53030`
- Focus ring: `--color-focus-ring: #0f766e66`

## Folders

- Route files go in `src/routes/`
- Component files go in `src/components/`
- Shared types and interfaces go in `src/types/`
- Helper functions go in `src/lib/`
- Styles go in `src/styles/` or colocated with components

## Routes

- `/` (index)
  - Main kanban board with all columns and cards
  - Handles state management and persistence
- `/about` - About page

## Components

- `<RootLayout>`
  - Is the component for the `Router` component's `root` property
  - Wraps the entire application
- `<Column>`
  - Renders a single column with its cards
  - Handles drag-and-drop within and across columns
- `<Card>`
  - Individual todo item card
  - Shows title and preview of markdown notes
- `<CardForm>`
  - Modal or inline form for creating and editing cards
  - Supports markdown input
- `<ColumnHeader>`
  - Displays column title and card count
  - Buttons for add card, rename column, delete column
- `<MarkdownRenderer>`
  - Renders markdown notes as HTML

## Views

- **Kanban View**: Columns displayed horizontally, cards draggable within and across columns
- **List View**: Columns displayed vertically, cards nested under each column (same components, different layout)
- A toggle in the header switches between views
