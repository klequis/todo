import { Show } from "solid-js";
import { ArrowDown, ArrowRight, ArrowUp, Pencil, Trash2 } from "lucide-solid";
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

  const moveLabel = () =>
    props.columnId === "backlog" ? "Move to Today" : "Move to Backlog";

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
              <button
                type="button"
                class="btn-icon"
                title="Edit"
                aria-label="Edit card"
                onClick={props.onStartEdit}
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                class="btn-icon btn-icon--danger"
                title="Delete"
                aria-label="Delete card"
                onClick={props.onDelete}
              >
                <Trash2 size={14} />
              </button>
              <button
                type="button"
                class="btn-icon"
                title="Move up"
                aria-label="Move card up"
                disabled={props.isFirst}
                onClick={props.onMoveUp}
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                class="btn-icon"
                title="Move down"
                aria-label="Move card down"
                disabled={props.isLast}
                onClick={props.onMoveDown}
              >
                <ArrowDown size={14} />
              </button>
              <button
                type="button"
                class="btn-icon"
                title={moveLabel()}
                aria-label={moveLabel()}
                onClick={props.onMoveToOther}
              >
                <ArrowRight size={14} />
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
