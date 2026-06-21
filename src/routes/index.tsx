import { Title } from "@solidjs/meta";
import { createAsync, useAction } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import type { TodoCard } from "~/lib/queries";
import {
  createCardAction,
  deleteCardAction,
  getBoardQuery,
  moveCardAction,
  updateCardAction,
} from "~/lib/queries-actions";
import { Column } from "~/components/Column";
import styles from "./index.module.css";

export default function Home() {
  const board = createAsync(() => getBoardQuery());

  const createCard = useAction(createCardAction);
  const updateCard = useAction(updateCardAction);
  const deleteCard = useAction(deleteCardAction);
  const moveCard = useAction(moveCardAction);

  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [draggingCardId, setDraggingCardId] = createSignal<number | null>(null);
  const [addingColumnId, setAddingColumnId] = createSignal<"backlog" | "today" | null>(null);

  async function handleCreate(
    title: string,
    notesMarkdown: string,
    columnId?: "backlog" | "today"
  ) {
    const fd = new FormData();
    fd.set("title", title);
    fd.set("notesMarkdown", notesMarkdown);
    fd.set("columnId", columnId ?? "backlog");
    return await createCard(fd) ?? { ok: false as const };
  }

  async function handleDelete(id: number) {
    const fd = new FormData();
    fd.set("id", String(id));
    await deleteCard(fd);
  }

  function startEdit(card: TodoCard) {
    setEditingId(card.id);
  }

  async function saveEdit(id: number, title: string, notes: string) {
    const fd = new FormData();
    fd.set("id", String(id));
    fd.set("title", title);
    fd.set("notesMarkdown", notes);
    const result = await updateCard(fd) ?? { ok: false as const };
    if (result.ok) setEditingId(null);
    return result;
  }

  async function handleMove(
    id: number,
    targetColumnId: "backlog" | "today",
    targetPosition: number
  ) {
    const fd = new FormData();
    fd.set("id", String(id));
    fd.set("targetColumnId", targetColumnId);
    fd.set("targetPosition", String(targetPosition));
    await moveCard(fd);
  }

  return (
    <main class={styles.pageWrap}>
      <Title>Todo Board</Title>

      <section class={styles.boardHeader}>
        <div>
          <h1>Todo Board</h1>
          <p>Fixed columns: Backlog and Today</p>
        </div>
      </section>

      <Show when={board()} fallback={<p>Loading board...</p>}>
        {(data) => (
          <section class={styles.boardGrid}>
            <For each={data()}>
              {(column) => {
                const otherColumn = data().find((c) => c.id !== column.id);
                return (
                  <Column
                    column={column}
                    otherColumnLength={otherColumn?.cards.length ?? 0}
                    isAddingCard={addingColumnId() === column.id}
                    editingId={editingId()}
                    draggingCardId={draggingCardId()}
                    onStartAdd={() => setAddingColumnId(column.id)}
                    onSaveNewCard={async (title, notes) => {
                      const result = await handleCreate(title, notes, column.id);
                      if (result.ok) setAddingColumnId(null);
                      return result;
                    }}
                    onCancelNewCard={() => setAddingColumnId(null)}
                    onDragStart={(cardId) => setDraggingCardId(cardId)}
                    onDragEnd={() => setDraggingCardId(null)}
                    onStartEdit={startEdit}
                    onSaveEdit={saveEdit}
                    onCancelEdit={() => setEditingId(null)}
                    onDelete={handleDelete}
                    onMove={handleMove}
                  />
                );
              }}
            </For>
          </section>
        )}
      </Show>
    </main>
  );
}
