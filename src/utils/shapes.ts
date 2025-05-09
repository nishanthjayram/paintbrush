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

  // Pre-calculate all possible offsets
  const halfSize = Math.floor(thickness / 2);
  const offsets: TPos[] = [];
  for (let dx = -halfSize; dx <= halfSize; dx++) {
    for (let dy = -halfSize; dy <= halfSize; dy++) {
      offsets.push([dx, dy]);
    }
  }

  // Apply pre-calculated offsets to each point
  for (const [x, y] of points) {
    for (const [dx, dy] of offsets) {
      yield [x + dx, y + dy];
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
  // Helper function to plot points
  function* plotPoints(x: number, y: number): Generator<TPos> {
    yield [cx + x, cy + y];
    yield [cx - x, cy + y];
    yield [cx + x, cy - y];
    yield [cx - x, cy - y];
  }

  let x = 0;
  let y = ry;

  // Pre-calculate constants
  const rx2 = rx * rx;
  const ry2 = ry * ry;
  const tworx2 = 2 * rx2;
  const twory2 = 2 * ry2;

  // First region decision parameter and increment
  let pk = ry2 - rx2 * ry + 0.25 * rx2;
  let dx = 0;
  let dy = tworx2 * y;

  while (dx < dy) {
    yield* plotPoints(x, y);

    if (pk < 0) {
      x++;
      dx += twory2;
      pk += dx + ry2;
    } else {
      x++;
      y--;
      dx += twory2;
      dy -= tworx2;
      pk += dx - dy + ry2;
    }
  }

  // Second region
  pk = ry2 * Math.pow(x + 0.5, 2) + rx2 * Math.pow(y - 1, 2) - rx2 * ry2;

  while (y >= 0) {
    yield* plotPoints(x, y);

    if (pk > 0) {
      y--;
      dy -= tworx2;
      pk += rx2 - dy;
    } else {
      x++;
      y--;
      dx += twory2;
      dy -= tworx2;
      pk += dx - dy + rx2;
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

/**
 * Generates points for a quarter circle using Bresenham's circle algorithm.
 * @param center The center position [cx, cy]
 * @param radius The radius of the quarter circle
 * @yields The points forming the quarter circle arc
 */
function* getQuarterCircle([cx, cy]: TPos, radius: number): Generator<TPos> {
  let x = radius;
  let y = 0;
  let error = 0;

  while (y <= x) {
    yield [cx + x, cy + y];
    yield [cx + y, cy + x];

    error += 2 * y + 1;
    y++;

    if (error > x) {
      error += 1 - 2 * x;
      x--;
    }
  }
}

/**
 * Generates points for a rounded rectangle.
 * @param start The top-left position [x0, y0]
 * @param end The bottom-right position [x1, y1]
 * @param radius The corner radius
 * @yields The points forming the rounded rectangle
 */
export function* getBaseRoundedRect(
  [x0, y0]: TPos,
  [x1, y1]: TPos,
  radius: number
): Generator<TPos> {
  const [xMin, xMax] = x0 < x1 ? [x0, x1] : [x1, x0];
  const [yMin, yMax] = y0 < y1 ? [y0, y1] : [y1, y0];

  // Adjust radius if too large
  const maxRadius = Math.min((xMax - xMin) / 2, (yMax - yMin) / 2);
  radius = Math.min(radius, maxRadius);

  // Use a more efficient pixel tracking system with a single number key
  const drawnPixels = new Set<number>();
  const addPixel = (x: number, y: number) => {
    // Create a unique number key using bit shifting
    const key = (x << 16) | (y & 0xffff);
    if (!drawnPixels.has(key)) {
      drawnPixels.add(key);
      return [x, y] as TPos;
    }
    return null;
  };

  // Generate the four corners
  // Top-left corner
  for (const [x, y] of getQuarterCircle(
    [xMin + radius, yMin + radius],
    radius
  )) {
    const pixel = addPixel(2 * (xMin + radius) - x, 2 * (yMin + radius) - y);
    if (pixel) yield pixel;
  }

  // Top-right corner
  for (const [x, y] of getQuarterCircle(
    [xMax - radius, yMin + radius],
    radius
  )) {
    const pixel = addPixel(x, 2 * (yMin + radius) - y);
    if (pixel) yield pixel;
  }

  // Bottom-left corner
  for (const [x, y] of getQuarterCircle(
    [xMin + radius, yMax - radius],
    radius
  )) {
    const pixel = addPixel(2 * (xMin + radius) - x, y);
    if (pixel) yield pixel;
  }

  // Bottom-right corner
  for (const [x, y] of getQuarterCircle(
    [xMax - radius, yMax - radius],
    radius
  )) {
    const pixel = addPixel(x, y);
    if (pixel) yield pixel;
  }

  // Generate straight edges (horizontal)
  for (let x = xMin + radius; x <= xMax - radius; x++) {
    const topPixel = addPixel(x, yMin);
    if (topPixel) yield topPixel;
    const bottomPixel = addPixel(x, yMax);
    if (bottomPixel) yield bottomPixel;
  }

  // Generate straight edges (vertical)
  for (let y = yMin + radius; y <= yMax - radius; y++) {
    const leftPixel = addPixel(xMin, y);
    if (leftPixel) yield leftPixel;
    const rightPixel = addPixel(xMax, y);
    if (rightPixel) yield rightPixel;
  }
}

/**
 * Generates points for a rounded rectangle with thickness.
 * @param start The top-left position [x0, y0]
 * @param end The bottom-right position [x1, y1]
 * @param radius The corner radius
 * @param thickness The thickness of the stroke
 * @yields The points forming the rounded rectangle
 */
export function* getRoundedRect(
  start: TPos,
  end: TPos,
  radius: number,
  thickness: number = 1
): Generator<TPos> {
  yield* applyThickness(getBaseRoundedRect(start, end, radius), thickness);
}
