import { Show } from "solid-js";
import type { TodoCard } from "~/lib/queries";
import { CardForm } from "./CardForm";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Props {
  card: TodoCard;
  isFirst: boolean;
  isLast: boolean;
  columnId: "backlog" | "today";
  isEditing: boolean;
  onStartEdit: () => void;
  onSaveEdit: (title: string, notes: string) => Promise<boolean>;
  onCancelEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToOther: () => void;
}

export function Card(props: Props) {
  return (
    <div class="card">
      <Show
        when={props.isEditing}
        fallback={
          <>
            <h3>{props.card.title}</h3>
            <Show when={props.card.notesMarkdown.trim().length > 0}>
              <MarkdownRenderer source={props.card.notesMarkdown} />
            </Show>
            <div class="card-actions">
              <button type="button" onClick={props.onStartEdit}>Edit</button>
              <button type="button" onClick={props.onDelete}>Delete</button>
              <button type="button" disabled={props.isFirst} onClick={props.onMoveUp}>Up</button>
              <button type="button" disabled={props.isLast} onClick={props.onMoveDown}>Down</button>
              <button type="button" onClick={props.onMoveToOther}>
                {props.columnId === "backlog" ? "Move to Today" : "Move to Backlog"}
              </button>
            </div>
          </>
        }
      >
        <CardForm
          mode="edit"
          initialTitle={props.card.title}
          initialNotes={props.card.notesMarkdown}
          onSubmit={(title, notes) => props.onSaveEdit(title, notes)}
          onCancel={props.onCancelEdit}
        />
      </Show>
    </div>
  );
}
