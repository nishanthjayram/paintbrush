import { PALETTE } from "./constants";
import { TColor } from "./types";

export class Pixmap {
  pixels: Uint8Array;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.pixels = new Uint8Array(width * height * 3).fill(255);
    this.width = width;
    this.height = height;
  }

  setPixel(x: number, y: number, color: TColor) {
    const index = (y * this.width + x) * 3;
    const rgb = PALETTE[color];
    this.pixels[index] = rgb[0];
    this.pixels[index + 1] = rgb[1];
    this.pixels[index + 2] = rgb[2];

    return this;
  }

  getPixel(x: number, y: number) {
    const index = (y * this.width + x) * 3;
    return [
      this.pixels[index],
      this.pixels[index + 1],
      this.pixels[index + 2],
    ] as const;
  }

  drawLine(x0_: number, y0_: number, x1_: number, y1_: number) {
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
      this.setPixel(x0, y0, "darkgreen");
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

  copy() {
    const copy = new Pixmap(this.width, this.height);
    copy.pixels.set(this.pixels);
    return copy;
  }
}
