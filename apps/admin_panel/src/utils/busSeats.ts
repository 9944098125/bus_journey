const SEAT_SELECT_OPTIONS = [
  '25 seats',
  '50 seats',
  '15 bearths up & down',
  '25 bearths up & down',
] as const;

export function totalSeatsToSelectValue(seats: number | string): string {
  if (
    typeof seats === 'string' &&
    SEAT_SELECT_OPTIONS.includes(seats as (typeof SEAT_SELECT_OPTIONS)[number])
  ) {
    return seats;
  }

  const n = typeof seats === 'string' ? parseInt(seats, 10) : seats;
  if (n === 25) return '25 seats';
  if (n === 30) return '15 bearths up & down';
  if (n === 50) return '50 seats';

  return String(seats);
}

export function selectValueToTotalSeats(value: string | number): number {
  if (value === '25 seats') return 25;
  if (value === '50 seats') return 50;
  if (value === '15 bearths up & down') return 30;
  if (value === '25 bearths up & down') return 50;
  if (typeof value === 'number') return value;
  return parseInt(String(value), 10) || 40;
}
