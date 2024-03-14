import { TPos } from "./types";

export class Pixmap {
  pixels: Uint8Array;
  width: number;
  height: number;

  constructor(width: number, height: number, backgroundColor: number = 0) {
    this.pixels = new Uint8Array(width * height).fill(backgroundColor);
    this.width = width;
    this.height = height;
  }

  setPixel([x, y]: TPos, color: number) {
    const index = y * this.width + x;
    this.pixels[index] = color;
    return this;
  }

  getPixel([x, y]: TPos) {
    const index = y * this.width + x;
    return this.pixels[index];
  }

  drawLine([x0_, y0_]: TPos, [x1_, y1_]: TPos, color: number) {
    let x0 = Math.floor(x0_);
    let y0 = Math.floor(y0_);
    const x1 = Math.floor(x1_);
    const y1 = Math.floor(y1_);

    const dx = Math.abs(x1 - x0);
    const sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0);
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.setPixel([x0, y0], color);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }

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
