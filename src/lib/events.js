export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Clothing Drive",
  "Food Distribution",
  "Blood Drive",
  "Education",
  "Health Camp",
  "Mentorship",
  "Other",
];

export const EVENT_TYPE_STYLES = {
  Cleanup: "badge-success",
  Plantation: "badge-success",
  Donation: "badge-warning",
  "Clothing Drive": "badge-warning",
  "Food Distribution": "badge-warning",
  "Blood Drive": "badge-error",
  "Education": "badge-info",
  "Health Camp": "badge-info",
  "Mentorship": "badge-accent",
  Other: "badge-neutral",
};

export const EVENT_TYPE_ICONS = {
  Cleanup: "M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13",
  Plantation: "M12 21v-7m0 0a5 5 0 0 0 5-5c0-3-2-6-5-6s-5 3-5 6a5 5 0 0 0 5 5Z",
  Donation: "M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z",
  "Clothing Drive": "M8 4 4 7l2 4 2-1v10h8V10l2 1 2-4-4-3-4 3-4-3Z",
  "Food Distribution": "M5 8h14l-1.5 12h-11L5 8Zm3 0a4 4 0 0 1 8 0",
  "Blood Drive": "M12 21s-7-5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5-7 10-7 10Z",
  Education: "M4 9 12 5l8 4-8 4-8-4Zm3 3v5c0 1.5 2.5 2.5 5 2.5s5-1 5-2.5v-5",
  "Health Camp": "M12 6v12M6 12h12",
  "Mentorship": "M12 2v20M5 9h14M5 15h14",
  Other: "M12 8h.01M12 12h.01M12 16h.01",
};

export const SITE = {
  name: "Shongkolpo",
  tagline: "A pledge to serve, together.",
  description:
    "Shongkolpo is a community platform for discovering, creating and joining social service events across Dhaka and beyond.",
};

export const formatDate = (value, { withTime = false } = {}) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  // Event days are stored at noon UTC; formatting in UTC keeps the printed day
  // identical to the day the organiser chose, in every timezone.
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(date);
};

/**
 * Event dates are calendar days. The API stores them at noon UTC, so reading
 * the UTC components back is timezone-proof: every formatter here agrees on
 * which day an event falls on, wherever the viewer happens to be.
 */
const utcDay = (date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

/**
 * Parses a date value into a Date object or null.
 * @param {string|Date} value
 * @returns {Date|null}
 */
const parseDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "2026-03-14" for an <input type="date">. */
export const toDateInput = (value) => {
  const date = parseDate(value);
  if (!date) return "";
  return date.toISOString().slice(0, 10);
};

/** Today as "YYYY-MM-DD" in the viewer's own timezone, for the date input min. */
export const todayString = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
};

/** Inclusive day-level check so an event happening today still counts as upcoming. */
export const isUpcoming = (value) => {
  const date = parseDate(value);
  if (!date) return false;
  const today = new Date(todayString() + "T12:00:00Z");
  return utcDay(date) >= utcDay(today);
};

export const daysUntil = (value) => {
  const date = parseDate(value);
  if (!date) return null;
  const today = new Date(todayString() + "T12:00:00Z");
  return Math.round((utcDay(date) - utcDay(today)) / 86_400_000);
};

export const relativeDay = (value) => {
  const days = daysUntil(value);
  if (days === null) return "";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days > 1) return `In ${days} days`;
  if (days === -1) return "Yesterday";
  return `${Math.abs(days)} days ago`;
};
