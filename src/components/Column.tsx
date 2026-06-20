import { For, Show, createSignal } from "solid-js";
import type { TodoCard, TodoColumn } from "~/lib/queries";
import { Card } from "./Card";
import { ColumnHeader } from "./ColumnHeader";
import type { SubmitResult } from "./CardForm";

interface DropIndicator {
  cardId: number;
  position: "before" | "after";
}

interface Props {
  column: TodoColumn;
  otherColumnLength: number;
  editingId: number | null;
  draggingCardId: number | null;
  onDragStart: (cardId: number) => void;
  onDragEnd: () => void;
  onStartEdit: (card: TodoCard) => void;
  onSaveEdit: (id: number, title: string, notes: string) => Promise<SubmitResult>;
  onCancelEdit: () => void;
  onDelete: (id: number) => void;
  onMove: (id: number, targetColumnId: "backlog" | "today", targetPosition: number) => void;
}

export function Column(props: Props) {
  const [dropIndicator, setDropIndicator] = createSignal<DropIndicator | null>(null);
  const [isDragTarget, setIsDragTarget] = createSignal(false);

  function handleColumnDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    setIsDragTarget(true);
    // Only fires when over column background — cards call stopPropagation on dragover.
    // Clear indicator so a drop here is treated as "append at end".
    setDropIndicator(null);
  }

  function handleColumnDragLeave(e: DragEvent) {
    const related = e.relatedTarget as Node | null;
    if (related && (e.currentTarget as HTMLElement).contains(related)) return;
    setDropIndicator(null);
    setIsDragTarget(false);
  }

  function handleColumnDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragTarget(false);

    const cardId = Number(e.dataTransfer?.getData("cardId"));
    if (!cardId) return;

    const indicator = dropIndicator();
    setDropIndicator(null);

    // Visual insert-before index: 0 = before first card, cards.length = append at end.
    let insertBeforeIdx: number;
    if (indicator) {
      const idx = props.column.cards.findIndex((c) => c.id === indicator.cardId);
      insertBeforeIdx = indicator.position === "before" ? idx : idx + 1;
    } else {
      insertBeforeIdx = props.column.cards.length;
    }

    // Convert to the DB targetPosition (the card's final position in the array).
    // For same-column moves, removing the source card shifts all cards after it down by 1,
    // so the desired "insert before idx i" corresponds to targetPosition i-1 when source < i.
    const sourceIdx = props.column.cards.findIndex((c) => c.id === cardId);
    let targetPosition: number;
    if (sourceIdx === -1) {
      // Cross-column drag: source card is not in this column, no adjustment needed.
      targetPosition = insertBeforeIdx;
    } else {
      targetPosition = sourceIdx < insertBeforeIdx ? insertBeforeIdx - 1 : insertBeforeIdx;
      if (targetPosition === sourceIdx) return;
    }

    props.onMove(cardId, props.column.id, targetPosition);
  }

  return (
    <article
      class="column"
      classList={{ "drag-over": isDragTarget() }}
      onDragOver={handleColumnDragOver}
      onDragLeave={handleColumnDragLeave}
      onDrop={handleColumnDrop}
    >
      <ColumnHeader name={props.column.name} count={props.column.cards.length} />

      <div class="column-cards">
        <Show
          when={props.column.cards.length > 0}
          fallback={<p class="empty-state">No cards</p>}
        >
          <For each={props.column.cards}>
            {(card, index) => (
              <Card
                card={card}
                isFirst={index() === 0}
                isLast={index() === props.column.cards.length - 1}
                columnId={props.column.id}
                isEditing={props.editingId === card.id}
                isDragging={props.draggingCardId === card.id}
                dropPosition={
                  dropIndicator()?.cardId === card.id ? dropIndicator()!.position : null
                }
                onDragStart={() => props.onDragStart(card.id)}
                onDragEnd={props.onDragEnd}
                onDragOver={(position) => {
                  setIsDragTarget(true);
                  setDropIndicator({ cardId: card.id, position });
                }}
                onStartEdit={() => props.onStartEdit(card)}
                onSaveEdit={(title, notes) => props.onSaveEdit(card.id, title, notes)}
                onCancelEdit={props.onCancelEdit}
                onDelete={() => props.onDelete(card.id)}
                onMoveUp={() => props.onMove(card.id, props.column.id, index() - 1)}
                onMoveDown={() => props.onMove(card.id, props.column.id, index() + 1)}
                onMoveToOther={() => {
                  const targetColumnId = props.column.id === "backlog" ? "today" : "backlog";
                  props.onMove(card.id, targetColumnId, props.otherColumnLength);
                }}
              />
            )}
          </For>
        </Show>
      </div>
    </article>
  );
}
