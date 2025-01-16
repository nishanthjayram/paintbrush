import { TPos } from "../types";

/**
 * Generates a set of points with the applied thickness.
 * @param points The set of base points.
 * @param thickness The thickness of the stroke.
 * @yields The points with the applied thickness.
 */
export function* applyThickness(
  points: Generator<TPos, void, unknown>,
  thickness: number = 1
): Generator<TPos, void, unknown> {
  if (thickness <= 1) {
    yield* points;
    return;
  }
  const halfSize = Math.floor(thickness / 2);
  for (const [x, y] of points) {
    for (let dx = -halfSize; dx <= halfSize; dx++) {
      for (let dy = -halfSize; dy <= halfSize; dy++) {
        yield [x + dx, y + dy];
      }
    }
  }
}

/**
 * Generates a set of points for a base line.
 * @param {TPos} start The starting position [x0, y0].
 * @param {TPos} end The ending position [x1, y1].
 * @yields The points of the line.
 */
export function* getBaseLine([x0, y0]: TPos, [x1, y1]: TPos): Generator<TPos> {
  let x = x0;
  let y = y0;
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;

  while (true) {
    yield [x, y];
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

/**
 * Generates a set of points for a base ellipse.
 * @param {TPos} center The center position [cx, cy].
 * @param {number} rx The radius along the x-axis.
 * @param {number} ry The radius along the y-axis.
 * @yields The points of the ellipse.
 */
export function* getBaseEllipse(
  [cx, cy]: TPos,
  rx: number,
  ry: number
): Generator<TPos> {
  let x = 0;
  let y = ry;

  const rx2 = rx * rx;
  const ry2 = ry * ry;
  const tworx2 = 2 * rx2;
  const twory2 = 2 * ry2;

  let d1 = ry2 - rx2 * ry + 0.25 * rx2;
  let dx = twory2 * x;
  let dy = tworx2 * y;

  // First region
  while (dx < dy) {
    yield [cx + x, cy + y];
    yield [cx - x, cy + y];
    yield [cx + x, cy - y];
    yield [cx - x, cy - y];

    if (d1 < 0) {
      x++;
      dx += twory2;
      d1 += dx + ry2;
    } else {
      x++;
      y--;
      dx += twory2;
      dy -= tworx2;
      d1 += dx - dy + ry2;
    }
  }

  // Second region
  let d2 =
    ry2 * ((x + 0.5) * (x + 0.5)) + rx2 * ((y - 1) * (y - 1)) - rx2 * ry2;

  while (y >= 0) {
    yield [cx + x, cy + y];
    yield [cx - x, cy + y];
    yield [cx + x, cy - y];
    yield [cx - x, cy - y];

    if (d2 > 0) {
      y--;
      dy -= tworx2;
      d2 += rx2 - dy;
    } else {
      y--;
      x++;
      dx += twory2;
      dy -= tworx2;
      d2 += dx - dy + rx2;
    }
  }
}

/**
 * Generates a set of points for a line.
 * @param {TPos} start The starting position [x0, y0].
 * @param {TPos} end The ending position [x1, y1].
 * @param {number} thickness The thickness of the stroke.
 * @yields The points of the line.
 */
export function* getLine(
  start: TPos,
  end: TPos,
  thickness: number = 1
): Generator<TPos> {
  yield* applyThickness(getBaseLine(start, end), thickness);
}

/**
 * Generates a set of points for an ellipse.
 * @param {TPos} center The center position [cx, cy].
 * @param {number} rx The radius along the x-axis.
 * @param {number} ry The radius along the y-axis.
 * @param {number} thickness The thickness of the stroke.
 * @yields The points of the ellipse.
 */
export function* getEllipse(
  center: TPos,
  rx: number,
  ry: number,
  thickness: number = 1
): Generator<TPos> {
  yield* applyThickness(getBaseEllipse(center, rx, ry), thickness);
}
