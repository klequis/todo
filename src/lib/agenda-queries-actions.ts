import { action, query, revalidate } from "@solidjs/router";
import {
  AppointmentCreateSchema,
  AppointmentUpdateSchema,
  AppointmentDeleteSchema,
} from "./schemas";

export const getAgendaQuery = query(
  async (startDate: string, endDate: string) => {
    "use server";
    const { getAppointmentsByRange } = await import("./agenda-queries");
    return getAppointmentsByRange(startDate, endDate);
  },
  "agenda-appointments"
);

export const createAppointmentAction = action(async (data: FormData) => {
  "use server";
  const validated = AppointmentCreateSchema.safeParse({
    date: data.get("date"),
    time: data.get("time") || null,
    description: data.get("description") || undefined,
    location: data.get("location") || undefined,
  });

  if (!validated.success) {
    return { ok: false as const, errors: validated.error.flatten().fieldErrors };
  }

  const { createAppointment } = await import("./agenda-queries");
  const appointment = await createAppointment(validated.data);
  await revalidate(getAgendaQuery.key);
  return { ok: true as const, appointment };
}, "agenda-create-appointment");

export const updateAppointmentAction = action(async (data: FormData) => {
  "use server";
  const validated = AppointmentUpdateSchema.safeParse({
    id: data.get("id"),
    date: data.get("date") || undefined,
    time: data.get("time") || null,
    description: data.get("description") || undefined,
    location: data.get("location") || undefined,
  });

  if (!validated.success) {
    return { ok: false as const, errors: validated.error.flatten().fieldErrors };
  }

  const { updateAppointment } = await import("./agenda-queries");
  const appointment = await updateAppointment(validated.data);
  await revalidate(getAgendaQuery.key);
  return { ok: true as const, appointment };
}, "agenda-update-appointment");

export const deleteAppointmentAction = action(async (data: FormData) => {
  "use server";
  const validated = AppointmentDeleteSchema.safeParse({ id: data.get("id") });

  if (!validated.success) {
    return { ok: false as const, errors: validated.error.flatten().fieldErrors };
  }

  const { deleteAppointment } = await import("./agenda-queries");
  const deleted = await deleteAppointment(validated.data.id);
  await revalidate(getAgendaQuery.key);
  return { ok: true as const, deleted };
}, "agenda-delete-appointment");
