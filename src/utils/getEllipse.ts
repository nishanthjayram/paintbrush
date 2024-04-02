import { TPos } from "../types";

export function* getEllipse(
  center: TPos,
  rx: number,
  ry: number,
  thickness: number = 1
): Generator<TPos> {
  const [cx, cy] = center;
  let x = 0;
  let y = ry;

  let d1 = ry * ry - rx * rx * ry + 0.25 * rx * rx;
  let dx = 2 * ry * ry * x;
  let dy = 2 * rx * rx * y;

  const halfSize = thickness <= 1 ? 0 : Math.floor(thickness / 2);

  while (dx < dy) {
    for (let dx = -halfSize; dx <= halfSize; dx++) {
      for (let dy = -halfSize; dy <= halfSize; dy++) {
        yield [cx + x + dx, cy + y + dy];
        yield [cx - x - dx, cy + y + dy];
        yield [cx + x + dx, cy - y - dy];
        yield [cx - x - dx, cy - y - dy];
      }
    }

    if (d1 < 0) {
      x++;
      dx = dx + 2 * ry * ry;
      d1 = d1 + dx + ry * ry;
    } else {
      x++;
      y--;
      dx = dx + 2 * ry * ry;
      dy = dy - 2 * rx * rx;
      d1 = d1 + dx - dy + ry * ry;
    }
  }

  let d2 =
    ry * ry * ((x + 0.5) * (x + 0.5)) +
    rx * rx * ((y - 1) * (y - 1)) -
    rx * rx * ry * ry;

  while (y >= 0) {
    for (let dx = -halfSize; dx <= halfSize; dx++) {
      for (let dy = -halfSize; dy <= halfSize; dy++) {
        yield [cx + x + dx, cy + y + dy];
        yield [cx - x - dx, cy + y + dy];
        yield [cx + x + dx, cy - y - dy];
        yield [cx - x - dx, cy - y - dy];
      }
    }

    if (d2 > 0) {
      y--;
      dy = dy - 2 * rx * rx;
      d2 = d2 + rx * rx - dy;
    } else {
      y--;
      x++;
      dx = dx + 2 * ry * ry;
      dy = dy - 2 * rx * rx;
      d2 = d2 + dx - dy + rx * rx;
    }
  }
}
