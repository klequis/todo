import db from "./db";
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

const getColumnsStmt = db.prepare(
  "SELECT id, name, position FROM columns_tbl ORDER BY position ASC"
);
const getCardsStmt = db.prepare(
  "SELECT id, title, notes_markdown, column_id, position FROM cards ORDER BY column_id ASC, position ASC, id ASC"
);
const getCardByIdStmt = db.prepare(
  "SELECT id, title, notes_markdown, column_id, position FROM cards WHERE id = ?"
);
const updateCardStmt = db.prepare(
  "UPDATE cards SET title = ?, notes_markdown = ? WHERE id = ?"
);
const deleteCardStmt = db.prepare("DELETE FROM cards WHERE id = ?");
const getColumnCountStmt = db.prepare(
  "SELECT COUNT(*) as count FROM cards WHERE column_id = ?"
);
const shiftCardsStmt = db.prepare(
  "UPDATE cards SET position = position + 1 WHERE column_id = ? AND position >= ?"
);
const compactCardsStmt = db.prepare(
  "UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ?"
);
const shiftRangeUpStmt = db.prepare(
  "UPDATE cards SET position = position + 1 WHERE column_id = ? AND position >= ? AND position < ?"
);
const shiftRangeDownStmt = db.prepare(
  "UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ? AND position <= ?"
);
const updateCardPositionStmt = db.prepare(
  "UPDATE cards SET position = ? WHERE id = ?"
);
const updateCardColumnAndPositionStmt = db.prepare(
  "UPDATE cards SET column_id = ?, position = ? WHERE id = ?"
);
const insertCardStmt = db.prepare(
  "INSERT INTO cards (title, notes_markdown, column_id, position) VALUES (?, ?, ?, ?)"
);

function mapCard(row: CardRow): TodoCard {
  return {
    id: row.id,
    title: row.title,
    notesMarkdown: row.notes_markdown,
    columnId: row.column_id,
    position: row.position,
  };
}

export function getBoard(): TodoColumn[] {
  const columns = getColumnsStmt.all() as ColumnRow[];
  const cards = (getCardsStmt.all() as CardRow[]).map(mapCard);

  return columns.map((column) => ({
    id: column.id,
    name: column.name,
    position: column.position,
    cards: cards.filter((card) => card.columnId === column.id),
  }));
}

export function createCard(input: CardCreateInput): TodoCard {
  const tx = db.transaction((payload: CardCreateInput) => {
    const countRow = getColumnCountStmt.get(payload.columnId) as { count: number };
    const count = countRow.count;

    const requestedPos = payload.position ?? count;
    const nextPos = Math.max(0, Math.min(requestedPos, count));

    shiftCardsStmt.run(payload.columnId, nextPos);
    const result = insertCardStmt.run(
      payload.title,
      payload.notesMarkdown,
      payload.columnId,
      nextPos
    );

    const created = getCardByIdStmt.get(result.lastInsertRowid) as CardRow | undefined;
    if (!created) {
      throw new Error("Failed to create card");
    }

    return mapCard(created);
  });

  return tx(input);
}

export function updateCard(input: CardUpdateInput): TodoCard {
  const tx = db.transaction((payload: CardUpdateInput) => {
    const existing = getCardByIdStmt.get(payload.id) as CardRow | undefined;
    if (!existing) {
      throw new Error("Card not found");
    }

    const nextTitle = payload.title ?? existing.title;
    const nextNotes = payload.notesMarkdown ?? existing.notes_markdown;
    updateCardStmt.run(nextTitle, nextNotes, payload.id);

    const updated = getCardByIdStmt.get(payload.id) as CardRow | undefined;
    if (!updated) {
      throw new Error("Failed to update card");
    }

    return mapCard(updated);
  });

  return tx(input);
}

export function deleteCard(id: number): boolean {
  const tx = db.transaction((cardId: number) => {
    const existing = getCardByIdStmt.get(cardId) as CardRow | undefined;
    if (!existing) {
      return false;
    }

    deleteCardStmt.run(cardId);
    compactCardsStmt.run(existing.column_id, existing.position);
    return true;
  });

  return tx(id);
}

export function moveCard(input: CardMoveInput): TodoCard {
  const tx = db.transaction((payload: CardMoveInput) => {
    const existing = getCardByIdStmt.get(payload.id) as CardRow | undefined;
    if (!existing) {
      throw new Error("Card not found");
    }

    if (existing.column_id === payload.targetColumnId) {
      const countRow = getColumnCountStmt.get(existing.column_id) as { count: number };
      const maxPos = Math.max(0, countRow.count - 1);
      const targetPos = Math.max(0, Math.min(payload.targetPosition, maxPos));

      if (targetPos < existing.position) {
        shiftRangeUpStmt.run(existing.column_id, targetPos, existing.position);
        updateCardPositionStmt.run(targetPos, existing.id);
      } else if (targetPos > existing.position) {
        shiftRangeDownStmt.run(existing.column_id, existing.position, targetPos);
        updateCardPositionStmt.run(targetPos, existing.id);
      }
    } else {
      compactCardsStmt.run(existing.column_id, existing.position);

      const targetCountRow = getColumnCountStmt.get(payload.targetColumnId) as {
        count: number;
      };
      const targetPos = Math.max(
        0,
        Math.min(payload.targetPosition, targetCountRow.count)
      );

      shiftCardsStmt.run(payload.targetColumnId, targetPos);
      updateCardColumnAndPositionStmt.run(payload.targetColumnId, targetPos, existing.id);
    }

    const moved = getCardByIdStmt.get(payload.id) as CardRow | undefined;
    if (!moved) {
      throw new Error("Failed to move card");
    }

    return mapCard(moved);
  });

  return tx(input);
}
