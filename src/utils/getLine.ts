import { TPos } from "../types";

export function* getLine(
  [x0, y0]: TPos,
  [x1, y1]: TPos,
  thickness: number = 1
): Generator<TPos> {
  let x = x0;
  let y = y0;
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;

  const halfSize = thickness <= 1 ? 0 : Math.floor(thickness / 2);

  while (true) {
    for (let dx = -halfSize; dx <= halfSize; dx++) {
      for (let dy = -halfSize; dy <= halfSize; dy++) {
        yield [x + dx, y + dy];
      }
    }

    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}
