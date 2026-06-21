import { ChevronDown, Plus } from "lucide-solid";
import styles from "./ColumnHeader.module.css";

interface Props {
  name: string;
  count: number;
  columnId: "backlog" | "today";
  isOpen: boolean;
  onToggle: () => void;
  onAddCard: () => void;
}

export function ColumnHeader(props: Props) {
  return (
    <header class={styles.columnHeader}>
      <div class={styles.columnHeaderLeft}>
        <button
          type="button"
          class={styles.addCardBtn}
          title="Add card"
          aria-label="Add card to column"
          onClick={props.onAddCard}
        >
          <Plus size={16} />
        </button>
        <h2>{props.name}</h2>
        <span
          class={styles.cardCount}
          classList={{
            [styles.cardCountToday]: props.columnId === "today",
            [styles.cardCountBacklog]: props.columnId === "backlog",
          }}
        >
          {props.count}
        </span>
      </div>
      <button
        type="button"
        class={styles.columnToggle}
        classList={{ [styles.columnToggleCollapsed]: !props.isOpen }}
        aria-label={props.isOpen ? "Collapse column" : "Expand column"}
        onClick={props.onToggle}
      >
        <ChevronDown size={18} />
      </button>
    </header>
  );
}
