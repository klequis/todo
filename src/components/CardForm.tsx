import { Show, createSignal } from "solid-js";

interface FieldErrors {
  title?: string[];
  notesMarkdown?: string[];
  columnId?: string[];
}

export interface SubmitResult {
  ok: boolean;
  errors?: FieldErrors;
}

interface Props {
  mode: "create" | "edit";
  initialTitle?: string;
  initialNotes?: string;
  onSubmit: (title: string, notesMarkdown: string, columnId?: "backlog" | "today") => Promise<SubmitResult>;
  onCancel?: () => void;
}

export function CardForm(props: Props) {
  const [title, setTitle] = createSignal(props.initialTitle ?? "");
  const [notes, setNotes] = createSignal(props.initialNotes ?? "");
  const [columnId, setColumnId] = createSignal<"backlog" | "today">("backlog");
  const [errors, setErrors] = createSignal<FieldErrors>({});

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setErrors({});
    const result = await props.onSubmit(
      title(),
      notes(),
      props.mode === "create" ? columnId() : undefined
    );
    if (result.ok && props.mode === "create") {
      setTitle("");
      setNotes("");
      setColumnId("backlog");
    } else if (!result.ok && result.errors) {
      setErrors(result.errors);
    }
  }

  return (
    <form
      class={props.mode === "edit" ? "edit-form" : "new-card-form"}
      onSubmit={handleSubmit}
    >
      <div class="form-field">
        <input
          type="text"
          value={title()}
          onInput={(e) => {
            setTitle(e.currentTarget.value);
            setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          placeholder="Card title"
          required
          maxlength={200}
          aria-invalid={!!errors().title}
        />
        <Show when={errors().title?.[0]}>
          {(msg) => <span class="field-error">{msg()}</span>}
        </Show>
      </div>

      <div class="form-field">
        <textarea
          value={notes()}
          onInput={(e) => {
            setNotes(e.currentTarget.value);
            setErrors((prev) => ({ ...prev, notesMarkdown: undefined }));
          }}
          placeholder="Markdown notes"
          maxlength={20000}
          aria-invalid={!!errors().notesMarkdown}
        />
        <Show when={errors().notesMarkdown?.[0]}>
          {(msg) => <span class="field-error">{msg()}</span>}
        </Show>
      </div>

      <div class="card-form-actions">
        <Show when={props.mode === "create"}>
          <div class="form-field">
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
            <Show when={errors().columnId?.[0]}>
              {(msg) => <span class="field-error">{msg()}</span>}
            </Show>
          </div>
        </Show>
        <button type="submit">{props.mode === "edit" ? "Save" : "Add card"}</button>
        <Show when={props.mode === "edit"}>
          <button type="button" onClick={props.onCancel}>Cancel</button>
        </Show>
      </div>
    </form>
  );
}
