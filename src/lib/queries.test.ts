// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import client from "./db";
import { createCard, deleteCard, getBoard, moveCard, updateCard } from "./queries";

async function clean() {
  await client.execute("DELETE FROM cards");
}

describe("todo queries", () => {
  beforeEach(clean);

  it("always has the fixed columns in order", async () => {
    const board = await getBoard();
    expect(board.map((c) => c.id)).toEqual(["backlog", "today"]);
    expect(board.map((c) => c.cards.length)).toEqual([0, 0]);
  });

  it("creates a card in backlog by default", async () => {
    const card = await createCard({
      title: "Write tests first",
      notesMarkdown: "",
      columnId: "backlog",
    });

    expect(card.position).toBe(0);

    const board = await getBoard();
    expect(board[0].cards).toHaveLength(1);
    expect(board[0].cards[0].title).toBe("Write tests first");
    expect(board[1].cards).toHaveLength(0);
  });

  it("creates a card in today", async () => {
    await createCard({
      title: "Ship feature",
      notesMarkdown: "- run tests",
      columnId: "today",
    });

    const board = await getBoard();
    expect(board[0].cards).toHaveLength(0);
    expect(board[1].cards).toHaveLength(1);
    expect(board[1].cards[0].title).toBe("Ship feature");
  });

  it("inserts at explicit position and shifts later cards", async () => {
    await createCard({ title: "Card A", notesMarkdown: "", columnId: "backlog" });
    await createCard({ title: "Card B", notesMarkdown: "", columnId: "backlog" });

    await createCard({
      title: "Card C",
      notesMarkdown: "",
      columnId: "backlog",
      position: 1,
    });

    const backlogTitles = (await getBoard())[0].cards.map((c) => c.title);
    expect(backlogTitles).toEqual(["Card A", "Card C", "Card B"]);
  });

  it("updates title and notes markdown", async () => {
    const card = await createCard({
      title: "Original title",
      notesMarkdown: "old",
      columnId: "backlog",
    });

    const updated = await updateCard({
      id: card.id,
      title: "Updated title",
      notesMarkdown: "new",
    });

    expect(updated.title).toBe("Updated title");
    expect(updated.notesMarkdown).toBe("new");
    expect((await getBoard())[0].cards[0].title).toBe("Updated title");
  });

  it("deletes a card and compacts positions in its column", async () => {
    const a = await createCard({ title: "A", notesMarkdown: "", columnId: "backlog" });
    const b = await createCard({ title: "B", notesMarkdown: "", columnId: "backlog" });
    const c = await createCard({ title: "C", notesMarkdown: "", columnId: "backlog" });

    expect(await deleteCard(b.id)).toBe(true);

    const backlog = (await getBoard())[0].cards;
    expect(backlog.map((card) => card.title)).toEqual(["A", "C"]);
    expect(backlog.map((card) => card.position)).toEqual([0, 1]);

    expect(await deleteCard(c.id + 1000)).toBe(false);
    expect(a.id).toBeGreaterThan(0);
  });

  it("moves within same column and reorders correctly", async () => {
    const a = await createCard({ title: "A", notesMarkdown: "", columnId: "backlog" });
    const b = await createCard({ title: "B", notesMarkdown: "", columnId: "backlog" });
    const c = await createCard({ title: "C", notesMarkdown: "", columnId: "backlog" });

    await moveCard({ id: c.id, targetColumnId: "backlog", targetPosition: 0 });

    const backlog = (await getBoard())[0].cards;
    expect(backlog.map((card) => card.title)).toEqual(["C", "A", "B"]);
    expect(backlog.map((card) => card.position)).toEqual([0, 1, 2]);
    expect(b.id).toBeGreaterThan(a.id);
  });

  it("moves across columns and compacts source plus inserts at target position", async () => {
    const a = await createCard({ title: "A", notesMarkdown: "", columnId: "backlog" });
    const b = await createCard({ title: "B", notesMarkdown: "", columnId: "backlog" });
    await createCard({ title: "T1", notesMarkdown: "", columnId: "today" });

    await moveCard({ id: a.id, targetColumnId: "today", targetPosition: 0 });

    const [backlog, today] = await getBoard();
    expect(backlog.cards.map((card) => card.title)).toEqual(["B"]);
    expect(backlog.cards.map((card) => card.position)).toEqual([0]);
    expect(today.cards.map((card) => card.title)).toEqual(["A", "T1"]);
    expect(today.cards.map((card) => card.position)).toEqual([0, 1]);
    expect(b.id).toBeGreaterThan(a.id);
  });
});
