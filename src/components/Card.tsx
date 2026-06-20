import { Show } from "solid-js";
import type { TodoCard } from "~/lib/queries";
import { CardForm, type SubmitResult } from "./CardForm";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Props {
  card: TodoCard;
  isFirst: boolean;
  isLast: boolean;
  columnId: "backlog" | "today";
  isEditing: boolean;
  isDragging: boolean;
  dropPosition: "before" | "after" | null;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (position: "before" | "after") => void;
  onStartEdit: () => void;
  onSaveEdit: (title: string, notes: string) => Promise<SubmitResult>;
  onCancelEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToOther: () => void;
}

export function Card(props: Props) {
  function handleDragStart(e: DragEvent) {
    if (props.isEditing) { e.preventDefault(); return; }
    e.dataTransfer!.effectAllowed = "move";
    e.dataTransfer!.setData("cardId", String(props.card.id));
    props.onDragStart();
  }

  function handleDragOver(e: DragEvent) {
    if (props.isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer!.dropEffect = "move";
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    props.onDragOver(e.clientY < rect.top + rect.height / 2 ? "before" : "after");
  }

  return (
    <div
      class="card"
      classList={{
        "card--dragging": props.isDragging,
        "card--drop-before": props.dropPosition === "before",
        "card--drop-after": props.dropPosition === "after",
      }}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={props.onDragEnd}
      onDragOver={handleDragOver}
    >
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
