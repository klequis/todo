import { For, Show } from "solid-js";
import type { TodoCard, TodoColumn } from "~/lib/queries";
import { Card } from "./Card";
import { ColumnHeader } from "./ColumnHeader";

interface Props {
  column: TodoColumn;
  otherColumnLength: number;
  editingId: number | null;
  onStartEdit: (card: TodoCard) => void;
  onSaveEdit: (id: number, title: string, notes: string) => Promise<boolean>;
  onCancelEdit: () => void;
  onDelete: (id: number) => void;
  onMove: (id: number, targetColumnId: "backlog" | "today", targetPosition: number) => void;
}

export function Column(props: Props) {
  return (
    <article class="column">
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
