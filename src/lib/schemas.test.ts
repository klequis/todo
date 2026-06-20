import { describe, expect, it } from "vitest";
import {
  CardCreateSchema,
  CardDeleteSchema,
  CardMoveSchema,
  CardUpdateSchema,
} from "./schemas";

describe("todo schemas", () => {
  it("validates create payload", () => {
    const result = CardCreateSchema.safeParse({
      title: "Card title",
      notesMarkdown: "notes",
      columnId: "backlog",
    });

    expect(result.success).toBe(true);
  });

  it("rejects create payload with empty title", () => {
    const result = CardCreateSchema.safeParse({
      title: "",
      notesMarkdown: "",
      columnId: "backlog",
    });

    expect(result.success).toBe(false);
  });

  it("validates update payload", () => {
    const result = CardUpdateSchema.safeParse({
      id: 1,
      notesMarkdown: "Updated",
    });

    expect(result.success).toBe(true);
  });

  it("validates move payload", () => {
    const result = CardMoveSchema.safeParse({
      id: 7,
      targetColumnId: "today",
      targetPosition: 0,
    });

    expect(result.success).toBe(true);
  });

  it("rejects move payload with bad column", () => {
    const result = CardMoveSchema.safeParse({
      id: 7,
      targetColumnId: "later",
      targetPosition: 0,
    });

    expect(result.success).toBe(false);
  });

  it("validates delete payload", () => {
    const result = CardDeleteSchema.safeParse({ id: 3 });
    expect(result.success).toBe(true);
  });
});
