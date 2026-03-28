/**
 * Returns a Date object representing the start of the current day (00:00:00)
 * in the America/Toronto timezone.
 *
 * This is important because the TMMIS database stores meeting dates as
 * timestamps corresponding to midnight in Toronto.
 */

const torontoDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Toronto',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

const torontoDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Toronto',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
});

export const getStartOfToday = () => {
  const now = new Date();

  // Get the current calendar date in Toronto
  const parts = torontoDateFormatter.formatToParts(now);
  const y = Number(parts.find((p) => p.type === 'year')!.value);
  const m = Number(parts.find((p) => p.type === 'month')!.value);
  const d = Number(parts.find((p) => p.type === 'day')!.value);

  // We want to find the UTC timestamp that corresponds to 00:00:00 on this day in Toronto.
  // We do this by calculating the offset between UTC and Toronto at UTC midnight of that day.
  const utcMidnight = new Date(Date.UTC(y, m - 1, d));
  const torontoParts = torontoDateTimeFormatter.formatToParts(utcMidnight);

  const ty = Number(torontoParts.find((p) => p.type === 'year')!.value);
  const tm = Number(torontoParts.find((p) => p.type === 'month')!.value);
  const td = Number(torontoParts.find((p) => p.type === 'day')!.value);
  const th = Number(torontoParts.find((p) => p.type === 'hour')!.value);
  const tmin = Number(torontoParts.find((p) => p.type === 'minute')!.value);

  // Normalize hour (some environments return 24 instead of 0)
  const hour = th === 24 ? 0 : th;

  // Calculate the offset in minutes
  let diffMinutes = hour * 60 + tmin;
  if (ty !== y || tm !== m || td !== d) {
    // If Toronto is on the previous day relative to UTC midnight, it's behind
    diffMinutes -= 24 * 60;
  }

  // Midnight Toronto = UTC Midnight - Offset
  return new Date(utcMidnight.getTime() - diffMinutes * 60000);
};
