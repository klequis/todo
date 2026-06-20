import { Show, createSignal } from "solid-js";

interface Props {
  mode: "create" | "edit";
  initialTitle?: string;
  initialNotes?: string;
  onSubmit: (title: string, notesMarkdown: string, columnId?: "backlog" | "today") => Promise<boolean>;
  onCancel?: () => void;
}

export function CardForm(props: Props) {
  const [title, setTitle] = createSignal(props.initialTitle ?? "");
  const [notes, setNotes] = createSignal(props.initialNotes ?? "");
  const [columnId, setColumnId] = createSignal<"backlog" | "today">("backlog");

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const ok = await props.onSubmit(
      title(),
      notes(),
      props.mode === "create" ? columnId() : undefined
    );
    if (ok && props.mode === "create") {
      setTitle("");
      setNotes("");
      setColumnId("backlog");
    }
  }

  return (
    <form
      class={props.mode === "edit" ? "edit-form" : "new-card-form"}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={title()}
        onInput={(e) => setTitle(e.currentTarget.value)}
        placeholder="Card title"
        required
        maxlength={200}
      />
      <textarea
        value={notes()}
        onInput={(e) => setNotes(e.currentTarget.value)}
        placeholder="Markdown notes"
        maxlength={20000}
      />
      <div class="card-form-actions">
        <Show when={props.mode === "create"}>
          <label>
            Column
            <select
              value={columnId()}
              onChange={(e) => setColumnId(e.currentTarget.value as "backlog" | "today")}
            >
              <option value="backlog">Backlog</option>
              <option value="today">Today</option>
            </select>
          </label>
        </Show>
        <button type="submit">{props.mode === "edit" ? "Save" : "Add card"}</button>
        <Show when={props.mode === "edit"}>
          <button type="button" onClick={props.onCancel}>Cancel</button>
        </Show>
      </div>
    </form>
  );
}
