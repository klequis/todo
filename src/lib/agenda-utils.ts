export interface Week {
  start: Date;
  end: Date;
  startIso: string;
  endIso: string;
  label: string;
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function sundayOfWeek(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - copy.getDay()); // getDay() 0=Sun
  return copy;
}

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatWeekLabel(start: Date, end: Date): string {
  const sm = MONTH_ABBR[start.getMonth()];
  const em = MONTH_ABBR[end.getMonth()];
  const sd = start.getDate();
  const ed = end.getDate();
  if (start.getMonth() === end.getMonth()) {
    return `${sm} ${sd} - ${ed}`;
  }
  return `${sm} ${sd} - ${em} ${ed}`;
}

export function getWeeksForMonths(monthCount: number | "all"): Week[] {
  const today = new Date();
  const weekStart = sundayOfWeek(today);

  let endBoundary: Date;
  if (monthCount === "all") {
    // Show 24 months as a practical upper bound for "all"
    endBoundary = new Date(today);
    endBoundary.setMonth(endBoundary.getMonth() + 24);
  } else {
    endBoundary = new Date(today);
    endBoundary.setMonth(endBoundary.getMonth() + monthCount);
  }

  const weeks: Week[] = [];
  const cursor = new Date(weekStart);

  while (cursor <= endBoundary) {
    const start = new Date(cursor);
    const end = new Date(cursor);
    end.setDate(end.getDate() + 6); // Saturday

    weeks.push({
      start,
      end,
      startIso: toIso(start),
      endIso: toIso(end),
      label: formatWeekLabel(start, end),
    });

    cursor.setDate(cursor.getDate() + 7);
  }

  return weeks;
}

export function formatTime(hhmm: string | null | undefined): string {
  if (!hhmm) return "";
  const [hStr, mStr] = hhmm.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, "0")}:${m} ${period}`;
}

export function formatDisplayDate(isoDate: string): string {
  // YYYY-MM-DD → MM/DD/YYYY
  const [y, m, d] = isoDate.split("-");
  return `${m}/${d}/${y}`;
}

// Parse MM/DD/YYYY form input → YYYY-MM-DD for storage
export function parseFormDate(display: string): string | null {
  const match = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, m, d, y] = match;
  return `${y}-${m}-${d}`;
}

// Parse HH:MM AM/PM form input → HH:MM 24h for storage
export function parseFormTime(display: string): string | null {
  const match = display.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let [, hStr, mStr, period] = match;
  let h = parseInt(hStr, 10);
  if (period.toUpperCase() === "PM" && h !== 12) h += 12;
  if (period.toUpperCase() === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${mStr}`;
}
