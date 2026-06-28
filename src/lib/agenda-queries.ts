import client from "./db";
import type {
  AppointmentCreateInput,
  AppointmentUpdateInput,
} from "./schemas";

export interface Appointment {
  id: string;
  date: string;
  time: string | null;
  description: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

type AppointmentRow = {
  id: string;
  date: string;
  time: string | null;
  description: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
};

function mapAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    description: row.description,
    location: row.location,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAppointmentsByRange(
  startDate: string,
  endDate: string
): Promise<Appointment[]> {
  const result = await client.execute({
    sql: `SELECT id, date, time, description, location, created_at, updated_at
          FROM appointments
          WHERE date BETWEEN ? AND ?
          ORDER BY date ASC, time ASC NULLS LAST, created_at ASC`,
    args: [startDate, endDate],
  });
  return (result.rows as unknown as AppointmentRow[]).map(mapAppointment);
}

export async function createAppointment(
  input: AppointmentCreateInput
): Promise<Appointment> {
  const result = await client.execute({
    sql: `INSERT INTO appointments (date, time, description, location)
          VALUES (?, ?, ?, ?)
          RETURNING id, date, time, description, location, created_at, updated_at`,
    args: [
      input.date,
      input.time ?? null,
      input.description ?? null,
      input.location ?? null,
    ],
  });
  const row = result.rows[0] as unknown as AppointmentRow | undefined;
  if (!row) throw new Error("Failed to create appointment");
  return mapAppointment(row);
}

export async function updateAppointment(
  input: AppointmentUpdateInput
): Promise<Appointment> {
  const existing = await client.execute({
    sql: `SELECT id, date, time, description, location, created_at, updated_at
          FROM appointments WHERE id = ?`,
    args: [input.id],
  });
  const row = existing.rows[0] as unknown as AppointmentRow | undefined;
  if (!row) throw new Error("Appointment not found");

  const nextDate = input.date ?? row.date;
  const nextTime = input.time !== undefined ? (input.time ?? null) : row.time;
  const nextDescription =
    input.description !== undefined ? (input.description ?? null) : row.description;
  const nextLocation =
    input.location !== undefined ? (input.location ?? null) : row.location;

  const updated = await client.execute({
    sql: `UPDATE appointments
          SET date = ?, time = ?, description = ?, location = ?
          WHERE id = ?
          RETURNING id, date, time, description, location, created_at, updated_at`,
    args: [nextDate, nextTime, nextDescription, nextLocation, input.id],
  });
  const updatedRow = updated.rows[0] as unknown as AppointmentRow | undefined;
  if (!updatedRow) throw new Error("Failed to update appointment");
  return mapAppointment(updatedRow);
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const result = await client.execute({
    sql: "DELETE FROM appointments WHERE id = ?",
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}
