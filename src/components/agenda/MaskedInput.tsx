import { createSignal, onMount } from "solid-js";
import styles from "./MaskedInput.module.css";

type MaskType = "date" | "time";

interface Props {
  mask: MaskType;
  value?: string;
  placeholder?: string;
  name: string;
  id?: string;
  onValue?: (raw: string) => void;
}

// date: MM/DD/YYYY  (10 chars)
// time: HH:MM AM   (8 chars, space + AM/PM)
const MASKS: Record<MaskType, { template: string; placeholder: string }> = {
  date: { template: "MM/DD/YYYY", placeholder: "MM/DD/YYYY" },
  time: { template: "HH:MM AM", placeholder: "HH:MM AM" },
};

function applyDateMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) out += "/";
    out += digits[i];
  }
  return out;
}

function applyTimeMask(raw: string): string {
  // Allow digits and AM/PM letters
  const cleaned = raw.replace(/[^0-9aApP mM]/g, "");
  const digits = cleaned.replace(/\D/g, "").slice(0, 4);
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2) out += ":";
    out += digits[i];
  }
  // Append AM/PM if present in the input
  const meridiem = raw.match(/\b(AM|PM)\b/i);
  if (meridiem && digits.length >= 3) {
    out += " " + meridiem[1].toUpperCase();
  }
  return out;
}

export function MaskedInput(props: Props) {
  const template = MASKS[props.mask].placeholder;
  const [display, setDisplay] = createSignal(props.value ?? "");

  function handleInput(e: InputEvent) {
    const target = e.currentTarget as HTMLInputElement;
    const raw = target.value;
    const masked = props.mask === "date" ? applyDateMask(raw) : applyTimeMask(raw);
    setDisplay(masked);
    target.value = masked;
    props.onValue?.(masked);
  }

  return (
    <input
      type="text"
      id={props.id}
      name={props.name}
      class={styles.input}
      value={display()}
      placeholder={props.placeholder ?? template}
      onInput={handleInput}
      autocomplete="off"
      spellcheck={false}
    />
  );
}
