/**
 * `total_seats` is stored as a human-readable string such as
 * "25 seats" or "15 bearths up & down". For any seat math (booked seats,
 * availability, capacity reports, ...) we parse the numeric capacity out of
 * that label here so the rest of the code can work with plain numbers.
 *
 * Note: "N bearths up & down" means N berths on the upper deck and N on the
 * lower deck, so the real capacity is N * 2.
 */
export function parseSeatCount(value: string | number | undefined | null): number {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value === "number") {
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

/**
 * Capacity stored on a journey matches the number shown in the bus seat label
 * (e.g. "25 bearths up & down" → 25), not the doubled berth total used elsewhere.
 */
export function parseJourneySeatCapacity(
  value: string | number | undefined | null
): number {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const match = value.trim().match(/\d+/);

  if (!match) {
    return 0;
  }

  const base = parseInt(match[0], 10);

  return Number.isNaN(base) ? 0 : base;
}
