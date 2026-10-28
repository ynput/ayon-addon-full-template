// Due dates are ISO date-times (a task's endDate attribute); these work in whole local days.

const DAY = 24 * 60 * 60 * 1000;
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Whole days from today to the date: 0 today, negative when it has passed. */
export const daysUntil = (iso: string, now = new Date()) =>
  Math.round((startOfDay(new Date(iso)).getTime() - startOfDay(now).getTime()) / DAY);

/** `3 Nov` */
export const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** `today`, `in 3 days`, `2 days late` */
export const formatDueIn = (days: number) =>
  days === 0 ? "today" : days > 0 ? `in ${plural(days, "day")}` : `${plural(-days, "day")} late`;

/** The same time of day, `days` later. */
export const addDays = (iso: string, days: number) => {
  const date = new Date(iso);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};
