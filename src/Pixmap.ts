import { BitSet } from "./classes/BitSet";
import { TPos } from "./types";
import { checkPos } from "./utils/checkPos";
import { getLine } from "./utils/getLine";

export class Pixmap {
  pixels: Uint8Array;
  width: number;
  height: number;
  visited: BitSet;

  constructor(width: number, height: number, backgroundColor: number = 0) {
    this.pixels = new Uint8Array(width * height).fill(backgroundColor);
    this.width = width;
    this.height = height;
    this.visited = new BitSet(width * height);
  }

  setPixel(pos: TPos, color: number) {
    this.pixels[this.posToIndex(pos)] = color;
    return this;
  }

  getPixel(pos: TPos) {
    return this.pixels[this.posToIndex(pos)];
  }

  posToIndex([x, y]: TPos) {
    return y * this.width + x;
  }

  drawLine([x0, y0]: TPos, [x1, y1]: TPos, color: number) {
    getLine([x0, y0], [x1, y1]).forEach((pos) => this.setPixel(pos, color));
    return this;
  }

  erase([x0, y0]: TPos, [x1, y1]: TPos, color?: number) {
    getLine([x0, y0], [x1, y1]).forEach((pos) => {
      if (color === undefined || this.getPixel(pos) === color) {
        this.setPixel(pos, 0);
      }
    });
    return this;
  }

  drawRectangle([x0, y0]: TPos, [x1, y1]: TPos, borderColor: number) {
    this.drawLine([x0, y0], [x1, y0], borderColor);
    this.drawLine([x1, y0], [x1, y1], borderColor);
    this.drawLine([x1, y1], [x0, y1], borderColor);
    this.drawLine([x0, y1], [x0, y0], borderColor);

    return this;
  }

  drawFilledRectangle(
    [x0, y0]: TPos,
    [x1, y1]: TPos,
    fillColor: number,
    borderColor: number
  ) {
    this.drawRectangle([x0, y0], [x1, y1], borderColor);

    const [xMin, xMax] = x0 < x1 ? [x0, x1] : [x1, x0];
    const [yMin, yMax] = y0 < y1 ? [y0, y1] : [y1, y0];

    for (let y = yMin + 1; y < yMax; y++) {
      this.drawLine([xMin + 1, y], [xMax - 1, y], fillColor);
    }

    return this;
  }

  drawEllipse([x0, y0]: TPos, [rx, ry]: TPos, borderColor: number) {
    let [x, y] = [0, ry];

    let d1 = ry * ry - rx * rx * ry + 0.25 * rx * rx;
    let dx = 2 * ry * ry * x;
    let dy = 2 * rx * rx * y;

    while (dx < dy) {
      this.setPixel([x + x0, y + y0], borderColor);
      this.setPixel([-x + x0, y + y0], borderColor);
      this.setPixel([x + x0, -y + y0], borderColor);
      this.setPixel([-x + x0, -y + y0], borderColor);

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
      this.setPixel([x + x0, y + y0], borderColor);
      this.setPixel([-x + x0, y + y0], borderColor);
      this.setPixel([x + x0, -y + y0], borderColor);
      this.setPixel([-x + x0, -y + y0], borderColor);

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

    return this;
  }

  fill(start: TPos, fillColor: number) {
    const targetColor = this.getPixel(start);
    if (fillColor === targetColor) return this;

    const queue: TPos[] = [start];
    while (queue.length > 0) {
      const pos = queue.shift();
      if (!pos) continue;

      const [x, y] = pos;
      const index = this.posToIndex([x, y]);

      if (
        !checkPos([x, y], this.width, this.height) ||
        this.getPixel([x, y]) !== targetColor ||
        this.visited.check(index)
      ) {
        continue;
      }

      this.setPixel([x, y], fillColor);
      this.visited.set(index);

      const neighbors: TPos[] = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
        [x + 1, y + 1],
        [x - 1, y - 1],
        [x - 1, y + 1],
        [x + 1, y - 1],
      ];
      neighbors.forEach((p) => {
        const idx = this.posToIndex(p);
        if (!this.visited.check(idx)) {
          queue.push(p);
        }
      });
    }

    return this;
  }

  copy() {
    const copy = new Pixmap(this.width, this.height);
    copy.pixels.set(this.pixels);
    return copy;
  }

  clear() {
    this.pixels.fill(0);
    return this;
  }

  combinePixels(pixmap: Pixmap) {
    this.pixels.set(
      this.pixels.map((el, i) =>
        pixmap.pixels[i] !== 0 ? pixmap.pixels[i] : el
      )
    );

    return this;
  }
}
