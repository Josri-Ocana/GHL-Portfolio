export type ReturnPosition = {
  url: string;
  x: number;
  y: number;
  section?: number;
  offset?: number;
};

/** History entries can predate this enhancement; only accept matching finite snapshots. */
export function returnPosition(value: unknown, url: string): ReturnPosition | null {
  if (!value || typeof value !== "object") return null;
  const position = value as ReturnPosition;
  if (position.url !== url || !Number.isFinite(position.x) || !Number.isFinite(position.y) || position.x < 0 || position.y < 0) return null;
  if (position.section !== undefined && (!Number.isInteger(position.section) || position.section < 0 || !Number.isFinite(position.offset))) return null;
  return position;
}
