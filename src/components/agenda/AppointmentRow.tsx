import { Pencil, Trash2 } from "lucide-solid";
import type { Appointment } from "~/lib/agenda-queries";
import { formatDisplayDate, formatTime } from "~/lib/agenda-utils";
import styles from "./AppointmentRow.module.css";

interface Props {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export function AppointmentRow(props: Props) {
  return (
    <tr class={styles.row}>
      <td class={styles.cell}>{formatDisplayDate(props.appointment.date)}</td>
      <td class={styles.cell}>{formatTime(props.appointment.time)}</td>
      <td class={styles.cell}>{props.appointment.description ?? ""}</td>
      <td class={styles.cell}>{props.appointment.location ?? ""}</td>
      <td class={styles.actions}>
        <button
          type="button"
          class={styles.iconBtn}
          aria-label="Edit appointment"
          onClick={() => props.onEdit(props.appointment)}
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          class={styles.iconBtn}
          aria-label="Delete appointment"
          onClick={() => props.onDelete(props.appointment.id)}
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
