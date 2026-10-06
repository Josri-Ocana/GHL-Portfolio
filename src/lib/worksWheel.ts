/** Extra scroll units after opening, without changing later card intervals. */
export const FIRST_PROJECT_HOLD = 0.65;
export const FINAL_PROJECT_HOLD = 0.35;

/** Exit before the opening card reaches the center label's reading area. */
export function wheelRingLabelOpacity(opening: number) {
  if (opening <= 0.08) return 1;
  if (opening >= 0.2) return 0;
  const progress = (opening - 0.08) / 0.12;
  return 1 - progress * progress * (3 - 2 * progress);
}

export function wheelScrollUnits(count: number) {
  return count + FIRST_PROJECT_HOLD + FINAL_PROJECT_HOLD;
}

export function wheelTurn(progress: number, count: number) {
  const travel = Math.max(0, Math.min(1, progress)) * wheelScrollUnits(count);
  if (travel <= 1) return travel;
  if (travel <= 1 + FIRST_PROJECT_HOLD) return 1;
  return Math.min(count, travel - FIRST_PROJECT_HOLD);
}

/** Select the middle of 01's hold; later cards retain their exact front angle. */
export function wheelProgress(turn: number, count: number) {
  const value = Math.max(0, Math.min(count, turn));
  const travel =
    value < 1 ? value : value + (value === 1 ? FIRST_PROJECT_HOLD / 2 : FIRST_PROJECT_HOLD);
  return travel / wheelScrollUnits(count);
}

/** 0.4/0.6 boundaries prevent midpoint noise from changing semantic selection. */
export function wheelActive(position: number, active: number, last: number) {
  let next = active;
  while (next < last && position >= next + 0.6) next++;
  while (next > 0 && position <= next - 0.6) next--;
  return next;
}
