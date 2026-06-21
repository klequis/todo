import { Show, createSignal } from "solid-js";
import { Maximize2 } from "lucide-solid";
import styles from "./CardForm.module.css";

interface FieldErrors {
  title?: string[];
  notesMarkdown?: string[];
}

export interface SubmitResult {
  ok: boolean;
  errors?: FieldErrors;
}

interface Props {
  mode: "create" | "edit";
  initialTitle?: string;
  initialNotes?: string;
  onSubmit: (title: string, notesMarkdown: string) => Promise<SubmitResult>;
  onCancel?: () => void;
  onPopOut?: (title: string, notes: string) => void;
}

export function CardForm(props: Props) {
  const [title, setTitle] = createSignal(props.initialTitle ?? "");
  const [notes, setNotes] = createSignal(props.initialNotes ?? "");
  const [errors, setErrors] = createSignal<FieldErrors>({});

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setErrors({});
    const result = await props.onSubmit(title(), notes());
    if (result.ok && props.mode === "create") {
      setTitle("");
      setNotes("");
    } else if (!result.ok && result.errors) {
      setErrors(result.errors);
    }
  }

  return (
    <form
      class={props.mode === "edit" ? styles.editForm : styles.newCardForm}
      onSubmit={handleSubmit}
    >
      <div class={styles.formField}>
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
          {(msg) => <span class={styles.fieldError}>{msg()}</span>}
        </Show>
      </div>

      <div class={styles.formField}>
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
          {(msg) => <span class={styles.fieldError}>{msg()}</span>}
        </Show>
      </div>

      <div class={styles.cardFormActions}>
        <button type="submit">{props.mode === "edit" ? "Save" : "Add card"}</button>
        <Show when={!!props.onCancel}>
          <button type="button" onClick={props.onCancel}>Cancel</button>
        </Show>
        <Show when={!!props.onPopOut}>
          <button
            type="button"
            class={styles.btnPopOut}
            title="Expand to modal"
            aria-label="Expand to modal"
            onClick={() => props.onPopOut!(title(), notes())}
          >
            <Maximize2 size={14} />
          </button>
        </Show>
      </div>
    </form>
  );
}
