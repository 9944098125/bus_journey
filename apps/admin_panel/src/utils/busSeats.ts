export const SEAT_SELECT_OPTIONS = [
  '25 seats',
  '50 seats',
  '15 bearths up & down',
  '25 bearths up & down',
] as const;

type SeatOption = (typeof SEAT_SELECT_OPTIONS)[number];

// Best-effort mapping for legacy buses whose total_seats was stored as a number.
function legacyNumberToLabel(n: number): string | undefined {
  if (n === 25) return '25 seats';
  if (n === 30) return '15 bearths up & down';
  if (n === 50) return '50 seats';
  return undefined;
}

/**
 * Normalise a stored total_seats value into the label used by the seat
 * dropdown. total_seats is now persisted as a string label, but we still
 * gracefully handle legacy numeric values.
 */
export function totalSeatsToSelectValue(seats: number | string): string {
  if (typeof seats === 'string') {
    const trimmed = seats.trim();

    if (SEAT_SELECT_OPTIONS.includes(trimmed as SeatOption)) {
      return trimmed;
    }

    const n = parseInt(trimmed, 10);
    if (!Number.isNaN(n) && String(n) === trimmed) {
      return legacyNumberToLabel(n) ?? trimmed;
    }

    return trimmed;
  }

  return legacyNumberToLabel(seats) ?? String(seats);
}

/**
 * The value persisted to the backend is now the label string itself, so this
 * simply returns the normalised label.
 */
export function selectValueToTotalSeats(value: string | number): string {
  return totalSeatsToSelectValue(value);
}

/**
 * Parse the real numeric seat capacity out of a total_seats label so seat math
 * (booked seats, availability, ...) can work with numbers.
 *
 * "N bearths up & down" means N berths up + N berths down, so capacity is N * 2.
 */
export function parseSeatCount(value: string | number): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const label = value.trim();
  const match = label.match(/\d+/);

  if (!match) {
    return 0;
  }

  const base = parseInt(match[0], 10);

  if (Number.isNaN(base)) {
    return 0;
  }

  if (/bearths?\s*up\s*&\s*down/i.test(label)) {
    return base * 2;
  }

  return base;
}
