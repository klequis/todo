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
import { CardForm } from "~/components/CardForm";
import { Column } from "~/components/Column";

export default function Home() {
  const board = createAsync(() => getBoardQuery());

  const createCard = useAction(createCardAction);
  const updateCard = useAction(updateCardAction);
  const deleteCard = useAction(deleteCardAction);
  const moveCard = useAction(moveCardAction);

  const [editingId, setEditingId] = createSignal<number | null>(null);

  async function handleCreate(
    title: string,
    notesMarkdown: string,
    columnId?: "backlog" | "today"
  ): Promise<boolean> {
    const fd = new FormData();
    fd.set("title", title);
    fd.set("notesMarkdown", notesMarkdown);
    fd.set("columnId", columnId ?? "backlog");
    const result = await createCard(fd);
    return result?.ok ?? false;
  }

  async function handleDelete(id: number) {
    const fd = new FormData();
    fd.set("id", String(id));
    await deleteCard(fd);
  }

  function startEdit(card: TodoCard) {
    setEditingId(card.id);
  }

  async function saveEdit(id: number, title: string, notes: string): Promise<boolean> {
    const fd = new FormData();
    fd.set("id", String(id));
    fd.set("title", title);
    fd.set("notesMarkdown", notes);
    const result = await updateCard(fd);
    if (result?.ok) {
      setEditingId(null);
    }
    return result?.ok ?? false;
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
    <main class="page-wrap">
      <Title>Todo Board</Title>

      <section class="board-header">
        <div>
          <h1>Todo Board</h1>
          <p>Fixed columns: Backlog and Today</p>
        </div>
        <CardForm mode="create" onSubmit={handleCreate} />
      </section>

      <Show when={board()} fallback={<p>Loading board...</p>}>
        {(data) => (
          <section class="board-grid view-kanban">
            <For each={data()}>
              {(column) => {
                const otherColumn = data().find((c) => c.id !== column.id);
                return (
                  <Column
                    column={column}
                    otherColumnLength={otherColumn?.cards.length ?? 0}
                    editingId={editingId()}
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
