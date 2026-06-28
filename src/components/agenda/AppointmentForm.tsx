import { createSignal, Show } from "solid-js";
import type { Appointment } from "~/lib/agenda-queries";
import { formatDisplayDate, formatTime, parseFormDate, parseFormTime } from "~/lib/agenda-utils";
import { MaskedInput } from "./MaskedInput";
import styles from "./AppointmentForm.module.css";

interface Props {
  weekStartIso: string;
  existing?: Appointment;
  onSave: (data: {
    id?: string;
    date: string;
    time: string | null;
    description: string;
    location: string;
  }) => Promise<{ ok: boolean }>;
  onCancel: () => void;
}

export function AppointmentForm(props: Props) {
  const existing = props.existing;

  const [dateDisplay, setDateDisplay] = createSignal(
    existing ? formatDisplayDate(existing.date) : ""
  );
  const [timeDisplay, setTimeDisplay] = createSignal(
    existing?.time ? formatTime(existing.time) : ""
  );
  const [description, setDescription] = createSignal(existing?.description ?? "");
  const [location, setLocation] = createSignal(existing?.location ?? "");
  const [error, setError] = createSignal("");
  const [saving, setSaving] = createSignal(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError("");

    const isoDate = parseFormDate(dateDisplay());
    if (!isoDate) {
      setError("Date must be MM/DD/YYYY");
      return;
    }

    const rawTime = timeDisplay().trim();
    const isoTime = rawTime ? parseFormTime(rawTime) : null;
    if (rawTime && !isoTime) {
      setError("Time must be HH:MM AM or HH:MM PM");
      return;
    }

    setSaving(true);
    const result = await props.onSave({
      id: existing?.id,
      date: isoDate,
      time: isoTime,
      description: description().trim(),
      location: location().trim(),
    });
    setSaving(false);
    if (!result.ok) setError("Failed to save. Please try again.");
  }

  return (
    <form class={styles.form} onSubmit={handleSubmit}>
      <div class={styles.row}>
        <div class={styles.field}>
          <label class={styles.label} for="appt-date">Date</label>
          <MaskedInput
            mask="date"
            name="date"
            id="appt-date"
            value={dateDisplay()}
            onValue={setDateDisplay}
          />
        </div>
        <div class={styles.field}>
          <label class={styles.label} for="appt-time">Time</label>
          <MaskedInput
            mask="time"
            name="time"
            id="appt-time"
            value={timeDisplay()}
            onValue={setTimeDisplay}
          />
        </div>
      </div>
      <div class={styles.field}>
        <label class={styles.label} for="appt-desc">Description</label>
        <input
          id="appt-desc"
          class={styles.textInput}
          type="text"
          value={description()}
          onInput={(e) => setDescription(e.currentTarget.value)}
        />
      </div>
      <div class={styles.field}>
        <label class={styles.label} for="appt-loc">Location</label>
        <input
          id="appt-loc"
          class={styles.textInput}
          type="text"
          value={location()}
          onInput={(e) => setLocation(e.currentTarget.value)}
        />
      </div>
      <Show when={error()}>
        <p class={styles.error}>{error()}</p>
      </Show>
      <div class={styles.actions}>
        <button type="button" class={styles.cancelBtn} onClick={props.onCancel}>
          Cancel
        </button>
        <button type="submit" class={styles.saveBtn} disabled={saving()}>
          {saving() ? "Saving…" : existing ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
