import { For, Show, createSignal } from "solid-js";
import { createMediaQuery } from "@solid-primitives/media";
import { Dialog } from "@kobalte/core/dialog";
import { Plus } from "lucide-solid";
import type { Appointment } from "~/lib/agenda-queries";
import type { Week } from "~/lib/agenda-utils";
import { AppointmentRow } from "./AppointmentRow";
import { AppointmentForm } from "./AppointmentForm";
import styles from "./WeekBox.module.css";

interface Props {
  week: Week;
  appointments: Appointment[];
  onAdd: (data: {
    date: string;
    time: string | null;
    description: string;
    location: string;
  }) => Promise<{ ok: boolean }>;
  onEdit: (data: {
    id: string;
    date: string;
    time: string | null;
    description: string;
    location: string;
  }) => Promise<{ ok: boolean }>;
  onDelete: (id: string) => void;
}

export function WeekBox(props: Props) {
  const isMobile = createMediaQuery("(max-width: 899px)");
  const [showForm, setShowForm] = createSignal(false);
  const [editingAppointment, setEditingAppointment] = createSignal<Appointment | undefined>();
  const [dialogOpen, setDialogOpen] = createSignal(false);

  function openAdd() {
    setEditingAppointment(undefined);
    if (isMobile()) {
      setDialogOpen(true);
    } else {
      setShowForm(true);
    }
  }

  function openEdit(appt: Appointment) {
    setEditingAppointment(appt);
    if (isMobile()) {
      setDialogOpen(true);
    } else {
      setShowForm(true);
    }
  }

  function closeForm() {
    setShowForm(false);
    setDialogOpen(false);
    setEditingAppointment(undefined);
  }

  async function handleSave(data: {
    id?: string;
    date: string;
    time: string | null;
    description: string;
    location: string;
  }): Promise<{ ok: boolean }> {
    let result: { ok: boolean };
    if (data.id) {
      result = await props.onEdit({ ...data, id: data.id });
    } else {
      result = await props.onAdd(data);
    }
    if (result.ok) closeForm();
    return result;
  }

  const formEl = () => (
    <AppointmentForm
      weekStartIso={props.week.startIso}
      existing={editingAppointment()}
      onSave={handleSave}
      onCancel={closeForm}
    />
  );

  return (
    <section class={styles.box}>
      <header class={styles.header}>
        <span class={styles.label}>{props.week.label}</span>
        <button
          type="button"
          class={styles.addBtn}
          aria-label="Add appointment"
          onClick={openAdd}
        >
          <Plus size={16} />
        </button>
      </header>

      <Show when={showForm() && !isMobile()}>
        {formEl()}
      </Show>

      <Show when={props.appointments.length > 0}>
        <table class={styles.table}>
          <tbody>
            <For each={props.appointments}>
              {(appt) => (
                <AppointmentRow
                  appointment={appt}
                  onEdit={openEdit}
                  onDelete={props.onDelete}
                />
              )}
            </For>
          </tbody>
        </table>
      </Show>

      <Dialog open={dialogOpen()} onOpenChange={(open) => { if (!open) closeForm(); }} modal>
        <Dialog.Portal>
          <Dialog.Overlay class={styles.dialogOverlay} />
          <Dialog.Content class={styles.dialogContent}>
            <Dialog.Title class={styles.srOnly}>
              {editingAppointment() ? "Edit appointment" : "Add appointment"}
            </Dialog.Title>
            {formEl()}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </section>
  );
}
