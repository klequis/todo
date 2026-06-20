import { ChevronDown } from "lucide-solid";

interface Props {
  name: string;
  count: number;
  columnId: "backlog" | "today";
  isOpen: boolean;
  onToggle: () => void;
}

export function ColumnHeader(props: Props) {
  return (
    <header class="column-header">
      <div class="column-header-left">
        <h2>{props.name}</h2>
        <span class={`card-count card-count--${props.columnId}`}>{props.count}</span>
      </div>
      <button
        type="button"
        class="column-toggle"
        aria-label={props.isOpen ? "Collapse column" : "Expand column"}
        onClick={props.onToggle}
      >
        <ChevronDown size={18} />
      </button>
    </header>
  );
}
