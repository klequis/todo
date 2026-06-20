// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import db from "./db";
import { createCard, deleteCard, getBoard, moveCard, updateCard } from "./queries";

function clean() {
  db.exec("DELETE FROM cards");
}

describe("todo queries", () => {
  beforeEach(clean);

  it("always has the fixed columns in order", () => {
    const board = getBoard();
    expect(board.map((c) => c.id)).toEqual(["backlog", "today"]);
    expect(board.map((c) => c.cards.length)).toEqual([0, 0]);
  });

  it("creates a card in backlog by default", () => {
    const card = createCard({
      title: "Write tests first",
      notesMarkdown: "",
      columnId: "backlog",
    });

    expect(card.position).toBe(0);

    const board = getBoard();
    expect(board[0].cards).toHaveLength(1);
    expect(board[0].cards[0].title).toBe("Write tests first");
    expect(board[1].cards).toHaveLength(0);
  });

  it("creates a card in today", () => {
    createCard({
      title: "Ship feature",
      notesMarkdown: "- run tests",
      columnId: "today",
    });

    const board = getBoard();
    expect(board[0].cards).toHaveLength(0);
    expect(board[1].cards).toHaveLength(1);
    expect(board[1].cards[0].title).toBe("Ship feature");
  });

  it("inserts at explicit position and shifts later cards", () => {
    createCard({ title: "Card A", notesMarkdown: "", columnId: "backlog" });
    createCard({ title: "Card B", notesMarkdown: "", columnId: "backlog" });

    createCard({
      title: "Card C",
      notesMarkdown: "",
      columnId: "backlog",
      position: 1,
    });

    const backlogTitles = getBoard()[0].cards.map((c) => c.title);
    expect(backlogTitles).toEqual(["Card A", "Card C", "Card B"]);
  });

  it("updates title and notes markdown", () => {
    const card = createCard({
      title: "Original title",
      notesMarkdown: "old",
      columnId: "backlog",
    });

    const updated = updateCard({
      id: card.id,
      title: "Updated title",
      notesMarkdown: "new",
    });

    expect(updated.title).toBe("Updated title");
    expect(updated.notesMarkdown).toBe("new");
    expect(getBoard()[0].cards[0].title).toBe("Updated title");
  });

  it("deletes a card and compacts positions in its column", () => {
    const a = createCard({ title: "A", notesMarkdown: "", columnId: "backlog" });
    const b = createCard({ title: "B", notesMarkdown: "", columnId: "backlog" });
    const c = createCard({ title: "C", notesMarkdown: "", columnId: "backlog" });

    expect(deleteCard(b.id)).toBe(true);

    const backlog = getBoard()[0].cards;
    expect(backlog.map((card) => card.title)).toEqual(["A", "C"]);
    expect(backlog.map((card) => card.position)).toEqual([0, 1]);

    expect(deleteCard(c.id + 1000)).toBe(false);
    expect(a.id).toBeGreaterThan(0);
  });

  it("moves within same column and reorders correctly", () => {
    const a = createCard({ title: "A", notesMarkdown: "", columnId: "backlog" });
    const b = createCard({ title: "B", notesMarkdown: "", columnId: "backlog" });
    const c = createCard({ title: "C", notesMarkdown: "", columnId: "backlog" });

    moveCard({ id: c.id, targetColumnId: "backlog", targetPosition: 0 });

    const backlog = getBoard()[0].cards;
    expect(backlog.map((card) => card.title)).toEqual(["C", "A", "B"]);
    expect(backlog.map((card) => card.position)).toEqual([0, 1, 2]);
    expect(b.id).toBeGreaterThan(a.id);
  });

  it("moves across columns and compacts source plus inserts at target position", () => {
    const a = createCard({ title: "A", notesMarkdown: "", columnId: "backlog" });
    const b = createCard({ title: "B", notesMarkdown: "", columnId: "backlog" });
    createCard({ title: "T1", notesMarkdown: "", columnId: "today" });

    moveCard({ id: a.id, targetColumnId: "today", targetPosition: 0 });

    const [backlog, today] = getBoard();
    expect(backlog.cards.map((card) => card.title)).toEqual(["B"]);
    expect(backlog.cards.map((card) => card.position)).toEqual([0]);
    expect(today.cards.map((card) => card.title)).toEqual(["A", "T1"]);
    expect(today.cards.map((card) => card.position)).toEqual([0, 1]);
  });
});
