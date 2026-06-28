# Create Agenda by Week

## UI

### Month Selector
- Displayed at the top of the Agenda page
- Rendered as a segmented button / toggle group: [ 1 ] [ 2 ] [ 3 ] [ All ]
- Controls how many months of weeks are displayed
- Default: 3 months

### Week Boxes
- Weeks are defined as Sunday through Saturday
- Each week is contained in a box
- Each week box has a full-width header:
  - Date range label aligned left
  - '+' button aligned far right
- Heading format:
  - Same month: `Jun 15 - 20`
  - Spanning two months: `Jun 29 - Jul 5`
  - Year is not shown
- The week boxes are arranged vertically
- In this spec the boxes will be called "week box(es)"
- A week box will have 0 or more rows
- Each row (appointment) has 4 columns:
  1. Date: MM/DD/YYYY
  2. Time: HH:MM AM/PM
  3. Description: string
  4. Location: string
- The box contents will NOT have column headings

### Add Appointment Form
- Clicking '+' in a week box header opens a form to add a new appointment for that week
- Date and time are separate inputs, both masked:
  - Date mask: `MM/DD/YYYY`
  - Time mask: `HH:MM AM/PM`
- Required fields: TBD
- On mobile (≤ 899 px) the form opens as a dialog (consistent with existing Column behavior)

### Edit & Delete
- Existing appointments can be edited and deleted

## Navigation
- "About" will be removed from the application navigation menu
- "Agenda" will be added to the application navigation menu

## Data Storage

### Database
- Turso DB (already configured in project)

### Schema

```sql
CREATE TABLE appointments (
  id          TEXT    PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  date        TEXT    NOT NULL,   -- YYYY-MM-DD
  time        TEXT,               -- HH:MM 24h, nullable
  description TEXT,
  location    TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

- `date` stored as `YYYY-MM-DD`; week ranges queried with `BETWEEN`
- `time` stored as 24h `HH:MM`, formatted to `HH:MM AM/PM` on display
- Week column is not stored; it is derived from `date` at query time

## Print Functionality
- Prints to US Letter 8.5 × 11
