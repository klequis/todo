# UI Updates

- The nav bar currently serves no purpose.
- The title 'Todo Board' and its sub heading 'Fixed ...' are not needed.
- On mobile, a new card should be a model that fills the entire screen.
- Add a column "Pending" as the second column so there will be, in order, Today, Pending, Backlog.



## SolidJS Ecosystem Research (AI)

**Prompt:** Look at these two links to see if there is something that can help us with the current effort as well as the rest of the application.
- https://www.solidjs.com/ecosystem
- https://primitives.solidjs.community

---

**Current Changes**

**Recommendation:** Use `@solid-primitives/media` for the mobile modal task. For bigger items, **Solid DnD** and **Kobalte** have the highest impact-to-effort ratio.

`@solid-primitives/media` — the right tool for detecting mobile screens reactively. Instead of a one-time `window.matchMedia` check, you get a signal: `const isMobile = createMediaQuery("(max-width: 768px)")`. When the user resizes, the modal behavior updates automatically.

- *action:* implement now

**Kobalte** (or **Ark UI**) — headless, accessible dialog component. The existing Portal-based modal works visually, but it lacks focus trapping and proper ARIA attributes. If you want the full-screen mobile modal to be accessible from the start, either of these provide a `Dialog` component that handles all of that.

- *action:* implement now using Kobalte

---

**Future changes?**

**`Solid DnD`** — the current drag-and-drop in `src/components/Column.tsx` is ~80 lines of manual drop-indicator tracking, drag-leave logic, and position calculation. A dedicated DnD library would cut this significantly and handle edge cases (touch drag, keyboard drag) for free.

- *action:* implement later

**`@solid-primitives/keyboard`** — add keyboard shortcuts with minimal code: Escape to cancel, Ctrl+Enter to save. The card forms have no keyboard shortcuts right now.

- *action:* needs further discussion later

**`Solid Sonner`** (toast notifications) — currently there's no user feedback on successful save/delete beyond the form disappearing. A subtle toast would help.

- *action:* implement later

**AutoAnimate** — one-line drop-in to animate card insertions, deletions, and reorders. Extremely low effort for a noticeable polish improvement.

- *action:* implement later

---

**Do not do**

**`@solid-primitives/storage`** — persist column collapsed/expanded state across page refreshes. Currently `isOpen` is reset every load.

- *action:* Do not do