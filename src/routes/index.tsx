import { Title } from "@solidjs/meta";
import { createAsync, useAction } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import {
  createCardAction,
  deleteCardAction,
  getBoardQuery,
  moveCardAction,
  updateCardAction,
} from "~/lib/queries-actions";

export default function Home() {
  const board = createAsync(() => getBoardQuery());

  const createCard = useAction(createCardAction);
  const updateCard = useAction(updateCardAction);
  const deleteCard = useAction(deleteCardAction);
  const moveCard = useAction(moveCardAction);

  const [newTitle, setNewTitle] = createSignal("");
  const [newNotes, setNewNotes] = createSignal("");
  const [newColumnId, setNewColumnId] = createSignal<"backlog" | "today">("backlog");
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [editTitle, setEditTitle] = createSignal("");
  const [editNotes, setEditNotes] = createSignal("");

  async function handleCreate(event: SubmitEvent) {
    event.preventDefault();

    const fd = new FormData();
    fd.set("title", newTitle());
    fd.set("notesMarkdown", newNotes());
    fd.set("columnId", newColumnId());

    const result = await createCard(fd);
    if (result?.ok) {
      setNewTitle("");
      setNewNotes("");
      setNewColumnId("backlog");
    }
  }

  async function handleDelete(id: number) {
    const fd = new FormData();
    fd.set("id", String(id));
    await deleteCard(fd);
  }

  function startEdit(id: number, title: string, notesMarkdown: string) {
    setEditingId(id);
    setEditTitle(title);
    setEditNotes(notesMarkdown);
  }

  async function saveEdit(id: number) {
    const fd = new FormData();
    fd.set("id", String(id));
    fd.set("title", editTitle());
    fd.set("notesMarkdown", editNotes());

    const result = await updateCard(fd);
    if (result?.ok) {
      setEditingId(null);
      setEditTitle("");
      setEditNotes("");
    }
  }

  async function handleMove(id: number, targetColumnId: "backlog" | "today", targetPosition: number) {
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

        <form class="new-card-form" onSubmit={handleCreate}>
          <input
            type="text"
            value={newTitle()}
            onInput={(e) => setNewTitle(e.currentTarget.value)}
            placeholder="Card title"
            required
            maxlength={200}
          />
          <textarea
            value={newNotes()}
            onInput={(e) => setNewNotes(e.currentTarget.value)}
            placeholder="Markdown notes"
            maxlength={20000}
          />
          <div class="new-card-actions">
            <label>
              Column
              <select
                value={newColumnId()}
                onChange={(e) => setNewColumnId(e.currentTarget.value as "backlog" | "today")}
              >
                <option value="backlog">Backlog</option>
                <option value="today">Today</option>
              </select>
            </label>
            <button type="submit">Add card</button>
          </div>
        </form>
      </section>

      <Show when={board()} fallback={<p>Loading board...</p>}>
        {(data) => (
          <section class="board-grid view-kanban">
            <For each={data()}>
              {(column) => (
                <article class="column">
                  <header class="column-header">
                    <h2>{column.name}</h2>
                    <span>{column.cards.length}</span>
                  </header>

                  <div class="column-cards">
                    <Show when={column.cards.length > 0} fallback={<p class="empty-state">No cards</p>}>
                      <For each={column.cards}>
                        {(card, index) => (
                          <div class="card">
                            <Show
                              when={editingId() === card.id}
                              fallback={
                                <>
                                  <h3>{card.title}</h3>
                                  <Show when={card.notesMarkdown.trim().length > 0}>
                                    <pre>{card.notesMarkdown}</pre>
                                  </Show>
                                </>
                              }
                            >
                              <div class="edit-form">
                                <input
                                  type="text"
                                  value={editTitle()}
                                  onInput={(e) => setEditTitle(e.currentTarget.value)}
                                  maxlength={200}
                                />
                                <textarea
                                  value={editNotes()}
                                  onInput={(e) => setEditNotes(e.currentTarget.value)}
                                  maxlength={20000}
                                />
                              </div>
                            </Show>

                            <div class="card-actions">
                              <Show when={editingId() === card.id} fallback={
                                <button
                                  type="button"
                                  onClick={() => startEdit(card.id, card.title, card.notesMarkdown)}
                                >
                                  Edit
                                </button>
                              }>
                                <>
                                  <button type="button" onClick={() => saveEdit(card.id)}>Save</button>
                                  <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                                </>
                              </Show>

                              <button type="button" onClick={() => handleDelete(card.id)}>Delete</button>

                              <button
                                type="button"
                                disabled={index() === 0}
                                onClick={() => handleMove(card.id, column.id, index() - 1)}
                              >
                                Up
                              </button>

                              <button
                                type="button"
                                disabled={index() === column.cards.length - 1}
                                onClick={() => handleMove(card.id, column.id, index() + 1)}
                              >
                                Down
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const targetColumnId = column.id === "backlog" ? "today" : "backlog";
                                  const targetColumn = data().find((c) => c.id === targetColumnId);
                                  const targetPosition = targetColumn ? targetColumn.cards.length : 0;
                                  return handleMove(card.id, targetColumnId, targetPosition);
                                }}
                              >
                                {column.id === "backlog" ? "Move to Today" : "Move to Backlog"}
                              </button>
                            </div>
                          </div>
                        )}
                      </For>
                    </Show>
                  </div>
                </article>
              )}
            </For>
          </section>
        )}
      </Show>
    </main>
  );
}
