export class Pixmap {
  pixels: Uint8Array;
  width: number;
  height: number;

  constructor(width: number, height: number, backgroundColor: number = 0) {
    this.pixels = new Uint8Array(width * height).fill(backgroundColor);
    this.width = width;
    this.height = height;
  }

  setPixel(x: number, y: number, color: number) {
    const index = y * this.width + x;
    this.pixels[index] = color;
    return this;
  }

  getPixel(x: number, y: number) {
    const index = y * this.width + x;
    return this.pixels[index];
  }

  drawLine(x0_: number, y0_: number, x1_: number, y1_: number, color: number) {
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
      this.setPixel(x0, y0, color);
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
