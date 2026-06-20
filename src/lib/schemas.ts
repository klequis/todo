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
