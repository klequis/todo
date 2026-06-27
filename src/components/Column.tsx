import { For, Show, createEffect, createSignal } from "solid-js";
import { createMediaQuery } from "@solid-primitives/media";
import { Dialog } from "@kobalte/core/dialog";
import type { TodoCard, TodoColumn } from "~/lib/queries";
import { Card } from "./Card";
import { CardForm, type SubmitResult } from "./CardForm";
import { ColumnHeader } from "./ColumnHeader";
import styles from "./Column.module.css";

interface DropIndicator {
  cardId: number;
  position: "before" | "after";
}

interface Props {
  column: TodoColumn;
  otherColumnLength: number;
  isAddingCard: boolean;
  editingId: number | null;
  draggingCardId: number | null;
  onStartAdd: () => void;
  onSaveNewCard: (title: string, notes: string) => Promise<SubmitResult>;
  onCancelNewCard: () => void;
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
  const [isOpen, setIsOpen] = createSignal(props.column.id === "today");
  const isMobile = createMediaQuery("(max-width: 899px)");
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);
  const [dialogTitle, setDialogTitle] = createSignal("");
  const [dialogNotes, setDialogNotes] = createSignal("");

  createEffect(() => {
    if (!props.isAddingCard) setIsDialogOpen(false);
  });

  createEffect(() => {
    if (props.isAddingCard && isMobile() && !isDialogOpen()) setIsDialogOpen(true);
  });

  function handleColumnDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    setIsDragTarget(true);
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

    let insertBeforeIdx: number;
    if (indicator) {
      const idx = props.column.cards.findIndex((c) => c.id === indicator.cardId);
      insertBeforeIdx = indicator.position === "before" ? idx : idx + 1;
    } else {
      insertBeforeIdx = props.column.cards.length;
    }

    const sourceIdx = props.column.cards.findIndex((c) => c.id === cardId);
    let targetPosition: number;
    if (sourceIdx === -1) {
      targetPosition = insertBeforeIdx;
    } else {
      targetPosition = sourceIdx < insertBeforeIdx ? insertBeforeIdx - 1 : insertBeforeIdx;
      if (targetPosition === sourceIdx) return;
    }

    props.onMove(cardId, props.column.id, targetPosition);
  }

  function handlePopOut(title: string, notes: string) {
    setDialogTitle(title);
    setDialogNotes(notes);
    setIsDialogOpen(true);
  }

  function handleCancelNewCard() {
    setIsDialogOpen(false);
    props.onCancelNewCard();
  }

  async function handleSaveNewCard(title: string, notes: string): Promise<SubmitResult> {
    const result = await props.onSaveNewCard(title, notes);
    if (result.ok) setIsDialogOpen(false);
    return result;
  }

  return (
    <article
      class={styles.column}
      classList={{ [styles.dragOver]: isDragTarget(), [styles.collapsed]: !isOpen() }}
      data-column-id={props.column.id}
      onDragOver={handleColumnDragOver}
      onDragLeave={handleColumnDragLeave}
      onDrop={handleColumnDrop}
    >
      <ColumnHeader
        name={props.column.name}
        count={props.column.cards.length}
        columnId={props.column.id}
        isOpen={isOpen()}
        onToggle={() => setIsOpen((v) => !v)}
        onAddCard={props.onStartAdd}
      />

      <div class={styles.columnCards}>
        <Show when={props.isAddingCard && !isDialogOpen()}>
          <CardForm
            mode="create"
            onSubmit={handleSaveNewCard}
            onCancel={handleCancelNewCard}
            onPopOut={handlePopOut}
          />
        </Show>

        <Show
          when={props.column.cards.length > 0}
          fallback={
            <Show when={!props.isAddingCard}>
              <p class={styles.emptyState}>No cards</p>
            </Show>
          }
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

      <Dialog open={isDialogOpen()} onOpenChange={(open) => { if (!open) handleCancelNewCard(); }} modal>
        <Dialog.Portal>
          <Dialog.Overlay class={styles.dialogOverlay} />
          <Dialog.Content class={styles.dialogContent}>
            <Dialog.Title class={styles.srOnly}>New card</Dialog.Title>
            <CardForm
              mode="create"
              initialTitle={dialogTitle()}
              initialNotes={dialogNotes()}
              onSubmit={handleSaveNewCard}
              onCancel={handleCancelNewCard}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </article>
  );
}
