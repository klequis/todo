import { z } from "zod";

export const ColumnIdSchema = z.enum(["backlog", "today"]);

export const CardCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  notesMarkdown: z.string().max(20000).default(""),
  columnId: ColumnIdSchema.default("backlog"),
  position: z.number().int().min(0).optional(),
});

export const CardUpdateSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1).max(200).optional(),
  notesMarkdown: z.string().max(20000).optional(),
});

export const CardDeleteSchema = z.object({
  id: z.number().int().positive(),
});

export const CardMoveSchema = z.object({
  id: z.number().int().positive(),
  targetColumnId: ColumnIdSchema,
  targetPosition: z.number().int().min(0),
});

export const ViewModeSchema = z.object({
  mode: z.enum(["kanban", "list"]),
});

export type CardCreateInput = z.infer<typeof CardCreateSchema>;
export type CardUpdateInput = z.infer<typeof CardUpdateSchema>;
export type CardDeleteInput = z.infer<typeof CardDeleteSchema>;
export type CardMoveInput = z.infer<typeof CardMoveSchema>;

// Appointments
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD");
const time24 = z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM").nullable().optional();

export const AppointmentCreateSchema = z.object({
  date: isoDate,
  time: time24,
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
});

export const AppointmentUpdateSchema = z.object({
  id: z.string().min(1),
  date: isoDate.optional(),
  time: time24,
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
});

export const AppointmentDeleteSchema = z.object({
  id: z.string().min(1),
});

export type AppointmentCreateInput = z.infer<typeof AppointmentCreateSchema>;
export type AppointmentUpdateInput = z.infer<typeof AppointmentUpdateSchema>;
export type AppointmentDeleteInput = z.infer<typeof AppointmentDeleteSchema>;
