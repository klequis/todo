import { Show, createSignal } from "solid-js";
import { ArrowDown, ArrowRight, ArrowUp, ChevronDown, Pencil, Trash2 } from "lucide-solid";
import type { TodoCard } from "~/lib/queries";
import { CardForm, type SubmitResult } from "./CardForm";
import { MarkdownRenderer } from "./MarkdownRenderer";
import styles from "./Card.module.css";

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
  const [isExpanded, setIsExpanded] = createSignal(false);

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
      class={styles.card}
      classList={{
        [styles.dragging]: props.isDragging,
        [styles.dropBefore]: props.dropPosition === "before",
        [styles.dropAfter]: props.dropPosition === "after",
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
            <button
              type="button"
              class={styles.cardHeader}
              onClick={() => setIsExpanded((v) => !v)}
              aria-expanded={isExpanded()}
            >
              <ChevronDown
                size={14}
                class={styles.cardChevron}
                classList={{ [styles.cardChevronCollapsed]: !isExpanded() }}
              />
              <h3>{props.card.title}</h3>
            </button>
            <Show when={isExpanded()}>
              <Show when={props.card.notesMarkdown.trim().length > 0}>
                <MarkdownRenderer source={props.card.notesMarkdown} />
              </Show>
              <div class={styles.cardActions}>
                <button
                  type="button"
                  class={styles.btnIcon}
                  title="Edit"
                  aria-label="Edit card"
                  onClick={props.onStartEdit}
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  class={`${styles.btnIcon} ${styles.btnIconDanger}`}
                  title="Delete"
                  aria-label="Delete card"
                  onClick={props.onDelete}
                >
                  <Trash2 size={14} />
                </button>
                <button
                  type="button"
                  class={styles.btnIcon}
                  title="Move up"
                  aria-label="Move card up"
                  disabled={props.isFirst}
                  onClick={props.onMoveUp}
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  class={styles.btnIcon}
                  title="Move down"
                  aria-label="Move card down"
                  disabled={props.isLast}
                  onClick={props.onMoveDown}
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  class={styles.btnIcon}
                  title={moveLabel()}
                  aria-label={moveLabel()}
                  onClick={props.onMoveToOther}
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </Show>
          </>
        }
      >
        <CardForm
          mode="edit"
          initialTitle={props.card.title}
          initialNotes={props.card.notesMarkdown}
          onSubmit={props.onSaveEdit}
          onCancel={props.onCancelEdit}
        />
      </Show>
    </div>
  );
}
