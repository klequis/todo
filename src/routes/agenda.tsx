import { Title } from "@solidjs/meta";
import { createAsync, useAction } from "@solidjs/router";
import { For, createMemo, createSignal } from "solid-js";
import type { Appointment } from "~/lib/agenda-queries";
import {
  createAppointmentAction,
  deleteAppointmentAction,
  getAgendaQuery,
  updateAppointmentAction,
} from "~/lib/agenda-queries-actions";
import { getWeeksForMonths } from "~/lib/agenda-utils";
import { MonthSelector, type MonthCount } from "~/components/agenda/MonthSelector";
import { WeekBox } from "~/components/agenda/WeekBox";
import styles from "./agenda.module.css";

export default function AgendaPage() {
  const [monthCount, setMonthCount] = createSignal<MonthCount>(3);

  const weeks = createMemo(() => getWeeksForMonths(monthCount()));

  const startDate = createMemo(() => weeks()[0]?.startIso ?? "");
  const endDate = createMemo(() => weeks()[weeks().length - 1]?.endIso ?? "");

  const appointments = createAsync(() =>
    startDate() && endDate() ? getAgendaQuery(startDate(), endDate()) : Promise.resolve([])
  );

  const createAppt = useAction(createAppointmentAction);
  const updateAppt = useAction(updateAppointmentAction);
  const deleteAppt = useAction(deleteAppointmentAction);

  function appointmentsForWeek(startIso: string, endIso: string): Appointment[] {
    return (appointments() ?? []).filter(
      (a) => a.date >= startIso && a.date <= endIso
    );
  }

  async function handleAdd(weekStartIso: string, data: {
    date: string;
    time: string | null;
    description: string;
    location: string;
  }) {
    const fd = new FormData();
    fd.set("date", data.date || weekStartIso);
    if (data.time) fd.set("time", data.time);
    if (data.description) fd.set("description", data.description);
    if (data.location) fd.set("location", data.location);
    const result = await createAppt(fd) ?? { ok: false as const };
    return result;
  }

  async function handleEdit(data: {
    id: string;
    date: string;
    time: string | null;
    description: string;
    location: string;
  }) {
    const fd = new FormData();
    fd.set("id", data.id);
    fd.set("date", data.date);
    if (data.time) fd.set("time", data.time);
    if (data.description) fd.set("description", data.description);
    if (data.location) fd.set("location", data.location);
    const result = await updateAppt(fd) ?? { ok: false as const };
    return result;
  }

  async function handleDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    await deleteAppt(fd);
  }

  return (
    <main class={styles.page}>
      <Title>Agenda</Title>
      <div class={styles.toolbar}>
        <h1 class={styles.heading}>Agenda</h1>
        <MonthSelector value={monthCount()} onChange={setMonthCount} />
      </div>
      <div class={styles.weeks}>
        <For each={weeks()}>
          {(week) => (
            <WeekBox
              week={week}
              appointments={appointmentsForWeek(week.startIso, week.endIso)}
              onAdd={(data) => handleAdd(week.startIso, data)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </For>
      </div>
    </main>
  );
}
