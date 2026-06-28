import styles from "./MonthSelector.module.css";

type MonthCount = 1 | 2 | 3 | "all";

interface Props {
  value: MonthCount;
  onChange: (value: MonthCount) => void;
}

const OPTIONS: { label: string; value: MonthCount }[] = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "All", value: "all" },
];

export function MonthSelector(props: Props) {
  return (
    <div class={styles.selector} role="group" aria-label="Months to display">
      {OPTIONS.map((opt) => (
        <button
          type="button"
          class={styles.option}
          classList={{ [styles.active]: props.value === opt.value }}
          onClick={() => props.onChange(opt.value)}
          aria-pressed={props.value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export type { MonthCount };
