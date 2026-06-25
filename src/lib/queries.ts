import client from "./db";
import type {
  CardCreateInput,
  CardMoveInput,
  CardUpdateInput,
} from "./schemas";

export interface TodoCard {
  id: number;
  title: string;
  notesMarkdown: string;
  columnId: "backlog" | "today";
  position: number;
}

export interface TodoColumn {
  id: "backlog" | "today";
  name: string;
  position: number;
  cards: TodoCard[];
}

type ColumnRow = {
  id: "backlog" | "today";
  name: string;
  position: number;
};

type CardRow = {
  id: number;
  title: string;
  notes_markdown: string;
  column_id: "backlog" | "today";
  position: number;
};

function mapCard(row: CardRow): TodoCard {
  return {
    id: row.id,
    title: row.title,
    notesMarkdown: row.notes_markdown,
    columnId: row.column_id,
    position: row.position,
  };
}

export async function getBoard(): Promise<TodoColumn[]> {
  const [columnsResult, cardsResult] = await Promise.all([
    client.execute("SELECT id, name, position FROM columns_tbl ORDER BY position ASC"),
    client.execute("SELECT id, title, notes_markdown, column_id, position FROM cards ORDER BY column_id ASC, position ASC, id ASC"),
  ]);

  const columns = columnsResult.rows as unknown as ColumnRow[];
  const cards = (cardsResult.rows as unknown as CardRow[]).map(mapCard);

  return columns.map((column) => ({
    id: column.id,
    name: column.name,
    position: column.position,
    cards: cards.filter((card) => card.columnId === column.id),
  }));
}

export async function createCard(input: CardCreateInput): Promise<TodoCard> {
  const tx = await client.transaction("write");
  try {
    const countResult = await tx.execute({
      sql: "SELECT COUNT(*) as count FROM cards WHERE column_id = ?",
      args: [input.columnId],
    });
    const count = Number((countResult.rows[0] as unknown as { count: number }).count);

    const requestedPos = input.position ?? count;
    const nextPos = Math.max(0, Math.min(requestedPos, count));

    await tx.execute({
      sql: "UPDATE cards SET position = position + 1 WHERE column_id = ? AND position >= ?",
      args: [input.columnId, nextPos],
    });

    const insertResult = await tx.execute({
      sql: "INSERT INTO cards (title, notes_markdown, column_id, position) VALUES (?, ?, ?, ?)",
      args: [input.title, input.notesMarkdown, input.columnId, nextPos],
    });

    const cardResult = await tx.execute({
      sql: "SELECT id, title, notes_markdown, column_id, position FROM cards WHERE id = ?",
      args: [insertResult.lastInsertRowid!],
    });

    await tx.commit();

    const created = cardResult.rows[0] as unknown as CardRow | undefined;
    if (!created) throw new Error("Failed to create card");
    return mapCard(created);
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}

export async function updateCard(input: CardUpdateInput): Promise<TodoCard> {
  const tx = await client.transaction("write");
  try {
    const existingResult = await tx.execute({
      sql: "SELECT id, title, notes_markdown, column_id, position FROM cards WHERE id = ?",
      args: [input.id],
    });
    const existing = existingResult.rows[0] as unknown as CardRow | undefined;
    if (!existing) throw new Error("Card not found");

    const nextTitle = input.title ?? existing.title;
    const nextNotes = input.notesMarkdown ?? existing.notes_markdown;

    await tx.execute({
      sql: "UPDATE cards SET title = ?, notes_markdown = ? WHERE id = ?",
      args: [nextTitle, nextNotes, input.id],
    });

    const updatedResult = await tx.execute({
      sql: "SELECT id, title, notes_markdown, column_id, position FROM cards WHERE id = ?",
      args: [input.id],
    });

    await tx.commit();

    const updated = updatedResult.rows[0] as unknown as CardRow | undefined;
    if (!updated) throw new Error("Failed to update card");
    return mapCard(updated);
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}

export async function deleteCard(id: number): Promise<boolean> {
  const tx = await client.transaction("write");
  try {
    const existingResult = await tx.execute({
      sql: "SELECT id, title, notes_markdown, column_id, position FROM cards WHERE id = ?",
      args: [id],
    });
    const existing = existingResult.rows[0] as unknown as CardRow | undefined;
    if (!existing) {
      await tx.rollback();
      return false;
    }

    await tx.execute({ sql: "DELETE FROM cards WHERE id = ?", args: [id] });
    await tx.execute({
      sql: "UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ?",
      args: [existing.column_id, existing.position],
    });

    await tx.commit();
    return true;
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}

export async function moveCard(input: CardMoveInput): Promise<TodoCard> {
  const tx = await client.transaction("write");
  try {
    const existingResult = await tx.execute({
      sql: "SELECT id, title, notes_markdown, column_id, position FROM cards WHERE id = ?",
      args: [input.id],
    });
    const existing = existingResult.rows[0] as unknown as CardRow | undefined;
    if (!existing) throw new Error("Card not found");

    if (existing.column_id === input.targetColumnId) {
      const countResult = await tx.execute({
        sql: "SELECT COUNT(*) as count FROM cards WHERE column_id = ?",
        args: [existing.column_id],
      });
      const maxPos = Math.max(0, Number((countResult.rows[0] as unknown as { count: number }).count) - 1);
      const targetPos = Math.max(0, Math.min(input.targetPosition, maxPos));

      if (targetPos < existing.position) {
        await tx.execute({
          sql: "UPDATE cards SET position = position + 1 WHERE column_id = ? AND position >= ? AND position < ?",
          args: [existing.column_id, targetPos, existing.position],
        });
        await tx.execute({
          sql: "UPDATE cards SET position = ? WHERE id = ?",
          args: [targetPos, existing.id],
        });
      } else if (targetPos > existing.position) {
        await tx.execute({
          sql: "UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ? AND position <= ?",
          args: [existing.column_id, existing.position, targetPos],
        });
        await tx.execute({
          sql: "UPDATE cards SET position = ? WHERE id = ?",
          args: [targetPos, existing.id],
        });
      }
    } else {
      await tx.execute({
        sql: "UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ?",
        args: [existing.column_id, existing.position],
      });

      const targetCountResult = await tx.execute({
        sql: "SELECT COUNT(*) as count FROM cards WHERE column_id = ?",
        args: [input.targetColumnId],
      });
      const targetPos = Math.max(
        0,
        Math.min(input.targetPosition, Number((targetCountResult.rows[0] as unknown as { count: number }).count))
      );

      await tx.execute({
        sql: "UPDATE cards SET position = position + 1 WHERE column_id = ? AND position >= ?",
        args: [input.targetColumnId, targetPos],
      });
      await tx.execute({
        sql: "UPDATE cards SET column_id = ?, position = ? WHERE id = ?",
        args: [input.targetColumnId, targetPos, existing.id],
      });
    }

    const movedResult = await tx.execute({
      sql: "SELECT id, title, notes_markdown, column_id, position FROM cards WHERE id = ?",
      args: [input.id],
    });

    await tx.commit();

    const moved = movedResult.rows[0] as unknown as CardRow | undefined;
    if (!moved) throw new Error("Failed to move card");
    return mapCard(moved);
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}
