# Agenda Feature — Implementation Plan

## Stack Context
SolidStart + `@solidjs/router`, Turso/libsql, Zod, `@kobalte/core` (dialog), CSS Modules. Follows the exact pattern already used by the todo board.

---

## Step 1 — DB Migration
Extend `src/lib/migrate.ts` with the `appointments` table and an `updated_at` trigger (matching the `cards_updated_at` trigger pattern already there). Use `strftime('%Y-%m-%dT%H:%M:%fZ', 'now')` to match existing timestamps.

## Step 2 — Schemas (`src/lib/schemas.ts`)
Add `AppointmentCreateSchema`, `AppointmentUpdateSchema`, `AppointmentDeleteSchema` + inferred types. `date` is `YYYY-MM-DD` string, `time` is nullable `HH:MM` 24h string.

## Step 3 — Queries (`src/lib/agenda-queries.ts`) *(new file)*
- `getAppointmentsByRange(startDate, endDate)` — `WHERE date BETWEEN ? AND ?`, ordered by `date, time`
- `createAppointment`, `updateAppointment`, `deleteAppointment`

## Step 4 — Query Actions (`src/lib/agenda-queries-actions.ts`) *(new file)*
Mirror the `queries-actions.ts` pattern: `query()` wrapper for the fetch, `action()` wrappers for mutations, each with `"use server"` + Zod validation + `revalidate`.

## Step 5 — Utilities (`src/lib/agenda-utils.ts`) *(new file)*
- `getWeeksForMonths(n: number | 'all'): { start: Date, end: Date }[]` — starting from the current week's Sunday, generate N months of Sun→Sat weeks
- `formatWeekHeading(start, end)` — `"Jun 15 - 20"` / `"Jun 29 - Jul 5"`
- `formatTime(hhmm: string)` — `"14:30"` → `"2:30 PM"`
- `formatDate(isoDate: string)` — `"2026-06-28"` → `"06/28/2026"` for display

## Step 6 — Components (`src/components/agenda/`) *(new directory)*

| File | Responsibility |
|---|---|
| `MonthSelector.tsx` | Segmented `[ 1 ][ 2 ][ 3 ][ All ]` toggle; emits `onChange` |
| `MaskedInput.tsx` | Lightweight controlled input enforcing `MM/DD/YYYY` or `HH:MM AM/PM` masks via `onInput` handler |
| `AppointmentForm.tsx` | Add/edit form — two `MaskedInput`s + two plain text inputs; receives optional existing appointment for edit mode |
| `AppointmentRow.tsx` | Single row: date / time / description / location + edit & delete icon buttons |
| `WeekBox.tsx` | Full-width header (date range + `+` button far-right) + `For` over `AppointmentRow`; `+` opens `AppointmentForm` in a Kobalte `Dialog` on mobile, inline on desktop |

## Step 7 — Route (`src/routes/agenda.tsx`) *(new file)*
- `createAsync` over `getAgendaQuery` keyed to `[monthCount, weekRange]`
- `MonthSelector` signal drives date range recomputation
- `For` over weeks → `WeekBox`
- Wire create / update / delete actions

## Step 8 — Navigation (`src/components/RootLayout.tsx`)
Remove `<a href="/about">About</a>`, add `<a href="/agenda">Agenda</a>`.

---

## File Checklist

```
src/lib/migrate.ts                  — add appointments table + trigger
src/lib/schemas.ts                  — add appointment schemas
src/lib/agenda-queries.ts           — NEW
src/lib/agenda-queries-actions.ts   — NEW
src/lib/agenda-utils.ts             — NEW
src/components/agenda/
  MonthSelector.tsx                 — NEW
  MaskedInput.tsx                   — NEW
  AppointmentForm.tsx               — NEW
  AppointmentRow.tsx                — NEW
  WeekBox.tsx                       — NEW
  (+ matching .module.css files)
src/routes/agenda.tsx               — NEW
src/components/RootLayout.tsx       — update nav
src/routes/about.tsx                — can be left or removed
```
