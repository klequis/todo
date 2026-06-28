import { createInputMask } from "@solid-primitives/input-mask";
import { onMount } from "solid-js";
import styles from "./MaskedInput.module.css";

type MaskType = "date" | "time";

interface Props {
  mask: MaskType;
  value?: string;
  placeholder?: string;
  name: string;
  id?: string;
  onValue?: (value: string) => void;
}

const MASKS = {
  date: "99/99/9999",
  time: "99:99 aa",
} as const;

const PLACEHOLDERS = {
  date: "MM/DD/YYYY",
  time: "HH:MM AM",
} as const;

export function MaskedInput(props: Props) {
  let ref!: HTMLInputElement;
  const mask = createInputMask(MASKS[props.mask]);

  onMount(() => {
    if (props.value) ref.value = props.value;
  });

  return (
    <input
      ref={ref}
      type="text"
      id={props.id}
      name={props.name}
      class={styles.input}
      placeholder={props.placeholder ?? PLACEHOLDERS[props.mask]}
      onInput={(e) => props.onValue?.(mask(e))}
      onPaste={(e) => props.onValue?.(mask(e))}
      autocomplete="off"
      spellcheck={false}
    />
  );
}
