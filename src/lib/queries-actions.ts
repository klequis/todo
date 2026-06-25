import { action, query, revalidate } from "@solidjs/router";
import {
  CardCreateSchema,
  CardDeleteSchema,
  CardMoveSchema,
  CardUpdateSchema,
} from "./schemas";

export const getBoardQuery = query(async () => {
  "use server";
  const { getBoard } = await import("./queries");
  return getBoard();
}, "todo-board");

export const createCardAction = action(async (data: FormData) => {
  "use server";
  const validated = CardCreateSchema.safeParse({
    title: data.get("title"),
    notesMarkdown: data.get("notesMarkdown") ?? "",
    columnId: data.get("columnId") ?? "backlog",
    position:
      data.get("position") !== null && data.get("position") !== ""
        ? Number(data.get("position"))
        : undefined,
  });

  if (!validated.success) {
    return {
      ok: false as const,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { createCard } = await import("./queries");
  const card = await createCard(validated.data);

  return {
    ok: true as const,
    card,
    revalidated: await revalidate(getBoardQuery.key),
  };
}, "todo-create-card");

export const updateCardAction = action(async (data: FormData) => {
  "use server";
  const validated = CardUpdateSchema.safeParse({
    id: Number(data.get("id")),
    title:
      data.get("title") !== null
        ? String(data.get("title"))
        : undefined,
    notesMarkdown:
      data.get("notesMarkdown") !== null
        ? String(data.get("notesMarkdown"))
        : undefined,
  });

  if (!validated.success) {
    return {
      ok: false as const,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { updateCard } = await import("./queries");
  const card = await updateCard(validated.data);
  return {
    ok: true as const,
    card,
    revalidated: await revalidate(getBoardQuery.key),
  };
}, "todo-update-card");

export const deleteCardAction = action(async (data: FormData) => {
  "use server";
  const validated = CardDeleteSchema.safeParse({
    id: Number(data.get("id")),
  });

  if (!validated.success) {
    return {
      ok: false as const,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { deleteCard } = await import("./queries");
  const deleted = await deleteCard(validated.data.id);
  return {
    ok: true as const,
    deleted,
    revalidated: await revalidate(getBoardQuery.key),
  };
}, "todo-delete-card");

export const moveCardAction = action(async (data: FormData) => {
  "use server";
  const validated = CardMoveSchema.safeParse({
    id: Number(data.get("id")),
    targetColumnId: data.get("targetColumnId"),
    targetPosition: Number(data.get("targetPosition")),
  });

  if (!validated.success) {
    return {
      ok: false as const,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { moveCard } = await import("./queries");
  const card = await moveCard(validated.data);
  return {
    ok: true as const,
    card,
    revalidated: await revalidate(getBoardQuery.key),
  };
}, "todo-move-card");
